import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Contenu de la page /location-de-salle.
 *
 * La location de salle était un chapitre de la page Nos services, et
 * `/location-de-salle/` une adresse morte qui y renvoyait. La paroisse a
 * demandé l’inverse : un onglet à elle. C’est aussi ce que dit l’usage — on
 * cherche « louer une salle », pas « les services de la paroisse ».
 *
 * Ni téléphone ni adresse de bouton ici : le numéro affiché vient des
 * coordonnées de la paroisse, et le bouton mène toujours à /contact/.
 */
export const roomRentalPageType = defineType({
  name: 'roomRentalPage',
  title: 'Page Location de salle',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'rooms', title: 'Les salles'},
    {name: 'practical', title: 'Réserver'},
    {name: 'seo', title: 'Google et partages'},
  ],
  fields: [
    defineField({
      name: 'seo',
      title: 'Apparence sur Google et dans les partages',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'hero',
      title: 'En-tête (hero)',
      type: 'object',
      group: 'header',
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
          name: 'image',
          title: 'Image de fond',
          type: 'eventImage',
          description:
            'La photographie du premier écran. Sans elle, l’en-tête garde son fond sombre et le titre reste lisible.',
        }),
      ],
    }),
    defineField({
      name: 'offer',
      title: 'Présentation de l’offre',
      type: 'object',
      group: 'rooms',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'periodLabel',
          title: 'Période des tarifs',
          type: 'string',
          description:
            'La période que couvrent les tarifs affichés : « Location 2026-2027 ». À corriger en même temps que les prix.',
        }),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphes',
          type: 'array',
          of: [defineArrayMember({type: 'text', rows: 3})],
          description: 'Un paragraphe par entrée. L’ordre du tableau fait foi.',
        }),
      ],
    }),
    defineField({
      name: 'amenities',
      title: 'Ce que toutes les salles offrent',
      type: 'object',
      group: 'rooms',
      description:
        'Écrit une seule fois pour toutes les salles. Ce qui ne vaut que pour une salle se met dans sa fiche.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'items',
          title: 'Équipements',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description: 'Un équipement par entrée : « Une cuisinette », « Un vestiaire ».',
        }),
      ],
    }),
    defineField({
      name: 'rooms',
      title: 'Les salles',
      type: 'array',
      group: 'rooms',
      of: [defineArrayMember({type: 'rentalRoom'})],
      description: 'L’ordre du tableau fait foi. Une salle retirée d’ici disparaît de la page.',
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'practical',
      title: 'Comment se passe une réservation',
      type: 'object',
      group: 'practical',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'items',
          title: 'Étapes',
          type: 'array',
          of: [defineArrayMember({type: 'serviceDetail'})],
          description:
            'Une étape par entrée : « Réservation », « Confirmée directement avec la paroisse ».',
        }),
      ],
    }),
    defineField({
      name: 'finalCta',
      title: 'Bloc de fin',
      type: 'object',
      group: 'practical',
      description:
        'Le numéro affiché vient des coordonnées de la paroisse, et le bouton mène à la page Contact. Ni l’un ni l’autre ne se saisit ici.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.title', rooms: 'rooms'},
    prepare({title, rooms}) {
      const count = Array.isArray(rooms) ? rooms.length : 0
      return {
        title: title || 'Page Location de salle',
        subtitle: count === 0 ? 'Aucune salle' : `${count} salle${count > 1 ? 's' : ''}`,
      }
    },
  },
})
