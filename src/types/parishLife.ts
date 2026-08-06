import type { ImageMetadata } from 'astro';
import type { PageSeo } from '@/types/seo';
import type { SanityRenderableImage } from '@/types/sanityImage';

export interface ParishLifeCallToAction {
  readonly label: string;
  readonly href: string;
}

/**
 * Deux provenances possibles pour un visuel, et deux chemins de rendu.
 *
 * `image` : fichier du projet, optimisé au build par `astro:assets`, recadré par
 * des positions écrites à la main. C'est le repli, celui qui répond même sans
 * Sanity.
 *
 * `remote-image` : fichier téléversé dans le Studio, servi par le CDN, recadré
 * par le point focal posé par l'éditrice. C'est ce que la page affiche dès que
 * le document en fournit un.
 */
export interface ParishLifeImageVisual {
  readonly kind: 'image';
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly desktopPosition?: string;
  readonly mobilePosition?: string;
  readonly credit?: string;
}

export interface ParishLifeRemoteVisual {
  readonly kind: 'remote-image';
  readonly image: SanityRenderableImage;
}

export type ParishLifeVisual = ParishLifeImageVisual | ParishLifeRemoteVisual;

export interface ParishLifeLocalHeroImage {
  readonly kind: 'image';
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly label: string;
  readonly desktopPosition?: string;
  readonly mobilePosition?: string;
  readonly documentary: false;
  readonly generationStatus: 'ai-generated' | 'unconfirmed';
  readonly credit: string;
}

export interface ParishLifeRemoteHeroImage {
  readonly kind: 'remote-image';
  readonly label: string;
  readonly image: SanityRenderableImage;
}

export type ParishLifeHeroImage =
  ParishLifeLocalHeroImage | ParishLifeRemoteHeroImage;

/**
 * `id` est l'ancre du groupe : elle rattache aussi son image, restée un fichier
 * du projet.
 *
 * `status` a disparu en migrant — aucun composant ne l'affichait, et ce qui
 * reste à confirmer se dit déjà dans le texte. `order` aussi : l'ordre du
 * tableau fait foi.
 */
export interface ParishLifeFeature {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly summary: string;
  readonly highlights: readonly string[];
  readonly visual: ParishLifeVisual;
  readonly cta: ParishLifeCallToAction;
  readonly active: boolean;
}

export interface ParishLifePageData {
  readonly seo: PageSeo;
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
