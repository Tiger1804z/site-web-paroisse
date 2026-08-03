import type {
  EventCategory,
  EventsPageData,
  EventVisual,
} from '@/types/events';
import type {
  EventsPageSettings,
  HomepageEventsSettings,
  ParishEventImage,
} from '@/types/parish-events';
import type {
  SanityEventsPageResult,
  SanityHomePageResult,
} from '@/lib/sanity/types';
import type { ImageSourceBuilder } from '@/lib/content/normalizeSanityParishEvents';
// Chemin relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`.
import { normalizeSanityImage } from './normalizeSanityImage.ts';

type RawEventsPage = NonNullable<SanityEventsPageResult>;
type RawCategory = NonNullable<RawEventsPage['categories']>[number];

/**
 * Les illustrations animées sont des composants codés : leur description
 * accessible appartient donc au code, pas au CMS. L'éditrice peut la préciser,
 * mais ne peut pas la laisser vide.
 */
const ILLUSTRATION_LABELS = {
  'clothing-rack':
    'Illustration animée d’un portant présentant plusieurs vêtements',
  'community-meal':
    'Illustration animée d’une tasse de café chaud et d’un repas partagé',
  'generations-chain':
    'Illustration représentant une chaîne intergénérationnelle formée par un enfant, un adolescent, une adulte et une aînée.',
} as const;

/** Destinations autorisées : l'éditrice choisit, le code construit l'adresse. */
const CTA_HREFS: Readonly<Record<string, string | undefined>> = {
  schedules: '/horaires/',
  thriftStore: '/friperie/',
  contact: '/contact/',
};

const CTA_DEFAULT_LABELS: Readonly<Record<string, string | undefined>> = {
  schedules: 'Consulter les horaires',
  thriftStore: 'Découvrir la friperie',
  contact: 'Communiquer avec la paroisse',
};

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeVisual(
  raw: RawCategory,
  buildSources: ImageSourceBuilder,
): EventVisual | undefined {
  const kind = raw.visualKind;

  if (kind === 'image') {
    const alt = cleanString(raw.image?.alt);
    const image = raw.image?.image;
    if (!alt || !image?.asset?._id) return undefined;

    const dimensions = image.asset.metadata?.dimensions;
    const { src, srcSet } = buildSources(image);
    const hotspot = image.hotspot;

    const remote: ParishEventImage = {
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
      credit: cleanString(raw.image?.credit),
    };

    return { kind: 'remote-image', image: remote };
  }

  if (
    kind === 'clothing-rack' ||
    kind === 'community-meal' ||
    kind === 'generations-chain'
  ) {
    return {
      kind,
      accessibleLabel:
        cleanString(raw.illustrationLabel) ?? ILLUSTRATION_LABELS[kind],
    };
  }

  return undefined;
}

function normalizeCategory(
  raw: RawCategory,
  buildSources: ImageSourceBuilder,
): EventCategory | undefined {
  const title = cleanString(raw.title);
  const summary = cleanString(raw.summary);
  const visual = normalizeVisual(raw, buildSources);

  // Sans titre ni description, la carte serait un trou dans la grille : on
  // l'écarte. Un visuel manquant, lui, ne la disqualifie pas — la carte
  // s'affiche alors sans son cadre.
  if (!title || !summary) return undefined;

  const ctaHref = raw.ctaTarget ? CTA_HREFS[raw.ctaTarget] : undefined;

  return {
    id: raw._key,
    slug: raw._key,
    title,
    summary,
    category: raw.kind ?? 'community',
    visual,
    featured: raw.featured === true,
    active: raw.active !== false,
    confirmationRequired: raw.confirmationRequired !== false,
    cta: ctaHref
      ? {
          label:
            cleanString(raw.ctaLabel) ??
            CTA_DEFAULT_LABELS[raw.ctaTarget as string] ??
            'En savoir plus',
          href: ctaHref,
        }
      : undefined,
  };
}

/**
 * Fusionne le contenu de page Sanity avec le repli local.
 *
 * L'image du hero n'est jamais remplacée : elle reste un fichier du projet
 * tant que les visuels de page ne sont pas migrés.
 */
export function normalizeSanityEventsPage(
  raw: SanityEventsPageResult,
  fallback: EventsPageData,
  buildSources: ImageSourceBuilder,
): EventsPageData {
  const categories = (raw?.categories ?? []).flatMap((category) => {
    const normalized = normalizeCategory(category, buildSources);
    return normalized ? [normalized] : [];
  });

  const heroImage = normalizeSanityImage(raw?.hero?.image, buildSources);

  return {
    seo: fallback.seo,
    hero: {
      eyebrow: cleanString(raw?.hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: cleanString(raw?.hero?.title) ?? fallback.hero.title,
      introduction:
        cleanString(raw?.hero?.introduction) ?? fallback.hero.introduction,
      ...(heroImage ? { image: heroImage } : {}),
    },
    overview: {
      eyebrow: cleanString(raw?.overview?.eyebrow) ?? fallback.overview.eyebrow,
      title: cleanString(raw?.overview?.title) ?? fallback.overview.title,
      introduction:
        cleanString(raw?.overview?.introduction) ??
        fallback.overview.introduction,
      confirmationNote:
        cleanString(raw?.overview?.confirmationNote) ??
        fallback.overview.confirmationNote,
    },
    categories: categories.length > 0 ? categories : fallback.categories,
  };
}

/** Réglages des sections d'activités de `/evenements`. */
export function normalizeSanityEventsPageSettings(
  raw: SanityEventsPageResult,
  fallback: EventsPageSettings,
): EventsPageSettings {
  return {
    showUpcomingSection: raw?.showUpcomingSection !== false,
    showPastSection: raw?.showPastSection !== false,
    upcomingSectionTitle:
      cleanString(raw?.upcomingSectionTitle) ?? fallback.upcomingSectionTitle,
    pastSectionTitle:
      cleanString(raw?.pastSectionTitle) ?? fallback.pastSectionTitle,
    upcomingLimit:
      typeof raw?.upcomingLimit === 'number'
        ? raw.upcomingLimit
        : fallback.upcomingLimit,
    pastLimit:
      typeof raw?.pastLimit === 'number' ? raw.pastLimit : fallback.pastLimit,
  };
}

/** Réglages de la section des activités sur l'accueil. */
export function normalizeSanityHomePageEvents(
  raw: SanityHomePageResult,
  fallback: HomepageEventsSettings,
): HomepageEventsSettings {
  return {
    showHomepageUpcomingSection: raw?.showUpcomingEvents !== false,
    homepageUpcomingTitle:
      cleanString(raw?.upcomingEventsTitle) ?? fallback.homepageUpcomingTitle,
    homepageUpcomingLimit:
      typeof raw?.upcomingEventsLimit === 'number' &&
      raw.upcomingEventsLimit > 0
        ? raw.upcomingEventsLimit
        : fallback.homepageUpcomingLimit,
  };
}
