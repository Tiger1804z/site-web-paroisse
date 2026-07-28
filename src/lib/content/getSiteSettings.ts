import { sanityClient } from 'sanity:client';
import { siteSettingsData } from '@/data/siteSettings';
import type { PublicContactDetails } from '@/types/siteSettings';
import type { SanitySiteSettingsDocument } from '@/lib/sanity/types';
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
    const raw = await sanityClient.fetch<SanitySiteSettingsDocument | null>(
      SITE_SETTINGS_QUERY,
    );
    return normalizeSanitySiteSettings(raw, fallback);
  } catch (error) {
    console.error(
      '[getSiteSettings] Échec du fetch Sanity — utilisation du fallback local.',
      error,
    );
    return fallback;
  }
}
