import architectureImage from '@/assets/images/paroisse/nef-vue-generale-02.webp';
import heroImage from '@/assets/images/paroisse/eglise-exterieur-identification-01.webp';
import consecrationImage from '@/assets/images/paroisse/plaque-consecration-01.webp';
import historyBefore1959Image from '@/assets/images/history-timeline/01-avant-1959.png';
import historyFoundation1959Image from '@/assets/images/history-timeline/02-fondation-1959.png';
import historyLand1960Image from '@/assets/images/history-timeline/03-achat-terrain-1960.png';
import historyWithoutChurchImage from '@/assets/images/history-timeline/04-paroisse-sans-eglise-1959-1963.png';
import historyConstructionImage from '@/assets/images/history-timeline/05-construction-eglise-1963-1964.png';
import historyArchitectureImage from '@/assets/images/history-timeline/06-architecture-1964.png';
import historyEvolutionImage from '@/assets/images/history-timeline/07-evolution-vers-1990.png';
import historyTodayImage from '@/assets/images/history-timeline/08-patrimoine-vivant-aujourdhui.png';
import type { AboutPageData } from '@/types/about';

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
    image: {
      image: heroImage,
      alt: 'Vue extérieure du bâtiment de l’église et de son identification',
      desktopPosition: 'center 47%',
      mobilePosition: '48% center',
    },
  },
  introduction: {
    eyebrow: 'Bienvenue',
    title: 'Un lieu de foi et de rencontre',
    accent: 'Ensemble',
    paragraphs: [
      'La Paroisse Saint-René-Goupil rassemble des personnes de tous les âges autour de la prière, de la rencontre et de la solidarité.',
      'Son église offre un cadre architectural singulier où le bois, la brique, le béton et la lumière accompagnent les célébrations et la vie communautaire.',
    ],
    status: 'temporary',
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
        stepNumber: 1,
        periodLabel: 'Avant 1959',
        title: 'Un quartier en développement',
        summary:
          'Une communauté grandit dans le secteur et aspire à disposer d’un lieu où se rassembler.',
        image: historyBefore1959Image,
        imageAlt:
          'Illustration artistique d’une vue aérienne du quartier avant la construction de l’église.',
        imageKind: 'ai-illustration',
        embeddedText: true,
        sourceLabel: 'Récit historique accepté de l’ancien site',
        editorialStatus: 'accepted-source',
        disclosure:
          'Vue urbaine reconstituée artistiquement; elle ne représente ni une photographie aérienne ni un plan authentique.',
      },
      {
        id: 'fondation-1959',
        stepNumber: 2,
        periodLabel: '23 février 1959',
        title: 'Fondation de la paroisse',
        summary:
          'La communauté est érigée en paroisse par le cardinal Paul-Émile Léger.',
        image: historyFoundation1959Image,
        imageAlt:
          'Illustration artistique représentant un document d’érection paroissiale et un portrait non documentaire du cardinal Paul-Émile Léger.',
        imageKind: 'ai-illustration',
        embeddedText: true,
        sourceLabel: 'Récit historique accepté de l’ancien site',
        editorialStatus: 'accepted-source',
        disclosure:
          'Le portrait et le document représentés sont des créations artistiques et non des reproductions historiques.',
      },
      {
        id: 'achat-terrain-1960',
        stepNumber: 3,
        periodLabel: '1960',
        title: 'Achat du terrain',
        summary:
          'Un terrain situé à proximité de la rue Denis-Papin, de la 25e Avenue et du parc René-Goupil est acquis pour la future église.',
        image: historyLand1960Image,
        imageAlt:
          'Illustration artistique d’un terrain et d’un plan stylisé indiquant l’emplacement prévu pour l’église.',
        imageKind: 'ai-illustration',
        embeddedText: true,
        sourceLabel: 'Récit historique accepté de l’ancien site',
        editorialStatus: 'accepted-source',
        disclosure:
          'Le plan illustré est une interprétation graphique; il ne constitue pas un plan cadastral authentique.',
      },
      {
        id: 'paroisse-sans-eglise',
        stepNumber: 4,
        periodLabel: '1959–1963',
        title: 'Une paroisse sans église',
        summary:
          'Avant l’achèvement du lieu de culte, la communauté se rassemble dans des espaces temporaires du quartier.',
        body: [
          'Les messes de semaine sont célébrées au sous-sol d’une maison utilisée comme presbytère.',
          'Les célébrations dominicales ont lieu dans des écoles du quartier.',
        ],
        image: historyWithoutChurchImage,
        imageAlt:
          'Illustration artistique de célébrations paroissiales temporaires dans une maison et une école du quartier.',
        imageKind: 'ai-illustration',
        embeddedText: true,
        sourceLabel: 'Récit historique accepté de l’ancien site',
        editorialStatus: 'accepted-source',
        disclosure:
          'Les personnes et les lieux représentés sont des reconstitutions artistiques non documentaires.',
      },
      {
        id: 'construction-eglise',
        stepNumber: 5,
        periodLabel: '1963–1964',
        title: 'Construction de l’église',
        summary:
          'Roger D’Astous et Jean-Paul Pothier sont associés à la conception du bâtiment, dont le presbytère est intégré au même édifice.',
        body: [
          'Le récit existant présente Roger D’Astous comme le principal concepteur du projet.',
        ],
        image: historyConstructionImage,
        imageAlt:
          'Illustration artistique de l’église en construction accompagnée de portraits non documentaires des architectes.',
        imageKind: 'ai-illustration',
        embeddedText: true,
        sourceLabel: 'Récit historique accepté de l’ancien site',
        editorialStatus: 'accepted-source',
        disclosure:
          'La scène de chantier et les portraits sont des interprétations artistiques, non des archives authentiques.',
      },
      {
        id: 'architecture-1964',
        stepNumber: 6,
        periodLabel: '1964',
        title: 'Une architecture unique',
        summary:
          'Le liège, la brique rouge, le bois foncé et le béton contribuent à créer un contraste marqué entre la nef plus sobre et le chœur très éclairé.',
        body: [
          'Le plan rectangulaire et le large paravent de béton accompagnent la transition entre la rue et le lieu de culte.',
          'Le récit attribue la fabrication des bancs à Henri Boisvert et les éléments de fer forgé à Desmarais et Robitaille.',
        ],
        image: historyArchitectureImage,
        imageAlt:
          'Illustration artistique de la nef sombre, du chœur lumineux et des matériaux caractéristiques de l’église.',
        imageKind: 'ai-illustration',
        embeddedText: true,
        sourceLabel: 'Récit historique accepté de l’ancien site',
        editorialStatus: 'accepted-source',
      },
      {
        id: 'evolution-vers-1990',
        stepNumber: 7,
        periodLabel: 'Vers 1990',
        title: 'Le bâtiment évolue',
        summary:
          'La salle communautaire du sous-sol est transformée en friperie, tandis que d’autres espaces sont réaménagés pour répondre aux besoins de la communauté.',
        body: [
          'Le baptistère est ensuite réaménagé en chapelle et la tribune arrière est divisée afin de créer une pièce.',
        ],
        image: historyEvolutionImage,
        imageAlt:
          'Illustration artistique en collage des transformations intérieures et des activités communautaires autour de 1990.',
        imageKind: 'ai-illustration',
        embeddedText: true,
        sourceLabel: 'Récit historique accepté de l’ancien site',
        editorialStatus: 'accepted-source',
        disclosure:
          'Les scènes représentées sont des interprétations artistiques et non des photographies des transformations.',
      },
      {
        id: 'consecration-2018',
        stepNumber: 8,
        periodLabel: '6 mai 2018',
        title: 'Consécration de l’église et de l’autel',
        summary:
          'Une plaque photographiée dans l’église indique que l’église Saint-René-Goupil et son autel majeur ont été consacrés par Mgr Christian Lépine.',
        image: consecrationImage,
        imageAlt:
          'Plaque de consécration de l’église et de l’autel placée sous une croix.',
        imageKind: 'documentary-photo',
        embeddedText: true,
        sourceLabel: 'Repère documentaire — photographie prise dans l’église',
        editorialStatus: 'to-confirm',
        disclosure:
          'La photographie documente la plaque présente dans l’église; sa transcription éditoriale reste à confirmer avec la paroisse.',
      },
      {
        id: 'patrimoine-vivant',
        stepNumber: 9,
        periodLabel: 'Aujourd’hui',
        title: 'Un patrimoine vivant',
        summary:
          'L’église demeure un lieu de foi, d’entraide, de rencontre et de culture au cœur du quartier.',
        image: historyTodayImage,
        imageAlt:
          'Illustration artistique d’un rassemblement communautaire devant l’église éclairée en soirée.',
        imageKind: 'ai-illustration',
        embeddedText: true,
        sourceLabel:
          'Synthèse éditoriale générale; activités actuelles à confirmer',
        editorialStatus: 'volatile',
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
        id: 'priere',
        title: 'Prière',
        description:
          'Les célébrations et les temps de recueillement donnent un rythme à la vie de la communauté.',
        symbol: 'book',
        status: 'temporary',
      },
      {
        id: 'rencontre',
        title: 'Rencontre',
        description:
          'La paroisse souhaite demeurer un lieu où les personnes peuvent se retrouver et cheminer ensemble.',
        symbol: 'people',
        status: 'temporary',
      },
      {
        id: 'solidarite',
        title: 'Solidarité',
        description:
          'L’entraide et l’attention portée aux autres inspirent la présence de la paroisse dans son milieu.',
        symbol: 'heart',
        status: 'temporary',
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
    image: {
      image: architectureImage,
      alt: 'Vue intérieure de l’autel, des murs de brique, des poutres de bois et des puits de lumière',
      desktopPosition: 'center 42%',
      mobilePosition: 'center 42%',
    },
    features: [
      {
        id: 'materiaux',
        title: 'Bois, brique et béton',
        description:
          'Une palette de matériaux bruts structure l’intérieur et son atmosphère.',
        status: 'legacy-source',
      },
      {
        id: 'lumiere',
        title: 'Lumière naturelle',
        description:
          'Les ouvertures au-dessus du chœur dirigent la lumière vers l’autel.',
        status: 'probably-stable',
      },
      {
        id: 'nef-choeur',
        title: 'Nef et chœur',
        description:
          'Le contraste entre une nef plus sombre et un chœur clair souligne l’axe central.',
        status: 'legacy-source',
      },
      {
        id: 'entree',
        title: 'Parcours d’entrée',
        description:
          'Les documents décrivent une transition marquée entre la rue et l’espace de célébration.',
        status: 'legacy-source',
      },
      {
        id: 'clochers',
        title: 'Éléments verticaux',
        description:
          'Plusieurs structures portant des cloches signalent le bâtiment dans son environnement.',
        status: 'to-confirm',
      },
      {
        id: 'presbytere',
        title: 'Presbytère intégré',
        description:
          'Le récit historique présente le presbytère comme une partie intégrée à l’ensemble.',
        status: 'to-confirm',
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
        id: 'roger-dastous',
        name: 'Roger D’Astous',
        role: 'Architecte principal — attribution à confirmer',
        description:
          'Les documents existants lui attribuent le rôle principal dans la conception de l’église.',
        confirmationRequired: true,
      },
      {
        id: 'jean-paul-pothier',
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
