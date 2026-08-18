import {defineType, defineField} from 'sanity'

/**
 * Un motif dans la liste déroulante du formulaire.
 *
 * Le libellé se lit, la clé sert au traitement. La clé est saisie plutôt que
 * dérivée du libellé : le jour où le formulaire enverra vraiment, c'est elle qui
 * routera la demande, et renommer un libellé ne doit pas changer un routage.
 */
export const contactReasonType = defineType({
  name: 'contactReason',
  title: 'Motif de contact',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'string',
      description: 'Ce que la personne lit dans la liste.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Clé',
      type: 'slug',
      description:
        'Identifiant technique, en minuscules et sans accent. Ne pas le changer une fois le motif en service.',
      options: {source: 'label', maxLength: 40},
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'value.current'},
  },
})
