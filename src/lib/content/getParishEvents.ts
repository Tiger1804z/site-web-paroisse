import { loadQuery } from '@/lib/sanity/preview';
import {
  eventsPageSettings,
  homepageEventsSettings,
} from '@/data/parish-events';
import { HOME_PAGE_QUERY, PARISH_EVENTS_QUERY } from '@/lib/sanity/queries';
import { buildImageSources } from '@/lib/sanity/image';
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
import { selectSpecialCelebrations } from '@/lib/schedules/special-celebrations';
import type {
  EventsPageSettings,
  HomepageEventsSettings,
  HomepageUpcomingEvents,
  ParishEvent,
  ParishEventWithTemporalStatus,
} from '@/types/parish-events';
import type { SpecialCelebration } from '@/types/schedule';

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
    return normalizeSanityParishEvents(raw, buildImageSources);
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

/**
 * Les célébrations datées affichées par `/horaires`.
 *
 * Aucun réglage propre à la page Horaires : la limite d'affichage des
 * activités appartient à `/evenements/` et n'a pas à décider ce que voit
 * quelqu'un qui cherche l'heure d'une messe.
 */
export async function getSpecialCelebrations(
  now: Date,
): Promise<readonly SpecialCelebration[]> {
  const events = await getParishEventSource();
  return selectSpecialCelebrations(events, now);
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
