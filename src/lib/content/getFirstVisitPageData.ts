import { firstVisitPageData } from '@/data/firstVisit';
import type { FirstVisitPageData } from '@/types/firstVisit';

export async function getFirstVisitPageData(): Promise<FirstVisitPageData> {
  return firstVisitPageData;
}
