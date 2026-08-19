import type {
  AboutPageData,
  AboutPrinciple,
  AboutPrincipleSymbol,
  ArchitectProfile,
  ArchitectureFeature,
  HistoryImageKind,
  HistoryTimelineEntry,
} from '@/types/about';
import type { SanityAboutPageResult } from '@/lib/sanity/types';
// Chemin relatif, pas l'alias `@/` : ce module est chargé tel quel par
// `node --test`, qui ne connaît pas les alias de Vite.
import {
  normalizeSanityImage,
  type ImageSourceBuilder,
} from './normalizeSanityImage.ts';
import { normalizeSanitySeo } from './normalizeSanitySeo.ts';

type RawAbout = NonNullable<SanityAboutPageResult>;
type RawHistoryEntry = NonNullable<
  NonNullable<RawAbout['history']>['entries']
>[number];

const IMAGE_KINDS: readonly HistoryImageKind[] = [
  'ai-illustration',
  'documentary-photo',
  'current-photo',
];

const SYMBOLS: readonly AboutPrincipleSymbol[] = ['book', 'people', 'heart'];

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanList(
  values: readonly (string | null)[] | null | undefined,
  fallback: readonly string[],
): readonly string[] {
  const cleaned = (values ?? []).flatMap((value) => {
    const trimmed = cleanString(value);
    return trimmed ? [trimmed] : [];
  });

  return cleaned.length > 0 ? cleaned : fallback;
}

/**
 * Une nature d'image inconnue retombe sur l'illustration artistique.
 *
 * C'est la valeur la plus prudente : elle affiche « non documentaire ». Se
 * tromper dans l'autre sens présenterait une illustration comme une archive.
 */
function normalizeImageKind(
  value: string | null | undefined,
): HistoryImageKind {
  return IMAGE_KINDS.includes(value as HistoryImageKind)
    ? (value as HistoryImageKind)
    : 'ai-illustration';
}

/**
 * Un repère sans période, sans titre ou sans source n'est pas publiable.
 *
 * La source éditoriale s'affiche sur la page : un repère qui ne dit pas d'où
 * il vient raconterait l'histoire de la paroisse sans rien pour l'appuyer.
 */
function normalizeEntry(
  raw: RawHistoryEntry,
  index: number,
  buildSources: ImageSourceBuilder,
): HistoryTimelineEntry | undefined {
  const periodLabel = cleanString(raw.periodLabel);
  const title = cleanString(raw.title);
  const summary = cleanString(raw.summary);
  const sourceLabel = cleanString(raw.sourceLabel);
  if (!periodLabel || !title || !summary || !sourceLabel) return undefined;

  const body = (raw.body ?? []).flatMap((paragraph) => {
    const cleaned = cleanString(paragraph);
    return cleaned ? [cleaned] : [];
  });

  return {
    id: cleanString(raw._key) ?? `repere-${index + 1}`,
    periodLabel,
    title,
    summary,
    ...(body.length > 0 ? { body } : {}),
    image: normalizeSanityImage(raw.image, buildSources),
    imageKind: normalizeImageKind(raw.imageKind),
    sourceLabel,
    disclosure: cleanString(raw.disclosure),
  };
}

function normalizePrinciples(
  raw: NonNullable<RawAbout['principles']>['items'] | null | undefined,
  fallback: readonly AboutPrinciple[],
): readonly AboutPrinciple[] {
  const items = (raw ?? []).flatMap((entry) => {
    const title = cleanString(entry.title);
    const description = cleanString(entry.description);
    if (!title || !description) return [];

    return [
      {
        title,
        description,
        symbol: SYMBOLS.includes(entry.symbol as AboutPrincipleSymbol)
          ? (entry.symbol as AboutPrincipleSymbol)
          : 'book',
      },
    ];
  });

  return items.length > 0 ? items : fallback;
}

function normalizeFeatures(
  raw: NonNullable<RawAbout['architecture']>['features'] | null | undefined,
  fallback: readonly ArchitectureFeature[],
): readonly ArchitectureFeature[] {
  const features = (raw ?? []).flatMap((entry) => {
    const title = cleanString(entry.title);
    const description = cleanString(entry.description);
    return title && description ? [{ title, description }] : [];
  });

  return features.length > 0 ? features : fallback;
}

/**
 * Le doute est la valeur par défaut : une attribution non marquée « confirmée »
 * reste affichée comme à confirmer. Les rôles des deux architectes n'ont jamais
 * été validés par la paroisse.
 */
function normalizeProfiles(
  raw: NonNullable<RawAbout['architects']>['profiles'] | null | undefined,
  fallback: readonly ArchitectProfile[],
): readonly ArchitectProfile[] {
  const profiles = (raw ?? []).flatMap((entry) => {
    const name = cleanString(entry.name);
    const role = cleanString(entry.role);
    if (!name || !role) return [];

    return [
      {
        name,
        role,
        description: cleanString(entry.description),
        confirmationRequired: entry.confirmationRequired !== false,
      },
    ];
  });

  return profiles.length > 0 ? profiles : fallback;
}

