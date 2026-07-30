import {defineType, defineField} from 'sanity'
import {BasketIcon} from '@sanity/icons/Basket'

/**
 * La friperie elle-même : des faits vrais indépendamment de toute page.
 *
 * Ses heures et son téléphone ne sont pas ceux de la paroisse — la friperie a
 * sa propre ligne. Ils appartiennent donc ici, pas dans `siteSettings`, et pas
 * dans `thriftStorePage` : `/contact` et l'accueil pourront les afficher sans
 * lire un document de page.
 *
 * Règle de saisie : un champ vide n'est pas publié. Rien n'est inventé pour
 * remplir un trou, et aucune case « confirmé » n'est nécessaire — l'absence de
 * valeur dit déjà que l'information n'est pas confirmée.
 *
 * Ce document ne porte que ce que la page affiche vraiment. Un champ que rien
 * ne rend serait un formulaire sans effet.
 */
export const thriftStoreType = defineType({
  name: 'thriftStore',
  title: 'Friperie',
  type: 'document',
  icon: BasketIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nom de la friperie',
      type: 'string',
      description: 'Ex. : Au Coin de l’Entraide.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hours',
      title: 'Heures d’ouverture',
      type: 'string',
      description:
        'Écrites en toutes lettres, comme on les dirait au téléphone. Ex. : Tous les mardis, mercredis et jeudis, de 13 h à 17 h.',
    }),
    defineField({
      name: 'location',
      title: 'Emplacement',
      type: 'text',
      rows: 2,
      description:
        'Où entrer, précisément. Ex. : sous-sol de l’église, entrée par la porte de la 25e Avenue.',
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone de la friperie',
      type: 'string',
      description:
        'La ligne de la friperie, différente de celle du secrétariat. Laisser vide pour n’afficher aucun numéro.',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'hours'},
    prepare({title, subtitle}) {
      return {
        title: title || 'Friperie',
        subtitle: subtitle || 'Heures non publiées',
      }
    },
  },
})
