import { buildAdvertisersPageSource } from '@/data/advertisers';
import { selectAdvertisers } from '@/lib/advertisers/advertisers';
import { getSiteSettings } from '@/lib/content/getSiteSettings';
import type { AdvertisersPageData } from '@/types/advertisers';

export async function getAdvertisersPageData(): Promise<AdvertisersPageData> {
  const siteSettings = await getSiteSettings();
  const source = buildAdvertisersPageSource(siteSettings);
  const advertisers = selectAdvertisers(source.advertisers);

  return {
    ...source,
    advertisers,
    settings: {
      ...source.settings,
      showAdvertisers:
        source.settings.showAdvertisers && advertisers.length > 0,
    },
  };
}
