import {defineType, defineField} from 'sanity'

const CATEGORY_KINDS = [
  {title: 'Culturel', value: 'cultural'},
  {title: 'Liturgique', value: 'liturgical'},
  {title: 'Communautaire', value: 'community'},
  {title: 'Entraide', value: 'mutual-aid'},
]

/**
 * Les trois illustrations animées sont des composants codés : l'éditrice les
 * choisit, elle ne peut pas en inventer une qui n'existe pas. Une photographie
 * reste possible pour tout le reste.
 */
const VISUAL_KINDS = [
  {title: 'Photographie', value: 'image'},
  {title: 'Illustration animée — portant de vêtements', value: 'clothing-rack'},
  {title: 'Illustration animée — repas partagé', value: 'community-meal'},
  {
    title: 'Illustration animée — chaîne de générations',
    value: 'generations-chain',
  },
]

const CTA_TARGETS = [
  {title: 'Aucun bouton', value: 'none'},
  {title: 'Vers les horaires', value: 'schedules'},
  {title: 'Vers la friperie', value: 'thriftStore'},
  {title: 'Vers la page Contact', value: 'contact'},
]

type EventCategoryValue = {
  visualKind?: string
}

export const eventCategoryType = defineType({
  name: 'eventCategory',
  title: 'Façon de se rassembler',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'kind',
      title: 'Nature',
      type: 'string',
      options: {list: CATEGORY_KINDS},
      initialValue: 'community',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visualKind',
      title: 'Visuel',
      type: 'string',
      options: {list: VISUAL_KINDS, layout: 'radio'},
      initialValue: 'clothing-rack',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Photographie',
      type: 'eventImage',
      hidden: ({parent}) => (parent as EventCategoryValue)?.visualKind !== 'image',
    }),
    defineField({
      name: 'illustrationLabel',
      title: 'Description de l’illustration',
      type: 'string',
      description:
        'Lue par les lecteurs d’écran, puisque l’illustration n’est pas une photographie.',
      hidden: ({parent}) => (parent as EventCategoryValue)?.visualKind === 'image',
    }),
    defineField({
      name: 'ctaTarget',
      title: 'Bouton',
      type: 'string',
      options: {list: CTA_TARGETS},
      initialValue: 'none',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Texte du bouton',
      type: 'string',
      hidden: ({parent}) =>
        !(parent as {ctaTarget?: string})?.ctaTarget ||
        (parent as {ctaTarget?: string}).ctaTarget === 'none',
    }),
    defineField({
      name: 'featured',
      title: 'Mise en avant',
      type: 'boolean',
      description: 'Occupe la grande place de la grille.',
      initialValue: false,
    }),
    defineField({
      name: 'active',
      title: 'Affichée',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'confirmationRequired',
      title: 'À confirmer par la paroisse',
      type: 'boolean',
      description: 'Signale que les modalités précises ne sont pas encore validées.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title', active: 'active', media: 'image.image'},
    prepare({title, active, media}) {
      return {
        title: `${active === false ? '⏸ ' : ''}${title || 'Catégorie'}`,
        media,
      }
    },
  },
})
