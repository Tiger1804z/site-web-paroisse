import { loadQuery } from '@/lib/sanity/preview';
import { schedulePageData } from '@/data/schedules';
import { buildImageSources } from '@/lib/sanity/image';
import { normalizeSanityImage } from '@/lib/content/normalizeSanityImage';
import { normalizeShareImage } from '@/lib/content/normalizeShareImage';
import type { SchedulePageView } from '@/types/schedule';
import { SCHEDULE_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanitySchedulePageResult } from '@/lib/sanity/types';
import { normalizeSanitySchedulePage } from '@/lib/content/normalizeSanitySchedulePage';
import { getMassScheduleData } from '@/lib/content/getMassSchedule';
import { getSpecialCelebrations } from '@/lib/content/getParishEvents';
import { getSiteSettings } from '@/lib/content/getSiteSettings';

async function fetchSchedulePageRaw(): Promise<SanitySchedulePageResult> {
  try {
    return await loadQuery(SCHEDULE_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getSchedulePageData] Échec du fetch Sanity — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * Agrège les trois sources de la page `/horaires` :
 *
 * - `schedulePage` — le contenu propre à cette page;
 * - `massSchedule` — les horaires, partagés avec l'accueil;
 * - `siteSettings` — les heures du secrétariat, coordonnée globale;
 * - `parishEvent` — les célébrations datées, partagées avec `/evenements/`.
 *
 * Aucune référence Sanity entre ces documents : quatre lectures indépendantes,
 * recomposées ici. Les composants gardent le contrat qu'ils avaient déjà.
 */
export async function getSchedulePageData(
  now: Date = new Date(),
): Promise<SchedulePageView> {
  const [raw, schedule, siteSettings, specialCelebrations] = await Promise.all([
    fetchSchedulePageRaw(),
    getMassScheduleData(),
    getSiteSettings(),
    getSpecialCelebrations(now),
  ]);

  const page = normalizeSanitySchedulePage(
    raw,
    schedulePageData,
    siteSettings.officeHoursLabel,
  );

  // L'image du premier écran demande le constructeur d'adresses du CDN, que le
  // normalizer n'a pas : elle se compose ici, comme sur l'accueil.
  const heroImage = normalizeSanityImage(
    raw?.hero?.image,
    buildImageSources,
    'hero',
  );

  const shareImage = normalizeShareImage(raw?.seo?.image, buildImageSources);

  return {
    ...page,
    seo: { ...page.seo, ...(shareImage ? { shareImage } : {}) },
    hero: { ...page.hero, ...(heroImage ? { image: heroImage } : {}) },
    faq: page.faq.filter(({ active }) => active),
    // Les célébrations ne se saisissent pas dans la page : elles viennent des
    // Événements, pour qu'une même célébration ne soit annoncée qu'une fois.
    specialCelebrations,
    ...schedule,
  };
}
