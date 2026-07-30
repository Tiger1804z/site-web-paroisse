import type {
  ThriftStoreCallToAction,
  ThriftStorePageData,
  ThriftStorePracticalInformation,
  ThriftStoreSection,
} from '@/types/thriftStore';
import type {
  SanityThriftStorePageResult,
  SanityThriftStoreResult,
} from '@/lib/sanity/types';

type RawPage = NonNullable<SanityThriftStorePageResult>;
type RawSection = NonNullable<RawPage['sections']>[number];
type RawCta = NonNullable<RawPage['closing']>['primaryCta'] | undefined;

/** Destinations autorisées : l'éditrice choisit, le code construit l'adresse. */
const CTA_HREFS: Readonly<Record<string, string>> = {
  contact: '/contact/',
  events: '/evenements/',
  schedules: '/horaires/',
};

const CTA_DEFAULT_LABELS: Readonly<Record<string, string>> = {
  contact: 'Communiquer avec la paroisse',
  events: 'Voir les événements de la paroisse',
  schedules: 'Consulter les horaires',
};

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Un bouton sans destination connue n'existe pas : le repli local reprend la
 * main plutôt que d'afficher un lien vers nulle part.
 */
function normalizeCta(
  raw: RawCta,
  fallback: ThriftStoreCallToAction,
): ThriftStoreCallToAction {
  const target = raw?.target;
  const href = target ? CTA_HREFS[target] : undefined;
  if (!href || !target) return fallback;

  return {
    label:
      cleanString(raw?.label) ?? CTA_DEFAULT_LABELS[target] ?? fallback.label,
    href,
  };
}

function normalizeSection(raw: RawSection): ThriftStoreSection | undefined {
  const title = cleanString(raw.title);
  const description = cleanString(raw.description);

  // Sans titre ni description, le bloc serait une bande vide au milieu de la
  // page : on l'écarte.
  if (!title || !description) return undefined;

  return {
    id: raw._key,
    eyebrow: cleanString(raw.eyebrow) ?? '',
    title,
    description,
    active: raw.active !== false,
    visualKind: raw.visualKind === 'none' ? 'none' : 'clothing-rack',
  };
}

/**
 * Renseignements pratiques : ils viennent du document partagé `thriftStore`,
 * jamais de la page. Un champ vide n'est pas affiché — la page ne prétend pas
 * connaître une heure d'ouverture que la paroisse n'a pas publiée.
 */
export function normalizeSanityThriftStoreInformation(
  raw: SanityThriftStoreResult,
  fallback: ThriftStorePracticalInformation,
  contactCta: ThriftStoreCallToAction,
): ThriftStorePracticalInformation {
  if (!raw) return { ...fallback, contactCta };

  return {
    hours: cleanString(raw.hours),
    location: cleanString(raw.location),
    phone: cleanString(raw.phone),
    contactCta,
  };
}

/**
 * Fusionne le contenu de page Sanity avec le repli local.
 *
 * Les images du hero et les cadres de la galerie ne sont jamais remplacés :
 * ils restent des fichiers du projet tant que les visuels de page ne sont pas
 * migrés.
 */
export function normalizeSanityThriftStorePage(
  rawPage: SanityThriftStorePageResult,
  rawStore: SanityThriftStoreResult,
  fallback: ThriftStorePageData,
): ThriftStorePageData {
  const paragraphs = (rawPage?.introduction?.paragraphs ?? []).flatMap(
    (paragraph) => {
      const cleaned = cleanString(paragraph);
      return cleaned ? [cleaned] : [];
    },
  );

  const sections = (rawPage?.sections ?? []).flatMap((section) => {
    const normalized = normalizeSection(section);
    return normalized ? [normalized] : [];
  });

  const contactCta = normalizeCta(
    rawPage?.introduction?.contactCta,
    fallback.practicalInformation.contactCta,
  );

  return {
    seo: fallback.seo,
    hero: {
      eyebrow: cleanString(rawPage?.hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: cleanString(rawPage?.hero?.title) ?? fallback.hero.title,
      introduction:
        cleanString(rawPage?.hero?.introduction) ?? fallback.hero.introduction,
      slides: fallback.hero.slides,
    },
    introduction: {
      eyebrow:
        cleanString(rawPage?.introduction?.eyebrow) ??
        fallback.introduction.eyebrow,
      title:
        cleanString(rawPage?.introduction?.title) ??
        fallback.introduction.title,
      paragraphs:
        paragraphs.length > 0 ? paragraphs : fallback.introduction.paragraphs,
      priceNotice:
        cleanString(rawPage?.introduction?.priceNotice) ??
        fallback.introduction.priceNotice,
      photoPlaceholder: fallback.introduction.photoPlaceholder,
    },
    practicalInformation: normalizeSanityThriftStoreInformation(
      rawStore,
      fallback.practicalInformation,
      contactCta,
    ),
    sections: sections.length > 0 ? sections : fallback.sections,
    gallery: {
      eyebrow:
        cleanString(rawPage?.gallery?.eyebrow) ?? fallback.gallery.eyebrow,
      title: cleanString(rawPage?.gallery?.title) ?? fallback.gallery.title,
      introduction:
        cleanString(rawPage?.gallery?.introduction) ??
        fallback.gallery.introduction,
      placeholders: fallback.gallery.placeholders,
    },
    closing: {
      eyebrow:
        cleanString(rawPage?.closing?.eyebrow) ?? fallback.closing.eyebrow,
      title: cleanString(rawPage?.closing?.title) ?? fallback.closing.title,
      description:
        cleanString(rawPage?.closing?.description) ??
        fallback.closing.description,
      primaryCta: normalizeCta(
        rawPage?.closing?.primaryCta,
        fallback.closing.primaryCta,
      ),
      secondaryCta: normalizeCta(
        rawPage?.closing?.secondaryCta,
        fallback.closing.secondaryCta,
      ),
    },
  };
}
