import { loadQuery } from '@/lib/sanity/preview';
import { buildRemoteImageSources } from '@/lib/sanity/image';
import { buildAdvertisersPageSource } from '@/data/advertisers';
import { selectAdvertisers } from '@/lib/advertisers/advertisers';
import { getSiteSettings } from '@/lib/content/getSiteSettings';
import {
  ADVERTISERS_QUERY,
  ADVERTISERS_PAGE_QUERY,
} from '@/lib/sanity/queries';
import type {
  SanityAdvertisersResult,
  SanityAdvertisersPageResult,
} from '@/lib/sanity/types';
import { normalizeSanityAdvertisers } from '@/lib/content/normalizeSanityAdvertisers';
import { normalizeSanityAdvertisersPage } from '@/lib/content/normalizeSanityAdvertisersPage';
import { normalizeSanityImage } from '@/lib/content/normalizeSanityImage';
import type { AdvertisersPageData } from '@/types/advertisers';

export async function fetchAdvertisersPageRaw(): Promise<SanityAdvertisersPageResult> {
  try {
    return await loadQuery(ADVERTISERS_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getAdvertisersPageData] Échec du fetch Sanity (page) — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * `null` distingue l'échec du vide.
 *
 * Une collection vide est une réponse : la paroisse n'a aucun annonceur. Un
 * échec de requête n'en est pas une, et laisse le repli local reprendre la main.
 */
export async function fetchAdvertisersRaw(): Promise<SanityAdvertisersResult | null> {
  try {
    return await loadQuery(ADVERTISERS_QUERY);
  } catch (error) {
    console.error(
      '[getAdvertisersPageData] Échec du fetch Sanity (annonceurs) — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * Le repli local est construit d'abord : il fournit l'image de l'en-tête, le
 * téléphone du secrétariat et la totalité du contenu si Sanity ne répond pas.
 *
 * `showAdvertisers` reste conjugué au nombre de fiches retenues. La case du
 * Studio autorise la section; elle ne la remplit pas, et une grille vide ne
 * s'affiche jamais.
 */
export async function getAdvertisersPageData(): Promise<AdvertisersPageData> {
  const siteSettings = await getSiteSettings();
  const fallback = buildAdvertisersPageSource(siteSettings);

  const [rawPage, rawAdvertisers] = await Promise.all([
    fetchAdvertisersPageRaw(),
    fetchAdvertisersRaw(),
  ]);

  const page = normalizeSanityAdvertisersPage(rawPage, fallback);
  const source =
    rawAdvertisers === null
      ? fallback.advertisers
      : normalizeSanityAdvertisers(rawAdvertisers, (imageSource) =>
          buildRemoteImageSources(
            imageSource as Parameters<typeof buildRemoteImageSources>[0],
          ),
        );

  const advertisers = selectAdvertisers(source);

  const heroImage = normalizeSanityImage(rawPage?.hero?.image, (source) =>
    buildRemoteImageSources(
      source as Parameters<typeof buildRemoteImageSources>[0],
    ),
  );

  return {
    ...page,
    hero: { ...page.hero, ...(heroImage ? { image: heroImage } : {}) },
    advertisers,
    settings: {
      ...page.settings,
      showAdvertisers: page.settings.showAdvertisers && advertisers.length > 0,
    },
  };
}
