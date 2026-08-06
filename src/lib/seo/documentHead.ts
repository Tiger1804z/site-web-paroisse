import type { PageSeo } from '@/types/seo';
import type { SanityRenderableImage } from '@/types/sanityImage';

/**
 * Tout ce que le `<head>` d'une page contient de référencement, calculé
 * d'avance.
 *
 * Le calcul vit ici, et non dans `BaseLayout.astro`, pour une raison simple :
 * un fichier `.astro` ne se teste pas sous `node --test`, et les règles de
 * repli — quel titre quand Sanity n'en donne pas, quelle image quand la page
 * n'en a pas — sont exactement ce qu'un test doit pouvoir vérifier. Le layout
 * ne fait plus qu'écrire des balises.
 *
 * Ce module ne lit ni l'environnement ni le réseau : tout lui est passé. C'est
 * ce qui le rend importable tel quel par les tests.
 */

export type TitleOrder = 'page-first' | 'site-first';

export interface DocumentHeadInput {
  /** Référencement de la page, déjà composé par son normalizer. */
  readonly seo: PageSeo;
  /** Nom officiel de la paroisse, tel qu'il apparaît dans le titre. */
  readonly siteName: string;
  /** Origine publique, sans barre oblique finale. */
  readonly siteUrl: string;
  /** Chemin réellement servi, quand la page n'impose pas de canonique. */
  readonly pathname: string;
  /** Image de partage générale, servie aux pages qui n'ont pas la leur. */
  readonly siteShareImage?: SanityRenderableImage;
  readonly titleOrder?: TitleOrder;
  /**
   * Prévisualisation éditoriale active. Toutes les pages sont alors interdites
   * d'indexation : elles montrent des brouillons, qui n'ont rien à faire dans
   * un moteur de recherche même si l'environnement fuit.
   */
  readonly previewing?: boolean;
}

export interface ShareImage {
  readonly url: string;
  readonly alt: string;
}

export interface DocumentHead {
  /** Contenu de `<title>`, nom de la paroisse compris. */
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
  /** Contenu de `<meta name="robots">`; absent quand la page est indexable. */
  readonly robots?: string;
  readonly openGraph: {
    readonly type: 'website';
    readonly title: string;
    readonly description: string;
    readonly url: string;
    readonly siteName: string;
    readonly locale: 'fr_CA';
    readonly image?: ShareImage;
  };
  /** Grande vignette seulement s'il y a une image à y mettre. */
  readonly twitterCard: 'summary' | 'summary_large_image';
}

/**
 * Dernier recours, quand une page n'a ni description de Sanity ni description
 * locale. Aucune page du site n'est dans ce cas : le contrat `PageSeo` impose
 * les deux champs et le normalizer garantit un repli non vide. La constante
 * existe pour que le jour où une page neuve arrive sans texte, le `<head>`
 * reste valide au lieu de porter une description vide.
 */
const LAST_RESORT_DESCRIPTION = 'Site Web de la Paroisse Saint-René-Goupil.';

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Ramène un chemin à la forme que le site sert réellement : une barre au
 * début, une barre à la fin.
 *
 * Astro produit des dossiers (`contact/index.html`), donc l'adresse servie est
 * `/contact/`. Une canonique écrite `/contact` désignerait une autre adresse
 * aux yeux de Google — et c'est le genre d'écart qui divise une page en deux
 * dans l'index. Une seule fonction décide, ici, pour les canoniques comme pour
 * le plan de site de l'étape suivante.
 */
export function normalizeRoutePath(pathname: string): string {
  const trimmed = pathname.trim();
  const withoutIndex = trimmed.replace(/index\.html?$/i, '');
  const withLeadingSlash = withoutIndex.startsWith('/')
    ? withoutIndex
    : `/${withoutIndex}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, '/');

  return collapsed.endsWith('/') ? collapsed : `${collapsed}/`;
}

/** Compose une adresse absolue à partir de l'origine et d'un chemin. */
export function absoluteUrl(siteUrl: string, pathname: string): string {
  return `${siteUrl.replace(/\/$/, '')}${normalizeRoutePath(pathname)}`;
}

/**
 * Rend absolue l'adresse d'une image de partage.
 *
 * Les images de Sanity sortent déjà du CDN avec une adresse complète; la
 * fonction couvre le cas où une image viendrait un jour d'ailleurs. Une
 * `og:image` relative n'est simplement pas récupérée par les réseaux.
 */
function absoluteImageUrl(siteUrl: string, src: string): string | undefined {
  if (/^https?:\/\//i.test(src)) return src;

  const path = cleanString(src);
  if (!path) return undefined;

  return `${siteUrl.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Choisit l'image de partage : celle de la page, sinon celle du site, sinon
 * aucune.
 *
 * Jamais d'image de remplissage. Un partage sans image vaut mieux qu'un
 * partage illustré par une photo qui n'a rien à voir avec la page.
 */
function resolveShareImage(
  siteUrl: string,
  pageImage: SanityRenderableImage | undefined,
  siteImage: SanityRenderableImage | undefined,
): ShareImage | undefined {
  const image = pageImage ?? siteImage;
  if (!image) return undefined;

  const url = absoluteImageUrl(siteUrl, image.src);
  if (!url) return undefined;

  return { url, alt: image.alt };
}

/**
 * Compose le titre du document.
 *
 * Le nom de la paroisse suit le titre de la page, sauf sur l'accueil où il
 * passe devant — c'est le nom qu'on veut lire en premier dans un onglet ou un
 * résultat de recherche. Une page dont le titre est déjà le nom de la paroisse
 * ne le répète pas.
 */
function composeTitle(
  pageTitle: string,
  siteName: string,
  order: TitleOrder,
): string {
  if (pageTitle === siteName) return pageTitle;

  return order === 'site-first'
    ? `${siteName} | ${pageTitle}`
    : `${pageTitle} | ${siteName}`;
}

export function buildDocumentHead({
  seo,
  siteName,
  siteUrl,
  pathname,
  siteShareImage,
  titleOrder = 'page-first',
  previewing = false,
}: DocumentHeadInput): DocumentHead {
  const pageTitle = cleanString(seo.title) ?? siteName;
  const title = composeTitle(pageTitle, siteName, titleOrder);
  const description = cleanString(seo.description) ?? LAST_RESORT_DESCRIPTION;

  // Une canonique explicite l'emporte : c'est ainsi que les trois anciennes
  // adresses renvoient leur autorité à la page qui les remplace. Sans elle, la
  // page se déclare canonique d'elle-même, ce qui est le cas courant.
  const canonicalUrl = absoluteUrl(siteUrl, seo.canonicalPath ?? pathname);

  const image = resolveShareImage(siteUrl, seo.shareImage, siteShareImage);

  return {
    title,
    description,
    canonicalUrl,
    ...(seo.noIndex || previewing ? { robots: 'noindex, nofollow' } : {}),
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonicalUrl,
      siteName,
      locale: 'fr_CA',
      ...(image ? { image } : {}),
    },
    twitterCard: image ? 'summary_large_image' : 'summary',
  };
}
