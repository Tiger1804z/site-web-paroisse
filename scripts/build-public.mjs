// Build du site public, quel que soit l'état de `.env`.
//
// Contexte : `astro build` lit `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` depuis
// `.env`. Pendant un travail éditorial ce drapeau vaut « true », et le site est
// en `output: 'static'` — le build fige alors des brouillons et des marqueurs
// stega dans le HTML, et émet l'île de Visual Editing (678 kB). La porte de
// validation contrôlerait donc une sortie qui n'est pas celle qu'on publie.
//
// Ce wrapper force le drapeau à « false » le temps du build. Il ne modifie pas
// `.env` : une variable de process a priorité sur le fichier, la session de
// prévisualisation en cours n'est pas dérangée.
//
// `pnpm build` reste volontairement sensible au drapeau : un environnement de
// prévisualisation déployé devra pouvoir produire une sortie prévisualisée.

import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';
import { env } from 'node:process';

// Les deux topologies n'écrivent pas les mêmes fichiers : le site public pose
// des pages HTML à la racine de `dist/`, la prévisualisation pose `client/` et
// `server/`. Mesuré : `astro build` ne retire pas ce qu'il ne produit pas.
// Enchaîner les deux commandes laissait donc l'île de Visual Editing du build
// précédent dans la sortie publique — 680 kB de trop, et surtout un fichier
// que rien n'a demandé, prêt à partir en ligne.
rmSync(fileURLToPath(new URL('../dist', import.meta.url)), {
  recursive: true,
  force: true,
  // Sous Windows, un processus qui vient de lire un fichier peut encore tenir
  // son verrou une fraction de seconde — un `wrangler dev` qu'on vient
  // d'arrêter, l'antivirus qui inspecte la sortie. Réessayer vaut mieux
  // qu'échouer sur un EBUSY sans rapport avec le code.
  maxRetries: 10,
  retryDelay: 200,
});

execSync('astro build', {
  stdio: 'inherit',
  env: {
    ...env,
    PUBLIC_SANITY_VISUAL_EDITING_ENABLED: 'false',
    // Le site public est statique, et le reste. Sans cette ligne, une variable
    // laissée dans l'environnement du terminal suffirait à produire un build
    // serveur — avec un `_worker.js` — là où l'on attend des fichiers HTML.
    PREVIEW_DEPLOYMENT: 'false',
  },
});
