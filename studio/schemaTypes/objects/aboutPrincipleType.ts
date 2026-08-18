import {defineType, defineField} from 'sanity'

/**
 * Les trois symboles dessinés dans le code.
 *
 * Une liste fermée : le pictogramme est un tracé SVG du site, pas un fichier à
 * téléverser. Choisir hors liste n'afficherait rien.
 */
const SYMBOLS = [
  {title: 'Livre', value: 'book'},
  {title: 'Personnes', value: 'people'},
  {title: 'Cœur', value: 'heart'},
]

/** Un des repères de « Ce qui nous rassemble ». */
export const aboutPrincipleType = defineType({
  name: 'aboutPrinciple',
  title: 'Repère',
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
    defineField({
      name: 'symbol',
      title: 'Pictogramme',
      type: 'string',
      options: {list: SYMBOLS, layout: 'radio'},
      initialValue: 'book',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
