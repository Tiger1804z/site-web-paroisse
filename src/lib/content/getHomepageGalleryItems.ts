import { galleryItems } from '@/data/gallery';
import { selectHomepageGalleryItems } from '@/lib/gallery/gallery';
import type { GalleryItem } from '@/types/gallery';

export async function getHomepageGalleryItems(
  limit = 6,
): Promise<readonly GalleryItem[]> {
  return selectHomepageGalleryItems(galleryItems, limit);
}
