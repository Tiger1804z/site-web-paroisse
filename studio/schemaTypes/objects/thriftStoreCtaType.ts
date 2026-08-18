import {defineType, defineField} from 'sanity'

/**
 * Destinations autorisées : l'éditrice choisit dans une liste, le code
 * construit l'adresse. Les routes du site sont typées (`src/lib/navigation.ts`)
 * et certaines sont inactives — une adresse saisie à la main finirait en 404.
 */
const CTA_TARGETS = [
  {title: 'Vers la page Contact', value: 'contact'},
  {title: 'Vers les événements', value: 'events'},
  {title: 'Vers les horaires', value: 'schedules'},
]

export const thriftStoreCtaType = defineType({
  name: 'thriftStoreCta',
  title: 'Bouton',
  type: 'object',
  fields: [
    defineField({
      name: 'target',
      title: 'Destination',
      type: 'string',
      options: {list: CTA_TARGETS},
      initialValue: 'contact',
    }),
    defineField({
      name: 'label',
      title: 'Texte du bouton',
      type: 'string',
      description: 'Laisser vide pour utiliser le texte par défaut de la destination.',
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'target'},
  },
})
