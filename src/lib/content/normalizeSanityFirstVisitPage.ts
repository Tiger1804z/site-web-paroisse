import type {
  ExpectationItem,
  FirstVisitFaqItem,
  FirstVisitImage,
  FirstVisitLink,
  FirstVisitPageContent,
  PracticalInfoRow,
  PracticalInfoSource,
  VisitStep,
} from '@/types/firstVisit';
import type { SanityFirstVisitPageResult } from '@/lib/sanity/types';
// Chemin relatif, pas l'alias `@/` : ce module est chargé tel quel par
// `node --test`, qui ne connaît pas les alias de Vite.
import {
  normalizeSanityImage,
  type ImageSourceBuilder,
} from './normalizeSanityImage.ts';
import { normalizeSanitySeo } from './normalizeSanitySeo.ts';

export type { ImageSourceBuilder };

type RawPage = NonNullable<SanityFirstVisitPageResult>;
type RawStep = NonNullable<
  NonNullable<RawPage['preparation']>['steps']
>[number];
type RawExpectation = NonNullable<
  NonNullable<RawPage['expectations']>['items']
>[number];
type RawRow = NonNullable<
  NonNullable<RawPage['practicalInformation']>['items']
>[number];
type RawFaqItem = NonNullable<NonNullable<RawPage['faq']>['items']>[number];

/**
 * Destinations autorisées pour les boutons et les liens de cette page.
 *
 * L'éditrice choisit une destination, jamais une URL : les routes du site sont
 * typées et certaines sont encore inactives (voir `src/lib/navigation.ts`).
 */
const LINK_TARGETS: Readonly<Record<string, string | undefined>> = {
  schedule: '/horaires/',
  contact: '/contact/',
  services: '/nos-services/',
};

const PRACTICAL_SOURCES: readonly PracticalInfoSource[] = [
  'address',
  'phone',
  'parking',
  'accessibility',
  'pageText',
  'internalLink',
];

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Une étape sans titre ni description n'a rien à afficher.
 *
 * Le numéro se replie sur le rang dans le tableau : mieux vaut une pastille
 * numérotée automatiquement qu'une pastille vide si l'éditrice oublie le champ.
 */
function normalizeStep(raw: RawStep, index: number): VisitStep | undefined {
  const title = cleanString(raw.title);
  const description = cleanString(raw.description);
  if (!title || !description) return undefined;

  return {
    id: raw._key,
    numberLabel:
      cleanString(raw.numberLabel) ?? String(index + 1).padStart(2, '0'),
    title,
    description,
    note: cleanString(raw.note),
  };
}

function normalizeExpectation(
  raw: RawExpectation,
): ExpectationItem | undefined {
  const title = cleanString(raw.title);
  const description = cleanString(raw.description);
  if (!title || !description) return undefined;

  return { id: raw._key, title, description };
}

function normalizeFaqItem(raw: RawFaqItem): FirstVisitFaqItem | undefined {
  const question = cleanString(raw.question);
  const answer = cleanString(raw.answer);
  if (!question || !answer) return undefined;

  return { id: raw._key, question, answer };
}

/**
 * Une ligne d'informations pratiques, encore attachée à sa source.
 *
 * Rien n'est résolu ici : le normalisateur ne connaît pas les coordonnées de la
 * paroisse, et c'est voulu. Il se contente de valider que la ligne désigne une
 * source connue. Une source inconnue — un ancien document, un champ renommé —
 * fait écarter la ligne plutôt que d'afficher une valeur vide.
 */
function normalizeRow(raw: RawRow): PracticalInfoRow | undefined {
  const label = cleanString(raw.label);
  const source = PRACTICAL_SOURCES.find((value) => value === raw.source);
  if (!label || !source) return undefined;

  return {
    id: raw._key,
    label,
    source,
    value: cleanString(raw.value),
    linkLabel: cleanString(raw.linkLabel),
    linkTarget: cleanString(raw.linkTarget),
  };
}

function normalizeCta(
  label: string | null | undefined,
  target: string | null | undefined,
  fallback: FirstVisitLink | undefined,
): FirstVisitLink | undefined {
  const href = target ? LINK_TARGETS[target] : undefined;
  const cleanedLabel = cleanString(label);
  if (!href || !cleanedLabel) return fallback;

  return { label: cleanedLabel, href };
}

