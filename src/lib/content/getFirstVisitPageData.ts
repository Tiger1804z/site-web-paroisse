import { loadQuery } from '@/lib/sanity/preview';
import { buildImageSources } from '@/lib/sanity/image';
import { firstVisitPageData } from '@/data/firstVisit';
import { FIRST_VISIT_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanityFirstVisitPageResult } from '@/lib/sanity/types';
import { normalizeSanityFirstVisitPage } from '@/lib/content/normalizeSanityFirstVisitPage';
import { getSiteSettings } from '@/lib/content/getSiteSettings';
import { resolvePracticalInformation } from '@/lib/content/resolvePracticalInformation';
import type { FirstVisitPageData } from '@/types/firstVisit';

async function fetchFirstVisitPageRaw(): Promise<SanityFirstVisitPageResult> {
  try {
    return await loadQuery(FIRST_VISIT_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getFirstVisitPageData] Échec du fetch Sanity — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * Agrège les deux sources de la page `/premiere-visite` :
 *
 * - `firstVisitPage` — le contenu propre à cette page;
 * - `siteSettings` — l'adresse, le téléphone, le stationnement et
 *   l'accessibilité, qui sont des faits sur le lieu et non du contenu de page.
 *
 * Deux lectures indépendantes, recomposées ici : aucune référence Sanity entre
 * les documents. La résolution des lignes s'applique aussi bien au contenu
 * Sanity qu'au repli local, puisque les deux décrivent leurs lignes de la même
 * façon — ce qui vaut au repli de se comporter comme la vraie page.
 */
export async function getFirstVisitPageData(): Promise<FirstVisitPageData> {
  const [raw, siteSettings] = await Promise.all([
    fetchFirstVisitPageRaw(),
    getSiteSettings(),
  ]);

  const page = normalizeSanityFirstVisitPage(
    raw,
    firstVisitPageData,
    buildImageSources,
  );

  return {
    ...page,
    practicalInformation: resolvePracticalInformation(
      page.practicalInformation,
      siteSettings,
    ),
  };
}
