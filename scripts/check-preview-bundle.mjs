// Contrôle de l'environnement de prévisualisation, sur la sortie réellement
// produite.
//
// Le site public doit prouver une absence : pas de jeton, pas d'overlays. La
// prévisualisation doit prouver deux choses opposées à la fois, et c'est ce
// qui la rend intéressante à vérifier :
//
//   - le jeton DOIT être dans le paquet serveur, sinon les brouillons ne se
//     lisent pas;
//   - le jeton NE DOIT PAS être dans un seul octet servi au navigateur.
//
// C'est la frontière entre `dist/server/` et `dist/client/`, et elle est
// vérifiable au fichier près.
//
// Le contrôle par valeur exacte exige donc un jeton dans l'environnement.
// Sans lui, ce script échoue au lieu de passer : une vérification qui ne peut
// pas détecter la panne qu'elle prétend surveiller ne doit jamais s'annoncer
// verte.
//
// Le jeton n'a pas besoin d'être valide. Le build de prévisualisation ne
// prérend rien, donc il n'adresse aucune requête à Sanity : un jeton factice
// suffit à mesurer la fuite, et ne peut rien lire.
//
// Lancé par `pnpm validate:preview`, après `pnpm build:preview`.

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { Buffer } from 'node:buffer';
import { fileURLToPath, URL } from 'node:url';
import { exit } from 'node:process';
import { buildTimeReadToken } from './build-time-token.mjs';

const distPath = fileURLToPath(new URL('../dist', import.meta.url));
const clientPath = `${distPath}/client`;
const serverPath = `${distPath}/server`;

/** @type {string[]} */
const problems = [];
const fail = (message) => problems.push(message);

if (!existsSync(clientPath) || !existsSync(serverPath)) {
  console.error(
    'dist/client ou dist/server est absent — lancer « pnpm build:preview » d’abord.',
  );
  exit(1);
}

function allFiles(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const relative = `${prefix}${entry.name}`;
    return entry.isDirectory()
      ? allFiles(`${directory}/${entry.name}`, `${relative}/`)
      : [relative];
  });
}

const clientFiles = allFiles(clientPath);
const serverFiles = allFiles(serverPath);
const readServer = (file) => readFileSync(`${serverPath}/${file}`, 'utf8');
const serverText = serverFiles
  .filter((file) => /\.(mjs|js|json)$/i.test(file))
  .map(readServer)
  .join('\n');

// 1. Rien n'est prérendu. Un seul fichier HTML dans la sortie serait une page
//    figée au moment du build : dans un environnement de prévisualisation,
//    c'est précisément le défaut qu'on rend impossible.
const prerendered = clientFiles.filter((file) => file.endsWith('.html'));
if (prerendered.length > 0) {
  fail(
    `${prerendered.length} page(s) prérendue(s) dans dist/client : ${prerendered.join(', ')}. La prévisualisation doit tout rendre à la demande.`,
  );
}

// 2. Le Worker existe, et il sait où sont ses assets.
if (!existsSync(`${serverPath}/entry.mjs`)) {
  fail('dist/server/entry.mjs est absent : aucun rendu à la demande.');
}

const wranglerPath = `${serverPath}/wrangler.json`;
if (!existsSync(wranglerPath)) {
  fail('dist/server/wrangler.json est absent : rien à déployer.');
} else {
  const config = JSON.parse(readServer('wrangler.json'));
  if (config.assets?.directory !== '../client') {
    fail(
      `wrangler.json pointe ses assets sur ${JSON.stringify(config.assets?.directory)} au lieu de « ../client ».`,
    );
  }
  if (!config.name) {
    fail('wrangler.json ne nomme pas le Worker.');
  } else {
    console.log(`[preview] Worker « ${config.name} », assets ../client.`);
  }
}

