/**
 * Saisie initiale des textes de la page d'accueil.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-home-page.ts --with-user-token
 *
 * Le script vit ici et non dans `scripts/` à la racine : `sanity exec` résout
 * ses dépendances depuis le dossier du Studio. Il compile en CJS, donc pas de
 * `await` au premier niveau — d'où le `main()`.
 *
 * **`patch`, pas `createOrReplace`** : le document `homePage` existe déjà et
 * porte les réglages de la section des activités, saisis par la paroisse le
 * 30 juillet 2026. Un `createOrReplace` les effacerait sans le dire. Le patch
 * n'écrit que les sections ajoutées par cette migration.
 *
 * `setIfMissing` : relancer le script ne réécrit pas par-dessus ce que la
 * paroisse aurait corrigé entre-temps. Pour forcer une remise à l'état d'ici,
 * vider la section dans le Studio d'abord.
 *
 * Les textes repris sont mot pour mot ceux qu'affichaient les composants avant
 * la migration — aucune réécriture éditoriale n'est faite en passant.
 */
import {createReadStream} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

/**
 * Les fichiers sont lus depuis le dépôt, à côté du Studio. Le script doit donc
 * être lancé depuis `studio/` — c'est déjà ce qu'exige `sanity exec`.
 *
 * Sanity dédoublonne les fichiers par empreinte : relancer le script ne crée
 * pas six copies dans la bibliothèque.
 */
const IMAGES_DIRECTORY = resolve(process.cwd(), '../src/assets/images/paroisse')

/**
 * Crédit repris tel quel de l'ancien fichier de données.
 *
 * Il reste à corriger : les photographies de l'église ont été prises par une
 * personne nommée, et la note de droits réclame son nom. Le champ est
 * maintenant modifiable dans le Studio — c'est tout l'objet de la migration.
 */
const PHOTO_CREDIT = 'Fichiers photographiques fournis avec le projet Saint-René-Goupil'

const RIGHTS_NOTE =
  'Fichier fourni avec le projet. Crédit à préciser au nom de la photographe avant diffusion externe.'

type SeedPhoto = {
  file: string
  title: string
  description: string
  alt: string
  /** Point focal, en fractions. Reprend le recadrage réglé à la main en CSS. */
  hotspot?: {x: number; y: number}
}

const PHOTOS: SeedPhoto[] = [
  {
    file: 'autel-decor-rouge-01.jpg',
    title: 'L’autel en rouge',
    description: 'Vue large de l’autel, des fleurs et des éléments textiles rouges.',
    alt: 'Vue intérieure de l’autel avec des fleurs et une décoration rouge',
  },
  {
    file: 'eglise-exterieur-clochers-01.webp',
    title: 'Les clochers',
    description: 'Vue extérieure de l’église et des structures verticales portant les cloches.',
    alt: 'Vue extérieure de l’église et des structures portant les cloches',
    // Était écrit « 38% center » dans le code; devient le point focal du Studio.
    hotspot: {x: 0.38, y: 0.5},
  },
  {
    file: 'croix-verre-entree-01.webp',
    title: 'La croix de verre',
    description: 'Détail architectural du verre coloré intégré à la paroi de béton.',
    alt: 'Croix composée de verre coloré intégrée à une paroi de béton',
  },
  {
    file: 'autel-fleurs-blanches-01.jpg',
    title: 'Fleurs blanches',
    description: 'L’autel entouré de fleurs blanches sous un éclairage intérieur doux.',
    alt: 'Vue intérieure de l’autel entouré de fleurs blanches',
  },
  {
    file: 'interieur-eglise-decoration-01.webp',
    title: 'Décor liturgique',
    description: 'Cadrage vertical de l’autel, des fleurs et des textiles liturgiques.',
    alt: 'Vue verticale de l’autel avec des fleurs et une décoration liturgique',
  },
  {
    file: 'eglise-exterieur-identification-01.webp',
    title: 'Le bâtiment paroissial',
    description: 'Vue extérieure du bâtiment où l’identification de la paroisse est visible.',
    alt: 'Vue extérieure du bâtiment et de l’identification de la paroisse',
  },
]

async function uploadPhotos() {
  const photos = []

  for (const [index, photo] of PHOTOS.entries()) {
    const asset = await client.assets.upload(
      'image',
      createReadStream(resolve(IMAGES_DIRECTORY, photo.file)),
      {filename: photo.file},
    )

    photos.push({
      _type: 'galleryPhoto',
      _key: `photo-${index + 1}`,
      title: photo.title,
      description: photo.description,
      // Les six photographies figurent déjà sur le site : les reprendre est la
      // continuité de ce qui est en ligne, pas une publication nouvelle.
      rightsCleared: true,
      consentConfirmed: false,
      photo: {
        _type: 'eventImage',
        alt: photo.alt,
        credit: PHOTO_CREDIT,
        rightsNote: RIGHTS_NOTE,
        containsRecognizablePeople: false,
        generatedByAi: false,
        image: {
          _type: 'image',
          asset: {_type: 'reference', _ref: asset._id},
          ...(photo.hotspot ? {hotspot: {...photo.hotspot, height: 1, width: 1}} : {}),
        },
      },
    })
  }

  return photos
}

