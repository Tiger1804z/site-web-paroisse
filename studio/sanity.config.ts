import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'
import {locations, mainDocuments, previewUrl} from './presentation'

export default defineConfig({
  name: 'default',
  title: 'Paroisse Saint-René-Goupil',

  projectId: 'xo2ahvjo',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    /**
     * Presentation affiche le vrai site dans le Studio et relie chaque texte au
     * champ qui le produit. Il n'active PAS les brouillons à lui seul : c'est le
     * site prévisualisé qui décide de les lire, via son propre drapeau
     * d'environnement et son jeton serveur. Le Studio ne détient aucun secret.
     */
    presentationTool({
      previewUrl: {initial: previewUrl},
      resolve: {mainDocuments, locations},
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
