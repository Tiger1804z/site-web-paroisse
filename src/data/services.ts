import candlesImage from '@/assets/images/home/editorial/candles-prayer.jpg';
import iconImage from '@/assets/images/home/editorial/mother-of-perpetual-help-icon.jpg';
import baptismImage from '@/assets/images/services/baptism-ceremony.jpg';
import communionImage from '@/assets/images/services/first-communion-candle.jpg';
import weddingImage from '@/assets/images/services/wedding-silhouette.jpg';
import type { PublicContactDetails } from '@/types/siteSettings';
import { SITE_NAME } from '@/lib/site';
import type { ParishServiceDetail, ServicesPageData } from '@/types/services';

const detail = (label: string, value: string): ParishServiceDetail => ({
  label,
  value,
});

export function buildServicesPageData(
  siteSettings: PublicContactDetails,
): ServicesPageData {
  const phoneCta = {
    label: 'Téléphoner au secrétariat',
    href: siteSettings.phone.href,
  } as const;

  return {
    seo: {
      title: 'Nos services',
      description: `Découvrez les sacrements, les démarches, les services de prière et la location de salle proposés par la ${SITE_NAME}.`,
      canonicalPath: '/nos-services/',
    },
    hero: {
      eyebrow: 'Accueil et accompagnement',
      title: 'Nos services',
      introduction:
        'Des premiers repères pour préparer un sacrement, demander un document, confier une intention ou communiquer avec la paroisse.',
      images: [
        {
          image: baptismImage,
          alt: 'Geste de baptême photographié dans une autre communauté; image d’illustration',
          documentary: false,
          credit:
            'Image : auteur indiqué « 664072 » dans le fichier, provenance Pixabay déclarée par l’utilisateur; page source exacte à archiver.',
          objectPosition: 'center 55%',
          frame: 'landscape',
          label: 'Le baptême',
        },
        {
          image: weddingImage,
          alt: 'Silhouette en noir et blanc d’un couple marié; image d’illustration',
          documentary: false,
          credit:
            'Image : Pexels, provenance Pixabay identifiée par le fichier; licence et page source archivées dans l’inventaire.',
          objectPosition: 'center 52%',
          frame: 'portrait-offset',
          label: 'Le mariage',
        },
        {
          image: communionImage,
          alt: 'Enfant tenant un cierge lors d’une première communion; image d’illustration',
          documentary: false,
          credit:
            'Image : Tobias C. Wahl, provenance Pixabay identifiée par le fichier; licence et page source archivées dans l’inventaire.',
          objectPosition: 'center 52%',
          frame: 'landscape',
          label: 'La première communion',
        },
      ],
    },
    notice: {
      title: 'Des informations à vérifier avant votre démarche',
      message:
        'Les tarifs et échéances ci-dessous sont ceux publiés pour 2026 sur le site actuel et peuvent changer. Le secrétariat confirme toujours les documents, les dates, les disponibilités et le montant applicable.',
      reviewDate: 'Dernière révision éditoriale : 27 juillet 2026',
    },
    chapters: [
      {
        id: 'sacrements-et-initiation',
        eyebrow: 'Célébrer et cheminer',
        title: 'Sacrements et initiation chrétienne',
        introduction:
          'Chaque démarche commence par un échange avec le secrétariat afin de confirmer la préparation, les documents et les dates.',
        surface: 'ivory',
        image: {
          image: iconImage,
          alt: 'Reproduction de l’icône de Notre-Dame du Perpétuel Secours, utilisée comme œuvre d’illustration',
          documentary: false,
          credit:
            'Image : teotea, Pixabay — licence de la source vérifiée; attribution à conserver dans l’inventaire.',
          objectPosition: 'center',
          frame: 'portrait-offset',
        },
        services: [
          {
            id: 'mariage',
            title: 'Mariage',
            summary:
              'La date est confirmée avec le prêtre après un premier rendez-vous. Une préparation au mariage reconnue par la paroisse est requise.',
            active: true,
            details: [
              detail(
                'Délai publié',
                'Prévoir au moins six mois entre la première rencontre et le mariage.',
              ),
              detail(
                'Tarif 2026',
                '400 $ pour la cérémonie ou la messe; chantre et musicien non inclus.',
              ),
            ],
            steps: [
              'Communiquer avec le secrétariat pour un premier rendez-vous avec le prêtre.',
              'Suivre une préparation au mariage reconnue par la paroisse.',
              'Faire confirmer les documents requis et toute autorisation territoriale.',
              'Prévoir une seconde rencontre et une pratique selon les indications reçues.',
            ],
            cta: phoneCta,
          },
          {
            id: 'bapteme',
            title: 'Baptême',
            summary:
              'La préparation comprend un échange documentaire et une rencontre collective avant la célébration.',
            active: true,
            details: [
              detail('Horaire publié', 'Deuxième dimanche du mois à 14 h.'),
              detail('Rencontre publiée', 'Mardi précédant le baptême à 18 h.'),
              detail(
                'Contribution',
                'Aucun frais fixe publié; une offrande est suggérée.',
              ),
            ],
            steps: [
              'Demander au secrétariat le document de préparation.',
              'Faire confirmer les certificats requis pour l’enfant, le parrain et la marraine.',
              'Prendre rendez-vous une fois les documents rassemblés.',
            ],
            cta: phoneCta,
          },
          {
            id: 'catechese',
            title: 'Première communion, confirmation et catéchuménat',
            summary:
              'Les parcours concernent les jeunes qui se préparent à la communion ou à la confirmation ainsi que les adultes non baptisés qui entreprennent un catéchuménat.',
            active: true,
            details: [
              detail('Période publiée', 'De septembre 2026 à mai 2027.'),
              detail(
                'Inscriptions publiées',
                '12 et 19 août 2026, de 9 h à 17 h, au secrétariat.',
              ),
              detail(
                'Frais publiés',
                '80 $ non remboursables, payables en argent comptant ou par virement Interac.',
              ),
            ],
            note: 'Les critères d’âge, le dossier précis et les responsables doivent être reconfirmés avant l’inscription.',
            cta: phoneCta,
          },
        ],
      },
      {
        id: 'accompagnement-et-documents',
        eyebrow: 'Présence pastorale',
        title: 'Accompagnement et documents',
        introduction:
          'Le secrétariat oriente les familles et vérifie la disponibilité des registres ou des célébrations.',
        surface: 'paper',
        services: [
          {
            id: 'funerailles',
            title: 'Funérailles',
            summary:
              'La paroisse accompagne les familles dans la préparation d’une célébration funéraire et convient de la date directement avec elles.',
            active: true,
            details: [
              detail('Tarif 2026', '350 $; chantre et musicien en supplément.'),
            ],
            cta: phoneCta,
          },
          {
            id: 'certificats',
            title: 'Demandes de certificats',
            summary:
              'Les demandes de certificats de baptême, de confirmation ou de mariage sont traitées par le secrétariat.',
            active: true,
            details: [
              detail(
                'Tarif 2026',
                '20 $ par document, plus 2 $ de frais de poste lorsque applicable.',
              ),
            ],
            cta: phoneCta,
          },
        ],
      },
      {
        id: 'priere-et-memoire',
        eyebrow: 'Prière et mémoire',
        title: 'Intentions, lampions et célébrations',
        introduction:
          'Ces demandes sont inscrites auprès du secrétariat. Une date ou une célébration spéciale demeure toujours à confirmer.',
        surface: 'charcoal',
        image: {
          image: candlesImage,
          alt: 'Lampions allumés dans un espace sombre; photographie d’illustration ne montrant pas la paroisse',
          documentary: false,
          credit:
            'Image : Robert Cheaib, provenance Pixabay indiquée par le fichier; page source exacte à archiver.',
          objectPosition: 'center 54%',
          frame: 'organic',
        },
        services: [
          {
            id: 'messes-annoncees',
            title: 'Messes annoncées',
            summary:
              'Une intention peut être confiée pour une messe annoncée, selon les disponibilités communiquées par le secrétariat.',
            active: true,
            details: [detail('Tarif 2026', '15 $ par messe annoncée.')],
            cta: phoneCta,
          },
          {
            id: 'lampions',
            title: 'Lampions et lampe du sanctuaire',
            summary:
              'Un lampion ou une lampe du sanctuaire peut accompagner une intention de prière.',
            active: true,
            details: [
              detail('Tarif 2026', '5 $ par lampion.'),
              detail('Tarif 2026', '5 $ pour une lampe du sanctuaire.'),
            ],
            cta: phoneCta,
          },
          {
            id: 'messes-commemoratives',
            title: 'Messes commémoratives et anniversaires',
            summary:
              'Une célébration peut être demandée à la mémoire d’une personne, sous réserve de la date convenue avec la paroisse.',
            active: true,
            details: [detail('Tarif 2026', '150 $, sans musicien ni chantre.')],
            cta: phoneCta,
          },
          {
            id: 'celebrations-speciales',
            title: 'Célébrations spéciales',
            summary:
              'Le site actuel annonce une commémoration des défunts le 2 novembre et une journée de prière pour les personnes malades le 11 février.',
            active: true,
            details: [
              detail(
                'Inscriptions publiées',
                '20 $ pour cinq noms, puis 5 $ par nom supplémentaire.',
              ),
            ],
            note: 'Les dates, le déroulement et l’ouverture des inscriptions doivent être confirmés pour chaque occurrence.',
            cta: phoneCta,
          },
        ],
      },
      {
        id: 'location-de-salle',
        eyebrow: 'Accueil',
        title: 'Location de salle',
        introduction:
          'La disponibilité est vérifiée manuellement afin d’éviter toute promesse de réservation qui ne pourrait pas être tenue.',
        surface: 'burgundy',
        services: [
          {
            id: 'demande-location',
            title: 'Une demande traitée avec le secrétariat',
            summary:
              'Une salle peut être offerte sur demande. Le secrétariat communique les tarifs et les disponibilités, confirme la réservation directement avec la personne et remet le contrat à signer le jour de la réservation.',
            active: true,
            details: [
              detail(
                'Disponibilité',
                'Communiquée directement par le secrétariat; aucun calendrier public automatique.',
              ),
              detail('Réservation', 'Confirmée directement avec la paroisse.'),
              detail('Contrat', 'Remis et signé le jour de la réservation.'),
            ],
            note: 'Aucune capacité, aucun tarif, aucun équipement ni aucune heure disponible ne sont publiés avant confirmation.',
            cta: phoneCta,
          },
        ],
      },
    ],
    paymentMethods: {
      title: 'Modes de paiement publiés',
      description:
        'Le site actuel mentionne ces modes pour les démarches admissibles. Le secrétariat confirme le mode applicable à chaque demande.',
      methods: ['Argent comptant', 'Chèque', 'Virement Interac'],
    },
    finalCta: {
      title: 'Parler de votre démarche',
      description:
        'Pour faire confirmer un tarif, un document, une date ou une disponibilité, téléphonez directement au secrétariat.',
      primary: phoneCta,
      phone: siteSettings.phone,
    },
  } as const satisfies ServicesPageData;
}
