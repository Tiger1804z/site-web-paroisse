import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url';

/**
 * Construction des adresses d'images du CDN Sanity, sans lire l'environnement.
 *
 * Le module reçoit son projet et son dataset : c'est ce qui le rend testable
 * sous `node --test`, où `import.meta.env` n'existe pas. `image.ts` en fait
 * l'instance réelle du site.
 */

/** Largeurs générées pour le `srcset`, du téléphone au grand écran. */
export const DEFAULT_IMAGE_WIDTHS = [480, 720, 960, 1280, 1600, 1920] as const;

/**
 * Largeurs des en-têtes pleine largeur.
 *
 * Un en-tête occupe toute la fenêtre : sur un écran de 1600 px CSS en densité
 * double, le navigateur réclame 3200 px de source. L'échelle par défaut
 * plafonnait à 1920, donc le navigateur agrandissait cette image et le détail
 * partait. Les petits barreaux sont conservés : un téléphone continue de
 * télécharger une image de téléphone.
 */
export const HERO_IMAGE_WIDTHS = [
  720, 960, 1280, 1600, 1920, 2560, 3200,
] as const;

export const DEFAULT_IMAGE_QUALITY = 78;

/**
 * Les en-têtes sont la première image vue, en très grand, souvent derrière un
 * voile sombre qui fait ressortir le bruit de compression. Sept points de
 * qualité de plus s'y voient; ailleurs ils ne feraient qu'alourdir.
 */
export const HERO_IMAGE_QUALITY = 85;

/** Qualité appliquée à partir d'une largeur, la dernière atteinte l'emporte. */
export type ImageQualityLadder = readonly {
  readonly fromWidth: number;
  readonly quality: number;
}[];

export const DEFAULT_IMAGE_QUALITY_LADDER: ImageQualityLadder = [
  { fromWidth: 0, quality: DEFAULT_IMAGE_QUALITY },
];

/**
 * La qualité redescend là où l'œil ne peut plus la voir.
 *
 * Mesuré sur la photographie d'accueil (4624 px) servie en WebP par le CDN :
 * 1920 px à 78 pesait 166 ko, à 85 il pèse 290 ko; 3200 px à 85 pèse 684 ko,
 * à 72 il pèse 392 ko. Un barreau de 3200 px n'est choisi que par un écran en
 * densité double, qui affiche chaque pixel de la source à demi-taille : le
 * bruit de compression y est moyenné, la définition non. Garder 85 jusqu'à
 * 1920 px et redescendre au-delà achète donc la netteté sans payer deux fois.
 */
export const HERO_IMAGE_QUALITY_LADDER: ImageQualityLadder = [
  { fromWidth: 0, quality: HERO_IMAGE_QUALITY },
  { fromWidth: 2560, quality: 76 },
  { fromWidth: 3200, quality: 72 },
];

/** La qualité qui s'applique à cette largeur. */
export const resolveImageQuality = (
  ladder: ImageQualityLadder,
  width: number,
): number => {
  const applicable = ladder
    .filter((step) => width >= step.fromWidth)
    .sort((first, second) => first.fromWidth - second.fromWidth);

  return (
    applicable[applicable.length - 1]?.quality ??
    ladder[0]?.quality ??
    DEFAULT_IMAGE_QUALITY
  );
};

/**
 * Largeur de l'adresse `src`, servie aux rares clients qui ignorent `srcset`.
 *
 * Elle reste au plafond d'hier : les barreaux à très haute résolution existent
 * pour que le navigateur les choisisse, pas pour être téléchargés d'office.
 */
export const FALLBACK_SOURCE_WIDTH = 1920;

/**
 * Format de la vignette de partage, imposé par les réseaux.
 *
 * Facebook, Messenger, WhatsApp et LinkedIn recadrent eux-mêmes toute image
 * qui n'est pas au format 1,91:1, et ils recadrent depuis le centre. Une photo
 * en 4:3 y perd donc le haut et le bas — sur la vue extérieure de l'église,
 * exactement les cloches. Mieux vaut recadrer ici, où le point focal choisi
 * dans le Studio décide de ce qu'on garde.
 */
