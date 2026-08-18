import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'xo2ahvjo',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
  typegen: {
    // Génération explicite via `pnpm sanity:typegen`, pas pendant `sanity dev`.
    enabled: false,
    // Chemins relatifs à studio/ : on scanne les requêtes GROQ du frontend.
    // On exclut le fichier généré lui-même du scan (hygiène + évite un crash du
    // parseur qui re-parse sa propre sortie).
    path: ['../src/**/*.{ts,tsx,js,jsx}', '!../src/lib/sanity/sanity.types.ts'],
    schema: './schema.json',
    generates: '../src/lib/sanity/sanity.types.ts',
    overloadClientMethods: true,
    // Le fichier généré est ignoré par Prettier/ESLint : on désactive le
    // formatage post-génération (il échoue ici car le plugin Tailwind cherche
    // le CSS relativement à studio/). Types valides, non formatés : sans effet.
    formatGeneratedCode: false,
  },
})
