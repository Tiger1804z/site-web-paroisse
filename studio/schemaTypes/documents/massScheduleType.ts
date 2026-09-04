import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

/**
 * Le jour civil d'un instant, dans le fuseau de la paroisse, sous une forme
 * qui se compare comme du texte (`2026-09-01`). `en-CA` produit exactement
 * l'ordre année-mois-jour.
 */
const PARISH_DAY_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/Toronto',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})

function parishDay(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? undefined : PARISH_DAY_FORMATTER.format(timestamp)
}

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
    /**
     * La date que le site publie sous « Horaires vérifiés le ».
     *
     * Elle reste saisie à la main, et c'est voulu : vérifier des horaires avec
     * le secrétariat est un geste humain, que la date d'enregistrement du
     * document ne prouve pas. Corriger une virgule modifierait le document sans
     * que personne n'ait rien vérifié.
     *
     * Mais l'inverse est arrivé, et c'est ce que l'avertissement ci-dessous
     * attrape : le 1er septembre 2026, deux messes ont été ajoutées sans que
     * cette date bouge, et le site a continué d'annoncer le 29 juillet.
     * L'avertissement ne bloque pas la publication — il pose la question au
     * seul moment où quelqu'un peut y répondre.
     */
    defineField({
      name: 'lastReviewedAt',
      title: 'Horaires vérifiés le',
      type: 'datetime',
      description:
        'Date réelle de la dernière vérification des horaires avec la paroisse. C’est elle que le site affiche, sous « Horaires vérifiés le ». Le libellé français est généré automatiquement. À mettre à jour chaque fois qu’une heure change.',
      validation: (rule) =>
        rule
          .custom((value, context) => {
            const reviewed = parishDay(value)
            if (!reviewed) return true

            const document = context.document as {_updatedAt?: unknown} | undefined
            const changed = parishDay(document?._updatedAt)
            if (!changed || reviewed >= changed) return true

            return 'Ces horaires ont été modifiés après cette date. Si les heures affichées sont les bonnes, mettez la date à aujourd’hui : c’est celle que le site publie.'
          })
          .warning(),
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
