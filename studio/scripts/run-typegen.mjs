// Wrapper d'exécution de Sanity TypeGen.
//
// Contexte : sur Windows, la CLI Sanity lance un worker de télémétrie détaché
// dans un handler `process.once('exit')`. Ce spawn provoque une access
// violation (0xC0000005 / « Segmentation fault ») dans le process parent APRÈS
// que la commande a fini son vrai travail. Les fichiers sont donc bien écrits,
// mais le code de sortie est non-zéro, ce qui casserait `&&` et la CI.
//
// Ce wrapper considère chaque étape comme réussie si son fichier de sortie a
// bien été (ré)écrit, en ignorant uniquement ce crash post-écriture connu.
// Sur Linux (CI), aucun crash : le comportement est identique à un run normal.
//
// Chemins relatifs au dossier studio/ (cwd quand pnpm exécute le script).

import {execSync} from 'node:child_process'
import {existsSync, statSync} from 'node:fs'
import {stderr} from 'node:process'

function mtimeMs(file) {
  return existsSync(file) ? statSync(file).mtimeMs : 0
}

function runTolerant(command, outputFile, label) {
  const before = mtimeMs(outputFile)
  try {
    execSync(command, {stdio: 'inherit'})
  } catch (error) {
    if (mtimeMs(outputFile) > before) {
      stderr.write(
        `\n[typegen] « ${label} » a produit ${outputFile}, mais le worker de télémétrie Sanity a planté ensuite (bug Windows connu, sans effet sur la sortie). On continue.\n`,
      )
      return
    }
    throw error
  }
}

runTolerant('sanity schema extract --force', './schema.json', 'schema extract')
runTolerant('sanity typegen generate', '../src/lib/sanity/sanity.types.ts', 'typegen generate')
