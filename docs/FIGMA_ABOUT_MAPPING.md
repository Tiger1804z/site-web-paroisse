# Cartographie Figma — Notre paroisse

## Méthode

Cartographie réalisée le 25 juillet 2026 à partir de
`reference/figma-make-export/src/pages/NotreParoisse.tsx`, de `App.tsx` et de
`index.css`. Les valeurs ci-dessous décrivent la source visuelle; la palette
premium, le logo officiel, les routes Astro et les corrections d’accessibilité
déjà validées restent prioritaires.

Le fichier Figma contient sept sections. Il ne contient ni chronologie autonome,
ni galerie autonome, ni section de consécration séparée. Les repères historiques
et la plaque seront donc intégrés dans la composition « Histoire », sans ajouter
une grande section étrangère au prototype.

| Section              | Source Figma                               | Structure observée                                                                                                                | Contenu                                                                         | Images                                             | Composant Astro cible            | Responsive                                                                               | Notes                                                                                                                                                 |
| -------------------- | ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero                 | `NotreParoisse.tsx`, lignes du bloc `Hero` | `min-height: 70vh`, image plein cadre, overlay vertical sombre, filet central, contenu aligné en bas dans un conteneur de 1280 px | Accent manuscrit, H1 sur deux lignes, introduction courte                       | `20210320_163052_-_Copy.jpg`                       | `AboutHero.astro`                | Padding horizontal 20/40/80 px; titre 48/68/80 px; contenu en bas sur toutes les tailles | La source montre une personne. Divergence volontaire : vue extérieure des clochers sans personne, avec recadrages desktop/mobile distincts.           |
| Introduction         | bloc `Bienvenue`                           | Section ivoire, contenu centré de 680 px, eyebrow, H2, deux paragraphes                                                           | Message d’accueil temporaire, non présenté comme mission officielle             | Aucune                                             | `AboutIntroduction.astro`        | Padding vertical 96 px mobile et 140 px dès 768 px; H2 36/48 px                          | Le texte est réécrit prudemment; la hiérarchie reste identique.                                                                                       |
| Histoire et repères  | bloc `Histoire`, remplacé par S1-T06.6     | Chronologie immersive bourgogne et charbon; grands chapitres alternant image et texte autour d’un axe central                     | Neuf repères, sources, statuts et divulgation sur les illustrations artistiques | Huit PNG générés et `plaque-consecration-01.webp`  | `ImmersiveHistoryTimeline.astro` | Grille alternée dès 1024 px; pile sémantique sur tablette, mobile et sans JavaScript     | S1-T06.6 constitue une évolution éditoriale volontaire par rapport au diptyque Figma initial. La plaque demeure un interlude documentaire distinct.   |
| Principes éditoriaux | bloc `Mission & Valeurs`                   | Fond charbon, filet doré central, titre centré, trois panneaux séparés par des traits de 1 px                                     | Trois messages temporaires; aucun énoncé de mission officielle                  | Trois SVG locaux dessinés dans le composant        | `AboutPrinciples.astro`          | 1 colonne mobile, 3 colonnes dès 768 px; panneaux 32/40 px                               | « Mission et valeurs » devient « Foi, rencontre et solidarité » pour éviter une déclaration institutionnelle non confirmée.                           |
| Architecture         | bloc `Architecture`                        | Fond ivoire; grille `420px / 1fr`; image portrait à gauche; texte, introduction et grille de caractéristiques à droite            | Matériaux, lumière, nef et chœur, entrée, clochers et presbytère                | `20210328_125526_-_Copy.jpg`                       | `ArchitectureStory.astro`        | 1 colonne avant 1024 px; caractéristiques en 2 colonnes lorsque l’espace le permet       | Image remplacée par une vue intérieure sans personne. Les formulations restent prudentes et n’affirment aucun statut patrimonial.                     |
| Architectes          | bloc `Équipe`                              | Fond papier; titre centré; grille de trois panneaux; deux cartes claires et un panneau bourgogne                                  | Roger D’Astous, Jean-Paul Pothier, puis note de validation éditoriale           | Aucun portrait confirmé dans la source ou le dépôt | `ArchitectsSection.astro`        | 1/2/3 colonnes aux seuils 768/1024 px                                                    | La structure de trois panneaux est conservée; l’équipe pastorale hors périmètre est remplacée par les architectes demandés, sans biographie inventée. |
| Invitation finale    | bloc `CTA Première visite`                 | Fond ivoire, bordure supérieure dorée, texte centré, accent manuscrit et deux CTA                                                 | Invitation temporaire, Première visite et Contact                               | Aucune                                             | `AboutClosing.astro`             | Boutons empilables puis côte à côte; cibles d’au moins 48 px                             | Le second CTA Figma « Horaires » devient « Nous joindre » selon le ticket.                                                                            |

**Sélection finale du hero :** la vue des clochers évaluée pendant l’audit a
été remplacée après comparaison visuelle par
`eglise-exterieur-identification-01.webp`. Cette photographie sans personne
évite le panneau de signalisation très présent dans le cadrage large, tout en
conservant l’église comme sujet principal. Aucun style ou rapport de composition
n’a été modifié.

## Ce qui relève du design

- l’ordre des sept sections;
- les largeurs, grilles, espacements, alignements et chevauchements;
- la hiérarchie typographique et les accents manuscrits;
- les fonds ivoire, papier et charbon selon la palette premium;
- les filets, bordures, overlays, recadrages et états interactifs;
- le passage des grilles horizontales aux blocs verticaux.

Ces éléments restent dans les composants Astro et le CSS.

## Ce qui relève du contenu

- les titres, paragraphes et libellés;
- les repères historiques et leur statut de confirmation;
- les caractéristiques architecturales;
- les profils d’architectes;
- les images, textes alternatifs et positions de recadrage;
- les CTA et l’activation des sections facultatives.

Ces éléments passent par `AboutPageData`.

## Préparation Sanity

Une future requête GROQ remplacera la source locale dans
`getAboutPageData()`. Une normalisation traduira la réponse brute de Sanity vers
le même contrat `AboutPageData`. Les composants ne recevront ni document Sanity
brut, ni requête GROQ, ni client API.

Les contenus éditoriaux, images, textes alternatifs, repères et profils pourront
être administrés. La grille, la typographie, les couleurs, le responsive,
l’accessibilité et les routes resteront dans le code.

## Informations non confirmées

- dates de fondation, d’achat du terrain et de construction;
- attribution et rôle exact de Roger D’Astous et Jean-Paul Pothier;
- matériaux, nombre de clochers, transformations et presbytère intégré;
- formulation de la consécration du 6 mai 2018;
- tout statut patrimonial;
- droits de publication de toutes les photographies.

Les données conservent ces statuts à des fins éditoriales. La page évite les
formulations catégoriques tant qu’une validation paroissiale n’a pas eu lieu.
