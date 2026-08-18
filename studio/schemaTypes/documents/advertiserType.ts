import {defineType, defineField, defineArrayMember} from 'sanity'
import {CaseIcon} from '@sanity/icons/Case'

const STATUSES = [
  {title: 'Actif — visible sur le site', value: 'active'},
  {title: 'À confirmer — invisible', value: 'confirmation-required'},
  {title: 'Brouillon — invisible', value: 'draft'},
  {title: 'Inactif — invisible', value: 'inactive'},
]

/**
 * Un annonceur, dans une collection et non dans la page.
 *
 * Une fiche a son propre cycle de vie : elle arrive, se confirme, se retire,
 * sans que le reste de la page bouge. Un document de page ne contient jamais une
 * liste d'entités qui vivent séparément.
 *
 * Le statut est un champ explicite, pas l'état de publication de Sanity. Un
 * brouillon Sanity veut dire « modification en cours », pas « entente encore à
 * vérifier » : confondre les deux ferait disparaître une fiche du Studio dès
 * qu'on la corrige.
 *
 * Seul le site Web est une adresse saisissable, exception assumée à la règle du
 * projet — l'adresse d'un annonceur est son contenu à lui. Le lien sortant porte
 * `rel="sponsored noopener noreferrer"`, imposé par le composant.
 */
export const advertiserType = defineType({
  name: 'advertiser',
  title: 'Annonceur',
  type: 'document',
  icon: CaseIcon,
  groups: [
    {name: 'identity', title: 'Identité', default: true},
    {name: 'contact', title: 'Coordonnées'},
    {name: 'editorial', title: 'Publication'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      group: 'identity',
      description: 'Une ligne au-dessus du nom, par exemple « Réception et service traiteur ».',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      group: 'identity',
      description:
        'Texte commercial fourni par l’annonceur. Ne rien inventer : ce qui est écrit ici engage la paroisse.',
    }),
    defineField({
      name: 'logo',
      title: 'Logo ou visuel',
      type: 'eventImage',
      group: 'identity',
      description:
        'Facultatif, vide par défaut. Sans image, la fiche affiche les initiales du nom — jamais un cadre vide. Une seule image par fiche : elle occupe le côté gauche de la carte.',
    }),
    defineField({
      name: 'addressLines',
      title: 'Adresse',
      type: 'array',
      group: 'contact',
      of: [defineArrayMember({type: 'string'})],
      description: 'Une ligne par entrée : « 4397, rue Denis-Papin », puis « Montréal, Québec ».',
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
      group: 'contact',
      description:
        'Tel qu’il doit s’afficher : « 514 728-4345 ». Le lien d’appel est reconstruit à partir des chiffres.',
    }),
    defineField({
      name: 'email',
      title: 'Courriel',
      type: 'string',
      group: 'contact',
      description: 'Le lien d’écriture est reconstruit à partir de l’adresse.',
    }),
    defineField({
      name: 'website',
      title: 'Site Web',
      type: 'url',
      group: 'contact',
      description:
        'Seule adresse saisissable du site. Le lien s’ouvre dans un nouvel onglet et est déclaré comme publicitaire.',
      validation: (rule) => rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({
      name: 'status',
      title: 'Statut',
      type: 'string',
      group: 'editorial',
      options: {list: STATUSES, layout: 'radio'},
      initialValue: 'draft',
      description:
        'Seul « Actif » s’affiche. Tant qu’une entente, des coordonnées ou des droits ne sont pas confirmés, laisser « À confirmer ».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Rang',
      type: 'number',
      group: 'editorial',
      description:
        'Ordre d’affichage, du plus petit au plus grand. À rang égal, les fiches sont classées par nom.',
      initialValue: 100,
    }),
    defineField({
      name: 'confirmationNote',
      title: 'Note de révision',
      type: 'text',
      rows: 3,
      group: 'editorial',
      description:
        'Note interne : ce qui reste à vérifier avant de passer la fiche à « Actif ». N’atteint jamais le site.',
    }),
  ],
  orderings: [
    {
      title: 'Rang d’affichage',
      name: 'displayOrder',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'name', direction: 'asc'},
      ],
    },
  ],
  preview: {
    select: {title: 'name', category: 'category', status: 'status', media: 'logo.image'},
    prepare({title, category, status, media}) {
      const label = STATUSES.find((entry) => entry.value === status)?.title ?? 'Sans statut'
      return {
        title: title || 'Annonceur sans nom',
        subtitle: category ? `${category} — ${label}` : label,
        media,
      }
    },
  },
})
