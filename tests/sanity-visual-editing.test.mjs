import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { vercelStegaCombine } from '@vercel/stega';
import { MACHINE_VALUE_FIELDS } from '../src/lib/sanity/machine-values.ts';
import { containsStega } from '../scripts/stega-pattern.mjs';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

// `src/lib/sanity/preview.ts` importe le module virtuel `sanity:client`, que
// Node ne sait pas résoudre hors d'Astro. Ces garanties portent donc sur la
// source, comme les autres gardes structurelles du dépôt.
const previewSource = read('src/lib/sanity/preview.ts');
const layoutSource = read('src/layouts/BaseLayout.astro');
const envExample = read('.env.example');
const gitignore = read('.gitignore');
const presentationSource = read('studio/presentation.ts');
const studioConfig = read('studio/sanity.config.ts');
const packageJson = JSON.parse(read('package.json'));
const buildPublicSource = read('scripts/build-public.mjs');
const buildPreviewSource = read('scripts/build-preview.mjs');
const astroConfig = read('astro.config.mjs');
const middlewareSource = read('src/middleware.ts');
const wranglerConfig = read('wrangler.jsonc');
const checkPreviewSource = read('scripts/check-preview-bundle.mjs');

test('le jeton de lecture n’est jamais exposé au navigateur', () => {
  // C'est le préfixe `PUBLIC_`, et lui seul, qui décide de ce qu'Astro envoie
  // au navigateur. Un jeton ainsi nommé fuirait dans le JavaScript public.
  assert.doesNotMatch(previewSource, /PUBLIC_SANITY_API_READ_TOKEN/);
  assert.doesNotMatch(previewSource, /PUBLIC_[A-Z_]*TOKEN/);
  assert.match(previewSource, /import\.meta\.env\.SANITY_API_READ_TOKEN/);
});

test('aucune valeur de jeton n’est écrite dans le dépôt', () => {
  assert.match(envExample, /^SANITY_API_READ_TOKEN=$/m);
  // Les jetons Sanity commencent par `sk`.
  assert.doesNotMatch(envExample, /\bsk[A-Za-z0-9_-]{20,}/);
  assert.doesNotMatch(previewSource, /\bsk[A-Za-z0-9_-]{20,}/);
});

test('les fichiers d’environnement restent hors du dépôt', () => {
  assert.match(gitignore, /^\.env$/m);
  assert.match(gitignore, /^\.env\.\*$/m);
  assert.match(gitignore, /^!\.env\.example$/m);
});

test('sans le drapeau, la lecture reste publiée et sans jeton', () => {
  // Le client de prévisualisation n'est instancié que si le drapeau est actif.
  assert.match(
    previewSource,
    /visualEditingEnabled\s*\?\s*sanityClient\.withConfig/,
  );
  assert.match(previewSource, /perspective:\s*'published'/);
});

test('la perspective des brouillons dépend de la présence du jeton', () => {
  assert.match(
    previewSource,
    /perspective: readToken \? 'drafts' : 'published'/,
  );
});

test('la version d’API permet la perspective des brouillons', () => {
  // `drafts` n'existe qu'à partir de 2025-02-19; l'intégration Astro utilise
  // une version antérieure par défaut.
  const [, version] =
    previewSource.match(/PREVIEW_API_VERSION = '([^']+)'/) ?? [];
  assert.ok(version, 'la version d’API de prévisualisation doit être déclarée');
  assert.ok(
    version >= '2025-02-19',
    `version d’API trop ancienne pour la perspective drafts : ${version}`,
  );
});

test('stega n’encode jamais les champs envoyés dans un attribut', () => {
  // Des caractères invisibles dans un `alt`, un `tel:` ou un courriel
  // casseraient l'attribut ou pollueraient un lecteur d'écran.
  for (const field of ['alt', 'imageAlt', 'phone', 'publicEmail']) {
    assert.ok(
      MACHINE_VALUE_FIELDS.has(field),
      `${field} atterrit dans un attribut HTML et doit rester non encodé`,
    );
  }
  assert.match(previewSource, /filter: stegaFilter/);
  assert.match(previewSource, /MACHINE_VALUE_FIELDS\.has\(lastSegment\)/);
});

