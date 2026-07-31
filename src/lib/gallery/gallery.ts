import type { GalleryCandidate, GalleryItem } from '@/types/gallery';

/**
 * Quatre raisons de ne pas publier une photographie.
 *
 * Le Studio empêche déjà les trois premières de se produire par distraction,
 * mais la règle est rejouée ici : une photo publiée par erreur ne se rattrape
 * pas, et le carrousel est la seule partie du site où la paroisse dépose ses
 * propres images.
 *
 * - **pas de texte alternatif** : invisible pour une personne aveugle;
 * - **droits non confirmés** : personne ne saura dans deux ans si on avait le
 *   droit de la publier;
 * - **générée par intelligence artificielle** : le carrousel documente un lieu
 *   réel, une image inventée y mentirait;
 * - **une personne reconnaissable sans consentement** : ce n'est pas au site
 *   d'en décider.
 */
export function isGalleryItemPublic(candidate: GalleryCandidate): boolean {
  if (
    candidate.item.image.alt.trim().length === 0 ||
    !candidate.rightsCleared ||
    candidate.generatedByAi
  ) {
    return false;
  }

  return !candidate.containsRecognizablePeople || candidate.consentConfirmed;
}

/**
 * Les photographies publiables, dans l'ordre de la liste du Studio.
 *
 * Plus de tri par `order` : l'ordre du tableau fait foi, comme pour les groupes
 * de la page Vie paroissiale. Réordonner, c'est glisser une ligne.
 */
export function selectGalleryItems(
  candidates: readonly GalleryCandidate[],
): readonly GalleryItem[] {
  return candidates
    .filter(isGalleryItemPublic)
    .map((candidate) => candidate.item);
}

/**
 * La limite reste une garde, pas un réglage éditorial.
 *
 * Le carrousel affiche la liste telle quelle; ce plafond existe pour qu'une
 * liste devenue longue ne fasse pas charger vingt photographies sur l'accueil.
 */
export function selectHomepageGalleryItems(
  candidates: readonly GalleryCandidate[],
  limit: number,
): readonly GalleryItem[] {
  const safeLimit = Math.max(0, Math.floor(limit));

  return selectGalleryItems(candidates).slice(0, safeLimit);
}
