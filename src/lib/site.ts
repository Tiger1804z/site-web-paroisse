import { siteSettingsData } from '@/data/siteSettings';

export const SITE_NAME = siteSettingsData.organizationName;
export const SITE_DESCRIPTOR = 'Paroisse catholique';

export const SITE_ADDRESS = {
  ...siteSettingsData.address,
  latitude: siteSettingsData.map.latitude,
  longitude: siteSettingsData.map.longitude,
};

export const SITE_PHONE = siteSettingsData.phone;
