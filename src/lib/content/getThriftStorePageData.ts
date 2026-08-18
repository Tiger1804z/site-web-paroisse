import { loadQuery } from '@/lib/sanity/preview';
import { thriftStorePageData } from '@/data/thriftStore';
import { buildRemoteImageSources } from '@/lib/sanity/image';
import type { ThriftStorePageData } from '@/types/thriftStore';
import {
  THRIFT_STORE_PAGE_QUERY,
  THRIFT_STORE_QUERY,
} from '@/lib/sanity/queries';
import type {
  SanityThriftStorePageResult,
  SanityThriftStoreResult,
} from '@/lib/sanity/types';
import { normalizeSanityThriftStorePage } from '@/lib/content/normalizeSanityThriftStore';

async function fetchThriftStorePageRaw(): Promise<SanityThriftStorePageResult> {
  try {
    return await loadQuery(THRIFT_STORE_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getThriftStorePageData] Échec du fetch Sanity (page) — utilisation du repli local.',
      error,
    );
    return null;
  }
}

async function fetchThriftStoreRaw(): Promise<SanityThriftStoreResult> {
  try {
    return await loadQuery(THRIFT_STORE_QUERY);
  } catch (error) {
    console.error(
      '[getThriftStorePageData] Échec du fetch Sanity (friperie) — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * `/friperie` recompose deux sources : le décor de la page et la friperie
 * elle-même. Aucune référence Sanity entre les deux — les heures d'ouverture
 * restent lisibles sans passer par un document de page.
 */
export async function getThriftStorePageData(): Promise<ThriftStorePageData> {
  const [rawPage, rawStore] = await Promise.all([
    fetchThriftStorePageRaw(),
    fetchThriftStoreRaw(),
  ]);

  const page = normalizeSanityThriftStorePage(
    rawPage,
    rawStore,
    thriftStorePageData,
    (source) =>
      buildRemoteImageSources(
        source as Parameters<typeof buildRemoteImageSources>[0],
      ),
  );

  return {
    ...page,
    sections: page.sections.filter(({ active }) => active),
  };
}
