import type { PublicContactDetails } from '@/types/siteSettings';
import type { RoomRentalPageData } from '@/types/roomRental';

/**
 * Repli local de la page Location de salle.
 *
 * Deux sources, relevées mot pour mot :
 *
 * - le chapitre « Location de salle » de la page Nos services, d'où cette page
 *   est sortie le 2026-09-03;
 * - la page `/location-de-salle` de l'ancien site de la paroisse, relue
 *   intégralement le 2026-09-04.
 *
 * La relecture de l'ancien site a trouvé six faits que la première migration
 * avait perdus, parce que le champ Sanity dont elle est partie ne les portait
 * déjà plus : le supplément horaire de La Ruchée, les deux heures limites de
 * départ, le dépôt de garantie, les règles sur l'alcool avec leur délai de dix
 * jours, et la location de l'église — une troisième location entière, avec sa
 * capacité et son tarif.
 *
 * Rien n'est inventé ici. Là où le texte a été redécoupé, le sens est celui de
 * l'ancien site; la seule retouche est une faute d'accord (« heure
 * supplémentaires »).
 *
 * Une phrase de l'ancien chapitre reste retirée, et c'est la seule perte
 * assumée : « Aucune capacité, aucun tarif, aucun équipement ni aucune heure
 * disponible ne sont publiés avant confirmation. » La page publie maintenant
 * tout cela; la garder, c'était garder une page qui se contredit.
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
      description: `Salles de réception et église à louer à la ${siteSettings.organizationName} : capacités, tarifs, dépôt de garantie et marche à suivre pour réserver.`,
    },
    hero: {
      eyebrow: 'Accueillir chez nous',
      title: 'Location de salle',
      introduction:
        'Deux salles de réception et l’église elle-même, chacune avec sa capacité et son tarif. Le secrétariat vérifie la disponibilité et confirme la réservation.',
    },
    offer: {
      eyebrow: 'Salles de réception',
      title: 'Deux salles à vous offrir',
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
        hourlyExtra: '50 $ par heure supplémentaire',
        curfew: '22 h',
      },
      {
        id: 'sous-sol-de-leglise',
        name: 'Le sous-sol de l’église',
        location: 'Sous l’église, le local de la friperie',
        capacity: 'Jusqu’à 125 personnes',
        price: '300 $ pour 6 heures',
        curfew: '23 h',
      },
    ],
    church: {
      id: 'location-de-leglise',
      eyebrow: 'Autre espace',
      title: 'Location de l’église',
      description:
        'L’église peut être louée sous certaines conditions, à des organismes religieux, des groupes ou pour des concerts.',
      capacity: 'Jusqu’à 250 personnes',
      price: 'Prix régulier de 250 $ par jour',
      note: 'Une location à long terme est possible.',
    },
    deposit: {
      title: 'Dépôt de garantie',
      message:
        'Un montant additionnel sur toutes les locations sera exigé lors de la réservation comme dépôt de garantie. Ce montant vous sera remboursé si la salle est remise en bon état.',
    },
    alcohol: {
      title: 'Boissons alcoolisées',
      rules: [
        'Un permis de la Ville de Montréal est exigé si vous désirez apporter votre boisson.',
        'Le permis est à vos frais.',
        'Aucune vente d’alcool n’est autorisée.',
        'Une copie du permis doit nous être remise au moins 10 jours avant la date de réservation.',
      ],
      // Adresse relevée sur l'ancien site, moins son `sid` : c'était un jeton
      // de session d'une visite de 2023, que le serveur ignore — vérifié, la
      // page rendue est identique avec et sans.
      permitUrl:
        'https://pes.securitepublique.gouv.qc.ca/acolyte/facettes/permis/captcha.faces',
      permitLinkLabel: 'Faire une demande de permis',
    },
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
