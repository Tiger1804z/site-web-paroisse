# Cartographie Figma de la page Horaires

## Portée et sources

Cartographie réalisée le 25 juillet 2026 avant l’implémentation Astro de
`S1-T03`. La source de vérité est
`reference/figma-make-export/src/pages/Horaires.tsx`, complétée par :

- `reference/figma-make-export/src/App.tsx` pour le header, le footer et le faux
  routage React;
- `reference/figma-make-export/src/index.css` pour les polices, couleurs et
  utilitaires;
- `reference/figma-make-export/src/main.tsx` pour le point d’entrée React;
- `reference/figma-make-export/src/imports/20210326_164625_-_Copy.jpg` pour
  l’image du hero;
- `docs/FIGMA_DESIGN_MAPPING.md` pour les décisions déjà migrées dans S1-T01;
- `docs/CONTENT_INVENTORY.md` pour les contradictions et statuts de fiabilité.

L’export Figma est lu comme référence visuelle; aucun de ses fichiers n’est
importé ou modifié par l’application Astro.

## Cartographie section par section

| Section                            | Source Figma                                                                    | Structure observée                                                                                                                                                              | Données                                                        | Composant Astro cible                                                     | Responsive                                                                                                       | Notes                                                                                                                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero                               | `Horaires.tsx`, premier `<section>`                                             | Photo plein cadre; hauteur `40vh`, minimum 320 px; overlay bourgogne à 70 %; contenu aligné en bas; conteneur 1280 px; padding bas 56 px; eyebrow, H1 et introduction de 540 px | Eyebrow, titre, introduction, image et texte alternatif        | `SchedulesHero.astro`                                                     | Gouttières 20/40/80 px; H1 44 px mobile et 60 px desktop; hauteur conservée                                      | L’image source correspond à `autel-decor-rouge-01.jpg`. Le header est clair sur cette page dans le prototype, car `Horaires` n’est pas classée comme page à header transparent dans `App.tsx`.                      |
| Panneau « Avant de vous déplacer » | `Horaires.tsx`, « Alert module »                                                | Bande papier bord à bord; filet doré inférieur; pictogramme information; texte à gauche; CTA bordé à droite                                                                     | Titre, message, lien Contact                                   | `BeforeYouVisitBanner.astro`                                              | Empilé sur mobile; ligne à partir de 640 px; CTA repoussé à droite                                               | Le contenu de prudence est durable, mais sa formulation reste administrable. Le bouton React devient un lien Astro réel.                                                                                            |
| Grille principale                  | `Horaires.tsx`, « Main content »                                                | Conteneur 1280 px; padding vertical 64/96 px; colonne principale fluide et sidebar fixe de 360 px; gap 48 px                                                                    | Aucune donnée éditoriale directe                               | Composition dans `horaires.astro` avec `Container.astro`                  | Une colonne sous 1024 px; sidebar placée après le contenu principal                                              | Structure purement visuelle.                                                                                                                                                                                        |
| Horaires réguliers                 | `Horaires.tsx`, « Horaires réguliers »                                          | H2 32/40 px; cadre fin doré; quatre lignes; libellé et note à gauche, heure à droite; dernière ligne sur fond papier; date de mise à jour sous le cadre                         | Période, groupes de jours, heures, notes, dernière mise à jour | `RegularSchedule.astro`                                                   | Les lignes restent horizontales lorsque lisibles; elles deviennent des blocs plus souples sur très petits écrans | Les horaires réels contradictoires sont remplacés uniquement par des placeholders. La source de contenu doit accepter plusieurs heures par jour.                                                                    |
| Horaire saisonnier                 | Absent de `Horaires.tsx`; exigence S1-T03                                       | Extension éditoriale utilisant le vocabulaire du cadre régulier et des panneaux papier                                                                                          | Titre, description, dates de validité, horaires, état actif    | `SeasonalSchedules.astro`                                                 | Cartes empilées; aucune grille serrée sur mobile                                                                 | Divergence fonctionnelle documentée. Aucun horaire estival hérité n’est publié. La section peut être désactivée ou vide.                                                                                            |
| Célébrations spéciales             | `Horaires.tsx`, « Célébrations spéciales »                                      | H2 28/36 px; liste verticale de panneaux papier; filet doré de 2 px à gauche; date en eyebrow; heure alignée à droite; badge optionnel                                          | Titre, date, heure et note; tableau potentiellement vide       | `SpecialCelebrations.astro`                                               | Retours à la ligne autorisés; heure passe sous le contenu si nécessaire                                          | La source locale montre deux entrées placeholder pour valider la composition; le composant possède aussi un état vide honnête pour une future collection Sanity vide.                                               |
| FAQ                                | `Horaires.tsx`, « Questions fréquentes »                                        | H2 28/36 px; panneaux bordés; en-tête de 20 px vertical; chevron doré; réponse séparée par un filet                                                                             | Questions et réponses générales                                | `ScheduleFaq.astro`                                                       | Largeur fluide; aucun contenu tronqué                                                                            | L’état React `openFaq` est remplacé par `<details>/<summary>`, utilisable au clavier sans JavaScript.                                                                                                               |
| Feuillet                           | `Horaires.tsx`, « Feuillet CTA »                                                | Panneau bourgogne de 360 px; eyebrow doré; H3 ivoire; semaine en texte atténué; CTA clair pleine largeur                                                                        | Libellé, titre, période et lien Feuillets                      | `ScheduleSidebar.astro`                                                   | Pleine largeur sous 1024 px                                                                                      | Le prototype promet un téléchargement inexistant. Le CTA devient « Consulter les feuillets » et pointe vers `/feuillets-paroissiaux/`.                                                                              |
| Secrétariat                        | `Horaires.tsx`, « Secrétariat »                                                 | Panneau bordé; eyebrow; heures; aide; lien téléphonique avec pictogramme                                                                                                        | Heures, texte d’aide et destination Contact                    | `ScheduleSidebar.astro`                                                   | Pleine largeur; cible tactile d’au moins 48 px                                                                   | Aucun `tel:` factice n’est généré. Tant que le numéro n’est pas confirmé, le CTA mène à `/contact/`.                                                                                                                |
| Prochaines dates                   | `Horaires.tsx`, « Prochaines dates »                                            | Panneau papier; trois lignes compactes; carré bourgogne pâle; lien vers les événements                                                                                          | Liste de dates et lien Événements                              | Non migré comme donnée active; rôle repris par les célébrations spéciales | Sans objet                                                                                                       | Les trois faux événements du prototype feraient doublon avec la section principale et ne sont pas requis par S1-T03. La composition latérale est conservée avec les panneaux Feuillet, Secrétariat et confirmation. |
| Alerte de changement               | Non distincte dans `Horaires.tsx`; proche du panneau « Avant de vous déplacer » | Panneau compact à pictogramme, titre, message et CTA; variantes par couleur et libellé                                                                                          | Titre, message, sévérité et état actif normalisé               | `ScheduleNotice.astro`                                                    | Texte et CTA empilés sur petit écran                                                                             | Extension requise par S1-T03. Une alerte inactive ne génère aucun HTML ni espace résiduel. Les dates brutes futures resteront dans Sanity et serviront au normaliseur pour calculer `active`.                       |

