// Le numéro principal de la paroisse n'est cliquable nulle part, vérifié sur la
// sortie réellement produite.
//
// Le secrétariat reçoit les appels de la paroisse à domicile, 24 heures sur 24.
// Un lien `tel:` ou un bouton « Appeler » transforme une consultation de minuit
// en sonnerie chez quelqu'un. Le numéro reste affiché partout où il sert; c'est
// le geste qui déclenche l'appel qui disparaît.
//
// `tests/parish-phone.test.mjs` est une garde de source : il lit le code et
// vérifie qu'il est écrit de la bonne façon. C'est utile, et insuffisant. Une
// page rendue à partir d'un document Sanity, un composant ajouté ailleurs, un
// contenu recopié à la main dans un champ texte — rien de tout cela ne se voit
// dans le code. Ce script pose donc la question au fichier livré : le visiteur
// reçoit-il, oui ou non, un lien qui compose le numéro du secrétariat?
//
// Les numéros de tiers sont autorisés et le restent : annonceurs, personne
// responsable d'une activité, friperie. Ce sont leurs lignes à eux.
//
// Lancé par `pnpm validate`, après `pnpm build:public`.

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { exit } from 'node:process';

const distPath = fileURLToPath(new URL('../dist', import.meta.url));

if (!existsSync(distPath)) {
  console.error('dist/ est absent — lancer « pnpm build:public » d’abord.');
  exit(1);
}

/**
 * Le numéro à surveiller, lu à la source plutôt que recopié ici.
 *
 * `src/data/siteSettings.ts` est du TypeScript que ce script ne peut pas
 * importer sans transpileur; on y lit donc la seule ligne qui compte. Une
 * lecture qui échoue arrête le contrôle : mieux vaut un échec bruyant qu'une
 * vérification qui passe en ne regardant rien.
 */
function parishDigits() {
  const source = readFileSync(
    fileURLToPath(new URL('../src/data/siteSettings.ts', import.meta.url)),
    'utf8',
  );
  const match = source.match(/e164:\s*'\+1(\d{10})'/);

  if (!match) {
    console.error(
      'Numéro principal introuvable dans src/data/siteSettings.ts — ' +
        'le contrôle ne peut pas savoir quoi chercher.',
    );
    exit(1);
  }

  return match[1];
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

const digits = parishDigits();
const TEXT = /\.(html|js|mjs|cjs|json|txt|xml|webmanifest)$/i;

// Le numéro écrit de n'importe quelle façon, précédé de `tel:` : « tel:+1514… »,
// « tel:514-722-1161 », « tel:(514) 722-1161 ». Seule la ponctuation change.
const separators = '[\\s().+-]*';
const dialed = digits.split('').join(separators);
const CALL_LINK = new RegExp(`tel:${separators}1?${separators}${dialed}`, 'i');

// Un libellé d'appel dans la page. « téléphonez au 514 722-1161 » reste une
// phrase acceptable — elle donne le numéro sans offrir le geste; c'est le
// bouton nommé « Appeler » qui ne doit plus exister.
//
// Le contenu d'un lien n'est pas du texte nu : le pictogramme s'intercale entre
// la balise et le libellé. On prend donc l'élément entier, `<svg>` compris. Un
// `<a>` ne s'imbrique pas, alors la borne non gourmande suffit.
const CALL_ELEMENT = /<(a|button)\b[^>]*>[\s\S]*?<\/\1>/gi;
const CALL_LABEL = /\bAppeler\b/i;

// Et la même promesse faite au lecteur d'écran seul, via l'étiquette
// d'accessibilité : un lien annoncé « Appeler au 514 722-1161 » est un bouton
// d'appel, même sans le mot dans la page.
const CALL_ARIA_LABEL = /aria-label="[^"]*\bAppeler\b[^"]*"/i;

/** @type {string[]} */
const problems = [];

for (const file of allFiles().filter((name) => TEXT.test(name))) {
  const content = readFileSync(`${distPath}/${file}`, 'utf8');

  if (CALL_LINK.test(content)) {
    problems.push(
      `dist/${file} contient un lien d’appel vers le numéro de la paroisse.`,
    );
  }

  const labelled =
    CALL_ARIA_LABEL.test(content) ||
    (content.match(CALL_ELEMENT) ?? []).some((element) =>
      CALL_LABEL.test(element),
    );

  if (labelled) {
    problems.push(`dist/${file} contient encore un bouton « Appeler ».`);
  }
}

if (problems.length > 0) {
  console.error('Le numéro de la paroisse est redevenu cliquable :\n');
  for (const problem of problems) console.error(`  - ${problem}`);
  console.error(
    '\nLe numéro doit rester affiché, sans lien « tel: » ni bouton d’appel.',
  );
  exit(1);
}

// Le numéro doit rester lisible : un contrôle qui passerait parce que le numéro
// a disparu du site vérifierait exactement le contraire de ce qu'on veut.
const displayed = new RegExp(digits.split('').join('[\\s().-]*'));
const pages = allFiles().filter((name) => name.endsWith('.html'));
const showing = pages.filter((file) =>
  displayed.test(readFileSync(`${distPath}/${file}`, 'utf8')),
);

if (showing.length === 0) {
  console.error(
    'Aucune page ne montre le numéro de la paroisse — il devait rester ' +
      'visible, seul le lien d’appel devait partir.',
  );
  exit(1);
}

console.log(
  `Numéro de la paroisse : affiché sur ${showing.length} page(s), cliquable sur aucune.`,
);
