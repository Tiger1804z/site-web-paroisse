import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Contenu propre à la page /friperie.
 *
 * Les heures, l'emplacement et le téléphone n'y sont pas : ce sont des faits
 * qui appartiennent à la friperie elle-même (document `thriftStore`), pas à sa
 * page de présentation.
 *
 * Les images du hero et les cadres de la galerie restent définis par le code
 * tant que les visuels de page ne sont pas migrés.
 */
export const thriftStorePageType = defineType({
  name: 'thriftStorePage',
  title: 'Page Friperie',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'introduction', title: 'Présentation'},
    {name: 'sections', title: 'Sections'},
    {name: 'gallery', title: 'Galerie'},
    {name: 'closing', title: 'Bloc de clôture'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'En-tête (hero)',
      type: 'object',
      group: 'header',
      description:
        'Les images qui défilent dans le hero restent définies par le code tant que les visuels de page ne sont pas migrés.',
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
      ],
    }),
    defineField({
      name: 'introduction',
      title: 'Présentation',
      type: 'object',
      group: 'introduction',
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
          name: 'priceNotice',
          title: 'Encadré « À noter »',
          type: 'text',
          rows: 3,
          description:
            'Phrase affichée en évidence sous les paragraphes, par exemple sur la variation des prix et les ventes spéciales.',
        }),
        defineField({
          name: 'contactCta',
          title: 'Bouton de la présentation',
          type: 'thriftStoreCta',
        }),
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'sections',
      of: [defineArrayMember({type: 'thriftStoreSection'})],
      description: 'Blocs affichés sous la présentation. L’ordre du tableau fait foi.',
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'object',
      group: 'gallery',
      description:
        'Seuls les textes se saisissent ici. Les cadres restent définis par le code : ils indiquent les prises de vue attendues, en attendant de vraies photographies du local.',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'introduction',
          title: 'Introduction',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
    defineField({
      name: 'closing',
      title: 'Bloc de clôture',
      type: 'object',
      group: 'closing',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'primaryCta',
          title: 'Bouton principal',
          type: 'thriftStoreCta',
        }),
        defineField({
          name: 'secondaryCta',
          title: 'Bouton secondaire',
          type: 'thriftStoreCta',
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.title', sections: 'sections'},
    prepare({title, sections}) {
      const count = Array.isArray(sections) ? sections.length : 0
      return {
        title: title || 'Page Friperie',
        subtitle: count === 0 ? 'Aucune section' : `${count} section${count > 1 ? 's' : ''}`,
      }
    },
  },
})
