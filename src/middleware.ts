import { defineMiddleware } from 'astro:middleware';

/**
 * En-tête `X-Robots-Tag` de l'environnement de prévisualisation.
 *
 * Le `<head>` porte déjà `noindex, nofollow` sur toute page prévisualisée
 * (`documentHead.ts`), et `robots.txt` y répond `Disallow: /`. Cette
 * troisième barrière couvre ce que les deux autres ne peuvent pas couvrir :
 * une réponse qui n'est pas du HTML — `sitemap.xml`, un fichier joint, une
 * future route d'API — n'a pas de `<head>` où écrire une balise.
 *
 * Le test d'environnement est écrit ici littéralement plutôt qu'importé, pour
 * la même raison que dans `BaseLayout.astro` : Vite remplace
 * `import.meta.env.*` par sa valeur au build. Dans le site public la condition
 * devient `false`, la branche est éliminée, et ce fichier se réduit à un
 * passe-plat qui ne touche à aucune réponse.
 */
const visualEditingEnabled =
  import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true';

export const onRequest = defineMiddleware(async (_context, next) => {
  const response = await next();

  if (visualEditingEnabled) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
});
