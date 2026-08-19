import type { SanityImageSource } from '@sanity/image-url';
import {
  createRemoteImageSources,
  type RemoteImageOptions,
  type RemoteImageProfileName,
  type RemoteImageSources,
} from '@/lib/sanity/image-sources';

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
 *
 * Le calcul des largeurs et de la qualité vit dans `image-sources.ts`, qui ne
 * lit pas l'environnement et se teste donc sans navigateur ni build.
 */
const buildSources = createRemoteImageSources({
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID,
  dataset: import.meta.env.PUBLIC_SANITY_DATASET,
});

export {
  DEFAULT_IMAGE_QUALITY,
  DEFAULT_IMAGE_WIDTHS,
  HERO_IMAGE_QUALITY,
  HERO_IMAGE_WIDTHS,
  type RemoteImageOptions,
  type RemoteImageSources,
} from '@/lib/sanity/image-sources';

export function buildRemoteImageSources(
  source: SanityImageSource,
  options: RemoteImageOptions = {},
): RemoteImageSources {
  return buildSources(source, options);
}

/**
 * Le constructeur injecté dans les normalizers.
 *
 * Ils reçoivent des objets image issus de GROQ, dont le type précis varie d'une
 * projection à l'autre; la conversion vit ici plutôt que recopiée à chaque
 * appel. Le profil traverse sans être interprété : c'est l'appelant qui sait
 * qu'une image est un en-tête pleine largeur.
 */
export function buildImageSources(
  source: unknown,
  profile: RemoteImageProfileName = 'default',
): RemoteImageSources {
  return buildSources(source as SanityImageSource, { profile });
}

export type { RemoteImageProfileName };
