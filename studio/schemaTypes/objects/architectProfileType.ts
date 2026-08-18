import {defineType, defineField} from 'sanity'

/**
 * Un architecte associé à la conception de l'église.
 *
 * Aucun portrait : les attributions elles-mêmes ne sont pas confirmées, et les
 * droits d'une photographie de ces personnes ne le sont pas davantage. La fiche
 * affiche les initiales.
 *
 * La case « attribution à confirmer » n'est pas une note interne : elle produit
 * une mention visible sur la page. Tant que la paroisse n'a pas validé le rôle
 * de chacun, le site ne doit pas l'affirmer.
 */
export const architectProfileType = defineType({
  name: 'architectProfile',
  title: 'Architecte',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Rôle',
      type: 'string',
      description: 'Ex. : « Architecte principal — attribution à confirmer ».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'confirmationRequired',
      title: 'Attribution à confirmer',
      type: 'boolean',
      description:
        'Affiche une mention sur la page. Ne la décocher qu’une fois le rôle validé avec la paroisse.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role'},
  },
})
