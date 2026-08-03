import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Contenu de la page /nos-services.
 *
 * Un seul document, sans jumeau « Données partagées » : les tarifs et les délais
 * sont des faits, mais aucune autre page ne les lit. Un document partagé sans
 * second consommateur serait une abstraction vide.
 *
 * Le téléphone du secrétariat n'y est pas : il vient de `siteSettings`, et tous
 * les boutons de la page pointent dessus.
 */
export const servicesPageType = defineType({
  name: 'servicesPage',
  title: 'Page Nos services',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'chapters', title: 'Chapitres'},
    {name: 'payment', title: 'Paiement'},
    {name: 'closing', title: 'Bloc de clôture'},
  ],
  fields: [
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
      name: 'notice',
      title: 'Encadré d’avertissement',
      type: 'object',
      group: 'header',
      description:
        'Affiché au-dessus du sommaire. C’est le seul endroit où une date de révision est publiée.',
      fields: [
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          rows: 4,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'reviewDate',
          title: 'Mention de révision',
          type: 'string',
          description:
            'Phrase complète, par exemple « Dernière révision éditoriale : 27 juillet 2026 ».',
        }),
      ],
    }),
    defineField({
      name: 'chapters',
      title: 'Chapitres',
      type: 'array',
      group: 'chapters',
      of: [defineArrayMember({type: 'serviceChapter'})],
      description: 'L’ordre du tableau fait foi, dans le sommaire comme dans la page.',
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: 'paymentMethods',
      title: 'Modes de paiement',
      type: 'object',
      group: 'payment',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'methods',
          title: 'Modes acceptés',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description:
            'Un mode par entrée : « Argent comptant », « Chèque », « Virement Interac ».',
        }),
      ],
    }),
    defineField({
      name: 'finalCta',
      title: 'Bloc de clôture',
      type: 'object',
      group: 'closing',
      description:
        'Le numéro affiché vient des coordonnées de la paroisse; il ne se saisit pas ici.',
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
    select: {title: 'hero.title', chapters: 'chapters'},
    prepare({title, chapters}) {
      const count = Array.isArray(chapters) ? chapters.length : 0
      return {
        title: title || 'Page Nos services',
        subtitle: count === 0 ? 'Aucun chapitre' : `${count} chapitre${count > 1 ? 's' : ''}`,
      }
    },
  },
})
