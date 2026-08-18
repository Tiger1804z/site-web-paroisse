import type {
  ParishLifeFeature,
  ParishLifeHeroImage,
  ParishLifePageData,
  ParishLifeVisual,
} from '@/types/parishLife';
import type { SanityParishLifePageResult } from '@/lib/sanity/types';
// Chemin relatif, pas l'alias `@/` : ce module est chargé tel quel par
// `node --test`, qui ne connaît pas les alias de Vite.
import {
  normalizeSanityImage,
  type ImageSourceBuilder,
} from './normalizeSanityImage.ts';
import { normalizeSanitySeo } from './normalizeSanitySeo.ts';

export type { ImageSourceBuilder };

type RawPage = NonNullable<SanityParishLifePageResult>;
type RawFeature = NonNullable<RawPage['features']>[number];
type RawSlide = NonNullable<NonNullable<RawPage['hero']>['slides']>[number];

/** Seule destination possible pour les boutons de cette page. */
const CONTACT_HREF = '/contact/';

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanList(
  values: readonly (string | null)[] | null | undefined,
): readonly string[] {
  return (values ?? []).flatMap((value) => {
    const cleaned = cleanString(value);
    return cleaned ? [cleaned] : [];
  });
}

/**
 * Une image d'en-tête sans libellé ou sans fichier est écartée : le libellé
 * s'affiche par-dessus, et le carrousel n'a rien à montrer sans fichier.
 *
 * Les images d'en-tête ne se mélangent pas : soit le Studio en fournit, soit le
 * repli local prend le relais en entier. Un carrousel moitié CDN, moitié
 * fichiers du projet ne servirait personne et rendrait le débogage confus.
 */
function normalizeSlide(
  raw: RawSlide,
  buildSources: ImageSourceBuilder,
): ParishLifeHeroImage | undefined {
  const label = cleanString(raw.label);
  const image = normalizeSanityImage(raw.visual, buildSources);
  if (!label || !image) return undefined;

  return { kind: 'remote-image', label, image };
}

/**
 * Un groupe sans ancre, sans nom ou sans description est écarté : les deux
 * derniers composent la carte, l'ancre l'identifie.
 *
 * Le visuel vient d'abord du Studio. À défaut, le repli local est retrouvé par
 * l'ancre — c'est ce qui a permis de migrer les textes avant les images. Un
 * groupe sans visuel d'aucun côté n'est pas publié : sa carte serait un cadre
 * vide.
 */
function normalizeFeature(
  raw: RawFeature,
  fallbackVisuals: ReadonlyMap<string, ParishLifeVisual>,
  fallbackCtaLabel: string,
  buildSources: ImageSourceBuilder,
): ParishLifeFeature | undefined {
  const id = cleanString(raw.slug);
  const title = cleanString(raw.title);
  const summary = cleanString(raw.summary);
  if (!id || !title || !summary) return undefined;

  const uploaded = normalizeSanityImage(raw.visual, buildSources);
  const visual: ParishLifeVisual | undefined = uploaded
    ? { kind: 'remote-image', image: uploaded }
    : fallbackVisuals.get(id);
  if (!visual) return undefined;

  return {
    id,
    eyebrow: cleanString(raw.eyebrow) ?? 'Groupe',
    title,
    summary,
    highlights: cleanList(raw.highlights),
    visual,
    cta: {
      label: cleanString(raw.ctaLabel) ?? fallbackCtaLabel,
      href: CONTACT_HREF,
    },
    active: raw.active !== false,
  };
}

/**
 * Fusionne le contenu Sanity avec le repli local.
 *
 * Comme pour la page Nos services, deux choses ne viennent jamais de Sanity :
 * les images — celles du hero comme celles des groupes, rattachées par l'ancre —
 * et l'adresse des boutons, qui mènent tous à la page Contact. Seul leur libellé
 * se saisit.
 */
export function normalizeSanityParishLifePage(
  raw: SanityParishLifePageResult,
  fallback: ParishLifePageData,
  buildSources: ImageSourceBuilder,
): ParishLifePageData {
  const fallbackVisuals = new Map(
    fallback.features.map((feature) => [feature.id, feature.visual] as const),
  );
  const fallbackCtaLabel =
    fallback.features[0]?.cta.label ?? 'Demander de l’information';

  const features = (raw?.features ?? []).flatMap((feature) => {
    const normalized = normalizeFeature(
      feature,
      fallbackVisuals,
      fallbackCtaLabel,
      buildSources,
    );
    return normalized ? [normalized] : [];
  });

  const slides = (raw?.hero?.slides ?? []).flatMap((slide) => {
    const normalized = normalizeSlide(slide, buildSources);
    return normalized ? [normalized] : [];
  });

  const paragraphs = cleanList(raw?.introduction?.paragraphs);

  return {
    seo: normalizeSanitySeo(raw?.seo, fallback.seo, buildSources),
    hero: {
      eyebrow: cleanString(raw?.hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: cleanString(raw?.hero?.title) ?? fallback.hero.title,
      introduction:
        cleanString(raw?.hero?.introduction) ?? fallback.hero.introduction,
      images: slides.length > 0 ? slides : fallback.hero.images,
    },
    introduction: {
      eyebrow:
        cleanString(raw?.introduction?.eyebrow) ??
        fallback.introduction.eyebrow,
      title:
        cleanString(raw?.introduction?.title) ?? fallback.introduction.title,
      paragraphs:
        paragraphs.length > 0 ? paragraphs : fallback.introduction.paragraphs,
      confirmationNote:
        cleanString(raw?.introduction?.confirmationNote) ??
        fallback.introduction.confirmationNote,
    },
    features: features.length > 0 ? features : fallback.features,
    participation: {
      accent:
        cleanString(raw?.participation?.accent) ??
        fallback.participation.accent,
      title:
        cleanString(raw?.participation?.title) ?? fallback.participation.title,
      description:
        cleanString(raw?.participation?.description) ??
        fallback.participation.description,
      cta: {
        label:
          cleanString(raw?.participation?.ctaLabel) ??
          fallback.participation.cta.label,
        href: CONTACT_HREF,
      },
    },
  };
}
