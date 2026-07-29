export type ScheduleNoticeSeverity = 'info' | 'important' | 'special';

/**
 * Jour de la semaine en valeur machine — même union que le schéma Sanity.
 * Les libellés français en sont dérivés, jamais saisis à la main.
 */
export type ScheduleWeekday =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

/**
 * Célébration hebdomadaire sous forme calculable, en parallèle du contrat
 * d'affichage `ScheduleEntry` qui, lui, ne porte que des libellés.
 *
 * `time` (`HH:mm`) est la seule source de vérité horaire : les minutes se
 * dérivent avec `parseTimeToMinutes`, elles ne sont jamais stockées.
 */
export interface WeeklyMassEntry {
  readonly id: string;
  readonly weekday: ScheduleWeekday;
  readonly time: string;
  readonly title: string;
  readonly note?: string;
}

/** Célébration à venir, résolue par `getUpcomingMasses` pour un instant donné. */
export interface UpcomingMass extends WeeklyMassEntry {
  /** Nombre de jours civils jusqu'à la célébration : 0 = aujourd'hui. */
  readonly dayOffset: number;
  readonly dayLabel: string;
  /** « Aujourd'hui », « Demain », sinon le jour de la semaine. */
  readonly relativeDayLabel: string;
  readonly timeLabel: string;
}

export interface ScheduleLink {
  readonly label: string;
  readonly href: string;
  readonly active?: boolean;
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
    readonly active: boolean;
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
  readonly active: boolean;
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
