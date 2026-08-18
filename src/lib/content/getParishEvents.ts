import { loadQuery } from '@/lib/sanity/preview';
import {
  eventsPageSettings,
  homepageEventsSettings,
} from '@/data/parish-events';
import { HOME_PAGE_QUERY, PARISH_EVENTS_QUERY } from '@/lib/sanity/queries';
import { buildRemoteImageSources } from '@/lib/sanity/image';
import { normalizeSanityParishEvents } from '@/lib/content/normalizeSanityParishEvents';
import { fetchEventsPageRaw } from '@/lib/content/getEventsPageData';
import {
  normalizeSanityEventsPageSettings,
  normalizeSanityHomePageEvents,
} from '@/lib/content/normalizeSanityEventsPage';
import {
  selectHomepageParishEvents,
  selectPastParishEvents,
  selectUpcomingParishEvents,
} from '@/lib/events/parish-events';
import type {
  EventsPageSettings,
  HomepageEventsSettings,
  HomepageUpcomingEvents,
  ParishEvent,
  ParishEventWithTemporalStatus,
} from '@/types/parish-events';

/**
 * Source unique des événements : la collection Sanity.
 *
 * Aucun repli local — un événement inventé n'aurait aucun sens. Si le fetch
 * échoue, les sections concernées restent vides et le reste des pages continue
 * de s'afficher.
 */
async function getParishEventSource(): Promise<readonly ParishEvent[]> {
  try {
    const raw = await loadQuery(PARISH_EVENTS_QUERY);
    return normalizeSanityParishEvents(raw, (source) =>
      buildRemoteImageSources(
        source as Parameters<typeof buildRemoteImageSources>[0],
      ),
    );
  } catch (error) {
    console.error(
      '[getParishEvents] Échec du fetch Sanity — aucune activité affichée.',
      error,
    );
    return [];
  }
}

export async function getEventsPageSettings(): Promise<EventsPageSettings> {
  const raw = await fetchEventsPageRaw();
  return normalizeSanityEventsPageSettings(raw, eventsPageSettings);
}

export async function getHomepageEventsSettings(): Promise<HomepageEventsSettings> {
  try {
    const raw = await loadQuery(HOME_PAGE_QUERY);
    return normalizeSanityHomePageEvents(raw, homepageEventsSettings);
  } catch (error) {
    console.error(
      '[getHomepageEventsSettings] Échec du fetch Sanity — réglages locaux.',
      error,
    );
    return homepageEventsSettings;
  }
}

export async function getUpcomingParishEvents(
  now: Date,
): Promise<readonly ParishEventWithTemporalStatus[]> {
  const [events, settings] = await Promise.all([
    getParishEventSource(),
    getEventsPageSettings(),
  ]);

  return selectUpcomingParishEvents(events, now, settings.upcomingLimit);
}

export async function getPastParishEvents(
  now: Date,
): Promise<readonly ParishEventWithTemporalStatus[]> {
  const [events, settings] = await Promise.all([
    getParishEventSource(),
    getEventsPageSettings(),
  ]);

  return selectPastParishEvents(events, now, settings.pastLimit);
}

export async function getHomepageParishEvents(
  now: Date,
  limit?: number,
): Promise<HomepageUpcomingEvents> {
  const [events, settings] = await Promise.all([
    getParishEventSource(),
    getHomepageEventsSettings(),
  ]);

  return selectHomepageParishEvents(
    events,
    now,
    limit ?? settings.homepageUpcomingLimit,
  );
}
