import { schedulePageData } from '@/data/schedules';
import type { SchedulePageData } from '@/types/schedule';

export async function getSchedulePageData(): Promise<SchedulePageData> {
  return {
    ...schedulePageData,
    faq: schedulePageData.faq.filter(({ active }) => active),
  };
}