/**
 * Fusionne le contenu Sanity avec le repli local, champ par champ.
 *
 * Deux choses ne viennent jamais de Sanity :
 *
 * - **les adresses des boutons**, qui sont des routes du site;
 * - **le `seo`**, comme sur les autres pages migrées.
 *
 * Aucune image n'a de repli : si Sanity ne répond pas, la page garde ses textes
 * et perd ses cadres. Un en-tête sans photographie reste lisible sur son fond
 * sombre, un repère de chronologie sans illustration reste un repère.
 */
export function normalizeSanityAboutPage(
  raw: SanityAboutPageResult,
  fallback: AboutPageData,
  buildSources: ImageSourceBuilder,
): AboutPageData {
  const history = raw?.history;
  const architects = raw?.architects;

  const entries = (history?.entries ?? []).flatMap((entry, index) => {
    const normalized = normalizeEntry(entry, index, buildSources);
    return normalized ? [normalized] : [];
  });

  const heroImage = normalizeSanityImage(
    raw?.hero?.image,
    buildSources,
    'hero',
  );

  const architectureImage = normalizeSanityImage(
    raw?.architecture?.image,
    buildSources,
  );

  return {
    seo: normalizeSanitySeo(raw?.seo, fallback.seo, buildSources),
    hero: {
      eyebrow: cleanString(raw?.hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: cleanString(raw?.hero?.title) ?? fallback.hero.title,
      introduction:
        cleanString(raw?.hero?.introduction) ?? fallback.hero.introduction,
      ...(heroImage ? { image: heroImage } : {}),
    },
    introduction: {
      eyebrow:
        cleanString(raw?.introduction?.eyebrow) ??
        fallback.introduction.eyebrow,
      accent:
        cleanString(raw?.introduction?.accent) ?? fallback.introduction.accent,
      title:
        cleanString(raw?.introduction?.title) ?? fallback.introduction.title,
      paragraphs: cleanList(
        raw?.introduction?.paragraphs,
        fallback.introduction.paragraphs,
      ),
    },
    history: {
      eyebrow: cleanString(history?.eyebrow) ?? fallback.history.eyebrow,
      title: cleanString(history?.title) ?? fallback.history.title,
      introduction:
        cleanString(history?.introduction) ?? fallback.history.introduction,
      illustrationDisclosure:
        cleanString(history?.illustrationDisclosure) ??
        fallback.history.illustrationDisclosure,
      entries: entries.length > 0 ? entries : fallback.history.entries,
      epilogue: cleanString(history?.epilogue?.title)
        ? {
            eyebrow: cleanString(history?.epilogue?.eyebrow),
            title: cleanString(history?.epilogue?.title) as string,
            paragraphs: cleanList(history?.epilogue?.paragraphs, []),
          }
        : fallback.history.epilogue,
    },
    principles: {
      eyebrow:
        cleanString(raw?.principles?.eyebrow) ?? fallback.principles.eyebrow,
      title: cleanString(raw?.principles?.title) ?? fallback.principles.title,
      items: normalizePrinciples(
        raw?.principles?.items,
        fallback.principles.items,
      ),
    },
    architecture: {
      eyebrow:
        cleanString(raw?.architecture?.eyebrow) ??
        fallback.architecture.eyebrow,
      title:
        cleanString(raw?.architecture?.title) ?? fallback.architecture.title,
      paragraphs: cleanList(
        raw?.architecture?.paragraphs,
        fallback.architecture.paragraphs,
      ),
      features: normalizeFeatures(
        raw?.architecture?.features,
        fallback.architecture.features,
      ),
      ...(architectureImage ? { image: architectureImage } : {}),
      ...(cleanString(raw?.architecture?.imageCaption)
        ? { imageCaption: cleanString(raw?.architecture?.imageCaption) }
        : {}),
    },
    architects: fallback.architects
      ? {
          eyebrow:
            cleanString(architects?.eyebrow) ?? fallback.architects.eyebrow,
          title: cleanString(architects?.title) ?? fallback.architects.title,
          introduction:
            cleanString(architects?.introduction) ??
            fallback.architects.introduction,
          profiles: normalizeProfiles(
            architects?.profiles,
            fallback.architects.profiles,
          ),
          validationCard: {
            eyebrow:
              cleanString(architects?.validationCard?.eyebrow) ??
              fallback.architects.validationCard.eyebrow,
            title:
              cleanString(architects?.validationCard?.title) ??
              fallback.architects.validationCard.title,
            text:
              cleanString(architects?.validationCard?.text) ??
              fallback.architects.validationCard.text,
          },
        }
      : undefined,
    closing: {
      accent: cleanString(raw?.closing?.accent) ?? fallback.closing.accent,
      title: cleanString(raw?.closing?.title) ?? fallback.closing.title,
      text: cleanString(raw?.closing?.text) ?? fallback.closing.text,
      primaryCta: {
        label:
          cleanString(raw?.closing?.primaryCtaLabel) ??
          fallback.closing.primaryCta.label,
        href: fallback.closing.primaryCta.href,
      },
      secondaryCta: fallback.closing.secondaryCta
        ? {
            label:
              cleanString(raw?.closing?.secondaryCtaLabel) ??
              fallback.closing.secondaryCta.label,
            href: fallback.closing.secondaryCta.href,
          }
        : undefined,
    },
  };
}
