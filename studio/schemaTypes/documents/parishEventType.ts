import {defineType, defineField, defineArrayMember} from 'sanity'
import {CalendarIcon} from '@sanity/icons/Calendar'

const CATEGORIES = [
  {title: 'Pèlerinage', value: 'pilgrimage'},
  {title: 'Célébration', value: 'liturgy'},
  {title: 'Concert', value: 'concert'},
  {title: 'Repas communautaire', value: 'community-meal'},
  {title: 'Familles', value: 'family'},
  {title: 'Entraide', value: 'mutual-aid'},
  {title: 'Rencontre', value: 'conference'},
  {title: 'Autre', value: 'other'},
]

const PUBLICATION_STATUSES = [
  {title: 'Brouillon', value: 'draft'},
  {title: 'Publié', value: 'published'},
  {title: 'Annulé', value: 'cancelled'},
]

type ParishEventValue = {
  startAt?: string
  endAt?: string
}

type ContactValue = {
  name?: string
  phone?: string
  email?: string
  consentGiven?: boolean
}

/**
 * Une activité datée : pèlerinage, concert, repas, célébration particulière.
 *
 * Collection, pas contenu de page : la page Événements et l’accueil lisent les
 * mêmes documents. Une activité se saisit une seule fois.
 *
 * Le statut temporel — à venir, en cours, passé — n’est jamais saisi ni stocké.
 * Il dépend de l’heure et se calcule à l’affichage.
 */
