import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '.astro/**',
      '**/.sanity/**',
      'dist/**',
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
];
