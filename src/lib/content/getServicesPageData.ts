import { loadQuery } from '@/lib/sanity/preview';
import { buildServicesPageData } from '@/data/services';
import { getSiteSettings } from '@/lib/content/getSiteSettings';
import { SERVICES_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanityServicesPageResult } from '@/lib/sanity/types';
import { normalizeSanityServicesPage } from '@/lib/content/normalizeSanityServicesPage';
import type { ServicesPageData } from '@/types/services';

export async function fetchServicesPageRaw(): Promise<SanityServicesPageResult> {
  try {
    return await loadQuery(SERVICES_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getServicesPageData] Échec du fetch Sanity — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * Le repli local est construit d'abord : il fournit les images, le téléphone du
 * secrétariat et la totalité du contenu si Sanity ne répond pas.
 */
export async function getServicesPageData(): Promise<ServicesPageData> {
  const siteSettings = await getSiteSettings();
  const fallback = buildServicesPageData(siteSettings);
  const raw = await fetchServicesPageRaw();

  return normalizeSanityServicesPage(raw, fallback);
}
