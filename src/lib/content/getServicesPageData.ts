import { servicesPageData } from '@/data/services';
import type { ServicesPageData } from '@/types/services';

export async function getServicesPageData(): Promise<ServicesPageData> {
  return servicesPageData;
}
