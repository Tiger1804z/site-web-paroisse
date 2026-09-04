import {defineType, defineField, defineArrayMember} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'

/**
 * Contenu de la page /location-de-salle.
 *
 * La location de salle était un chapitre de la page Nos services, et
 * `/location-de-salle/` une adresse morte qui y renvoyait. La paroisse a
 * demandé l’inverse : un onglet à elle. C’est aussi ce que dit l’usage — on
 * cherche « louer une salle », pas « les services de la paroisse ».
 *
 * Ni téléphone ni adresse de bouton ici : le numéro affiché vient des
 * coordonnées de la paroisse, et le bouton mène toujours à /contact/.
 */
export const roomRentalPageType = defineType({
  name: 'roomRentalPage',
  title: 'Page Location de salle',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'header', title: 'En-tête', default: true},
    {name: 'rooms', title: 'Les salles'},
    {name: 'conditions', title: 'Conditions'},
    {name: 'practical', title: 'Réserver'},
    {name: 'seo', title: 'Google et partages'},
  ],
  fields: [
    defineField({
      name: 'seo',
      title: 'Apparence sur Google et dans les partages',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'hero',
      title: 'En-tête (hero)',
      type: 'object',
      group: 'header',
      fields: [
        defineField({
          name: 'eyebrow',
          title: 'Surtitre',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'title',
          title: 'Titre',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'introduction',
          title: 'Introduction',
          type: 'text',
          rows: 3,
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'image',
          title: 'Image de fond',
          type: 'eventImage',
          description:
            'La photographie du premier écran. Sans elle, l’en-tête garde son fond sombre et le titre reste lisible.',
        }),
      ],
    }),
    defineField({
      name: 'offer',
      title: 'Présentation de l’offre',
      type: 'object',
      group: 'rooms',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'periodLabel',
          title: 'Période des tarifs',
          type: 'string',
          description:
            'La période que couvrent les tarifs affichés : « Location 2026-2027 ». À corriger en même temps que les prix.',
        }),
        defineField({
          name: 'paragraphs',
          title: 'Paragraphes',
          type: 'array',
          of: [defineArrayMember({type: 'text', rows: 3})],
          description: 'Un paragraphe par entrée. L’ordre du tableau fait foi.',
        }),
      ],
    }),
    defineField({
      name: 'amenities',
      title: 'Ce que toutes les salles offrent',
      type: 'object',
      group: 'rooms',
      description:
        'Écrit une seule fois pour toutes les salles. Ce qui ne vaut que pour une salle se met dans sa fiche.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'items',
          title: 'Équipements',
          type: 'array',
          of: [defineArrayMember({type: 'string'})],
          description: 'Un équipement par entrée : « Une cuisinette », « Un vestiaire ».',
        }),
      ],
    }),
    defineField({
      name: 'rooms',
      title: 'Les salles',
      type: 'array',
      group: 'rooms',
      of: [defineArrayMember({type: 'rentalRoom'})],
      description: 'L’ordre du tableau fait foi. Une salle retirée d’ici disparaît de la page.',
      validation: (rule) => rule.min(1),
    }),
    /**
     * L'église se loue aussi, et pas comme une salle.
     *
     * L'ancien site en faisait sa deuxième section, et la première migration
     * l'a perdue entièrement — 250 places et 250 $ par jour, disparus. Elle
     * reste séparée du tableau des salles : elle n'a ni cuisinette ni
     * vestiaire, donc la ranger avec les autres rendrait faux le bloc « dans
     * chacune des deux salles ».
     */
    defineField({
      name: 'church',
      title: 'Location de l’église',
      type: 'object',
      group: 'rooms',
      description:
        'Laisser le titre vide masque toute la section : l’église cesse alors d’être annoncée comme louable.',
      fields: [
        defineField({name: 'eyebrow', title: 'Surtitre', type: 'string'}),
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'description',
          title: 'À qui et pour quoi',
          type: 'text',
          rows: 3,
          description:
            'Les conditions d’accès, telles que la paroisse les formule : « sous certaines conditions, à des organismes religieux, des groupes ou pour des concerts ».',
        }),
        defineField({
          name: 'capacity',
          title: 'Capacité',
          type: 'string',
          description: 'Telle qu’elle doit s’afficher : « Jusqu’à 250 personnes ».',
        }),
        defineField({
          name: 'price',
          title: 'Tarif',
          type: 'string',
          description: 'Par exemple « Prix régulier de 250 $ par jour ».',
        }),
        defineField({
          name: 'note',
          title: 'Précision',
          type: 'string',
          description: 'Par exemple « Une location à long terme est possible. »',
        }),
      ],
    }),
    /**
     * Le dépôt de garantie est de l'argent demandé en plus du tarif affiché.
     *
     * Il a son bloc, et non une ligne au milieu d'un paragraphe : une personne
     * qui le découvre au comptoir le jour de la signature a le droit de se
     * sentir trompée.
     */
    defineField({
      name: 'deposit',
      title: 'Dépôt de garantie',
      type: 'object',
      group: 'conditions',
      description:
        'Laisser le message vide masque le bloc. Ne le masquer que si la paroisse cesse vraiment d’exiger un dépôt.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'message',
          title: 'Message',
          type: 'text',
          rows: 4,
          description:
            'Dire le montant s’il est fixe, et dans quel cas il est remboursé. C’est la question que tout le monde pose ensuite.',
        }),
      ],
    }),
    /**
     * Les règles sur l'alcool, une par ligne.
     *
     * L'ancien site les donnait en un seul bloc commençant par « NOTE: », où le
     * délai de dix jours — le seul fait qui peut faire rater une réservation —
     * arrivait en dernier, après deux virgules.
     */
    defineField({
      name: 'alcohol',
      title: 'Boissons alcoolisées',
      type: 'object',
      group: 'conditions',
      description: 'Sans aucune règle saisie, la section entière est masquée.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'rules',
          title: 'Règles',
          type: 'array',
          of: [defineArrayMember({type: 'text', rows: 2})],
          description:
            'Une règle par entrée, en phrase complète. Y laisser le délai de remise du permis : c’est celui qu’on découvre trop tard.',
        }),
        defineField({
          name: 'permitUrl',
          title: 'Adresse de la demande de permis',
          type: 'url',
          description:
            'Adresse du formulaire officiel. C’est l’une des rares adresses saisissables du site : elle appartient à un organisme public, qui peut la changer sans nous prévenir.',
          validation: (rule) => rule.uri({scheme: ['http', 'https']}),
        }),
        defineField({
          name: 'permitLinkLabel',
          title: 'Libellé du bouton',
          type: 'string',
          description: 'Sans adresse ci-dessus, aucun bouton ne s’affiche.',
        }),
      ],
    }),
    defineField({
      name: 'practical',
      title: 'Comment se passe une réservation',
      type: 'object',
      group: 'practical',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'items',
          title: 'Étapes',
          type: 'array',
          of: [defineArrayMember({type: 'serviceDetail'})],
          description:
            'Une étape par entrée : « Réservation », « Confirmée directement avec la paroisse ».',
        }),
      ],
    }),
    defineField({
      name: 'finalCta',
      title: 'Bloc de fin',
      type: 'object',
      group: 'practical',
      description:
        'Le numéro affiché vient des coordonnées de la paroisse, et le bouton mène à la page Contact. Ni l’un ni l’autre ne se saisit ici.',
      fields: [
        defineField({name: 'title', title: 'Titre', type: 'string'}),
        defineField({
          name: 'description',
          title: 'Description',
          type: 'text',
          rows: 3,
        }),
      ],
    }),
  ],
  preview: {
    select: {title: 'hero.title', rooms: 'rooms'},
    prepare({title, rooms}) {
      const count = Array.isArray(rooms) ? rooms.length : 0
      return {
        title: title || 'Page Location de salle',
        subtitle: count === 0 ? 'Aucune salle' : `${count} salle${count > 1 ? 's' : ''}`,
      }
    },
  },
})