const HOME_PAGE_SECTIONS = {
  hero: {
    script: 'Bienvenue',
    titleLines: ['Un lieu de foi,', 'de paix et', 'de rencontre.'],
    introduction:
      'Bienvenue à la Paroisse Saint-René-Goupil. Découvrez nos célébrations, nos activités et la vie de notre communauté.',
    primaryCtaLabel: 'Voir les horaires',
    secondaryCtaLabel: 'Découvrir la paroisse',
    scheduleTitle: 'Horaires des messes',
    scheduleLinkLabel: 'Consulter tous les horaires',
    scheduleNote: 'Horaires sujets à changement lors des célébrations spéciales.',
  },
  welcome: {
    script: 'Ensemble',
    titleLines: ['Une communauté', 'enracinée dans la foi'],
    introduction:
      'Notre paroisse est un lieu de prière, de rencontre et de solidarité, ouvert à toutes les personnes qui souhaitent cheminer dans la foi. Que vous soyez de passage ou enraciné dans le quartier, vous êtes les bienvenus parmi nous.',
    quote: {
      text: '« Là où deux ou trois sont rassemblés en mon nom, je suis au milieu d’eux. »',
      attribution: 'Matthieu 18,20',
    },
    linkLabel: 'En savoir plus sur notre paroisse',
  },
  massPreview: {
    eyebrow: 'Célébrations',
    title: 'Célébrer avec nous',
    introduction:
      'Les horaires ci-dessous peuvent être modifiés lors des fêtes et des célébrations spéciales.',
    ctaLabel: 'Voir tous les horaires',
    specialTitle: 'Célébrations spéciales',
    specialDescription: 'Consultez les annonces récentes avant de vous déplacer.',
  },
  parishLife: {
    eyebrow: 'Communauté',
    title: 'Vivre la paroisse',
    introduction:
      'Des espaces de rencontre, de service et de prière qui prennent vie grâce à l’engagement de la communauté.',
    // Les noms ne sont pas saisis : ils sont lus dans la page Vie paroissiale.
    groups: [
      {
        _type: 'homeGroupTeaser',
        _key: 'jeunes',
        group: 'jeunes',
        teaser: 'Activités et rassemblements pour la jeunesse',
      },
      {
        _type: 'homeGroupTeaser',
        _key: 'chorale',
        group: 'chorale',
        teaser: 'Chant liturgique et animation des célébrations',
      },
      {
        _type: 'homeGroupTeaser',
        _key: 'dames-fils-notre-dame',
        group: 'dames-fils-notre-dame',
        teaser: 'Dévotion mariale et entraide communautaire',
      },
      {
        _type: 'homeGroupTeaser',
        _key: 'marguilliers',
        group: 'marguilliers',
        teaser: 'Conseil de fabrique et gouvernance paroissiale',
      },
    ],
    ctaLabel: 'Découvrir nos groupes',
  },
  services: {
    eyebrow: 'Services paroissiaux',
    title: 'Un accompagnement pour les moments qui comptent',
    introduction:
      'Sacrements, démarches, intentions de messe et accueil des familles : retrouvez les premiers repères avant de communiquer avec le secrétariat.',
    links: [
      {
        _type: 'homeServiceLink',
        _key: 'mariage-bapteme',
        label: 'Mariage et baptême',
        target: 'sacrements-et-initiation',
      },
      {
        _type: 'homeServiceLink',
        _key: 'communion-confirmation',
        label: 'Communion, confirmation et catéchuménat',
        target: 'sacrements-et-initiation',
      },
      {
        _type: 'homeServiceLink',
        _key: 'funerailles-certificats',
        label: 'Funérailles et certificats',
        target: 'accompagnement-et-documents',
      },
      {
        _type: 'homeServiceLink',
        _key: 'messes-lampions',
        label: 'Messes, lampions et intentions',
        target: 'priere-et-memoire',
      },
      {
        _type: 'homeServiceLink',
        _key: 'location-de-salle',
        label: 'Location de salle',
        target: 'location-de-salle',
      },
    ],
    ctaLabel: 'Explorer tous nos services',
    visualNote: 'Accueil · célébration · accompagnement',
    thrift: {
      eyebrow: 'Service communautaire',
      title: 'La friperie',
      description: 'Un lieu de réemploi et d’entraide, présenté dans un espace dédié.',
      linkLabel: 'Découvrir la friperie',
    },
  },
  interlude: {
    eyebrow: 'Prière et recueillement',
    title: 'Une lumière pour accompagner la prière',
    description:
      'Les lampions, les intentions et les messes commémoratives font partie des demandes qui peuvent être adressées au secrétariat. Les modalités et tarifs applicables sont regroupés dans Nos services.',
    linkLabel: 'Découvrir les services de prière',
  },
  visit: {
    eyebrow: 'Nous joindre',
    title: 'Venez nous rencontrer',
    introduction:
      'Une présence accueillante au cœur du quartier. Retrouvez les coordonnées confirmées de la paroisse ou préparez votre demande sur la page Contact.',
    contactCtaLabel: 'Nous joindre',
    directionsCtaLabel: 'Obtenir l’itinéraire',
  },
}

async function main() {
  await client.createIfNotExists({_id: 'homePage', _type: 'homePage'})

  const photos = await uploadPhotos()

  await client
    .patch('homePage')
    .setIfMissing({
      ...HOME_PAGE_SECTIONS,
      gallery: {
        eyebrow: 'Photographie',
        title: 'La paroisse en images',
        photos,
      },
    })
    .commit()

  console.log(
    `Textes de la page d’accueil et ${photos.length} photographies écrits dans Sanity (réglages des activités intacts).`,
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