/**
 * Fusionne le contenu Sanity avec le repli local.
 *
 * Le résultat n'est pas encore affichable : les lignes d'informations pratiques
 * y désignent toujours leur source. C'est le getter qui les résout, parce que
 * lui seul a les coordonnées de la paroisse sous la main.
 *
 * L'image du bloc pratique ne se mélange pas : soit le Studio en fournit une,
 * soit le fichier du projet prend le relais en entier. Sa légende, elle, reste
 * saisissable de part et d'autre.
 */
export function normalizeSanityFirstVisitPage(
  raw: SanityFirstVisitPageResult,
  fallback: FirstVisitPageContent,
  buildSources: ImageSourceBuilder,
): FirstVisitPageContent {
  const steps = (raw?.preparation?.steps ?? []).flatMap((step, index) => {
    const normalized = normalizeStep(step, index);
    return normalized ? [normalized] : [];
  });

  const expectations = (raw?.expectations?.items ?? []).flatMap((item) => {
    const normalized = normalizeExpectation(item);
    return normalized ? [normalized] : [];
  });

  const rows = (raw?.practicalInformation?.items ?? []).flatMap((item) => {
    const normalized = normalizeRow(item);
    return normalized ? [normalized] : [];
  });

  const faqItems = (raw?.faq?.items ?? []).flatMap((item) => {
    const normalized = normalizeFaqItem(item);
    return normalized ? [normalized] : [];
  });

  const uploaded = normalizeSanityImage(
    raw?.practicalInformation?.image,
    buildSources,
  );
  const caption =
    cleanString(raw?.practicalInformation?.imageCaption) ??
    fallback.practicalInformation.image?.caption;
  const image: FirstVisitImage | undefined = uploaded
    ? { kind: 'remote-image', image: uploaded, caption }
    : fallback.practicalInformation.image;

  const fallbackFaq = fallback.faq;
  const faq =
    faqItems.length > 0
      ? {
          title: cleanString(raw?.faq?.title) ?? fallbackFaq?.title ?? '',
          items: faqItems,
        }
      : fallbackFaq;

  return {
    seo: normalizeSanitySeo(raw?.seo, fallback.seo, buildSources),
    hero: {
      eyebrow: cleanString(raw?.hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: cleanString(raw?.hero?.title) ?? fallback.hero.title,
      introduction:
        cleanString(raw?.hero?.introduction) ?? fallback.hero.introduction,
    },
    preparation: {
      eyebrow:
        cleanString(raw?.preparation?.eyebrow) ?? fallback.preparation.eyebrow,
      title: cleanString(raw?.preparation?.title) ?? fallback.preparation.title,
      introduction:
        cleanString(raw?.preparation?.introduction) ??
        fallback.preparation.introduction,
      steps: steps.length > 0 ? steps : fallback.preparation.steps,
    },
    expectations: {
      eyebrow:
        cleanString(raw?.expectations?.eyebrow) ??
        fallback.expectations.eyebrow,
      title:
        cleanString(raw?.expectations?.title) ?? fallback.expectations.title,
      introduction:
        cleanString(raw?.expectations?.introduction) ??
        fallback.expectations.introduction,
      items:
        expectations.length > 0 ? expectations : fallback.expectations.items,
    },
    practicalInformation: {
      eyebrow:
        cleanString(raw?.practicalInformation?.eyebrow) ??
        fallback.practicalInformation.eyebrow,
      title:
        cleanString(raw?.practicalInformation?.title) ??
        fallback.practicalInformation.title,
      items: rows.length > 0 ? rows : fallback.practicalInformation.items,
      primaryCta:
        normalizeCta(
          raw?.practicalInformation?.primaryCtaLabel,
          raw?.practicalInformation?.primaryCtaTarget,
          fallback.practicalInformation.primaryCta,
        ) ?? fallback.practicalInformation.primaryCta,
      secondaryCta: normalizeCta(
        raw?.practicalInformation?.secondaryCtaLabel,
        raw?.practicalInformation?.secondaryCtaTarget,
        fallback.practicalInformation.secondaryCta,
      ),
      image,
    },
    faq,
  };
}

/** Exporté pour que les tests verrouillent la liste fermée des destinations. */
export { LINK_TARGETS };
