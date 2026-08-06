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
            'Elles défilent derrière le titre. Sans image, l’en-tête garde son fond sombre et reste lisible.',
          validation: (rule) => rule.max(6),
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
        'Tant qu’aucune photographie n’est ajoutée, la section entière reste invisible sur le site. Rien n’oblige à la remplir.',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'introduction',
          title: 'Introduction',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'photos',
          title: 'Photographies',
          type: 'array',
          of: [defineArrayMember({type: 'galleryPhoto'})],
          description:
            'Photographies du local. Les mêmes verrous que le carrousel de l’accueil s’appliquent : sans texte alternatif ni droits confirmés, une photo reste dans la liste sans s’afficher.',
          validation: (rule) => rule.max(12),
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
