import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

export const schedulePageType = defineType({
  name: 'schedulePage',
  title: 'Horaires',
  type: 'document',
  icon: CalendarIcon,
  fields: [
    defineField({
      name: 'hero',
      title: 'En-tête (hero)',
      type: 'object',
      options: {collapsible: true, collapsed: false},
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
          name: 'imageAlt',
          title: 'Texte alternatif de l’image',
          type: 'string',
          description: 'Description de l’image du hero, pour l’accessibilité.',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'regularSchedule',
      title: 'Horaires réguliers',
      type: 'schedulePeriod',
      description: 'Le groupe principal des messes régulières (semaine, samedi, dimanche).',
    }),
    defineField({
      name: 'seasonalSchedules',
      title: 'Horaires saisonniers',
      type: 'array',
      of: [defineArrayMember({type: 'schedulePeriod'})],
      description:
        'Versions saisonnières facultatives, appliquées sur certaines périodes de l’année.',
    }),
    defineField({
      name: 'lastReviewedAt',
      title: 'Horaires vérifiés le',
      type: 'datetime',
      description:
        'Date réelle de la dernière vérification des horaires avec la paroisse. Le libellé français affiché est généré automatiquement. À ne pas confondre avec une simple modification du document.',
    }),
  ],
})
