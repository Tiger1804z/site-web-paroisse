import {defineType, defineField, defineArrayMember} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

/**
 * Contenu de la page /premiere-visite.
 *
 * Document unique, listes embarquées : étapes, moments de la célébration et
 * questions fréquentes n'ont de sens que sur cette page, et aucune n'a de cycle
 * de vie propre. Même raison qu'aux services et à la vie paroissiale.
 *
 * La particularité de cette page est le bloc « Informations pratiques » : ses
 * lignes ne recopient pas les coordonnées de la paroisse, elles les désignent.
 * Voir `practicalInfoItem`.
 *
 * Les deux boutons choisissent une destination dans une liste fermée; aucune
 * URL ne se saisit à la main.
 */
export const firstVisitPageType = defineType({
  name: 'firstVisitPage',
  title: 'Page Première visite',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'preparation', title: 'Avant la visite'},
    {name: 'expectations', title: 'La célébration'},
    {name: 'practical', title: 'Informations pratiques'},
    {name: 'faq', title: 'Questions fréquentes'},
    {name: 'seo', title: 'Référencement'},
  ],
  fields: [
    defineField({
      name: 'seo',
      title: 'Référencement',
      type: 'object',
      group: 'seo',
      description: 'Ce que lisent les moteurs de recherche et les aperçus de partage.',
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
    }),
    defineField({
      name: 'hero',
      title: 'En-tête (hero)',
      type: 'object',
      group: 'header',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Surtitre',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'introduction',
          title: 'Introduction',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'preparation',
      title: 'Avant votre visite',
      type: 'object',
      group: 'preparation',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({name: 'introduction', title: 'Introduction', type: 'text', rows: 2}),
        defineField({
          name: 'steps',
          title: 'Étapes',
          type: 'array',
          of: [defineArrayMember({type: 'visitStep'})],
          description: 'L’ordre du tableau fait foi.',
        }),
      ],
    }),
    defineField({
      name: 'expectations',
      title: 'À quoi s’attendre',
      type: 'object',
      group: 'expectations',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({name: 'introduction', title: 'Introduction', type: 'text', rows: 2}),
        defineField({
          name: 'items',
          title: 'Moments de la célébration',
          type: 'array',
          of: [defineArrayMember({type: 'expectationItem'})],
          description: 'L’ordre du tableau fait foi.',
        }),
      ],
    }),
    defineField({
      name: 'practicalInformation',
      title: 'Informations pratiques',
      type: 'object',
      group: 'practical',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'items',
          title: 'Lignes',
          type: 'array',
          of: [defineArrayMember({type: 'practicalInfoItem'})],
          description:
            'L’ordre du tableau fait foi. Une ligne dont la source est vide n’est pas affichée.',
        }),
        defineField({
          name: 'primaryCtaLabel',
          title: 'Bouton principal — libellé',
          type: 'string',
          initialValue: 'Voir les horaires',
        }),
        defineField({
          name: 'primaryCtaTarget',
          title: 'Bouton principal — destination',
          type: 'string',
          options: {
            list: [
              {title: 'Horaires', value: 'schedule'},
              {title: 'Contact', value: 'contact'},
              {title: 'Nos services', value: 'services'},
            ],
            layout: 'dropdown',
          },
          initialValue: 'schedule',
        }),
        defineField({
          name: 'secondaryCtaLabel',
          title: 'Bouton secondaire — libellé',
          type: 'string',
          description: 'Laisser vide pour n’afficher qu’un seul bouton.',
          initialValue: 'Nous joindre',
        }),
        defineField({
          name: 'secondaryCtaTarget',
          title: 'Bouton secondaire — destination',
          type: 'string',
          options: {
            list: [
              {title: 'Horaires', value: 'schedule'},
              {title: 'Contact', value: 'contact'},
              {title: 'Nos services', value: 'services'},
            ],
            layout: 'dropdown',
          },
          initialValue: 'contact',
        }),
        defineField({
          name: 'image',
          title: 'Image',
          type: 'eventImage',
          description:
            'Repère visuel affiché à côté des informations. Sans image ici, celle du code prend le relais. Le point focal décide de ce qui reste visible au recadrage.',
        }),
        defineField({
          name: 'imageCaption',
          title: 'Légende de l’image',
          type: 'text',
          rows: 2,
          description: 'Affichée sous l’image.',
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'Questions fréquentes',
      type: 'object',
      group: 'faq',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          initialValue: 'Questions fréquentes',
        }),
        defineField({
          name: 'items',
          title: 'Questions',
          type: 'array',
          of: [defineArrayMember({type: 'firstVisitFaqItem'})],
          description:
            'L’ordre du tableau fait foi. Sans aucune question, la section entière disparaît.',
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.title', steps: 'preparation.steps'},
    prepare({title, steps}) {
      const count = Array.isArray(steps) ? steps.length : 0
      return {
        title: title || 'Page Première visite',
        subtitle: count === 0 ? 'Aucune étape' : `${count} étape${count > 1 ? 's' : ''}`,
      }
    },
  },
})
