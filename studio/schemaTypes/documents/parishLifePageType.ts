import {defineType, defineField, defineArrayMember} from 'sanity'
import {UsersIcon} from '@sanity/icons/Users'

/**
 * Contenu de la page /vie-paroissiale.
 *
 * Document unique, groupes embarqués : aucune autre page ne lit ces groupes
 * aujourd'hui. Le jour où l'accueil ou une autre route les affichera, ils
 * deviendront une collection — la règle de découpage ne s'applique qu'à partir
 * du deuxième consommateur réel.
 *
 * Les images sont téléversées dans le Studio, avec leur texte alternatif, leur
 * crédit et leur note de droits. Le repli local reprend la main si le document
 * n'en fournit aucune — un groupe sans image n'est pas publié, sa carte serait
 * un cadre vide.
 */
export const parishLifePageType = defineType({
  name: 'parishLifePage',
  title: 'Page Vie paroissiale',
  type: 'document',
  icon: UsersIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'groups', title: 'Groupes'},
    {name: 'closing', title: 'Bloc de clôture'},
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
          name: 'slides',
          title: 'Images qui défilent',
          type: 'array',
          of: [defineArrayMember({type: 'heroSlide'})],
          description:
            'L’ordre du tableau fait foi. Sans image ici, celles du code prennent le relais.',
        }),
      ],
    }),
    defineField({
      name: 'introduction',
      title: 'Présentation',
      type: 'object',
      group: 'header',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphes',
          type: 'array',
          of: [defineArrayMember({type: 'text', rows: 4})],
          description: 'Un paragraphe par entrée. L’ordre du tableau fait foi.',
        }),
        defineField({
          name: 'confirmationNote',
          title: 'Note de confirmation',
          type: 'text',
          rows: 3,
          description:
            'Phrase affichée en évidence pour dire ce qui reste à valider auprès de la paroisse.',
        }),
      ],
    }),
    defineField({
      name: 'features',
      title: 'Groupes',
      type: 'array',
      group: 'groups',
      of: [defineArrayMember({type: 'parishGroup'})],
      description: 'L’ordre du tableau fait foi.',
    }),
    defineField({
      name: 'participation',
      title: 'Bloc de clôture',
      type: 'object',
      group: 'closing',
      description: 'Le bouton mène toujours à la page Contact.',
      fields: [
        defineField({name: 'accent', title: 'Accent', type: 'string'}),
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
          name: 'ctaLabel',
          title: 'Libellé du bouton',
          type: 'string',
          initialValue: 'Communiquer avec la paroisse',
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.title', features: 'features'},
    prepare({title, features}) {
      const count = Array.isArray(features) ? features.length : 0
      return {
        title: title || 'Page Vie paroissiale',
        subtitle: count === 0 ? 'Aucun groupe' : `${count} groupe${count > 1 ? 's' : ''}`,
      }
    },
  },
})
