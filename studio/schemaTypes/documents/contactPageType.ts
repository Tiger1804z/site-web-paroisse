import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Contenu de la page /contact.
 *
 * Ce document ne contient **aucune coordonnée**. L'adresse, le téléphone, le
 * courriel, les heures du secrétariat, le stationnement et l'accessibilité
 * viennent tous de « Coordonnées de la paroisse » : ce sont des faits sur la
 * paroisse, vrais indépendamment de la page, et plusieurs autres pages les
 * lisent. Les recopier ici créerait une deuxième vérité à corriger.
 *
 * Il ne contient pas non plus la **structure du formulaire** — noms de champs,
 * types, longueurs, expressions de validation, messages d'erreur. Ce n'est pas
 * du contenu : le script de validation les lit, et une expression mal saisie
 * casserait la page sans que personne le voie. Seuls les textes autour du
 * formulaire et la liste des motifs se saisissent.
 */
export const contactPageType = defineType({
  name: 'contactPage',
  title: 'Page Contact',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'methods', title: 'Coordonnées'},
    {name: 'location', title: 'Nous trouver'},
    {name: 'form', title: 'Formulaire'},
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
      ],
    }),
    defineField({
      name: 'officeHours',
      title: 'Heures du secrétariat',
      type: 'object',
      group: 'methods',
      description:
        'L’horaire lui-même se saisit dans « Coordonnées de la paroisse ». Le bloc disparaît tant qu’il y est vide.',
      fields: [
        defineField({name: 'title', title: 'Titre du bloc', type: 'string'}),
        defineField({
          name: 'note',
          title: 'Note',
          type: 'text',
          rows: 2,
          description:
            'Précision affichée sous l’horaire. Sert notamment à rappeler que ce ne sont pas les heures des célébrations.',
        }),
      ],
    }),
    defineField({
      name: 'methodsFallback',
      title: 'Coordonnées manquantes',
      type: 'object',
      group: 'methods',
      description:
        'Affiché quand une coordonnée publique n’est pas encore confirmée. Le courriel apparaîtra tout seul le jour où il sera rendu public.',
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
    defineField({
      name: 'location',
      title: 'Nous trouver',
      type: 'object',
      group: 'location',
      description:
        'Ni adresse, ni carte, ni lien d’itinéraire : ils viennent des coordonnées de la paroisse.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'extraNotes',
          title: 'Précisions d’accès',
          type: 'array',
          of: [defineArrayMember({type: 'text', rows: 3})],
          description:
            'Le stationnement et l’accessibilité s’affichent déjà, lus dans les coordonnées de la paroisse. N’ajouter ici que ce qui leur manque.',
        }),
      ],
    }),
    defineField({
      name: 'form',
      title: 'Formulaire',
      type: 'object',
      group: 'form',
      description:
        'Les champs, leurs règles et leurs messages d’erreur sont définis par le code. Seuls les textes qui les entourent se saisissent.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'introduction',
          title: 'Introduction',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'reasons',
          title: 'Motifs de contact',
          type: 'array',
          of: [defineArrayMember({type: 'contactReason'})],
          description:
            'La liste déroulante du formulaire. L’ordre du tableau fait foi. Une liste vide laisse les motifs définis par le code.',
        }),
        defineField({
          name: 'unavailableNotice',
          title: 'Avis « envoi non activé »',
          type: 'text',
          rows: 3,
          description:
            'Dit à la personne que rien n’est transmis. À ne pas retirer tant que l’envoi n’est pas en service.',
        }),
        defineField({
          name: 'validationButtonLabel',
          title: 'Libellé du bouton',
          type: 'string',
        }),
        defineField({
          name: 'locallyValidNotice',
          title: 'Message après vérification',
          type: 'text',
          rows: 2,
        }),
        defineField({
          name: 'privacyNotice',
          title: 'Mention de confidentialité',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.title'},
    prepare({title}) {
      return {title: title || 'Page Contact'}
    },
  },
})
