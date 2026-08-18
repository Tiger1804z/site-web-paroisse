/**
 * Adresse publique du site, en absolu.
 *
 * Une adresse canonique, une image de partage et un plan de site n'existent
 * qu'en absolu : `/contact/` ne dit rien à Google ni à Facebook. Il faut donc
 * une origine, et cette origine n'est pas devinable depuis le code.
 *
 * **Le domaine de la paroisse n'est pas choisi.** Rien ici n'en invente un.
 * En développement on sert `http://localhost:4321`, l'adresse du serveur
 * d'Astro; en production, l'absence de `SITE_URL` fait échouer le build.
 *
 * C'est le même verrou que celui posé sur la prévisualisation dans
 * `preview.ts` : un avertissement dans un journal de build ne se remarque pas,
 * et un site publié avec des canoniques pointant sur `localhost` se répare
 * beaucoup plus tard que le build qui l'a produit.
 *
 * `.env` est ignoré par git : sur la plateforme d'hébergement, la variable
 * n'existe que si quelqu'un l'a saisie. C'est exactement le moment où le
 * verrou doit se déclencher.
 */

/** Adresse du serveur de développement d'Astro. */
const DEVELOPMENT_SITE_URL = 'http://localhost:4321';

/**
 * Vérifie une origine et lui retire sa barre oblique finale.
 *
 * Le chemin est recomposé ailleurs, toujours avec sa barre initiale : garder
 * celle de l'origine produirait `https://exemple.ca//contact/`.
 */
function normalizeOrigin(value: string): string {
  const url = new URL(value);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new Error(`protocole « ${url.protocol} » — attendu http ou https`);
  }

  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(
      'seule une origine est attendue, sans chemin ni paramètres — par exemple « https://paroissesaintrenegoupil.ca »',
    );
  }

  return url.origin;
}

function resolveSiteUrl(): string {
  const configured = import.meta.env.SITE_URL?.trim();

  if (!configured) {
    if (import.meta.env.PROD) {
      throw new Error(
        [
          'Build de production lancé sans SITE_URL.',
          '',
          "Les adresses canoniques, l'image de partage et le plan de site doivent être absolus : sans cette variable, il n'existe aucune façon honnête de les écrire.",
          '',
          'Définir SITE_URL sur l’origine publique du site — par exemple « https://paroissesaintrenegoupil.ca » — dans les variables d’environnement de la plateforme d’hébergement, ou dans le fichier .env pour un build local.',
          '',
          'Voir .env.example.',
        ].join('\n'),
      );
    }

    return DEVELOPMENT_SITE_URL;
  }

  try {
    const origin = normalizeOrigin(configured);

    // Un build de production peut légitimement viser localhost — c'est le cas
    // de `pnpm validate`, qui construit le site pour le vérifier sans le
    // publier. Ce qui ne doit pas arriver, c'est que cette sortie parte en
    // ligne sans que personne ne l'ait vu.
    if (import.meta.env.PROD && new URL(origin).hostname === 'localhost') {
      console.warn(
        `[siteUrl] Build de production avec SITE_URL=${origin} — les adresses canoniques pointeront sur cette machine. Sortie à ne pas déployer.`,
      );
    }

    return origin;
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);

    throw new Error(
      `SITE_URL vaut ${JSON.stringify(configured)}, qui n’est pas une origine valide : ${reason}.`,
    );
  }
}

/** Origine publique du site, sans barre oblique finale. */
export const SITE_URL = resolveSiteUrl();
