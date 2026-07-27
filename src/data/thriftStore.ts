import blueRackImage from '@/assets/images/thrift-store/blue-rack-temporary.webp';
import clothingRackImage from '@/assets/images/thrift-store/clothing-rack-primary-temporary.jpeg';
import leatherJacketImage from '@/assets/images/thrift-store/leather-jacket-temporary.jpg';
import vintageRackImage from '@/assets/images/thrift-store/vintage-rack-temporary.jpg';
import { SITE_NAME } from '@/lib/site';
import type {
  ThriftStoreImage,
  ThriftStorePageData,
} from '@/types/thriftStore';

const sharedReplacementNote =
  'Prototype temporaire — remplacer par une photographie réelle de la friperie prise à l’église après confirmation des droits.';

const clothingRackVisual = {
  image: clothingRackImage,
  alt: 'Main prenant un vêtement brun sur un portant dans une boutique non identifiée',
  sourceNote:
    'Fichier entrant fast-fashion2.jpeg; aucune provenance ou licence exploitable dans les métadonnées.',
  status: 'rights-unverified',
  replacementNote: sharedReplacementNote,
} as const satisfies ThriftStoreImage;

const leatherJacketVisual = {
  image: leatherJacketImage,
  alt: 'Détail d’une veste en suède brun suspendue sur un portant',
  sourceNote:
    'Le nom du fichier associe le visuel à Rifugio Leather; la source exacte et la licence restent à confirmer.',
  status: 'rights-unverified',
  replacementNote: sharedReplacementNote,
} as const satisfies ThriftStoreImage;

const vintageRackVisual = {
  image: vintageRackImage,
  alt: 'Vestes de plusieurs couleurs alignées sur un portant',
  credit: 'Alex Natt — crédit présent dans les métadonnées',
  sourceNote:
    'Reportage Hang-Up Vintage publié par Permanent Style; aucune licence de réutilisation confirmée.',
  status: 'rights-unverified',
  replacementNote: sharedReplacementNote,
} as const satisfies ThriftStoreImage;

const blueRackVisual = {
  image: blueRackImage,
  alt: 'Chemises bleues et claires suspendues à des cintres en bois',
  sourceNote:
    'Le nom du fichier contient l’identifiant iStock 688127540; preuve d’achat et licence à confirmer.',
  status: 'rights-unverified',
  replacementNote: sharedReplacementNote,
} as const satisfies ThriftStoreImage;

export const thriftStorePageData = {
  seo: {
    title: 'Friperie',
    description: `Découvrez la friperie de la ${SITE_NAME}, son rôle communautaire et les informations qui seront confirmées avant votre visite.`,
    canonicalPath: '/friperie/',
    noIndex: true,
  },
  hero: {
    eyebrow: 'Services paroissiaux',
    title: 'La friperie',
    introduction:
      'Donnez une seconde vie aux articles et découvrez un lieu paroissial accessible, chaleureux et tourné vers la communauté.',
    primaryImage: clothingRackVisual,
    revealImages: [
      leatherJacketVisual,
      vintageRackVisual,
      blueRackVisual,
      clothingRackVisual,
    ],
  },
  introduction: {
    eyebrow: 'Notre friperie',
    title: 'Présentation',
    paragraphs: [
      'La friperie paroissiale est un espace de réemploi au service de la communauté. Les articles offerts et leurs prix peuvent varier au cours de l’année.',
      'Les photographies réelles du local seront intégrées après une séance à l’église. Les visuels actuels servent uniquement à valider la composition.',
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
    hours: {
      confirmed: false,
    },
    location: {
      confirmed: false,
    },
    donationConditions: {
      confirmed: false,
    },
    responsibleContact: {
      confirmed: false,
    },
    pricingNote: {
      value:
        'Les prix peuvent varier selon les articles et les périodes de l’année.',
      confirmed: true,
    },
    specialSalesNote: {
      value: 'Des ventes spéciales peuvent être annoncées occasionnellement.',
      confirmed: true,
    },
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
      order: 1,
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
      'Les conditions de don, les périodes de réception, les horaires et les coordonnées responsables doivent encore être confirmés. Communiquez avec la paroisse avant de vous déplacer ou d’apporter des articles.',
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
