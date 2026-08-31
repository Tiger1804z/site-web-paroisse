import {defineType, defineField} from 'sanity'
import {ScheduleTimeInput} from '../../components/ScheduleTimeInput'
import {normalizeScheduleTime} from '../../lib/scheduleTime'

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

/**
 * L'aperçu d'une ligne de tableau doit parler la langue de l'éditrice.
 *
 * Sans cette table, la liste des célébrations affichait `tuesday · 08:00` : la
 * valeur machine, celle que le site ne montre jamais. Le champ proposait bien
 * « Mardi », mais la ligne repliée le contredisait.
 */
const WEEKDAY_LABELS: Record<string, string> = Object.fromEntries(
  WEEKDAYS.map(({title, value}) => [value, title]),
)

/** `08:00` → `8 h`, `10:30` → `10 h 30`. Comme le site l'affiche. */
function formatTimeLabel(value?: string): string | undefined {
  const normalized = normalizeScheduleTime(value)
  if (!normalized) return undefined

  const hours = Number(normalized.slice(0, 2))
  const minutes = normalized.slice(3)

  return minutes === '00' ? `${hours} h` : `${hours} h ${minutes}`
}

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
      description:
        'Écrire l’heure comme on la dit : 8 h, 8h30, 16 h. Elle se met en forme toute seule quand on quitte le champ.',
      placeholder: '8 h 30',
      components: {input: ScheduleTimeInput},
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as ScheduleEntryParent
          const isWeekly = parent?.recurrenceType === 'weekly'
          if (!value) {
            return isWeekly ? 'Indiquer l’heure de cette célébration.' : true
          }
          return normalizeScheduleTime(value)
            ? true
            : 'Heure incomprise. Écrire par exemple 8 h, 8h30 ou 16 h.'
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
      description: 'Facultatif. Sans valeur, l’ordre du tableau (glisser-déposer) est utilisé.',
      validation: (rule) => rule.integer().min(0),
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
      const day = recurrenceType === 'weekly' ? WEEKDAY_LABELS[weekday as string] : displayLabel
      const subtitle = [day, formatTimeLabel(time)].filter(Boolean).join(' · ')
      return {
        title: `${active === false ? '⏸ ' : ''}${title || 'Célébration'}`,
        subtitle: subtitle || undefined,
      }
    },
  },
})
