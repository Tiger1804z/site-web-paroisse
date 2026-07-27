import { parishLifePageData } from '@/data/parishLife';
import type { ParishLifePageData } from '@/types/parishLife';

export async function getParishLifePageData(): Promise<ParishLifePageData> {
  return {
    ...parishLifePageData,
    features: parishLifePageData.features
      .filter(({ active }) => active)
      .toSorted((left, right) => left.order - right.order),
  };
}
