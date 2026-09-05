import type { PageSeo } from '@/types/seo';
// Chemin relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`. L'alias reste réservé aux
// imports de types, effacés à l'exécution.
import {
  type ImageSourceBuilder,
  type RawSanityImage,
} from './normalizeSanityImage.ts';
import { normalizeShareImage } from './normalizeShareImage.ts';

interface RawSeo {
  readonly title?: string | null;
  readonly description?: string | null;
  readonly image?: RawSanityImage | null;
}

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Compose le bloc de référencement d'une page.
 *
 * `...fallback` en premier : `canonicalPath` et `noIndex` traversent sans que
 * Sanity puisse les toucher, puisqu'ils n'y existent pas. Seuls le titre, la
 * description et l'image se remplacent.
 *
 * `buildSources` est facultatif. Quatre pages — accueil, horaires, contact,
 * annonceurs — ont un normalizer sans constructeur d'adresses; leur getter
 * compose l'image après coup, exactement comme il le fait déjà pour leur image
 * de premier écran. Sans constructeur, l'image de partage est simplement
 * absente, et le rendu retombe sur celle du site.
 */
export function normalizeSanitySeo(
  raw: RawSeo | null | undefined,
  fallback: PageSeo,
  buildSources?: ImageSourceBuilder,
): PageSeo {
  const shareImage = buildSources
    ? normalizeShareImage(raw?.image, buildSources)
    : undefined;

  return {
    ...fallback,
    title: cleanString(raw?.title) ?? fallback.title,
    description: cleanString(raw?.description) ?? fallback.description,
    ...(shareImage ? { shareImage } : {}),
  };
}
