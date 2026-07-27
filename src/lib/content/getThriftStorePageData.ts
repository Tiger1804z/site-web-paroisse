import { thriftStorePageData } from '@/data/thriftStore';
import type { ThriftStorePageData } from '@/types/thriftStore';

export async function getThriftStorePageData(): Promise<ThriftStorePageData> {
  return {
    ...thriftStorePageData,
    sections: thriftStorePageData.sections
      .filter(({ active }) => active)
      .toSorted((left, right) => left.order - right.order),
  };
}
