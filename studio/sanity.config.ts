import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {presentationTool} from 'sanity/presentation'
import {frFRLocale} from '@sanity/locale-fr-fr'
import {schemaTypes} from './schemaTypes'
import {structure, COLLECTION_TYPES, SINGLETON_TYPES} from './structure'
import {locations, mainDocuments, previewUrl} from './presentation'

/**
 * Gestes retirés aux documents uniques.
 *
 * Supprimer ou dépublier « Page d'accueil » ou « Coordonnées de la paroisse »
 * vide une page entière du site, et rien dans l'interface ne le dit avant le
 * clic. Dupliquer est plus sournois encore : la copie porte un identifiant
 * nouveau, donc le site ne la lit jamais et la structure ne l'affiche pas —
 * un document invisible des deux côtés.
 *
 * Aucun de ces trois gestes n'a d'usage éditorial ici : il n'y a qu'une page
 * d'accueil, elle existe déjà, et elle doit rester publiée.
 */
const REMOVED_SINGLETON_ACTIONS = new Set(['delete', 'duplicate', 'unpublish'])

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
    /**
     * Interface en français.
     *
     * Le contenu du Studio est écrit en français depuis le premier jour —
     * titres de champs, textes d'aide, messages de validation. Seule la coquille
     * de Sanity restait en anglais, et c'est elle que la secrétaire lit aux
     * moments décisifs : « Publish », « Draft », « Discard changes ». Un guide
     * qui doit traduire ces mots est un guide qui admet que l'outil ne parle pas
     * la langue de qui s'en sert.
     */
    frFRLocale(),
  ],

  /**
   * Vision est retiré : c'est une console de requêtes GROQ, sans usage éditorial
   * et lourde de conséquences si on s'y trompe. Pour interroger le jeu de
   * données, la ligne de commande `sanity documents query` fait le même travail
   * du côté développeur.
   */

  // Publication programmée : fonctionnalité payante, non souscrite. Laissée
  // visible, elle promettait une planification impossible et menait à une page
  // « Upgrade to unlock ».
  releases: {enabled: false},
  scheduledDrafts: {enabled: false},

  document: {
    /**
     * Le bouton « + » ne propose que ce qui se crée vraiment.
     *
     * Par défaut il listait chaque type du schéma, y compris les documents
     * uniques. Créer une deuxième « Page d'accueil » produisait un document que
     * le site ignore et que la structure ne montre pas : introuvable, et
     * pourtant bien présent dans le jeu de données.
     */
    newDocumentOptions: (previousOptions) =>
      previousOptions.filter((option) => COLLECTION_TYPES.includes(option.templateId)),

    actions: (previousActions, {schemaType}) =>
      SINGLETON_TYPES.includes(schemaType)
        ? previousActions.filter(
            (action) => !action.action || !REMOVED_SINGLETON_ACTIONS.has(action.action),
          )
        : previousActions,
  },

  schema: {
    types: schemaTypes,
  },
})
