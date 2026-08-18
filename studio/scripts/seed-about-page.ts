/**
 * Saisie initiale de la page Notre paroisse et de ses neuf repères.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-about-page.ts --with-user-token
 *
 * Le script vit ici et non dans `scripts/` à la racine : `sanity exec` résout
 * ses dépendances depuis le dossier du Studio. Il compile en CJS, donc pas de
 * `await` au premier niveau — d'où le `main()`.
 *
 * `setIfMissing` : rejouable sans écraser ce que la paroisse aurait corrigé.
 * Sanity dédoublonne les fichiers par empreinte, donc les neuf illustrations ne
 * se multiplient pas non plus.
 *
 * Huit des neuf images sont **générées par intelligence artificielle**, et la
 * page le dit : chacune porte sa légende « Illustration artistique — non
 * documentaire », en plus de l'avertissement général de la section. C'est un
 * choix éditorial assumé — une chronologie historique ne peut pas laisser
 * croire à des archives. La neuvième est une photographie prise dans l'église.
 */
import {createReadStream} from 'node:fs'
import {resolve} from 'node:path'
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const ASSETS_DIRECTORY = resolve(process.cwd(), '../src/assets/images')

const AI_RIGHTS_NOTE =
  'Illustration générée par intelligence artificielle pour ce site, à partir du récit historique de la paroisse. Ne documente aucune archive.'

type SeedEntry = {
  key: string
  file: string
  periodLabel: string
  title: string
  summary: string
  body?: string[]
  alt: string
  imageKind: 'ai-illustration' | 'documentary-photo' | 'current-photo'
  sourceLabel: string
  disclosure?: string
  credit?: string
  rightsNote?: string
}

const LEGACY_SOURCE = 'Récit historique accepté de l’ancien site'

