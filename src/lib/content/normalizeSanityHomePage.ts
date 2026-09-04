import type {
  HomeGroupTeaser,
  HomePageData,
  HomeQuote,
  HomeServiceLink,
  HomeServiceTarget,
  TitleLines,
} from '@/types/homePage';
import type { SanityHomePageResult } from '@/lib/sanity/types';
// Chemin relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`.
import { normalizeSanitySeo } from './normalizeSanitySeo.ts';

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Les quatre destinations connues de `/nos-services`.
 *
 * Le Studio choisit dans cette liste, le code fabrique l'adresse. Une valeur
 * absente de la liste ne produit pas un lien mort : la ligne disparaît.
 */
const SERVICE_TARGETS: Readonly<Record<HomeServiceTarget, string>> = {
  'sacrements-et-initiation': '/nos-services/#sacrements-et-initiation',
  'accompagnement-et-documents': '/nos-services/#accompagnement-et-documents',
  'priere-et-memoire': '/nos-services/#priere-et-memoire',
  // Seule destination qui n'est pas une ancre de Nos services : la location
  // de salle a sa propre page depuis le 2026-09-03.
  'location-de-salle': '/location-de-salle/',
};

/**
 * Nom des groupes actifs de la page Vie paroissiale, par identifiant.
 *
 * Injecté plutôt que lu ici : l'accueil ne connaît pas la page Vie paroissiale,
 * c'est le getter qui rapproche les deux. Sous `node --test`, une table écrite
 * à la main suffit.
 */
export type ParishGroupNames = Readonly<Record<string, string>>;

/**
 * Une rangée de groupe n'existe que si son groupe existe encore.
 *
 * Le nom vient de la page Vie paroissiale, jamais de l'accueil : un groupe
 * renommé là-bas l'est ici aussi, et un groupe désactivé disparaît des deux
 * pages sans qu'on ait à y penser.
 */
function normalizeGroups(
  raw:
    | readonly ({ group?: string | null; teaser?: string | null } | null)[]
    | null
    | undefined,
  names: ParishGroupNames,
  fallback: readonly HomeGroupTeaser[],
): readonly HomeGroupTeaser[] {
  const rows = (raw ?? []).flatMap((entry) => {
    const id = cleanString(entry?.group);
    const name = id ? cleanString(names[id]) : undefined;
    const teaser = cleanString(entry?.teaser);
    if (!id || !name || !teaser) return [];
    return [{ id, name, teaser }];
  });

  if (rows.length > 0) return rows;

  // Le repli est filtré par la même règle : un groupe retiré de la page Vie
  // paroissiale ne doit pas réapparaître sur l'accueil par la porte du repli.
  const known = fallback.flatMap((group) => {
    const name = cleanString(names[group.id]);
    return name ? [{ ...group, name }] : [];
  });

  return Object.keys(names).length > 0 ? known : fallback;
}

/** Un raccourci sans libellé ou sans destination connue est écarté. */
function normalizeServiceLinks(
  raw:
    | readonly ({ label?: string | null; target?: string | null } | null)[]
    | null
    | undefined,
  fallback: readonly HomeServiceLink[],
): readonly HomeServiceLink[] {
  const links = (raw ?? []).flatMap((entry) => {
    const label = cleanString(entry?.label);
    const target = cleanString(entry?.target) as HomeServiceTarget | undefined;
    const href = target ? SERVICE_TARGETS[target] : undefined;
    if (!label || !target || !href) return [];
    return [{ label, target, href }];
  });

  return links.length > 0 ? links : fallback;
}

/**
 * Les lignes vides disparaissent, et une liste entièrement vide n'écrase pas le
 * repli : un titre absent laisserait le hero sans titre.
 */
function cleanTitleLines(
  values: readonly (string | null)[] | null | undefined,
  fallback: TitleLines,
): TitleLines {
  const lines = (values ?? []).flatMap((value) => {
    const cleaned = cleanString(value);
    return cleaned ? [cleaned] : [];
  });

  return lines.length > 0 ? lines : fallback;
}

/**
 * Une citation n'est reprise que complète.
 *
 * Un texte sans source laisserait une parole attribuée à personne, et une
 * source sans texte, un nom seul sous un blanc. Dans les deux cas le repli
 * reprend la main.
 */
function normalizeQuote(
  raw: NonNullable<SanityHomePageResult>['welcome'] | null | undefined,
  fallback: HomeQuote | undefined,
): HomeQuote | undefined {
  const text = cleanString(raw?.quote?.text);
  const attribution = cleanString(raw?.quote?.attribution);

  return text && attribution ? { text, attribution } : fallback;
}

/**
 * Fusionne le contenu Sanity avec le repli local, champ par champ.
 *
 * Rien de ce qui suit ne vient jamais de Sanity :
 *
 * - **les coordonnées** de « Venez nous rencontrer » et **les heures de messe**
 *   de l'aperçu des célébrations — faits sur la paroisse, lus dans
 *   `siteSettings` et `massSchedule` par les getters concernés;
 * - **les adresses des boutons**, qui sont des routes du site;
 * - **les textes d'état vide** — « Horaires à confirmer » relève du code, pas
 *   d'une décision éditoriale;
 * - **les images**, encore locales jusqu'au ticket des visuels de page.
 */
