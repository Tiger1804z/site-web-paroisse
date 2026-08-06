import type { SanityRenderableImage } from '@/types/sanityImage';

/**
 * Référencement d'une page, tel que les composants le reçoivent.
 *
 * Une seule forme pour les dix pages : avant ce module, sept pages déclaraient
 * chacune la sienne, dont quatre variantes différentes selon qu'elles portaient
 * ou non `canonicalPath` et `noIndex`.
 *
 * Trois champs viennent de Sanity — titre, description, image de partage. Les
 * deux derniers viennent du code et ne sont saisissables nulle part : une
 * adresse canonique fausse ou un `noindex` posé par erreur ne se voient pas
 * dans le Studio, et se paient en pages disparues des résultats de recherche.
 */
export interface PageSeo {
  readonly title: string;
  readonly description: string;
  /**
   * Image affichée quand l'adresse de la page est partagée.
   *
   * Absente tant que l'éditrice n'en a pas déposé une. Le rendu retombe alors
   * sur l'image générale de `siteSettings` — et, si elle manque aussi, sur
   * aucune image du tout. Aucune image inventée pour remplir l'espace.
   */
  readonly shareImage?: SanityRenderableImage;
  /** Adresse canonique, quand la page en impose une. Décision de code. */
  readonly canonicalPath?: string;
  /** Interdiction d'indexation. Décision de code. */
  readonly noIndex?: boolean;
}
