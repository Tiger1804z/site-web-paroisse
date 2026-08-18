import {defineType, defineField, defineArrayMember} from 'sanity'

/**
 * Un groupe de la vie paroissiale : jeunes, chorale, marguilliers…
 *
 * L'ancre est saisie explicitement, comme pour les services : elle identifie la
 * carte dans l'adresse et rattache l'image, restée un fichier du projet.
 *
 * Le bouton mène toujours à `/contact/`; seul son libellé se saisit. Le statut
 * éditorial du contrat local (`to-confirm`, `temporary`, `stable-direction`)
 * n'est pas repris : aucun composant ne l'affichait. Ce qui reste à confirmer se
 * dit dans le texte, où la visiteuse le lit vraiment.
 */
export const parishGroupType = defineType({
  name: 'parishGroup',
  title: 'Groupe',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Nom du groupe',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Ancre',
      type: 'slug',
      description:
        'Identifiant de la carte. Il rattache aussi l’image du groupe, définie par le code : le changer détache l’image.',
      options: {source: 'title', maxLength: 60},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Surtitre',
      type: 'string',
      initialValue: 'Groupe',
    }),
    defineField({
      name: 'summary',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'highlights',
      title: 'Points saillants',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      description:
        'Une ligne par entrée, affichée en liste sous la description. L’ordre du tableau fait foi.',
    }),
    defineField({
      name: 'visual',
      title: 'Image',
      type: 'eventImage',
      description:
        'Sans image, le groupe n’est pas publié : sa carte serait un cadre vide. Le point focal décide de ce qui reste visible au recadrage.',
    }),
    defineField({
      name: 'ctaLabel',
      title: 'Libellé du bouton',
      type: 'string',
      description: 'Le bouton mène toujours à la page Contact; seul son libellé se saisit ici.',
      initialValue: 'Demander de l’information',
    }),
    defineField({
      name: 'active',
      title: 'Affiché',
      type: 'boolean',
      description: 'Décocher masque le groupe sans le supprimer.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'eyebrow',
      active: 'active',
      media: 'visual.image',
    },
    prepare({title, subtitle, active, media}) {
      return {
        title: `${active === false ? '⏸ ' : ''}${title || 'Groupe'}`,
        subtitle,
        media,
      }
    },
  },
})
