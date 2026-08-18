import {defineType, defineField} from 'sanity'

/**
 * L'illustration animée est un composant codé : l'éditrice choisit de la
 * montrer ou non, elle ne peut pas en inventer une autre.
 */
const VISUAL_KINDS = [
  {title: 'Illustration animée — portant de vêtements', value: 'clothing-rack'},
  {title: 'Aucune illustration', value: 'none'},
]

export const thriftStoreSectionType = defineType({
  name: 'thriftStoreSection',
  title: 'Section',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visualKind',
      title: 'Illustration',
      type: 'string',
      options: {list: VISUAL_KINDS, layout: 'radio'},
      initialValue: 'clothing-rack',
    }),
    defineField({
      name: 'active',
      title: 'Affichée',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'eyebrow', active: 'active'},
    prepare({title, subtitle, active}) {
      return {
        title: `${active === false ? '⏸ ' : ''}${title || 'Section'}`,
        subtitle,
      }
    },
  },
})
