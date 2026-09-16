import type { SiteRoute } from './routes.ts';

/** Règles exactes Cloudflare Pages, sans joker ni redirection en chaîne. */
export function legacyRedirectRules(routes: readonly SiteRoute[]) {
  return routes.flatMap((route) => {
    if (!route.canonicalPath) return [];
    const target = routes.find((entry) => entry.path === route.canonicalPath);
    if (route.indexable || !target?.indexable || target.canonicalPath) {
      throw new Error(
        `Redirection invalide : ${route.path} → ${route.canonicalPath}`,
      );
    }
    // Pages encode les sources UTF-8 au parsing : publier les deux formes
    // créerait des doublons. Une forme encodée couvre aussi les URLs accentuées.
    return [encodeURI(route.path.slice(0, -1)), encodeURI(route.path)].map(
      (source) => ({
        source,
        destination: target.path,
        status: 301 as const,
      }),
    );
  });
}