const ENTRIES: SeedEntry[] = [
  {
    key: 'avant-1959',
    file: 'history-timeline/01-avant-1959.png',
    periodLabel: 'Avant 1959',
    title: 'Un quartier en développement',
    summary:
      'Une communauté grandit dans le secteur et aspire à disposer d’un lieu où se rassembler.',
    alt: 'Illustration artistique d’une vue aérienne du quartier avant la construction de l’église.',
    imageKind: 'ai-illustration',
    sourceLabel: LEGACY_SOURCE,
    disclosure:
      'Vue urbaine reconstituée artistiquement; elle ne représente ni une photographie aérienne ni un plan authentique.',
  },
  {
    key: 'fondation-1959',
    file: 'history-timeline/02-fondation-1959.png',
    periodLabel: '23 février 1959',
    title: 'Fondation de la paroisse',
    summary: 'La communauté est érigée en paroisse par le cardinal Paul-Émile Léger.',
    alt: 'Illustration artistique représentant un document d’érection paroissiale et un portrait non documentaire du cardinal Paul-Émile Léger.',
    imageKind: 'ai-illustration',
    sourceLabel: LEGACY_SOURCE,
    disclosure:
      'Le portrait et le document représentés sont des créations artistiques et non des reproductions historiques.',
  },
  {
    key: 'achat-terrain-1960',
    file: 'history-timeline/03-achat-terrain-1960.png',
    periodLabel: '1960',
    title: 'Achat du terrain',
    summary:
      'Un terrain situé à proximité de la rue Denis-Papin, de la 25e Avenue et du parc René-Goupil est acquis pour la future église.',
    alt: 'Illustration artistique d’un terrain et d’un plan stylisé indiquant l’emplacement prévu pour l’église.',
    imageKind: 'ai-illustration',
    sourceLabel: LEGACY_SOURCE,
    disclosure:
      'Le plan illustré est une interprétation graphique; il ne constitue pas un plan cadastral authentique.',
  },
  {
    key: 'paroisse-sans-eglise',
    file: 'history-timeline/04-paroisse-sans-eglise-1959-1963.png',
    periodLabel: '1959–1963',
    title: 'Une paroisse sans église',
    summary:
      'Avant l’achèvement du lieu de culte, la communauté se rassemble dans des espaces temporaires du quartier.',
    body: [
      'Les messes de semaine sont célébrées au sous-sol d’une maison utilisée comme presbytère.',
      'Les célébrations dominicales ont lieu dans des écoles du quartier.',
    ],
    alt: 'Illustration artistique de célébrations paroissiales temporaires dans une maison et une école du quartier.',
    imageKind: 'ai-illustration',
    sourceLabel: LEGACY_SOURCE,
    disclosure:
      'Les personnes et les lieux représentés sont des reconstitutions artistiques non documentaires.',
  },
  {
    key: 'construction-eglise',
    file: 'history-timeline/05-construction-eglise-1963-1964.png',
    periodLabel: '1963–1964',
    title: 'Construction de l’église',
    summary:
      'Roger D’Astous et Jean-Paul Pothier sont associés à la conception du bâtiment, dont le presbytère est intégré au même édifice.',
    body: ['Le récit existant présente Roger D’Astous comme le principal concepteur du projet.'],
    alt: 'Illustration artistique de l’église en construction accompagnée de portraits non documentaires des architectes.',
    imageKind: 'ai-illustration',
    sourceLabel: LEGACY_SOURCE,
    disclosure:
      'La scène de chantier et les portraits sont des interprétations artistiques, non des archives authentiques.',
  },
  {
    key: 'architecture-1964',
    file: 'history-timeline/06-architecture-1964.png',
    periodLabel: '1964',
    title: 'Une architecture unique',
    summary:
      'Le liège, la brique rouge, le bois foncé et le béton contribuent à créer un contraste marqué entre la nef plus sobre et le chœur très éclairé.',
    body: [
      'Le plan rectangulaire et le large paravent de béton accompagnent la transition entre la rue et le lieu de culte.',
      'Le récit attribue la fabrication des bancs à Henri Boisvert et les éléments de fer forgé à Desmarais et Robitaille.',
    ],
    alt: 'Illustration artistique de la nef sombre, du chœur lumineux et des matériaux caractéristiques de l’église.',
    imageKind: 'ai-illustration',
    sourceLabel: LEGACY_SOURCE,
  },
  {
    key: 'evolution-vers-1990',
    file: 'history-timeline/07-evolution-vers-1990.png',
    periodLabel: 'Vers 1990',
    title: 'Le bâtiment évolue',
    summary:
      'La salle communautaire du sous-sol est transformée en friperie, tandis que d’autres espaces sont réaménagés pour répondre aux besoins de la communauté.',
    body: [
      'Le baptistère est ensuite réaménagé en chapelle et la tribune arrière est divisée afin de créer une pièce.',
    ],
    alt: 'Illustration artistique en collage des transformations intérieures et des activités communautaires autour de 1990.',
    imageKind: 'ai-illustration',
    sourceLabel: LEGACY_SOURCE,
    disclosure:
      'Les scènes représentées sont des interprétations artistiques et non des photographies des transformations.',
  },
  {
    key: 'consecration-2018',
    file: 'paroisse/plaque-consecration-01.webp',
    periodLabel: '6 mai 2018',
    title: 'Consécration de l’église et de l’autel',
    summary:
      'Une plaque photographiée dans l’église indique que l’église Saint-René-Goupil et son autel majeur ont été consacrés par Mgr Christian Lépine.',
    alt: 'Plaque de consécration de l’église et de l’autel placée sous une croix.',
    imageKind: 'documentary-photo',
    sourceLabel: 'Repère documentaire — photographie prise dans l’église',
    disclosure:
      'La photographie documente la plaque présente dans l’église; sa transcription éditoriale reste à confirmer avec la paroisse.',
    credit: 'Fichiers photographiques fournis avec le projet Saint-René-Goupil',
    rightsNote:
      'Photographie prise dans l’église et fournie avec le projet. Crédit à préciser au nom de la photographe.',
  },
  {
    key: 'patrimoine-vivant',
    file: 'history-timeline/08-patrimoine-vivant-aujourdhui.png',
    periodLabel: 'Aujourd’hui',
    title: 'Un patrimoine vivant',
    summary:
      'L’église demeure un lieu de foi, d’entraide, de rencontre et de culture au cœur du quartier.',
    alt: 'Illustration artistique d’un rassemblement communautaire devant l’église éclairée en soirée.',
    imageKind: 'ai-illustration',
    sourceLabel: 'Synthèse éditoriale générale; activités actuelles à confirmer',
    disclosure:
      'Le rassemblement représenté est une scène artistique; il ne documente pas un événement précis.',
  },
]

