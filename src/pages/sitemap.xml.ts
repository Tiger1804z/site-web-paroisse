import type { APIRoute } from 'astro';
import { loadQuery } from '@/lib/sanity/preview';
import { PAGE_UPDATED_AT_QUERY } from '@/lib/sanity/queries';
import { indexableRoutes } from '@/lib/seo/routes';
import { SITE_URL } from '@/lib/seo/siteUrl';
import { absoluteUrl } from '@/lib/seo/urls';

/**
 * Plan de site, écrit à la main plutôt que déduit par `@astrojs/sitemap`.
 *
 * L'intégration officielle devine : elle liste les pages produites et exclut
 * ce qu'on lui dit d'exclure, dans un second endroit. Ici, la liste des pages
 * publiques existe déjà — c'est le registre de routes — et c'est la même que
 * `BaseLayout` consulte pour décider d'un `noindex`. Une seule source, donc
 * pas de page annoncée au plan de site et refusée à l'indexation dans la même
 * seconde.
 *
 * Ni `priority` ni `changefreq` : Google les ignore depuis des années, et les
 * publier reviendrait à écrire des chiffres que personne ne peut vérifier.
 */

/** Échappe le texte inséré dans un nœud XML. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Dates de modification, par identifiant de document.
 *
 * Une lecture qui échoue ne doit pas emporter le plan de site : un `lastmod`
 * manquant est une information en moins, une page manquante est une page que
 * Google ne visite plus.
 */
async function fetchLastModified(): Promise<Map<string, string>> {
  try {
    const documents = await loadQuery(PAGE_UPDATED_AT_QUERY);

    return new Map(
      documents.flatMap((document) =>
        document._updatedAt ? [[document._id, document._updatedAt]] : [],
      ),
    );
  } catch (error) {
    console.error(
      '[sitemap] Échec de la lecture des dates de modification — plan de site publié sans `lastmod`.',
      error,
    );
    return new Map();
  }
}

export const GET: APIRoute = async () => {
  const lastModified = await fetchLastModified();

  const entries = indexableRoutes().map((route) => {
    const location = escapeXml(absoluteUrl(SITE_URL, route.path));
    const updatedAt = route.documentId
      ? lastModified.get(route.documentId)
      : undefined;

    return [
      '  <url>',
      `    <loc>${location}</loc>`,
      ...(updatedAt ? [`    <lastmod>${escapeXml(updatedAt)}</lastmod>`] : []),
      '  </url>',
    ].join('\n');
  });

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    '</urlset>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