// 3. L'île de Visual Editing est bien servie au navigateur. Sans elle,
//    Presentation affiche la page et répète « Unable to connect ».
//
//    Deux fichiers portent des noms différents et comptent tous les deux :
//    le composant que le HTML référence dans son `<astro-island>`
//    (`visual-editing-component.<empreinte>.js`) et le gros morceau de code
//    qu'il charge (`VisualEditing.<empreinte>.js`). Chercher le second seul
//    laisserait passer un build où le premier manque — c'est-à-dire un build
//    où rien ne s'hydrate.
const islandEntry = clientFiles.find((file) =>
  /_astro\/visual-editing-component[.-][\w-]*\.js$/.test(file),
);
const islandChunk = clientFiles.find((file) =>
  /_astro\/VisualEditing[.-][\w-]*\.js$/.test(file),
);
if (!islandEntry || !islandChunk) {
  fail(
    'l’île de Visual Editing est incomplète dans dist/client/_astro (composant : ' +
      String(islandEntry) +
      ', code : ' +
      String(islandChunk) +
      ') — les overlays ne se chargeront pas.',
  );
}

// 4. Ce que le paquet serveur doit contenir pour que le clic ouvre le bon
//    champ, et pour qu'aucune page ne soit indexable.
if (!serverText.includes('withKeyArraySelector')) {
  fail(
    'le paquet serveur ne demande pas de Content Source Map : les clics n’ouvriront aucun champ.',
  );
}
if (!serverText.includes('noindex, nofollow')) {
  fail('le paquet serveur ne sait pas écrire « noindex, nofollow ».');
}
if (!serverText.includes('X-Robots-Tag')) {
  fail('le middleware d’en-tête noindex est absent du paquet serveur.');
}

// 5. Le jeton : présent côté serveur, absent côté navigateur.
const { token, source } = buildTimeReadToken();
if (!token) {
  console.error(
    [
      'SANITY_API_READ_TOKEN est absent de l’environnement.',
      '',
      'Le contrôle de fuite compare la valeur exacte du jeton au contenu de chaque fichier servi. Sans valeur, il ne prouve rien, et un contrôle qui ne prouve rien ne doit pas s’annoncer vert.',
      '',
      'Le build de prévisualisation n’interroge jamais Sanity : un jeton factice suffit.',
      '',
      '  SANITY_API_READ_TOKEN=skCANARY000000000000000000 pnpm validate:preview',
    ].join('\n'),
  );
  exit(1);
}

const needle = Buffer.from(token, 'utf8');
const contains = (base, file) => {
  const path = `${base}/${file}`;
  return (
    statSync(path).size >= needle.length && readFileSync(path).includes(needle)
  );
};

for (const file of clientFiles.filter((entry) => contains(clientPath, entry))) {
  fail(`dist/client/${file} contient la valeur exacte du jeton de lecture.`);
}

const TOKEN_SHAPE = /\bsk[A-Za-z0-9]{40,}/;
for (const file of clientFiles.filter((entry) =>
  /\.(html|js|mjs|css|json|txt|xml|map)$/i.test(entry),
)) {
  if (TOKEN_SHAPE.test(readFileSync(`${clientPath}/${file}`, 'utf8'))) {
    fail(`dist/client/${file} contient une chaîne à la forme d’un jeton.`);
  }
}

const carriers = serverFiles.filter((file) => contains(serverPath, file));
if (carriers.length === 0) {
  fail(
    'le jeton n’apparaît nulle part dans dist/server : le Worker ne lira aucun brouillon. Vérifier que SANITY_API_READ_TOKEN était présent au moment du build.',
  );
}

if (problems.length > 0) {
  console.error('\nSortie de prévisualisation : contrôles en échec\n');
  for (const problem of problems) console.error(`  - ${problem}`);
  exit(1);
}

console.log(
  [
    `[preview] ${clientFiles.length} fichiers servis au navigateur, 0 page prérendue, 0 fuite de jeton.`,
    `[preview] Île d’overlays : ${islandEntry}.`,
    `[preview] Jeton (source : ${source}) présent dans ${carriers.length} fichier(s) de dist/server, et nulle part ailleurs.`,
  ].join('\n'),
);
