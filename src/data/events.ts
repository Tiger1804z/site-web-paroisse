import heroImage from '@/assets/images/paroisse/autel-decor-rouge-01.jpg';
import concertImage from '@/assets/images/events/concert-paroissial-01.png';
import celebrationImage from '@/assets/images/events/grande-celebration-01.png';
import { SITE_NAME } from '@/lib/site';
import type { EventsPageData } from '@/types/events';

export const eventsPageData = {
  seo: {
    title: 'Événements',
    description: `Découvrez un premier aperçu des célébrations, initiatives d’entraide et rencontres de la ${SITE_NAME}.`,
  },
  hero: {
    eyebrow: 'Calendrier',
    title: 'Événements',
    introduction:
      'Découvrez les célébrations, initiatives d’entraide et rencontres qui peuvent rythmer la vie de la communauté.',
    image: {
      kind: 'image',
      image: heroImage,
      imageAlt:
        'Vue de l’autel décoré de fleurs et de tissus rouges dans l’église',
      position: 'center 52%',
    },
  },
  overview: {
    eyebrow: 'Vie paroissiale',
    title: 'Cinq façons de se rassembler',
    introduction:
      'Ce premier aperçu présente des célébrations, des rendez-vous culturels et des initiatives qui créent des occasions de rencontre.',
    confirmationNote:
      'Les dates, les horaires et les modalités seront publiés après confirmation par la paroisse.',
  },
  categories: [
    {
      id: 'concerts-evenements-culturels',
      slug: 'concerts-evenements-culturels',
      title: 'Concerts et événements culturels',
      summary:
        'La paroisse peut accueillir des concerts, des prestations musicales et différentes rencontres culturelles ouvertes à la communauté.',
      category: 'cultural',
      visual: {
        kind: 'image',
        image: concertImage,
        imageAlt:
          'Public assis dans une nef pendant un concert avec piano et ensemble à cordes près de l’autel',
        position: 'center center',
      },
      featured: true,
      active: true,
      confirmationRequired: true,
    },
    {
      id: 'messes-grandes-celebrations',
      slug: 'messes-grandes-celebrations',
      title: 'Messes et grandes célébrations',
      summary:
        'Certaines périodes de l’année donnent lieu à des célébrations liturgiques particulières et à des rassemblements plus solennels.',
      category: 'liturgical',
      visual: {
        kind: 'image',
        image: celebrationImage,
        imageAlt:
          'Nef et autel décorés de fleurs blanches pour une célébration solennelle',
        position: 'center center',
      },
      featured: false,
      active: true,
      confirmationRequired: true,
      cta: {
        label: 'Consulter les horaires',
        href: '/horaires/',
      },
    },
    {
      id: 'friperie-entraide',
      slug: 'friperie-entraide',
      title: 'Friperie et entraide',
      summary:
        'La friperie paroissiale contribue à donner une seconde vie aux vêtements tout en soutenant les personnes et les familles de la communauté.',
      category: 'mutual-aid',
      visual: {
        kind: 'clothing-rack',
        accessibleLabel:
          'Illustration animée d’un portant présentant plusieurs vêtements',
      },
      featured: false,
      active: true,
      confirmationRequired: true,
    },
    {
      id: 'rencontres-communautaires',
      slug: 'rencontres-communautaires',
      title: 'Rencontres communautaires',
      summary:
        'Après certaines célébrations ou lors d’activités spéciales, la communauté peut se retrouver autour d’un café, d’un repas ou d’un moment de partage.',
      category: 'community',
      visual: {
        kind: 'community-meal',
        accessibleLabel:
          'Illustration animée d’une tasse de café chaud et d’un repas partagé',
      },
      featured: false,
      active: true,
      confirmationRequired: true,
    },
    {
      id: 'familles-jeunes-generations',
      slug: 'familles-jeunes-generations',
      title: 'Familles, jeunes et générations',
      summary:
        'Enfants, adolescents, adultes et aînés sont invités à participer à la vie de la paroisse et à créer des liens entre les générations.',
      category: 'community',
      visual: {
        kind: 'generations-chain',
        accessibleLabel:
          'Illustration représentant une chaîne intergénérationnelle formée par un enfant, un adolescent, une adulte et une aînée.',
      },
      featured: false,
      active: true,
      confirmationRequired: true,
    },
  ],
} as const satisfies EventsPageData;
