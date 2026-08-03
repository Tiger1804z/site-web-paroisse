import type { AboutPageData } from '@/types/about';

/**
 * Repli local de `/notre-paroisse`.
 *
 * Les neuf repères y gardent leurs textes mais **pas leurs illustrations** :
 * celles-ci sont téléversées dans le Studio depuis la migration. Si Sanity ne
 * répond pas, la chronologie se raconte sans ses images plutôt que de
 * disparaître.
 *
 * Le hero et le cadre d'architecture restent des fichiers du dépôt : ce sont
 * des visuels de page, réservés au ticket qui les migrera tous ensemble.
 */
export const aboutPageData = {
  seo: {
    title: 'Notre paroisse',
    description:
      'Découvrez l’histoire, l’architecture et la vie communautaire de la Paroisse Saint-René-Goupil.',
  },
  hero: {
    eyebrow: 'Notre histoire',
    title: 'Une paroisse au cœur de sa communauté',
    introduction:
      'Découvrez l’histoire, l’architecture et la communauté de la Paroisse Saint-René-Goupil.',
  },
  introduction: {
    eyebrow: 'Bienvenue',
    title: 'Un lieu de foi et de rencontre',
    accent: 'Ensemble',
    paragraphs: [
      'La Paroisse Saint-René-Goupil rassemble des personnes de tous les âges autour de la prière, de la rencontre et de la solidarité.',
      'Son église offre un cadre architectural singulier où le bois, la brique, le béton et la lumière accompagnent les célébrations et la vie communautaire.',
    ],
  },
  history: {
    eyebrow: 'Notre histoire',
    title: 'Histoire de la paroisse',
    introduction:
      'De la naissance d’une communauté à l’évolution de son église, neuf repères racontent un lieu façonné par la foi, l’architecture et l’entraide.',
    illustrationDisclosure:
      'Les scènes historiques présentées dans cette chronologie sont des illustrations artistiques inspirées du récit de la paroisse. Elles ne constituent pas des photographies d’archives.',
    entries: [
      {
        id: 'avant-1959',
        periodLabel: 'Avant 1959',
        title: 'Un quartier en développement',
        summary:
          'Une communauté grandit dans le secteur et aspire à disposer d’un lieu où se rassembler.',
        imageKind: 'ai-illustration',
        sourceLabel: 'Récit historique accepté de l’ancien site',
        disclosure:
          'Vue urbaine reconstituée artistiquement; elle ne représente ni une photographie aérienne ni un plan authentique.',
      },
      {
        id: 'fondation-1959',
        periodLabel: '23 février 1959',
        title: 'Fondation de la paroisse',
        summary:
          'La communauté est érigée en paroisse par le cardinal Paul-Émile Léger.',
        imageKind: 'ai-illustration',
        sourceLabel: 'Récit historique accepté de l’ancien site',
        disclosure:
          'Le portrait et le document représentés sont des créations artistiques et non des reproductions historiques.',
      },
      {
        id: 'achat-terrain-1960',
        periodLabel: '1960',
        title: 'Achat du terrain',
        summary:
          'Un terrain situé à proximité de la rue Denis-Papin, de la 25e Avenue et du parc René-Goupil est acquis pour la future église.',
        imageKind: 'ai-illustration',
        sourceLabel: 'Récit historique accepté de l’ancien site',
        disclosure:
          'Le plan illustré est une interprétation graphique; il ne constitue pas un plan cadastral authentique.',
      },
      {
        id: 'paroisse-sans-eglise',
        periodLabel: '1959–1963',
        title: 'Une paroisse sans église',
        summary:
          'Avant l’achèvement du lieu de culte, la communauté se rassemble dans des espaces temporaires du quartier.',
        body: [
          'Les messes de semaine sont célébrées au sous-sol d’une maison utilisée comme presbytère.',
          'Les célébrations dominicales ont lieu dans des écoles du quartier.',
        ],
        imageKind: 'ai-illustration',
        sourceLabel: 'Récit historique accepté de l’ancien site',
        disclosure:
          'Les personnes et les lieux représentés sont des reconstitutions artistiques non documentaires.',
      },
      {
        id: 'construction-eglise',
        periodLabel: '1963–1964',
        title: 'Construction de l’église',
        summary:
          'Roger D’Astous et Jean-Paul Pothier sont associés à la conception du bâtiment, dont le presbytère est intégré au même édifice.',
        body: [
          'Le récit existant présente Roger D’Astous comme le principal concepteur du projet.',
        ],
        imageKind: 'ai-illustration',
        sourceLabel: 'Récit historique accepté de l’ancien site',
        disclosure:
          'La scène de chantier et les portraits sont des interprétations artistiques, non des archives authentiques.',
      },
      {
        id: 'architecture-1964',
        periodLabel: '1964',
        title: 'Une architecture unique',
        summary:
          'Le liège, la brique rouge, le bois foncé et le béton contribuent à créer un contraste marqué entre la nef plus sobre et le chœur très éclairé.',
        body: [
          'Le plan rectangulaire et le large paravent de béton accompagnent la transition entre la rue et le lieu de culte.',
          'Le récit attribue la fabrication des bancs à Henri Boisvert et les éléments de fer forgé à Desmarais et Robitaille.',
        ],
        imageKind: 'ai-illustration',
        sourceLabel: 'Récit historique accepté de l’ancien site',
      },
      {
        id: 'evolution-vers-1990',
        periodLabel: 'Vers 1990',
        title: 'Le bâtiment évolue',
        summary:
          'La salle communautaire du sous-sol est transformée en friperie, tandis que d’autres espaces sont réaménagés pour répondre aux besoins de la communauté.',
        body: [
          'Le baptistère est ensuite réaménagé en chapelle et la tribune arrière est divisée afin de créer une pièce.',
        ],
        imageKind: 'ai-illustration',
        sourceLabel: 'Récit historique accepté de l’ancien site',
        disclosure:
          'Les scènes représentées sont des interprétations artistiques et non des photographies des transformations.',
      },
      {
        id: 'consecration-2018',
        periodLabel: '6 mai 2018',
        title: 'Consécration de l’église et de l’autel',
        summary:
          'Une plaque photographiée dans l’église indique que l’église Saint-René-Goupil et son autel majeur ont été consacrés par Mgr Christian Lépine.',
        imageKind: 'documentary-photo',
        sourceLabel: 'Repère documentaire — photographie prise dans l’église',
        disclosure:
          'La photographie documente la plaque présente dans l’église; sa transcription éditoriale reste à confirmer avec la paroisse.',
      },
      {
        id: 'patrimoine-vivant',
        periodLabel: 'Aujourd’hui',
        title: 'Un patrimoine vivant',
        summary:
          'L’église demeure un lieu de foi, d’entraide, de rencontre et de culture au cœur du quartier.',
        imageKind: 'ai-illustration',
        sourceLabel:
          'Synthèse éditoriale générale; activités actuelles à confirmer',
        disclosure:
          'Le rassemblement représenté est une scène artistique; il ne documente pas un événement précis.',
      },
    ],
    epilogue: {
      eyebrow: 'Architecture et communauté',
      title: 'Un repère architectural et communautaire',
      paragraphs: [
        'Ses clochers, son presbytère intégré et son paravent de béton composent un repère architectural distinctif dans le quartier.',
        'À l’intérieur, le contraste entre la nef plus sombre et le chœur éclairé accompagne un lieu dont les espaces ont évolué avec les besoins de la communauté.',
      ],
    },
  },
  principles: {
    eyebrow: 'Ce qui nous rassemble',
    title: 'Foi, rencontre et solidarité',
    items: [
      {
        title: 'Prière',
        description:
          'Les célébrations et les temps de recueillement donnent un rythme à la vie de la communauté.',
        symbol: 'book',
      },
      {
        title: 'Rencontre',
        description:
          'La paroisse souhaite demeurer un lieu où les personnes peuvent se retrouver et cheminer ensemble.',
        symbol: 'people',
      },
      {
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
        title: 'Bois, brique et béton',
        description:
          'Une palette de matériaux bruts structure l’intérieur et son atmosphère.',
      },
      {
        title: 'Lumière naturelle',
        description:
          'Les ouvertures au-dessus du chœur dirigent la lumière vers l’autel.',
      },
      {
        title: 'Nef et chœur',
        description:
          'Le contraste entre une nef plus sombre et un chœur clair souligne l’axe central.',
      },
      {
        title: 'Parcours d’entrée',
        description:
          'Les documents décrivent une transition marquée entre la rue et l’espace de célébration.',
      },
      {
        title: 'Éléments verticaux',
        description:
          'Plusieurs structures portant des cloches signalent le bâtiment dans son environnement.',
      },
      {
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
        name: 'Roger D’Astous',
        role: 'Architecte principal — attribution à confirmer',
        description:
          'Les documents existants lui attribuent le rôle principal dans la conception de l’église.',
        confirmationRequired: true,
      },
      {
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
    primaryCta: {
      label: 'Préparer une première visite',
      href: '/premiere-visite/',
    },
    secondaryCta: {
      label: 'Nous joindre',
      href: '/contact/',
    },
  },
} as const satisfies AboutPageData;
