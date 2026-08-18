import type { SanityRenderableImage } from '@/types/sanityImage';

/**
 * Une photographie du carrousel de l'accueil.
 *
 * Plus d'`ImageMetadata` : depuis la migration, ces photographies sont
 * téléversées dans le Studio et servies par le CDN de Sanity. Le carrousel est
 * le seul endroit du site où la paroisse choisit elle-même les images.
 *
 * Ce qui a disparu du contrat, faute d'être rendu nulle part : `slug`,
 * `category`, `featured`, `layout`, `source`, `captureDate`, `order` et
 * `homepageVisible`. L'ordre est celui de la liste dans le Studio, et être dans
 * la liste, c'est être visible.
 */
export interface GalleryItem {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly image: SanityRenderableImage;
}

/**
 * Ce qu'il faut savoir d'une photographie avant de décider si elle se publie.
 *
 * Séparé de `GalleryItem` : ces champs ne sont pas rendus, ils autorisent le
 * rendu. Le jour où l'un d'eux se met à mentir, c'est la publication qui est en
 * cause, pas l'affichage.
 */
export interface GalleryCandidate {
  readonly item: GalleryItem;
  /** Les droits de publication sont confirmés pour ce site. */
  readonly rightsCleared: boolean;
  readonly generatedByAi: boolean;
  readonly containsRecognizablePeople: boolean;
  readonly consentConfirmed: boolean;
}