## Valeurs visuelles observées

| Élément              | Valeur observée dans Figma                          | Cible de production                              |
| -------------------- | --------------------------------------------------- | ------------------------------------------------ |
| Conteneur            | `max-width: 1280px`                                 | `Container.astro`, variante large                |
| Gouttières           | 20 px, 40 px dès 768 px, 80 px dès 1024 px          | Tokens existants de S1-T01                       |
| Hero                 | `40vh`, minimum 320 px                              | Même proportion avec `min-height` et image Astro |
| H1                   | 44 px mobile, 60 px desktop, Cormorant Garamond 600 | `.type-h1` et ajustement contextuel fidèle       |
| Introduction         | 18 px, largeur 540 px, ivoire à 70 %                | Type `body-large`, largeur de lecture 540 px     |
| H2 principal         | 32 px mobile, 40 px desktop                         | Cormorant Garamond 600                           |
| H2 secondaires       | 28 px mobile, 36 px desktop                         | Cormorant Garamond 600                           |
| Horaire              | 24 px, Cormorant Garamond 500, bourgogne            | Même hiérarchie, jamais réduite sous 22 px       |
| Sidebar              | 360 px                                              | Colonne fixe à partir de 1024 px                 |
| Bordures             | Or à 15–30 %, généralement 1 px                     | Tokens de bordure premium existants              |
| Panneaux             | Fond papier, sans gros rayon ni ombre               | Palette premium de production                    |
| Espacement principal | 64 px mobile, 96 px desktop                         | Tokens de section existants                      |
| Transitions          | Couleurs 200–300 ms; chevron 300 ms                 | Transitions sobres et réduction de mouvement     |

