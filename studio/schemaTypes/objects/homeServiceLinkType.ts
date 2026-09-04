import {defineType, defineField} from 'sanity'

/**
 * Les quatre destinations vers lesquelles l'accueil pointe.
 *
 * Trois sont des sections de la page Nos services; « Location de salle » est
 * une page à part entière depuis le 2026-09-03, et le code envoie ce choix
 * vers `/location-de-salle/`. La valeur stockée n'a pas changé : renommer une
 * valeur choisie dans un document aurait vidé les raccourcis déjà saisis.
 *
 * Une liste fermée plutôt qu'une adresse à saisir : c'est la règle du projet —
 * les adresses sont des routes du site, pas du contenu. Le Studio choisit une
 * destination connue, le code fabrique le lien.
 */
const TARGETS = [
  {title: 'Sacrements et initiation chrétienne', value: 'sacrements-et-initiation'},
  {title: 'Accompagnement et documents', value: 'accompagnement-et-documents'},
  {title: 'Intentions, lampions et célébrations', value: 'priere-et-memoire'},
  {title: 'Location de salle', value: 'location-de-salle'},
]

/**
 * Un raccourci de l'accueil vers un service de la paroisse.
 *
 * Le libellé, lui, est bien du contenu : « Mariage et baptême » regroupe
 * volontairement deux démarches sous une seule ligne, ce que le titre de la
 * section ne dit pas. Deux raccourcis peuvent viser la même destination.
 */
export const homeServiceLinkType = defineType({
  name: 'homeServiceLink',
  title: 'Raccourci vers un service',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'target',
      title: 'Destination',
      type: 'string',
      options: {list: TARGETS},
      description: 'Ce vers quoi le lien mène. La page qui convient est choisie par le site.',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', target: 'target'},
    prepare({title, target}) {
      return {
        title: title || 'Raccourci sans libellé',
        subtitle: TARGETS.find((entry) => entry.value === target)?.title ?? 'Destination à choisir',
      }
    },
  },
})
