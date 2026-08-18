import {defineType, defineField} from 'sanity'

/**
 * Une ligne du bloc « Informations pratiques ».
 *
 * C'est ici que passe la ligne de partage du modèle de contenu. Une adresse, un
 * numéro de téléphone, un stationnement, un accès : ce sont des faits sur le
 * lieu, vrais indépendamment de cette page, et déjà saisis dans « Coordonnées de
 * la paroisse ». La ligne ne les recopie donc pas — elle **désigne sa source**,
 * et le site va la lire là-bas. Corriger l'adresse à un seul endroit la corrige
 * partout.
 *
 * Trois de ces champs partagés dormaient dans le schéma depuis S1-T14 sans que
 * rien ne les projette. C'est cette page qui les consomme la première.
 *
 * Le champ `value` ne sert qu'aux lignes propres à la page, et `linkTarget`
 * choisit une destination dans une liste fermée : aucune URL ne se saisit à la
 * main, les routes du site sont typées et certaines sont encore inactives.
 *
 * Une ligne dont la source est vide n'est pas affichée. Mieux vaut taire une
 * information que l'annoncer entre crochets à quelqu'un qui se déplace.
 */
export const practicalInfoItemType = defineType({
  name: 'practicalInfoItem',
  title: 'Information pratique',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Libellé',
      type: 'string',
      description: 'Le titre de la ligne, par exemple « Adresse ».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      title: 'Source',
      type: 'string',
      description:
        'Où le site va chercher la valeur. Les quatre premières viennent de « Coordonnées de la paroisse » : elles se corrigent là-bas, une seule fois pour tout le site.',
      options: {
        list: [
          {title: 'Coordonnées — Adresse', value: 'address'},
          {title: 'Coordonnées — Téléphone', value: 'phone'},
          {title: 'Coordonnées — Stationnement', value: 'parking'},
          {title: 'Coordonnées — Accessibilité', value: 'accessibility'},
          {title: 'Texte saisi ci-dessous', value: 'pageText'},
          {title: 'Lien vers une page du site', value: 'internalLink'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'pageText',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Texte',
      type: 'text',
      rows: 2,
      description: 'Utilisé seulement si la source est « Texte saisi ci-dessous ».',
      hidden: ({parent}) => parent?.source !== 'pageText',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source !== 'pageText') return true
          return value?.trim() ? true : 'Un texte est attendu pour cette source.'
        }),
    }),
    defineField({
      name: 'linkLabel',
      title: 'Texte du lien',
      type: 'string',
      description: 'Utilisé seulement si la source est « Lien vers une page du site ».',
      hidden: ({parent}) => parent?.source !== 'internalLink',
    }),
    defineField({
      name: 'linkTarget',
      title: 'Destination',
      type: 'string',
      description: 'La page visée. La liste est fermée : elle ne contient que des routes actives.',
      options: {
        list: [
          {title: 'Horaires', value: 'schedule'},
          {title: 'Contact', value: 'contact'},
          {title: 'Nos services', value: 'services'},
        ],
        layout: 'dropdown',
      },
      hidden: ({parent}) => parent?.source !== 'internalLink',
      validation: (rule) =>
        rule.custom((value, context) => {
          const parent = context.parent as {source?: string} | undefined
          if (parent?.source !== 'internalLink') return true
          return value ? true : 'Une destination est attendue pour cette source.'
        }),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      source: 'source',
      value: 'value',
      linkLabel: 'linkLabel',
    },
    prepare({title, source, value, linkLabel}) {
      const SOURCES: Record<string, string> = {
        address: 'Coordonnées · adresse',
        phone: 'Coordonnées · téléphone',
        parking: 'Coordonnées · stationnement',
        accessibility: 'Coordonnées · accessibilité',
        pageText: value || 'Texte vide',
        internalLink: linkLabel || 'Lien',
      }
      return {
        title: title || 'Information pratique',
        subtitle: source ? SOURCES[source] : undefined,
      }
    },
  },
})
