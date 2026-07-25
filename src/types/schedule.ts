export type ScheduleNoticeSeverity = 'info' | 'important' | 'special';

export interface ScheduleLink {
  readonly label: string;
  readonly href: string;
}

export interface ScheduleHero {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly imageAlt: string;
}

export interface ScheduleTime {
  readonly label: string;
  readonly note?: string;
}

export interface ScheduleEntry {
  readonly id: string;
  readonly dayLabel: string;
  readonly times: readonly ScheduleTime[];
  readonly note?: string;
}

export interface SchedulePeriod {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly validFromLabel?: string;
  readonly validUntilLabel?: string;
  readonly entries: readonly ScheduleEntry[];
  readonly active: boolean;
}

export interface ScheduleNotice {
  readonly id: string;
  readonly title: string;
  readonly message: string;
  readonly severity: ScheduleNoticeSeverity;
  readonly active: boolean;
  readonly action?: ScheduleLink;
}

export interface SpecialCelebration {
  readonly id: string;
  readonly title: string;
  readonly dateLabel: string;
  readonly timeLabel?: string;
  readonly note?: string;
}

export interface BeforeYouVisitContent {
  readonly title: string;
  readonly message: string;
  readonly contactLink: ScheduleLink;
  readonly bulletinLink: ScheduleLink;
}

export interface ScheduleSidebarContent {
  readonly bulletin: {
    readonly eyebrow: string;
    readonly title: string;
    readonly periodLabel: string;
    readonly link: ScheduleLink;
  };
  readonly office: {
    readonly eyebrow: string;
    readonly hoursLabel: string;
    readonly message: string;
    readonly link: ScheduleLink;
  };
}

export interface ScheduleFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface SchedulePageData {
  readonly hero: ScheduleHero;
  readonly notice?: ScheduleNotice;
  readonly regularSchedule: SchedulePeriod;
  readonly seasonalSchedules: readonly SchedulePeriod[];
  readonly specialCelebrations: readonly SpecialCelebration[];
  readonly specialCelebrationsEmptyMessage: string;
  readonly lastUpdatedLabel: string;
  readonly beforeYouVisit: BeforeYouVisitContent;
  readonly sidebar: ScheduleSidebarContent;
  readonly faq: readonly ScheduleFaqItem[];
}
