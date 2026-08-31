import type { ScheduleWeekday } from '@/types/schedule';
// Import relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout ni l'alias `@/` ni une extension implicite.
import { normalizeScheduleTime } from './schedule-time.ts';

export const SCHEDULE_TIME_ZONE = 'America/Toronto' as const;

export const WEEKDAY_LABELS: Readonly<Record<ScheduleWeekday, string>> = {
  sunday: 'Dimanche',
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
};

/** Index aligné sur `Date#getDay` : dimanche = 0. Interne au calcul. */
export const WEEKDAY_INDEXES: Readonly<Record<ScheduleWeekday, number>> = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
};

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

// Les dates seules (`validFrom`/`validUntil`) sont des jours civils sans heure :
// on les formate en UTC pour éviter le décalage d'un jour qu'introduirait un
// fuseau à l'ouest de Greenwich.
const DATE_ONLY_FORMATTER = new Intl.DateTimeFormat('fr-CA', {
  timeZone: 'UTC',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

// `lastReviewedAt` est un instant réel : il se lit dans le fuseau de la paroisse.
const REVIEWED_AT_FORMATTER = new Intl.DateTimeFormat('fr-CA', {
  timeZone: SCHEDULE_TIME_ZONE,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function cleanString(
  value: string | null | undefined,
): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * `16:00` → `16 h`, `10:30` → `10 h 30`. Invalide → `undefined`.
 *
 * Les saisies humaines (`8h`, `8 h 30`) sont acceptées : elles sont normalisées
 * avant lecture, comme le fait déjà le champ du Studio. Voir
 * `schedule-time.ts` pour la raison.
 */
export function formatTimeLabel(
  value: string | null | undefined,
): string | undefined {
  const normalized = normalizeScheduleTime(value);
  if (!normalized) return undefined;

  const hours = Number(normalized.slice(0, 2));
  const minutes = normalized.slice(3);

  return minutes === '00' ? `${hours} h` : `${hours} h ${minutes}`;
}

/** `16:30` → `990` minutes depuis minuit. Invalide → `undefined`. */
export function parseTimeToMinutes(
  value: string | null | undefined,
): number | undefined {
  const normalized = normalizeScheduleTime(value);
  if (!normalized) return undefined;

  return Number(normalized.slice(0, 2)) * 60 + Number(normalized.slice(3));
}

/** `2026-06-21` → `21 juin 2026`. Invalide → `undefined`. */
export function formatDateOnlyLabel(
  value: string | null | undefined,
): string | undefined {
  const clean = cleanString(value);
  if (!clean || !DATE_ONLY_PATTERN.test(clean)) return undefined;

  const timestamp = Date.parse(`${clean}T00:00:00Z`);
  if (Number.isNaN(timestamp)) return undefined;

  return DATE_ONLY_FORMATTER.format(timestamp);
}

/** Datetime ISO → `11 août 2026`, dans le fuseau de la paroisse. */
export function formatReviewedAtLabel(
  value: string | null | undefined,
): string | undefined {
  const clean = cleanString(value);
  if (!clean) return undefined;

  const timestamp = Date.parse(clean);
  if (Number.isNaN(timestamp)) return undefined;

  return REVIEWED_AT_FORMATTER.format(timestamp);
}
