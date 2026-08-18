/**
 * Déplace vers Sanity les images éditoriales restées dans le dépôt.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-editorial-images.ts --with-user-token
 *
 * Périmètre : les visuels que la paroisse devrait pouvoir remplacer elle-même.
 * Les images de fond pleine largeur (accueil, horaires, notre paroisse,
 * événements, nos annonceurs) restent des fichiers du projet — ce sont des
 * choix de composition, pas du contenu.
 *
 * Rien n'est inventé ici. Textes alternatifs, crédits et notes de droits sont
 * repris **mot pour mot** de `src/data/*.ts`. Les provenances qui n'étaient pas
 * des attributions confirmées mais des notes de vérification partent dans
 * `rightsNote`, qui n'est jamais rendu : afficher « page source exacte à
 * archiver » sous une photographie serait publier une note interne.
 *
 * `setIfMissing` sur chaque emplacement : rejouable sans écraser ce que la
 * paroisse aurait corrigé. Sanity dédoublonne les fichiers par empreinte, donc
 * relancer le script ne multiplie pas les assets.
 */
import {createReadStream} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const ASSETS_DIRECTORY = resolve(process.cwd(), '../src/assets/images')

type SeedImage = {
  file: string
  alt: string
  /** Attribution publiable telle quelle. Absente tant qu'elle n'est pas confirmée. */
  credit?: string
  /** Note interne de provenance. N'atteint jamais le site. */
  rightsNote?: string
}

type HeroSlideSeed = SeedImage & {key: string; label: string}

async function uploadImage(entry: SeedImage) {
  const asset = await client.assets.upload(
    'image',
    createReadStream(resolve(ASSETS_DIRECTORY, entry.file)),
    {filename: entry.file.split('/').pop()},
  )

  return {
    _type: 'eventImage',
    alt: entry.alt,
    ...(entry.credit ? {credit: entry.credit} : {}),
    ...(entry.rightsNote ? {rightsNote: entry.rightsNote} : {}),
    image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
  }
}

async function uploadSlides(slides: HeroSlideSeed[]) {
  const uploaded = []

  for (const slide of slides) {
    uploaded.push({
      _type: 'heroSlide',
      _key: slide.key,
      label: slide.label,
      visual: await uploadImage(slide),
    })
  }

  return uploaded
}

// --- /nos-services ---------------------------------------------------------

const SERVICES_SLIDES: HeroSlideSeed[] = [
  {
    key: 'bapteme',
    label: 'Le baptême',
    file: 'services/baptism-ceremony.jpg',
    alt: 'Geste de baptême photographié dans une autre communauté; image d’illustration',
    rightsNote:
      'Image : auteur indiqué « 664072 » dans le fichier, provenance Pixabay déclarée par l’utilisateur; page source exacte à archiver.',
  },
  {
    key: 'mariage',
    label: 'Le mariage',
    file: 'services/wedding-silhouette.jpg',
    alt: 'Silhouette en noir et blanc d’un couple marié; image d’illustration',
    rightsNote:
      'Image : Pexels, provenance Pixabay identifiée par le fichier; licence et page source archivées dans l’inventaire.',
  },
  {
    key: 'premiere-communion',
    label: 'La première communion',
    file: 'services/first-communion-candle.jpg',
    alt: 'Enfant tenant un cierge lors d’une première communion; image d’illustration',
    rightsNote:
      'Image : Tobias C. Wahl, provenance Pixabay identifiée par le fichier; licence et page source archivées dans l’inventaire.',
  },
]

const SERVICES_CHAPTER_IMAGES: Record<string, SeedImage> = {
  'sacrements-et-initiation': {
    file: 'home/editorial/mother-of-perpetual-help-icon.jpg',
    alt: 'Reproduction de l’icône de Notre-Dame du Perpétuel Secours, utilisée comme œuvre d’illustration',
    rightsNote:
      'Image : teotea, Pixabay — licence de la source vérifiée; attribution à conserver dans l’inventaire.',
  },
  'priere-et-memoire': {
    file: 'home/editorial/candles-prayer.jpg',
    alt: 'Lampions allumés dans un espace sombre; photographie d’illustration ne montrant pas la paroisse',
    rightsNote:
      'Image : Robert Cheaib, provenance Pixabay indiquée par le fichier; page source exacte à archiver.',
  },
}

// --- /friperie -------------------------------------------------------------

const THRIFT_SOURCE_NOTE = (id: string) =>
  `Pixabay, image ${id}, Content License — usage commercial autorisé sans attribution. Visuel thématique : ne montre pas le local paroissial.`