export const parishEventType = defineType({
  name: 'parishEvent',
  title: 'Événement',
  type: 'document',
  icon: CalendarIcon,
  groups: [
    {name: 'essentiel', title: 'Essentiel', default: true},
    {name: 'dates', title: 'Dates et lieu'},
    {name: 'pratique', title: 'Informations pratiques'},
    {name: 'visuels', title: 'Images'},
    {name: 'publication', title: 'Publication'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      group: 'essentiel',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Identifiant d’adresse',
      type: 'slug',
      group: 'essentiel',
      description:
        'Généré à partir du titre. Sert d’identifiant stable, à ne plus modifier une fois l’événement publié.',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Résumé',
      type: 'text',
      rows: 3,
      group: 'essentiel',
      description: 'Une ou deux phrases, affichées sur les cartes.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Annonce complète',
      type: 'richText',
      group: 'essentiel',
      description:
        'Le texte affiché sur la page Événements. Gras et italique sont disponibles; Maj + Entrée passe à la ligne sans commencer un paragraphe.',
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'essentiel',
      options: {list: CATEGORIES},
      initialValue: 'other',
      validation: (rule) => rule.required(),
    }),

    defineField({
      name: 'startAt',
      title: 'Début',
      type: 'datetime',
      group: 'dates',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endAt',
      title: 'Fin',
      type: 'datetime',
      group: 'dates',
      description:
        'Facultatif. Sert à savoir si l’activité est encore en cours pendant la journée.',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as ParishEventValue | undefined
          if (!value || !parent?.startAt) return true

          return Date.parse(value) > Date.parse(parent.startAt)
            ? true
            : 'La fin doit venir après le début.'
        }),
    }),
    defineField({
      name: 'locationName',
      title: 'Lieu',
      type: 'string',
      group: 'dates',
      description: 'Ex. : Basilique Sainte-Anne-de-Beaupré.',
    }),
    defineField({
      name: 'meetingPoint',
      title: 'Point de rassemblement',
      type: 'string',
      group: 'dates',
      description: 'Où se retrouve le groupe avant le départ, s’il y a lieu.',
    }),
    defineField({
      name: 'departureAt',
      title: 'Heure de départ',
      type: 'datetime',
      group: 'dates',
    }),
    defineField({
      name: 'returnAt',
      title: 'Heure de retour',
      type: 'datetime',
      group: 'dates',
    }),

    defineField({
      name: 'price',
      title: 'Coût',
      type: 'object',
      group: 'pratique',
      description: 'Laisser vide si l’activité est gratuite.',
      fields: [
        defineField({
          name: 'amount',
          title: 'Montant en dollars',
          type: 'number',
          validation: (rule) => rule.min(0),
        }),
        defineField({
          name: 'label',
          title: 'Précision',
          type: 'string',
          description: 'Ex. : par personne, transport inclus.',
        }),
      ],
    }),
    defineField({
      name: 'capacityNotice',
      title: 'Places',
      type: 'string',
      description:
        'Phrase libre, sans chiffre garanti. Ex. : places limitées, réservation requise.',
      group: 'pratique',
    }),
    defineField({
      name: 'contact',
      title: 'Personne à joindre',
      type: 'object',
      group: 'pratique',
      description:
        'À ne remplir que si la personne accepte que ses coordonnées soient publiques sur Internet.',
      fields: [
        defineField({name: 'name', title: 'Nom', type: 'string'}),
        defineField({
          name: 'phone',
          title: 'Téléphone',
          type: 'string',
          description: 'Ex. : 514 722-1161.',
        }),
        defineField({
          name: 'email',
          title: 'Courriel',
          type: 'string',
          validation: (rule) => rule.email().error('Saisir une adresse courriel valide.'),
        }),
        defineField({
          name: 'consentGiven',
          title: 'La personne a accepté cette publication',
          type: 'boolean',
          initialValue: false,
        }),
      ],
      // Publier le nom ou le numéro d'un bénévole sans son accord n'est pas
      // une négligence rattrapable : le blocage est volontaire.
      validation: (rule) =>
        rule.custom((value) => {
          const contact = value as ContactValue | undefined
          if (!contact) return true

          const hasDetails = Boolean(contact.name?.trim() || contact.phone?.trim() || contact.email)
          if (!hasDetails) return true

          return contact.consentGiven
            ? true
            : 'Cocher la case d’accord, ou retirer les coordonnées.'
        }),
    }),
    defineField({
      name: 'cta',
      title: 'Bouton d’action',
      type: 'object',
      group: 'pratique',
      description: 'Pour une inscription ou une billetterie extérieure au site.',
      fields: [
        defineField({name: 'label', title: 'Texte du bouton', type: 'string'}),
        defineField({
          name: 'url',
          title: 'Adresse',
          type: 'url',
          validation: (rule) => rule.uri({scheme: ['http', 'https', 'mailto', 'tel']}),
        }),
      ],
    }),

    defineField({
      name: 'coverImage',
      title: 'Image principale',
      type: 'eventImage',
      group: 'visuels',
    }),
    defineField({
      name: 'gallery',
      title: 'Galerie',
      type: 'array',
      group: 'visuels',
      of: [defineArrayMember({type: 'eventImage'})],
    }),

    defineField({
      name: 'publicationStatus',
      title: 'État',
      type: 'string',
      group: 'publication',
      options: {list: PUBLICATION_STATUSES, layout: 'radio'},
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'showOnWebsite',
      title: 'Afficher sur le site',
      type: 'boolean',
      group: 'publication',
      initialValue: true,
    }),
    defineField({
      name: 'showOnHomepage',
      title: 'Afficher sur l’accueil',
      type: 'boolean',
      group: 'publication',
      description: 'Sans effet une fois l’activité passée.',
      initialValue: false,
    }),
    defineField({
      name: 'showInArchive',
      title: 'Conserver dans les archives',
      type: 'boolean',
      group: 'publication',
      description: 'Décocher retire l’activité du site une fois terminée.',
      initialValue: true,
    }),
    defineField({
      name: 'featured',
      title: 'Mettre en avant',
      type: 'boolean',
      group: 'publication',
      description: 'Candidat à la grande carte de l’accueil.',
      initialValue: false,
    }),
    defineField({
      name: 'homepagePriority',
      title: 'Priorité sur l’accueil',
      type: 'number',
      group: 'publication',
      description: 'Facultatif, pour départager deux activités le même jour.',
      validation: (rule) => rule.integer(),
    }),
  ],
  orderings: [
    {
      title: 'Date, de la plus récente',
      name: 'startAtDesc',
      by: [{field: 'startAt', direction: 'desc'}],
    },
    {
      title: 'Date, de la plus ancienne',
      name: 'startAtAsc',
      by: [{field: 'startAt', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'title',
      startAt: 'startAt',
      status: 'publicationStatus',
      media: 'coverImage.image',
    },
    prepare({title, startAt, status, media}) {
      const date = startAt
        ? new Intl.DateTimeFormat('fr-CA', {
            timeZone: 'America/Toronto',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          }).format(new Date(startAt))
        : 'Sans date'
      const badge = status === 'published' ? '' : status === 'cancelled' ? '✕ ' : '✎ '

      return {
        title: `${badge}${title || 'Événement'}`,
        subtitle: date,
        media,
      }
    },
  },
})
