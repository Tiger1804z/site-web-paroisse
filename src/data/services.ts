import type { PublicContactDetails } from '@/types/siteSettings';
import { SITE_NAME } from '@/lib/site';
import type { ParishServiceDetail, ServicesPageData } from '@/types/services';

const detail = (label: string, value: string): ParishServiceDetail => ({
  label,
  value,
});

/**
 * La location de salle n'est plus ici.
 *
 * Elle a quitté cette page le 3 septembre 2026 pour `/location-de-salle/`, qui
 * a son onglet et son document Sanity. Ce n'est pas un déménagement de confort :
 * la section publiait deux salles, deux capacités et deux tarifs dans la valeur
 * d'un seul champ, au bas d'une page qu'on ouvre pour préparer un baptême. Voir
 * `src/data/roomRental.ts`.
 */
export function buildServicesPageData(
  siteSettings: PublicContactDetails,
): ServicesPageData {
  // Chaque service renvoyait vers un appel d'un seul geste. Le secrétariat
  // reçoit ces appels à domicile, à toute heure : le bouton mène désormais aux
  // coordonnées, où le numéro figure avec les heures d'ouverture.
  const secretariatCta = {
    label: 'Contacter le secrétariat',
    href: '/contact/',
  } as const;

  return {
    seo: {
      title: 'Nos services',
      description: `Découvrez les sacrements, les démarches et les services de prière proposés par la ${SITE_NAME}.`,
    },
    hero: {
      eyebrow: 'Accueil et accompagnement',
      title: 'Nos services',
      introduction:
        'Des premiers repères pour préparer un sacrement, demander un document, confier une intention ou communiquer avec la paroisse.',
      slides: [],
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
            cta: secretariatCta,
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
            cta: secretariatCta,
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
            cta: secretariatCta,
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
            cta: secretariatCta,
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
            cta: secretariatCta,
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
        services: [
          {
            id: 'messes-annoncees',
            title: 'Messes annoncées',
            summary:
              'Une intention peut être confiée pour une messe annoncée, selon les disponibilités communiquées par le secrétariat.',
            active: true,
            details: [detail('Tarif 2026', '15 $ par messe annoncée.')],
            cta: secretariatCta,
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
            cta: secretariatCta,
          },
          {
            id: 'messes-commemoratives',
            title: 'Messes commémoratives et anniversaires',
            summary:
              'Une célébration peut être demandée à la mémoire d’une personne, sous réserve de la date convenue avec la paroisse.',
            active: true,
            details: [detail('Tarif 2026', '150 $, sans musicien ni chantre.')],
            cta: secretariatCta,
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
            cta: secretariatCta,
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
        'Pour faire confirmer un tarif, un document, une date ou une disponibilité, communiquez avec le secrétariat.',
      primary: secretariatCta,
      phone: { display: siteSettings.phone.display },
    },
  } as const satisfies ServicesPageData;
}
