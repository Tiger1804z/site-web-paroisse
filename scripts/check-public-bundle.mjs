// Contrôle de sécurité du site public, sur la sortie réellement produite.
//
// Les tests de `tests/sanity-visual-editing.test.mjs` sont des gardes de
// source : ils lisent le code et vérifient qu'il est écrit de la bonne façon.
// C'est utile, et insuffisant. Un import ajouté ailleurs, une bibliothèque qui
// change son graphe de modules, une variable posée par erreur dans la console
// d'un hébergeur — rien de tout cela ne se voit dans le code de `preview.ts`.
//
// Ce script pose donc les quatre questions au fichier livré :
//
//   1. la sortie est-elle purement statique?
//   2. contient-elle l'île de Visual Editing?
//   3. contient-elle des marqueurs stega?
//   4. contient-elle quelque chose qui ressemble à un jeton?
//
// Lancé par `pnpm validate`, après `pnpm build:public`.

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { fileURLToPath, URL } from 'node:url';
import { exit } from 'node:process';
import { buildTimeReadToken } from './build-time-token.mjs';
import { containsStega } from './stega-pattern.mjs';

const distPath = fileURLToPath(new URL('../dist', import.meta.url));

/** @type {string[]} */
const problems = [];
const fail = (message) => problems.push(message);

if (!existsSync(distPath)) {
  console.error('dist/ est absent — lancer « pnpm build:public » d’abord.');
  exit(1);
}

/** Tous les fichiers produits, en chemins relatifs à `dist/`. */
function allFiles(directory = distPath, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = `${prefix}${entry.name}`;
    return entry.isDirectory()
      ? allFiles(`${directory}/${entry.name}`, `${relative}/`)
      : [relative];
  });
}

const files = allFiles();
const TEXT = /\.(html|js|mjs|cjs|css|json|txt|xml|map|svg|webmanifest)$/i;
const textFiles = files.filter((file) => TEXT.test(file));
const read = (file) => readFileSync(`${distPath}/${file}`, 'utf8');

// 1. Sortie statique. Un `_worker.js` ou un dossier `server/` signifierait que
//    l'adaptateur Cloudflare s'est invité dans le build public : le site ne
//    serait plus un tas de fichiers, mais un programme à exécuter.
for (const marker of ['_worker.js', 'server', '_routes.json']) {
  if (existsSync(`${distPath}/${marker}`)) {
    fail(
      `dist/${marker} existe : le build public n’est plus statique. Vérifier PREVIEW_DEPLOYMENT.`,
    );
  }
}

const htmlFiles = files.filter((file) => file.endsWith('.html'));
if (htmlFiles.length === 0) {
  fail('aucune page HTML produite — le build public n’a rien prérendu.');
}

// 2. L'île de Visual Editing. Elle pèse ~680 kB, ne sert à rien sur le site
//    public, et sa seule présence prouve que le drapeau était actif.
for (const file of textFiles) {
  const content = read(file);
  if (
    /@sanity\/visual-editing/.test(content) ||
    /createVisualEditing|enableVisualEditing/.test(content)
  ) {
    fail(`${file} référence Visual Editing dans la sortie publique.`);
  }
}
for (const file of files) {
  if (/VisualEditing[.-][\w-]*\.js$/.test(file)) {
    fail(`${file} est l’île de Visual Editing, émise dans la sortie publique.`);
  }
}

// 3. stega. Les Content Source Maps sont encodées en caractères de largeur
//    nulle — voir `stega-pattern.mjs`, qui explique pourquoi le motif n'est
//    pas celui qu'on croit. Invisibles à l'œil, pas au grep : c'est ce qui
//    rend ce contrôle possible.
for (const file of htmlFiles) {
  if (containsStega(read(file))) {
    fail(`${file} contient des marqueurs stega (caractères invisibles).`);
  }
}

// 4. Jetons. Deux contrôles : la forme, toujours possible; et la valeur exacte
//    quand un jeton est présent dans l'environnement — la seule preuve qui ne
//    dépende d'aucune convention de nommage.
// Un jeton Sanity fait ici 180 caractères. Le seuil est haut pour ne pas
// confondre un identifiant minifié (`skipOverflowHiddenElements`) avec un
// secret : la preuve sérieuse est la recherche par valeur exacte, ci-dessous.
const TOKEN_SHAPE = /\bsk[A-Za-z0-9]{40,}/;
for (const file of textFiles) {
  if (TOKEN_SHAPE.test(read(file))) {
    fail(`${file} contient une chaîne à la forme d’un jeton Sanity.`);
  }
}

const { token, source } = buildTimeReadToken();
if (token) {
  const needle = Buffer.from(token, 'utf8');
  for (const file of files) {
    const path = `${distPath}/${file}`;
    if (statSync(path).size < needle.length) continue;
    if (readFileSync(path).includes(needle)) {
      fail(`${file} contient la valeur exacte de SANITY_API_READ_TOKEN.`);
    }
  }
  console.log(
    `[public] ${files.length} fichiers examinés, dont ${textFiles.length} en texte. Valeur exacte du jeton recherchée (source : ${source}).`,
  );
} else {
  console.log(
    `[public] ${files.length} fichiers examinés, dont ${textFiles.length} en texte. Recherche par forme seulement — aucun SANITY_API_READ_TOKEN visible du build.`,
  );
}

// 5. `robots.txt` du site public : il ouvre, et il annonce le plan de site.
const robots = existsSync(`${distPath}/robots.txt`)
  ? read('robots.txt')
  : undefined;
if (!robots) {
  fail('robots.txt est absent de la sortie publique.');
} else {
  if (/^Disallow: \/$/m.test(robots)) {
    fail('robots.txt ferme tout le site public.');
  }
  if (!/^Sitemap: https?:\/\//m.test(robots)) {
    fail('robots.txt n’annonce aucun plan de site.');
  }
}

// 6. Aucune page publique n'est fermée en bloc. Le registre décide page par
//    page; un `noindex` sur la totalité trahirait un build prévisualisé.
const noindexed = htmlFiles.filter((file) =>
  /<meta name="robots" content="noindex/.test(read(file)),
);
if (noindexed.length === htmlFiles.length) {
  fail(
    `les ${htmlFiles.length} pages produites portent « noindex » — sortie de prévisualisation, pas de site public.`,
  );
}

if (problems.length > 0) {
  console.error('\nSortie publique : contrôles en échec\n');
  for (const problem of problems) console.error(`  - ${problem}`);
  exit(1);
}

console.log(
  `[public] Statique, sans Visual Editing, sans stega, sans jeton. ${htmlFiles.length} pages, dont ${noindexed.length} en noindex assumé.`,
);
