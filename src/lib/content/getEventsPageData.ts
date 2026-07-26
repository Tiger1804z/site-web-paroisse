import { eventsPageData } from '@/data/events';
import type { EventsPageData } from '@/types/events';

export async function getEventsPageData(): Promise<EventsPageData> {
  return {
    ...eventsPageData,
    categories: eventsPageData.categories.filter(({ active }) => active),
  };
}
