import { loadQuery } from '@/lib/sanity/preview';
import { massScheduleData } from '@/data/schedules';
import type { MassScheduleData, WeeklyMassEntry } from '@/types/schedule';
import { MASS_SCHEDULE_QUERY } from '@/lib/sanity/queries';
import type { SanityMassScheduleResult } from '@/lib/sanity/types';
import { normalizeSanityMassSchedule } from '@/lib/content/normalizeSanityMassSchedule';
import { toWeeklyMassEntries } from '@/lib/schedules/weekly-masses';

/**
 * Fetch partagé par les deux lectures des horaires.
 *
 * Volontairement sans cache : chaque page est rendue une fois au build et
 * aucune ne consomme les deux dérivations. Un cache module n'économiserait rien
 * ici et rendrait les données figées entre deux rechargements en dev.
 */
async function fetchMassScheduleRaw(
  context: string,
): Promise<SanityMassScheduleResult> {
  try {
    return await loadQuery(MASS_SCHEDULE_QUERY);
  } catch (error) {
    console.error(
      `[${context}] Échec du fetch Sanity — utilisation du repli local.`,
      error,
    );
    return null;
  }
}

/** Horaires prêts à afficher, libellés déjà dérivés. */
export async function getMassScheduleData(): Promise<MassScheduleData> {
  const raw = await fetchMassScheduleRaw('getMassScheduleData');

  return normalizeSanityMassSchedule(raw, massScheduleData);
}

/**
 * Célébrations hebdomadaires sous forme calculable, pour le calcul de la
 * prochaine messe sur l'accueil.
 *
 * Retourne une liste vide tant que Sanity ne publie pas d'horaire exploitable :
 * le repli local ne contient aucune heure. L'appelant doit afficher un état
 * vide honnête, jamais une valeur inventée.
 */
export async function getWeeklyMasses(): Promise<WeeklyMassEntry[]> {
  const raw = await fetchMassScheduleRaw('getWeeklyMasses');

  return toWeeklyMassEntries(raw);
}
