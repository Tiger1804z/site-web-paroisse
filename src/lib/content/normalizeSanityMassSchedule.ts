import type {
  MassScheduleData,
  ScheduleEntry,
  SchedulePeriod,
  ScheduleTime,
} from '@/types/schedule';
import type { SanityMassScheduleResult } from '@/lib/sanity/types';
// Import relatif et extension explicite volontaires : ce module est chargé tel
// quel par `node --test`, qui ne résout ni l'alias `@/` ni une extension
// implicite. L'alias reste réservé aux imports de types, effacés à l'exécution.
import {
  cleanString,
  formatDateOnlyLabel,
  formatReviewedAtLabel,
  formatTimeLabel,
  WEEKDAY_LABELS,
} from '../schedules/schedule-format.ts';

type RawMassSchedule = NonNullable<SanityMassScheduleResult>;
type RawPeriod = NonNullable<RawMassSchedule['regularSchedule']>;
type RawEntry = NonNullable<RawPeriod['entries']>[number];

/** Entrée Sanity retenue, avec ses libellés déjà dérivés. */
interface UsableEntry {
  readonly groupKey: string;
  readonly groupId: string;
  readonly dayLabel: string;
  readonly timeLabel?: string;
  readonly title?: string;
  readonly note?: string;
  readonly order: number;
  readonly time: string;
}

/**
 * Retient les entrées publiables et dérive leurs libellés.
 *
 * Une entrée hebdomadaire sans jour ou sans heure valide est ignorée : le
 * schéma l'interdit déjà, mais un document ancien ou partiel ne doit jamais
 * produire une ligne d'horaire vide sur le site.
 */
function toUsableEntry(
  entry: RawEntry,
  index: number,
): UsableEntry | undefined {
  if (entry.active === false) return undefined;

  const title = cleanString(entry.title);
  const note = cleanString(entry.note);
  const timeLabel = formatTimeLabel(entry.time);
  // Sans numéro explicite, la position dans le tableau Sanity fait foi :
  // l'éditrice réorganise par glisser-déposer, sans champ à remplir.
  const order = typeof entry.order === 'number' ? entry.order : index;
  const time = timeLabel ? (cleanString(entry.time) ?? '') : '';

  if (entry.recurrenceType === 'custom') {
    const displayLabel = cleanString(entry.displayLabel);
    if (!displayLabel) return undefined;

    return {
      groupKey: `custom:${displayLabel.toLowerCase()}`,
      groupId: entry._key,
      dayLabel: displayLabel,
      timeLabel,
      title,
      note,
      order,
      time,
    };
  }

  const weekday = entry.weekday;
  if (!weekday || !timeLabel) return undefined;

  return {
    groupKey: `weekly:${weekday}`,
    groupId: weekday,
    dayLabel: WEEKDAY_LABELS[weekday],
    timeLabel,
    title,
    note,
    order,
    time,
  };
}

/**
 * Regroupe les entrées plates de Sanity en lignes d'affichage (un jour, une ou
 * plusieurs heures), comme l'attend le contrat frontend.
 */
function groupEntries(usable: readonly UsableEntry[]): ScheduleEntry[] {
  const groups = new Map<string, UsableEntry[]>();

  for (const entry of usable) {
    const existing = groups.get(entry.groupKey);
    if (existing) {
      existing.push(entry);
    } else {
      groups.set(entry.groupKey, [entry]);
    }
  }

  return [...groups.values()].map((group) => {
    const [first] = group;
    const titles = new Set(group.map((entry) => entry.title));
    const sharedTitle = titles.size === 1 ? first.title : undefined;
    const hasTimeLabel = group.some((entry) => entry.timeLabel);

    // Le titre partagé devient la note du jour (« Vigile du dimanche ») ; sinon
    // chaque heure porte son propre titre pour ne rien perdre.
    const dayNote = hasTimeLabel ? sharedTitle : undefined;

    const times: ScheduleTime[] = group.map((entry) => {
      const label = entry.timeLabel ?? entry.title ?? entry.dayLabel;
      const noteParts = [
        entry.title && entry.timeLabel && !dayNote ? entry.title : undefined,
        entry.note,
      ].filter((part): part is string => Boolean(part));

      return {
        label,
        note: noteParts.length > 0 ? noteParts.join(' · ') : undefined,
      };
    });

    return {
      id: first.groupId,
      dayLabel: first.dayLabel,
      note: dayNote,
      times,
    };
  });
}

function normalizeEntries(entries: readonly RawEntry[]): ScheduleEntry[] {
  const usable = entries
    .map((entry, index) => ({ entry: toUsableEntry(entry, index), index }))
    .filter(
      (candidate): candidate is { entry: UsableEntry; index: number } =>
        candidate.entry !== undefined,
    )
    .sort(
      (first, second) =>
        first.entry.order - second.entry.order ||
        first.entry.time.localeCompare(second.entry.time) ||
        first.index - second.index,
    )
    .map((candidate) => candidate.entry);

  return groupEntries(usable);
}

function normalizePeriod(
  raw: RawPeriod | null | undefined,
  id: string,
): SchedulePeriod | undefined {
  const title = cleanString(raw?.title);
  if (!raw || !title) return undefined;

  const entries = normalizeEntries(raw.entries ?? []);
  if (entries.length === 0) return undefined;

  return {
    id,
    title,
    description: cleanString(raw.description),
    validFromLabel: formatDateOnlyLabel(raw.validFrom),
    validUntilLabel: formatDateOnlyLabel(raw.validUntil),
    entries,
    active: raw.active !== false,
  };
}

/**
 * Fusionne le document Sanity avec le repli local.
 *
 * Les horaires basculent en bloc : tant que Sanity ne fournit pas un horaire
 * régulier exploitable, le repli reste la source affichée — jamais un mélange
 * d'heures réelles et de gabarits.
 */
export function normalizeSanityMassSchedule(
  raw: SanityMassScheduleResult,
  fallback: MassScheduleData,
): MassScheduleData {
  const regularSchedule = normalizePeriod(
    raw?.regularSchedule,
    fallback.regularSchedule.id,
  );

  if (!regularSchedule) return fallback;

  const seasonalSchedules = (raw?.seasonalSchedules ?? [])
    .map((period) => normalizePeriod(period, period._key))
    .filter((period): period is SchedulePeriod => period !== undefined);

  return {
    regularSchedule,
    seasonalSchedules,
    lastUpdatedLabel:
      formatReviewedAtLabel(raw?.lastReviewedAt) ?? fallback.lastUpdatedLabel,
  };
}
