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
}

/**
 * Retient les entrées publiables et dérive leurs libellés.
 *
 * Une entrée hebdomadaire sans jour ou sans heure valide est ignorée : le
 * schéma l'interdit déjà, mais un document ancien ou partiel ne doit jamais
 * produire une ligne d'horaire vide sur le site.
 */
function toUsableEntry(entry: RawEntry): UsableEntry | undefined {
  if (entry.active === false) return undefined;

  const title = cleanString(entry.title);
  const note = cleanString(entry.note);
  const timeLabel = formatTimeLabel(entry.time);

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

/**
 * L'ordre du tableau Sanity fait foi, et rien d'autre.
 *
 * Un champ « Ordre d'affichage » facultatif coexistait avec le glisser-déposer.
 * Il n'a pas tenu : le 1er septembre 2026, deux célébrations ajoutées à la main
 * n'en avaient pas, les anciennes en avaient un, et le dimanche s'est affiché
 * « 10 h » puis « 8 h 30 » sur le site public — l'inverse de ce que montrait le
 * Studio. Deux façons d'ordonner une même liste, dont une invisible dans
 * l'interface : celle qu'on ne voit pas gagne, et personne ne comprend pourquoi.
 *
 * Le champ est supprimé du schéma. Ce que l'éditrice voit dans sa liste est ce
 * que la page affiche.
 */
function normalizeEntries(entries: readonly RawEntry[]): ScheduleEntry[] {
  const usable = entries.flatMap((entry) => {
    const candidate = toUsableEntry(entry);
    return candidate ? [candidate] : [];
  });

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
    reviewedAtLabel:
      formatReviewedAtLabel(raw?.lastReviewedAt) ?? fallback.reviewedAtLabel,
  };
}
