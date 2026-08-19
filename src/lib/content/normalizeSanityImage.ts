import type { RemoteImageProfileName } from '@/lib/sanity/image-sources';
import type { SanityRenderableImage } from '@/types/sanityImage';

/**
 * Construit une adresse et un `srcset` à partir d'une image Sanity.
 *
 * Injecté plutôt qu'importé : le vrai constructeur lit `import.meta.env`, qui
 * n'existe pas sous `node --test`. Les getters fournissent l'implémentation
 * réelle, les tests une doublure — et la logique reste testable.
 *
 * Le profil dit à quoi sert l'image, pas comment la fabriquer : seul le
 * normalizer sait qu'une image donnée est un en-tête pleine largeur, et c'est
 * cette information-là qui décide des largeurs et de la qualité.
 */
export type ImageSourceBuilder = (
  source: unknown,
  profile?: RemoteImageProfileName,
) => {
  src: string;
  srcSet: string;
};

/**
 * Forme minimale attendue d'un objet image projeté par GROQ.
 *
 * Volontairement permissive : les projections des différentes pages ne
 * remontent pas toutes exactement les mêmes champs, et ce qui manque devient
 * simplement absent du résultat.
 */
export interface RawSanityImage {
  readonly alt?: string | null;
  readonly credit?: string | null;
  readonly image?: {
    readonly hotspot?: { readonly x?: number; readonly y?: number } | null;
    readonly asset?: {
      readonly _id?: string | null;
      readonly metadata?: {
        readonly lqip?: string | null;
        readonly dimensions?: {
          readonly width?: number | null;
          readonly height?: number | null;
        } | null;
      } | null;
    } | null;
  } | null;
}

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Une image sans fichier ou sans texte alternatif n'est pas publiable.
 *
 * Le Studio l'interdit déjà, mais un document créé avant cette règle, ou une
 * image dont l'asset a été supprimé, ne doit pas produire une balise vide.
 */
export function normalizeSanityImage(
  raw: RawSanityImage | null | undefined,
  buildSources: ImageSourceBuilder,
  profile: RemoteImageProfileName = 'default',
): SanityRenderableImage | undefined {
  const alt = cleanString(raw?.alt);
  const image = raw?.image;
  if (!alt || !image?.asset?._id) return undefined;

  const dimensions = image.asset.metadata?.dimensions;
  const { src, srcSet } = buildSources(image, profile);
  const hotspot = image.hotspot;

  return {
    src,
    srcSet,
    alt,
    width: dimensions?.width ?? undefined,
    height: dimensions?.height ?? undefined,
    lqip: image.asset.metadata?.lqip ?? undefined,
    focalPoint:
      typeof hotspot?.x === 'number' && typeof hotspot?.y === 'number'
        ? { x: hotspot.x, y: hotspot.y }
        : undefined,
    credit: cleanString(raw?.credit),
  };
}