test('les valeurs machine sont aussi nettoyées après la lecture', () => {
  // Le filtre ne voit que le nom du champ tel que le résultat le porte. Une
  // projection qui renomme un champ lui présente un nom inconnu : le second
  // passage est ce qui rattrape ce cas.
  assert.match(previewSource, /cleanMachineValues\(result\)/);
});

test('les clés de tableau sont conservées dans les source maps', () => {
  // Sans `withKeyArraySelector`, un clic sur la troisième section ouvrirait la
  // première.
  assert.match(previewSource, /resultSourceMap: 'withKeyArraySelector'/);
});

test('l’île de Visual Editing n’entre pas dans le bundle public', () => {
  // Un import statique suffit à faire émettre l'île (678 kB) dans la sortie
  // publique, même si elle n'est jamais rendue. L'import dynamique gardé sous
  // un test d'environnement littéral laisse Vite éliminer la branche morte.
  assert.doesNotMatch(
    layoutSource,
    /^import .*@sanity\/astro\/visual-editing/m,
  );
  assert.match(
    layoutSource,
    /await import\('@sanity\/astro\/visual-editing'\)/,
  );
  assert.match(
    layoutSource,
    /import\.meta\.env\.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true'/,
  );
});

/**
 * La règle elle-même est vérifiée sur le comportement dans
 * `seo-head.test.mjs` : `previewing` ferme la page même quand elle est
 * indexable. Ce qui se lit ici, c'est le câblage — que le layout transmette
 * bien le drapeau de prévisualisation au composeur, et qu'il sache écrire la
 * balise que le composeur lui rend.
 */
test('toute page prévisualisée est interdite d’indexation', () => {
  assert.match(layoutSource, /previewing: visualEditingEnabled/);
  assert.match(layoutSource, /name="robots" content=\{head\.robots\}/);
});

test('chaque document migré sait où il apparaît sur le site', () => {
  const migratedTypes = [
    'siteSettings',
    'massSchedule',
    'thriftStore',
    'thriftStorePage',
    'parishEvent',
    'eventsPage',
    'homePage',
    'schedulePage',
  ];

  for (const type of migratedTypes) {
    assert.match(
      presentationSource,
      new RegExp(`^  ${type}: defineLocations`, 'm'),
      `${type} n’a pas d’emplacement déclaré pour Presentation`,
    );
  }
});

test('les routes déclarées à Presentation existent dans le site', () => {
  const routes = [...presentationSource.matchAll(/route: '([^']+)'/g)].map(
    ([, route]) => route,
  );

  assert.ok(routes.length > 0);

  for (const route of routes) {
    if (route === '/') continue;
    const page = route.replace(/^\/|\/$/g, '');
    assert.doesNotThrow(
      () => read(`src/pages/${page}.astro`),
      `la route ${route} ne correspond à aucune page Astro`,
    );
  }
});

test('la porte de validation construit toujours le site public', () => {
  // Avec le drapeau à « true » dans `.env`, `astro build` fige des brouillons et
  // des marqueurs stega dans le HTML statique. La validation vérifierait alors
  // une sortie qui n'est pas celle qu'on publie.
  assert.match(packageJson.scripts.validate, /pnpm build:public\b/);
  assert.equal(
    packageJson.scripts['build:public'],
    'node scripts/build-public.mjs',
  );
  assert.match(
    buildPublicSource,
    /PUBLIC_SANITY_VISUAL_EDITING_ENABLED: 'false'/,
  );
});

