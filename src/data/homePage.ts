import type { HomePageData } from '@/types/homePage';

/**
 * Repli local de la page d'accueil.
 *
 * Reprend mot pour mot ce que les composants affichaient avant la migration :
 * si Sanity ne répond pas au build, l'accueil reste exactement celui-ci plutôt
 * que de perdre ses titres.
 */
export const homePageData = {
  hero: {
    script: 'Bienvenue',
    titleLines: ['Un lieu de foi,', 'de paix et', 'de rencontre.'],
    introduction:
      'Bienvenue à la Paroisse Saint-René-Goupil. Découvrez nos célébrations, nos activités et la vie de notre communauté.',
    primaryCtaLabel: 'Voir les horaires',
    secondaryCtaLabel: 'Découvrir la paroisse',
    scheduleTitle: 'Horaires des messes',
    scheduleLinkLabel: 'Consulter tous les horaires',
    scheduleNote:
      'Horaires sujets à changement lors des célébrations spéciales.',
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
    specialDescription:
      'Consultez les annonces récentes avant de vous déplacer.',
  },
  parishLife: {
    eyebrow: 'Communauté',
    title: 'Vivre la paroisse',
    introduction:
      'Des espaces de rencontre, de service et de prière qui prennent vie grâce à l’engagement de la communauté.',
    // Les noms repris ici sont ceux de la page Vie paroissiale au moment de la
    // migration. Ils ne servent que si Sanity ne répond pas : en marche
    // normale, le nom est relu à la source.
    groups: [
      {
        id: 'jeunes',
        name: 'Jeunes',
        teaser: 'Activités et rassemblements pour la jeunesse',
      },
      {
        id: 'chorale',
        name: 'Chorale',
        teaser: 'Chant liturgique et animation des célébrations',
      },
      {
        id: 'dames-fils-notre-dame',
        name: 'Dames et Fils de Notre-Dame',
        teaser: 'Dévotion mariale et entraide communautaire',
      },
      {
        id: 'marguilliers',
        name: 'Marguilliers',
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
        label: 'Mariage et baptême',
        target: 'sacrements-et-initiation',
        href: '/nos-services/#sacrements-et-initiation',
      },
      {
        label: 'Communion, confirmation et catéchuménat',
        target: 'sacrements-et-initiation',
        href: '/nos-services/#sacrements-et-initiation',
      },
      {
        label: 'Funérailles et certificats',
        target: 'accompagnement-et-documents',
        href: '/nos-services/#accompagnement-et-documents',
      },
      {
        label: 'Messes, lampions et intentions',
        target: 'priere-et-memoire',
        href: '/nos-services/#priere-et-memoire',
      },
      {
        label: 'Location de salle',
        target: 'location-de-salle',
        href: '/nos-services/#location-de-salle',
      },
    ],
    ctaLabel: 'Explorer tous nos services',
    visualNote: 'Accueil · célébration · accompagnement',
    thrift: {
      eyebrow: 'Service communautaire',
      title: 'La friperie',
      description:
        'Un lieu de réemploi et d’entraide, présenté dans un espace dédié.',
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
  gallery: {
    eyebrow: 'Photographie',
    title: 'La paroisse en images',
    // Aucun repli : les photographies vivent dans le Studio. Si Sanity ne
    // répond pas, la section disparaît plutôt que d'afficher des images que la
    // paroisse ne contrôlerait plus.
    items: [],
  },
  visit: {
    eyebrow: 'Nous joindre',
    title: 'Venez nous rencontrer',
    introduction:
      'Une présence accueillante au cœur du quartier. Retrouvez les coordonnées confirmées de la paroisse ou préparez votre demande sur la page Contact.',
    contactCtaLabel: 'Nous joindre',
    directionsCtaLabel: 'Obtenir l’itinéraire',
  },
} as const satisfies HomePageData;
