import {defineType, defineField} from 'sanity'

/**
 * Les groupes que la page Vie paroissiale peut présenter.
 *
 * Liste écrite à la main, comme les ancres de la page Nos services : ce sont
 * des identifiants techniques, pas du contenu. Ajouter un groupe là-bas demande
 * de l'ajouter ici — le prix à payer pour que l'accueil ne recopie pas les noms.
 */
const GROUPS = [
  {title: 'Jeunes', value: 'jeunes'},
  {title: 'Chorale', value: 'chorale'},
  {title: 'Dames et Fils de Notre-Dame', value: 'dames-fils-notre-dame'},
  {title: 'Marguilliers', value: 'marguilliers'},
]

/**
 * Une rangée de la section « Vivre la paroisse » sur l'accueil.
 *
 * Le **nom du groupe n'est pas saisi ici** : il est lu dans la page Vie
 * paroissiale, où le groupe existe vraiment. Cette rangée ne fait que le
 * désigner et lui écrire une ligne d'accroche propre à l'accueil.
 *
 * Conséquences voulues : renommer un groupe là-bas le renomme ici, et
 * décocher « actif » là-bas le retire aussi de l'accueil. Un identifiant qui
 * ne correspond à aucun groupe actif fait disparaître la rangée plutôt que
 * d'afficher un lien vers rien.
 */
export const homeGroupTeaserType = defineType({
  name: 'homeGroupTeaser',
  title: 'Groupe annoncé',
  type: 'object',
  fields: [
    defineField({
      name: 'group',
      title: 'Groupe',
      type: 'string',
      options: {list: GROUPS},
      description:
        'Le nom affiché vient de la page Vie paroissiale. Un groupe qui y est désactivé n’apparaît pas ici non plus.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'teaser',
      title: 'Ligne d’accroche',
      type: 'string',
      description:
        'Une ligne courte, écrite pour l’accueil. Ex. : « Chant liturgique et animation des célébrations ».',
    }),
  ],
  preview: {
    select: {group: 'group', subtitle: 'teaser'},
    prepare({group, subtitle}) {
      return {
        title: GROUPS.find((entry) => entry.value === group)?.title ?? 'Groupe à choisir',
        subtitle,
      }
    },
  },
})
