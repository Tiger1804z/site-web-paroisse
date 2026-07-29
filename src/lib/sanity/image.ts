import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

/**
 * Construction des adresses d'images servies par le CDN de Sanity.
 *
 * Les images locales continuent de passer par `astro:assets` : ce module ne
 * concerne que les images téléversées par l'éditrice. La différence n'est pas
 * un accident de migration — une image locale est un fichier du projet, connu
 * au build; une image Sanity change sans redéploiement.
 *
 * Le recadrage saisi dans le Studio (point focal et rognage) est appliqué par
 * la librairie officielle, à travers les paramètres d'adresse. C'est ce qui
 * permet à l'éditrice de remplacer une photo sans qu'un développeur ait à
 * régler le cadrage à la main.
 */
const builder = createImageUrlBuilder({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
});

/** Largeurs générées pour le `srcset`, du téléphone au grand écran. */
export const DEFAULT_IMAGE_WIDTHS = [480, 720, 960, 1280, 1600, 1920] as const;

export interface RemoteImageOptions {
  /** Largeurs à générer; par défaut `DEFAULT_IMAGE_WIDTHS`. */
  readonly widths?: readonly number[];
  /** Rapport largeur/hauteur imposé, pour un recadrage constant. */
  readonly aspectRatio?: number;
}

export interface RemoteImageSources {
  readonly src: string;
  readonly srcSet: string;
}

/**
 * Adresse principale et `srcset` d'une image Sanity.
 *
 * `auto('format')` laisse le CDN servir du WebP ou de l'AVIF selon le
 * navigateur, sans qu'on ait à gérer les variantes nous-mêmes.
 */
export function buildRemoteImageSources(
  source: SanityImageSource,
  options: RemoteImageOptions = {},
): RemoteImageSources {
  const widths = options.widths ?? DEFAULT_IMAGE_WIDTHS;

  const url = (width: number): string => {
    let image = builder.image(source).width(width).auto('format').quality(78);

    if (options.aspectRatio) {
      image = image.height(Math.round(width / options.aspectRatio));
    }

    // `fit: crop` avec le point focal du Studio : la partie choisie par
    // l'éditrice reste visible quel que soit le format demandé.
    return image.fit('crop').url();
  };

  const largest = widths[widths.length - 1] ?? 1280;

  return {
    src: url(largest),
    srcSet: widths.map((width) => `${url(width)} ${width}w`).join(', '),
  };
}
