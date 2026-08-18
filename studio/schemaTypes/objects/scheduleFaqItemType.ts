import {defineType, defineField} from 'sanity'

// Pas de champ « ordre » ici : l'ordre du tableau dans le Studio (glisser-
// déposer) fait foi. Un nombre à saisir à la main serait une deuxième source
// de vérité pour la même information.
export const scheduleFaqItemType = defineType({
  name: 'scheduleFaqItem',
  title: 'Question fréquente',
  type: 'object',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Réponse',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'active',
      title: 'Publiée',
      type: 'boolean',
      description: 'Décocher retire la question du site sans la supprimer.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'question', active: 'active'},
    prepare({title, active}) {
      return {
        title: `${active === false ? '⏸ ' : ''}${title || 'Question'}`,
      }
    },
  },
})
