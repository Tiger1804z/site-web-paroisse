import { loadQuery } from '@/lib/sanity/preview';
import { aboutPageData } from '@/data/about';
import { buildImageSources } from '@/lib/sanity/image';
import { ABOUT_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanityAboutPageResult } from '@/lib/sanity/types';
import { normalizeSanityAboutPage } from '@/lib/content/normalizeSanityAboutPage';
import type { AboutPageData } from '@/types/about';

async function fetchAboutPageRaw(): Promise<SanityAboutPageResult> {
  try {
    return await loadQuery(ABOUT_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getAboutPageData] Échec du fetch Sanity — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * Le récit historique de la paroisse, Sanity par-dessus le repli local.
 *
 * Le repli garde les neuf repères et leurs textes, mais pas leurs
 * illustrations : celles-ci vivent dans le Studio. Une chronologie sans images
 * reste lisible; une chronologie disparue effacerait l'histoire du lieu.
 */
export async function getAboutPageData(): Promise<AboutPageData> {
  const raw = await fetchAboutPageRaw();

  return normalizeSanityAboutPage(raw, aboutPageData, buildImageSources);
}
