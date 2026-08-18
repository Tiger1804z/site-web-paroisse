import type { GalleryItem } from '@/types/gallery';
import type { PageSeo } from '@/types/seo';
import type { SanityRenderableImage } from '@/types/sanityImage';

export interface ThriftStoreCallToAction {
  readonly label: string;
  readonly href: string;
}

/** Une image du carrousel d'en-tête : un libellé, une image du Studio. */
export interface ThriftStoreHeroSlide {
  readonly label: string;
  readonly image: SanityRenderableImage;
}

/**
 * Renseignements pratiques de la friperie.
 *
 * Chaque champ est facultatif : une valeur absente n'est pas affichée. Le
 * couple `{value, confirmed}` d'avant la migration n'apportait rien — un
 * renseignement non confirmé n'a de toute façon pas de valeur à publier.
 */
export interface ThriftStorePracticalInformation {
  readonly hours?: string;
  readonly location?: string;
  /** Ligne propre à la friperie, distincte du secrétariat de la paroisse. */
  readonly phone?: string;
  readonly contactCta: ThriftStoreCallToAction;
}

export interface ThriftStoreSection {
  /** Sert d'ancre HTML. Vient de la clé Sanity, jamais saisi par l'éditrice. */
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly active: boolean;
  /** L'ordre d'affichage est celui du tableau, pas un numéro à tenir à jour. */
  readonly visualKind: 'clothing-rack' | 'none';
}

export interface ThriftStorePageData {
  readonly seo: PageSeo;
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    /**
     * Images du hero, affichées en alternance. La première est rendue par le
     * serveur; la rotation et la loupe sont des améliorations du navigateur.
     *
     * Peut être vide : l'en-tête garde alors son fond sombre.
     */
    readonly slides: readonly ThriftStoreHeroSlide[];
  };
  readonly introduction: {
    readonly eyebrow: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
    readonly priceNotice: string;
  };
  readonly practicalInformation: ThriftStorePracticalInformation;
  readonly sections: readonly ThriftStoreSection[];
  /**
   * Galerie du local.
   *
   * Tant qu'aucune photographie publiable n'est déposée, la section entière
   * disparaît. Les six cadres « photographie réelle prévue » qui occupaient
   * cette place annonçaient un chantier sur une page publique, et la paroisse
   * ne pouvait pas les remplacer elle-même.
   */
  readonly gallery: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    readonly items: readonly GalleryItem[];
  };
  readonly closing: {
    readonly eyebrow: string;
    readonly title: string;
    readonly description: string;
    readonly primaryCta: ThriftStoreCallToAction;
    readonly secondaryCta: ThriftStoreCallToAction;
  };
}
