import {defineDocuments, defineLocations} from 'sanity/presentation'

/**
 * Le pont entre un document Sanity et une adresse du site.
 *
 * Deux directions, complémentaires :
 * - `locations` répond à « où ce document apparaît-il ? », pour afficher les
 *   liens « Ouvrir dans Presentation » depuis un document;
 * - `mainDocuments` répond à l'inverse, « quelle page regarde-t-on ? », pour
 *   que Presentation ouvre le bon document quand l'éditrice navigue.
 *
 * Le site n'a aucune route dynamique alimentée par Sanity : chaque document
 * migré correspond à une page fixe. Les événements font exception — ils n'ont
 * pas de page à eux, ils s'affichent dans la liste de `/evenements/` et sur
 * l'accueil.
 */

/**
 * Adresse du site prévisualisé. En développement, `astro dev` sert sur 4321.
 * Un environnement de prévisualisation déployé fournira la sienne.
 */
export const previewUrl = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321'

const HOME: {title: string; href: string} = {title: 'Accueil', href: '/'}

export const locations = {
  thriftStorePage: defineLocations({
    locations: [{title: 'Page Friperie', href: '/friperie/'}],
  }),
  // La friperie est une donnée partagée : ses heures et son téléphone
  // s'afficheront ailleurs que sur sa page à mesure que le site avance.
  thriftStore: defineLocations({
    locations: [{title: 'Page Friperie', href: '/friperie/'}],
  }),
  eventsPage: defineLocations({
    locations: [{title: 'Page Événements', href: '/evenements/'}],
  }),
  servicesPage: defineLocations({
    locations: [{title: 'Page Nos services', href: '/nos-services/'}],
  }),
  parishLifePage: defineLocations({
    locations: [{title: 'Page Vie paroissiale', href: '/vie-paroissiale/'}],
  }),
  firstVisitPage: defineLocations({
    locations: [{title: 'Page Première visite', href: '/premiere-visite/'}],
  }),
  homePage: defineLocations({locations: [HOME]}),
  schedulePage: defineLocations({
    locations: [{title: 'Page Horaires', href: '/horaires/'}],
  }),
  massSchedule: defineLocations({
    locations: [{title: 'Page Horaires', href: '/horaires/'}, HOME],
  }),
  // Les coordonnées irriguent plus de pages qu'il n'y paraît : les heures du
  // secrétariat s'affichent sur Horaires, et Première visite lit l'adresse, le
  // téléphone, le stationnement et l'accessibilité.
  siteSettings: defineLocations({
    locations: [
      HOME,
      {title: 'Page Contact', href: '/contact/'},
      {title: 'Page Horaires', href: '/horaires/'},
      {title: 'Page Première visite', href: '/premiere-visite/'},
    ],
  }),
  parishEvent: defineLocations({
    select: {title: 'title'},
    resolve: (doc) => ({
      locations: [
        {
          title: doc?.title || 'Activité',
          href: '/evenements/',
        },
        HOME,
      ],
    }),
  }),
}

/**
 * Les routes sont déclarées avec et sans barre oblique finale : le site publie
 * des adresses terminées par `/`, mais Presentation peut interroger l'une ou
 * l'autre selon la navigation.
 */
export const mainDocuments = defineDocuments([
  {route: '/', filter: `_type == "homePage"`},
  {route: '/friperie', filter: `_type == "thriftStorePage"`},
  {route: '/friperie/', filter: `_type == "thriftStorePage"`},
  {route: '/evenements', filter: `_type == "eventsPage"`},
  {route: '/evenements/', filter: `_type == "eventsPage"`},
  {route: '/horaires', filter: `_type == "schedulePage"`},
  {route: '/horaires/', filter: `_type == "schedulePage"`},
  {route: '/nos-services', filter: `_type == "servicesPage"`},
  {route: '/nos-services/', filter: `_type == "servicesPage"`},
  {route: '/vie-paroissiale', filter: `_type == "parishLifePage"`},
  {route: '/vie-paroissiale/', filter: `_type == "parishLifePage"`},
  {route: '/premiere-visite', filter: `_type == "firstVisitPage"`},
  {route: '/premiere-visite/', filter: `_type == "firstVisitPage"`},
])
