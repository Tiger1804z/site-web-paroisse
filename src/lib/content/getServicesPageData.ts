import { buildServicesPageData } from '@/data/services';
import { getSiteSettings } from '@/lib/content/getSiteSettings';
import type { ServicesPageData } from '@/types/services';

export async function getServicesPageData(): Promise<ServicesPageData> {
  const siteSettings = await getSiteSettings();
  return buildServicesPageData(siteSettings);
}
