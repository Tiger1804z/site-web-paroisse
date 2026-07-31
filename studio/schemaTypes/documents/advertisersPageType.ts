import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Contenu de la page /nos-annonceurs.
 *
 * La liste des annonceurs n'est pas ici : ce sont des documents de la collection
 * « Annonceurs ». Ce document n'administre que ce qui appartient à la page —
 * l'en-tête, l'introduction, le bloc « Devenir annonceur » et l'affichage des
 * deux sections.
 *
 * Ni téléphone ni adresse de lien : le numéro affiché vient de `siteSettings` et
 * le second bouton pointe toujours vers `/contact/`.
 *
 * L'image de l'en-tête reste un fichier du projet, avec son cadrage, tant que
 * les visuels de page ne sont pas migrés.
 */
export const advertisersPageType = defineType({
  name: 'advertisersPage',
  title: 'Page Nos annonceurs',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'introduction', title: 'Introduction'},
    {name: 'solicitation', title: 'Devenir annonceur'},
    {name: 'settings', title: 'Affichage'},
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
      ],
    }),
    defineField({
      name: 'introduction',
      title: 'Introduction',
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
          name: 'disclosure',
          title: 'Mention de transparence',
          type: 'text',
          rows: 3,
          description:
            'Dit au lecteur qu’une présence sur la page est un placement payé, pas une recommandation de la paroisse. À ne pas retirer.',
        }),
      ],
    }),
    defineField({
      name: 'solicitation',
      title: 'Devenir annonceur',
      type: 'object',
      group: 'solicitation',
      description:
        'Le numéro affiché vient des coordonnées de la paroisse; il ne se saisit pas ici.',
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
          name: 'details',
          title: 'Précisions',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description:
            'Une précision par entrée. N’annoncer ni tarif, ni format, ni disponibilité : ces faits changent et se confirment par téléphone.',
        }),
        defineField({
          name: 'phoneLabel',
          title: 'Libellé du bouton d’appel',
          type: 'string',
        }),
        defineField({
          name: 'contactLabel',
          title: 'Libellé du bouton Contact',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'settings',
      title: 'Affichage',
      type: 'object',
      group: 'settings',
      fields: [
        defineField({
          name: 'showAdvertisers',
          title: 'Afficher la liste des annonceurs',
          type: 'boolean',
          description:
            'Sans annonceur actif, la section reste masquée même si la case est cochée : une grille vide ne s’affiche jamais.',
          initialValue: true,
        }),
        defineField({
          name: 'showSolicitation',
          title: 'Afficher le bloc « Devenir annonceur »',
          type: 'boolean',
          initialValue: true,
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.title'},
    prepare({title}) {
      return {title: title || 'Page Nos annonceurs'}
    },
  },
})
