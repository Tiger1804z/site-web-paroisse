import baptismImage from '@/assets/images/paroisse/autel-fleurs-blanches-01.jpg';
import heroImage from '@/assets/images/paroisse/interieur-eglise-decor-violet-01.jpg';
import { SITE_NAME } from '@/lib/site';
import type { SacramentsPageData } from '@/types/sacraments';

const contactCta = {
  label: 'Communiquer avec le secrétariat',
  href: '/contact/',
} as const;

export const sacramentsPageData = {
  seo: {
    title: 'Sacrements et services',
    description: `Découvrez les sacrements, les services et les démarches proposées par la ${SITE_NAME}.`,
  },
  hero: {
    eyebrow: 'Foi et vie',
    title: 'Sacrements et services',
    introduction:
      'Découvrez les démarches offertes par la paroisse et les premières étapes pour préparer une célébration ou obtenir un document.',
    image: {
      image: heroImage,
      alt: 'Vue frontale de l’autel, du crucifix et du puits de lumière dans l’église',
      desktopPosition: 'center 52%',
      mobilePosition: '50% center',
    },
  },
  notice: {
    title: 'Démarches auprès du secrétariat',
    message:
      'Les procédures, délais, tarifs et documents requis doivent être confirmés directement avec la paroisse avant d’entreprendre une démarche.',
    active: true,
    primaryCta: contactCta,
  },
  overview: {
    items: [
      {
        kind: 'sacrament',
        id: 'bapteme',
        slug: 'bapteme',
        tabLabel: 'Baptême',
        eyebrow: 'Sacrement',
        title: 'Le baptême',
        summary:
          'Pour entreprendre une démarche de baptême, communiquez avec le secrétariat afin de connaître les étapes, les rencontres et les documents correspondant à votre situation.',
        status: 'to-confirm',
        detailPageAvailable: false,
        image: {
          image: baptismImage,
          alt: 'Autel entouré de fleurs blanches sous le crucifix et le puits de lumière',
          desktopPosition: 'center center',
          mobilePosition: 'center 42%',
        },
        information: {
          title: 'Informations à confirmer',
          items: [
            '[DOCUMENTS À CONFIRMER]',
            '[DÉLAI À CONFIRMER]',
            '[PROCÉDURE À CONFIRMER]',
          ],
        },
        notice: {
          title: 'Avant d’entreprendre la démarche',
          message:
            'Le secrétariat pourra préciser la préparation, les disponibilités et les modalités applicables.',
        },
        primaryCta: contactCta,
      },
      {
        kind: 'sacrament',
        id: 'mariage',
        slug: 'mariage',
        tabLabel: 'Mariage',
        eyebrow: 'Sacrement',
        title: 'Le mariage',
        summary:
          'Les couples qui souhaitent célébrer leur mariage à la paroisse sont invités à communiquer avec le secrétariat afin de recevoir les renseignements adaptés à leur démarche.',
        status: 'to-confirm',
        detailPageAvailable: false,
        image: {
          image: heroImage,
          alt: 'Vue large et symétrique de l’autel et de l’architecture intérieure',
          desktopPosition: 'center center',
          mobilePosition: 'center 45%',
        },
        information: {
          title: 'Informations à confirmer',
          items: [
            '[DOCUMENTS À CONFIRMER]',
            '[DÉLAI À CONFIRMER]',
            '[PROCÉDURE À CONFIRMER]',
          ],
        },
        notice: {
          title: 'Disponibilité à confirmer',
          message:
            'Aucune date, condition ou disponibilité n’est confirmée avant un échange avec le secrétariat.',
        },
        primaryCta: contactCta,
      },
      {
        kind: 'services',
        id: 'autres-demandes',
        tabLabel: 'Autres demandes',
        eyebrow: 'Sacrements et services',
        title: 'Autres démarches',
        summary:
          'Le secrétariat peut vous orienter vers la démarche appropriée. Les services actuellement offerts et leurs modalités doivent être confirmés.',
        services: [
          {
            id: 'communion-confirmation',
            slug: 'communion-confirmation',
            title: 'Première communion et confirmation',
            summary:
              'Les parcours, périodes d’inscription, documents et critères doivent être validés auprès de la paroisse.',
            status: 'to-confirm',
            detailPageAvailable: false,
          },
          {
            id: 'catechumenat',
            slug: 'catechumenat',
            title: 'Catéchuménat',
            summary:
              'Une personne qui souhaite entreprendre une démarche peut communiquer avec le secrétariat pour connaître l’accompagnement actuellement proposé.',
            status: 'to-confirm',
            detailPageAvailable: false,
          },
          {
            id: 'funerailles',
            slug: 'funerailles',
            title: 'Funérailles',
            summary:
              'La paroisse peut accompagner les familles dans la préparation d’une célébration funéraire; les modalités restent à confirmer.',
            status: 'to-confirm',
            detailPageAvailable: false,
          },
          {
            id: 'demande-certificat',
            slug: 'demande-certificat',
            title: 'Demande de certificat',
            summary:
              'Communiquez avec le secrétariat afin de vérifier les documents disponibles, les renseignements requis et les délais applicables.',
            status: 'volatile',
            detailPageAvailable: false,
          },
          {
            id: 'messes-annoncees-commemoratives',
            slug: 'messes-annoncees-commemoratives',
            title: 'Messes annoncées et commémoratives',
            summary:
              'La disponibilité de ces demandes, leurs modalités et toute contribution applicable doivent être confirmées.',
            status: 'volatile',
            detailPageAvailable: false,
          },
        ],
        primaryCta: contactCta,
      },
    ],
  },
  generalProcess: {
    eyebrow: 'Démarche',
    title: 'Le processus étape par étape',
    introduction:
      'Ces repères sont généraux; le secrétariat confirmera le parcours correspondant à votre situation.',
    steps: [
      {
        id: 'choisir-demarche',
        numberLabel: '1',
        title: 'Choisir la démarche',
        description:
          'Repérez le sacrement ou le service qui correspond le mieux à votre demande.',
      },
      {
        id: 'communiquer',
        numberLabel: '2',
        title: 'Communiquer avec le secrétariat',
        description:
          'Présentez votre demande afin d’être orienté vers les prochaines étapes.',
      },
      {
        id: 'recevoir-informations',
        numberLabel: '3',
        title: 'Recevoir les informations',
        description:
          'Le secrétariat précisera les modalités, délais et documents applicables.',
      },
      {
        id: 'preparer-elements',
        numberLabel: '4',
        title: 'Préparer les éléments confirmés',
        description:
          'Rassemblez seulement les renseignements ou documents qui vous auront été demandés.',
      },
      {
        id: 'confirmer-suite',
        numberLabel: '5',
        title: 'Confirmer la suite',
        description:
          'Les rencontres, dates et autres modalités sont convenues directement avec la paroisse.',
      },
    ],
    primaryCta: contactCta,
  },
  faq: {
    title: 'Questions fréquentes',
    items: [
      {
        id: 'delai',
        question: 'Combien de temps à l’avance faut-il commencer?',
        answer:
          'Aucun délai unique n’est publié pour le moment. Communiquez avec le secrétariat dès que possible afin de vérifier le délai correspondant à votre démarche.',
      },
      {
        id: 'documents',
        question: 'Quels documents dois-je préparer?',
        answer:
          'La liste varie selon la démarche et doit être confirmée. Le secrétariat vous indiquera les documents applicables à votre situation.',
      },
      {
        id: 'disponibilite',
        question: 'Puis-je choisir immédiatement une date?',
        answer:
          'Non. Toute date ou disponibilité doit être vérifiée et confirmée directement avec la paroisse.',
      },
    ],
  },
} as const satisfies SacramentsPageData;
