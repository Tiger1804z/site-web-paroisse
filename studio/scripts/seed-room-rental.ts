/**
 * Saisie initiale de la page Location de salle.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-room-rental.ts --with-user-token
 *
 * Le script vit ici et non dans `scripts/` à la racine : `sanity exec` résout
 * ses dépendances depuis le dossier du Studio. Il compile en CJS, donc pas de
 * `await` au premier niveau — d'où le `main()`.
 *
 * Tout ce qu'il écrit vient du chapitre « Location de salle » de la page Nos
 * services, d'où cette page est sortie. Le texte n'a pas été réécrit, il a été
 * démêlé : deux salles, deux capacités, deux tarifs et cinq faits tenaient dans
 * la valeur d'un seul champ, séparés par des retours de ligne et une trentaine
 * d'espaces. Chaque fait a maintenant son champ.
 *
 * Une seule phrase de l'ancien texte n'est pas reprise : « Aucune capacité,
 * aucun tarif, aucun équipement ni aucune heure disponible ne sont publiés
 * avant confirmation. » Elle datait du jour où la page ne publiait rien de tout
 * cela. Elle en publie maintenant l'essentiel — la garder, c'était publier une
 * page qui se contredit dans le même écran.
 *
 * `createOrReplace` sur un identifiant fixe le rend rejouable, mais il écrase
 * ce qui s'y trouve : ne pas le relancer une fois que la paroisse a commencé à
 * éditer cette page.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

async function main() {
  await client.createOrReplace({
    _id: 'roomRentalPage',
    _type: 'roomRentalPage',
    seo: {
      _type: 'seo',
      title: 'Location de salle',
      description:
        'Deux salles à louer à la Paroisse Saint-René-Goupil : capacités, tarifs et marche à suivre pour réserver auprès du secrétariat.',
    },
    hero: {
      eyebrow: 'Accueillir chez nous',
      title: 'Location de salle',
      introduction:
        'La paroisse offre deux salles à la location, chacune avec sa capacité et son tarif. Le secrétariat vérifie la disponibilité et confirme la réservation.',
    },
    offer: {
      eyebrow: 'Deux salles',
      title: 'Ce que la paroisse met à votre disposition',
      periodLabel: 'Location 2026-2027',
      paragraphs: [
        'Nos tarifs incluent l’assurance responsabilité civile obligatoire.',
        'La disponibilité est vérifiée manuellement afin d’éviter toute promesse de réservation qui ne pourrait pas être tenue.',
      ],
    },
    amenities: {
      title: 'Dans chacune des deux salles',
      items: ['Une cuisinette', 'Une salle de bain', 'Un vestiaire', 'Des tables et des chaises'],
    },
    rooms: [
      {
        _key: 'laRuchee',
        _type: 'rentalRoom',
        name: 'La Ruchée',
        slug: {_type: 'slug', current: 'la-ruchee'},
        location: 'Située au jubé',
        capacity: 'Jusqu’à 50 personnes',
        price: '250 $ pour 4 heures',
      },
      {
        _key: 'sousSol',
        _type: 'rentalRoom',
        name: 'Le sous-sol de l’église',
        slug: {_type: 'slug', current: 'sous-sol-de-leglise'},
        location: 'Sous l’église, le local de la friperie',
        capacity: 'Jusqu’à 125 personnes',
        price: '300 $ pour 6 heures',
      },
    ],
    practical: {
      title: 'Comment se passe une réservation',
      items: [
        {
          _key: 'disponibilite',
          _type: 'serviceDetail',
          label: 'Disponibilité',
          value: 'Communiquée directement par le secrétariat; aucun calendrier public automatique.',
        },
        {
          _key: 'reservation',
          _type: 'serviceDetail',
          label: 'Réservation',
          value: 'Confirmée directement avec la paroisse.',
        },
        {
          _key: 'contrat',
          _type: 'serviceDetail',
          label: 'Contrat',
          value: 'Remis et signé le jour de la réservation.',
        },
      ],
    },
    finalCta: {
      title: 'Vérifier une date',
      description:
        'Contactez le secrétariat pour vérifier nos disponibilités et confirmer une réservation.',
    },
  })

  console.log('roomRentalPage écrit.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
