import type { SanityRenderableImage } from '@/types/sanityImage';

/**
 * Référencement d'une page, tel que les composants le reçoivent.
 *
 * Une seule forme pour les dix pages : avant ce module, sept pages déclaraient
 * chacune la sienne, dont quatre variantes différentes.
 *
 * Ce que l'éditrice contrôle, et rien d'autre : titre, description, image de
 * partage. L'adresse canonique et l'interdiction d'indexation ont quitté ce
 * contrat pour le registre de routes (`src/lib/seo/routes.ts`) — elles ne sont
 * saisissables nulle part, parce qu'une canonique fausse ou un `noindex` posé
 * par erreur ne se voient pas dans une interface d'édition et se paient en
 * pages disparues des résultats de recherche.
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
}
