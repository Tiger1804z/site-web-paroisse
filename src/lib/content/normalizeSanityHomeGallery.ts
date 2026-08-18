import type { GalleryCandidate } from '@/types/gallery';
// Chemin relatif, pas l'alias `@/` : ce module est chargé tel quel par
// `node --test`, qui ne connaît pas les alias de Vite.
import {
  normalizeSanityImage,
  type ImageSourceBuilder,
  type RawSanityImage,
} from './normalizeSanityImage.ts';

export interface RawGalleryPhoto {
  readonly _key?: string | null;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly rightsCleared?: boolean | null;
  readonly consentConfirmed?: boolean | null;
  readonly photo?:
    | (RawSanityImage & {
        readonly containsRecognizablePeople?: boolean | null;
        readonly generatedByAi?: boolean | null;
      })
    | null;
}

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Convertit les photographies du Studio en candidates à la publication.
 *
 * Rien n'est filtré ici : cette fonction décrit, `isGalleryItemPublic` décide.
 * Les deux restent séparées pour que la règle de publication soit lisible d'un
 * seul endroit, et testable sans fabriquer d'images.
 *
 * Une photographie sans fichier, sans texte alternatif ou sans titre n'est
 * même pas candidate — il n'y aurait rien à afficher.
 *
 * Les drapeaux absents valent « non » : un champ jamais rempli ne doit pas
 * ouvrir la publication d'une image dont les droits n'ont pas été vérifiés.
 */
export function normalizeSanityHomeGallery(
  raw: readonly (RawGalleryPhoto | null)[] | null | undefined,
  buildSources: ImageSourceBuilder,
): readonly GalleryCandidate[] {
  return (raw ?? []).flatMap((entry, index) => {
    const title = cleanString(entry?.title);
    const image = normalizeSanityImage(entry?.photo, buildSources);
    if (!title || !image) return [];

    return [
      {
        item: {
          id: cleanString(entry?._key) ?? `gallery-${index}`,
          title,
          description: cleanString(entry?.description) ?? '',
          image,
        },
        rightsCleared: entry?.rightsCleared === true,
        generatedByAi: entry?.photo?.generatedByAi === true,
        containsRecognizablePeople:
          entry?.photo?.containsRecognizablePeople === true,
        consentConfirmed: entry?.consentConfirmed === true,
      },
    ];
  });
}
