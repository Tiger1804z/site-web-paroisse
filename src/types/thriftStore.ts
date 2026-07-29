import type { ImageMetadata } from 'astro';

export type ThriftStoreImageStatus =
  'confirmed' | 'temporary' | 'placeholder' | 'rights-unverified';

export interface ThriftStoreCallToAction {
  readonly label: string;
  readonly href: string;
}

export interface ThriftStoreImage {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly credit?: string;
  readonly sourceNote: string;
  readonly status: ThriftStoreImageStatus;
  readonly replacementNote: string;
}

export type ThriftStoreInformationField =
  | {
      readonly value: string;
      readonly confirmed: true;
    }
  | {
      readonly value?: string;
      readonly confirmed: false;
    };

export interface ThriftStoreSection {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly active: boolean;
  readonly order: number;
  readonly visualKind: 'clothing-rack' | 'none';
}

export interface ThriftStorePhotoPlaceholder {
  readonly id: string;
  readonly subject: string;
  readonly ratio: '4:3' | '1:1' | '3:4' | '16:9';
  readonly orientation: 'landscape' | 'portrait' | 'square';
}

export interface ThriftStorePageData {
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly canonicalPath: string;
    readonly noIndex: boolean;
  };
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    /**
     * Images du hero, affichées en alternance. La première est rendue par le
     * serveur; la rotation et la loupe sont des améliorations du navigateur.
     */
    readonly slides: readonly ThriftStoreImage[];
  };
  readonly introduction: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly priceNotice: string;
    readonly photoPlaceholder: ThriftStorePhotoPlaceholder;
  };
  readonly practicalInformation: {
    readonly hours: ThriftStoreInformationField;
    readonly location: ThriftStoreInformationField;
    readonly donationConditions: ThriftStoreInformationField;
    readonly responsibleContact: ThriftStoreInformationField;
    readonly pricingNote: ThriftStoreInformationField;
    readonly specialSalesNote: ThriftStoreInformationField;
    readonly contactCta: ThriftStoreCallToAction;
  };
  readonly sections: readonly ThriftStoreSection[];
  readonly gallery: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    readonly placeholders: readonly ThriftStorePhotoPlaceholder[];
  };
  readonly closing: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly primaryCta: ThriftStoreCallToAction;
    readonly secondaryCta: ThriftStoreCallToAction;
  };
}
