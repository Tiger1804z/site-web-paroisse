import type { ImageMetadata } from 'astro';

export type SacramentsEditorialStatus =
  'stable' | 'temporary' | 'to-confirm' | 'volatile';

export interface SacramentsCallToAction {
  readonly label: string;
  readonly href: string;
}

export interface SacramentsImage {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly desktopPosition?: string;
  readonly mobilePosition?: string;
}

export interface SacramentsHero {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly image: SacramentsImage;
}

export interface SacramentsNotice {
  readonly title: string;
  readonly message: string;
  readonly active: boolean;
  readonly primaryCta?: SacramentsCallToAction;
}

export interface SacramentInformationList {
  readonly title: string;
  readonly items: readonly string[];
}

export interface SacramentSummary {
  readonly kind: 'sacrament';
  readonly id: string;
  readonly slug: string;
  readonly tabLabel: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly status: SacramentsEditorialStatus;
  readonly detailPageAvailable: boolean;
  readonly image: SacramentsImage;
  readonly information?: SacramentInformationList;
  readonly notice?: {
    readonly title: string;
    readonly message: string;
  };
  readonly primaryCta?: SacramentsCallToAction;
}

export interface ParishServiceSummary {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly status: SacramentsEditorialStatus;
  readonly detailPageAvailable: boolean;
}

export interface ParishServicesOverview {
  readonly kind: 'services';
  readonly id: string;
  readonly tabLabel: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly services: readonly ParishServiceSummary[];
  readonly primaryCta?: SacramentsCallToAction;
}

export type SacramentsOverviewItem = SacramentSummary | ParishServicesOverview;

export interface ProcessStep {
  readonly id: string;
  readonly numberLabel: string;
  readonly title: string;
  readonly description: string;
}

export interface GeneralProcess {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction?: string;
  readonly steps: readonly ProcessStep[];
  readonly primaryCta?: SacramentsCallToAction;
}

export interface SacramentsFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface SacramentsFaq {
  readonly title: string;
  readonly items: readonly SacramentsFaqItem[];
}

export interface SacramentsPageData {
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
  readonly hero: SacramentsHero;
  readonly notice?: SacramentsNotice;
  readonly overview: {
    readonly items: readonly SacramentsOverviewItem[];
  };
  readonly generalProcess?: GeneralProcess;
  readonly faq?: SacramentsFaq;
}
