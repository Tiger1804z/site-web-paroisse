import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

/**
 * Donnée partagée, pas contenu de page.
 *
 * Les horaires des messes sont affichés par la page Horaires ET par l’accueil.
 * Ils vivent donc dans leur propre document : on les corrige à un seul endroit
 * et le site entier suit.
 */
export const massScheduleType = defineType({
  name: 'massSchedule',
  title: 'Horaires des messes',
  type: 'document',
  icon: CalendarIcon,
  fields: [
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
  preview: {
    select: {
      title: 'regularSchedule.title',
      entries: 'regularSchedule.entries',
    },
    prepare({title, entries}) {
      const count = Array.isArray(entries) ? entries.length : 0
      return {
        title: title || 'Horaires des messes',
        subtitle:
          count === 0
            ? 'Aucune célébration'
            : `${count} célébration${count > 1 ? 's' : ''} régulière${count > 1 ? 's' : ''}`,
      }
    },
  },
})
