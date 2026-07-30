import {defineType, defineField} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

/**
 * Contenu propre à la page d'accueil.
 *
 * Le document ne porte pour l'instant que les réglages de la section des
 * activités — décider combien d'activités montrer sur l'accueil est une
 * décision de l'accueil, ni de la collection d'événements ni de la page
 * Événements.
 *
 * Il grandira : l'accueil est la page la plus éditoriale du site.
 */
export const homePageType = defineType({
  name: 'homePage',
  title: 'Page d’accueil',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'upcomingEventsTitle',
      title: 'Titre de la section des activités',
      type: 'string',
      description: 'Ex. : Prochaines activités.',
    }),
    defineField({
      name: 'showUpcomingEvents',
      title: 'Afficher les activités sur l’accueil',
      type: 'boolean',
      description: 'Sans activité à venir, la section reste masquée même si cette case est cochée.',
      initialValue: true,
    }),
    defineField({
      name: 'upcomingEventsLimit',
      title: 'Nombre d’activités affichées',
      type: 'number',
      description: 'Une grande carte plus des cartes secondaires. Quatre au total par défaut.',
      initialValue: 4,
      validation: (rule) => rule.integer().min(1).max(8),
    }),
  ],
  preview: {
    select: {title: 'upcomingEventsTitle'},
    prepare({title}) {
      return {
        title: 'Page d’accueil',
        subtitle: title || undefined,
      }
    },
  },
})
