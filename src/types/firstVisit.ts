import type { ImageMetadata } from 'astro';

export type FirstVisitContentStatus = 'temporary' | 'to-confirm';

export interface FirstVisitLink {
  readonly label: string;
  readonly href: string;
}

export interface FirstVisitImage {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly caption?: string;
  readonly desktopPosition?: string;
  readonly mobilePosition?: string;
}

export interface FirstVisitHero {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
}

export interface VisitStep {
  readonly id: string;
  readonly numberLabel: string;
  readonly title: string;
  readonly description: string;
  readonly note?: string;
  readonly status: FirstVisitContentStatus;
}

export interface VisitPreparation {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction?: string;
  readonly steps: readonly VisitStep[];
}

export interface ExpectationItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface WhatToExpect {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction?: string;
  readonly items: readonly ExpectationItem[];
}

export type PracticalInformationSource = 'site-settings' | 'page';

export interface PracticalInformationItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly confirmationRequired: boolean;
  readonly futureSource: PracticalInformationSource;
}

export interface PracticalInformation {
  readonly eyebrow: string;
  readonly title: string;
  readonly items: readonly PracticalInformationItem[];
  readonly primaryCta: FirstVisitLink;
  readonly secondaryCta?: FirstVisitLink;
  readonly image?: FirstVisitImage;
}

export interface FirstVisitFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface FirstVisitFaq {
  readonly title: string;
  readonly items: readonly FirstVisitFaqItem[];
}

export interface FirstVisitPageData {
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
  readonly hero: FirstVisitHero;
  readonly preparation: VisitPreparation;
  readonly expectations: WhatToExpect;
  readonly practicalInformation: PracticalInformation;
  readonly faq?: FirstVisitFaq;
}
