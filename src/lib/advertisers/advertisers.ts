import type { Advertiser } from '@/types/advertisers';

export interface AdvertiserSelectionOptions {
  readonly includeConfirmationRequired?: boolean;
}

export function isAdvertiserPublishable(
  advertiser: Advertiser,
  options: AdvertiserSelectionOptions = {},
): boolean {
  if (advertiser.name.trim().length === 0) {
    return false;
  }

  if (advertiser.status === 'active') {
    return true;
  }

  return (
    options.includeConfirmationRequired === true &&
    advertiser.status === 'confirmation-required'
  );
}

export function selectAdvertisers(
  advertisers: readonly Advertiser[],
  options: AdvertiserSelectionOptions = {},
): Advertiser[] {
  const uniqueAdvertisers: Advertiser[] = [];
  const seenIds = new Set<string>();
  const seenSlugs = new Set<string>();

  advertisers
    .filter((advertiser) => isAdvertiserPublishable(advertiser, options))
    .toSorted((left, right) => left.order - right.order)
    .forEach((advertiser) => {
      if (seenIds.has(advertiser.id) || seenSlugs.has(advertiser.slug)) return;

      seenIds.add(advertiser.id);
      seenSlugs.add(advertiser.slug);
      uniqueAdvertisers.push(advertiser);
    });

  return uniqueAdvertisers;
}
