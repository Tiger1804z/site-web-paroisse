import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Contenu propre à la page /horaires, et rien d’autre.
 *
 * Les horaires eux-mêmes vivent dans `massSchedule` (partagés avec l’accueil),
 * les heures du secrétariat dans `siteSettings` (coordonnées globales). Ce
 * document ne porte que ce qui n’a de sens que sur cette page.
 */
export const schedulePageType = defineType({
  name: 'schedulePage',
  title: 'Page Horaires',
  type: 'document',
  icon: DocumentTextIcon,
  // Les groupes deviennent des onglets en haut du document : quatre formulaires
  // courts plutôt qu’un seul très long.
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'notice', title: 'Avis'},
    {name: 'aside', title: 'Bandeau et encadré'},
    {name: 'faq', title: 'Questions fréquentes'},
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
            'La photographie du premier écran. Son texte alternatif se saisit avec elle. Sans image, l’en-tête garde son fond sombre et le titre reste lisible.',
        }),
      ],
    }),
    defineField({
      name: 'notice',
      title: 'Avis en haut de page',
      type: 'scheduleNotice',
      group: 'notice',
      description:
        'Encadré ponctuel affiché au-dessus des horaires. Laisser vide s’il n’y a rien à signaler.',
    }),
    defineField({
      name: 'beforeYouVisit',
      title: 'Bandeau « Avant de vous déplacer »',
      type: 'object',
      group: 'aside',
      description:
        'Le bouton du bandeau reste défini par le code : sa destination dépend des routes actives du site.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
    /**
     * La carte qui mène à Première visite.
     *
     * Elle est ici plutôt que dans la barre de navigation parce que c'est ici
     * que la question se pose : quelqu'un vient de lire à quelle heure venir,
     * et se demande où entrer et où stationner. Un onglet permanent posait la
     * même question à qui vient chaque dimanche depuis trente ans.
     *
     * L'adresse du bouton reste dans le code, comme celle du bandeau.
     */
    defineField({
      name: 'firstVisitCta',
      title: 'Carte « Première visite »',
      type: 'object',
      group: 'aside',
      description:
        'Affichée sous les horaires réguliers. Le bouton mène à la page Première visite; sa destination ne se saisit pas ici.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          rows: 3,
        }),
        defineField({
          name: 'linkLabel',
          title: 'Libellé du bouton',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'sidebar',
      title: 'Encadré latéral',
      type: 'object',
      group: 'aside',
      description:
        'Les heures du secrétariat ne se saisissent pas ici : elles viennent des Coordonnées de la paroisse, pour rester identiques sur tout le site.',
      fields: [
        defineField({
          name: 'officeEyebrow',
          title: 'Surtitre',
          type: 'string',
        }),
        defineField({
          name: 'officeMessage',
          title: 'Message',
          type: 'text',
          rows: 2,
        }),
      ],
    }),
    defineField({
      name: 'faq',
      title: 'Questions fréquentes',
      type: 'array',
      group: 'faq',
      of: [defineArrayMember({type: 'scheduleFaqItem'})],
      description: 'L’ordre d’affichage est celui du tableau : glisser-déposer pour réorganiser.',
    }),
  ],
  // Sans `preview`, le Studio affiche un vidage brut des champs en guise de
  // titre du document.
  preview: {
    select: {heroTitle: 'hero.title', faq: 'faq'},
    prepare({heroTitle, faq}) {
      const count = Array.isArray(faq) ? faq.length : 0
      return {
        title: heroTitle || 'Page Horaires',
        subtitle:
          count === 0
            ? 'Aucune question fréquente'
            : `${count} question${count > 1 ? 's' : ''} fréquente${count > 1 ? 's' : ''}`,
      }
    },
  },
})
