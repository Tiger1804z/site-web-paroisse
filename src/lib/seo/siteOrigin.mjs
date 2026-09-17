/** Domaine public officiel, partagé par la résolution et le contrôle du build. */
export const OFFICIAL_SITE_URL = 'https://paroissesaintrenegoupil.com';

/**
 * @param {string | undefined} value
 * @param {{ production?: boolean, preview?: boolean }} [options]
 */
export function resolveSiteOrigin(
  value,
  { production = false, preview = false } = {},
) {
  const configured = value?.trim();
  if (!configured) {
    if (production) {
      throw new Error(
        'Build de production lancé sans SITE_URL. Voir .env.example.',
      );
    }
    return 'http://localhost:4321';
  }
  const url = new URL(configured);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== '/' ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      'SITE_URL doit être une origine HTTP(S), sans identifiants, chemin ni paramètres.',
    );
  }
  if (production && !preview && url.origin !== OFFICIAL_SITE_URL) {
    throw new Error(
      `Build public : SITE_URL doit valoir ${OFFICIAL_SITE_URL}. Reçu : ${url.origin}.`,
    );
  }
  return url.origin;
}
