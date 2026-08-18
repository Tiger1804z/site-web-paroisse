import {defineType, defineField, defineArrayMember} from 'sanity'

/**
 * Un service de la paroisse : mariage, baptême, funérailles, lampions…
 *
 * L'ancre est saisie explicitement plutôt que dérivée de la `_key` Sanity :
 * elle sert d'identifiant de section dans l'adresse publique, et une ancre qui
 * change casse un lien déjà partagé.
 *
 * Le bouton d'appel n'est pas un champ : les services renvoient tous au
 * téléphone du secrétariat, que le code lit dans `siteSettings`. Le saisir ici
 * dupliquerait la donnée et ouvrirait la porte à une adresse arbitraire.
 *
 * La catégorie du contrat local (`sacrament`, `pastoral`, `memorial`…) n'est pas
 * reprise : aucun composant ne s'en sert.
 */
export const parishServiceType = defineType({
  name: 'parishService',
  title: 'Service',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Ancre',
      type: 'slug',
      description:
        'Identifiant de la section dans l’adresse, après le #. À ne plus changer une fois publié : un lien partagé cesserait de fonctionner.',
      options: {source: 'title', maxLength: 60},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      title: 'Résumé',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'details',
      title: 'Renseignements',
      type: 'array',
      of: [defineArrayMember({type: 'serviceDetail'})],
      description: 'Tarifs, délais, horaires publiés. L’ordre du tableau fait foi.',
    }),
    defineField({
      name: 'steps',
      title: 'Étapes de la démarche',
      type: 'array',
      of: [defineArrayMember({type: 'text', rows: 2})],
      description: 'Une étape par entrée, dans l’ordre où elles se suivent.',
    }),
    defineField({
      name: 'note',
      title: 'Note',
      type: 'text',
      rows: 3,
      description: 'Précision affichée en fin de service, par exemple ce qui reste à confirmer.',
    }),
    defineField({
      name: 'active',
      title: 'Affiché',
      type: 'boolean',
      description:
        'Décocher masque le service sans le supprimer — utile hors période d’inscription.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'title', details: 'details', active: 'active'},
    prepare({title, details, active}) {
      const count = Array.isArray(details) ? details.length : 0
      return {
        title: `${active === false ? '⏸ ' : ''}${title || 'Service'}`,
        subtitle:
          count === 0 ? 'Aucun renseignement' : `${count} renseignement${count > 1 ? 's' : ''}`,
      }
    },
  },
})
