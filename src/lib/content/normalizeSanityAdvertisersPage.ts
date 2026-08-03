import type { AdvertisersPageData } from '@/types/advertisers';
import type { SanityAdvertisersPageResult } from '@/lib/sanity/types';

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanList(
  values: readonly (string | null)[] | null | undefined,
): readonly string[] {
  return (values ?? []).flatMap((value) => {
    const cleaned = cleanString(value);
    return cleaned ? [cleaned] : [];
  });
}

/**
 * Fusionne le contenu de page Sanity avec le repli local, champ par champ.
 *
 * Quatre choses ne viennent jamais de Sanity :
 *
 * - **le `seo`**, `noindex` compris. Retirer `noindex` demande de confirmer les
 *   ententes, les coordonnées, les droits d'image et le texte de sollicitation :
 *   c'est une décision de code, documentée dans
 *   `docs/ADVERTISERS_CONTENT_AUDIT.md`, pas une case à cocher;
 * - **l'image de l'en-tête**, qui reste un fichier du projet avec son cadrage;
 * - **le téléphone**, lu dans `siteSettings` comme partout ailleurs;
 * - **l'adresse du second bouton**, toujours `/contact/`.
 *
 * La liste des annonceurs n'est pas ici non plus : elle vient de la collection.
 */
export function normalizeSanityAdvertisersPage(
  raw: SanityAdvertisersPageResult,
  fallback: AdvertisersPageData,
): AdvertisersPageData {
  const paragraphs = cleanList(raw?.introduction?.paragraphs);
  const details = cleanList(raw?.solicitation?.details);

  return {
    seo: fallback.seo,
    hero: {
      eyebrow: cleanString(raw?.hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: cleanString(raw?.hero?.title) ?? fallback.hero.title,
      introduction:
        cleanString(raw?.hero?.introduction) ?? fallback.hero.introduction,
      // L'image est composée par le getter, qui détient le constructeur
      // d'adresses du CDN.
    },
    introduction: {
      eyebrow:
        cleanString(raw?.introduction?.eyebrow) ??
        fallback.introduction.eyebrow,
      title:
        cleanString(raw?.introduction?.title) ?? fallback.introduction.title,
      paragraphs:
        paragraphs.length > 0 ? paragraphs : fallback.introduction.paragraphs,
      disclosure:
        cleanString(raw?.introduction?.disclosure) ??
        fallback.introduction.disclosure,
    },
    advertisers: fallback.advertisers,
    solicitation: {
      eyebrow:
        cleanString(raw?.solicitation?.eyebrow) ??
        fallback.solicitation.eyebrow,
      title:
        cleanString(raw?.solicitation?.title) ?? fallback.solicitation.title,
      description:
        cleanString(raw?.solicitation?.description) ??
        fallback.solicitation.description,
      details: details.length > 0 ? details : fallback.solicitation.details,
      phone: fallback.solicitation.phone,
      phoneLabel:
        cleanString(raw?.solicitation?.phoneLabel) ??
        fallback.solicitation.phoneLabel,
      contactLabel:
        cleanString(raw?.solicitation?.contactLabel) ??
        fallback.solicitation.contactLabel,
      contactHref: '/contact/',
    },
    settings: {
      // Une case décochée est une décision; seule une valeur absente laisse le
      // repli décider.
      showAdvertisers:
        typeof raw?.settings?.showAdvertisers === 'boolean'
          ? raw.settings.showAdvertisers
          : fallback.settings.showAdvertisers,
      showSolicitation:
        typeof raw?.settings?.showSolicitation === 'boolean'
          ? raw.settings.showSolicitation
          : fallback.settings.showSolicitation,
    },
  };
}
