import { buildContactPageData } from '@/data/contact';
import { getSiteSettings } from '@/lib/content/getSiteSettings';
import type { ContactPageData } from '@/types/contact';

export async function getContactPageData(): Promise<ContactPageData> {
  const siteSettings = await getSiteSettings();
  const contactPageData = buildContactPageData(siteSettings);

  const confirmedMethods = contactPageData.methods
    .filter(({ active, status }) => active && status === 'confirmed')
    .toSorted((left, right) => left.order - right.order);

  const confirmedOfficeHours =
    contactPageData.officeHours?.active &&
    contactPageData.officeHours.status === 'confirmed'
      ? contactPageData.officeHours
      : undefined;

  return {
    ...contactPageData,
    methods: confirmedMethods,
    officeHours: confirmedOfficeHours,
  };
}