export function normalizeSanityHomePage(
  raw: SanityHomePageResult,
  fallback: HomePageData,
  groupNames: ParishGroupNames = {},
): HomePageData {
  const hero = raw?.hero;
  const welcome = raw?.welcome;
  const massPreview = raw?.massPreview;
  const parishLife = raw?.parishLife;
  const services = raw?.services;
  const interlude = raw?.interlude;
  const gallery = raw?.gallery;
  const visit = raw?.visit;

  return {
    // Sans constructeur d'adresses ici : le getter compose l'image de partage,
    // comme il compose déjà les diapositives et les illustrations de section.
    seo: normalizeSanitySeo(raw?.seo, fallback.seo),
    hero: {
      script: cleanString(hero?.script) ?? fallback.hero.script,
      titleLines: cleanTitleLines(hero?.titleLines, fallback.hero.titleLines),
      introduction:
        cleanString(hero?.introduction) ?? fallback.hero.introduction,
      primaryCtaLabel:
        cleanString(hero?.primaryCtaLabel) ?? fallback.hero.primaryCtaLabel,
      secondaryCtaLabel:
        cleanString(hero?.secondaryCtaLabel) ?? fallback.hero.secondaryCtaLabel,
      scheduleTitle:
        cleanString(hero?.scheduleTitle) ?? fallback.hero.scheduleTitle,
      scheduleLinkLabel:
        cleanString(hero?.scheduleLinkLabel) ?? fallback.hero.scheduleLinkLabel,
      scheduleNote:
        cleanString(hero?.scheduleNote) ?? fallback.hero.scheduleNote,
      // Les images sont composées par le getter, qui détient le constructeur
      // d'adresses du CDN.
      slides: fallback.hero.slides,
    },
    welcome: {
      script: cleanString(welcome?.script) ?? fallback.welcome.script,
      titleLines: cleanTitleLines(
        welcome?.titleLines,
        fallback.welcome.titleLines,
      ),
      introduction:
        cleanString(welcome?.introduction) ?? fallback.welcome.introduction,
      quote: normalizeQuote(welcome, fallback.welcome.quote),
      linkLabel: cleanString(welcome?.linkLabel) ?? fallback.welcome.linkLabel,
    },
    massPreview: {
      eyebrow:
        cleanString(massPreview?.eyebrow) ?? fallback.massPreview.eyebrow,
      title: cleanString(massPreview?.title) ?? fallback.massPreview.title,
      introduction:
        cleanString(massPreview?.introduction) ??
        fallback.massPreview.introduction,
      ctaLabel:
        cleanString(massPreview?.ctaLabel) ?? fallback.massPreview.ctaLabel,
      specialTitle:
        cleanString(massPreview?.specialTitle) ??
        fallback.massPreview.specialTitle,
      specialDescription:
        cleanString(massPreview?.specialDescription) ??
        fallback.massPreview.specialDescription,
    },
    parishLife: {
      eyebrow: cleanString(parishLife?.eyebrow) ?? fallback.parishLife.eyebrow,
      title: cleanString(parishLife?.title) ?? fallback.parishLife.title,
      introduction:
        cleanString(parishLife?.introduction) ??
        fallback.parishLife.introduction,
      groups: normalizeGroups(
        parishLife?.groups,
        groupNames,
        fallback.parishLife.groups,
      ),
      ctaLabel:
        cleanString(parishLife?.ctaLabel) ?? fallback.parishLife.ctaLabel,
    },
    services: {
      eyebrow: cleanString(services?.eyebrow) ?? fallback.services.eyebrow,
      title: cleanString(services?.title) ?? fallback.services.title,
      introduction:
        cleanString(services?.introduction) ?? fallback.services.introduction,
      links: normalizeServiceLinks(services?.links, fallback.services.links),
      ctaLabel: cleanString(services?.ctaLabel) ?? fallback.services.ctaLabel,
      visualNote:
        cleanString(services?.visualNote) ?? fallback.services.visualNote,
      thrift: {
        eyebrow:
          cleanString(services?.thrift?.eyebrow) ??
          fallback.services.thrift.eyebrow,
        title:
          cleanString(services?.thrift?.title) ??
          fallback.services.thrift.title,
        description:
          cleanString(services?.thrift?.description) ??
          fallback.services.thrift.description,
        linkLabel:
          cleanString(services?.thrift?.linkLabel) ??
          fallback.services.thrift.linkLabel,
      },
    },
    interlude: {
      eyebrow: cleanString(interlude?.eyebrow) ?? fallback.interlude.eyebrow,
      title: cleanString(interlude?.title) ?? fallback.interlude.title,
      description:
        cleanString(interlude?.description) ?? fallback.interlude.description,
      linkLabel:
        cleanString(interlude?.linkLabel) ?? fallback.interlude.linkLabel,
    },
    gallery: {
      eyebrow: cleanString(gallery?.eyebrow) ?? fallback.gallery.eyebrow,
      title: cleanString(gallery?.title) ?? fallback.gallery.title,
      // Les photographies sont ajoutées par le getter : elles demandent le
      // constructeur d'adresses du CDN, que ce module n'a pas.
      items: fallback.gallery.items,
    },
    visit: {
      eyebrow: cleanString(visit?.eyebrow) ?? fallback.visit.eyebrow,
      title: cleanString(visit?.title) ?? fallback.visit.title,
      introduction:
        cleanString(visit?.introduction) ?? fallback.visit.introduction,
      contactCtaLabel:
        cleanString(visit?.contactCtaLabel) ?? fallback.visit.contactCtaLabel,
      directionsCtaLabel:
        cleanString(visit?.directionsCtaLabel) ??
        fallback.visit.directionsCtaLabel,
    },
  };
}
