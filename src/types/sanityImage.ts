/**
 * Une image téléversée dans Sanity, prête à être rendue.
 *
 * Contrairement aux images locales, elle n'est pas connue au build : on ne
 * manipule donc pas un objet `astro:assets` mais une adresse déjà servie par le
 * CDN, recadrée selon le point focal choisi par l'éditrice.
 *
 * Ce contrat est né avec les événements et sert désormais à plusieurs pages :
 * il vit ici plutôt que dans le contrat d'une page en particulier.
 */
export interface SanityRenderableImage {
  readonly src: string;
  readonly srcSet: string;
  readonly alt: string;
  /** Dimensions d'origine, pour réserver la place avant le chargement. */
  readonly width?: number;
  readonly height?: number;
  /** Vignette floue encodée, affichée pendant le chargement. */
  readonly lqip?: string;
  /**
   * Point focal choisi dans le Studio, en fractions de 0 à 1.
   *
   * Les cadres du site n'ont pas tous un format fixe : plusieurs s'étirent à
   * la hauteur de leur colonne. Le recadrage se fait donc dans le navigateur,
   * par `object-position`, et non par l'adresse de l'image.
   */
  readonly focalPoint?: { readonly x: number; readonly y: number };
  readonly credit?: string;
  readonly caption?: string;
}
