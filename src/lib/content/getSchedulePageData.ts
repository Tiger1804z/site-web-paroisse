import { sanityClient } from 'sanity:client';
import { schedulePageData } from '@/data/schedules';
import type { SchedulePageData, WeeklyMassEntry } from '@/types/schedule';
import { SCHEDULE_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanitySchedulePageResult } from '@/lib/sanity/types';
import { normalizeSanitySchedulePage } from '@/lib/content/normalizeSanitySchedulePage';
import { toWeeklyMassEntries } from '@/lib/schedules/weekly-masses';

function getLocalFallback(): SchedulePageData {
  return {
    ...schedulePageData,
    faq: schedulePageData.faq.filter(({ active }) => active),
  };
}

/**
 * Fetch partagé par les deux lectures du document.
 *
 * Volontairement sans cache : chaque page est rendue une fois au build et
 * aucune ne consomme les deux dérivations. Un cache module n'économiserait rien
 * ici et rendrait les données figées entre deux rechargements en dev.
 */
async function fetchSchedulePageRaw(
  context: string,
): Promise<SanitySchedulePageResult> {
  try {
    return await sanityClient.fetch(SCHEDULE_PAGE_QUERY);
  } catch (error) {
    console.error(
      `[${context}] Échec du fetch Sanity — utilisation du fallback local.`,
      error,
    );
    return null;
  }
}

/** Contenu d'affichage de la page Horaires, libellés déjà dérivés. */
export async function getSchedulePageData(): Promise<SchedulePageData> {
  const raw = await fetchSchedulePageRaw('getSchedulePageData');

  return normalizeSanitySchedulePage(raw, getLocalFallback());
}

/**
 * Célébrations hebdomadaires sous forme calculable, pour le calcul de la
 * prochaine messe.
 *
 * Retourne une liste vide tant que Sanity ne publie pas d'horaire exploitable :
 * le fallback local ne contient que des gabarits (`[HEURE]`), qui ne sont pas
 * des heures. L'appelant doit afficher un état vide honnête, jamais une valeur
 * inventée.
 */
export async function getWeeklyMasses(): Promise<WeeklyMassEntry[]> {
  const raw = await fetchSchedulePageRaw('getWeeklyMasses');

  return toWeeklyMassEntries(raw);
}