const THRIFT_SLIDES: HeroSlideSeed[] = [
  {
    key: 'portants',
    label: 'Des vêtements pour tous',
    file: 'thrift-store/hoodies-rack-pixabay.jpg',
    alt: 'Chandails à capuchon de plusieurs couleurs alignés sur un portant',
    credit: 'jarmoluk (Pixabay)',
    rightsNote: THRIFT_SOURCE_NOTE('428607'),
  },
  {
    key: 'laine',
    label: 'De petits articles pour la maison',
    file: 'thrift-store/yarn-ball-pixabay.jpg',
    alt: 'Pelote de laine grise posée près de bobines de fil sombre',
    credit: 'StockSnap (Pixabay)',
    rightsNote: THRIFT_SOURCE_NOTE('2583976'),
  },
  {
    key: 'bottes',
    label: 'Se vêtir pour la saison',
    file: 'thrift-store/winter-boots-pixabay.jpg',
    alt: 'Bottes d’hiver en cuir beige portées avec un jean',
    credit: 'StockSnap (Pixabay)',
    rightsNote: THRIFT_SOURCE_NOTE('2587909'),
  },
]

// --- /notre-paroisse -------------------------------------------------------

const ARCHITECTURE_IMAGE: SeedImage = {
  file: 'paroisse/nef-vue-generale-02.webp',
  alt: 'Vue intérieure de l’autel, des murs de brique, des poutres de bois et des puits de lumière',
  rightsNote:
    'Photographie de l’église Saint-René-Goupil. Crédit photographique à confirmer auprès de la paroisse.',
}

// --- accueil ---------------------------------------------------------------

const HOME_IMAGES: Record<string, SeedImage> = {
  parishLife: {
    file: 'home/editorial/parish-life-marian-artwork.jpg',
    alt: 'Illustration à l’aquarelle d’une femme au voile bleu, les yeux baissés, auréolée de lumière',
    rightsNote:
      'Œuvre d’illustration. Provenance et statut de génération à confirmer avant publication d’un crédit.',
  },
  services: {
    file: 'home/editorial/church-facade-editorial.jpg',
    alt: 'Détail architectural de la façade de Santa Maria del Fiore à Florence, utilisé comme illustration',
    rightsNote:
      'Illustration : ne montre pas l’église Saint-René-Goupil. Provenance à confirmer avant publication d’un crédit.',
  },
  interlude: {
    file: 'home/editorial/candles-prayer.jpg',
    alt: 'Lampions allumés dans un espace sombre; photographie d’illustration ne montrant pas la paroisse',
    rightsNote:
      'Image : Robert Cheaib, provenance Pixabay indiquée par le fichier; page source exacte à archiver.',
  },
  visit: {
    file: 'paroisse/eglise-exterieur-identification-01.webp',
    alt: 'Vue extérieure du bâtiment portant l’identification de la paroisse',
    rightsNote:
      'Photographie de l’église Saint-René-Goupil. Crédit photographique à confirmer auprès de la paroisse.',
  },
}

async function main() {
  // --- /nos-services -------------------------------------------------------
  const servicesPage = await client.getDocument('servicesPage')
  if (!servicesPage) throw new Error('Document servicesPage introuvable.')

  await client
    .patch('servicesPage')
    .setIfMissing({'hero.slides': await uploadSlides(SERVICES_SLIDES)})
    .commit()

  const chapters = (servicesPage.chapters ?? []) as {
    _key: string
    slug?: {current?: string}
    image?: unknown
  }[]

  for (const chapter of chapters) {
    const seed = SERVICES_CHAPTER_IMAGES[chapter.slug?.current ?? '']
    if (!seed || chapter.image) continue

    await client
      .patch('servicesPage')
      .set({[`chapters[_key=="${chapter._key}"].image`]: await uploadImage(seed)})
      .commit()
  }

  // --- /friperie -----------------------------------------------------------
  await client
    .patch('thriftStorePage')
    .setIfMissing({'hero.slides': await uploadSlides(THRIFT_SLIDES)})
    .commit()

  // --- /notre-paroisse -----------------------------------------------------
  await client
    .patch('aboutPage')
    .setIfMissing({
      'architecture.image': await uploadImage(ARCHITECTURE_IMAGE),
      'architecture.imageCaption': 'Bois, brique et béton autour d’un chœur éclairé.',
    })
    .commit()

  // --- accueil -------------------------------------------------------------
  for (const [section, seed] of Object.entries(HOME_IMAGES)) {
    await client
      .patch('homePage')
      .setIfMissing({[`${section}.image`]: await uploadImage(seed)})
      .commit()
  }

  console.log('Images éditoriales déplacées vers Sanity.')
  console.log(
    'La galerie de la friperie reste volontairement vide : elle attend de vraies photographies du local.',
  )
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
