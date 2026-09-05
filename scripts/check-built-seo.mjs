// Vérifie le référencement sur le site réellement produit, pas sur le code qui
// le produit.
//
// La distinction n'est pas théorique. L'audit du 31 juillet a trouvé un champ
// au schéma complet, projeté nulle part, pendant que tous les tests unitaires
// étaient verts. Une contradiction entre le plan de site et une balise
// `noindex` se lit exactement pareil : chaque module a raison de son côté, et
// le site publié se contredit.
//
// Ce script lit `dist/` après le build et répond aux quatre questions qu'aucun
// test unitaire ne peut poser :
//
//   1. chaque page produite est-elle au registre de routes?
//   2. chaque page publique apparaît-elle une fois, et une seule, au plan de
//      site?
//   3. une page est-elle à la fois au plan de site et interdite d'indexation?
//   4. les adresses canoniques, le plan de site et `robots.txt` disent-ils
//      tous la même adresse?
//
// Lancé par `pnpm validate`, après `pnpm build:public`.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { SITE_ROUTES } from '../src/lib/seo/routes.ts';
import { absoluteUrl, normalizeRoutePath } from '../src/lib/seo/urls.ts';

const distPath = fileURLToPath(new URL('../dist', import.meta.url));

/** @type {string[]} */
const problems = [];

const fail = (message) => problems.push(message);

/** Chemins des fichiers HTML produits, relatifs à `dist/`. */
function htmlFiles(directory = distPath, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.isDirectory()) {
      return htmlFiles(`${directory}/${entry.name}`, `${prefix}${entry.name}/`);
    }

    return entry.name.endsWith('.html') ? [`${prefix}${entry.name}`] : [];
  });
}

/**
 * `contact/index.html` → `/contact/`, `404.html` → `/404/`.
 *
 * La page d'erreur est le seul fichier produit hors d'un dossier : Astro la
 * sert à `/404`, et c'est cette forme que le registre enregistre.
 */
function routePathOf(file) {
  return normalizeRoutePath(
    `/${file.replace(/index\.html$/, '').replace(/\.html$/, '')}`,
  );
}

const attribute = (html, pattern) => pattern.exec(html)?.[1];

if (!existsSync(distPath)) {
  console.error(
    'dist/ est absent : lancer « pnpm build:public » avant cette vérification.',
  );
  process.exit(1);
}

const pages = htmlFiles().map((file) => {
  const html = readFileSync(`${distPath}/${file}`, 'utf8');

  return {
    file,
    html,
    path: routePathOf(file),
    canonical: attribute(html, /<link rel="canonical" href="([^"]*)"/),
    robots: attribute(html, /<meta name="robots" content="([^"]*)"/),
    jsonLd: [
      ...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
      ),
    ].map((match) => match[1]),
  };
});

// --- 1. Registre et pages produites se répondent ----------------------------

const registered = new Map(SITE_ROUTES.map((route) => [route.path, route]));
const produced = new Set(pages.map((page) => page.path));

for (const page of pages) {
  if (!registered.has(page.path)) {
    fail(
      `« ${page.path} » est produite mais absente du registre : personne n’a dit si elle entre dans Google. Ajouter une entrée dans src/lib/seo/routes.ts.`,
    );
  }
}

for (const route of SITE_ROUTES) {
  if (!produced.has(route.path)) {
    fail(
      `« ${route.path} » est au registre mais n’est produite par aucune page : entrée périmée, ou route renommée.`,
    );
  }
}

// --- 2. Plan de site --------------------------------------------------------

const sitemapPath = `${distPath}/sitemap.xml`;

