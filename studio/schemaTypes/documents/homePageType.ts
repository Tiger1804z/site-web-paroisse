import {defineType, defineField, defineArrayMember} from 'sanity'
import {HomeIcon} from '@sanity/icons/Home'

/**
 * Contenu propre à la page d'accueil.
 *
 * Ce document ne contient **aucune coordonnée** : l'adresse et le téléphone
 * affichés par « Venez nous rencontrer » viennent de « Coordonnées de la
 * paroisse », et les heures de messe de « Horaires des messes ». Les recopier
 * ici créerait une deuxième vérité à corriger.
 *
 * Il ne contient pas non plus **les adresses des boutons** — ce sont des routes
 * du site, pas du contenu — ni **les textes d'état vide**, qui n'apparaissent
 * que si une donnée manque et relèvent du code.
 *
 * Les images, elles, restent locales : un ticket dédié migrera tous les visuels
 * de page ensemble.
 */
export const homePageType = defineType({
  name: 'homePage',
  title: 'Page d’accueil',
  type: 'document',
  icon: HomeIcon,
  groups: [
    {name: 'hero', title: 'En-tête', default: true},
    {name: 'welcome', title: 'Ensemble'},
    {name: 'masses', title: 'Célébrations'},
    {name: 'events', title: 'Activités'},
    {name: 'parishLife', title: 'Vivre la paroisse'},
    {name: 'services', title: 'Services'},
    {name: 'interlude', title: 'Prière'},
    {name: 'gallery', title: 'Galerie'},
    {name: 'visit', title: 'Nous joindre'},
  ],
  fields: [
    defineField({
      name: 'hero',
      title: 'En-tête (hero)',
      type: 'object',
      group: 'hero',
      fields: [
        defineField({
          name: 'script',
          title: 'Mot d’accueil manuscrit',
          type: 'string',
          description: 'La petite ligne au-dessus du titre. Ex. : Bienvenue.',
        }),
        defineField({
          name: 'titleLines',
          title: 'Titre, une ligne par entrée',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description:
            'Le grand titre du hero. Chaque entrée est une ligne : « Un lieu de foi, », « de paix et », « de rencontre. ». Les coupures sont un choix typographique, pas du texte à rallonge.',
          validation: (rule) => rule.max(4),
        }),
        defineField({
          name: 'introduction',
          title: 'Introduction',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'primaryCtaLabel',
          title: 'Libellé du bouton principal',
          type: 'string',
          description: 'Mène aux horaires. L’adresse est fixée par le site.',
        }),
        defineField({
          name: 'secondaryCtaLabel',
          title: 'Libellé du bouton secondaire',
          type: 'string',
          description: 'Mène à la page Notre paroisse. L’adresse est fixée par le site.',
        }),
        defineField({
          name: 'scheduleTitle',
          title: 'Titre de l’encart d’horaires',
          type: 'string',
          description:
            'Affiché au chargement. Le navigateur le remplace ensuite par la prochaine messe.',
        }),
        defineField({
          name: 'scheduleLinkLabel',
          title: 'Libellé du lien vers les horaires',
          type: 'string',
        }),
        defineField({
          name: 'scheduleNote',
          title: 'Note sous l’encart',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'welcome',
      title: 'Section « Ensemble »',
      type: 'object',
      group: 'welcome',
      fields: [
        defineField({
          name: 'script',
          title: 'Mot manuscrit',
          type: 'string',
          description: 'Ex. : Ensemble.',
        }),
        defineField({
          name: 'titleLines',
          title: 'Titre, une ligne par entrée',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          validation: (rule) => rule.max(3),
        }),
        defineField({
          name: 'introduction',
          title: 'Introduction',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'quote',
          title: 'Citation',
          type: 'object',
          description: 'Facultative. Sans texte ni source, le bloc disparaît.',
          fields: [
            defineField({name: 'text', title: 'Texte', type: 'text', rows: 3}),
            defineField({
              name: 'attribution',
              title: 'Source',
              type: 'string',
              description: 'Ex. : Matthieu 18,20.',
            }),
          ],
        }),
        defineField({
          name: 'linkLabel',
          title: 'Libellé du lien',
          type: 'string',
          description: 'Mène à la page Notre paroisse. L’adresse est fixée par le site.',
        }),
      ],
    }),
    defineField({
      name: 'massPreview',
      title: 'Aperçu des célébrations',
      type: 'object',
      group: 'masses',
      description:
        'Les heures elles-mêmes se saisissent dans « Horaires des messes ». Ici, seulement les textes autour.',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'introduction',
          title: 'Introduction',
          type: 'text',
          rows: 3,
          description:
            'Tant qu’aucune heure n’est publiée, le site affiche à la place une phrase d’attente écrite dans le code.',
        }),
        defineField({name: 'ctaLabel', title: 'Libellé du bouton', type: 'string'}),
        defineField({
          name: 'specialTitle',
          title: 'Titre du bloc « célébrations spéciales »',
          type: 'string',
        }),
        defineField({
          name: 'specialDescription',
          title: 'Texte du bloc « célébrations spéciales »',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'upcomingEventsTitle',
      title: 'Titre de la section des activités',
      type: 'string',
      group: 'events',
      description: 'Ex. : Prochaines activités.',
    }),
    defineField({
      name: 'showUpcomingEvents',
      title: 'Afficher les activités sur l’accueil',
      type: 'boolean',
      group: 'events',
      description: 'Sans activité à venir, la section reste masquée même si cette case est cochée.',
      initialValue: true,
    }),
    defineField({
      name: 'upcomingEventsLimit',
      title: 'Nombre d’activités affichées',
      type: 'number',
      group: 'events',
      description: 'Une grande carte plus des cartes secondaires. Quatre au total par défaut.',
      initialValue: 4,
      validation: (rule) => rule.integer().min(1).max(8),
    }),
    defineField({
      name: 'parishLife',
      title: 'Section « Vivre la paroisse »',
      type: 'object',
      group: 'parishLife',
      description:
        'Les noms des groupes viennent de la page Vie paroissiale. Ici, seulement lesquels annoncer et avec quelle ligne d’accroche.',
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
          name: 'groups',
          title: 'Groupes annoncés',
          type: 'array',
          of: [defineArrayMember({type: 'homeGroupTeaser'})],
          description:
            'La numérotation 01, 02, 03 suit l’ordre de la liste et se recalcule toute seule.',
          validation: (rule) => rule.max(6),
        }),
        defineField({name: 'ctaLabel', title: 'Libellé du bouton', type: 'string'}),
      ],
    }),
    defineField({
      name: 'services',
      title: 'Section « Services paroissiaux »',
      type: 'object',
      group: 'services',
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
          name: 'links',
          title: 'Raccourcis',
          type: 'array',
          of: [defineArrayMember({type: 'homeServiceLink'})],
          description:
            'Chaque ligne descend vers une section de la page Nos services. Deux raccourcis peuvent viser la même.',
          validation: (rule) => rule.max(8),
        }),
        defineField({name: 'ctaLabel', title: 'Libellé du bouton', type: 'string'}),
        defineField({
          name: 'visualNote',
          title: 'Légende sous l’image',
          type: 'string',
          description: 'Ex. : Accueil · célébration · accompagnement.',
        }),
        defineField({
          name: 'thrift',
          title: 'Carte de la friperie',
          type: 'object',
          description:
            'Les heures et l’adresse de la friperie se saisissent dans « Friperie », pas ici.',
          fields: [
            defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
            defineField({name: 'title', title: 'Titre', type: 'string'}),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({name: 'linkLabel', title: 'Libellé du lien', type: 'string'}),
          ],
        }),
      ],
    }),
    defineField({
      name: 'interlude',
      title: 'Section « Prière et recueillement »',
      type: 'object',
      group: 'interlude',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'description',
          title: 'Texte',
          type: 'text',
          rows: 4,
        }),
        defineField({
          name: 'linkLabel',
          title: 'Libellé du lien',
          type: 'string',
          description: 'Descend vers les services de prière. L’adresse est fixée par le site.',
        }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Section « La paroisse en images »',
      type: 'object',
      group: 'gallery',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'photos',
          title: 'Photographies',
          type: 'array',
          of: [defineArrayMember({type: 'galleryPhoto'})],
          description:
            'L’ordre du carrousel est celui de cette liste. Sans photographie publiable, la section disparaît de l’accueil.',
          validation: (rule) => rule.max(12),
        }),
      ],
    }),
    defineField({
      name: 'visit',
      title: 'Section « Venez nous rencontrer »',
      type: 'object',
      group: 'visit',
      description:
        'L’adresse et le téléphone affichés ici viennent de « Coordonnées de la paroisse » et ne se saisissent pas deux fois.',
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
          name: 'contactCtaLabel',
          title: 'Libellé du bouton Contact',
          type: 'string',
        }),
        defineField({
          name: 'directionsCtaLabel',
          title: 'Libellé du bouton d’itinéraire',
          type: 'string',
          description: 'Ouvre la carte. L’adresse du lien vient des coordonnées de la paroisse.',
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.script', subtitle: 'massPreview.title'},
    prepare({subtitle}) {
      return {
        title: 'Page d’accueil',
        subtitle: subtitle || undefined,
      }
    },
  },
})
