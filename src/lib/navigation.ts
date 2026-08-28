export type SitePath =
  | '/'
  | '/notre-paroisse'
  | '/horaires'
  | '/vie-paroissiale'
  | '/nos-services'
  | '/sacrements'
  | '/evenements'
  | '/friperie'
  | '/location-de-salle'
  | '/galerie'
  | '/nos-annonceurs'
  | '/merci-a-nos-annonceurs'
  | '/contact'
  | '/premiere-visite'
  | '/politique-de-confidentialite'
  | '/mentions-legales';

export interface NavigationItem {
  label: string;
  href: SitePath;
}

export interface NavigationRouteDefinition extends NavigationItem {
  active: boolean;
}

export const primaryNavigation = [
  { label: 'Accueil', href: '/' },
  { label: 'Notre paroisse', href: '/notre-paroisse' },
  { label: 'Horaires', href: '/horaires' },
  { label: 'Vie paroissiale', href: '/vie-paroissiale' },
  { label: 'Nos services', href: '/nos-services' },
  { label: 'Événements', href: '/evenements' },
  { label: 'Friperie', href: '/friperie' },
] as const satisfies readonly NavigationItem[];

/**
 * La friperie a quitté ce groupe pour la navigation principale : c'est le
 * service que la paroisse met le plus en avant, et il était rangé derrière un
 * menu déroulant que personne n'ouvre.
 */
const informationRouteDefinitions = [
  { label: 'Location de salle', href: '/location-de-salle', active: false },
  { label: 'Galerie', href: '/galerie', active: false },
  { label: 'Nos annonceurs', href: '/nos-annonceurs', active: true },
  { label: 'Contact', href: '/contact', active: true },
] as const satisfies readonly NavigationRouteDefinition[];

export const informationNavigation = informationRouteDefinitions.filter(
  ({ active }) => active,
);

export const firstVisitNavigation = {
  label: 'Première visite',
  href: '/premiere-visite',
} as const satisfies NavigationItem;

export const scheduleNavigation = {
  label: 'Voir les horaires',
  href: '/horaires',
} as const satisfies NavigationItem;

/**
 * Raccourci vers la page Contact.
 *
 * La barre d'actions rapides menait auparavant à un appel direct. Le
 * secrétariat reçoit ces appels à domicile à toute heure, alors le raccourci
 * mène désormais aux coordonnées complètes : la personne y trouve le numéro,
 * les heures d'ouverture et de quoi écrire, et choisit son moment.
 */
export const contactNavigation = {
  label: 'Contact',
  href: '/contact',
} as const satisfies NavigationItem;

export const legalNavigation = [
  {
    label: 'Politique de confidentialité',
    href: '/politique-de-confidentialite',
  },
  { label: 'Mentions légales', href: '/mentions-legales' },
] as const satisfies readonly NavigationItem[];
