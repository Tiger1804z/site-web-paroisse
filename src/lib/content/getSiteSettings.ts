import { siteSettingsData } from '@/data/siteSettings';
import type { PublicContactDetails } from '@/types/siteSettings';

export async function getSiteSettings(): Promise<PublicContactDetails> {
  const email = siteSettingsData.email.confirmed
    ? siteSettingsData.email
    : undefined;

  return {
    organizationName: siteSettingsData.organizationName,
    address: siteSettingsData.address,
    phone: siteSettingsData.phone,
    email,
    directionsUrl: siteSettingsData.directionsUrl,
    map: siteSettingsData.map,
  };
}
