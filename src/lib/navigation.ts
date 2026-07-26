export type SitePath =
  | '/'
  | '/notre-paroisse'
  | '/horaires'
  | '/vie-paroissiale'
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

export const primaryNavigation = [
  { label: 'Accueil', href: '/' },
  { label: 'Notre paroisse', href: '/notre-paroisse' },
  { label: 'Horaires', href: '/horaires' },
  { label: 'Vie paroissiale', href: '/vie-paroissiale' },
  { label: 'Sacrements', href: '/sacrements' },
  { label: 'Événements', href: '/evenements' },
] as const satisfies readonly NavigationItem[];

export const informationNavigation = [
  { label: 'Feuillets paroissiaux', href: '/feuillets-paroissiaux' },
  { label: 'Friperie', href: '/friperie' },
  { label: 'Location de salle', href: '/location-de-salle' },
  { label: 'Galerie', href: '/galerie' },
  { label: 'Contact', href: '/contact' },
] as const satisfies readonly NavigationItem[];

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
