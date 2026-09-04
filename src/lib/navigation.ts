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

/**
 * La barre de navigation : une page, un onglet, aucun menu déroulant.
 *
 * Le menu « Informations » a disparu. Il cachait la location de salle, les
 * annonceurs et le contact derrière un geste que personne ne faisait, et la
 * paroisse a demandé que ces trois pages se voient. Un menu à deux entrées ne
 * range rien : il ajoute un clic.
 *
 * « Accueil » n'y figure plus non plus. Le logo mène à l'accueil sur toutes les
 * pages, c'est la convention que tout le monde connaît, et la place gagnée sert
 * aux pages qui, elles, ne s'atteignent pas autrement. Le pied de page garde le
 * lien écrit, pour qui ne devine pas qu'un logo se clique.
 *
 * L'ordre suit le parcours d'une personne qui découvre la paroisse : qui nous
 * sommes, ce qu'on y vit, quand venir, ce qui s'y passe, puis les services.
 */
export const primaryNavigation = [
  { label: 'Notre paroisse', href: '/notre-paroisse' },
  { label: 'Vie paroissiale', href: '/vie-paroissiale' },
  { label: 'Horaires', href: '/horaires' },
  { label: 'Événements', href: '/evenements' },
  { label: 'Nos services', href: '/nos-services' },
  { label: 'Friperie', href: '/friperie' },
  { label: 'Location de salle', href: '/location-de-salle' },
  { label: 'Nos annonceurs', href: '/nos-annonceurs' },
  { label: 'Contact', href: '/contact' },
] as const satisfies readonly NavigationItem[];

/**
 * Les deux liens que la barre de navigation ne porte plus.
 *
 * « Première visite » a quitté les onglets : c'est une page qu'on lit une fois,
 * pas une destination qu'on cherche chaque semaine. Elle reste ici, et une
 * carte de la page Horaires y mène au moment où la question se pose vraiment —
 * quand quelqu'un vient de regarder à quelle heure venir.
 */
export const footerSecondaryNavigation = [
  { label: 'Accueil', href: '/' },
  { label: 'Première visite', href: '/premiere-visite' },
] as const satisfies readonly NavigationItem[];

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
