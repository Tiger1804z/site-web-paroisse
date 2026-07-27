import type { ImageMetadata } from 'astro';
import type { PublicPhone } from '@/types/siteSettings';

export type AdvertiserStatus =
  'active' | 'inactive' | 'draft' | 'confirmation-required';

export type AdvertiserMediaStatus =
  'confirmed' | 'temporary' | 'replacement-required';

export interface AdvertiserMedia {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly credit?: string;
  readonly status: AdvertiserMediaStatus;
}

export interface AdvertiserAddress {
  readonly lines: readonly string[];
}

export interface AdvertiserPhone {
  readonly display: string;
  readonly href: `tel:${string}`;
}

export interface AdvertiserEmail {
  readonly display: string;
  readonly href: `mailto:${string}`;
}

export interface AdvertiserWebsite {
  readonly label: string;
  readonly href: `https://${string}` | `http://${string}`;
}

export interface Advertiser {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly category?: string;
  readonly description?: string;
  readonly address?: AdvertiserAddress;
  readonly phone?: AdvertiserPhone;
  readonly email?: AdvertiserEmail;
  readonly website?: AdvertiserWebsite;
  readonly logo?: AdvertiserMedia;
  readonly images?: readonly AdvertiserMedia[];
  readonly status: AdvertiserStatus;
  readonly featured: boolean;
  readonly order: number;
  readonly validFrom?: string;
  readonly validUntil?: string;
  readonly lastConfirmedAt?: string;
  readonly confirmationNote?: string;
}

export interface AdvertisersPageData {
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
    readonly image: ImageMetadata;
    readonly imageAlt: string;
    readonly objectPosition?: string;
  };
  readonly introduction: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly disclosure: string;
  };
  readonly advertisers: readonly Advertiser[];
  readonly solicitation: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly details: readonly string[];
    readonly phone: PublicPhone;
    readonly phoneLabel: string;
    readonly contactLabel: string;
    readonly contactHref: '/contact/';
  };
  readonly settings: {
    readonly showAdvertisers: boolean;
    readonly showSolicitation: boolean;
  };
}
