import { loadQuery } from '@/lib/sanity/preview';
import { homePageData } from '@/data/homePage';
import { buildRemoteImageSources } from '@/lib/sanity/image';
import { HOME_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanityHomePageResult } from '@/lib/sanity/types';
import { getParishLifePageData } from '@/lib/content/getParishLifePageData';
import { normalizeSanityHomeGallery } from '@/lib/content/normalizeSanityHomeGallery';
import { normalizeSanityImage } from '@/lib/content/normalizeSanityImage';
import {
  normalizeSanityHomePage,
  type ParishGroupNames,
} from '@/lib/content/normalizeSanityHomePage';
import { selectHomepageGalleryItems } from '@/lib/gallery/gallery';
import type { HomePageData } from '@/types/homePage';

/**
 * Garde-fou, pas réglage éditorial : l'ordre et le nombre de photographies se
 * décident dans la liste du Studio, plafonnée au même chiffre par le schéma.
 */
const GALLERY_LIMIT = 12;

export async function fetchHomePageRaw(): Promise<SanityHomePageResult> {
  try {
    return await loadQuery(HOME_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getHomePageData] Échec du fetch Sanity — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * Les textes de l'accueil, Sanity par-dessus le repli local.
 *
 * Le repli n'est pas une politesse : l'accueil est la première page du site, et
 * la perdre entière parce qu'une requête a échoué serait pire que d'afficher
 * les textes d'hier. Les photographies, elles, n'ont pas de repli — elles
 * n'existent que dans le Studio.
 */
export async function getHomePageData(): Promise<HomePageData> {
  const [raw, parishLife] = await Promise.all([
    fetchHomePageRaw(),
    // Les noms des groupes viennent de là où les groupes vivent. Le getter
    // filtre déjà les groupes désactivés : un groupe retiré de la page Vie
    // paroissiale quitte l'accueil du même geste.
    getParishLifePageData(),
  ]);

  const groupNames: ParishGroupNames = Object.fromEntries(
    parishLife.features.map(({ id, title }) => [id, title]),
  );

  const page = normalizeSanityHomePage(raw, homePageData, groupNames);

  const buildSources = (source: unknown) =>
    buildRemoteImageSources(
      source as Parameters<typeof buildRemoteImageSources>[0],
    );

  const candidates = normalizeSanityHomeGallery(
    raw?.gallery?.photos,
    buildSources,
  );

  // Les illustrations de section sont composées ici, comme les photographies du
  // carrousel : elles demandent le constructeur d'adresses du CDN, que le
  // normalizer n'a pas. Une section sans illustration reste une section
  // complète — c'est le composant qui décide de ne pas dessiner son cadre.
  const sectionImage = (source: unknown) => {
    const image = normalizeSanityImage(
      source as Parameters<typeof normalizeSanityImage>[0],
      buildSources,
    );
    return image ? { image } : {};
  };

  return {
    ...page,
    parishLife: { ...page.parishLife, ...sectionImage(raw?.parishLife?.image) },
    services: { ...page.services, ...sectionImage(raw?.services?.image) },
    interlude: { ...page.interlude, ...sectionImage(raw?.interlude?.image) },
    visit: { ...page.visit, ...sectionImage(raw?.visit?.image) },
    gallery: {
      ...page.gallery,
      items: selectHomepageGalleryItems(candidates, GALLERY_LIMIT),
    },
  };
}
