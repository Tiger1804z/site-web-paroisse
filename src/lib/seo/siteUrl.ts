import { resolveSiteOrigin } from './siteOrigin.mjs';

/**
 * Source centrale des URLs absolues : origine officielle en build public,
 * origine de l'environnement en prévisualisation, localhost en développement
 * sans configuration. La config Astro injecte SITE_URL avec priorité au
 * processus pour qu'un ancien .env ne remplace pas la valeur de Cloudflare.
 */
export const SITE_URL = resolveSiteOrigin(import.meta.env.SITE_URL, {
  production: import.meta.env.PROD,
  preview: import.meta.env.PREVIEW_DEPLOYMENT === 'true',
});
