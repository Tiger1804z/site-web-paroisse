import type { SanityRenderableImage } from '@/types/sanityImage';
// Chemins relatifs et extensions explicites : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`. L'alias reste réservé aux
// imports de types, effacés à l'exécution.
import {
  normalizeSanityImage,
  type ImageSourceBuilder,
  type RawSanityImage,
} from './normalizeSanityImage.ts';
import {
  SHARE_IMAGE_ASPECT_RATIO,
  SHARE_IMAGE_WIDTH,
} from '../sanity/image-sources.ts';

/**
 * L'image qu'un réseau social affichera à la place de la page.
 *
 * Elle passe par ici, et par ici seulement — l'image de la page comme celle du
 * site. Sept endroits composaient auparavant leur vignette avec le profil
 * courant, c'est-à-dire une image au format d'origine : les réseaux la
 * recadraient alors eux-mêmes, depuis le centre, sans rien savoir du sujet.
 *
 * Deux choses distinguent une vignette de partage d'une image de page :
 *
 *   1. son cadre est fixe (1200 × 630), donc le recadrage se fait au CDN et
 *      suit le point focal du Studio, pas le centre géométrique;
 *   2. ses dimensions sont annoncées dans le `<head>`, ce qui évite au réseau
 *      de télécharger le fichier avant de réserver la place de l'aperçu.
 *
 * `width` et `height` décrivent donc ici l'image réellement servie, et non le
 * fichier d'origine comme ailleurs dans le contrat. C'est la seule mesure
 * honnête : c'est cette adresse-là, et pas le fichier, que le réseau ira lire.
 */
export function normalizeShareImage(
  raw: RawSanityImage | null | undefined,
  buildSources: ImageSourceBuilder,
): SanityRenderableImage | undefined {
  const image = normalizeSanityImage(raw, buildSources, 'share');
  if (!image) return undefined;

  // Le CDN n'agrandit pas : une source plus étroite que 1200 px est servie à sa
  // largeur native, et la hauteur suit le même rapport. Annoncer 1200 × 630
  // dans ce cas serait une dimension fausse, que le réseau constaterait seul.
  const width = Math.min(SHARE_IMAGE_WIDTH, image.width ?? SHARE_IMAGE_WIDTH);

  return {
    ...image,
    width,
    height: Math.round(width / SHARE_IMAGE_ASPECT_RATIO),
  };
}
