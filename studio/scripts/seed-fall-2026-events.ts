/**
 * Reprend les quatre événements annoncés sur l'ancien site de la paroisse.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-fall-2026-events.ts --with-user-token
 *
 * Source : https://www.paroissesaintrenegoupil.com/évènements-à-venir
 *
 * Les textes sont recopiés de cette page, pas résumés ni reformulés. Les
 * paragraphes de l'annonce sont conservés tels quels, séparés par une ligne
 * vide, et les retours simples à l'intérieur d'un paragraphe — la liste des
 * musiciens d'un concert — le sont aussi. Les maladresses de frappe de la
 * source, comme l'espace avant une virgule, ne sont pas corrigées : cette page
 * est le texte de référence de la paroisse, pas un brouillon à relire.
 *
 * Deux écarts assumés, et deux seulement :
 *
 * - Les titres perdent la date que l'ancien site y accolait
 *   (« … - 4 octobre 16 h »). Elle est saisie dans le champ « Début » et
 *   affichée par la page : la laisser aussi dans le titre l'écrirait deux fois
 *   sur la même carte.
 * - Le mot « Description », qui sépare le résumé du texte long sur l'ancien
 *   site, n'est pas repris : c'est une étiquette de mise en page, pas une
 *   phrase de l'annonce.
 *
 * Ce qui n'y figurait pas — un lieu, une jauge — reste vide plutôt qu'inventé,
 * et les trois concerts sont annoncés gratuits, ce que le champ « Coût »
 * exprime en restant vide.
 *
 * Les quatre images viennent de `incoming-images/`, récupérées à la main depuis
 * l'ancien site. Leurs dimensions correspondent une à une à celles des images
 * de la page source, et leur contenu le confirme : vitrail du patron, quintette
 * de cuivres, portrait du pianiste, ensemble à cordes et jazz sur scène.
 *
 * Les coordonnées des bénévoles de la fête patronale restent dans le texte de
 * l'annonce, telle que la paroisse la publie déjà. Elles ne sont pas recopiées
 * dans le champ « Personne à joindre » : celui-ci demande une case d'accord, et
 * cet accord se donne par une personne, pas par un script.
 *
 * Les quatre annonces sont cochées « Afficher sur l'accueil ». La page
 * d'accueil met d'elle-même la plus proche en grande carte et range les
 * suivantes à côté; une activité passée en sort toute seule. Rien à retoucher
 * quand une date tombe.
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

/**
 * Un fragment de paragraphe, avec ou sans emphase.
 *
 * Les emphases sont celles de l'ancien site, relevées dans sa page et non
 * devinées : « Pour la réception qui suivra » en gras, « Rhapsodie hongroise
 * nº 2 » et « A Charlie Brown Christmas » en italique, « Quatuor à cordes » et
 * « Trio jazz » en gras.
 */
type Fragment = {text: string; marks?: ('strong' | 'em')[]}

type EventSeed = {
  id: string
  title: string
  slug: string
  category: string
  startAt: string
  excerpt: string
  paragraphs: Fragment[][]
  image: {
    file: string
    alt: string
    containsRecognizablePeople: boolean
  }
}

