import { loadQuery } from '@/lib/sanity/preview';
import { eventsPageData } from '@/data/events';
import type { EventsPageData } from '@/types/events';
import { EVENTS_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanityEventsPageResult } from '@/lib/sanity/types';
import { buildImageSources } from '@/lib/sanity/image';
import { normalizeSanityEventsPage } from '@/lib/content/normalizeSanityEventsPage';

/**
 * Contenu de `/evenements` : le décor de la page et ses catégories permanentes.
 *
 * Les activités datées viennent d'ailleurs — `getParishEvents` lit la
 * collection, que l'accueil consomme aussi.
 */
export async function fetchEventsPageRaw(): Promise<SanityEventsPageResult> {
  try {
    return await loadQuery(EVENTS_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getEventsPageData] Échec du fetch Sanity — utilisation du repli local.',
      error,
    );
    return null;
  }
}

export async function getEventsPageData(): Promise<EventsPageData> {
  const raw = await fetchEventsPageRaw();
  const page = normalizeSanityEventsPage(
    raw,
    eventsPageData,
    buildImageSources,
  );

  return {
    ...page,
    categories: page.categories.filter(({ active }) => active),
  };
}
