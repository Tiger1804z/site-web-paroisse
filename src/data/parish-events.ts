import type {
  EventsPageSettings,
  HomepageEventsSettings,
} from '@/types/parish-events';

/**
 * Les activités datées vivent désormais dans la collection Sanity
 * `parishEvent` : elles sont saisies par la paroisse, pas par un développeur.
 *
 * Il n'y a volontairement aucun repli local. Un événement inventé n'aurait
 * aucun sens : si la lecture échoue, les sections concernées restent vides et
 * le reste de la page continue de s'afficher.
 *
 * Ne restent ici que les réglages d'affichage, qui migreront avec les documents
 * `eventsPage` et `homePage`.
 */
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
