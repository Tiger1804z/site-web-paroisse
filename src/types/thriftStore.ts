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
  readonly practicalInformation: ThriftStorePracticalInformation;
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
