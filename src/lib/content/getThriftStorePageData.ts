import { loadQuery } from '@/lib/sanity/preview';
import { thriftStorePageData } from '@/data/thriftStore';
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

export async function fetchThriftStorePageRaw(): Promise<SanityThriftStorePageResult> {
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

export async function fetchThriftStoreRaw(): Promise<SanityThriftStoreResult> {
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
  );

  return {
    ...page,
    sections: page.sections.filter(({ active }) => active),
  };
}
