# Cartographie de la chronologie historique

## Périmètre

Cette cartographie remplace la chronologie compacte de
`ParishHistory.astro` par neuf chapitres sémantiques. Elle utilise le récit
historique de l’ancien site comme source éditoriale acceptée par le client,
sans transformer les illustrations générées en preuves historiques.

La chronologie conserve l’ordre du récit dans le DOM. Astro produit les
articles et leurs textes au build; le script de scrollytelling ajoute seulement
un état actif lorsque JavaScript et `IntersectionObserver` sont disponibles.

| Étape | Période         | Source éditoriale                                                | Illustration                            | Type d’image                    | Statut            | Composant                        | Notes                                                                                                                                    |
| ----- | --------------- | ---------------------------------------------------------------- | --------------------------------------- | ------------------------------- | ----------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Avant 1959      | Récit accepté de l’ancien site, contexte général                 | `01-avant-1959.png`                     | Illustration artistique générée | `accepted-source` | `ImmersiveHistoryTimeline.astro` | Vue aérienne et tracé entièrement illustratifs; aucun plan historique authentique.                                                       |
| 2     | 23 février 1959 | Récit accepté de l’ancien site                                   | `02-fondation-1959.png`                 | Illustration artistique générée | `accepted-source` | `ImmersiveHistoryTimeline.astro` | Portrait et décret non documentaires. Le faux décret visible contient des formulations incohérentes qui ne doivent pas servir de source. |
| 3     | 1960            | Récit accepté de l’ancien site                                   | `03-achat-terrain-1960.png`             | Illustration artistique générée | `accepted-source` | `ImmersiveHistoryTimeline.astro` | Le plan, les limites et annotations sont une composition artistique, pas un plan cadastral.                                              |
| 4     | 1959–1963       | Récit accepté de l’ancien site                                   | `04-paroisse-sans-eglise-1959-1963.png` | Illustration artistique générée | `accepted-source` | `ImmersiveHistoryTimeline.astro` | Personnes et scène liturgique générées; aucune identité historique ne leur est attribuée.                                                |
| 5     | 1963–1964       | Récit accepté de l’ancien site                                   | `05-construction-eglise-1963-1964.png`  | Illustration artistique générée | `accepted-source` | `ImmersiveHistoryTimeline.astro` | Portraits des architectes non authentiques; représentation du chantier non documentaire.                                                 |
| 6     | 1964            | Récit accepté de l’ancien site et observations architecturales   | `06-architecture-1964.png`              | Illustration artistique générée | `accepted-source` | `ImmersiveHistoryTimeline.astro` | L’intérieur, les matériaux et les objets sont stylisés; les attributions restent éditoriales.                                            |
| 7     | Vers 1990       | Récit accepté de l’ancien site                                   | `07-evolution-vers-1990.png`            | Illustration artistique générée | `accepted-source` | `ImmersiveHistoryTimeline.astro` | Les vignettes imitent des photographies, mais sont générées. La date précise des transformations reste à confirmer.                      |
| 8     | 6 mai 2018      | Plaque photographiée dans l’église                               | `plaque-consecration-01.webp`           | Photographie documentaire       | `to-confirm`      | `ImmersiveHistoryTimeline.astro` | Interlude « Repère documentaire ». La transcription et la formulation doivent encore être validées par la paroisse.                      |
| 9     | Aujourd’hui     | Formulation générale approuvée pour éviter les données volatiles | `08-patrimoine-vivant-aujourdhui.png`   | Illustration artistique générée | `volatile`        | `ImmersiveHistoryTimeline.astro` | La foule et l’événement sont générés. La mention de concerts intégrée aux pixels ne confirme aucune programmation actuelle.              |

## Contenu contre présentation

Relève du contenu :

- périodes, titres, résumés et paragraphes;
- ordre des chapitres;
- image et texte alternatif;
- type d’image, source et statut éditorial;
- divulgation sur les illustrations;
- épilogue.

Relève du code Astro et CSS :

- grille alternée à trois colonnes;
- ligne, repères et progression;
- transitions entre les visuels;
- seuils responsive;
- fallback sans JavaScript;
- comportement reduced motion.

## Limitation des textes intégrés

Les huit PNG contiennent déjà numéro, période, titre et texte dans leurs pixels.
Le composant ne superpose donc pas une copie complète de ces textes sur
l’illustration. Chaque chapitre conserve néanmoins son résumé et son contenu en
HTML afin que le récit soit sélectionnable, indexable, accessible et
ultérieurement modifiable dans Sanity.

La cible de production idéale est une série d’illustrations sans texte. Leur
substitution ne changera ni le contrat de données ni le composant.
