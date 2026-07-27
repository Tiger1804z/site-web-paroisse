import type { SchedulePageData } from '@/types/schedule';

export const schedulePageData = {
  hero: {
    eyebrow: 'Célébrations',
    title: 'Horaires et célébrations',
    introduction:
      'Retrouvez ici les horaires réguliers ainsi que les changements liés aux célébrations spéciales.',
    imageAlt: 'Vue intérieure symétrique de l’autel avec une décoration rouge',
  },
  notice: {
    id: 'horaire-special',
    title: 'Horaire spécial',
    message: 'Un changement d’horaire est prévu pour le [DATE].',
    severity: 'important',
    active: true,
    action: {
      label: 'Consulter les détails',
      href: '#celebrations-speciales',
    },
  },
  regularSchedule: {
    id: 'horaire-regulier',
    title: 'Horaires réguliers des messes',
    description:
      'Les heures ci-dessous doivent être confirmées par la paroisse avant publication définitive.',
    active: true,
    entries: [
      {
        id: 'semaine',
        dayLabel: 'Messes de semaine',
        note: 'Information à confirmer',
        times: [{ label: '[JOURS ET HEURES À CONFIRMER]' }],
      },
      {
        id: 'samedi',
        dayLabel: 'Samedi',
        note: 'Vigile du dimanche',
        times: [{ label: '[HEURE]' }],
      },
      {
        id: 'dimanche',
        dayLabel: 'Dimanche',
        note: 'Messes dominicales',
        times: [{ label: '[HEURE]' }, { label: '[HEURE]' }],
      },
    ],
  },
  seasonalSchedules: [
    {
      id: 'horaire-saisonnier',
      title: 'Horaire saisonnier',
      description:
        'Une version saisonnière des horaires peut être appliquée durant certaines périodes de l’année.',
      validFromLabel: '[DATE DE DÉBUT]',
      validUntilLabel: '[DATE DE FIN]',
      active: true,
      entries: [
        {
          id: 'periode-saisonniere',
          dayLabel: 'Horaires',
          times: [{ label: '[INFORMATION À CONFIRMER]' }],
        },
      ],
    },
  ],
  specialCelebrations: [
    {
      id: 'celebration-speciale-01',
      title: '[TITRE DE LA CÉLÉBRATION]',
      dateLabel: '[DATE]',
      timeLabel: '[HEURE]',
      note: '[NOTE]',
    },
    {
      id: 'celebration-speciale-02',
      title: '[TITRE DE LA CÉLÉBRATION]',
      dateLabel: '[DATE]',
      timeLabel: '[HEURE]',
    },
  ],
  specialCelebrationsEmptyMessage:
    'Aucune célébration spéciale n’est actuellement publiée.',
  lastUpdatedLabel: '[DATE]',
  beforeYouVisit: {
    title: 'Avant de vous déplacer',
    message:
      'Les horaires peuvent être modifiés lors de certaines célébrations. Consultez cette page ou communiquez avec le secrétariat pour confirmer.',
    contactLink: {
      label: 'Communiquer avec le secrétariat',
      href: '/contact/',
    },
    bulletinLink: {
      label: 'Consulter le feuillet paroissial',
      href: '/feuillets-paroissiaux/',
      active: false,
    },
  },
  sidebar: {
    bulletin: {
      eyebrow: 'Cette semaine',
      title: 'Feuillet paroissial',
      periodLabel: 'Semaine du [DATE]',
      link: {
        label: 'Consulter les feuillets',
        href: '/feuillets-paroissiaux/',
      },
      active: false,
    },
    office: {
      eyebrow: 'Secrétariat',
      hoursLabel: '[HEURES DU SECRÉTARIAT]',
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
        'Les changements confirmés seront annoncés sur cette page et pourront aussi apparaître dans le feuillet paroissial.',
      active: true,
    },
    {
      id: 'confirmer-heure',
      question: 'Comment confirmer une heure avant de me déplacer?',
      answer:
        'Consultez la date de dernière mise à jour ou communiquez avec le secrétariat à partir de la page Contact.',
      active: true,
    },
    {
      id: 'consulter-feuillet',
      question: 'Où puis-je consulter le feuillet paroissial?',
      answer:
        'Les feuillets confirmés seront regroupés dans la section Feuillets paroissiaux.',
      active: false,
    },
  ],
} as const satisfies SchedulePageData;
