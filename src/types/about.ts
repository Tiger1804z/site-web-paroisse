import type { ImageMetadata } from 'astro';

export type AboutContentStatus =
  | 'probably-stable'
  | 'legacy-source'
  | 'photo-source'
  | 'to-confirm'
  | 'temporary';

export interface AboutLink {
  readonly label: string;
  readonly href: string;
}

export interface AboutImage {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly desktopPosition?: string;
  readonly mobilePosition?: string;
  readonly caption?: string;
}

export interface AboutHero {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly image: AboutImage;
}

export interface AboutIntroduction {
  readonly eyebrow?: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly accent?: string;
  readonly status: AboutContentStatus;
}

export type HistoryImageKind =
  'ai-illustration' | 'documentary-photo' | 'current-photo';

export type HistoryEditorialStatus =
  'accepted-source' | 'to-confirm' | 'volatile';

export interface HistoryTimelineEntry {
  readonly id: string;
  readonly stepNumber: number;
  readonly periodLabel: string;
  readonly title: string;
  readonly summary: string;
  readonly body?: readonly string[];
  readonly image: ImageMetadata;
  readonly imageAlt: string;
  readonly imageKind: HistoryImageKind;
  readonly embeddedText: boolean;
  readonly sourceLabel: string;
  readonly editorialStatus: HistoryEditorialStatus;
  readonly disclosure?: string;
}

export interface HistoryTimelineContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly illustrationDisclosure: string;
  readonly entries: readonly HistoryTimelineEntry[];
  readonly epilogue?: {
    readonly eyebrow?: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
}

export type AboutPrincipleSymbol = 'book' | 'people' | 'heart';

export interface AboutPrinciple {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly symbol: AboutPrincipleSymbol;
  readonly status: AboutContentStatus;
}

export interface AboutPrinciples {
  readonly eyebrow: string;
  readonly title: string;
  readonly items: readonly AboutPrinciple[];
}

export interface ArchitectureFeature {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly status: AboutContentStatus;
}

export interface AboutArchitecture {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly features: readonly ArchitectureFeature[];
  readonly image: AboutImage;
}

export interface ArchitectProfile {
  readonly id: string;
  readonly name: string;
  readonly role: string;
  readonly description?: string;
  readonly confirmationRequired: boolean;
}

export interface AboutArchitects {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly profiles: readonly ArchitectProfile[];
  readonly validationCard: {
    readonly eyebrow: string;
    readonly title: string;
    readonly text: string;
  };
}

export interface AboutClosing {
  readonly accent?: string;
  readonly title: string;
  readonly text: string;
  readonly primaryCta: AboutLink;
  readonly secondaryCta?: AboutLink;
}

export interface AboutPageData {
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
  readonly hero: AboutHero;
  readonly introduction: AboutIntroduction;
  readonly history: HistoryTimelineContent;
  readonly principles: AboutPrinciples;
  readonly architecture: AboutArchitecture;
  readonly architects?: AboutArchitects;
  readonly closing: AboutClosing;
}