## Séparation entre présentation et contenu

### Purement visuel

- hauteur et recadrage du hero;
- grille principale et largeur de la sidebar;
- fonds ivoire, papier et bourgogne;
- bordures et filets dorés;
- hiérarchie typographique;
- espacements, alignements et états de survol;
- chevrons, horloge et pictogrammes SVG locaux.

Ces décisions appartiennent aux composants Astro et aux styles. Elles ne doivent
pas devenir des champs Sanity.

### Contenu local typé pendant S1-T03

- eyebrow, titre et introduction;
- horaires réguliers et groupes de jours;
- horaires saisonniers;
- alerte active ou inactive;
- célébrations spéciales;
- dernière mise à jour;
- message avant déplacement;
- textes et destinations des liens;
- questions et réponses de la FAQ.

Ces valeurs sont centralisées dans `src/data/schedules.ts`, puis exposées par
`getSchedulePageData()`. Les composants ne les redéfinissent pas.

### Futur contenu contrôlé par Sanity

- périodes, entrées et heures;
- dates de validité;
- activation des horaires saisonniers;
- alerte, variante et fenêtre de publication;
- célébrations spéciales;
- dernière validation;
- message de prudence;
- libellés éditoriaux et FAQ si la paroisse doit les administrer.

Sanity ne contrôlera ni les classes CSS, ni les colonnes, ni les couleurs, ni la
structure HTML. Une couche de normalisation convertira sa réponse brute vers le
contrat TypeScript interne utilisé par les composants.

## Interactions et JavaScript

Le prototype emploie React pour :

- simuler le routage avec un état central;
- ouvrir une seule réponse de FAQ à la fois;
- transformer les boutons de navigation en changements d’état.

La version Astro utilisera de vraies routes et des liens HTML. La FAQ reposera
sur `<details>/<summary>`. Aucun JavaScript client et aucun composant React ne
sont nécessaires pour le contenu de cette page.

## Divergences prévues et justifiées

1. La palette premium de S1-T01 remplace les beiges originaux sans changer leur
   rôle.
2. Les horaires observés sur l’ancien site ne sont jamais utilisés; seuls des
   placeholders explicites sont publiés.
3. Le faux téléchargement du feuillet devient un lien honnête vers la page des
   feuillets.
4. Le faux `tel:[TÉLÉPHONE]` devient un lien vers Contact.
5. La FAQ React devient un accordéon HTML natif accessible.
6. Un horaire saisonnier et une alerte désactivable sont ajoutés conformément au
   contrat S1-T03, avec le langage visuel du prototype.
7. Les trois fausses « prochaines dates » de la sidebar ne sont pas reproduites;
   les célébrations spéciales typées assurent cette fonction sans duplication.

## Points de validation visuelle

- comparer la hauteur, l’overlay et l’alignement inférieur du hero;
- vérifier les gouttières 20/40/80 px et le conteneur 1280 px;
- vérifier la grille principale et la sidebar de 360 px à 1440 et 1280 px;
- comparer les quatre niveaux typographiques de la page;
- conserver les panneaux sans rayons généreux ni ombres lourdes;
- vérifier les filets dorés, les fonds papier et le panneau bourgogne;
- vérifier l’empilement à 768, 430, 390 et 360 px;
- tester les `<details>` au clavier et le focus visible;
- confirmer qu’aucun horaire réel n’apparaît dans le HTML.
