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

/**
 * Filtre, ordonne et dédoublonne les fiches, quelle qu'en soit l'origine.
 *
 * Sanity et le repli local passent tous les deux par ici : c'est le seul endroit
 * qui décide ce qui se publie. Le tri par `order` reste nécessaire même si la
 * requête GROQ trie déjà — le repli local, lui, n'est trié par personne.
 *
 * L'identité est `id` seul. Il n'existe pas de page par annonceur, donc pas
 * d'ancre publique à protéger : côté Sanity l'identité est le `_id` du document.
 */
export function selectAdvertisers(
  advertisers: readonly Advertiser[],
  options: AdvertiserSelectionOptions = {},
): Advertiser[] {
  const uniqueAdvertisers: Advertiser[] = [];
  const seenIds = new Set<string>();

  advertisers
    .filter((advertiser) => isAdvertiserPublishable(advertiser, options))
    .toSorted(
      (left, right) =>
        left.order - right.order || left.name.localeCompare(right.name, 'fr'),
    )
    .forEach((advertiser) => {
      if (seenIds.has(advertiser.id)) return;

      seenIds.add(advertiser.id);
      uniqueAdvertisers.push(advertiser);
    });

  return uniqueAdvertisers;
}
