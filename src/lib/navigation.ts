export type SitePath =
  | '/'
  | '/notre-paroisse'
  | '/horaires'
  | '/vie-paroissiale'
  | '/nos-services'
  | '/sacrements'
  | '/evenements'
  | '/feuillets-paroissiaux'
  | '/friperie'
  | '/location-de-salle'
  | '/galerie'
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
] as const satisfies readonly NavigationItem[];

export const informationRouteDefinitions = [
  {
    label: 'Feuillets paroissiaux',
    href: '/feuillets-paroissiaux',
    active: false,
  },
  { label: 'Friperie', href: '/friperie', active: true },
  { label: 'Location de salle', href: '/location-de-salle', active: false },
  { label: 'Galerie', href: '/galerie', active: true },
  { label: 'Contact', href: '/contact', active: true },
] as const satisfies readonly NavigationRouteDefinition[];

export const informationNavigation = informationRouteDefinitions.filter(
  ({ active }) => active,
);

export function isInformationRoutePublic(href: SitePath): boolean {
  return (
    informationRouteDefinitions.find((item) => item.href === href)?.active ??
    false
  );
}

export const firstVisitNavigation = {
  label: 'Première visite',
  href: '/premiere-visite',
} as const satisfies NavigationItem;

export const scheduleNavigation = {
  label: 'Voir les horaires',
  href: '/horaires',
} as const satisfies NavigationItem;

export const legalNavigation = [
  {
    label: 'Politique de confidentialité',
    href: '/politique-de-confidentialite',
  },
  { label: 'Mentions légales', href: '/mentions-legales' },
] as const satisfies readonly NavigationItem[];
