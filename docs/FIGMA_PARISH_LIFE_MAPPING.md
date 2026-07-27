# Cartographie Figma — Vie paroissiale

## Source et portée

La route simulée `vie-paroissiale` est déclarée dans
`reference/figma-make-export/src/App.tsx` et rend directement
`src/pages/VieParoissiale.tsx`. La page n'importe aucun composant de section
externe : son hero, son introduction, ses quatre chapitres et son appel final
sont définis dans ce fichier.

La fidélité 1:1 porte sur la composition, les proportions, le rythme,
l'alternance et le responsive. Les groupes, responsables, fréquences et
activités de la maquette sont des contenus à confirmer. Ils ne sont donc pas
publiés comme des faits actuels.

| Section      | Source Figma                                          | Structure observée                                                                     | Contenu Figma                                              | Image                        | Composant Astro cible                                     | Responsive                                          | Notes                                                                                                                                            |
| ------------ | ----------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------- | --------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Routage      | `App.tsx`, lignes de navigation et rendu conditionnel | Entrée principale « Vie paroissiale »; page React rendue pour l'état `vie-paroissiale` | Aucun vrai routeur                                         | —                            | Route statique `src/pages/vie-paroissiale.astro`          | Même destination dans les menus desktop et mobile   | Astro remplace la navigation simulée par `/vie-paroissiale/`.                                                                                    |
| Hero         | `VieParoissiale.tsx`, premier `section`               | Photo plein cadre, overlay charbon, contenu aligné en bas à gauche                     | « Communauté », « Vivre la paroisse », introduction        | `20210326_164625_-_Copy.jpg` | `ParishLifeHero.astro`                                    | Hauteur `45vh`, minimum 340 px; H1 44 px puis 60 px | Le header reste clair comme dans `App.tsx`, où cette route n'est pas classée parmi les héros transparents.                                       |
| Introduction | deuxième `section`                                    | Bloc étroit centré sur ivoire, eyebrow, H2, paragraphe                                 | « Vie communautaire », « Une paroisse, plusieurs visages » | —                            | `ParishLifeIntroduction.astro`                            | 80 px verticaux; typographie agrandie dès tablette  | Une note éditoriale discrète signale que les groupes et modalités restent à confirmer.                                                           |
| Chapitre 1   | tableau `groupes`, index 0                            | Image 4:3 à gauche, texte à droite, badge sur l'image, liste pratique, CTA             | Jeunes                                                     | `20210312_181118_-_Copy.jpg` | `ParishLifeFeature.astro` dans `ParishLifeFeatures.astro` | Une colonne avant 1024 px; deux colonnes ensuite    | Le groupe reste présent comme dans Figma, avec un statut public « à confirmer » et sans activité, fréquence, responsable ou coordonnée inventés. |
| Chapitre 2   | tableau `groupes`, index 1                            | Texte à gauche, image 4:3 à droite                                                     | Chorale                                                    | `20210319_165026_-_Copy.jpg` | mêmes composants                                          | Alternance à partir de 1024 px                      | La présence et le fonctionnement actuels de la chorale restent à confirmer.                                                                      |
| Chapitre 3   | tableau `groupes`, index 2                            | Image à gauche, texte à droite                                                         | Dames et Fils de Notre-Dame                                | `20210331_183200_-_Copy.jpg` | mêmes composants                                          | Même alternance                                     | Le nom vient de Figma; la mission, les activités et les coordonnées actuelles restent à confirmer.                                               |
| Chapitre 4   | tableau `groupes`, index 3                            | Texte à gauche, image à droite                                                         | Marguilliers                                               | `20210319_184417_-_Copy.jpg` | mêmes composants                                          | Même alternance                                     | La composition du conseil, ses responsabilités actuelles et les coordonnées ne sont pas publiées comme confirmées.                               |
| CTA final    | dernier `section`                                     | Fond bourgogne, contenu étroit centré, accent manuscrit, H2, texte, bouton ivoire      | « Ensemble », « Vous souhaitez vous impliquer? »           | —                            | `ParishLifeParticipation.astro`                           | 80 px verticaux; bouton tactile de 48 px minimum    | Le CTA utilise la vraie route `/contact/`, actuellement disponible comme placeholder technique.                                                  |
| Mouvement    | hover d'image dans `VieParoissiale.tsx`               | Zoom au survol sur 700 ms                                                              | Purement décoratif                                         | médias des chapitres         | Système `data-motion-*` existant                          | Révélations désactivées avec reduced motion         | Les reveals restent une amélioration progressive; le contenu est visible sans JavaScript.                                                        |

## Images correspondantes

Les cinq fichiers Figma existent déjà dans `src/assets/images/paroisse/` avec
les mêmes pixels et les noms de production suivants :

| Fichier Figma                | Fichier Astro                          |  Dimensions |     Poids source | Utilisation |
| ---------------------------- | -------------------------------------- | ----------: | ---------------: | ----------- |
| `20210326_164625_-_Copy.jpg` | `autel-decor-rouge-01.jpg`             | 4624 × 3468 | 4 884 858 octets | Hero        |
| `20210312_181118_-_Copy.jpg` | `autel-eclairage-rose-01.jpg`          | 4624 × 3468 | 3 616 904 octets | Chapitre 1  |
| `20210319_165026_-_Copy.jpg` | `interieur-eglise-decor-violet-01.jpg` | 4624 × 3468 | 4 130 155 octets | Chapitre 2  |
| `20210331_183200_-_Copy.jpg` | `autel-fleurs-blanches-01.jpg`         | 4624 × 3468 | 3 942 531 octets | Chapitre 3  |
| `20210319_184417_-_Copy.jpg` | `autel-decor-violet-01.jpg`            | 4624 × 3468 | 5 010 030 octets | Chapitre 4  |

Toutes sont des photographies intérieures sans personne visible. Les fichiers
source ne sont ni copiés ni modifiés; `astro:assets` produira les variantes
responsives au build.

## Contenu et frontière CMS

Le contenu de page modifiable plus tard comprend le hero, l'introduction, la
note de confirmation, les titres, résumés, CTA, ordre, activation, images,
positions de recadrage, textes alternatifs et crédits.

Le code conserve la grille alternée, les breakpoints, les couleurs, les
animations et les règles d'accessibilité. Le futur flux est :

```text
Sanity parishLifePage
  → GROQ
  → normalisation
  → ParishLifePageData
  → mêmes composants Astro
  → HTML statique
```

`ParishLifeFeature` décrit un portail éditorial durable. `ParishEvent` décrit
une occurrence datée. La maquette ne contient pas de section d'événements à
venir; aucun événement n'est donc copié ou filtré dans cette page.

## Divergences volontaires

- La palette globale déjà validée remplace les valeurs légèrement différentes
  de l'export.
- Le logo officiel, le header, le footer et les vraies routes Astro remplacent
  le shell React de démonstration.
- Les quatre groupes Figma sont conservés, mais clairement signalés comme
  contenus à confirmer. Les listes de responsables, fréquences et activités
  fictives ne sont pas reprises.
- Les boutons React deviennent des liens HTML accessibles vers des routes
  réelles.
