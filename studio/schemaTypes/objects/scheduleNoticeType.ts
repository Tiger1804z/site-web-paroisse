import {defineType, defineField} from 'sanity'

// Les destinations sont une liste fermée : l'éditrice choisit où mener le
// lecteur, le code garde la construction de l'URL. Une URL libre permettrait de
// publier un lien vers une route encore inactive (voir src/lib/navigation.ts).
const ACTION_TARGETS = [
  {title: 'Aucun lien', value: 'none'},
  {title: 'Vers les célébrations spéciales', value: 'specialCelebrations'},
  {title: 'Vers la page Contact', value: 'contact'},
]

// Ces trois valeurs sont un contrat avec la feuille de style : le composant
// ScheduleNotice.astro sélectionne ses couleurs via [data-severity].
const SEVERITIES = [
  {title: 'Information', value: 'info'},
  {title: 'Important', value: 'important'},
  {title: 'Célébration particulière', value: 'special'},
]

type ScheduleNoticeValue = {
  title?: string
  message?: string
  severity?: string
  actionTarget?: string
  active?: boolean
}

export const scheduleNoticeType = defineType({
  name: 'scheduleNotice',
  title: 'Avis',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      description: 'Ex. : Horaire spécial.',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'severity',
      title: 'Ton de l’avis',
      type: 'string',
      options: {list: SEVERITIES, layout: 'radio'},
      initialValue: 'info',
    }),
    defineField({
      name: 'actionTarget',
      title: 'Lien de l’avis',
      type: 'string',
      options: {list: ACTION_TARGETS, layout: 'radio'},
      initialValue: 'none',
    }),
    defineField({
      name: 'active',
      title: 'Afficher l’avis',
      type: 'boolean',
      description: 'Décocher masque l’avis sans le supprimer. Un avis périmé doit être masqué.',
      initialValue: true,
    }),
  ],
  // Validation portée par l'objet, pas par ses champs : un avis jamais rempli
  // ne doit pas rendre le document invalide. Dès qu'un champ est saisi, le
  // titre et le message deviennent exigibles.
  validation: (rule) =>
    rule.custom((value) => {
      const notice = value as ScheduleNoticeValue | undefined
      if (!notice) return true

      const hasContent = Boolean(notice.title?.trim() || notice.message?.trim())
      if (!hasContent) return true

      if (!notice.title?.trim()) return 'Un avis rempli doit avoir un titre.'
      if (!notice.message?.trim()) return 'Un avis rempli doit avoir un message.'

      return true
    }),
  preview: {
    select: {title: 'title', severity: 'severity', active: 'active'},
    prepare({title, severity, active}) {
      const severityLabel = SEVERITIES.find((item) => item.value === severity)?.title
      return {
        title: `${active === false ? '⏸ ' : ''}${title || 'Aucun avis'}`,
        subtitle: title ? severityLabel : undefined,
      }
    },
  },
})