test('Presentation est branché sans détenir de secret', () => {
  assert.match(studioConfig, /presentationTool\(/);
  assert.match(studioConfig, /resolve: \{mainDocuments, locations\}/);
  assert.doesNotMatch(studioConfig, /token/i);
});

/**
 * Séparation du site public et de l'environnement de prévisualisation.
 *
 * Ces gardes portent sur la topologie : qui compile quoi, avec quel drapeau,
 * vers quel hébergeur. Les propriétés du produit fini — pas d'île dans la
 * sortie publique, pas de jeton dans un fichier servi au navigateur, aucune
 * page prérendue en prévisualisation — sont mesurées après le build par
 * `scripts/check-public-bundle.mjs` et `scripts/check-preview-bundle.mjs`.
 * Les deux niveaux sont nécessaires : le code peut être correct et le build
 * produire autre chose.
 */

test('la topologie du build se lit dans le processus, jamais dans .env', () => {
  // Une variable non préfixée `PUBLIC_` écrite dans `.env` l'emporte sur celle
  // du processus. Lue par ce chemin, `PREVIEW_DEPLOYMENT` décrirait donc une
  // topologie que le build ne suit pas.
  assert.match(
    astroConfig,
    /const previewDeployment = process\.env\.PREVIEW_DEPLOYMENT === 'true';/,
  );
});

test('la topologie est injectée dans le code, pas redécouverte', () => {
  // `preview.ts` doit recevoir la décision de la config, sinon les deux
  // peuvent diverger : statique d'un côté, prévisualisation de l'autre.
  assert.match(astroConfig, /'import\.meta\.env\.PREVIEW_DEPLOYMENT': JSON/);
  assert.match(
    previewSource,
    /import\.meta\.env\.PREVIEW_DEPLOYMENT === 'true'/,
  );
});

test('l’adaptateur Cloudflare n’entre que dans le build de prévisualisation', () => {
  assert.match(astroConfig, /output: previewDeployment \? 'server' : 'static'/);
  assert.match(
    astroConfig,
    /\.\.\.\(previewDeployment\s*\?\s*\{ adapter: cloudflare\(/,
  );
  // Un import statique de l'adaptateur est sans effet sur la sortie : c'est le
  // fait de l'appeler qui l'installe.
  assert.doesNotMatch(astroConfig, /^\s*adapter: cloudflare\(\)/m);
});

test('le site public reste prérendu et sans jeton', () => {
  assert.match(
    buildPublicSource,
    /PUBLIC_SANITY_VISUAL_EDITING_ENABLED: 'false'/,
  );
  assert.match(buildPublicSource, /PREVIEW_DEPLOYMENT: 'false'/);
});

test('les deux drapeaux de prévisualisation voyagent ensemble', () => {
  // Séparés, ils produisent une panne muette : un site rendu à la demande sans
  // overlays, ou un site statique qui fige des brouillons.
  assert.match(buildPreviewSource, /PREVIEW_DEPLOYMENT: 'true'/);
  assert.match(
    buildPreviewSource,
    /PUBLIC_SANITY_VISUAL_EDITING_ENABLED: 'true'/,
  );
  assert.match(
    previewSource,
    /if \(visualEditingEnabled && import\.meta\.env\.PROD && !previewDeployment\) \{/,
  );
  assert.match(
    previewSource,
    /if \(previewDeployment && !visualEditingEnabled\) \{/,
  );
});

test('un build public prérendu refuse encore la prévisualisation', () => {
  // Le verrou historique reste : ce qui a changé, c'est qu'il ne se déclenche
  // plus sur un build serveur, qui a le droit d'activer la prévisualisation.
  const [, guard] =
    previewSource.match(
      /if \(visualEditingEnabled && import\.meta\.env\.PROD && !previewDeployment\) \{([\s\S]*?)\n\}/,
    ) ?? [];
  assert.ok(guard, 'le verrou du build public doit exister');
  assert.match(guard, /throw new Error\(/);
});

test('toute réponse de la prévisualisation porte un en-tête noindex', () => {
  // Le `<head>` ne couvre que le HTML. `sitemap.xml` et toute réponse non HTML
  // n'ont pas de `<head>` où écrire une balise.
  assert.match(
    middlewareSource,
    /import\.meta\.env\.PUBLIC_SANITY_VISUAL_EDITING_ENABLED === 'true'/,
  );
  assert.match(
    middlewareSource,
    /headers\.set\('X-Robots-Tag', 'noindex, nofollow'\)/,
  );
});

test('le Worker de prévisualisation porte un nom qui lui est propre', () => {
  // Sans ce fichier, le nom viendrait de `package.json` — celui que porte déjà
  // le projet Pages du Studio.
  const [, name] = wranglerConfig.match(/"name":\s*"([^"]+)"/) ?? [];
  assert.ok(name, 'wrangler.jsonc doit nommer le Worker');
  assert.notEqual(name, packageJson.name);
});

test('aucun secret n’est écrit dans la configuration Cloudflare', () => {
  assert.doesNotMatch(
    wranglerConfig,
    /SANITY_API_READ_TOKEN\s*[:=]\s*["'][^"']/,
  );
  assert.doesNotMatch(wranglerConfig, /\bsk[A-Za-z0-9]{40,}/);
  // `vars` publierait la valeur dans la configuration versionnée; un secret se
  // saisit dans le tableau de bord Cloudflare.
  assert.doesNotMatch(wranglerConfig, /"vars"\s*:/);
});

test('l’adresse prévisualisée du Studio se configure sans toucher au code', () => {
  assert.match(
    presentationSource,
    /process\.env\.SANITY_STUDIO_PREVIEW_URL \|\| 'http:\/\/localhost:4321'/,
  );
  assert.match(studioConfig, /previewUrl: \{initial: previewUrl\}/);
});

test('les deux sorties sont contrôlées après leur build', () => {
  // Un test de source ne voit pas ce que le build a réellement écrit.
  assert.match(packageJson.scripts.validate, /pnpm check:public\b/);
  assert.equal(
    packageJson.scripts['validate:preview'],
    'pnpm build:preview && pnpm check:preview',
  );
  assert.equal(
    packageJson.scripts['build:preview'],
    'node scripts/build-preview.mjs',
  );
});

test('le contrôle de fuite refuse de s’annoncer vert sans jeton', () => {
  // Une vérification incapable de détecter la panne qu'elle surveille est pire
  // qu'absente : elle rassure.
  assert.match(checkPreviewSource, /if \(!token\) \{[\s\S]*?exit\(1\)/);
  assert.match(checkPreviewSource, /readFileSync\(path\)\.includes\(needle\)/);
});

test('la prévisualisation ne prérend rien, et le contrôle le vérifie', () => {
  assert.match(checkPreviewSource, /file\.endsWith\('\.html'\)/);
  assert.match(
    checkPreviewSource,
    /page\(s\) prérendue\(s\) dans dist\/client/,
  );
});

test('le détecteur de stega reconnaît un vrai marqueur', () => {
  // Le contrôle du site public cherchait d'abord le plan Unicode « Tags »
  // (U+E0000–U+E007F), la façon dont on décrit habituellement la technique.
  // Mesuré sur la sortie réelle de `@vercel/stega` : cet alphabet n'y figure
  // pas. Le contrôle passait au vert sur du HTML truffé de marqueurs.
  //
  // Ce test encode une chaîne avec la bibliothèque que Sanity utilise, et
  // exige que le motif la reconnaisse. Si l'alphabet change, c'est ici que ça
  // casse — pas dans une sortie publiée.
  const encoded = vercelStegaCombine('Bonjour', {
    origin: 'sanity.io',
    href: 'https://exemple.test/intent/edit/id=x;type=y;path=z',
  });

  assert.notEqual(encoded, 'Bonjour', 'la bibliothèque doit avoir encodé');
  assert.ok(containsStega(encoded), 'le détecteur doit voir le marqueur');
  assert.ok(!containsStega('Bonjour'));
  assert.ok(
    !containsStega(
      'Un texte éditorial ordinaire, avec accents et ponctuation — rien d’invisible.',
    ),
  );
});
