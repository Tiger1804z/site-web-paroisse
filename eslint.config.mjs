import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.astro/**',
      '**/.sanity/**',
      '**/dist/**',
      'node_modules/**',
      'reference/**',
      'coverage/**',
      'src/lib/sanity/sanity.types.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs['flat/recommended'],
  ...astro.configs['flat/jsx-a11y-recommended'],
  {
    files: ['**/*.{jsx,tsx}'],
    ...reactHooks.configs.flat['recommended-latest'],
  },
  {
    files: ['**/*.config.{js,mjs,ts}'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
    },
  },
  {
    // Les scripts de build et de vérification s'exécutent sous Node, hors du
    // bundle servi au navigateur : les globales de la plateforme y sont
    // légitimes.
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  },
  {
    // Les tests qui exercent un gestionnaire de requête fabriquent des objets
    // `fetch` — une `Request`, ses `Headers`, la `Response` qui en sort.
    //
    // Contrairement à `URL`, qu'un test importe depuis `node:url`, aucun module
    // `node:` ne les exporte : ce sont des globales, et rien d'autre. Les
    // déclarer ici vaut mieux que désactiver `no-undef`, qui laisserait passer
    // les vraies fautes de frappe du même coup.
    files: ['tests/**/*.mjs'],
    languageOptions: {
      globals: {
        Headers: 'readonly',
        Request: 'readonly',
        Response: 'readonly',
        // Sert à relire un corps `x-www-form-urlencoded` comme le fera le
        // service qui le reçoit — la seule façon honnête de le vérifier.
        URLSearchParams: 'readonly',
      },
    },
  },
];
