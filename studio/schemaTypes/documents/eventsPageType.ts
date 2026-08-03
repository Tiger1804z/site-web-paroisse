import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Contenu propre à la page /evenements.
 *
 * Les activités datées n'y sont pas : ce sont des documents `parishEvent`,
 * lus aussi par l'accueil. Ce document ne porte que le décor de la page et les
 * catégories permanentes, qui décrivent des façons de se rassembler plutôt que
 * des rendez-vous.
 */
export const eventsPageType = defineType({
  name: 'eventsPage',
  title: 'Page Événements',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'categories', title: 'Façons de se rassembler'},
    {name: 'sections', title: 'Sections d’activités'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'En-tête (hero)',
      type: 'object',
      group: 'header',
      description:
        'L’image du hero reste définie par le code tant que les visuels de page ne sont pas migrés.',
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
        defineField({
          name: 'image',
          title: 'Image de fond',
          type: 'eventImage',
          description:
            'La photographie du premier écran. Sans elle, l’en-tête garde son fond sombre et le titre reste lisible.',
        }),
      ],
    }),
    defineField({
      name: 'overview',
      title: 'Présentation des catégories',
      type: 'object',
      group: 'categories',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'introduction',
          title: 'Introduction',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'confirmationNote',
          title: 'Note de confirmation',
          type: 'text',
          rows: 2,
          description: 'Phrase rappelant que dates et modalités sont publiées après confirmation.',
        }),
      ],
    }),
    defineField({
      name: 'categories',
      title: 'Façons de se rassembler',
      type: 'array',
      group: 'categories',
      of: [defineArrayMember({type: 'eventCategory'})],
      description:
        'Catégories permanentes, pas des rendez-vous datés. L’ordre du tableau fait foi.',
    }),
    defineField({
      name: 'upcomingSectionTitle',
      title: 'Titre de la section « à venir »',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'showUpcomingSection',
      title: 'Afficher la section « à venir »',
      type: 'boolean',
      description: 'Une section sans activité reste masquée de toute façon.',
      group: 'sections',
      initialValue: true,
    }),
    defineField({
      name: 'upcomingLimit',
      title: 'Nombre maximal d’activités à venir',
      type: 'number',
      description: 'Laisser vide pour toutes les afficher.',
      group: 'sections',
      validation: (rule) => rule.integer().min(1),
    }),
    defineField({
      name: 'pastSectionTitle',
      title: 'Titre de la section « archives »',
      type: 'string',
      group: 'sections',
    }),
    defineField({
      name: 'showPastSection',
      title: 'Afficher la section « archives »',
      type: 'boolean',
      group: 'sections',
      initialValue: true,
    }),
    defineField({
      name: 'pastLimit',
      title: 'Nombre maximal d’activités passées',
      type: 'number',
      group: 'sections',
      validation: (rule) => rule.integer().min(1),
    }),
  ],
  preview: {
    select: {title: 'hero.title', categories: 'categories'},
    prepare({title, categories}) {
      const count = Array.isArray(categories) ? categories.length : 0
      return {
        title: title || 'Page Événements',
        subtitle:
          count === 0
            ? 'Aucune catégorie'
            : `${count} façon${count > 1 ? 's' : ''} de se rassembler`,
      }
    },
  },
})
