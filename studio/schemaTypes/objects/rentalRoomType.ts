import {defineType, defineField} from 'sanity'

/**
 * Une salle offerte à la location.
 *
 * Emplacement, capacité et tarif sont trois champs distincts, et non une seule
 * zone de texte. Ils l'étaient sur l’ancienne page : les deux salles, leurs
 * équipements et leurs prix tenaient dans une même valeur, séparés par des
 * retours de ligne et des espaces. Corriger un tarif demandait de relire tout
 * le bloc et d’espérer ne rien casser autour.
 *
 * Chaque champ est facultatif sauf le nom : une salle dont le tarif n’est pas
 * arrêté s’affiche sans ligne de tarif, jamais avec « à venir ».
 */
export const rentalRoomType = defineType({
  name: 'rentalRoom',
  title: 'Salle',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Nom de la salle',
      type: 'string',
      description: 'Par exemple « La Ruchée ».',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Ancre',
      type: 'slug',
      description:
        'Identifiant de la salle dans l’adresse, après le #. Un lien envoyé vers une salle précise s’en sert : ne plus le changer une fois publié.',
      options: {source: 'name', maxLength: 60},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Emplacement',
      type: 'string',
      description: 'Où elle se trouve dans le bâtiment : « Située au jubé ».',
    }),
    defineField({
      name: 'capacity',
      title: 'Capacité',
      type: 'string',
      description:
        'Telle qu’elle doit s’afficher : « Jusqu’à 50 personnes ». Ne rien arrondir vers le haut.',
    }),
    defineField({
      name: 'price',
      title: 'Tarif',
      type: 'string',
      description:
        'Le prix et la durée qu’il couvre : « 250 $ pour 4 heures ». Laisser vide tant que le tarif n’est pas arrêté.',
    }),
    defineField({
      name: 'description',
      title: 'Précision',
      type: 'text',
      rows: 3,
      description: 'Facultatif. Ce qui distingue cette salle des autres.',
    }),
  ],
  preview: {
    select: {title: 'name', capacity: 'capacity', price: 'price'},
    prepare({title, capacity, price}) {
      return {
        title: title || 'Salle sans nom',
        subtitle: [capacity, price].filter(Boolean).join(' · ') || undefined,
      }
    },
  },
})
