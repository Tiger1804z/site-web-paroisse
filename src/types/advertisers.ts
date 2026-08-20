import type { PageSeo } from '@/types/seo';
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

/**
 * Le numéro d'un annonceur.
 *
 * `href` est facultatif : une saisie qui n'a pas dix chiffres n'ouvre pas de
 * lien, et le numéro principal de la paroisse n'en ouvre jamais. Dans les deux
 * cas le numéro s'affiche quand même — seul le geste qui déclenche l'appel
 * disparaît.
 */
export interface AdvertiserPhone {
  readonly display: string;
  readonly href?: `tel:${string}`;
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
    /**
     * Le numéro du secrétariat, affiché sans bouton d'appel.
     *
     * Il n'y a plus qu'un bouton dans ce bloc, et il mène à la page Contact :
     * la paroisse a retiré tout déclenchement d'appel d'un seul geste sur son
     * numéro principal, que le secrétariat reçoit à domicile à toute heure.
     */
    readonly phone: PublicPhone;
    readonly contactLabel: string;
    readonly contactHref: '/contact/';
  };
  readonly settings: {
    readonly showAdvertisers: boolean;
    readonly showSolicitation: boolean;
  };
}
