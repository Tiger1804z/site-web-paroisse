import type { ImageMetadata } from 'astro';

export type ParishLifeContentStatus =
  'stable-direction' | 'temporary' | 'to-confirm';

export interface ParishLifeCallToAction {
  readonly label: string;
  readonly href: string;
}

export interface ParishLifeImageVisual {
  readonly kind: 'image';
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly desktopPosition?: string;
  readonly mobilePosition?: string;
  readonly credit?: string;
}

export interface ParishLifeHeroImage {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly label: string;
  readonly desktopPosition?: string;
  readonly mobilePosition?: string;
  readonly documentary: false;
  readonly generationStatus: 'ai-generated' | 'unconfirmed';
  readonly credit: string;
}

export interface ParishLifeFeature {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly visual: ParishLifeImageVisual;
  readonly cta: ParishLifeCallToAction;
  readonly status: ParishLifeContentStatus;
  readonly active: boolean;
  readonly order: number;
}

export interface ParishLifePageData {
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    readonly images: readonly ParishLifeHeroImage[];
  };
  readonly introduction: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly confirmationNote?: string;
  };
  readonly features: readonly ParishLifeFeature[];
  readonly participation: {
    readonly accent?: string;
    readonly title: string;
    readonly description: string;
    readonly cta: ParishLifeCallToAction;
  };
}