export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;
export const SHARE_IMAGE_ASPECT_RATIO = SHARE_IMAGE_WIDTH / SHARE_IMAGE_HEIGHT;

/**
 * La vignette de partage n'est jamais choisie par le navigateur : elle est lue
 * par un robot qui télécharge une adresse et s'arrête là. Un seul barreau, donc,
 * et une qualité un peu plus haute que le courant — l'image est petite, elle
 * représente la paroisse, et personne ne la paie deux fois.
 */
export const SHARE_IMAGE_QUALITY_LADDER: ImageQualityLadder = [
  { fromWidth: 0, quality: 82 },
];

export type RemoteImageProfileName = 'default' | 'hero' | 'share';

export const REMOTE_IMAGE_PROFILES: Record<
  RemoteImageProfileName,
  {
    readonly widths: readonly number[];
    readonly quality: ImageQualityLadder;
    /** Format imposé au profil, quand le cadre de destination est fixe. */
    readonly aspectRatio?: number;
  }
> = {
  default: {
    widths: DEFAULT_IMAGE_WIDTHS,
    quality: DEFAULT_IMAGE_QUALITY_LADDER,
  },
  hero: { widths: HERO_IMAGE_WIDTHS, quality: HERO_IMAGE_QUALITY_LADDER },
  share: {
    widths: [SHARE_IMAGE_WIDTH],
    quality: SHARE_IMAGE_QUALITY_LADDER,
    aspectRatio: SHARE_IMAGE_ASPECT_RATIO,
  },
};

export interface RemoteImageOptions {
  /** Profil de rendu; `default` sauf pour les en-têtes pleine largeur. */
  readonly profile?: RemoteImageProfileName;
  /** Largeurs à générer; par défaut celles du profil. */
  readonly widths?: readonly number[];
  /** Qualité JPEG/WebP/AVIF imposée à toutes les largeurs; sinon celle du profil. */
  readonly quality?: number;
  /** Rapport largeur/hauteur imposé, pour un recadrage constant. */
  readonly aspectRatio?: number;
}

export interface RemoteImageSources {
  readonly src: string;
  readonly srcSet: string;
}

export interface RemoteImageBuilderConfig {
  readonly projectId: string;
  readonly dataset: string;
}

/** `image-<hash>-<largeur>x<hauteur>-<extension>` : le format des références. */
const ASSET_DIMENSIONS = /-(\d+)x(\d+)(?:-|\.|$)/;

type RawAssetLike = {
  _id?: unknown;
  _ref?: unknown;
  metadata?: { dimensions?: { width?: unknown } | null } | null;
};

type RawImageLike = {
  asset?: RawAssetLike | null;
  crop?: {
    left?: unknown;
    right?: unknown;
  } | null;
};

const finitePositive = (value: unknown): number | undefined =>
  typeof value === 'number' && Number.isFinite(value) && value > 0
    ? value
    : undefined;

const widthFromReference = (reference: unknown): number | undefined => {
  if (typeof reference !== 'string') return undefined;
  const match = ASSET_DIMENSIONS.exec(reference);
  return match ? finitePositive(Number(match[1])) : undefined;
};

/**
 * Largeur réellement disponible dans le fichier d'origine.
 *
 * Le rognage saisi dans le Studio compte : la librairie le traduit en `rect`,
 * donc une image de 3000 px rognée de moitié n'offre plus que 1500 px. Sans
 * cette lecture, le `srcset` annoncerait une largeur que le CDN ne peut pas
 * servir, et le navigateur choisirait une source trop petite en croyant
 * l'inverse.
 */