async function uploadEntries() {
  const entries = []

  for (const entry of ENTRIES) {
    const isIllustration = entry.imageKind === 'ai-illustration'
    const asset = await client.assets.upload(
      'image',
      createReadStream(resolve(ASSETS_DIRECTORY, entry.file)),
      {filename: entry.file.split('/').pop()},
    )

    entries.push({
      _type: 'historyEntry',
      _key: entry.key,
      periodLabel: entry.periodLabel,
      title: entry.title,
      summary: entry.summary,
      ...(entry.body ? {body: entry.body} : {}),
      imageKind: entry.imageKind,
      sourceLabel: entry.sourceLabel,
      ...(entry.disclosure ? {disclosure: entry.disclosure} : {}),
      image: {
        _type: 'eventImage',
        alt: entry.alt,
        ...(entry.credit ? {credit: entry.credit} : {}),
        rightsNote: entry.rightsNote ?? AI_RIGHTS_NOTE,
        containsRecognizablePeople: false,
        // Les portraits illustrés ne représentent personne : ce sont des
        // inventions graphiques, pas des personnes photographiées.
        generatedByAi: isIllustration,
        image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
      },
    })
  }

  return entries
}

const SECTIONS = {
  hero: {
    eyebrow: 'Notre histoire',
    title: 'Une paroisse au cœur de sa communauté',
    introduction:
      'Découvrez l’histoire, l’architecture et la communauté de la Paroisse Saint-René-Goupil.',
  },
  introduction: {
    eyebrow: 'Bienvenue',
    accent: 'Ensemble',
    title: 'Un lieu de foi et de rencontre',
    paragraphs: [
      'La Paroisse Saint-René-Goupil rassemble des personnes de tous les âges autour de la prière, de la rencontre et de la solidarité.',
      'Son église offre un cadre architectural singulier où le bois, la brique, le béton et la lumière accompagnent les célébrations et la vie communautaire.',
    ],
  },
  principles: {
    eyebrow: 'Ce qui nous rassemble',
    title: 'Foi, rencontre et solidarité',
    items: [
      {
        _type: 'aboutPrinciple',
        _key: 'priere',
        title: 'Prière',
        description:
          'Les célébrations et les temps de recueillement donnent un rythme à la vie de la communauté.',
        symbol: 'book',
      },
      {
        _type: 'aboutPrinciple',
        _key: 'rencontre',
        title: 'Rencontre',
        description:
          'La paroisse souhaite demeurer un lieu où les personnes peuvent se retrouver et cheminer ensemble.',
        symbol: 'people',
      },
      {
        _type: 'aboutPrinciple',
        _key: 'solidarite',
        title: 'Solidarité',
        description:
          'L’entraide et l’attention portée aux autres inspirent la présence de la paroisse dans son milieu.',
        symbol: 'heart',
      },
    ],
  },
  architecture: {
    eyebrow: 'Le lieu',
    title: 'L’église et son architecture',
    paragraphs: [
      'L’église se distingue notamment par une composition où le bois foncé, la brique rouge et le béton encadrent un chœur largement éclairé.',
      'Les documents existants attribuent principalement la conception à Roger D’Astous, avec la collaboration de Jean-Paul Pothier. Cette attribution et leurs rôles exacts doivent être confirmés avant le lancement public.',
    ],
    features: [
      {
        _type: 'architectureFeature',
        _key: 'materiaux',
        title: 'Bois, brique et béton',
        description: 'Une palette de matériaux bruts structure l’intérieur et son atmosphère.',
      },
      {
        _type: 'architectureFeature',
        _key: 'lumiere',
        title: 'Lumière naturelle',
        description: 'Les ouvertures au-dessus du chœur dirigent la lumière vers l’autel.',
      },
      {
        _type: 'architectureFeature',
        _key: 'nef-choeur',
        title: 'Nef et chœur',
        description:
          'Le contraste entre une nef plus sombre et un chœur clair souligne l’axe central.',
      },
      {
        _type: 'architectureFeature',
        _key: 'entree',
        title: 'Parcours d’entrée',
        description:
          'Les documents décrivent une transition marquée entre la rue et l’espace de célébration.',
      },
      {
        _type: 'architectureFeature',
        _key: 'clochers',
        title: 'Éléments verticaux',
        description:
          'Plusieurs structures portant des cloches signalent le bâtiment dans son environnement.',
      },
      {
        _type: 'architectureFeature',
        _key: 'presbytere',
        title: 'Presbytère intégré',
        description:
          'Le récit historique présente le presbytère comme une partie intégrée à l’ensemble.',
      },
    ],
  },
  architects: {
    eyebrow: 'Conception',
    title: 'Les architectes',
    introduction:
      'Les attributions ci-dessous proviennent des documents de l’ancien site et doivent encore être validées éditorialement.',
    profiles: [
      {
        _type: 'architectProfile',
        _key: 'roger-dastous',
        name: 'Roger D’Astous',
        role: 'Architecte principal — attribution à confirmer',
        description:
          'Les documents existants lui attribuent le rôle principal dans la conception de l’église.',
        confirmationRequired: true,
      },
      {
        _type: 'architectProfile',
        _key: 'jean-paul-pothier',
        name: 'Jean-Paul Pothier',
        role: 'Collaborateur ou co-concepteur — rôle exact à confirmer',
        description:
          'Son nom est associé au projet, sans que la portée exacte de sa contribution soit encore validée.',
        confirmationRequired: true,
      },
    ],
    validationCard: {
      eyebrow: 'Documentation',
      title: 'Une histoire à valider',
      text: 'Les dates, attributions et transformations du bâtiment seront précisées avec la paroisse avant le lancement public.',
    },
  },
  closing: {
    accent: 'Venez',
    title: 'Venez découvrir la paroisse',
    text: 'Que vous soyez nouvellement arrivé dans le quartier ou simplement de passage, vous êtes invité à découvrir notre communauté.',
    primaryCtaLabel: 'Préparer une première visite',
    secondaryCtaLabel: 'Nous joindre',
  },
}

async function main() {
  await client.createIfNotExists({_id: 'aboutPage', _type: 'aboutPage'})

  const entries = await uploadEntries()

  await client
    .patch('aboutPage')
    .setIfMissing({
      ...SECTIONS,
      history: {
        eyebrow: 'Notre histoire',
        title: 'Histoire de la paroisse',
        introduction:
          'De la naissance d’une communauté à l’évolution de son église, neuf repères racontent un lieu façonné par la foi, l’architecture et l’entraide.',
        illustrationDisclosure:
          'Les scènes historiques présentées dans cette chronologie sont des illustrations artistiques inspirées du récit de la paroisse. Elles ne constituent pas des photographies d’archives.',
        entries,
        epilogue: {
          eyebrow: 'Architecture et communauté',
          title: 'Un repère architectural et communautaire',
          paragraphs: [
            'Ses clochers, son presbytère intégré et son paravent de béton composent un repère architectural distinctif dans le quartier.',
            'À l’intérieur, le contraste entre la nef plus sombre et le chœur éclairé accompagne un lieu dont les espaces ont évolué avec les besoins de la communauté.',
          ],
        },
      },
    })
    .commit()

  console.log(`Page Notre paroisse écrite dans Sanity avec ${entries.length} repères.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
