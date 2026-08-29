/**
 * Reprend les quatre événements annoncés sur l'ancien site de la paroisse.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-fall-2026-events.ts --with-user-token
 *
 * Source : https://www.paroissesaintrenegoupil.com/évènements-à-venir
 * Les textes sont repris de cette page, pas réécrits. Ce qui n'y figurait pas
 * — un lieu, un prix, une jauge — reste vide plutôt qu'inventé : les trois
 * concerts sont annoncés gratuits, et le champ « Coût » se laisse vide dans ce
 * cas, comme le dit son aide dans le Studio.
 *
 * Les quatre images viennent de `incoming-images/`, récupérées à la main depuis
 * l'ancien site. Leurs dimensions correspondent une à une à celles des images
 * de la page source, et leur contenu le confirme : vitrail du patron, quintette
 * de cuivres, portrait du pianiste, ensemble à cordes et jazz sur scène.
 *
 * Les coordonnées des bénévoles annoncées pour la fête patronale restent dans
 * la description complète, telle que la paroisse la publie déjà. Elles ne sont
 * pas recopiées dans le champ « Personne à joindre » : ce champ demande une
 * case d'accord, et cet accord se donne par une personne, pas par un script.
 *
 * L'affichage sur l'accueil reste décoché : la demande porte sur la page
 * Événements. Une case à cocher dans le Studio suffira le jour où la paroisse
 * voudra ces annonces aussi sur la page d'accueil.
 *
 * Rejouable : les documents portent des identifiants stables, et une image
 * déjà en place n'est pas téléversée une seconde fois.
 */
import {createReadStream} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const IMAGES_DIRECTORY = resolve(process.cwd(), '../incoming-images')

const SOURCE_NOTE =
  'Image reprise de la page « Évènements à venir » de l’ancien site de la paroisse. ' +
  'Crédit et autorisation à confirmer auprès de la paroisse et de l’artiste.'

type EventSeed = {
  id: string
  title: string
  slug: string
  category: string
  startAt: string
  excerpt: string
  description: string
  image: {
    file: string
    alt: string
    containsRecognizablePeople: boolean
  }
}

