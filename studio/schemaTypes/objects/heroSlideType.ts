import {defineType, defineField} from 'sanity'

/**
 * Une image du carrousel d'en-tête d'une page.
 *
 * Le libellé s'affiche par-dessus l'image pendant qu'elle est à l'écran. Le
 * cadrage n'est pas saisi : le point focal de l'image, posé dans le Studio,
 * décide de ce qui reste visible quand le cadre change de forme.
 */
export const heroSlideType = defineType({
  name: 'heroSlide',
  title: 'Image d’en-tête',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'string',
      description: 'Court texte affiché par-dessus l’image.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'visual',
      title: 'Image',
      type: 'eventImage',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'label', subtitle: 'visual.credit', media: 'visual.image'},
  },
})
