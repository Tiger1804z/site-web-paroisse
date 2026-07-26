import { aboutPageData } from '@/data/about';
import type { AboutPageData } from '@/types/about';

export async function getAboutPageData(): Promise<AboutPageData> {
  return aboutPageData;
}
