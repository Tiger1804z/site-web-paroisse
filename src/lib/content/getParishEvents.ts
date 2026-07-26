import {
  eventsPageSettings,
  homepageEventsSettings,
  parishEvents,
} from '@/data/parish-events';
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

async function getParishEventSource(): Promise<readonly ParishEvent[]> {
  return parishEvents;
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
