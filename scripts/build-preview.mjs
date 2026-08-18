// Build de l'environnement de prévisualisation éditoriale.
//
// Symétrique de `build-public.mjs`, et c'est volontaire : chacun des deux
// scripts fige une topologie complète par variables de process, sans jamais
// écrire dans `.env`. La session de travail locale n'est pas dérangée, et une
// console d'hébergement n'a qu'une seule commande à retenir.
//
// Deux drapeaux, posés ensemble :
//
//   PREVIEW_DEPLOYMENT=true
//     `astro.config.mjs` passe en `output: 'server'` et ajoute l'adaptateur
//     Cloudflare. Plus rien n'est prérendu : chaque page est rendue au moment
//     de la requête, ce qui est la seule façon d'afficher un brouillon qui
//     vient d'être tapé. Un fichier HTML figé, lui, se recharge identique à
//     lui-même — Presentation demanderait un rafraîchissement et rien ne
//     changerait à l'écran.
//
//   PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true
//     `BaseLayout.astro` émet l'île d'overlays, `preview.ts` lit la
//     perspective `drafts` avec le jeton serveur, active les Content Source
//     Maps et stega, et le `<head>` passe en `noindex, nofollow`.
//
// Les deux sont posés ici parce qu'ils n'ont aucun sens séparément :
// `preview.ts` refuse d'ailleurs de compiler si l'un arrive sans l'autre.
//
// Ce que ce script ne fait PAS : inventer un jeton. `SANITY_API_READ_TOKEN`
// vient de l'environnement, et son absence dégrade la prévisualisation au
// contenu publié au lieu de faire échouer le build.

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
    PREVIEW_DEPLOYMENT: 'true',
    PUBLIC_SANITY_VISUAL_EDITING_ENABLED: 'true',
  },
});