const EVENTS: EventSeed[] = [
  {
    id: 'event-fete-patronale-2026',
    // Ancien site : « Fête patronale de Saint René Goupil 27 septembre ».
    title: 'Fête patronale de Saint René Goupil',
    slug: 'fete-patronale-saint-rene-goupil-2026',
    category: 'liturgy',
    // 27 septembre 2026, 10 h, heure de l'Est (UTC−4 en septembre).
    startAt: '2026-09-27T14:00:00.000Z',
    excerpt:
      'La Fabrique Saint-René-Goupil a l’immense plaisir de vous annoncer que la paroisse célébrera encore cette année, son patron Saint René Goupil, canonisé en 1930 par le pape Pie XI, dont la mémoire liturgique est célébrée le 26 septembre. La messe solennelle en la circonstance aura lieu le dimanche 27 septembre à 10 heures.',
    paragraphs: [
      [
        {
          text: 'La Fabrique Saint-René-Goupil a l’immense plaisir de vous annoncer que la paroisse célébrera encore cette année, son patron Saint René Goupil, canonisé en 1930 par le pape Pie XI, dont la mémoire liturgique est célébrée le 26 septembre. La messe solennelle en la circonstance aura lieu le dimanche 27 septembre à 10 heures. Notre invité d’honneur cette année sera le père Jean-Marie Bilwala, vicaire épiscopal. Nous en profiterons pour souligner le cinquième anniversaire de la chorale Ave Maria.',
        },
      ],
      [
        {text: 'Pour la réception qui suivra', marks: ['strong']},
        {
          text: ', si vous désirez contribuer en apportant un plat cuisiné, des boissons gazeuses ou des ustensiles, veuillez contacter un membre des Fils et des Dames de Notre-Dame soit Luce Eugène (438) 885-2543, Rachel Genty (438) 860-2296 ou le secrétariat (514) 722-1161.',
        },
      ],
      [{text: 'Toute contribution sera grandement appréciée. Nous vous en remercions à l’avance.'}],
    ],
    image: {
      file: 'evenemntsavenir1.jpg',
      alt: 'Vitrail représentant saint René Goupil, vêtu de vert, tendant la main vers une personne agenouillée',
      containsRecognizablePeople: false,
    },
  },
  {
    id: 'event-buzz-cuivres-2026',
    // Ancien site : « Premier spectacle Hors les Murs automne 2026 - 4 octobre 16 h ».
    title: 'Premier spectacle Hors les Murs automne 2026',
    slug: 'buzz-cuivres-hors-les-murs-automne-2026',
    category: 'concert',
    // 4 octobre 2026, 16 h, heure de l'Est (UTC−4 en octobre).
    startAt: '2026-10-04T20:00:00.000Z',
    excerpt:
      'Un quintette de cuivres interprète Debussy, Ravel, Dvořák, Piazzolla et Liszt avec des arrangements originaux, dont la Rhapsodie hongroise nº 2, dans un concert énergique et accessible.',
    paragraphs: [
      [
        {
          text: 'Un quintette de cuivres interprète Debussy, Ravel, Dvořák, Piazzolla et Liszt avec des arrangements originaux, dont la ',
        },
        {text: 'Rhapsodie hongroise nº 2', marks: ['em']},
        {text: ', dans un concert énergique et accessible.'},
      ],
      [
        {
          text: 'Avec des arrangements musicaux originaux, un répertoire unique qui marie avec brio la musique classique et divers styles, ainsi qu’une solide présence sur scène qui plaît à un large public, Buzz Cuivres est l’un des quintettes de cuivres les plus reconnus au Canada. Grâce à de remarquables transcriptions originales, laissez-vous emporter par de célèbres compositions du tournant du 20e siècle. Le programme aussi inspiré qu’inspirant réunit de véritables chefs-d’œuvre intemporels que tous les publics sauront apprécier. Venez entendre ces célèbres inspirations sous le nouvel éclairage incomparable que leur donne le quintette Buzz Cuivres !',
        },
      ],
      [{text: 'Musique classique et arrangements – Grand public - Gratuit'}],
    ],
    image: {
      file: 'evenemntsavenir2.jpg',
      alt: 'Les cinq musiciens du quintette Buzz Cuivres, vêtus de noir, tenant trompettes, cor et trombone',
      containsRecognizablePeople: true,
    },
  },
  {
    id: 'event-bontemps-delly-2026',
    // Ancien site : « Deuxième spectacle Hors les Murs automne 2026 -18 octobre 16 h ».
    title: 'Deuxième spectacle Hors les Murs automne 2026',
    slug: 'bontemps-delly-hors-les-murs-automne-2026',
    category: 'concert',
    // 18 octobre 2026, 16 h, heure de l'Est (UTC−4 en octobre).
    startAt: '2026-10-18T20:00:00.000Z',
    excerpt:
      'David Bontemps et Emmanuel Delly proposent une traversée musicale entre racines et renouveau. Un concert vibrant qui fait émerger des résonances d’Haïti à travers un dialogue raffiné entre piano et percussions.',
    paragraphs: [
      [
        {
          text: 'David Bontemps et Emmanuel Delly proposent une traversée musicale entre racines et renouveau. Un concert vibrant qui fait émerger des résonances d’Haïti à travers un dialogue raffiné entre piano et percussions.',
        },
      ],
      [
        {
          text: 'Le pianiste David Bontemps convie à un voyage dans les multiples mémoires qui imprègnent les sonorités de son île natale d’Haïti. À travers des airs anciens revisités et ses propres compositions, il recrée des atmosphères du passé tout en cheminant sur de nouveaux sentiers où le rejoint le percussionniste Emmanuel Delly.',
        },
      ],
      [{text: 'Musique classique et musique du monde'}],
      [{text: 'Grand public-Gratuit'}],
    ],
    image: {
      file: 'evenemntsavenir3.jpg',
      alt: 'Portrait du pianiste David Bontemps, le menton appuyé sur la main, le regard tourné de côté',
      containsRecognizablePeople: true,
    },
  },
  {
    id: 'event-noel-charlie-brown-2026',
    // Ancien site : « Troisième spectacle Hors les Murs automne 2026 » puis « 29 novembre 16 h ».
    title: 'Troisième spectacle Hors les Murs automne 2026',
    slug: 'noel-de-charlie-brown-hors-les-murs-automne-2026',
    category: 'concert',
    // 29 novembre 2026, 16 h, heure de l'Est (UTC−5 : l'heure avancée est finie).
    startAt: '2026-11-29T21:00:00.000Z',
    excerpt:
      'Un concert chaleureux qui revisite les mélodies emblématiques de A Charlie Brown Christmas. Entre jazz et musique de chambre, cette rencontre musicale évoque la nostalgie, la douceur et l’esprit rassembleur du temps des Fêtes, pour petits et grands.',
    paragraphs: [
      [
        {text: 'Un concert chaleureux qui revisite les mélodies emblématiques de '},
        {text: 'A Charlie Brown Christmas', marks: ['em']},
        {
          text: '. Entre jazz et musique de chambre, cette rencontre musicale évoque la nostalgie, la douceur et l’esprit rassembleur du temps des Fêtes, pour petits et grands.',
        },
      ],
      [
        {
          text: 'Les Chambristes du Grand Montréal et le Rozan Trio vous invitent à plonger dans la magie du temps des Fêtes avec Le Noël de Charlie Brown. Inspiré de l’album ',
        },
        {text: 'A Charlie Brown Christmas', marks: ['em']},
        {
          text: ' du légendaire pianiste de jazz Vince Guaraldi, ce concert vous fera revivre la douceur et la nostalgie des célèbres mélodies. Une rencontre unique entre le son raffiné d’un quatuor à cordes et l’énergie chaleureuse d’un trio jazz avec les arrangements originaux de Karl A. Rozankovic. Célébrez la magie de Noël!',
        },
      ],
      [{text: 'Quatuor à cordes', marks: ['strong']}],
      [
        {
          text: 'Veronica Ungureanu, violon 1\nMarie-Anne Rozankovic, violon 2\nZoé Dumais, alto\nLoredana Zanca , violoncelle',
        },
      ],
      [{text: 'Trio jazz', marks: ['strong']}],
      [
        {
          text: 'Karl A. Rozankovic , piano\nVincent Dessureault , contrebasse\nLéo Minville, batterie',
        },
      ],
      [{text: 'Pascale Brigitte Boilard, voix et animation- Gratuit'}],
    ],
    image: {
      file: 'evenemntsavenir4.jpg',
      alt: 'Sur scène, une contrebasse, une batterie et des instruments à cordes joués par les musiciens d’un quatuor et d’un trio jazz',
      containsRecognizablePeople: true,
    },
  },
]

