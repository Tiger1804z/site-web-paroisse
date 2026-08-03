import type {
  ParishService,
  ParishServiceChapter,
  ParishServiceDetail,
  ServiceSurface,
  ServicesCallToAction,
  ServicesHeroSlide,
  ServicesPageData,
} from '@/types/services';
import type { SanityServicesPageResult } from '@/lib/sanity/types';
// Chemin relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`. L'alias reste réservé aux
// imports de types, effacés à l'exécution.
import {
  normalizeSanityImage,
  type ImageSourceBuilder,
} from './normalizeSanityImage.ts';

type RawPage = NonNullable<SanityServicesPageResult>;
type RawServicesPage = RawPage;
type RawChapter = NonNullable<RawPage['chapters']>[number];
type RawService = NonNullable<RawChapter['services']>[number];

const SURFACES: readonly ServiceSurface[] = [
  'ivory',
  'paper',
  'charcoal',
  'burgundy',
];

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
 * Une valeur de surface inconnue retombe sur `ivory`, la plus neutre, plutôt
 * que de produire une classe CSS qui n'existe pas.
 */
function normalizeSurface(value: string | null | undefined): ServiceSurface {
  return SURFACES.includes(value as ServiceSurface)
    ? (value as ServiceSurface)
    : 'ivory';
}

function normalizeDetails(
  raw: RawService['details'],
): readonly ParishServiceDetail[] {
  return (raw ?? []).flatMap((entry) => {
    const label = cleanString(entry.label);
    const value = cleanString(entry.value);
    // Une moitié de ligne n'est pas un renseignement : un intitulé sans valeur
    // afficherait « Tarif 2026 » suivi de rien.
    if (!label || !value) return [];
    return [{ label, value }];
  });
}

/**
 * Un service sans ancre, sans titre ou sans résumé est écarté : l'ancre est une
 * adresse publique, et les deux autres champs composent la carte affichée.
 */
function normalizeService(
  raw: RawService,
  cta: ServicesCallToAction,
): ParishService | undefined {
  const id = cleanString(raw.slug);
  const title = cleanString(raw.title);
  const summary = cleanString(raw.summary);
  if (!id || !title || !summary) return undefined;

  const details = normalizeDetails(raw.details);
  const steps = cleanList(raw.steps);

  return {
    id,
    title,
    summary,
    active: raw.active !== false,
    ...(details.length > 0 ? { details } : {}),
    ...(steps.length > 0 ? { steps } : {}),
    ...(cleanString(raw.note) ? { note: cleanString(raw.note) } : {}),
    cta,
  };
}

function normalizeChapter(
  raw: RawChapter,
  cta: ServicesCallToAction,
  buildSources: ImageSourceBuilder,
): ParishServiceChapter | undefined {
  const id = cleanString(raw.slug);
  const title = cleanString(raw.title);
  const introduction = cleanString(raw.introduction);
  if (!id || !title || !introduction) return undefined;

  const services = (raw.services ?? []).flatMap((service) => {
    const normalized = normalizeService(service, cta);
    return normalized ? [normalized] : [];
  });

  // Un chapitre sans service serait un bandeau coloré vide au milieu de la page.
  if (services.length === 0) return undefined;

  const image = normalizeSanityImage(raw.image, buildSources);

  return {
    id,
    eyebrow: cleanString(raw.eyebrow) ?? '',
    title,
    introduction,
    surface: normalizeSurface(raw.surface),
    services,
    ...(image ? { image } : {}),
  };
}

/**
 * Les images du carrousel d'en-tête.
 *
 * Une entrée sans libellé ou sans fichier exploitable est écartée plutôt que
 * rendue à moitié : le libellé s'affiche par-dessus l'image, l'un sans l'autre
 * n'a pas de sens.
 */
function normalizeHeroSlides(
  raw: RawServicesPage['hero'] | undefined,
  buildSources: ImageSourceBuilder,
): ServicesHeroSlide[] {
  return (raw?.slides ?? []).flatMap((slide) => {
    const label = cleanString(slide.label);
    const image = normalizeSanityImage(slide.visual, buildSources);

    return label && image ? [{ label, image }] : [];
  });
}

/**
 * Fusionne le contenu Sanity avec le repli local.
 *
 * Une seule chose ne vient jamais de Sanity : **le bouton d'appel**, dérivé du
 * téléphone du secrétariat. Le Studio ne contient aucune adresse de lien pour
 * cette page.
 *
 * Les images, elles, viennent désormais du Studio et de nulle part ailleurs. Le
 * repli local n'en porte plus : un en-tête sans image garde son fond sombre, un
 * chapitre sans image occupe toute la largeur. Aucun cadre ne se réserve une
 * place qu'il ne remplira pas.
 */
export function normalizeSanityServicesPage(
  raw: SanityServicesPageResult,
  fallback: ServicesPageData,
  buildSources: ImageSourceBuilder,
): ServicesPageData {
  const cta =
    fallback.finalCta.primary ??
    ({
      label: 'Téléphoner au secrétariat',
      href: fallback.finalCta.phone.href,
    } as const);

  const chapters = (raw?.chapters ?? []).flatMap((chapter) => {
    const normalized = normalizeChapter(chapter, cta, buildSources);
    return normalized ? [normalized] : [];
  });

  const methods = cleanList(raw?.paymentMethods?.methods);

  return {
    seo: fallback.seo,
    hero: {
      eyebrow: cleanString(raw?.hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: cleanString(raw?.hero?.title) ?? fallback.hero.title,
      introduction:
        cleanString(raw?.hero?.introduction) ?? fallback.hero.introduction,
      slides: normalizeHeroSlides(raw?.hero, buildSources),
    },
    notice: {
      title: cleanString(raw?.notice?.title) ?? fallback.notice.title,
      message: cleanString(raw?.notice?.message) ?? fallback.notice.message,
      reviewDate:
        cleanString(raw?.notice?.reviewDate) ?? fallback.notice.reviewDate,
    },
    chapters: chapters.length > 0 ? chapters : fallback.chapters,
    paymentMethods: {
      title:
        cleanString(raw?.paymentMethods?.title) ??
        fallback.paymentMethods.title,
      description:
        cleanString(raw?.paymentMethods?.description) ??
        fallback.paymentMethods.description,
      methods: methods.length > 0 ? methods : fallback.paymentMethods.methods,
    },
    finalCta: {
      title: cleanString(raw?.finalCta?.title) ?? fallback.finalCta.title,
      description:
        cleanString(raw?.finalCta?.description) ??
        fallback.finalCta.description,
      primary: fallback.finalCta.primary,
      phone: fallback.finalCta.phone,
    },
  };
}
