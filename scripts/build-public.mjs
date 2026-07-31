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
import { env } from 'node:process';

execSync('astro build', {
  stdio: 'inherit',
  env: { ...env, PUBLIC_SANITY_VISUAL_EDITING_ENABLED: 'false' },
});