export const readSourceWidth = (source: unknown): number | undefined => {
  if (typeof source === 'string') return widthFromReference(source);
  if (typeof source !== 'object' || source === null) return undefined;

  const image = source as RawImageLike & RawAssetLike;
  const asset = image.asset ?? (image as RawAssetLike);
  const assetWidth =
    finitePositive(asset?.metadata?.dimensions?.width) ??
    widthFromReference(asset?._ref) ??
    widthFromReference(asset?._id);

  if (assetWidth === undefined) return undefined;

  const left = finitePositive(image.crop?.left) ?? 0;
  const right = finitePositive(image.crop?.right) ?? 0;
  const kept = 1 - left - right;

  if (kept <= 0 || kept > 1) return Math.round(assetWidth);
  return Math.max(1, Math.round(assetWidth * kept));
};

/**
 * Les largeurs qu'il est honnête de demander pour cette image.
 *
 * Au-delà du fichier d'origine, le CDN ne peut qu'agrandir : mieux vaut
 * s'arrêter à la largeur native, une seule fois, que promettre trois barreaux
 * identiques sous des étiquettes différentes.
 */
export const resolveImageWidths = (
  widths: readonly number[],
  sourceWidth?: number,
): number[] => {
  const ordered = [...new Set(widths)].sort((first, second) => first - second);
  if (sourceWidth === undefined) return ordered;

  const usable = ordered.filter((width) => width < sourceWidth);
  if (usable.length === ordered.length) return ordered;

  return [...usable, Math.round(sourceWidth)];
};

/** La largeur servie à `src`, jamais la plus grande sans nécessité. */
export const resolveFallbackWidth = (widths: readonly number[]): number => {
  const reasonable = widths.filter((width) => width <= FALLBACK_SOURCE_WIDTH);
  return (
    reasonable[reasonable.length - 1] ?? widths[0] ?? FALLBACK_SOURCE_WIDTH
  );
};

/**
 * Adresse principale et `srcset` d'une image Sanity.
 *
 * `auto('format')` laisse le CDN servir du WebP ou de l'AVIF selon le
 * navigateur, sans qu'on ait à gérer les variantes nous-mêmes.
 */
export const createRemoteImageSources = (config: RemoteImageBuilderConfig) => {
  const builder = createImageUrlBuilder(config);

  return (
    source: SanityImageSource,
    options: RemoteImageOptions = {},
  ): RemoteImageSources => {
    const profile = REMOTE_IMAGE_PROFILES[options.profile ?? 'default'];
    const requested = options.widths ?? profile.widths;
    const ladder: ImageQualityLadder =
      options.quality === undefined
        ? profile.quality
        : [{ fromWidth: 0, quality: options.quality }];
    const widths = resolveImageWidths(requested, readSourceWidth(source));
    // Le format du profil sert de valeur par défaut : l'appelant garde le
    // dernier mot, mais un profil au cadre fixe n'a pas à être rappelé à chaque
    // appel — c'est ainsi qu'un recadrage finit par manquer à un endroit.
    const aspectRatio = options.aspectRatio ?? profile.aspectRatio;

    const url = (width: number): string => {
      const image = builder
        .image(source)
        .width(width)
        .auto('format')
        .quality(resolveImageQuality(ladder, width));

      // Un format n'est imposé que si l'appelant ou le profil en fournit un.
      // Sans hauteur, Sanity renvoie l'image entière : le cadrage est alors
      // fait par le navigateur, via le point focal posé en `object-position`.
      // C'est ce qu'il faut pour la plupart des cadres du site, qui s'étirent à
      // la hauteur de leur colonne et n'ont pas de format connu à l'avance.
      if (aspectRatio) {
        return image
          .height(Math.round(width / aspectRatio))
          .fit('crop')
          .url();
      }

      return image.url();
    };

    return {
      src: url(resolveFallbackWidth(widths)),
      srcSet: widths.map((width) => `${url(width)} ${width}w`).join(', '),
    };
  };
};
