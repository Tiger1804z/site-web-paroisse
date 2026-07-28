import churchExteriorImage from '@/assets/images/paroisse/eglise-exterieur-clochers-01.webp';
import type { PublicContactDetails } from '@/types/siteSettings';
import type { Advertiser, AdvertisersPageData } from '@/types/advertisers';

export const advertisersData = [
  {
    id: 'buffet-marina',
    slug: 'buffet-marina',
    name: 'Buffet Marina',
    category: 'Réception et service traiteur',
    description:
      'La page historique présente Buffet Marina pour des réceptions, mariages, cocktails et fêtes. Cette description et l’entente publicitaire doivent être reconfirmées avant publication.',
    address: {
      lines: ['4397, rue Denis-Papin', 'Montréal, Québec'],
    },
    phone: {
      display: '514 728-4345',
      href: 'tel:+15147284345',
    },
    email: {
      display: 'info@buffetmarina.com',
      href: 'mailto:info@buffetmarina.com',
    },
    website: {
      label: 'Site Web de Buffet Marina',
      href: 'https://www.buffetmarina.com/',
    },
    status: 'confirmation-required',
    featured: true,
    order: 1,
    confirmationNote:
      'Confirmer l’entente active, les coordonnées, le texte et obtenir un logo officiel après le retour de la secrétaire.',
  },
  {
    id: 'frantz-benjamin',
    slug: 'frantz-benjamin',
    name: 'Frantz Benjamin',
    category: 'Élu — placement historique',
    address: {
      lines: ['3333, rue Jarry Est, bureau 202', 'Montréal, Québec H1Z 2E5'],
    },
    phone: {
      display: '514 728-2474',
      href: 'tel:+15147282474',
    },
    email: {
      display: 'Frantz.Benjamin.viau@assnat.qc.ca',
      href: 'mailto:Frantz.Benjamin.viau@assnat.qc.ca',
    },
    status: 'confirmation-required',
    featured: false,
    order: 2,
    confirmationNote:
      'Coordonnées lues dans une image historique. Confirmer le mandat, l’entente, les données et les droits du portrait avant toute publication.',
  },
  {
    id: 'josue-corvil',
    slug: 'josue-corvil',
    name: 'Josué Corvil',
    category: 'Élu — placement historique',
    address: {
      lines: ['405, avenue Ogilvy', 'Montréal, Québec H3N 1M3'],
    },
    phone: {
      display: '514 872-7800',
      href: 'tel:+15148727800',
    },
    email: {
      display: 'josue.corvil@montreal.ca',
      href: 'mailto:josue.corvil@montreal.ca',
    },
    status: 'confirmation-required',
    featured: false,
    order: 3,
    confirmationNote:
      'Coordonnées lues dans une image historique. Confirmer le mandat, l’entente, les données et les droits du portrait avant toute publication.',
  },
  {
    id: 'patricia-lattanzio',
    slug: 'patricia-lattanzio',
    name: 'Patricia Lattanzio',
    category: 'Élue — placement historique',
    address: {
      lines: ['Bureau de circonscription de Saint-Léonard', 'Québec H1R 3Y6'],
    },
    phone: {
      display: '514 256-4548',
      href: 'tel:+15142564548',
    },
    email: {
      display: 'Patricia.Lattanzio@parl.gc.ca',
      href: 'mailto:Patricia.Lattanzio@parl.gc.ca',
    },
    status: 'confirmation-required',
    featured: false,
    order: 4,
    confirmationNote:
      'Coordonnées lues dans une image historique incomplète. Confirmer le mandat, l’entente, l’adresse complète et les droits du portrait avant toute publication.',
  },
] as const satisfies readonly Advertiser[];

export function buildAdvertisersPageSource(
  siteSettings: PublicContactDetails,
): AdvertisersPageData {
  return {
    seo: {
      title: 'Nos annonceurs',
      description:
        'Découvrez comment les contributions publicitaires peuvent soutenir les communications et la mission de la Paroisse Saint-René-Goupil.',
      canonicalPath: '/nos-annonceurs/',
      noIndex: true,
    },
    hero: {
      eyebrow: 'Soutenir notre mission',
      title: 'Nos annonceurs',
      introduction:
        'Un espace de reconnaissance pour les commerces, organisations et personnes dont la contribution publicitaire soutient les communications de la paroisse.',
      image: churchExteriorImage,
      imageAlt:
        'Vue extérieure de la Paroisse Saint-René-Goupil et de ses clochers',
      objectPosition: 'center 42%',
    },
    introduction: {
      eyebrow: 'Reconnaissance',
      title: 'Des présences qui contribuent à la vie paroissiale',
      paragraphs: [
        'La publicité diffusée dans les communications paroissiales peut procurer un soutien financier à la mission de la paroisse tout en donnant une visibilité locale aux annonceurs.',
        'La liste publique est volontairement préparée avec soin : une entreprise ou une personne n’y apparaît qu’après confirmation de son entente, de ses coordonnées et des droits liés à ses visuels.',
      ],
      disclosure:
        'Une présence sur cette page constitue un placement publicitaire; elle ne représente pas une recommandation ni une garantie des services offerts.',
    },
    advertisers: advertisersData,
    solicitation: {
      eyebrow: 'Devenir annonceur',
      title: 'Soutenir la paroisse par une présence publicitaire',
      description:
        'Un espace publicitaire peut être offert dans le feuillet paroissial ou dans d’autres communications, selon les supports, disponibilités et modalités confirmés par le secrétariat.',
      details: [
        'Les formats, périodes et conditions sont communiqués directement par la paroisse.',
        'Aucun tarif ni espace disponible n’est annoncé en temps réel sur le site.',
      ],
      phone: siteSettings.phone,
      phoneLabel: 'Téléphoner au secrétariat',
      contactLabel: 'Voir nos coordonnées',
      contactHref: '/contact/',
    },
    settings: {
      showAdvertisers: true,
      showSolicitation: true,
    },
  } as const satisfies AdvertisersPageData;
}
