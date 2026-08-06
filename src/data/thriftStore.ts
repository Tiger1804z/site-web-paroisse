import { SITE_NAME } from '@/lib/site';
import type { ThriftStorePageData } from '@/types/thriftStore';

export const thriftStorePageData = {
  seo: {
    title: 'Friperie Au Coin de l’Entraide',
    description: `La friperie Au Coin de l’Entraide, au sous-sol de la ${SITE_NAME} : vêtements et articles pour la maison, dans le respect et la confidentialité.`,
  },
  hero: {
    eyebrow: 'Friperie paroissiale',
    title: 'Au Coin de l’Entraide',
    introduction:
      'Un lieu de partage au service de la communauté, pour se vêtir ou trouver de petits articles pour la maison.',
    slides: [],
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
    items: [],
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
