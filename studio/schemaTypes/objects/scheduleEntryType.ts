import {defineType, defineField} from 'sanity'

// Jours contrôlés : valeur machine en anglais (source de vérité calculable),
// libellé français affiché à l'éditrice. Le libellé « Samedi » du frontend est
// dérivé de `saturday` dans le normalizer, jamais saisi à la main.
const WEEKDAYS = [
  {title: 'Dimanche', value: 'sunday'},
  {title: 'Lundi', value: 'monday'},
  {title: 'Mardi', value: 'tuesday'},
  {title: 'Mercredi', value: 'wednesday'},
  {title: 'Jeudi', value: 'thursday'},
  {title: 'Vendredi', value: 'friday'},
  {title: 'Samedi', value: 'saturday'},
]

// Petit type local pour lire le champ frère `recurrenceType` dans les
// validations conditionnelles (context.parent n'est pas typé par TypeGen).
type ScheduleEntryParent = {recurrenceType?: string}

export const scheduleEntryType = defineType({
  name: 'scheduleEntry',
  title: 'Célébration',
  type: 'object',
  fields: [
    defineField({
      name: 'recurrenceType',
      title: 'Type de récurrence',
      type: 'string',
      options: {
        list: [
          {title: 'Hebdomadaire (jour + heure)', value: 'weekly'},
          {title: 'Personnalisé (libellé libre)', value: 'custom'},
        ],
        layout: 'radio',
      },
      initialValue: 'weekly',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'weekday',
      title: 'Jour de la semaine',
      type: 'string',
      options: {list: WEEKDAYS},
      hidden: ({parent}) => (parent as ScheduleEntryParent)?.recurrenceType !== 'weekly',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as ScheduleEntryParent
          if (parent?.recurrenceType !== 'weekly') return true
          return value ? true : 'Choisir un jour de la semaine.'
        }),
    }),
    defineField({
      name: 'displayLabel',
      title: 'Libellé affiché',
      type: 'string',
      description:
        'Texte affiché tel quel (ex. : « Premier vendredi du mois »). Réservé au mode personnalisé.',
      hidden: ({parent}) => (parent as ScheduleEntryParent)?.recurrenceType !== 'custom',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as ScheduleEntryParent
          if (parent?.recurrenceType !== 'custom') return true
          return value ? true : 'Le libellé affiché est requis en mode personnalisé.'
        }),
    }),
    defineField({
      name: 'time',
      title: 'Heure',
      type: 'string',
      description: 'Format 24 h : HH:mm (ex. : 16:00). Facultatif en mode personnalisé.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as ScheduleEntryParent
          const isWeekly = parent?.recurrenceType === 'weekly'
          if (!value) {
            return isWeekly ? 'L’heure est requise pour une célébration hebdomadaire.' : true
          }
          return /^([01]\d|2[0-3]):[0-5]\d$/.test(value)
            ? true
            : 'Utiliser le format 24 h HH:mm (ex. : 16:00).'
        }),
    }),
    defineField({
      name: 'title',
      title: 'Type de célébration',
      type: 'string',
      description: 'Ex. : Messe dominicale, Vigile, Messe de semaine.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
    }),
    defineField({
      name: 'active',
      title: 'Actif',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'Ordre d’affichage',
      type: 'number',
      validation: (rule) => rule.required().integer().min(0),
    }),
  ],
  preview: {
    select: {
      recurrenceType: 'recurrenceType',
      weekday: 'weekday',
      displayLabel: 'displayLabel',
      time: 'time',
      title: 'title',
      active: 'active',
    },
    prepare({recurrenceType, weekday, displayLabel, time, title, active}) {
      const day = recurrenceType === 'weekly' ? weekday : displayLabel
      const subtitle = [day, time].filter(Boolean).join(' · ')
      return {
        title: `${active === false ? '⏸ ' : ''}${title || 'Célébration'}`,
        subtitle: subtitle || undefined,
      }
    },
  },
})
