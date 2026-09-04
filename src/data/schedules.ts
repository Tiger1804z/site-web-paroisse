import type { MassScheduleData, SchedulePageData } from '@/types/schedule';

/**
 * Repli des horaires partagés.
 *
 * Aucune heure en dur : la source est le document Sanity `massSchedule`. Si le
 * fetch échoue, la page affiche « Horaires à confirmer » plutôt qu’un gabarit
 * qui ressemble à une heure.
 */
export const massScheduleData = {
  regularSchedule: {
    id: 'horaire-regulier',
    title: 'Horaires réguliers des messes',
    active: true,
    entries: [],
  },
  seasonalSchedules: [],
} as const satisfies MassScheduleData;

/**
 * Repli du contenu propre à la page `/horaires`.
 *
 * Les heures du secrétariat n’apparaissent pas ici : ce sont des coordonnées
 * globales, servies par `siteSettings` et injectées dans l’encadré par le
 * getter.
 */
export const schedulePageData = {
  // Même raison qu'à l'accueil : ce module est chargé tel quel par
  // `node --test`. Le texte est celui que `horaires.astro` publiait.
  seo: {
    title: 'Horaires et célébrations',
    description:
      'Consultez les horaires des messes et les changements liés aux célébrations spéciales de la Paroisse Saint-René-Goupil.',
  },
  hero: {
    eyebrow: 'Célébrations',
    title: 'Horaires et célébrations',
    introduction:
      'Retrouvez ici les horaires réguliers ainsi que les changements liés aux célébrations spéciales.',
  },
  // Aucun avis par défaut : un encadré ne s’affiche que si la paroisse en
  // publie un dans Sanity. Un avis gabarit vaut moins que pas d’avis.
  //
  // Les célébrations datées relèveront du modèle Événements, pas des horaires :
  // une même célébration ne peut pas avoir deux sources de vérité.
  specialCelebrations: [],
  specialCelebrationsEmptyMessage:
    'Aucune célébration spéciale n’est actuellement publiée.',
  beforeYouVisit: {
    title: 'Avant de vous déplacer',
    message:
      'Les horaires peuvent être modifiés lors de certaines célébrations. Consultez cette page ou communiquez avec le secrétariat pour confirmer.',
    contactLink: {
      label: 'Communiquer avec le secrétariat',
      href: '/contact/',
    },
  },
  // Le texte demandé par la paroisse, mot pour mot. La destination reste au
  // code : c'est une route du site, pas du contenu.
  firstVisitCta: {
    title: 'C’est votre première visite?',
    message:
      'Découvrez où entrer, où vous stationner, à quoi vous attendre et les informations utiles avant de venir.',
    link: {
      label: 'Préparer ma première visite',
      href: '/premiere-visite/',
    },
  },
  sidebar: {
    office: {
      eyebrow: 'Secrétariat',
      message:
        'Des questions sur les horaires? Communiquez avec le secrétariat pour confirmer avant de vous déplacer.',
      link: {
        label: 'Voir les coordonnées',
        href: '/contact/',
      },
    },
  },
  faq: [
    {
      id: 'horaire-ete',
      question: 'Les horaires changent-ils pendant l’été?',
      answer:
        'Un horaire saisonnier peut être appliqué. Les périodes et les heures doivent être confirmées par la paroisse et seront publiées sur cette page.',
      active: true,
    },
    {
      id: 'celebrations-speciales',
      question: 'Où sont annoncées les célébrations spéciales?',
      answer:
        'Les changements confirmés seront annoncés sur cette page et dans les communications de la paroisse.',
      active: true,
    },
    {
      id: 'confirmer-heure',
      question: 'Comment confirmer une heure avant de me déplacer?',
      answer:
        'Consultez la date de vérification affichée avec les horaires ou communiquez avec le secrétariat à partir de la page Contact.',
      active: true,
    },
  ],
} as const satisfies SchedulePageData;