const EVENTS: EventSeed[] = [
  {
    id: 'event-fete-patronale-2026',
    title: 'Fête patronale de Saint René Goupil',
    slug: 'fete-patronale-saint-rene-goupil-2026',
    category: 'liturgy',
    // 27 septembre 2026, 10 h, heure de l'Est (UTC−4 en septembre).
    startAt: '2026-09-27T14:00:00.000Z',
    excerpt:
      'Messe solennelle en l’honneur de saint René Goupil, patron de la paroisse, canonisé en 1930 par le pape Pie XI. Le père Jean-Marie Bilwala, vicaire épiscopal, est l’invité d’honneur, et le cinquième anniversaire de la chorale Ave Maria y est souligné. Une réception suit la célébration.',
    description: [
      'La Fabrique Saint-René-Goupil a l’immense plaisir de vous annoncer que la paroisse célébrera encore cette année, son patron Saint René Goupil, canonisé en 1930 par le pape Pie XI, dont la mémoire liturgique est célébrée le 26 septembre. La messe solennelle en la circonstance aura lieu le dimanche 27 septembre à 10 heures. Notre invité d’honneur cette année sera le père Jean-Marie Bilwala, vicaire épiscopal. Nous en profiterons pour souligner le cinquième anniversaire de la chorale Ave Maria.',
      'Pour la réception qui suivra, si vous désirez contribuer en apportant un plat cuisiné, des boissons gazeuses ou des ustensiles, veuillez contacter un membre des Fils et des Dames de Notre-Dame soit Luce Eugène (438) 885-2543, Rachel Genty (438) 860-2296 ou le secrétariat (514) 722-1161.',
      'Toute contribution sera grandement appréciée. Nous vous en remercions à l’avance.',
    ].join('\n\n'),
    image: {
      file: 'evenemntsavenir1.jpg',
      alt: 'Vitrail représentant saint René Goupil, vêtu de vert, tendant la main vers une personne agenouillée',
      containsRecognizablePeople: false,
    },
  },
  {
    id: 'event-buzz-cuivres-2026',
    title: 'Buzz Cuivres — Premier spectacle Hors les Murs automne 2026',
    slug: 'buzz-cuivres-hors-les-murs-automne-2026',
    category: 'concert',
    // 4 octobre 2026, 16 h, heure de l'Est (UTC−4 en octobre).
    startAt: '2026-10-04T20:00:00.000Z',
    excerpt:
      'Un quintette de cuivres interprète Debussy, Ravel, Dvořák, Piazzolla et Liszt avec des arrangements originaux, dont la Rhapsodie hongroise nº 2, dans un concert énergique et accessible. Musique classique et arrangements — grand public — gratuit.',
    description: [
      'Avec des arrangements musicaux originaux, un répertoire unique qui marie avec brio la musique classique et divers styles, ainsi qu’une solide présence sur scène qui plaît à un large public, Buzz Cuivres est l’un des quintettes de cuivres les plus reconnus au Canada. Grâce à de remarquables transcriptions originales, laissez-vous emporter par de célèbres compositions du tournant du 20e siècle. Le programme aussi inspiré qu’inspirant réunit de véritables chefs-d’œuvre intemporels que tous les publics sauront apprécier. Venez entendre ces célèbres inspirations sous le nouvel éclairage incomparable que leur donne le quintette Buzz Cuivres !',
      'Musique classique et arrangements – Grand public - Gratuit',
    ].join('\n\n'),
    image: {
      file: 'evenemntsavenir2.jpg',
      alt: 'Les cinq musiciens du quintette Buzz Cuivres, vêtus de noir, tenant trompettes, cor et trombone',
      containsRecognizablePeople: true,
    },
  },
  {
    id: 'event-bontemps-delly-2026',
    title: 'David Bontemps et Emmanuel Delly — Deuxième spectacle Hors les Murs automne 2026',
    slug: 'bontemps-delly-hors-les-murs-automne-2026',
    category: 'concert',
    // 18 octobre 2026, 16 h, heure de l'Est (UTC−4 en octobre).
    startAt: '2026-10-18T20:00:00.000Z',
    excerpt:
      'David Bontemps et Emmanuel Delly proposent une traversée musicale entre racines et renouveau. Un concert vibrant qui fait émerger des résonances d’Haïti à travers un dialogue raffiné entre piano et percussions. Grand public — gratuit.',
    description: [
      'Le pianiste David Bontemps convie à un voyage dans les multiples mémoires qui imprègnent les sonorités de son île natale d’Haïti. À travers des airs anciens revisités et ses propres compositions, il recrée des atmosphères du passé tout en cheminant sur de nouveaux sentiers où le rejoint le percussionniste Emmanuel Delly.',
      'Musique classique et musique du monde',
      'Grand public - Gratuit',
    ].join('\n\n'),
    image: {
      file: 'evenemntsavenir3.jpg',
      alt: 'Portrait du pianiste David Bontemps, le menton appuyé sur la main, le regard tourné de côté',
      containsRecognizablePeople: true,
    },
  },
  {
    id: 'event-noel-charlie-brown-2026',
    title: 'Le Noël de Charlie Brown — Troisième spectacle Hors les Murs automne 2026',
    slug: 'noel-de-charlie-brown-hors-les-murs-automne-2026',
    category: 'concert',
    // 29 novembre 2026, 16 h, heure de l'Est (UTC−5 : l'heure avancée est finie).
    startAt: '2026-11-29T21:00:00.000Z',
    excerpt:
      'Un concert chaleureux qui revisite les mélodies emblématiques de A Charlie Brown Christmas. Entre jazz et musique de chambre, cette rencontre évoque la nostalgie, la douceur et l’esprit rassembleur du temps des Fêtes, pour petits et grands. Grand public — gratuit.',
    description: [
      'Les Chambristes du Grand Montréal et le Rozan Trio vous invitent à plonger dans la magie du temps des Fêtes avec Le Noël de Charlie Brown. Inspiré de l’album A Charlie Brown Christmas du légendaire pianiste de jazz Vince Guaraldi, ce concert vous fera revivre la douceur et la nostalgie des célèbres mélodies. Une rencontre unique entre le son raffiné d’un quatuor à cordes et l’énergie chaleureuse d’un trio jazz avec les arrangements originaux de Karl A. Rozankovic. Célébrez la magie de Noël!',
      'Quatuor à cordes\nVeronica Ungureanu, violon 1\nMarie-Anne Rozankovic, violon 2\nZoé Dumais, alto\nLoredana Zanca, violoncelle',
      'Trio jazz\nKarl A. Rozankovic, piano\nVincent Dessureault, contrebasse\nLéo Minville, batterie',
      'Pascale Brigitte Boilard, voix et animation - Gratuit',
    ].join('\n\n'),
    image: {
      file: 'evenemntsavenir4.jpg',
      alt: 'Sur scène, une contrebasse, une batterie et des instruments à cordes joués par les musiciens d’un quatuor et d’un trio jazz',
      containsRecognizablePeople: true,
    },
  },
]

async function uploadCoverImage(entry: EventSeed) {
  const asset = await client.assets.upload(
    'image',
    createReadStream(resolve(IMAGES_DIRECTORY, entry.image.file)),
    {filename: entry.image.file},
  )

  return {
    _type: 'eventImage',
    alt: entry.image.alt,
    rightsNote: SOURCE_NOTE,
    containsRecognizablePeople: entry.image.containsRecognizablePeople,
    generatedByAi: false,
    image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
  }
}

async function seed() {
  for (const entry of EVENTS) {
    const existing = await client.fetch<{coverImage?: {image?: {asset?: {_ref?: string}}}} | null>(
      '*[_id == $id][0]{coverImage}',
      {id: entry.id},
    )

    const alreadyIllustrated = Boolean(existing?.coverImage?.image?.asset?._ref)
    const coverImage = alreadyIllustrated ? undefined : await uploadCoverImage(entry)

    await client.createIfNotExists({_id: entry.id, _type: 'parishEvent'})

    await client
      .patch(entry.id)
      .set({
        title: entry.title,
        slug: {_type: 'slug', current: entry.slug},
        excerpt: entry.excerpt,
        description: entry.description,
        category: entry.category,
        startAt: entry.startAt,
        publicationStatus: 'published',
        showOnWebsite: true,
        showOnHomepage: false,
        showInArchive: true,
        featured: false,
        ...(coverImage ? {coverImage} : {}),
      })
      .commit()

    console.log(`${alreadyIllustrated ? 'Mis à jour' : 'Créé'} : ${entry.title} (${entry.id})`)
  }
}

seed().then(
  () => console.log(`\n${EVENTS.length} événements en place.`),
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
