import { loadQuery } from '@/lib/sanity/preview';
import { buildRemoteImageSources } from '@/lib/sanity/image';
import { buildContactPageData } from '@/data/contact';
import { normalizeSanityImage } from '@/lib/content/normalizeSanityImage';
import { getSiteSettings } from '@/lib/content/getSiteSettings';
import { CONTACT_PAGE_QUERY } from '@/lib/sanity/queries';
import type { SanityContactPageResult } from '@/lib/sanity/types';
import { normalizeSanityContactPage } from '@/lib/content/normalizeSanityContactPage';
import type { ContactPageData } from '@/types/contact';

async function fetchContactPageRaw(): Promise<SanityContactPageResult> {
  try {
    return await loadQuery(CONTACT_PAGE_QUERY);
  } catch (error) {
    console.error(
      '[getContactPageData] Échec du fetch Sanity — utilisation du repli local.',
      error,
    );
    return null;
  }
}

/**
 * Le repli local est construit d'abord, à partir des coordonnées de la paroisse.
 *
 * C'est lui qui décide quelles cartes existent, si le bloc des heures du
 * secrétariat s'affiche et quelles notes d'accès sont vraies. Le document Sanity
 * n'apporte ensuite que des textes.
 *
 * Le tri et le filtre par statut ont disparu avec les champs : les coordonnées
 * ne sont plus une liste éditoriale à ordonner, elles sont dérivées d'une source
 * unique et apparaissent quand la valeur existe.
 */
export async function getContactPageData(): Promise<ContactPageData> {
  const siteSettings = await getSiteSettings();
  const fallback = buildContactPageData(siteSettings);
  const raw = await fetchContactPageRaw();

  const page = normalizeSanityContactPage(raw, fallback);

  // Cette page n'affiche aucune image : son normalizer n'a donc pas de
  // constructeur d'adresses. Seule l'image de partage en demande un.
  const shareImage = normalizeSanityImage(raw?.seo?.image, (source) =>
    buildRemoteImageSources(
      source as Parameters<typeof buildRemoteImageSources>[0],
    ),
  );

  return {
    ...page,
    seo: { ...page.seo, ...(shareImage ? { shareImage } : {}) },
  };
}
