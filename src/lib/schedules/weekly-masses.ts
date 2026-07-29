import type { SanitySchedulePageResult } from '@/lib/sanity/types';
import type { WeeklyMassEntry } from '@/types/schedule';
import { cleanString, parseTimeToMinutes } from './schedule-format.ts';

type RawSchedulePage = NonNullable<SanitySchedulePageResult>;
type RawPeriod = NonNullable<RawSchedulePage['regularSchedule']>;
type RawEntry = NonNullable<RawPeriod['entries']>[number];

/**
 * Extrait la forme calculable des célébrations hebdomadaires.
 *
 * Complémentaire de `normalizeSanitySchedulePage`, qui produit les libellés
 * d'affichage : ici on garde les valeurs machine (`sunday`, `16:00`) pour que
 * « la prochaine messe » se calcule sans jamais reparser un libellé français.
 *
 * Seules les entrées `weekly` sont retenues — une célébration personnalisée
 * (« Premier vendredi du mois ») s'affiche sur la page des horaires mais n'est
 * pas calculable, elle ne peut donc pas devenir une « prochaine messe ».
 *
 * Limite assumée : seul l'horaire régulier alimente ce calcul. Les horaires
 * saisonniers portent des bornes de dates dont la prise en compte demandera une
 * décision de modèle (période en vigueur) — ticket ultérieur.
 */
export function toWeeklyMassEntries(
  raw: SanitySchedulePageResult,
): WeeklyMassEntry[] {
  const period = raw?.regularSchedule;
  if (!period || period.active === false) return [];

  return (period.entries ?? [])
    .map((entry, index) => ({
      entry: toWeeklyMassEntry(entry),
      order:
        typeof entry.order === 'number' ? entry.order : Number.MAX_SAFE_INTEGER,
      index,
    }))
    .filter(
      (
        candidate,
      ): candidate is {
        entry: WeeklyMassEntry;
        order: number;
        index: number;
      } => candidate.entry !== undefined,
    )
    .sort(
      (first, second) =>
        first.order - second.order ||
        first.entry.time.localeCompare(second.entry.time) ||
        first.index - second.index,
    )
    .map((candidate) => candidate.entry);
}

function toWeeklyMassEntry(entry: RawEntry): WeeklyMassEntry | undefined {
  if (entry.active === false || entry.recurrenceType === 'custom') {
    return undefined;
  }

  const weekday = entry.weekday;
  const time = cleanString(entry.time);
  const title = cleanString(entry.title);

  if (!weekday || !time || parseTimeToMinutes(time) === undefined || !title) {
    return undefined;
  }

  return {
    id: entry._key,
    weekday,
    time,
    title,
    note: cleanString(entry.note),
  };
}
