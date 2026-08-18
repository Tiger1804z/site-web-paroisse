import type { ImageMetadata } from 'astro';
import type { PageSeo } from '@/types/seo';
import type { SanityRenderableImage } from '@/types/sanityImage';

export interface FirstVisitLink {
  readonly label: string;
  readonly href: string;
}

/**
 * Le repère visuel du bloc « Informations pratiques », en deux voies.
 *
 * `image` est un fichier du projet passé par `astro:assets` — c'est le repli,
 * celui qui rend la page quand Sanity ne répond pas. `remote-image` est servi
 * par le CDN Sanity avec son point focal. Les deux ne se mélangent pas : la
 * page affiche l'une ou l'autre.
 */
export interface FirstVisitLocalImage {
  readonly kind: 'image';
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly caption?: string;
  readonly desktopPosition?: string;
  readonly mobilePosition?: string;
}

export interface FirstVisitRemoteImage {
  readonly kind: 'remote-image';
  readonly image: SanityRenderableImage;
  readonly caption?: string;
}

export type FirstVisitImage = FirstVisitLocalImage | FirstVisitRemoteImage;

export interface FirstVisitHero {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
}

export interface VisitStep {
  readonly id: string;
  readonly numberLabel: string;
  readonly title: string;
  readonly description: string;
  readonly note?: string;
}

export interface VisitPreparation {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction?: string;
  readonly steps: readonly VisitStep[];
}

export interface ExpectationItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
}

export interface WhatToExpect {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction?: string;
  readonly items: readonly ExpectationItem[];
}

/**
 * Une ligne affichée du bloc « Informations pratiques ».
 *
 * Le contrat ne dit rien de la provenance de `value` : le normalisateur a déjà
 * résolu la source, qu'elle vienne des coordonnées de la paroisse ou du texte
 * de la page. Une ligne dont la source était vide n'arrive jamais jusqu'ici —
 * elle est écartée en amont plutôt que rendue entre crochets à quelqu'un qui
 * s'apprête à se déplacer.
 */
export interface PracticalInformationItem {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
}

export interface PracticalInformation {
  readonly eyebrow: string;
  readonly title: string;
  readonly items: readonly PracticalInformationItem[];
  readonly primaryCta: FirstVisitLink;
  readonly secondaryCta?: FirstVisitLink;
  readonly image?: FirstVisitImage;
}

export interface FirstVisitFaqItem {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
}

export interface FirstVisitFaq {
  readonly title: string;
  readonly items: readonly FirstVisitFaqItem[];
}

export interface FirstVisitPageData {
  readonly seo: PageSeo;
  readonly hero: FirstVisitHero;
  readonly preparation: VisitPreparation;
  readonly expectations: WhatToExpect;
  readonly practicalInformation: PracticalInformation;
  readonly faq?: FirstVisitFaq;
}

/**
 * D'où vient la valeur d'une ligne d'informations pratiques.
 *
 * Les quatre premières désignent les coordonnées de la paroisse : une adresse
 * ou un numéro de téléphone sont des faits sur le lieu, vrais indépendamment
 * de cette page, et déjà saisis une fois pour tout le site.
 */
export type PracticalInfoSource =
  | 'address'
  | 'phone'
  | 'parking'
  | 'accessibility'
  | 'pageText'
  | 'internalLink';

/**
 * Une ligne d'informations pratiques telle qu'elle est **écrite**, avant que sa
 * source ne soit résolue.
 */
export interface PracticalInfoRow {
  readonly id: string;
  readonly label: string;
  readonly source: PracticalInfoSource;
  /** Renseigné seulement quand `source` vaut `pageText`. */
  readonly value?: string;
  /** Renseignés seulement quand `source` vaut `internalLink`. */
  readonly linkLabel?: string;
  readonly linkTarget?: string;
}

export interface PracticalInformationContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly items: readonly PracticalInfoRow[];
  readonly primaryCta: FirstVisitLink;
  readonly secondaryCta?: FirstVisitLink;
  readonly image?: FirstVisitImage;
}

/**
 * La page telle qu'elle est saisie, dans le Studio comme dans le repli local.
 *
 * Se distingue de `FirstVisitPageData` sur un seul point : les lignes
 * d'informations pratiques y désignent encore leur source. C'est le getter qui
 * les résout contre les coordonnées de la paroisse, et il applique le même
 * traitement aux deux origines — un contenu Sanity et un repli local passent
 * par le même code, donc se comportent pareil.
 */
export interface FirstVisitPageContent {
  readonly seo: PageSeo;
  readonly hero: FirstVisitHero;
  readonly preparation: VisitPreparation;
  readonly expectations: WhatToExpect;
  readonly practicalInformation: PracticalInformationContent;
  readonly faq?: FirstVisitFaq;
}
