// @ts-check
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sanity from '@sanity/astro';
import { loadEnv } from 'vite';

/**
 * Choisit l'entrée d'un paquet : `exports['.']` d'abord, sinon `module`, sinon
 * `main`. Les conditions sont parcourues dans l'ordre qui convient au
 * navigateur, puisque ces modules sont servis à une île React.
 */
/**
 * Dossier réel d'un paquet, calculé sans dépendre du séparateur de chemin.
 *
 * Déclarer nous-mêmes ces alias, corrects dès le départ, évite que le scan
 * initial de Vite échoue sur l'alias cassé de l'intégration. Sans cela le
 * paquet est pré-empaqueté plus tard, l'empreinte d'optimisation change en
 * cours de session, et les onglets déjà ouverts reçoivent des
 * « 504 Outdated Optimize Dep ».
 *
 * @param {string} name
 * @returns {string | undefined}
 */
function packageDirectory(name) {
  try {
    return createRequire(import.meta.url)
      .resolve(`${name}/package.json`)
      .replace(/[\\/]package\.json$/, '');
  } catch {
    return undefined;
  }
}

/**
 * @param {unknown} value
 * @returns {string | undefined}
 */
function pickPackageEntry(value) {
  if (typeof value === 'string') return value;
  if (!value || typeof value !== 'object') return undefined;

  const conditions = /** @type {Record<string, unknown>} */ (value);

  for (const condition of ['browser', 'import', 'module', 'default']) {
    if (condition in conditions) {
      /** @type {string | undefined} */
      const entry = pickPackageEntry(conditions[condition]);
      if (entry) return entry;
    }
  }

  return undefined;
}

/**
 * Répare les alias de `@sanity/astro` 3.5.0 sur Windows.
 *
 * L'intégration déduit le dossier d'un paquet ainsi :
 *
 *   require.resolve('<paquet>/package.json').replace(/\/package\.json$/, '')
 *
 * Sur Windows, `require.resolve` renvoie un chemin à antislashs : la regex ne
 * correspond jamais, le suffixe n'est pas retiré, et l'alias pointe sur le
 * fichier `package.json`. Vite le sert alors comme module, et l'hydratation de
 * l'île de Visual Editing échoue — « does not provide an export named
 * 'ThemeProvider' » pour `styled-components`, « ... named 'default' » pour
 * `sanity`.
 *
 * Deux alias sont concernés aujourd'hui (`sanity` et `styled-components`), le
 * nombre peut changer : on rattrape donc tout identifiant qui pointe sur un
 * `package.json` de `node_modules`, quel que soit le paquet.
 *
 * Corriger le tableau d'alias lui-même ne fonctionne pas : `configResolved` est
 * le premier moment où les entrées de l'intégration existent, et Vite a déjà
 * figé sa résolution — vérifié, la mutation reste sans effet. On intercepte
 * donc le résultat de l'alias au moment de la résolution.
 *
 * À retirer dès que l'intégration normalise ses chemins.
 */
function fixSanityAliasesOnWindows() {
  /** @type {Map<string, string | undefined>} */
  const cache = new Map();

  return {
    name: 'paroisse:sanity-alias-windows',
    enforce: /** @type {const} */ ('pre'),
    /** @param {string} source */
    resolveId(source) {
      // Une demande explicite du manifeste (l'optimiseur en émet, avec `?import`)
      // doit passer : on ne traite que l'identifiant nu produit par l'alias.
      if (source.includes('?')) return null;
      if (!/[\\/]node_modules[\\/].+[\\/]package\.json$/.test(source)) {
        return null;
      }

      if (!cache.has(source)) {
        const directory = source.replace(/[\\/]package\.json$/, '');
        try {
          const manifest = JSON.parse(readFileSync(source, 'utf8'));
          const entry =
            pickPackageEntry(manifest.exports?.['.'] ?? manifest.exports) ??
            manifest.module ??
            manifest.main;
          cache.set(
            source,
            entry ? `${directory}/${entry.replace(/^\.\//, '')}` : undefined,
          );
        } catch {
          cache.set(source, undefined);
        }
      }

      return cache.get(source) ?? null;
    },
  };
}

const { PUBLIC_SANITY_PROJECT_ID, PUBLIC_SANITY_DATASET } = loadEnv(
  process.env.NODE_ENV ?? 'development',
  process.cwd(),
  '',
);

/** Alias corrects, déclarés avant ceux de l'intégration. */
const sanityPackageAliases = [
  { find: /^styled-components$/, name: 'styled-components' },
  { find: /^sanity$/, name: 'sanity' },
]
  .map(({ find, name }) => ({ find, replacement: packageDirectory(name) }))
  .filter(
    /** @returns {entry is {find: RegExp, replacement: string}} */
    (entry) => typeof entry.replacement === 'string',
  );

export default defineConfig({
  output: 'static',
  integrations: [
    react(),
    sanity({
      projectId: PUBLIC_SANITY_PROJECT_ID,
      dataset: PUBLIC_SANITY_DATASET,
      useCdn: false,
    }),
  ],
  vite: {
    plugins: [tailwindcss(), fixSanityAliasesOnWindows()],
    resolve: {
      alias: sanityPackageAliases,
    },
    optimizeDeps: {
      /**
       * Modules CommonJS chargés par les overlays de Visual Editing.
       *
       * Servis tels quels, ils n'exposent pas d'export `default` et
       * l'hydratation de l'île échoue. Les pré-empaqueter laisse Vite produire
       * l'interop. La liste correspond exactement aux sous-modules lodash
       * importés par `@sanity/visual-editing`, `@sanity/mutate` et
       * `@sanity/ui` — vérifiée sur l'arbre installé, pas recopiée.
       */
      include: [
        'react/compiler-runtime',
        'lodash/isObject.js',
        'lodash/groupBy.js',
        'lodash/keyBy.js',
        'lodash/partition.js',
        'lodash/sortedIndex.js',
        // Tire `@sanity/eventsource`, dont le point d'entrée ESM importe un
        // fichier CommonJS. Servi brut, il casse à l'exécution comme les
        // modules lodash. On pré-empaquette le client, qui n'est pas isolé par
        // pnpm, plutôt que la dépendance interne qui, elle, ne se résout pas
        // depuis la racine.
        '@sanity/client',
      ],
    },
  },
});
