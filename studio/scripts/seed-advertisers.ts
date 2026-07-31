/**
 * Saisie initiale de la page Nos annonceurs et des quatre fiches historiques.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-advertisers.ts --with-user-token
 *
 * Le script vit ici et non dans `scripts/` à la racine : `sanity exec` résout
 * ses dépendances depuis le dossier du Studio. Il compile en CJS, donc pas de
 * `await` au premier niveau — d'où le `main()`.
 *
 * `createOrReplace` sur des identifiants fixes le rend rejouable, mais il écrase
 * ce qui s'y trouve : ne pas le relancer une fois que la paroisse a commencé à
 * éditer.
 *
 * Les quatre fiches sont écrites en `active` : elles figurent encore sur
 * l'ancien site de la paroisse, donc les publier ici est la continuité de ce qui
 * est déjà en ligne, pas une divulgation nouvelle. La secrétaire retire une
 * fiche en la passant à « Inactif », sans changement de code — ce qui reste à
 * vérifier pour chacune est dans sa note de révision.
 *
 * Aucun portrait historique n'est téléversé : leurs droits ne sont pas
 * documentés, voir `docs/ADVERTISERS_CONTENT_AUDIT.md`.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

type SeedAdvertiser = {
  _id: string
  name: string
  category: string
  description?: string
  addressLines: string[]
  phone: string
  email: string
  website?: string
  order: number
  confirmationNote: string
}

const ADVERTISERS: SeedAdvertiser[] = [
  {
    _id: 'advertiser-buffet-marina',
    name: 'Buffet Marina',
    category: 'Réception et service traiteur',
    description:
      'Réceptions, mariages, cocktails et fêtes d’anniversaire : cuisine, service et tables pour vos événements.',
    addressLines: ['4397, rue Denis-Papin', 'Montréal, Québec'],
    phone: '514 728-4345',
    email: 'info@buffetmarina.com',
    website: 'https://www.buffetmarina.com/',
    order: 1,
    confirmationNote:
      'Confirmer l’entente active, les coordonnées, le texte et obtenir un logo officiel après le retour de la secrétaire.',
  },
  {
    _id: 'advertiser-frantz-benjamin',
    name: 'Frantz Benjamin',
    category: 'Député de Viau — Assemblée nationale du Québec',
    addressLines: ['3333, rue Jarry Est, bureau 202', 'Montréal, Québec H1Z 2E5'],
    phone: '514 728-2474',
    email: 'Frantz.Benjamin.viau@assnat.qc.ca',
    order: 2,
    confirmationNote:
      'Coordonnées lues dans une image historique. Confirmer le mandat, l’entente, les données et les droits du portrait avant toute publication.',
  },
  {
    _id: 'advertiser-josue-corvil',
    name: 'Josué Corvil',
    category: 'Conseiller de la Ville — district de Saint-Michel',
    addressLines: ['405, avenue Ogilvy', 'Montréal, Québec H3N 1M3'],
    phone: '514 872-7800',
    email: 'josue.corvil@montreal.ca',
    order: 3,
    confirmationNote:
      'Coordonnées lues dans une image historique. Confirmer le mandat, l’entente, les données et les droits du portrait avant toute publication.',
  },
  {
    _id: 'advertiser-patricia-lattanzio',
    name: 'Patricia Lattanzio',
    category: 'Députée de Saint-Léonard–Saint-Michel — Chambre des communes',
    addressLines: ['Bureau de circonscription de Saint-Léonard', 'Québec H1R 3Y6'],
    phone: '514 256-4548',
    email: 'Patricia.Lattanzio@parl.gc.ca',
    order: 4,
    confirmationNote:
      'Coordonnées lues dans une image historique incomplète. Confirmer le mandat, l’entente, l’adresse complète et les droits du portrait avant toute publication.',
  },
]

async function main() {
  for (const advertiser of ADVERTISERS) {
    await client.createOrReplace({
      _type: 'advertiser',
      status: 'active',
      ...advertiser,
    })
  }

  await client.createOrReplace({
    _id: 'advertisersPage',
    _type: 'advertisersPage',
    hero: {
      eyebrow: 'Soutenir notre mission',
      title: 'Nos annonceurs',
      introduction:
        'Un espace de reconnaissance pour les commerces, organisations et personnes dont la contribution publicitaire soutient les communications de la paroisse.',
    },
    introduction: {
      eyebrow: 'Reconnaissance',
      title: 'Des présences qui contribuent à la vie paroissiale',
      paragraphs: [
        'La publicité diffusée dans les communications paroissiales peut procurer un soutien financier à la mission de la paroisse tout en donnant une visibilité locale aux annonceurs.',
        'Les présences reprises ici sont celles que la paroisse publiait déjà. Une entreprise ou une personne qui souhaite corriger ses coordonnées, modifier son texte ou se retirer de cette page peut écrire au secrétariat en tout temps.',
      ],
      disclosure:
        'Une présence sur cette page constitue un placement publicitaire; elle ne représente pas une recommandation ni une garantie des services offerts.',
    },
    solicitation: {
      eyebrow: 'Devenir annonceur',
      title: 'Soutenir la paroisse par une présence publicitaire',
      description:
        'Un espace publicitaire peut être offert dans les communications paroissiales, selon les supports, disponibilités et modalités confirmés par le secrétariat.',
      details: [
        'Les formats, périodes et conditions sont communiqués directement par la paroisse.',
        'Aucun tarif ni espace disponible n’est annoncé en temps réel sur le site.',
      ],
      phoneLabel: 'Téléphoner au secrétariat',
      contactLabel: 'Voir nos coordonnées',
    },
    settings: {
      showAdvertisers: true,
      showSolicitation: true,
    },
  })

  console.log(`${ADVERTISERS.length} annonceurs et la page écrits dans Sanity.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
