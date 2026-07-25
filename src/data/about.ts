import architectureImage from '@/assets/images/paroisse/nef-vue-generale-02.webp';
import heroImage from '@/assets/images/paroisse/eglise-exterieur-identification-01.webp';
import historyImage from '@/assets/images/paroisse/eglise-exterieur-jardin-01.webp';
import consecrationImage from '@/assets/images/paroisse/plaque-consecration-01.webp';
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
    eyebrow: 'Fondation',
    title: 'Histoire de la paroisse',
    introduction:
      'Les repères conservés dans les documents existants permettent de retracer les grandes étapes du lieu. Ils demeurent soumis à une validation éditoriale de la paroisse.',
    entries: [
      {
        id: 'erection-paroisse',
        dateLabel: '1959',
        title: 'Création de la paroisse',
        description:
          'Le récit historique existant situe l’érection de la communauté en paroisse au 23 février 1959.',
        status: 'legacy-source',
      },
      {
        id: 'acquisition-terrain',
        dateLabel: 'L’année suivante',
        title: 'Un terrain pour la communauté',
        description:
          'Le même récit indique qu’un terrain aurait été acquis l’année suivant la création de la paroisse.',
        status: 'to-confirm',
      },
      {
        id: 'construction-eglise',
        dateLabel: '1963–1964',
        title: 'Construction de l’église',
        description:
          'Les documents disponibles associent cette période à la construction du bâtiment actuel.',
        status: 'legacy-source',
      },
    ],
    supportingImage: {
      image: historyImage,
      alt: 'Vue extérieure verticale de l’église, de la pelouse et des structures portant des cloches',
      desktopPosition: 'center center',
      mobilePosition: 'center 45%',
    },
    consecration: {
      eyebrow: 'Repère photographique',
      title: 'Consécration de l’église et de l’autel',
      dateLabel: '6 mai 2018',
      description:
        'Une plaque photographiée indique que l’église Saint-René-Goupil et son autel majeur ont été consacrés par Mgr Christian Lépine.',
      sourceNote:
        'Information extraite d’une photographie et à confirmer auprès de la paroisse avant publication.',
      status: 'photo-source',
      image: {
        image: consecrationImage,
        alt: 'Plaque de consécration placée sous une croix',
        desktopPosition: 'center 44%',
        mobilePosition: 'center 42%',
        caption:
          'Plaque photographiée dans l’église; transcription et formulation éditoriale à confirmer.',
      },
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
