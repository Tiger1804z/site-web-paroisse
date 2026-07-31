import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Contenu de la page /notre-paroisse.
 *
 * La chronologie est le cœur du document : neuf repères, chacun avec son
 * illustration, sa source éditoriale et son avertissement. C'est la seule
 * section du site où l'image et le texte ne peuvent pas être séparés — un
 * repère sans son illustration est un repère cassé — d'où le téléversement des
 * neuf images dans le Studio.
 *
 * Restent hors du document : l'image du hero et celle de la section
 * d'architecture (visuels de page, réservés au ticket qui les migrera tous),
 * les adresses des boutons (des routes), et le titre et la description pour les
 * moteurs de recherche, qui appartiennent au code comme sur les autres pages.
 */
export const aboutPageType = defineType({
  name: 'aboutPage',
  title: 'Page Notre paroisse',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'introduction', title: 'Introduction'},
    {name: 'history', title: 'Histoire'},
    {name: 'principles', title: 'Ce qui nous rassemble'},
    {name: 'architecture', title: 'Architecture'},
    {name: 'architects', title: 'Architectes'},
    {name: 'closing', title: 'Clôture'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'En-tête (hero)',
      type: 'object',
      group: 'header',
      description: 'L’image de fond est un fichier du site et ne se change pas ici.',
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
      name: 'introduction',
      title: 'Section d’introduction',
      type: 'object',
      group: 'introduction',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({
          name: 'accent',
          title: 'Mot manuscrit',
          type: 'string',
          description: 'Ex. : Ensemble. Facultatif.',
        }),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphes',
          type: 'array',
          of: [defineArrayMember({type: 'text'})],
        }),
      ],
    }),
    defineField({
      name: 'history',
      title: 'Chronologie',
      type: 'object',
      group: 'history',
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
          name: 'illustrationDisclosure',
          title: 'Avertissement général sur les illustrations',
          type: 'text',
          rows: 3,
          description:
            'Affiché une fois en tête de section. Dit que les scènes historiques sont des illustrations et non des archives — ne pas le vider tant que la chronologie en contient.',
        }),
        defineField({
          name: 'entries',
          title: 'Repères',
          type: 'array',
          of: [defineArrayMember({type: 'historyEntry'})],
          description:
            'La numérotation 01, 02, 03 suit l’ordre de la liste et se recalcule toute seule.',
        }),
        defineField({
          name: 'epilogue',
          title: 'Épilogue',
          type: 'object',
          description: 'Bloc de clôture sous la chronologie. Sans titre, il disparaît.',
          fields: [
            defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
            defineField({name: 'title', title: 'Titre', type: 'string'}),
            defineField({
              name: 'paragraphs',
              title: 'Paragraphes',
              type: 'array',
              of: [defineArrayMember({type: 'text'})],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: 'principles',
      title: 'Section « Ce qui nous rassemble »',
      type: 'object',
      group: 'principles',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'items',
          title: 'Repères',
          type: 'array',
          of: [defineArrayMember({type: 'aboutPrinciple'})],
          validation: (rule) => rule.max(6),
        }),
      ],
    }),
    defineField({
      name: 'architecture',
      title: 'Section « Le lieu »',
      type: 'object',
      group: 'architecture',
      description: 'La photographie de la nef est un fichier du site et ne se change pas ici.',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphes',
          type: 'array',
          of: [defineArrayMember({type: 'text'})],
        }),
        defineField({
          name: 'features',
          title: 'Traits d’architecture',
          type: 'array',
          of: [defineArrayMember({type: 'architectureFeature'})],
        }),
      ],
    }),
    defineField({
      name: 'architects',
      title: 'Section « Les architectes »',
      type: 'object',
      group: 'architects',
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
          name: 'profiles',
          title: 'Architectes',
          type: 'array',
          of: [defineArrayMember({type: 'architectProfile'})],
        }),
        defineField({
          name: 'validationCard',
          title: 'Encadré « histoire à valider »',
          type: 'object',
          fields: [
            defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
            defineField({name: 'title', title: 'Titre', type: 'string'}),
            defineField({name: 'text', title: 'Texte', type: 'text', rows: 3}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'closing',
      title: 'Bloc de clôture',
      type: 'object',
      group: 'closing',
      fields: [
        defineField({
          name: 'accent',
          title: 'Mot manuscrit',
          type: 'string',
          description: 'Ex. : Venez. Facultatif.',
        }),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({name: 'text', title: 'Texte', type: 'text', rows: 3}),
        defineField({
          name: 'primaryCtaLabel',
          title: 'Libellé du bouton principal',
          type: 'string',
          description: 'Mène à Première visite. L’adresse est fixée par le site.',
        }),
        defineField({
          name: 'secondaryCtaLabel',
          title: 'Libellé du bouton secondaire',
          type: 'string',
          description: 'Mène à Contact. L’adresse est fixée par le site.',
        }),
      ],
    }),
  ],
  preview: {
    select: {subtitle: 'hero.title'},
    prepare({subtitle}) {
      return {
        title: 'Page Notre paroisse',
        subtitle: subtitle || undefined,
      }
    },
  },
})
