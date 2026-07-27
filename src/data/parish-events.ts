import notreDameDuCapSecondary from '@/assets/images/events/pilgrimages/notre-dame-du-cap-2026-02.jpg';
import notreDameDuCapCover from '@/assets/images/events/pilgrimages/notre-dame-du-cap-2026-cover.jpg';
import sainteAnneCover from '@/assets/images/events/pilgrimages/sainte-anne-de-beaupre-2026-01.jpg';
import sainteAnneExterior from '@/assets/images/events/pilgrimages/sainte-anne-de-beaupre-2026-02.jpg';
import sainteAnneInterior from '@/assets/images/events/pilgrimages/sainte-anne-de-beaupre-2026-03.jpg';
import {
  PARISH_EVENT_TIME_ZONE,
  type EventsPageSettings,
  type HomepageEventsSettings,
  type ParishEvent,
} from '@/types/parish-events';

export const parishEvents = [
  {
    id: 'pelerinage-sainte-anne-de-beaupre-2026',
    slug: 'pelerinage-sainte-anne-de-beaupre-2026',
    title: 'Pèlerinage à la Basilique Sainte-Anne-de-Beaupré',
    excerpt:
      'La communauté de Saint-René-Goupil s’est rassemblée pour une journée de pèlerinage à la Basilique Sainte-Anne-de-Beaupré.',
    category: 'pilgrimage',
    startAt: '2026-07-25T07:00:00-04:00',
    endAt: '2026-07-25T20:30:00-04:00',
    timeZone: PARISH_EVENT_TIME_ZONE,
    locationName: 'Basilique Sainte-Anne-de-Beaupré',
    meetingPoint: 'Église Saint-René-Goupil',
    departureAt: '2026-07-25T07:00:00-04:00',
    returnAt: '2026-07-25T20:30:00-04:00',
    price: {
      amount: 65,
      currency: 'CAD',
      label: 'par personne',
    },
    publicationStatus: 'published',
    showOnWebsite: true,
    showOnHomepage: false,
    showInArchive: true,
    featured: false,
    coverImage: {
      image: sainteAnneCover,
      alt: 'Vue extérieure de la basilique Sainte-Anne-de-Beaupré, de ses deux clochers et de la grande place',
      rightsNote:
        'Provenance fournie par le client; auteur et licence de publication à confirmer.',
    },
    gallery: [
      {
        image: sainteAnneExterior,
        alt: 'Façade de la basilique Sainte-Anne-de-Beaupré derrière un jardin et une fontaine',
        credit: 'Croisières AML',
        rightsNote:
          'Crédit indiqué dans le nom du fichier source; autorisation ou licence de publication à confirmer.',
      },
      {
        image: sainteAnneInterior,
        alt: 'Vue de la nef de la basilique Sainte-Anne-de-Beaupré, de ses arches, de sa voûte décorée et du sanctuaire',
        credit: 'Wilfredor',
        rightsNote:
          'Métadonnées du fichier : Creative Commons CC0 1.0 Universal Public Domain.',
      },
    ],
  },
  {
    id: 'pelerinage-notre-dame-du-cap-2026',
    slug: 'pelerinage-notre-dame-du-cap-2026',
    title: 'Pèlerinage au Sanctuaire Notre-Dame-du-Cap',
    excerpt:
      'Une journée de pèlerinage est proposée au Sanctuaire Notre-Dame-du-Cap, avec départ depuis l’église Saint-René-Goupil.',
    category: 'pilgrimage',
    startAt: '2026-08-15T09:00:00-04:00',
    endAt: '2026-08-15T23:00:00-04:00',
    timeZone: PARISH_EVENT_TIME_ZONE,
    locationName: 'Sanctuaire Notre-Dame-du-Cap',
    meetingPoint: 'Église Saint-René-Goupil',
    departureAt: '2026-08-15T09:00:00-04:00',
    returnAt: '2026-08-15T23:00:00-04:00',
    price: {
      amount: 55,
      currency: 'CAD',
      label: 'par personne',
    },
    capacityNotice: 'Places limitées',
    contact: {
      name: 'Ginette Simon',
      phone: '514-996-0449',
      phoneHref: 'tel:+15149960449',
    },
    publicationStatus: 'published',
    showOnWebsite: true,
    showOnHomepage: true,
    showInArchive: true,
    featured: true,
    homepagePriority: 1,
    coverImage: {
      image: notreDameDuCapCover,
      alt: 'Vue aérienne du sanctuaire Notre-Dame-du-Cap et du fleuve Saint-Laurent',
      rightsNote:
        'Provenance fournie par le client; auteur et licence de publication à confirmer.',
    },
    gallery: [
      {
        image: notreDameDuCapSecondary,
        alt: 'Vue frontale de la façade en pierre du sanctuaire Notre-Dame-du-Cap sous un ciel bleu',
        rightsNote:
          'Photographie datée de 2011 dans les métadonnées; auteur et licence de publication à confirmer.',
      },
    ],
    cta: {
      label: 'Réserver ou s’informer',
      href: 'tel:+15149960449',
    },
  },
] as const satisfies readonly ParishEvent[];

export const eventsPageSettings: EventsPageSettings = {
  showUpcomingSection: true,
  showPastSection: true,
  upcomingSectionTitle: 'Événements à venir',
  pastSectionTitle: 'Retour sur nos événements',
};

export const homepageEventsSettings: HomepageEventsSettings = {
  showHomepageUpcomingSection: true,
  homepageUpcomingTitle: 'Prochaines activités',
  homepageUpcomingLimit: 4,
};
