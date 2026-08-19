import { loadQuery } from '@/lib/sanity/preview';
import { buildImageSources } from '@/lib/sanity/image';
import { parishLifePageData } from '@/data/parishLife';
import { PARISH_LIFE_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanityParishLifePageResult } from '@/lib/sanity/types';
import { normalizeSanityParishLifePage } from '@/lib/content/normalizeSanityParishLifePage';
import type { ParishLifePageData } from '@/types/parishLife';

async function fetchParishLifePageRaw(): Promise<SanityParishLifePageResult> {
  try {
    return await loadQuery(PARISH_LIFE_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getParishLifePageData] Échec du fetch Sanity — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * Le tri par `order` a disparu avec le champ : l'ordre du tableau fait foi, dans
 * le Studio comme dans le repli local. Le filtre sur `active` reste — c'est lui
 * qui permet de masquer un groupe sans le supprimer.
 */
export async function getParishLifePageData(): Promise<ParishLifePageData> {
  const raw = await fetchParishLifePageRaw();
  const page = normalizeSanityParishLifePage(
    raw,
    parishLifePageData,
    buildImageSources,
  );

  return {
    ...page,
    features: page.features.filter(({ active }) => active),
  };
}
