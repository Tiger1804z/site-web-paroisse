import {defineType, defineField} from 'sanity'

/**
 * Une étape du guide « Avant votre visite ».
 *
 * Le numéro affiché (`numberLabel`) se saisit à la main plutôt que de se
 * déduire du rang : il est rendu tel quel dans la pastille, et une paroisse qui
 * voudrait numéroter autrement ne doit pas avoir à toucher au code.
 *
 * L'identifiant du contrat local n'est pas repris — aucune ancre, aucun lien ne
 * le visait, c'est la `_key` du tableau qui le remplace. Le statut éditorial
 * (`temporary` / `to-confirm`) disparaît pour la même raison qu'à la vie
 * paroissiale : rien ne l'affichait. Ce qui reste à confirmer se dit dans la
 * note, que la visiteuse lit vraiment.
 */
export const visitStepType = defineType({
  name: 'visitStep',
  title: 'Étape',
  type: 'object',
  fields: [
    defineField({
      name: 'numberLabel',
      title: 'Numéro affiché',
      type: 'string',
      description: 'Le numéro tel qu’il apparaît dans la pastille, par exemple « 01 ».',
      validation: (rule) => rule.required(),
    }),
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
    defineField({
      name: 'note',
      title: 'Note',
      type: 'string',
      description:
        'Précision affichée sous la description. Sert à signaler ce qui n’est pas encore confirmé.',
    }),
  ],
  preview: {
    select: {title: 'title', numberLabel: 'numberLabel', note: 'note'},
    prepare({title, numberLabel, note}) {
      return {
        title: [numberLabel, title].filter(Boolean).join(' · ') || 'Étape',
        subtitle: note,
      }
    },
  },
})
