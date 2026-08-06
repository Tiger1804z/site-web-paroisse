import type { PublicContactDetails } from '@/types/siteSettings';
import type { Advertiser, AdvertisersPageData } from '@/types/advertisers';

/**
 * Repli local des fiches, doublon de la collection `advertiser` du Studio.
 *
 * Les quatre entrées sont `active` : elles figurent encore sur l'ancien site de
 * la paroisse, donc les publier ici n'est pas une divulgation nouvelle mais la
 * continuité de ce qui est déjà en ligne. Aucun portrait historique n'est repris
 * — seulement les coordonnées déjà affichées publiquement.
 *
 * Ce qui reste à vérifier pour chacune est consigné dans
 * `docs/ADVERTISERS_CONTENT_AUDIT.md` et dans la note de révision de sa fiche
 * Sanity. La secrétaire retire une fiche en la passant à « Inactif », sans
 * changement de code.
 */
export const advertisersData = [
  {
    id: 'buffet-marina',
    name: 'Buffet Marina',
    category: 'Réception et service traiteur',
    description:
      'Réceptions, mariages, cocktails et fêtes d’anniversaire : cuisine, service et tables pour vos événements.',
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
    website: 'https://www.buffetmarina.com/',
    status: 'active',
    order: 1,
  },
  {
    id: 'frantz-benjamin',
    name: 'Frantz Benjamin',
    category: 'Député de Viau — Assemblée nationale du Québec',
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
    status: 'active',
    order: 2,
  },
  {
    id: 'josue-corvil',
    name: 'Josué Corvil',
    category: 'Conseiller de la Ville — district de Saint-Michel',
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
    status: 'active',
    order: 3,
  },
  {
    id: 'patricia-lattanzio',
    name: 'Patricia Lattanzio',
    category: 'Députée de Saint-Léonard–Saint-Michel — Chambre des communes',
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
    status: 'active',
    order: 4,
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
    },
    hero: {
      eyebrow: 'Soutenir notre mission',
      title: 'Nos annonceurs',
      introduction:
        'Un espace de reconnaissance pour les commerces, organisations et personnes dont la contribution publicitaire soutient les communications de la paroisse.',
    },
    introduction: {
      eyebrow: 'Reconnaissance',
      title: 'Des présences qui contribuent à la vie paroissiale',
      paragraphs: [
        'La publicité diffusée dans les communications paroissiales peut procurer un soutien financier à la mission de la paroisse tout en donnant une visibilité locale aux annonceurs.',
        'Les présences reprises ici sont celles que la paroisse publiait déjà. Une entreprise ou une personne qui souhaite corriger ses coordonnées, modifier son texte ou se retirer de cette page peut écrire au secrétariat en tout temps.',
      ],
      disclosure:
        'Une présence sur cette page constitue un placement publicitaire; elle ne représente pas une recommandation ni une garantie des services offerts.',
    },
    advertisers: advertisersData,
    solicitation: {
      eyebrow: 'Devenir annonceur',
      title: 'Soutenir la paroisse par une présence publicitaire',
      // Formulation générique tant que l’existence du feuillet papier et du
      // programme publicitaire n’est pas confirmée (révision du 11 août 2026).
      description:
        'Un espace publicitaire peut être offert dans les communications paroissiales, selon les supports, disponibilités et modalités confirmés par le secrétariat.',
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
