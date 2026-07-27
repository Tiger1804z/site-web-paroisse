import type { ImageMetadata } from 'astro';

export type GalleryCategory = 'architecture' | 'liturgy' | 'details';

export type GalleryImageStatus =
  'published' | 'draft' | 'rights-pending' | 'replacement-needed';

export type GalleryRightsStatus = 'approved-for-site' | 'pending';

export type GalleryLayout = 'landscape' | 'tall';

export interface GalleryItem {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly description: string;
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly category: GalleryCategory;
  readonly status: GalleryImageStatus;
  readonly rightsStatus: GalleryRightsStatus;
  readonly featured: boolean;
  readonly homepageVisible: boolean;
  readonly order: number;
  readonly layout: GalleryLayout;
  readonly objectPosition?: string;
  readonly credit?: string;
  readonly source: string;
  readonly documentary: boolean;
  readonly generatedByAi: boolean;
  readonly containsRecognizablePeople: boolean;
  readonly consentConfirmed?: boolean;
  readonly captureDate?: string;
}
