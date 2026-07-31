import { loadQuery } from '@/lib/sanity/preview';
import { siteSettingsData } from '@/data/siteSettings';
import type { PublicContactDetails } from '@/types/siteSettings';
import { SITE_SETTINGS_QUERY } from '@/lib/sanity/queries';
import { normalizeSanitySiteSettings } from '@/lib/content/normalizeSanitySiteSettings';

function getLocalFallback(): PublicContactDetails {
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

export async function getSiteSettings(): Promise<PublicContactDetails> {
  const fallback = getLocalFallback();

  try {
    const raw = await loadQuery(SITE_SETTINGS_QUERY);
    return normalizeSanitySiteSettings(raw, fallback);
  } catch (error) {
    console.error(
      '[getSiteSettings] Échec du fetch Sanity — utilisation du fallback local.',
      error,
    );
    return fallback;
  }
}
