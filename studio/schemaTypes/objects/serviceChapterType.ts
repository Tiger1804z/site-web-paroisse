import {defineType, defineField, defineArrayMember} from 'sanity'

/**
 * Un chapitre de la page Nos services : un bandeau coloré qui regroupe
 * plusieurs services.
 *
 * `surface` est une liste fermée : chaque valeur correspond à un traitement
 * visuel codé. L'éditrice choisit lequel appliquer, elle n'invente pas une
 * couleur.
 *
 * L'image d'ambiance de certains chapitres reste un fichier du projet tant que
 * les visuels de page ne sont pas migrés.
 */
const SURFACES = [
  {title: 'Ivoire', value: 'ivory'},
  {title: 'Papier', value: 'paper'},
  {title: 'Anthracite', value: 'charcoal'},
  {title: 'Bordeaux', value: 'burgundy'},
]

export const serviceChapterType = defineType({
  name: 'serviceChapter',
  title: 'Chapitre',
  type: 'object',
  fields: [
    defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Ancre',
      type: 'slug',
      description:
        'Identifiant du chapitre dans l’adresse, après le #. Le sommaire de la page et la redirection de /location-de-salle/ s’en servent : ne plus le changer une fois publié.',
      options: {source: 'title', maxLength: 60},
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
      name: 'surface',
      title: 'Traitement visuel',
      type: 'string',
      options: {list: SURFACES, layout: 'radio'},
      initialValue: 'ivory',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [defineArrayMember({type: 'parishService'})],
      description: 'L’ordre du tableau fait foi.',
      validation: (rule) => rule.min(1),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'eyebrow', services: 'services'},
    prepare({title, subtitle, services}) {
      const count = Array.isArray(services) ? services.length : 0
      return {
        title: title || 'Chapitre',
        subtitle: `${subtitle ? `${subtitle} — ` : ''}${count} service${count > 1 ? 's' : ''}`,
      }
    },
  },
})