if (!existsSync(sitemapPath)) {
  fail('sitemap.xml n’a pas été produit.');
} else {
  const xml = readFileSync(sitemapPath, 'utf8');

  if (!xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    fail('sitemap.xml ne commence pas par sa déclaration XML.');
  }

  const openings = (xml.match(/<url>/g) ?? []).length;
  const closings = (xml.match(/<\/url>/g) ?? []).length;
  if (openings !== closings) {
    fail(
      `sitemap.xml est déséquilibré : ${openings} <url> pour ${closings} </url>.`,
    );
  }

  if (!xml.includes('<urlset') || !xml.includes('</urlset>')) {
    fail('sitemap.xml n’a pas d’élément <urlset>.');
  }

  const locations = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map(
    (match) => match[1],
  );

  const duplicates = locations.filter(
    (location, index) => locations.indexOf(location) !== index,
  );
  if (duplicates.length > 0) {
    fail(
      `Adresses répétées dans le plan de site : ${[...new Set(duplicates)].join(', ')}.`,
    );
  }

  // Une esperluette nue rend le XML invalide; elle passerait inaperçue jusqu’à
  // ce qu’un moteur refuse le fichier entier.
  for (const location of locations) {
    if (/&(?!amp;|lt;|gt;|quot;|apos;)/.test(location)) {
      fail(`Adresse mal échappée dans le plan de site : ${location}`);
    }
  }

  const origins = new Set(
    locations.flatMap((location) => {
      try {
        return [new URL(location).origin];
      } catch {
        fail(`Adresse non absolue dans le plan de site : ${location}`);
        return [];
      }
    }),
  );

  if (origins.size > 1) {
    fail(
      `Le plan de site mélange plusieurs origines : ${[...origins].join(', ')}.`,
    );
  }

  const origin = [...origins][0];
  const expected = SITE_ROUTES.filter((route) => route.indexable);

  if (origin) {
    const expectedLocations = expected.map((route) =>
      absoluteUrl(origin, route.path),
    );

    for (const location of expectedLocations) {
      if (!locations.includes(location)) {
        fail(`Page publique absente du plan de site : ${location}`);
      }
    }

    for (const location of locations) {
      if (!expectedLocations.includes(location)) {
        fail(
          `Le plan de site annonce une adresse qui n’est pas une page publique : ${location}`,
        );
      }
    }

    // --- 3. Aucune page au plan de site et en `noindex` ---------------------

    for (const page of pages) {
      const location = absoluteUrl(origin, page.path);
      const inSitemap = locations.includes(location);

      if (inSitemap && page.robots?.includes('noindex')) {
        fail(
          `« ${page.path} » est au plan de site ET porte « ${page.robots} ». Les deux se contredisent.`,
        );
      }

      if (!inSitemap && !page.robots?.includes('noindex')) {
        fail(
          `« ${page.path} » n’est pas au plan de site et ne porte pas de noindex : Google peut l’indexer sans que personne l’ait décidé.`,
        );
      }

      // --- 4. Canoniques cohérentes ---------------------------------------

      if (!page.canonical) {
        fail(`« ${page.path} » n’a pas d’adresse canonique.`);
      } else {
        if (!page.canonical.startsWith(origin)) {
          fail(
            `« ${page.path} » a une canonique sur une autre origine que le plan de site : ${page.canonical}`,
          );
        }

        if (inSitemap && page.canonical !== location) {
          fail(
            `« ${page.path} » est annoncée comme ${location} mais se déclare canonique de ${page.canonical}.`,
          );
        }
      }
    }

    // --- robots.txt -------------------------------------------------------

    const robotsPath = `${distPath}/robots.txt`;

    if (!existsSync(robotsPath)) {
      fail('robots.txt n’a pas été produit.');
    } else {
      const robots = readFileSync(robotsPath, 'utf8');
      const sitemapLine = `Sitemap: ${origin}/sitemap.xml`;

      if (!robots.includes(sitemapLine)) {
        fail(
          `robots.txt n’annonce pas le plan de site (« ${sitemapLine} » attendu).`,
        );
      }

      // Un `Disallow` empêcherait Google de lire le `noindex` des pages
      // fermées : elles resteraient indexables, sans titre ni description.
      if (/^Disallow:\s*\S/m.test(robots)) {
        fail(
          'robots.txt contient un Disallow : il empêcherait Google de lire le noindex des pages fermées.',
        );
      }
    }
  }
}

// --- 5. Données structurées lisibles ---------------------------------------

for (const page of pages) {
  for (const block of page.jsonLd) {
    try {
      const parsed = JSON.parse(block);

      if (parsed['@context'] !== 'https://schema.org') {
        fail(
          `« ${page.path} » : données structurées sans @context schema.org.`,
        );
      }

      if (!Array.isArray(parsed['@graph']) || parsed['@graph'].length === 0) {
        fail(`« ${page.path} » : données structurées sans @graph.`);
      }

      for (const node of parsed['@graph'] ?? []) {
        if (!node['@type'] && !node['@id']) {
          fail(
            `« ${page.path} » : un nœud de données structurées n’a ni @type ni @id.`,
          );
        }
      }
    } catch (error) {
      fail(
        `« ${page.path} » : données structurées illisibles — ${error.message}`,
      );
    }
  }
}

// --- 5. Vignette de partage -------------------------------------------------

