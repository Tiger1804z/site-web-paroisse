/**
 * Une seule façon d'écrire une adresse du site.
 *
 * Le registre de routes, les canoniques, le plan de site et `robots.txt`
 * doivent tous dire `/contact/` de la même manière. Deux orthographes du même
 * chemin — avec et sans barre finale — sont deux adresses distinctes pour un
 * moteur de recherche, et la page se retrouve comptée deux fois.
 *
 * Ce module ne lit ni l'environnement ni le réseau : il est importable par les
 * tests et par les scripts de vérification qui s'exécutent après le build.
 */

/**
 * Ramène un chemin à la forme que le site sert réellement : une barre au
 * début, une barre à la fin.
 *
 * Astro publie des dossiers (`contact/index.html`), donc l'adresse servie est
 * `/contact/`.
 */
export function normalizeRoutePath(pathname: string): string {
  const trimmed = pathname.trim();
  const withoutIndex = trimmed.replace(/index\.html?$/i, '');
  const withLeadingSlash = withoutIndex.startsWith('/')
    ? withoutIndex
    : `/${withoutIndex}`;
  const collapsed = withLeadingSlash.replace(/\/{2,}/g, '/');

  return collapsed.endsWith('/') ? collapsed : `${collapsed}/`;
}

/** Compose une adresse absolue à partir de l'origine et d'un chemin. */
export function absoluteUrl(siteUrl: string, pathname: string): string {
  return `${siteUrl.replace(/\/$/, '')}${normalizeRoutePath(pathname)}`;
}
