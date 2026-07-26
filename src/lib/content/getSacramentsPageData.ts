import { sacramentsPageData } from '@/data/sacraments';
import type { SacramentsPageData } from '@/types/sacraments';

export async function getSacramentsPageData(): Promise<SacramentsPageData> {
  return sacramentsPageData;
}
