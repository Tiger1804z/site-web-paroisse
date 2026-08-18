import {defineType, defineField} from 'sanity'

/** Un trait d'architecture listé sous le texte de la section « Le lieu ». */
export const architectureFeatureType = defineType({
  name: 'architectureFeature',
  title: 'Trait d’architecture',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
