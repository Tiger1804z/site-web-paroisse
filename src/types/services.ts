import type { ImageMetadata } from 'astro';

export type ParishServiceCategory =
  | 'sacrament'
  | 'pastoral'
  | 'memorial'
  | 'administrative'
  | 'devotional'
  | 'facility';

export type ServiceSurface = 'ivory' | 'paper' | 'charcoal' | 'burgundy';

export interface ServicesCallToAction {
  readonly label: string;
  readonly href: string;
}

export interface ServiceReviewMetadata {
  readonly sourceContext: 'current-public-site' | 'parish-questionnaire';
  readonly lastReviewedAt: string;
  readonly effectiveYear?: number;
  readonly effectivePeriod?: string;
  readonly requiresPeriodicReview: boolean;
}

export interface ParishServiceDetail {
  readonly label: string;
  readonly value: string;
  readonly confirmed: boolean;
  readonly review?: ServiceReviewMetadata;
}

export interface ServicesEditorialImage {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly documentary: boolean;
  readonly credit?: string;
  readonly objectPosition?: string;
  readonly frame: 'arch' | 'landscape' | 'organic' | 'oval' | 'portrait-offset';
}

export interface ParishService {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly category: ParishServiceCategory;
  readonly active: boolean;
  readonly order: number;
  readonly details?: readonly ParishServiceDetail[];
  readonly steps?: readonly string[];
  readonly note?: string;
  readonly cta?: ServicesCallToAction;
}

export interface ParishServiceChapter {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly surface: ServiceSurface;
  readonly order: number;
  readonly services: readonly ParishService[];
  readonly image?: ServicesEditorialImage;
}

export interface ServicesPageData {
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly canonicalPath: string;
  };
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    readonly images: readonly (ServicesEditorialImage & {
      readonly label: string;
    })[];
  };
  readonly notice: {
    readonly title: string;
    readonly message: string;
    readonly reviewDate: string;
  };
  readonly chapters: readonly ParishServiceChapter[];
  readonly paymentMethods: {
    readonly title: string;
    readonly description: string;
    readonly methods: readonly string[];
    readonly review: ServiceReviewMetadata;
  };
  readonly finalCta: {
    readonly title: string;
    readonly description: string;
    readonly primary: ServicesCallToAction;
  };
}
