import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { MACHINE_VALUE_FIELDS } from '../src/lib/sanity/machine-values.ts';

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

test('un build de production refuse le drapeau de prévisualisation', () => {
  // Un avertissement dans un journal de build ne se remarque pas. Publier des
  // brouillons, des marqueurs stega et un noindex généralisé, si.
  assert.match(
    previewSource,
    /if \(visualEditingEnabled && import\.meta\.env\.PROD\) \{\s*throw new Error\(/,
  );
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

test('toute page prévisualisée est interdite d’indexation', () => {
  assert.match(layoutSource, /noIndex \|\| visualEditingEnabled/);
  assert.match(layoutSource, /name="robots" content="noindex, nofollow"/);
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
