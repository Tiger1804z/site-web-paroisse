import type { PublicContactDetails } from '@/types/siteSettings';
import type { RoomRentalPageData } from '@/types/roomRental';

/**
 * Repli local de la page Location de salle.
 *
 * Tout ce qui est écrit ici vient de la section « Location de salle » de la
 * page Nos services, d'où cette page est sortie le 3 septembre 2026 — les deux
 * salles, leurs capacités, leurs tarifs et la marche à suivre. Rien n'a été
 * ajouté : le texte a seulement été démêlé. Il tenait auparavant dans la valeur
 * d'un seul champ, deux salles et cinq faits mêlés dans une même chaîne, ce
 * qu'aucune éditrice ne pouvait corriger sans tout relire.
 *
 * Une phrase a été retirée, et c'est la seule perte assumée : « Aucune
 * capacité, aucun tarif, aucun équipement ni aucune heure disponible ne sont
 * publiés avant confirmation. » Elle datait du jour où la paroisse ne publiait
 * rien de tout cela. La page publie maintenant les deux capacités et les deux
 * tarifs; garder la phrase, c'était garder une page qui se contredit.
 */
export function buildRoomRentalPageData(
  siteSettings: PublicContactDetails,
): RoomRentalPageData {
  const secretariatCta = {
    label: 'Contacter le secrétariat',
    href: '/contact/',
  } as const;

  return {
    seo: {
      title: 'Location de salle',
      // Le nom vient des coordonnées reçues, pas de la constante `SITE_NAME` :
      // c'est la même paroisse, mais celui-ci suit ce que le Studio publie, et
      // ce module reste chargeable tel quel par `node --test`.
      description: `Deux salles à louer à la ${siteSettings.organizationName} : capacités, tarifs et marche à suivre pour réserver auprès du secrétariat.`,
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
      items: [
        'Une cuisinette',
        'Une salle de bain',
        'Un vestiaire',
        'Des tables et des chaises',
      ],
    },
    rooms: [
      {
        id: 'la-ruchee',
        name: 'La Ruchée',
        location: 'Située au jubé',
        capacity: 'Jusqu’à 50 personnes',
        price: '250 $ pour 4 heures',
      },
      {
        id: 'sous-sol-de-leglise',
        name: 'Le sous-sol de l’église',
        location: 'Sous l’église, le local de la friperie',
        capacity: 'Jusqu’à 125 personnes',
        price: '300 $ pour 6 heures',
      },
    ],
    practical: {
      title: 'Comment se passe une réservation',
      items: [
        {
          label: 'Disponibilité',
          value:
            'Communiquée directement par le secrétariat; aucun calendrier public automatique.',
        },
        {
          label: 'Réservation',
          value: 'Confirmée directement avec la paroisse.',
        },
        {
          label: 'Contrat',
          value: 'Remis et signé le jour de la réservation.',
        },
      ],
    },
    finalCta: {
      title: 'Vérifier une date',
      description:
        'Contactez le secrétariat pour vérifier nos disponibilités et confirmer une réservation.',
      primary: secretariatCta,
      phone: { display: siteSettings.phone.display },
    },
  } as const satisfies RoomRentalPageData;
}
