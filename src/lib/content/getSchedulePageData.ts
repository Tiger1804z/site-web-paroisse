import { loadQuery } from '@/lib/sanity/preview';
import { schedulePageData } from '@/data/schedules';
import { buildRemoteImageSources } from '@/lib/sanity/image';
import { normalizeSanityImage } from '@/lib/content/normalizeSanityImage';
import type { SchedulePageView } from '@/types/schedule';
import { SCHEDULE_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanitySchedulePageResult } from '@/lib/sanity/types';
import { normalizeSanitySchedulePage } from '@/lib/content/normalizeSanitySchedulePage';
import { getMassScheduleData } from '@/lib/content/getMassSchedule';
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
 * - `siteSettings` — les heures du secrétariat, coordonnée globale.
 *
 * Aucune référence Sanity entre ces documents : trois lectures indépendantes,
 * recomposées ici. Les composants gardent le contrat qu'ils avaient déjà.
 */
export async function getSchedulePageData(): Promise<SchedulePageView> {
  const [raw, schedule, siteSettings] = await Promise.all([
    fetchSchedulePageRaw(),
    getMassScheduleData(),
    getSiteSettings(),
  ]);

  const page = normalizeSanitySchedulePage(
    raw,
    schedulePageData,
    siteSettings.officeHoursLabel,
  );

  // L'image du premier écran demande le constructeur d'adresses du CDN, que le
  // normalizer n'a pas : elle se compose ici, comme sur l'accueil.
  const heroImage = normalizeSanityImage(raw?.hero?.image, (source) =>
    buildRemoteImageSources(
      source as Parameters<typeof buildRemoteImageSources>[0],
    ),
  );

  return {
    ...page,
    hero: { ...page.hero, ...(heroImage ? { image: heroImage } : {}) },
    faq: page.faq.filter(({ active }) => active),
    ...schedule,
  };
}
