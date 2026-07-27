import { advertisersPageSource } from '@/data/advertisers';
import { selectAdvertisers } from '@/lib/advertisers/advertisers';
import type { AdvertisersPageData } from '@/types/advertisers';

export async function getAdvertisersPageData(): Promise<AdvertisersPageData> {
  const advertisers = selectAdvertisers(advertisersPageSource.advertisers);

  return {
    ...advertisersPageSource,
    advertisers,
    settings: {
      ...advertisersPageSource.settings,
      showAdvertisers:
        advertisersPageSource.settings.showAdvertisers &&
        advertisers.length > 0,
    },
  };
}
