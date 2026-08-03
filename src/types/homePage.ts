import type { GalleryItem } from '@/types/gallery';
import type { SanityRenderableImage } from '@/types/sanityImage';

/**
 * Contenu éditorial de la page d'accueil.
 *
 * Ce qui n'est pas ici est volontairement resté dans le code :
 *
 * - **les adresses des boutons** (`/horaires`, `/notre-paroisse`, `/contact/`) —
 *   ce sont des routes du site, pas du contenu. Seul le libellé se saisit;
 * - **les textes d'état vide** — « Horaires à confirmer » n'apparaît que si
 *   l'horaire des messes est absent. C'est un état dégradé, pas une décision
 *   éditoriale;
 * - **les coordonnées** affichées par la section « Venez nous rencontrer »,
 *   lues dans `siteSettings` comme partout ailleurs.
 */

/**
 * Un titre coupé en lignes.
 *
 * Le hero et la section « Ensemble » imposent leurs retours à la ligne pour la
 * typographie. Une seule chaîne obligerait à y accepter du HTML saisi dans le
 * Studio — ce que le modèle interdit. Une ligne par entrée, le composant les
 * assemble.
 */
export type TitleLines = readonly string[];

export interface HomeHeroContent {
  /** Petite ligne manuscrite au-dessus du titre. */
  readonly script: string;
  readonly titleLines: TitleLines;
  readonly introduction: string;
  readonly primaryCtaLabel: string;
  readonly secondaryCtaLabel: string;
  /** Titre de l'encart d'horaires, remplacé côté client par la prochaine messe. */
  readonly scheduleTitle: string;
  readonly scheduleLinkLabel: string;
  readonly scheduleNote: string;
  /** Peut être vide : l'en-tête garde alors son fond sombre. */
  readonly slides: readonly HomeHeroSlide[];
}

/** Une image du carrousel d'en-tête : un libellé, une image du Studio. */
export interface HomeHeroSlide {
  readonly label: string;
  readonly image: SanityRenderableImage;
}

export interface HomeQuote {
  readonly text: string;
  readonly attribution: string;
}

export interface HomeWelcomeContent {
  readonly script: string;
  readonly titleLines: TitleLines;
  readonly introduction: string;
  readonly quote?: HomeQuote;
  readonly linkLabel: string;
}

export interface HomeMassPreviewContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly ctaLabel: string;
  readonly specialTitle: string;
  readonly specialDescription: string;
}

export interface HomeVisitContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly contactCtaLabel: string;
  readonly directionsCtaLabel: string;
  /**
   * Illustration de la section, facultative. Absente, la section se compose
   * sans son cadre — aucun espace n'est réservé à une image qui n'existe pas.
   */
  readonly image?: SanityRenderableImage;
}

/**
 * Un groupe annoncé sur l'accueil.
 *
 * Le **nom** n'est pas saisi ici : il est lu dans la page Vie paroissiale, où
 * le groupe vit vraiment. L'accueil ne fait que le désigner et lui écrire une
 * ligne d'accroche. Renommer « Chorale » là-bas renomme aussi la rangée ici, et
 * un groupe désactivé disparaît des deux pages du même geste.
 */
export interface HomeGroupTeaser {
  readonly id: string;
  readonly name: string;
  readonly teaser: string;
}

export interface HomeParishLifeContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly groups: readonly HomeGroupTeaser[];
  readonly ctaLabel: string;
  /**
   * Illustration de la section, facultative. Absente, la section se compose
   * sans son cadre — aucun espace n'est réservé à une image qui n'existe pas.
   */
  readonly image?: SanityRenderableImage;
}

/**
 * Les quatre ancres de `/nos-services` vers lesquelles l'accueil peut pointer.
 *
 * Une liste fermée, pas une adresse saisissable : le Studio choisit une
 * destination connue, le code fabrique le lien. Une valeur inconnue fait
 * disparaître la ligne plutôt que de produire un lien mort.
 */
export type HomeServiceTarget =
  | 'sacrements-et-initiation'
  | 'accompagnement-et-documents'
  | 'priere-et-memoire'
  | 'location-de-salle';

export interface HomeServiceLink {
  readonly label: string;
  readonly target: HomeServiceTarget;
  readonly href: string;
}

export interface HomeThriftCard {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly linkLabel: string;
}

export interface HomeServicesContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly links: readonly HomeServiceLink[];
  readonly ctaLabel: string;
  /** Légende sous l'illustration. Sans illustration, elle ne s'affiche pas. */
  readonly visualNote?: string;
  readonly thrift: HomeThriftCard;
  /**
   * Illustration de la section, facultative. Absente, la section se compose
   * sans son cadre — aucun espace n'est réservé à une image qui n'existe pas.
   */
  readonly image?: SanityRenderableImage;
}

export interface HomeInterludeContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly linkLabel: string;
  /**
   * Illustration de la section, facultative. Absente, la section se compose
   * sans son cadre — aucun espace n'est réservé à une image qui n'existe pas.
   */
  readonly image?: SanityRenderableImage;
}

/**
 * Le carrousel de l'accueil.
 *
 * `items` ne vient jamais du repli local : les photographies sont téléversées
 * dans le Studio, et une photographie inventée n'existerait pas. Sans image
 * publiable, la section disparaît de la page.
 */
export interface HomeGalleryContent {
  readonly eyebrow: string;
  readonly title: string;
  readonly items: readonly GalleryItem[];
}

export interface HomePageData {
  readonly hero: HomeHeroContent;
  readonly welcome: HomeWelcomeContent;
  readonly massPreview: HomeMassPreviewContent;
  readonly parishLife: HomeParishLifeContent;
  readonly services: HomeServicesContent;
  readonly interlude: HomeInterludeContent;
  readonly gallery: HomeGalleryContent;
  readonly visit: HomeVisitContent;
}
