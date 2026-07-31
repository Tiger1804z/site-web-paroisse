import type { ImageMetadata } from 'astro';
import type { SanityRenderableImage } from '@/types/sanityImage';
import type { PublicPhone } from '@/types/siteSettings';

/**
 * Statut éditorial d'une fiche.
 *
 * Champ explicite, et non l'état de publication de Sanity : un brouillon Sanity
 * veut dire « modification en cours », pas « entente encore à vérifier ». Seul
 * `active` s'affiche.
 */
export type AdvertiserStatus =
  'active' | 'inactive' | 'draft' | 'confirmation-required';

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

export type AdvertiserWebsite = `https://${string}` | `http://${string}`;

export interface Advertiser {
  readonly id: string;
  readonly name: string;
  readonly category?: string;
  readonly description?: string;
  readonly address?: AdvertiserAddress;
  readonly phone?: AdvertiserPhone;
  readonly email?: AdvertiserEmail;
  /**
   * Seule adresse de lien que le CMS fournit sur ce site.
   *
   * Exception assumée : l'adresse d'un annonceur est son contenu à lui, et une
   * page de reconnaissance sans lien vers l'annonceur n'a pas de sens. Le lien
   * sortant est déclaré publicitaire par le composant.
   */
  readonly website?: AdvertiserWebsite;
  /**
   * Logo téléversé dans le Studio. Aucun repli local : sans logo, la fiche
   * affiche les initiales du nom.
   */
  readonly logo?: SanityRenderableImage;
  readonly status: AdvertiserStatus;
  readonly order: number;
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
