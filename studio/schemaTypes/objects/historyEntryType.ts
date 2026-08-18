import {defineType, defineField, defineArrayMember} from 'sanity'

type HistoryEntryValue = {
  imageKind?: string
  image?: {generatedByAi?: boolean; image?: {asset?: {_ref?: string}}}
}

const IMAGE_KINDS = [
  {title: 'Illustration artistique — non documentaire', value: 'ai-illustration'},
  {title: 'Repère documentaire — photographie prise dans l’église', value: 'documentary-photo'},
  {title: 'Photographie actuelle', value: 'current-photo'},
]

/**
 * Un repère de la chronologie historique.
 *
 * Le numéro d'étape n'est pas saisi : il suit l'ordre de la liste. Ajouter un
 * repère au milieu du récit ne demande donc pas de renuméroter les huit autres.
 *
 * La nature de l'image est du contenu, pas de la mise en page : c'est elle qui
 * décide de la légende affichée sous le cadre. Une illustration générée ne doit
 * jamais se présenter comme une archive, et la chronologie le dit à voix haute.
 */
export const historyEntryType = defineType({
  name: 'historyEntry',
  title: 'Repère historique',
  type: 'object',
  fields: [
    defineField({
      name: 'periodLabel',
      title: 'Période',
      type: 'string',
      description:
        'Telle qu’elle s’affiche : « Avant 1959 », « 23 février 1959 », « Aujourd’hui ».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Résumé',
      type: 'text',
      rows: 3,
      description: 'La phrase mise en avant sous le titre.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Paragraphes',
      type: 'array',
      of: [defineArrayMember({type: 'text'})],
      description: 'Précisions facultatives, un paragraphe par entrée.',
    }),
    defineField({
      name: 'image',
      title: 'Illustration',
      type: 'eventImage',
      description:
        'Sans image, le repère s’affiche quand même — mais son cadre disparaît. Cocher « générée par IA » dès qu’il s’agit d’une illustration.',
    }),
    defineField({
      name: 'imageKind',
      title: 'Nature de l’image',
      type: 'string',
      options: {list: IMAGE_KINDS, layout: 'radio'},
      initialValue: 'ai-illustration',
      description: 'Décide de la légende affichée sous l’image.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'sourceLabel',
      title: 'Source éditoriale',
      type: 'string',
      description:
        'D’où vient ce qui est raconté. Ex. : « Récit historique accepté de l’ancien site ». Affiché sur la page.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'disclosure',
      title: 'Avertissement',
      type: 'text',
      rows: 2,
      description:
        'Ce que l’image ne prouve pas. Affiché sous le texte du repère, en plus de l’avertissement général de la section.',
    }),
  ],
  /**
   * Les deux façons de dire « cette image est une illustration » ne doivent pas
   * se contredire : la légende publique et le registre éditorial parlent de la
   * même image.
   */
  validation: (rule) =>
    rule.custom((value) => {
      const entry = value as HistoryEntryValue | undefined
      if (!entry?.image?.image?.asset?._ref) return true

      if (entry.imageKind === 'ai-illustration' && !entry.image.generatedByAi) {
        return 'Nature « illustration artistique » : cocher aussi « générée par IA » dans l’image.'
      }

      if (entry.imageKind !== 'ai-illustration' && entry.image.generatedByAi) {
        return 'L’image est déclarée générée par IA : elle ne peut pas être présentée comme une photographie.'
      }

      return true
    }),
  preview: {
    select: {title: 'title', subtitle: 'periodLabel', media: 'image.image'},
  },
})
