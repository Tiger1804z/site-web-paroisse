import type {
  BeforeYouVisitContent,
  FirstVisitCtaContent,
  ScheduleFaqItem,
  ScheduleHero,
  ScheduleLink,
  ScheduleNotice,
  ScheduleNoticeSeverity,
  SchedulePageData,
  ScheduleSidebarContent,
} from '@/types/schedule';
import type { SanitySchedulePageResult } from '@/lib/sanity/types';
// Import relatif et extension explicite volontaires : ce module est chargé tel
// quel par `node --test`, qui ne résout ni l'alias `@/` ni une extension
// implicite. L'alias reste réservé aux imports de types, effacés à l'exécution.
import { cleanString } from '../schedules/schedule-format.ts';
import { normalizeSanitySeo } from './normalizeSanitySeo.ts';

type RawSchedulePage = NonNullable<SanitySchedulePageResult>;

/** Identifiant stable de l'avis : la page n'en porte qu'un. */
const NOTICE_ID = 'avis-horaires';

const SEVERITIES: readonly ScheduleNoticeSeverity[] = [
  'info',
  'important',
  'special',
];

/**
 * Destinations autorisées pour le lien de l'avis.
 *
 * L'éditrice choisit une destination, jamais une URL : les routes du site sont
 * typées et certaines sont encore inactives (voir `src/lib/navigation.ts`).
 */
const NOTICE_ACTIONS: Readonly<Record<string, ScheduleLink | undefined>> = {
  specialCelebrations: {
    label: 'Consulter les détails',
    href: '#celebrations-speciales',
  },
  contact: {
    label: 'Communiquer avec le secrétariat',
    href: '/contact/',
  },
};

function normalizeHero(
  raw: RawSchedulePage['hero'] | undefined,
  fallback: ScheduleHero,
): ScheduleHero {
  const eyebrow = cleanString(raw?.eyebrow);
  const title = cleanString(raw?.title);
  const introduction = cleanString(raw?.introduction);

  // L'image est composée par le getter, qui détient le constructeur d'adresses
  // du CDN. Son texte alternatif la suit désormais, au lieu d'être un champ
  // séparé que rien ne rattachait au fichier.
  if (!eyebrow || !title || !introduction) return fallback;

  return { eyebrow, title, introduction };
}

/**
 * Un avis sans titre ni message n'existe pas.
 *
 * Dernier rempart après la validation du Studio : un objet à moitié rempli ne
 * doit jamais produire un encadré vide sur la page.
 */
function normalizeNotice(
  raw: RawSchedulePage['notice'] | undefined,
): ScheduleNotice | undefined {
  const title = cleanString(raw?.title);
  const message = cleanString(raw?.message);
  if (!title || !message) return undefined;

  const severity =
    SEVERITIES.find((value) => value === raw?.severity) ?? 'info';

  return {
    id: NOTICE_ID,
    title,
    message,
    severity,
    active: raw?.active !== false,
    action: raw?.actionTarget ? NOTICE_ACTIONS[raw.actionTarget] : undefined,
  };
}

function normalizeBeforeYouVisit(
  raw: RawSchedulePage['beforeYouVisit'] | undefined,
  fallback: BeforeYouVisitContent,
): BeforeYouVisitContent {
  return {
    title: cleanString(raw?.title) ?? fallback.title,
    message: cleanString(raw?.message) ?? fallback.message,
    // La destination du bouton reste au code : elle dépend des routes actives.
    contactLink: fallback.contactLink,
  };
}

function normalizeFirstVisitCta(
  raw: RawSchedulePage['firstVisitCta'] | undefined,
  fallback: FirstVisitCtaContent,
): FirstVisitCtaContent {
  return {
    title: cleanString(raw?.title) ?? fallback.title,
    message: cleanString(raw?.message) ?? fallback.message,
    link: {
      label: cleanString(raw?.linkLabel) ?? fallback.link.label,
      // La destination reste au code, comme celle du bandeau.
      href: fallback.link.href,
    },
  };
}

function normalizeSidebar(
  raw: RawSchedulePage['sidebar'] | undefined,
  fallback: ScheduleSidebarContent,
  officeHoursLabel: string | undefined,
): ScheduleSidebarContent {
  return {
    office: {
      eyebrow: cleanString(raw?.officeEyebrow) ?? fallback.office.eyebrow,
      // Les heures viennent des coordonnées globales, jamais de la page.
      hoursLabel: officeHoursLabel ?? fallback.office.hoursLabel,
      message: cleanString(raw?.officeMessage) ?? fallback.office.message,
      link: fallback.office.link,
    },
  };
}

function normalizeFaq(
  raw: RawSchedulePage['faq'] | undefined,
  fallback: readonly ScheduleFaqItem[],
): readonly ScheduleFaqItem[] {
  const items = (raw ?? []).flatMap((item) => {
    const question = cleanString(item.question);
    const answer = cleanString(item.answer);
    if (!question || !answer) return [];

    return [
      {
        id: item._key,
        question,
        answer,
        active: item.active !== false,
      },
    ];
  });

  return items.length > 0 ? items : fallback;
}

/**
 * Fusionne le contenu de page Sanity avec le repli local.
 *
 * Contrairement aux horaires, chaque section bascule indépendamment : ce sont
 * des textes éditoriaux sans risque d'incohérence entre eux. Les heures du
 * secrétariat arrivent d'ailleurs — le getter les passe en argument.
 */
export function normalizeSanitySchedulePage(
  raw: SanitySchedulePageResult,
  fallback: SchedulePageData,
  officeHoursLabel?: string,
): SchedulePageData {
  return {
    ...fallback,
    // Sans constructeur d'adresses ici : le getter compose l'image de partage,
    // comme il compose déjà celle du premier écran.
    seo: normalizeSanitySeo(raw?.seo, fallback.seo),
    hero: normalizeHero(raw?.hero ?? undefined, fallback.hero),
    notice: normalizeNotice(raw?.notice ?? undefined),
    beforeYouVisit: normalizeBeforeYouVisit(
      raw?.beforeYouVisit ?? undefined,
      fallback.beforeYouVisit,
    ),
    firstVisitCta: normalizeFirstVisitCta(
      raw?.firstVisitCta ?? undefined,
      fallback.firstVisitCta,
    ),
    sidebar: normalizeSidebar(
      raw?.sidebar ?? undefined,
      fallback.sidebar,
      officeHoursLabel,
    ),
    faq: normalizeFaq(raw?.faq ?? undefined, fallback.faq),
  };
}
