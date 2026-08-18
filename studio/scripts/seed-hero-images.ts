/**
 * Déplace vers Sanity les six dernières images de premier écran.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-hero-images.ts --with-user-token
 *
 * Après ce script, plus aucune image visible du site public n'est un fichier du
 * dépôt. Ne restent locaux que le logo de la paroisse — un élément de marque —
 * et l'image de `/verification`, page interne de démonstration du système de
 * design, interdite d'indexation.
 *
 * Textes alternatifs repris mot pour mot de `src/data/*.ts` et des composants.
 * Les cadrages écrits à la main (`center 46%`, `center 42%`…) ne sont pas
 * repris : le point focal de l'image, posé dans le Studio, les remplace et suit
 * l'image quelle que soit la forme du cadre.
 *
 * `setIfMissing` : rejouable sans écraser ce que la paroisse aurait corrigé.
 */
import {createReadStream} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const ASSETS_DIRECTORY = resolve(process.cwd(), '../src/assets/images')

const PARISH_PHOTO_NOTE =
  'Photographie de l’église Saint-René-Goupil. Crédit photographique à confirmer auprès de la paroisse.'

type SeedImage = {file: string; alt: string; rightsNote: string}
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
    rightsNote: entry.rightsNote,
    image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
  }
}

/** Les trois vues de l'autel qui défilent sur l'accueil. */
const HOME_SLIDES: HeroSlideSeed[] = [
  {
    key: 'autel-rouge',
    label: 'Autel avec décoration rouge',
    file: 'paroisse/autel-decor-rouge-01.jpg',
    alt: 'Vue intérieure symétrique de l’autel avec une décoration rouge',
    rightsNote: PARISH_PHOTO_NOTE,
  },
  {
    key: 'autel-violet',
    label: 'Autel avec décoration violette',
    file: 'paroisse/interieur-eglise-decor-violet-01.jpg',
    alt: 'Vue intérieure symétrique de l’autel avec une décoration violette',
    rightsNote: PARISH_PHOTO_NOTE,
  },
  {
    key: 'autel-fleurs',
    label: 'Autel entouré de fleurs blanches',
    file: 'paroisse/autel-fleurs-blanches-01.jpg',
    alt: 'Vue intérieure symétrique de l’autel entouré de fleurs blanches',
    rightsNote: PARISH_PHOTO_NOTE,
  },
]

/** Une image de premier écran par page, hors accueil. */
const PAGE_HEROES: Record<string, SeedImage> = {
  schedulePage: {
    file: 'paroisse/autel-decor-rouge-01.jpg',
    alt: 'Vue intérieure symétrique de l’autel avec une décoration rouge',
    rightsNote: PARISH_PHOTO_NOTE,
  },
  aboutPage: {
    file: 'paroisse/eglise-exterieur-identification-01.webp',
    alt: 'Vue extérieure du bâtiment de l’église et de son identification',
    rightsNote: PARISH_PHOTO_NOTE,
  },
  eventsPage: {
    file: 'paroisse/autel-decor-rouge-01.jpg',
    alt: 'Vue de l’autel décoré de fleurs et de tissus rouges dans l’église',
    rightsNote: PARISH_PHOTO_NOTE,
  },
  advertisersPage: {
    file: 'paroisse/eglise-exterieur-clochers-01.webp',
    alt: 'Vue extérieure de la Paroisse Saint-René-Goupil et de ses clochers',
    rightsNote: PARISH_PHOTO_NOTE,
  },
}

async function main() {
  const slides = []
  for (const slide of HOME_SLIDES) {
    slides.push({
      _type: 'heroSlide',
      _key: slide.key,
      label: slide.label,
      visual: await uploadImage(slide),
    })
  }

  await client.patch('homePage').setIfMissing({'hero.slides': slides}).commit()
  console.log(`homePage — ${slides.length} images d’en-tête.`)

  for (const [documentId, seed] of Object.entries(PAGE_HEROES)) {
    await client
      .patch(documentId)
      .setIfMissing({'hero.image': await uploadImage(seed)})
      .commit()
    console.log(`${documentId} — image d’en-tête.`)
  }

  // Champ remplacé par le texte alternatif porté par l'image elle-même.
  await client.patch('schedulePage').unset(['hero.imageAlt']).commit()

  console.log('Toutes les images de premier écran sont dans Sanity.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
