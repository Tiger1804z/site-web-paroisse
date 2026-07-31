import type { ImageMetadata } from 'astro';
import type { SanityRenderableImage } from '@/types/sanityImage';

export interface AboutLink {
  readonly label: string;
  readonly href: string;
}

/**
 * Image locale de la page.
 *
 * Le hero et le cadre d'architecture restent des fichiers du dépôt : ce sont
 * des visuels de page, pas du contenu. Un ticket dédié migrera tous les visuels
 * de page ensemble. Les illustrations de la chronologie, elles, ont suivi leur
 * repère dans Sanity — un repère sans son image est un repère cassé.
 */
export interface AboutImage {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly desktopPosition?: string;
  readonly mobilePosition?: string;
  readonly caption?: string;
}

export interface AboutHero {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly image: AboutImage;
}

export interface AboutIntroduction {
  readonly eyebrow?: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly accent?: string;
}

/**
 * Ce que montre l'image d'un repère.
 *
 * Décide de la légende sous l'image et du cadre qui l'entoure. Une illustration
 * générée n'a pas le droit de se présenter comme une archive : la distinction
 * est portée par le contenu, pas par la mise en page.
 */
export type HistoryImageKind =
  'ai-illustration' | 'documentary-photo' | 'current-photo';

export interface HistoryTimelineEntry {
  readonly id: string;
  readonly periodLabel: string;
  readonly title: string;
  readonly summary: string;
  readonly body?: readonly string[];
  /**
   * Absente si Sanity n'a pas répondu : le repli local porte les textes, pas
   * les illustrations. Le repère s'affiche alors sans son cadre plutôt que de
   * disparaître.
   */
  readonly image?: SanityRenderableImage;
  readonly imageKind: HistoryImageKind;
  readonly sourceLabel: string;
  readonly disclosure?: string;
}

export interface HistoryTimelineContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly illustrationDisclosure: string;
  readonly entries: readonly HistoryTimelineEntry[];
  readonly epilogue?: {
    readonly eyebrow?: string;
    readonly title: string;
    readonly paragraphs: readonly string[];
  };
}

export type AboutPrincipleSymbol = 'book' | 'people' | 'heart';

export interface AboutPrinciple {
  readonly title: string;
  readonly description: string;
  readonly symbol: AboutPrincipleSymbol;
}

export interface AboutPrinciples {
  readonly eyebrow: string;
  readonly title: string;
  readonly items: readonly AboutPrinciple[];
}

export interface ArchitectureFeature {
  readonly title: string;
  readonly description: string;
}

export interface AboutArchitecture {
  readonly eyebrow: string;
  readonly title: string;
  readonly paragraphs: readonly string[];
  readonly features: readonly ArchitectureFeature[];
  readonly image: AboutImage;
}

export interface ArchitectProfile {
  readonly name: string;
  readonly role: string;
  readonly description?: string;
  readonly confirmationRequired: boolean;
}

export interface AboutArchitects {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly profiles: readonly ArchitectProfile[];
  readonly validationCard: {
    readonly eyebrow: string;
    readonly title: string;
    readonly text: string;
  };
}

export interface AboutClosing {
  readonly accent?: string;
  readonly title: string;
  readonly text: string;
  readonly primaryCta: AboutLink;
  readonly secondaryCta?: AboutLink;
}

export interface AboutPageData {
  readonly seo: {
    readonly title: string;
    readonly description: string;
  };
  readonly hero: AboutHero;
  readonly introduction: AboutIntroduction;
  readonly history: HistoryTimelineContent;
  readonly principles: AboutPrinciples;
  readonly architecture: AboutArchitecture;
  readonly architects?: AboutArchitects;
  readonly closing: AboutClosing;
}
