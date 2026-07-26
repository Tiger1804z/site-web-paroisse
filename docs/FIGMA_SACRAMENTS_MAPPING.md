# Cartographie Figma — Sacrements et services

## Méthode

La route simulée `sacrements` de
`reference/figma-make-export/src/App.tsx` charge réellement
`src/pages/Sacrements.tsx`. La page, `main.tsx`, `index.css`, les deux images
importées et les documents d’audit du contenu ont été examinés avant
l’implémentation Astro.

Le fichier Figma commande l’ordre, les proportions et le comportement
responsive. Son contenu opérationnel n’est toutefois pas une source approuvée :
les documents, délais, tarifs, responsables et disponibilités restent à
confirmer auprès de la paroisse.

| Section                     | Source Figma                     | Structure observée                                                                                                                 | Contenu                                                                           | Images                                                                                            | Composant Astro cible                 | Responsive                                  | Notes                                                                                                                                                                                                                        |
| --------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero                        | `Sacrements.tsx`, lignes 28–45   | Hauteur `45vh`, minimum 340 px, photographie plein cadre, overlay prune à 75 %, contenu aligné en bas dans un conteneur de 1280 px | Eyebrow, H1 et introduction                                                       | `20210319_165026_-_Copy.jpg`, conservée en production sous `interieur-eglise-decor-violet-01.jpg` | `SacramentsHero.astro`                | Gouttières 20/40/80 px; titre 44 puis 60 px | Le header Figma est clair sur cette route. La photo ne contient pas de personne; son décor liturgique n’est pas présenté comme permanent.                                                                                    |
| Avertissement introductif   | `Sacrements.tsx`, lignes 47–62   | Bande papier, bordure or fine, texte et CTA répartis horizontalement                                                               | Absence de réservation en ligne et contact avec le secrétariat                    | Aucune                                                                                            | `SacramentsNotice.astro`              | Colonne sur petit écran, ligne dès 640 px   | Le CTA simulé devient un lien Astro `/contact/`. Le message est reformulé sans affirmer une procédure officielle non confirmée.                                                                                              |
| Navigation des demandes     | `Sacrements.tsx`, lignes 64–83   | Trois onglets horizontaux avec bordure inférieure, débordement horizontal possible                                                 | Baptême, Mariage, Autres demandes                                                 | Aucune                                                                                            | `SacramentsExplorer.astro`            | Onglets défilables sans débordement de page | Le `useState` React est remplacé par un script natif avec rôles ARIA, touches fléchées, Home et End. Aucun routeur React.                                                                                                    |
| Baptême                     | `Sacrements.tsx`, lignes 85–123  | Grille asymétrique texte/image 1 colonne puis 2; image au ratio 4:5; panneau important                                             | Résumé, documents et prudence                                                     | `20210331_183200_-_Copy.jpg`, soit `autel-fleurs-blanches-01.jpg`                                 | Panneau de `SacramentsExplorer.astro` | Deux colonnes dès 1024 px                   | La liste précise de documents Figma est remplacée par `[DOCUMENTS À CONFIRMER]`; aucune fréquence, offrande ou date n’est publiée.                                                                                           |
| Mariage                     | `Sacrements.tsx`, lignes 125–164 | Même composition 1/2 colonnes que Baptême, avec photographie différente                                                            | Résumé, documents et disponibilité                                                | Image du hero réutilisée dans Figma                                                               | Panneau de `SacramentsExplorer.astro` | Deux colonnes dès 1024 px                   | Aucun délai, tarif, document ou promesse de disponibilité issu de l’ancien site n’est publié.                                                                                                                                |
| Autres demandes et services | `Sacrements.tsx`, lignes 166–183 | Bloc éditorial étroit, sans photographie                                                                                           | Première communion, confirmation, catéchuménat, funérailles et demandes associées | Aucune                                                                                            | Panneau de `SacramentsExplorer.astro` | Largeur de lecture maximale 640 px          | Les services documentés sont présentés en liste éditoriale compacte, pas en cartes identiques. Certificats et messes sont mentionnés prudemment; tous les CTA vont vers Contact tant que les pages de détail n’existent pas. |
| Démarche                    | `Sacrements.tsx`, lignes 186–221 | Fond papier, titre centré, cinq cercles numérotés reliés par une ligne sur grand écran                                             | Processus en cinq étapes                                                          | Aucune                                                                                            | `GeneralProcess.astro`                | 1 colonne, 3 dès 768 px, 5 dès 1024 px      | Les étapes très affirmatives du prototype deviennent cinq repères généraux et prudents. La ligne, le nombre d’étapes et la composition restent fidèles.                                                                      |
| FAQ                         | `Sacrements.tsx`, lignes 223–254 | Conteneur de 800 px, panneaux papier bordés d’or, chevron et réponse dépliable                                                     | Trois questions                                                                   | Aucune                                                                                            | `SacramentsFaq.astro`                 | Padding adapté au mobile                    | Les accordéons React deviennent des éléments natifs `details/summary`, accessibles au clavier et sans JavaScript.                                                                                                            |

## Valeurs de référence

- conteneur principal : 1280 px;
- gouttières : 20 px sur mobile, 40 px dès 768 px, 80 px dès 1024 px;
- espacement vertical des sections : 96 px sur mobile, 140 px dès 768 px;
- hero : `45vh`, minimum 340 px;
- titre du hero : 44 px sur mobile, 60 px dès 768 px;
- titres de panneau : 36 px sur mobile, 48 px dès 768 px;
- CTA et commandes principales : hauteur tactile minimale de 48 px;
- bordures : 1 px, or translucide;
- formes : panneaux presque carrés, cercles réservés aux numéros d’étape;
- transitions : couleurs sobres et rotation du chevron.

## Responsabilités du contenu

### Page d’aperçu `sacramentsPage`

- hero et introduction;
- ordre des catégories affichées;
- texte général de la démarche;
- avertissement;
- FAQ de la page;
- CTA final ou contextuel.

### Futurs documents `sacrament`

- titre et slug;
- résumé et contenu détaillé;
- image et texte alternatif;
- exigences, étapes et FAQ propres;
- état actif et ordre;
- date de dernière révision.

### Réglages globaux `siteSettings`

- téléphone;
- courriel;
- adresse;
- heures du secrétariat;
- libellé et destination du contact général.

## Décisions et divergences volontaires

- la palette premium remplace les teintes beige originales sans modifier les
  rôles visuels;
- le titre public devient « Sacrements et services » pour refléter le sitemap
  consolidé;
- les procédures précises et potentiellement périmées sont remplacées par des
  formulations prudentes et des placeholders;
- les onglets restent interactifs, mais utilisent Astro et JavaScript natif
  plutôt qu’un état React;
- la FAQ utilise `details/summary`;
- aucune page de détail ni route dynamique n’est créée dans ce ticket;
- aucune action « En savoir plus » ne pointe vers une route inexistante;
- les focus visibles et la navigation clavier créent de petites différences
  nécessaires à WCAG AA.

## État des pages de détail

Les slugs peuvent être préparés dans le contrat interne, mais
`detailPageAvailable` reste `false`. Les CTA pointent donc vers `/contact/`.
Un futur ticket pourra créer `src/pages/sacrements/[slug].astro` lorsque le
contenu, les routes et le modèle Sanity auront été validés.
