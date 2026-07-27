import type { GalleryItem } from '@/types/gallery';

export function isGalleryItemPublic(item: GalleryItem): boolean {
  if (
    item.status !== 'published' ||
    item.rightsStatus !== 'approved-for-site' ||
    item.alt.trim().length === 0 ||
    !item.documentary ||
    item.generatedByAi
  ) {
    return false;
  }

  return !item.containsRecognizablePeople || item.consentConfirmed === true;
}

export function getPublishedGalleryItems(
  items: readonly GalleryItem[],
): GalleryItem[] {
  return items
    .filter(isGalleryItemPublic)
    .toSorted((left, right) => left.order - right.order);
}

export function selectHomepageGalleryItems(
  items: readonly GalleryItem[],
  limit: number,
): GalleryItem[] {
  const safeLimit = Math.max(0, Math.floor(limit));

  return getPublishedGalleryItems(items)
    .filter(({ homepageVisible }) => homepageVisible)
    .slice(0, safeLimit);
}
