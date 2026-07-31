import {defineType, defineField} from 'sanity'

/**
 * Une ligne de renseignement sous un service : « Tarif 2026 », « 400 $ … ».
 *
 * Le contrat local portait aussi un booléen `confirmed` et un bloc de
 * métadonnées de révision (source, date, année d'application). Aucun n'était
 * rendu par la page, et `confirmed` valait toujours vrai. Ils ne sont pas
 * recréés ici : un champ que rien n'affiche est un formulaire sans effet. La
 * date de révision affichée est celle de l'encadré `notice`, une seule fois
 * pour toute la page.
 */
export const serviceDetailType = defineType({
  name: 'serviceDetail',
  title: 'Renseignement',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Intitulé',
      type: 'string',
      description: 'Par exemple « Tarif 2026 », « Délai publié », « Horaire publié ».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Valeur',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'value'},
  },
})
