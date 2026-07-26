import arrivalImage from '@/assets/images/paroisse/eglise-exterieur-accessibilite-01.webp';
import { SITE_NAME } from '@/lib/site';
import type { FirstVisitPageData } from '@/types/firstVisit';

export const firstVisitPageData = {
  seo: {
    title: 'Première visite',
    description:
      'Préparez votre première visite à la Paroisse Saint-René-Goupil et découvrez à quoi vous attendre lors de votre venue.',
  },
  hero: {
    eyebrow: 'Bienvenue',
    title: 'Votre première visite',
    introduction: `Tout ce qu’il faut savoir pour préparer votre première venue à la ${SITE_NAME}. Vous pouvez venir comme vous êtes et participer à votre rythme.`,
  },
  preparation: {
    eyebrow: 'Guide pratique',
    title: 'Avant votre visite',
    introduction:
      'Quelques repères simples peuvent vous aider à découvrir les lieux plus sereinement.',
    steps: [
      {
        id: 'verifier-horaire',
        numberLabel: '01',
        title: 'Vérifier l’horaire',
        description:
          'Consultez la page Horaires avant votre déplacement, particulièrement lors des fêtes et des célébrations spéciales.',
        status: 'temporary',
      },
      {
        id: 'preparer-arrivee',
        numberLabel: '02',
        title: 'Préparer son arrivée',
        description:
          'L’adresse exacte, les indications d’entrée et les repères utiles seront publiés après leur confirmation par la paroisse.',
        note: '[ADRESSE À CONFIRMER]',
        status: 'to-confirm',
      },
      {
        id: 'stationnement-transport',
        numberLabel: '03',
        title: 'Stationnement et transport',
        description:
          'Communiquez avec le secrétariat si vous souhaitez vérifier les options disponibles avant votre venue.',
        note: '[INFORMATION DE STATIONNEMENT À CONFIRMER]',
        status: 'to-confirm',
      },
      {
        id: 'entree-accessibilite',
        numberLabel: '04',
        title: 'Entrée et accessibilité',
        description:
          'Les accès, les installations et les possibilités d’accompagnement doivent encore être confirmés.',
        note: '[INFORMATION D’ACCESSIBILITÉ À CONFIRMER]',
        status: 'to-confirm',
      },
      {
        id: 'prendre-place',
        numberLabel: '05',
        title: 'Prendre place librement',
        description:
          'Sauf indication donnée sur place, vous pouvez choisir une place disponible et vous installer calmement.',
        status: 'temporary',
      },
      {
        id: 'participer-rythme',
        numberLabel: '06',
        title: 'Participer à son rythme',
        description:
          'Il n’est pas nécessaire de connaître les chants ou les prières. Vous pouvez écouter, observer et participer selon votre aisance.',
        status: 'temporary',
      },
    ],
  },
  expectations: {
    eyebrow: 'La célébration',
    title: 'À quoi s’attendre pendant une messe',
    introduction:
      'Le déroulement peut varier, mais une célébration comprend généralement quelques grands moments.',
    items: [
      {
        id: 'accueil',
        title: 'Accueil et ouverture',
        description:
          'La communauté se rassemble et la célébration commence. Vous pouvez simplement suivre les indications données sur place.',
      },
      {
        id: 'parole',
        title: 'Liturgie de la Parole',
        description:
          'Des textes bibliques sont proclamés, puis une homélie propose un éclairage pour la vie d’aujourd’hui.',
      },
      {
        id: 'eucharistie',
        title: 'Liturgie eucharistique',
        description:
          'La célébration se poursuit autour de l’autel. Les personnes qui ne communient pas peuvent rester à leur place ou suivre les indications données sur place.',
      },
      {
        id: 'envoi',
        title: 'Envoi',
        description:
          'Une prière et une bénédiction concluent la célébration avant le départ de l’assemblée.',
      },
    ],
  },
  practicalInformation: {
    eyebrow: 'Nous trouver',
    title: 'Informations pratiques',
    items: [
      {
        id: 'adresse',
        label: 'Adresse',
        value: '[ADRESSE À CONFIRMER]',
        confirmationRequired: true,
        futureSource: 'site-settings',
      },
      {
        id: 'stationnement',
        label: 'Stationnement',
        value: '[INFORMATION DE STATIONNEMENT À CONFIRMER]',
        confirmationRequired: true,
        futureSource: 'page',
      },
      {
        id: 'entree',
        label: 'Entrée',
        value: '[INFORMATION À CONFIRMER]',
        confirmationRequired: true,
        futureSource: 'page',
      },
      {
        id: 'accessibilite',
        label: 'Accessibilité',
        value: '[INFORMATION D’ACCESSIBILITÉ À CONFIRMER]',
        confirmationRequired: true,
        futureSource: 'page',
      },
      {
        id: 'telephone',
        label: 'Téléphone',
        value: '[TÉLÉPHONE À CONFIRMER]',
        confirmationRequired: true,
        futureSource: 'site-settings',
      },
      {
        id: 'horaires',
        label: 'Horaires',
        value: 'Consulter la page Horaires',
        href: '/horaires/',
        confirmationRequired: false,
        futureSource: 'page',
      },
    ],
    primaryCta: {
      label: 'Voir les horaires',
      href: '/horaires/',
    },
    secondaryCta: {
      label: 'Nous joindre',
      href: '/contact/',
    },
    image: {
      image: arrivalImage,
      alt: 'Vue extérieure de l’église, de la pelouse et d’une longue allée bordée de garde-corps',
      caption:
        'Repère visuel extérieur; l’entrée et les conditions d’accessibilité restent à confirmer.',
      desktopPosition: 'center center',
      mobilePosition: '58% center',
    },
  },
  faq: {
    title: 'Questions fréquentes',
    items: [
      {
        id: 'venir-sans-etre-catholique',
        question: 'Puis-je venir même si je ne suis pas catholique?',
        answer:
          'Oui. Vous pouvez entrer, vous asseoir, écouter et découvrir la célébration sans devoir connaître les prières ou les chants.',
      },
      {
        id: 'arrivee',
        question: 'À quel moment dois-je arriver?',
        answer:
          'Vous pouvez arriver un peu avant le début afin de prendre place calmement. Vérifiez toujours l’heure sur la page Horaires avant votre déplacement.',
      },
      {
        id: 'tenue',
        question: 'Comment dois-je m’habiller?',
        answer:
          'Aucune tenue particulière n’est exigée. Une tenue simple et respectueuse convient. Vous pouvez aussi mettre votre téléphone en mode silencieux pendant la célébration.',
      },
      {
        id: 'familles',
        question: 'Puis-je venir avec des enfants?',
        answer:
          'Les enfants peuvent accompagner leurs parents. Les éventuels services ou espaces destinés aux familles seront précisés après confirmation par la paroisse.',
      },
      {
        id: 'communion',
        question: 'Que faire au moment de la communion?',
        answer:
          'Si vous ne communiez pas, vous pouvez rester à votre place ou suivre les indications données sur place.',
      },
      {
        id: 'horaire',
        question: 'Où puis-je confirmer l’horaire?',
        answer:
          'Consultez la page Horaires et, lors d’une célébration spéciale, communiquez avec le secrétariat si une confirmation supplémentaire est nécessaire.',
      },
      {
        id: 'accessibilite',
        question: 'Le bâtiment est-il accessible?',
        answer:
          'Les informations précises sur les accès et les installations ne sont pas encore confirmées. Communiquez avec le secrétariat avant votre visite pour vérifier votre besoin particulier.',
      },
    ],
  },
} as const satisfies FirstVisitPageData;
