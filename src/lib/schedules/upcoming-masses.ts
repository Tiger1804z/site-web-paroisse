import type { UpcomingMass, WeeklyMassEntry } from '@/types/schedule';
import {
  formatTimeLabel,
  parseTimeToMinutes,
  SCHEDULE_TIME_ZONE,
  WEEKDAY_INDEXES,
  WEEKDAY_LABELS,
} from './schedule-format.ts';

const MINUTES_PER_DAY = 24 * 60;

// Valeur possiblement absente : la clé vient d'un formateur, pas d'une union.
const ENGLISH_WEEKDAY_INDEXES: Readonly<Record<string, number | undefined>> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

// Un formateur par fuseau : `Intl.DateTimeFormat` est coûteux à construire et
// le fuseau est en pratique toujours celui de la paroisse.
const ZONED_FORMATTERS = new Map<string, Intl.DateTimeFormat>();

function getZonedFormatter(timeZone: string): Intl.DateTimeFormat {
  const cached = ZONED_FORMATTERS.get(timeZone);
  if (cached) return cached;

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  });
  ZONED_FORMATTERS.set(timeZone, formatter);

  return formatter;
}

export interface ZonedNow {
  /** Index aligné sur `Date#getDay` : dimanche = 0. */
  readonly weekdayIndex: number;
  /** Minutes écoulées depuis minuit, dans le fuseau demandé. */
  readonly minutes: number;
}

/**
 * Position d'un instant dans la semaine civile du fuseau demandé.
 *
 * Passe par `formatToParts` plutôt que par les getters de `Date` : le visiteur
 * peut être dans un autre fuseau que la paroisse, et c'est l'heure locale de
 * la paroisse qui décide de la prochaine messe.
 */
export function getZonedNow(
  now: Date,
  timeZone: string = SCHEDULE_TIME_ZONE,
): ZonedNow {
  const parts = getZonedFormatter(timeZone).formatToParts(now);
  const read = (type: Intl.DateTimeFormatPartTypes): string =>
    parts.find((part) => part.type === type)?.value ?? '';

  const weekdayIndex = ENGLISH_WEEKDAY_INDEXES[read('weekday')];
  const hours = Number(read('hour'));
  const minutes = Number(read('minute'));

  if (
    weekdayIndex === undefined ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    throw new TypeError(`Instant illisible dans le fuseau ${timeZone}.`);
  }

  return {
    weekdayIndex,
    // `hourCycle: 'h23'` rend minuit à `00`, jamais `24`.
    minutes: (hours % 24) * 60 + minutes,
  };
}

interface Delay {
  readonly dayOffset: number;
  readonly minutesUntil: number;
}

/**
 * Délai jusqu'à la prochaine occurrence, en minutes civiles.
 *
 * Le calcul reste en minutes du calendrier local (jour + heure de la semaine),
 * jamais en millisecondes ajoutées à un instant : c'est ce qui le rend immunisé
 * au passage à l'heure d'été, où un jour ne fait pas 24 h.
 */
function getDelay(entry: WeeklyMassEntry, now: ZonedNow): Delay | undefined {
  const entryMinutes = parseTimeToMinutes(entry.time);
  // Annotation explicite : ces données transitent par du JSON côté client, où
  // un jour inconnu est possible même si le type l'exclut à la compilation.
  const entryWeekdayIndex: number | undefined = WEEKDAY_INDEXES[entry.weekday];

  if (entryMinutes === undefined || entryWeekdayIndex === undefined) {
    return undefined;
  }

  let dayOffset = (entryWeekdayIndex - now.weekdayIndex + 7) % 7;

  // Une célébration déjà passée aujourd'hui bascule à la semaine suivante ;
  // celle qui commence à la minute même compte encore comme à venir.
  if (dayOffset === 0 && entryMinutes < now.minutes) {
    dayOffset = 7;
  }

  return {
    dayOffset,
    minutesUntil: dayOffset * MINUTES_PER_DAY + entryMinutes - now.minutes,
  };
}

function toUpcomingMass(entry: WeeklyMassEntry, delay: Delay): UpcomingMass {
  const dayLabel = WEEKDAY_LABELS[entry.weekday];
  const relativeDayLabel =
    delay.dayOffset === 0
      ? 'Aujourd’hui'
      : delay.dayOffset === 1
        ? 'Demain'
        : dayLabel;

  return {
    ...entry,
    dayOffset: delay.dayOffset,
    dayLabel,
    relativeDayLabel,
    timeLabel: formatTimeLabel(entry.time) ?? entry.time,
  };
}

/**
 * Célébrations à venir, de la plus proche à la plus lointaine.
 *
 * Fonction pure : aucun accès à `Date.now()`, à Sanity ni au DOM. `now` et
 * `timeZone` sont fournis par l'appelant, ce qui rend chaque cas limite
 * (bascule dimanche→lundi, heure déjà passée, heure d'été) testable.
 *
 * Une liste vide en entrée donne une liste vide en sortie : aucun horaire n'est
 * inventé quand Sanity n'en publie pas.
 */
export function getUpcomingMasses(
  now: Date,
  timeZone: string,
  entries: readonly WeeklyMassEntry[],
  limit = 3,
): UpcomingMass[] {
  if (entries.length === 0 || limit <= 0) return [];

  const zonedNow = getZonedNow(now, timeZone);

  return entries
    .map((entry, index) => ({ entry, index, delay: getDelay(entry, zonedNow) }))
    .filter(
      (
        candidate,
      ): candidate is { entry: WeeklyMassEntry; index: number; delay: Delay } =>
        candidate.delay !== undefined,
    )
    .sort(
      (first, second) =>
        first.delay.minutesUntil - second.delay.minutesUntil ||
        first.index - second.index,
    )
    .slice(0, limit)
    .map((candidate) => toUpcomingMass(candidate.entry, candidate.delay));
}
