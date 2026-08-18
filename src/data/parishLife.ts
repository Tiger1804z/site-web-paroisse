import worshipAiImage from '@/assets/images/parish-life/hero/alanajordan-worship-ai.jpg';
import childrenWorkshopAiImage from '@/assets/images/parish-life/hero/tylijura-children-workshop-ai.png';
import churchGatheringImage from '@/assets/images/parish-life/hero/tylijura-church-gathering-illustration.jpg';
import marguilliersImage from '@/assets/images/paroisse/autel-decor-violet-01.jpg';
import youngPeopleImage from '@/assets/images/paroisse/autel-eclairage-rose-01.jpg';
import ladiesImage from '@/assets/images/paroisse/autel-fleurs-blanches-01.jpg';
import choirImage from '@/assets/images/paroisse/interieur-eglise-decor-violet-01.jpg';
import { SITE_NAME } from '@/lib/site';
import type { ParishLifePageData } from '@/types/parishLife';

export const parishLifePageData = {
  seo: {
    title: 'Vie paroissiale',
    description: `Découvrez les façons de participer à la vie de la ${SITE_NAME}, ses événements, ses célébrations et ses initiatives d’entraide.`,
  },
  hero: {
    eyebrow: 'Communauté',
    title: 'Vivre la paroisse',
    introduction:
      'Découvrez les rencontres, les célébrations et les initiatives qui tissent des liens dans notre communauté.',
    images: [
      {
        kind: 'image',
        image: churchGatheringImage,
        alt: 'Illustration artistique de personnes rassemblées à l’entrée d’une église; scène non documentaire',
        label: 'Une communauté rassemblée',
        desktopPosition: 'center 48%',
        mobilePosition: 'center 48%',
        documentary: false,
        generationStatus: 'unconfirmed',
        credit:
          'Image fournie par l’utilisateur; auteur indiqué « Tylijura » dans le nom du fichier, source et licence exactes à archiver.',
      },
      {
        kind: 'image',
        image: worshipAiImage,
        alt: 'Illustration artistique monochrome d’une femme chantant entourée d’une communauté; personnes fictives',
        label: 'Le chant et la prière',
        desktopPosition: 'center 43%',
        mobilePosition: 'center 38%',
        documentary: false,
        generationStatus: 'ai-generated',
        credit:
          'Image générée par IA fournie par l’utilisateur; auteur indiqué « Alanajordan » dans le nom du fichier, source et licence exactes à archiver.',
      },
      {
        kind: 'image',
        image: childrenWorkshopAiImage,
        alt: 'Illustration artistique d’enfants participant à un atelier créatif; personnages fictifs',
        label: 'Grandir ensemble',
        desktopPosition: 'center 48%',
        mobilePosition: 'center 48%',
        documentary: false,
        generationStatus: 'ai-generated',
        credit:
          'Image générée par IA fournie par l’utilisateur; auteur indiqué « Tylijura » dans le nom du fichier, source et licence exactes à archiver.',
      },
    ],
  },
  introduction: {
    eyebrow: 'Vie communautaire',
    title: 'Une paroisse, plusieurs visages',
    paragraphs: [
      'La vie paroissiale se tisse dans la diversité des personnes qui se rassemblent, célèbrent, s’entraident et prennent part à la communauté.',
      'Les groupes présentés dans la maquette constituent des points de repère éditoriaux; leurs activités actuelles doivent encore être validées.',
    ],
    confirmationNote:
      'Les groupes actifs, leurs responsables et leurs modalités de rencontre seront présentés après confirmation auprès de la paroisse.',
  },
  features: [
    {
      id: 'jeunes',
      eyebrow: 'Groupe',
      title: 'Jeunes',
      summary:
        'La maquette présente un espace destiné aux adolescents et aux jeunes adultes. Son existence actuelle, son public et ses activités doivent être confirmés par la paroisse.',
      highlights: [
        'Activités et fréquence à confirmer',
        'Responsable et coordonnées à confirmer',
      ],
      visual: {
        kind: 'image',
        image: youngPeopleImage,
        alt: 'Autel fleuri sous un éclairage rose dans l’église',
        desktopPosition: 'center 52%',
        mobilePosition: 'center 52%',
      },
      cta: {
        label: 'Demander de l’information',
        href: '/contact/',
      },
      active: true,
    },
    {
      id: 'chorale',
      eyebrow: 'Groupe',
      title: 'Chorale',
      summary:
        'La maquette mentionne une chorale associée à l’animation des célébrations. Son fonctionnement, ses pratiques et ses modalités de participation restent à confirmer.',
      highlights: [
        'Pratiques et participation à confirmer',
        'Responsable et coordonnées à confirmer',
      ],
      visual: {
        kind: 'image',
        image: choirImage,
        alt: 'Vue large de la nef et de l’autel avec un décor violet',
        desktopPosition: 'center 50%',
        mobilePosition: 'center 50%',
      },
      cta: {
        label: 'Demander de l’information',
        href: '/contact/',
      },
      active: true,
    },
    {
      id: 'dames-fils-notre-dame',
      eyebrow: 'Groupe',
      title: 'Dames et Fils de Notre-Dame',
      summary:
        'Ce groupe est nommé dans la maquette comme un lieu de dévotion mariale et d’entraide. Sa mission actuelle et ses activités doivent être confirmées.',
      highlights: [
        'Mission et activités à confirmer',
        'Responsable et coordonnées à confirmer',
      ],
      visual: {
        kind: 'image',
        image: ladiesImage,
        alt: 'Vue large de l’autel entouré de fleurs blanches',
        desktopPosition: 'center 48%',
        mobilePosition: 'center 48%',
      },
      cta: {
        label: 'Demander de l’information',
        href: '/contact/',
      },
      active: true,
    },
    {
      id: 'marguilliers',
      eyebrow: 'Groupe',
      title: 'Marguilliers',
      summary:
        'La maquette présente les marguilliers parmi les groupes de la paroisse. La composition actuelle, les responsabilités et les coordonnées doivent être validées avant publication définitive.',
      highlights: [
        'Composition et responsabilités à confirmer',
        'Coordonnées des responsables à confirmer',
      ],
      visual: {
        kind: 'image',
        image: marguilliersImage,
        alt: 'Vue frontale de l’autel fleuri sous un éclairage violet',
        desktopPosition: 'center 48%',
        mobilePosition: 'center 48%',
      },
      cta: {
        label: 'Communiquer avec la paroisse',
        href: '/contact/',
      },
      active: true,
    },
  ],
  participation: {
    accent: 'Ensemble',
    title: 'Vous souhaitez vous impliquer?',
    description:
      'Votre présence et votre engagement peuvent enrichir la communauté. Communiquez avec la paroisse pour connaître les besoins et les groupes actuellement actifs.',
    cta: {
      label: 'Communiquer avec la paroisse',
      href: '/contact/',
    },
  },
} as const satisfies ParishLifePageData;
