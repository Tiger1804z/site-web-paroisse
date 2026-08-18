import {defineType, defineField} from 'sanity'

type GalleryPhotoValue = {
  photo?: {
    image?: {asset?: {_ref?: string}}
    containsRecognizablePeople?: boolean
  }
  consentConfirmed?: boolean
  rightsCleared?: boolean
}

/**
 * Une photographie du carrousel de l'accueil.
 *
 * Le fichier, son texte alternatif, son crédit et sa note de droits vivent dans
 * `eventImage`, l'objet image commun au site. S'y ajoutent ici le titre et la
 * description affichés sous la photo, et les deux verrous de publication.
 *
 * Être dans la liste, c'est être visible : il n'y a ni champ d'ordre ni case
 * « afficher ». Retirer une photographie du carrousel, c'est la sortir de la
 * liste — le fichier reste dans le Studio.
 */
export const galleryPhotoType = defineType({
  name: 'galleryPhoto',
  title: 'Photographie',
  type: 'object',
  fields: [
    defineField({
      name: 'photo',
      title: 'Image',
      type: 'eventImage',
      description:
        'Le point focal choisi ici décide de ce qui reste visible quand la photo est recadrée.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      description: 'Affiché sous la photo. Ex. : « Les clochers ».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
      description:
        'Une phrase sous le titre. Le texte alternatif, lui, se saisit dans l’image : il décrit, il ne raconte pas.',
    }),
    defineField({
      name: 'rightsCleared',
      title: 'Droits de publication confirmés',
      type: 'boolean',
      description:
        'Tant que cette case n’est pas cochée, la photographie reste dans la liste sans s’afficher sur le site.',
      initialValue: false,
    }),
    defineField({
      name: 'consentConfirmed',
      title: 'Consentement des personnes obtenu',
      type: 'boolean',
      description:
        'À cocher seulement si les personnes reconnaissables sur la photo ont donné leur accord.',
      initialValue: false,
    }),
  ],
  /**
   * Le consentement est exigé au moment de la saisie, pas seulement à la
   * lecture : une photo de personnes non consentantes ne doit pas pouvoir
   * dormir dans le document en attendant qu'un bogue la publie.
   */
  validation: (rule) =>
    rule.custom((value) => {
      const entry = value as GalleryPhotoValue | undefined
      if (!entry?.photo?.image?.asset?._ref) return true

      if (entry.photo.containsRecognizablePeople && !entry.consentConfirmed) {
        return 'Des personnes sont reconnaissables : cocher le consentement, ou retirer la photographie.'
      }

      return true
    }),
  preview: {
    select: {
      title: 'title',
      subtitle: 'photo.credit',
      media: 'photo.image',
      cleared: 'rightsCleared',
    },
    prepare({title, subtitle, media, cleared}) {
      return {
        title: title || 'Photographie sans titre',
        subtitle: cleared ? subtitle : `Droits à confirmer${subtitle ? ` — ${subtitle}` : ''}`,
        media,
      }
    },
  },
})
