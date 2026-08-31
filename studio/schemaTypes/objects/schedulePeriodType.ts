import {defineType, defineField, defineArrayMember} from 'sanity'
import {normalizeScheduleTime} from '../../lib/scheduleTime'

// Champs identifiants d'une entrée, pour détecter les doublons dans le tableau.
type ScheduleEntryValue = {
  recurrenceType?: string
  weekday?: string
  displayLabel?: string
  time?: string
  title?: string
}

export const schedulePeriodType = defineType({
  name: 'schedulePeriod',
  title: 'Groupe d’horaires',
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
      rows: 2,
    }),
    defineField({
      name: 'validFrom',
      title: 'Valable à partir du',
      type: 'date',
      description:
        'Facultatif — pour un horaire saisonnier. Le libellé français est dérivé automatiquement.',
    }),
    defineField({
      name: 'validUntil',
      title: 'Valable jusqu’au',
      type: 'date',
      description: 'Facultatif — pour un horaire saisonnier.',
    }),
    defineField({
      name: 'entries',
      title: 'Célébrations',
      type: 'array',
      of: [defineArrayMember({type: 'scheduleEntry'})],
      validation: (rule) =>
        rule.custom((value, context) => {
          const entries = (value as ScheduleEntryValue[] | undefined) ?? []
          const parent = context.parent as {active?: boolean}

          if (parent?.active && entries.length === 0) {
            return 'Un groupe actif doit contenir au moins une célébration.'
          }

          const seen = new Set<string>()
          for (const entry of entries) {
            const signature = [
              entry?.recurrenceType,
              entry?.weekday,
              entry?.displayLabel,
              // Sur la forme normalisée : « 8 h » et « 08:00 » sont la même
              // heure, et deux lignes identiques ne doivent pas passer parce
              // qu'elles ont été tapées différemment.
              normalizeScheduleTime(entry?.time),
              entry?.title,
            ]
              .map((part) => (part ?? '').trim().toLowerCase())
              .join('|')
            if (seen.has(signature)) {
              return 'Cette célébration est déjà dans la liste, au même jour et à la même heure.'
            }
            seen.add(signature)
          }

          return true
        }),
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
      description:
        'Pour classer les groupes saisonniers. Sans effet pour l’horaire régulier unique.',
      validation: (rule) => rule.integer().min(0),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      active: 'active',
      entries: 'entries',
    },
    prepare({title, active, entries}) {
      const count = Array.isArray(entries) ? entries.length : 0
      const label =
        count === 0 ? 'aucune célébration' : `${count} célébration${count > 1 ? 's' : ''}`
      return {
        title: `${active === false ? '⏸ ' : ''}${title || 'Groupe d’horaires'}`,
        subtitle: label,
      }
    },
  },
})
