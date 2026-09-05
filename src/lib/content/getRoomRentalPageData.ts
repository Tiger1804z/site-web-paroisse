import { loadQuery } from '@/lib/sanity/preview';
import { buildImageSources } from '@/lib/sanity/image';
import { buildRoomRentalPageData } from '@/data/roomRental';
import { getSiteSettings } from '@/lib/content/getSiteSettings';
import { ROOM_RENTAL_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanityRoomRentalPageResult } from '@/lib/sanity/types';
import { normalizeSanityRoomRentalPage } from '@/lib/content/normalizeSanityRoomRentalPage';
import { normalizeSanityImage } from '@/lib/content/normalizeSanityImage';
import { normalizeShareImage } from '@/lib/content/normalizeShareImage';
import type { RoomRentalPageData } from '@/types/roomRental';

async function fetchRoomRentalPageRaw(): Promise<SanityRoomRentalPageResult> {
  try {
    return await loadQuery(ROOM_RENTAL_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getRoomRentalPageData] Échec du fetch Sanity — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * Le repli local est construit d'abord : il fournit le téléphone du secrétariat
 * et la totalité du contenu si Sanity ne répond pas.
 */
export async function getRoomRentalPageData(): Promise<RoomRentalPageData> {
  const siteSettings = await getSiteSettings();
  const fallback = buildRoomRentalPageData(siteSettings);

  const raw = await fetchRoomRentalPageRaw();
  const page = normalizeSanityRoomRentalPage(raw, fallback);

  const heroImage = normalizeSanityImage(
    raw?.hero?.image,
    buildImageSources,
    'hero',
  );

  // L'image de partage suit la même route que celle du premier écran : le
  // normalizer n'a pas le constructeur d'adresses du CDN.
  const shareImage = normalizeShareImage(raw?.seo?.image, buildImageSources);

  return {
    ...page,
    seo: { ...page.seo, ...(shareImage ? { shareImage } : {}) },
    hero: { ...page.hero, ...(heroImage ? { image: heroImage } : {}) },
  };
}
