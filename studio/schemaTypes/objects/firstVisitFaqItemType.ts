import {defineType, defineField} from 'sanity'

/**
 * Une question fréquente de la page Première visite.
 *
 * Nommé `firstVisitFaqItem` et non `faqItem` : le jour où une autre page aura sa
 * propre foire aux questions, elle n'héritera pas silencieusement de celle-ci.
 */
export const firstVisitFaqItemType = defineType({
  name: 'firstVisitFaqItem',
  title: 'Question',
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
      rows: 4,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'question', subtitle: 'answer'},
  },
})