/**
 * Une page publique sans `og:image` se partage en rectangle gris.
 *
 * Le repli est global : il suffit que `siteSettings` porte une image pour que
 * toutes les pages en héritent. Une page publique qui n'en a pas veut donc dire
 * que le champ a été vidé dans le Studio, ou que la requête n'a rien rapporté
 * au moment du build — deux pannes silencieuses que seule la sortie révèle.
 */
for (const page of pages) {
  const route = registered.get(page.path);
  if (!route?.indexable) continue;

  const shareImage = attribute(
    page.html,
    /<meta property="og:image" content="([^"]*)"/,
  );

  if (!shareImage) {
    fail(
      `« ${page.path} » n’a pas d’og:image : le partage social affichera un cadre vide. Vérifier « Image de partage par défaut » dans les réglages du site.`,
    );
    continue;
  }

  if (!/^https?:\/\//.test(shareImage)) {
    fail(
      `« ${page.path} » : og:image « ${shareImage} » n’est pas une adresse absolue — les réseaux ne la récupéreront pas.`,
    );
  }

  if (
    !attribute(page.html, /<meta property="og:image:alt" content="([^"]*)"/)
  ) {
    fail(`« ${page.path} » : og:image sans og:image:alt.`);
  }

  const width = attribute(
    page.html,
    /<meta property="og:image:width" content="([^"]*)"/,
  );
  const height = attribute(
    page.html,
    /<meta property="og:image:height" content="([^"]*)"/,
  );

  if (!width || !height) {
    fail(
      `« ${page.path} » : og:image sans dimensions annoncées — l’aperçu se dépliera après téléchargement.`,
    );
  }

  const card = attribute(
    page.html,
    /<meta name="twitter:card" content="([^"]*)"/,
  );
  if (card !== 'summary_large_image') {
    fail(
      `« ${page.path} » : twitter:card vaut « ${card} » alors qu’une image est disponible.`,
    );
  }
}

// --- 6. Les images de contenu sont décrites ---------------------------------

/**
 * Le défaut du 5 septembre : trois pages n'avaient plus une seule image
 * décrite, parce que leur en-tête forçait `alt=""` et cachait tout le bloc.
 * Rien dans le code ne paraissait faux — chaque composant avait raison de son
 * côté, et Sophie remplissait un champ que la page jetait.
 *
 * Le logo de la paroisse est écarté du compte : il est décoratif partout, le
 * lien qui le porte étant déjà nommé.
 */
for (const page of pages) {
  const images = [...page.html.matchAll(/<img\b[^>]*>/g)]
    .map((match) => match[0])
    .filter((tag) => !tag.includes('brand-logo__image'));

  if (images.length === 0) continue;

  const missingAttribute = images.filter((tag) => !/\balt\b/.test(tag));
  if (missingAttribute.length > 0) {
    fail(
      `« ${page.path} » : ${missingAttribute.length} image(s) sans attribut alt.`,
    );
  }

  const described = images.filter((tag) => /\balt="[^"]+"/.test(tag));
  if (described.length === 0) {
    fail(
      `« ${page.path} » : ${images.length} image(s) de contenu, aucune décrite. Un en-tête qui force alt="" prive la page de tout texte alternatif.`,
    );
  }
}

// --- 7. En-têtes HTTP livrés ------------------------------------------------

/**
 * `public/_headers` ne sert à rien s'il n'atteint pas `dist/` : Cloudflare Pages
 * lit le fichier livré, pas celui du dépôt. Un test de source ne peut pas voir
 * cette panne-là.
 */
const headersPath = `${distPath}/_headers`;

if (!existsSync(headersPath)) {
  fail(
    '_headers est absent de dist/ : les fichiers versionnés seront revalidés à chaque visite.',
  );
} else {
  const headers = readFileSync(headersPath, 'utf8');

  if (!/^\/_astro\/\*$/m.test(headers)) {
    fail('dist/_headers ne couvre plus /_astro/*.');
  }

  if (!/max-age=31536000/.test(headers) || !/immutable/.test(headers)) {
    fail(
      'dist/_headers ne pose plus de cache long sur les fichiers versionnés.',
    );
  }
}

// --- Verdict ----------------------------------------------------------------

if (problems.length > 0) {
  console.error(
    `\nRéférencement : ${problems.length} problème(s) dans dist/.\n`,
  );
  for (const problem of problems) console.error(`  · ${problem}`);
  console.error('');
  process.exit(1);
}

const indexable = SITE_ROUTES.filter((route) => route.indexable).length;
console.log(
  `Référencement vérifié sur dist/ : ${pages.length} pages produites, ${indexable} au plan de site, ${pages.length - indexable} fermées.`,
);
