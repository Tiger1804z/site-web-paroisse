import { sanityClient } from 'sanity:client';
import {
  eventsPageSettings,
  homepageEventsSettings,
} from '@/data/parish-events';
import { PARISH_EVENTS_QUERY } from '@/lib/sanity/queries';
import { buildRemoteImageSources } from '@/lib/sanity/image';
import { normalizeSanityParishEvents } from '@/lib/content/normalizeSanityParishEvents';
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
    const raw = await sanityClient.fetch(PARISH_EVENTS_QUERY);
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

export async function getUpcomingParishEvents(
  now: Date,
): Promise<readonly ParishEventWithTemporalStatus[]> {
  const events = await getParishEventSource();
  return selectUpcomingParishEvents(
    events,
    now,
    eventsPageSettings.upcomingLimit,
  );
}

export async function getPastParishEvents(
  now: Date,
): Promise<readonly ParishEventWithTemporalStatus[]> {
  const events = await getParishEventSource();
  return selectPastParishEvents(events, now, eventsPageSettings.pastLimit);
}

export async function getHomepageParishEvents(
  now: Date,
  limit: number = homepageEventsSettings.homepageUpcomingLimit,
): Promise<HomepageUpcomingEvents> {
  const events = await getParishEventSource();
  return selectHomepageParishEvents(events, now, limit);
}

export async function getEventsPageSettings(): Promise<EventsPageSettings> {
  return eventsPageSettings;
}

export async function getHomepageEventsSettings(): Promise<HomepageEventsSettings> {
  return homepageEventsSettings;
}
