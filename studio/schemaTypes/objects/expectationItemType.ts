import {defineType, defineField} from 'sanity'

/**
 * Un grand moment de la célébration, dans « À quoi s'attendre pendant une messe ».
 *
 * Objet volontairement nu : deux champs, aucun identifiant saisi. L'ordre du
 * tableau fait foi et la `_key` sert de discriminant.
 */
export const expectationItemType = defineType({
  name: 'expectationItem',
  title: 'Moment de la célébration',
  type: 'object',
  fields: [
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
      rows: 3,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
