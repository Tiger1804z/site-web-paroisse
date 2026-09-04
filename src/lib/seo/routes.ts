import { normalizeRoutePath } from './urls.ts';

/**
 * Le registre des routes du site : une entrée par page publiée, et une seule
 * réponse à la question « celle-ci va-t-elle dans Google? ».
 *
 * Avant ce fichier, la réponse était éparpillée dans neuf endroits — un
 * `noIndex` dans quatre fichiers de `src/data`, un autre dans cinq `.astro` —
 * et rien n'empêchait une page d'être à la fois interdite d'indexation et
 * annoncée dans le plan de site. Les deux affirmations se contredisent, et
 * c'est le genre de contradiction qu'un moteur de recherche tranche tout seul,
 * rarement dans le sens qu'on espérait.
 *
 * Le registre est donc la source unique : `BaseLayout` y lit la balise
 * `robots` et l'adresse canonique, `sitemap.xml` y lit qui entre. Une page
 * absente d'ici fait échouer le build de production — c'est voulu. On ne peut
 * pas ajouter une page sans dire si elle est publique.
 *
 * `canonicalPath` et `indexable` ne sont pas dans le Studio et n'y seront
 * jamais : une adresse canonique fausse ou un `noindex` posé par erreur ne se
 * voient pas dans une interface d'édition, et se paient en pages disparues des
 * résultats de recherche.
 */
export interface SiteRoute {
  /** Chemin servi, barre initiale et barre finale comprises. */
  readonly path: string;
  /** La page entre-t-elle dans le plan de site et dans l'index de Google? */
  readonly indexable: boolean;
  /**
   * Adresse canonique, quand la page renvoie son autorité ailleurs. Absente,
   * la page est canonique d'elle-même.
   */
  readonly canonicalPath?: string;
  /**
   * Document Sanity dont la date de modification date la page dans le plan de
   * site. Absent pour les pages qui n'ont pas de contenu éditorial.
   */
  readonly documentId?: string;
  /**
   * Page dont le texte vit dans le dépôt, pas dans le Studio.
   *
   * Les pages légales décrivent le fonctionnement technique du site : elles
   * doivent changer dans le même commit que le code qu'elles décrivent. Elles
   * entrent donc au plan de site sans `lastmod`, faute de document Sanity à
   * interroger — une date absente vaut mieux qu'une date fausse.
   */
  readonly contentInCode?: true;
  /** Pourquoi la page est fermée. Documentation, jamais rendue. */
  readonly closedBecause?: string;
}

export const SITE_ROUTES: readonly SiteRoute[] = [
  { path: '/', indexable: true, documentId: 'homePage' },
  { path: '/horaires/', indexable: true, documentId: 'schedulePage' },
  { path: '/evenements/', indexable: true, documentId: 'eventsPage' },
  // Ouverte le 2026-07-29 : nom, horaires, emplacement et téléphone sont
  // réels, et les visuels sont sous licence. Une personne qui cherche une
  // friperie dans le quartier doit pouvoir trouver cette page.
  { path: '/friperie/', indexable: true, documentId: 'thriftStorePage' },
  { path: '/nos-services/', indexable: true, documentId: 'servicesPage' },
  { path: '/vie-paroissiale/', indexable: true, documentId: 'parishLifePage' },
  // Ouverte le 2026-08-06, sur décision de l'utilisatrice. À savoir : les
  // quatre fiches publiées portent le téléphone et le courriel de personnes
  // réelles, et leur propre note de révision dit « à confirmer avant toute
  // publication ». Ces coordonnées sont donc indexables. Le réglage
  // `settings.showAdvertisers` masque les fiches sans refermer la page.
  { path: '/nos-annonceurs/', indexable: true, documentId: 'advertisersPage' },
  // Ouverte le 2026-08-06 : une paroisse introuvable sur une recherche
  // « contact » est un défaut, pas une protection. La page n'affiche que les
  // coordonnées publiques du secrétariat.
  { path: '/contact/', indexable: true, documentId: 'contactPage' },
  { path: '/notre-paroisse/', indexable: true, documentId: 'aboutPage' },
  { path: '/premiere-visite/', indexable: true, documentId: 'firstVisitPage' },
  // Rouverte le 2026-09-03, sur demande de la paroisse. L'adresse existait
  // depuis l'ancien site et n'a jamais cessé de recevoir des visites; elle
  // renvoyait vers une section de /nos-services/, ce qui coûtait un clic à
  // qui cherchait exactement cette page. Elle a maintenant son contenu, donc
  // elle est canonique d'elle-même : plus aucune canonique du registre ne la
  // désigne, et /nos-services/ ne parle plus de location de salle.
  {
    path: '/location-de-salle/',
    indexable: true,
    documentId: 'roomRentalPage',
  },

  // Deux adresses de l'ancien site, gardées pour ne pas casser les liens
  // existants. Elles renvoient leur autorité à la page qui les remplace.
  {
    path: '/sacrements/',
    indexable: false,
    canonicalPath: '/nos-services/',
    closedBecause: 'Ancienne adresse, remplacée par /nos-services/.',
  },
  {
    path: '/merci-a-nos-annonceurs/',
    indexable: false,
    canonicalPath: '/nos-annonceurs/',
    closedBecause: 'Ancienne adresse, remplacée par /nos-annonceurs/.',
  },

  // Les deux pages légales sont écrites dans le dépôt : elles décrivent le
  // fonctionnement technique du site, pas la vie de la paroisse. Publiques —
  // une politique de confidentialité qu'un moteur ne peut pas trouver ne sert
  // à personne.
  {
    path: '/politique-de-confidentialite/',
    indexable: true,
    contentInCode: true,
  },
  { path: '/mentions-legales/', indexable: true, contentInCode: true },

  // Route réservée, dont le contenu n'est pas écrit. Une page vide indexée dit
  // au moteur que le site en a une — et cette impression reste longtemps après
  // que la page a été remplie.
  {
    path: '/galerie/',
    indexable: false,
    closedBecause:
      'Route réservée : la sélection photographique vit à l’accueil.',
  },

  {
    path: '/verification/',
    indexable: false,
    closedBecause: 'Page interne de validation du design system.',
  },
  {
    path: '/404/',
    indexable: false,
    closedBecause: 'Page d’erreur.',
  },
];

/** Entrée du registre pour ce chemin, ou rien si la route n'y est pas. */
export function findRoute(pathname: string): SiteRoute | undefined {
  const path = normalizeRoutePath(pathname);

  return SITE_ROUTES.find((entry) => entry.path === path);
}

/**
 * Route servie à ce chemin, fermée par défaut.
 *
 * Une route absente du registre est traitée comme fermée : le silence ne doit
 * jamais valoir « publier ». Ce repli n'est pas la garde principale — c'est
 * `scripts/check-built-seo.mjs` qui, après le build, compare les pages
 * réellement produites au registre et fait échouer `pnpm validate` s'il en
 * manque une. Un serveur de développement rend aussi les adresses
 * inexistantes, et une faute de frappe dans la barre d'adresse ne doit pas
 * arrêter le travail.
 */
export function routeFor(pathname: string): SiteRoute {
  return (
    findRoute(pathname) ?? {
      path: normalizeRoutePath(pathname),
      indexable: false,
      closedBecause: 'Route absente du registre.',
    }
  );
}

/** Les routes qui entrent dans le plan de site, dans l'ordre du registre. */
export function indexableRoutes(): readonly SiteRoute[] {
  return SITE_ROUTES.filter((route) => route.indexable);
}
