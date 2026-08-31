import {defineType, defineField} from 'sanity'

type EventImageValue = {
  image?: {asset?: {_ref?: string}}
  alt?: string
}

/**
 * Taille en dessous de laquelle le cadre devra agrandir l'image.
 *
 * Le plus grand cadre d'image du site fait 604 points de large sur 340 de
 * haut. Un écran moderne affiche deux pixels par point : il faut donc environ
 * 1200 × 680 pixels pour que l'image reste nette. En dessous, elle est étirée,
 * et l'étirement ne s'invente pas — aucun réglage ne rattrape des pixels qui
 * n'ont jamais été photographiés.
 */
const MINIMUM_WIDTH = 1200
const MINIMUM_HEIGHT = 680

/** `image-<empreinte>-<largeur>x<hauteur>-<extension>` : le format des références. */
const ASSET_DIMENSIONS = /-(\d+)x(\d+)-[a-z]+$/

const readAssetSize = (reference?: string): {width: number; height: number} | undefined => {
  const match = reference ? ASSET_DIMENSIONS.exec(reference) : null
  if (!match) return undefined

  return {width: Number(match[1]), height: Number(match[2])}
}

/**
 * Image d'événement, avec ce qu'il faut pour la publier sans risque.
 *
 * Le fichier ne suffit pas : sans texte alternatif la photo est invisible pour
 * une personne aveugle, sans note de licence personne ne saura dans deux ans si
 * on avait le droit de la publier, et sans la case « personne reconnaissable »
 * on ne peut plus retrouver les photos à retirer si quelqu'un le demande.
 */
export const eventImageType = defineType({
  name: 'eventImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Fichier',
      type: 'image',
      // Le point focal remplace les réglages de cadrage écrits à la main dans
      // le code : l'éditrice clique sur ce qui doit rester visible.
      options: {hotspot: true},
    }),
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      type: 'string',
      description:
        'Décrire ce que montre l’image, factuellement. Lu à voix haute par les lecteurs d’écran et affiché si l’image ne charge pas.',
    }),
    defineField({
      name: 'credit',
      title: 'Crédit',
      type: 'string',
      description: 'Auteur ou source, si connu.',
    }),
    defineField({
      name: 'rightsNote',
      title: 'Droits',
      type: 'text',
      rows: 2,
      description:
        'D’où vient l’image et à quel titre peut-on la publier. Ex. : photo prise par la paroisse, licence Pixabay, autorisation écrite du photographe.',
    }),
    defineField({
      name: 'containsRecognizablePeople',
      title: 'Des personnes sont reconnaissables',
      type: 'boolean',
      description:
        'À cocher dès qu’un visage est identifiable. Publier l’image d’une personne sans son accord n’est pas permis.',
      initialValue: false,
    }),
    defineField({
      name: 'generatedByAi',
      title: 'Image générée par intelligence artificielle',
      type: 'boolean',
      description:
        'À cocher si l’image n’est pas une photographie réelle. Une image générée ne doit jamais illustrer un lieu ou un moment présentés comme réels.',
      initialValue: false,
    }),
  ],
  // Validation portée par l'objet : un emplacement d'image jamais rempli ne doit
  // pas rendre le document invalide. Mais dès qu'un fichier est déposé, le texte
  // alternatif devient exigible.
  //
  // La taille, elle, n'est qu'un avertissement : une image trop petite reste
  // publiable, elle sera simplement floue. Le dire au moment du dépôt vaut
  // mieux que le découvrir sur le site — c'est arrivé avec les visuels repris
  // de l'ancien site, larges de 400 à 800 pixels, agrandis trois fois.
  validation: (rule) => [
    rule.custom((value) => {
      const entry = value as EventImageValue | undefined
      if (!entry?.image?.asset?._ref) return true

      return entry.alt?.trim() ? true : 'Ajouter un texte alternatif décrivant l’image.'
    }),
    rule
      .custom((value) => {
        const entry = value as EventImageValue | undefined
        const size = readAssetSize(entry?.image?.asset?._ref)
        if (!size) return true

        if (size.width >= MINIMUM_WIDTH && size.height >= MINIMUM_HEIGHT) return true

        return (
          `Image un peu petite (${size.width} × ${size.height} pixels) : elle paraîtra floue. ` +
          `Une photo prise au téléphone convient; une image copiée depuis un site web, ` +
          `rarement. Publiable quand même.`
        )
      })
      .warning(),
  ],
  preview: {
    select: {media: 'image', title: 'alt', subtitle: 'credit'},
  },
})