/**
 * Convertit les paragraphes en blocs de texte enrichi.
 *
 * Les clés sont dérivées de la position : stables d'une exécution à l'autre,
 * donc rejouer le script ne réécrit pas des identifiants au hasard.
 */
function toRichText(paragraphs: Fragment[][]) {
  return paragraphs.map((fragments, blockIndex) => ({
    _type: 'block',
    _key: `p${blockIndex}`,
    style: 'normal',
    markDefs: [],
    children: fragments.map((fragment, spanIndex) => ({
      _type: 'span',
      _key: `p${blockIndex}s${spanIndex}`,
      text: fragment.text,
      marks: fragment.marks ?? [],
    })),
  }))
}

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
        description: toRichText(entry.paragraphs),
        category: entry.category,
        startAt: entry.startAt,
        publicationStatus: 'published',
        showOnWebsite: true,
        showOnHomepage: true,
        showInArchive: true,
        featured: false,
        ...(coverImage ? {coverImage} : {}),
      })
      .commit()

    console.log(
      `${alreadyIllustrated ? 'Mis à jour' : 'Créé'} : ${entry.title} ` +
        `(${entry.id}, ${entry.paragraphs.length} paragraphes)`,
    )
  }
}

seed().then(
  () => console.log(`\n${EVENTS.length} événements en place.`),
  (error) => {
    console.error(error)
    process.exit(1)
  },
)
