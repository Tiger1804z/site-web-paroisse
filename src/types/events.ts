import type { PageSeo } from '@/types/seo';
import type { SanityRenderableImage } from '@/types/sanityImage';
import type { ImageMetadata } from 'astro';
import type { ParishEventImage } from '@/types/parish-events';

export type EventCategoryKind =
  'cultural' | 'liturgical' | 'community' | 'mutual-aid';

export interface EventCallToAction {
  readonly label: string;
  readonly href: string;
}

export interface EventImageVisual {
  readonly kind: 'image';
  readonly image: ImageMetadata;
  readonly imageAlt: string;
  readonly position?: string;
}

export interface EventClothingRackVisual {
  readonly kind: 'clothing-rack';
  readonly accessibleLabel: string;
}

export interface EventCommunityMealVisual {
  readonly kind: 'community-meal';
  readonly accessibleLabel: string;
}

export interface EventGenerationsChainVisual {
  readonly kind: 'generations-chain';
  readonly accessibleLabel: string;
}

/**
 * Image téléversée dans Sanity, par opposition à `EventImageVisual` qui reste
 * un fichier du projet. Les deux coexistent pendant la migration : le hero de
 * la page est encore local, les catégories viennent du CMS.
 */
export interface EventRemoteImageVisual {
  readonly kind: 'remote-image';
  readonly image: ParishEventImage;
}

export type EventVisual =
  | EventImageVisual
  | EventRemoteImageVisual
  | EventClothingRackVisual
  | EventCommunityMealVisual
  | EventGenerationsChainVisual;

export interface EventCategory {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly category: EventCategoryKind;
  /**
   * Facultatif. Une catégorie sans visuel exploitable reste une carte lisible :
   * son titre et son résumé suffisent. Le cadre ne se réserve pas une place
   * qu'il ne remplira pas.
   */
  readonly visual?: EventVisual;
  readonly featured: boolean;
  readonly active: boolean;
  readonly confirmationRequired: boolean;
  readonly cta?: EventCallToAction;
}

export interface EventsPageData {
  readonly seo: PageSeo;
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    /**
     * Photographie du premier écran, facultative. Sans elle, l'en-tête garde son
     * fond sombre : le titre reste lisible, aucun cadre vide n'apparaît.
     */
    readonly image?: SanityRenderableImage;
  };
  readonly overview: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    readonly confirmationNote: string;
  };
  readonly categories: readonly EventCategory[];
}
