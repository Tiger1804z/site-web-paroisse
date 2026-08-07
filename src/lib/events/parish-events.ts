import type {
  HomepageUpcomingEvents,
  ParishEvent,
  ParishEventCategory,
  ParishEventTemporalStatus,
  ParishEventWithTemporalStatus,
} from '@/types/parish-events';

const CATEGORY_LABELS: Readonly<Record<ParishEventCategory, string>> = {
  pilgrimage: 'Pèlerinage',
  liturgy: 'Célébration',
  concert: 'Concert',
  'community-meal': 'Vie communautaire',
  family: 'Familles',
  'mutual-aid': 'Entraide',
  conference: 'Rencontre',
  other: 'Événement',
};

const DATE_FORMATTER = new Intl.DateTimeFormat('fr-CA', {
  timeZone: 'America/Toronto',
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const TIME_FORMATTER = new Intl.DateTimeFormat('fr-CA', {
  timeZone: 'America/Toronto',
  hour: 'numeric',
  minute: '2-digit',
  hourCycle: 'h23',
});

const PRICE_FORMATTER = new Intl.NumberFormat('fr-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
});

function toTimestamp(value: string | Date): number {
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);

  if (Number.isNaN(timestamp)) {
    throw new TypeError(`Date d’événement invalide : ${String(value)}`);
  }

  return timestamp;
}

function chronologicalComparison(
  first: ParishEventWithTemporalStatus,
  second: ParishEventWithTemporalStatus,
): number {
  const statusDifference =
    Number(first.temporalStatus !== 'ongoing') -
    Number(second.temporalStatus !== 'ongoing');

  return (
    statusDifference || toTimestamp(first.startAt) - toTimestamp(second.startAt)
  );
}

export function getParishEventTemporalStatus(
  event: Pick<ParishEvent, 'startAt' | 'endAt'>,
  now: Date,
): ParishEventTemporalStatus {
  const nowTimestamp = toTimestamp(now);
  const startTimestamp = toTimestamp(event.startAt);

  if (startTimestamp > nowTimestamp) {
    return 'upcoming';
  }

  if (event.endAt) {
    return toTimestamp(event.endAt) >= nowTimestamp ? 'ongoing' : 'past';
  }

  return startTimestamp === nowTimestamp ? 'ongoing' : 'past';
}

function withParishEventTemporalStatus(
  event: ParishEvent,
  now: Date,
): ParishEventWithTemporalStatus {
  return {
    ...event,
    temporalStatus: getParishEventTemporalStatus(event, now),
  };
}

function isPublicParishEvent(event: ParishEvent): boolean {
  return (
    event.showOnWebsite &&
    (event.publicationStatus === 'published' ||
      event.publicationStatus === 'cancelled')
  );
}

export function selectUpcomingParishEvents(
  events: readonly ParishEvent[],
  now: Date,
  limit?: number,
): ParishEventWithTemporalStatus[] {
  const selected = events
    .filter(isPublicParishEvent)
    .map((event) => withParishEventTemporalStatus(event, now))
    .filter(({ temporalStatus }) => temporalStatus !== 'past')
    .sort(chronologicalComparison);

  return typeof limit === 'number' ? selected.slice(0, limit) : selected;
}

export function selectPastParishEvents(
  events: readonly ParishEvent[],
  now: Date,
  limit?: number,
): ParishEventWithTemporalStatus[] {
  const selected = events
    .filter((event) => isPublicParishEvent(event) && event.showInArchive)
    .map((event) => withParishEventTemporalStatus(event, now))
    .filter(({ temporalStatus }) => temporalStatus === 'past')
    .sort(
      (first, second) =>
        toTimestamp(second.startAt) - toTimestamp(first.startAt),
    );

  return typeof limit === 'number' ? selected.slice(0, limit) : selected;
}

export function selectHomepageParishEvents(
  events: readonly ParishEvent[],
  now: Date,
  limit = 4,
): HomepageUpcomingEvents {
  if (limit < 1) {
    return { secondary: [] };
  }

  const eligible = events
    .filter(
      (event) =>
        event.publicationStatus === 'published' &&
        event.showOnWebsite &&
        event.showOnHomepage,
    )
    .map((event) => withParishEventTemporalStatus(event, now))
    .filter(({ temporalStatus }) => temporalStatus !== 'past')
    .sort(chronologicalComparison);

  const featured =
    eligible
      .filter((event) => event.featured)
      .sort((first, second) => {
        const chronological = chronologicalComparison(first, second);

        return (
          chronological ||
          (first.homepagePriority ?? Number.MAX_SAFE_INTEGER) -
            (second.homepagePriority ?? Number.MAX_SAFE_INTEGER)
        );
      })[0] ?? eligible[0];

  if (!featured) {
    return { secondary: [] };
  }

  return {
    featured,
    secondary: eligible
      .filter(({ id }) => id !== featured.id)
      .sort(chronologicalComparison)
      .slice(0, limit - 1),
  };
}

export function getParishEventCategoryLabel(
  category: ParishEventCategory,
): string {
  return CATEGORY_LABELS[category];
}

export function formatParishEventDate(value: string): string {
  return DATE_FORMATTER.format(new Date(toTimestamp(value)));
}

export function formatParishEventTime(value: string): string {
  const parts = TIME_FORMATTER.formatToParts(new Date(toTimestamp(value)));
  const hour = parts.find(({ type }) => type === 'hour')?.value;
  const minute = parts.find(({ type }) => type === 'minute')?.value;

  if (!hour || !minute) {
    return TIME_FORMATTER.format(new Date(toTimestamp(value)));
  }

  return minute === '00' ? `${hour} h` : `${hour} h ${minute}`;
}

export function formatParishEventPrice(
  price: NonNullable<ParishEvent['price']>,
): string {
  const formattedAmount = PRICE_FORMATTER.format(price.amount);
  return price.label ? `${formattedAmount} ${price.label}` : formattedAmount;
}
