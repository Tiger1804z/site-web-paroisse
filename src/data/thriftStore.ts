import hoodiesRackImage from '@/assets/images/thrift-store/hoodies-rack-pixabay.jpg';
import winterBootsImage from '@/assets/images/thrift-store/winter-boots-pixabay.jpg';
import yarnBallImage from '@/assets/images/thrift-store/yarn-ball-pixabay.jpg';
import { SITE_NAME } from '@/lib/site';
import type {
  ThriftStoreImage,
  ThriftStorePageData,
} from '@/types/thriftStore';

// Visuels thématiques libres de droits (Pixabay, Content License : usage
// commercial autorisé sans attribution). Ils illustrent l'univers du vêtement,
// sans jamais être présentés comme des photographies du local paroissial.
const sharedReplacementNote =
  'Remplaçable par une photographie du local si la paroisse en fournit une.';

const hoodiesRackVisual = {
  image: hoodiesRackImage,
  alt: 'Chandails à capuchon de plusieurs couleurs alignés sur un portant',
  credit: 'jarmoluk (Pixabay)',
  sourceNote:
    'Pixabay, image 428607, Content License — usage commercial autorisé sans attribution.',
  status: 'confirmed',
  replacementNote: sharedReplacementNote,
} as const satisfies ThriftStoreImage;

const yarnBallVisual = {
  image: yarnBallImage,
  alt: 'Pelote de laine grise posée près de bobines de fil sombre',
  credit: 'StockSnap (Pixabay)',
  sourceNote:
    'Pixabay, image 2583976, Content License — usage commercial autorisé sans attribution.',
  status: 'confirmed',
  replacementNote: sharedReplacementNote,
} as const satisfies ThriftStoreImage;

const winterBootsVisual = {
  image: winterBootsImage,
  alt: 'Bottes d’hiver en cuir beige portées avec un jean',
  credit: 'StockSnap (Pixabay)',
  sourceNote:
    'Pixabay, image 2587909, Content License — usage commercial autorisé sans attribution.',
  status: 'confirmed',
  replacementNote: sharedReplacementNote,
} as const satisfies ThriftStoreImage;

export const thriftStorePageData = {
  seo: {
    title: 'Friperie Au Coin de l’Entraide',
    description: `La friperie Au Coin de l’Entraide, au sous-sol de la ${SITE_NAME} : vêtements et petits articles pour la maison, dans le respect et la confidentialité.`,
    canonicalPath: '/friperie/',
    // Indexable depuis le 29 juillet 2026 : nom, horaires, emplacement et
    // téléphone sont réels, et les visuels sont sous licence. Une personne qui
    // cherche une friperie dans le quartier doit pouvoir trouver cette page.
    noIndex: false,
  },
  hero: {
    eyebrow: 'Friperie paroissiale',
    title: 'Au Coin de l’Entraide',
    introduction:
      'Un lieu de partage au service de la communauté, pour se vêtir ou trouver de petits articles pour la maison.',
    slides: [hoodiesRackVisual, yarnBallVisual, winterBootsVisual],
  },
  introduction: {
    eyebrow: 'Notre friperie',
    title: 'Présentation',
    // Message adapté de celui publié par la paroisse sur son site actuel,
    // relevé le 29 juillet 2026. Le sens est conservé, la formulation resserrée.
    paragraphs: [
      'La friperie Au Coin de l’Entraide est un espace de réemploi au service de la communauté. Les articles offerts et leurs prix peuvent varier au cours de l’année.',
      'Nous accueillons toute personne traversant une période de précarité ou ayant besoin d’un soutien ponctuel, pour se vêtir ou se procurer de petits articles pour la maison.',
      'Passez nous voir ou communiquez avec nous : notre équipe de bénévoles vous aidera à trouver ce dont vous avez besoin, dans le respect et la confidentialité.',
    ],
    priceNotice:
      'Les prix peuvent varier selon les articles et les périodes de l’année. Des ventes spéciales peuvent aussi être annoncées occasionnellement.',
    photoPlaceholder: {
      id: 'presentation-generale',
      subject: 'Vue générale du local',
      ratio: '4:3',
      orientation: 'landscape',
    },
  },
  practicalInformation: {
    // Relevé le 29 juillet 2026 sur le site actuel de la paroisse. Ces valeurs
    // ne servent plus que si Sanity est injoignable : la source de vérité est
    // le document partagé `thriftStore`.
    hours: 'Tous les mardis, mercredis et jeudis, de 13 h à 17 h',
    location:
      'Sous-sol de l’église Saint-René-Goupil — entrée par la porte de la 25e Avenue',
    // Ligne propre à la friperie, distincte du secrétariat de la paroisse.
    phone: '514 721-2842',
    contactCta: {
      label: 'Communiquer avec la paroisse',
      href: '/contact/',
    },
  },
  sections: [
    {
      id: 'seconde-vie',
      eyebrow: 'Réemploi et entraide',
      title: 'Une seconde vie pour les vêtements',
      description:
        'La friperie participe au réemploi d’articles et crée une occasion concrète de contribuer à la vie communautaire. Les catégories d’articles et les modalités de dons seront publiées seulement après confirmation.',
      active: true,
      visualKind: 'clothing-rack',
    },
  ],
  gallery: {
    eyebrow: 'À documenter',
    title: 'La friperie en images',
    introduction:
      'Ces cadres indiquent les prises de vue attendues. Ils seront remplacés par des photographies réelles, sans présenter un autre commerce comme la friperie paroissiale.',
    placeholders: [
      {
        id: 'portants-horizontal',
        subject: 'Portants organisés',
        ratio: '1:1',
        orientation: 'square',
      },
      {
        id: 'espace-large',
        subject: 'Vue large du local',
        ratio: '1:1',
        orientation: 'square',
      },
      {
        id: 'tri-dons',
        subject: 'Tri et dons',
        ratio: '1:1',
        orientation: 'square',
      },
      {
        id: 'vente-speciale',
        subject: 'Vente spéciale réelle',
        ratio: '1:1',
        orientation: 'square',
      },
      {
        id: 'details-textiles',
        subject: 'Détails textiles',
        ratio: '1:1',
        orientation: 'square',
      },
      {
        id: 'signalisation',
        subject: 'Signalisation du lieu',
        ratio: '1:1',
        orientation: 'square',
      },
    ],
  },
  closing: {
    eyebrow: 'Avant d’apporter des articles',
    title: 'Obtenir les renseignements à jour',
    description:
      'Les conditions de don et les périodes de réception des articles ne sont pas encore publiées. Communiquez avec la friperie avant d’apporter des articles.',
    primaryCta: {
      label: 'Communiquer avec la paroisse',
      href: '/contact/',
    },
    secondaryCta: {
      label: 'Voir les événements de la paroisse',
      href: '/evenements/',
    },
  },
} as const satisfies ThriftStorePageData;
