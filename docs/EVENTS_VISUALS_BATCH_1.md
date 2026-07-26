# S1-T07 — Lot visuel 1 de la page Événements

## Statut

Ce lot prépare la route `/evenements/` et les cinq premières catégories. Il
ne constitue pas la migration complète de la page Figma et reste volontairement
en `noindex` jusqu’à la fin de S1-T07.

Les filtres, la vue liste, les événements datés, les archives, les états vides
et les autres catégories de l’export Figma ne sont pas encore migrés. Aucun
événement réel, horaire, artiste, partenaire ou calendrier n’est publié.

## Audit de la source Figma

Le véritable composant est
`reference/figma-make-export/src/pages/Evenements.tsx`, relié à la route simulée
`evenements` dans `App.tsx`.

La maquette complète contient :

- un hero photographique sombre de 40 % de la hauteur du viewport;
- un filtre horizontal par catégories;
- un sélecteur grille/liste géré avec React;
- un événement vedette;
- une grille d’événements datés;
- un état vide;
- un CTA vers le secrétariat.

Le lot 1 reprend le hero, la hiérarchie premium et le principe d’un contenu mis
en vedette, mais remplace provisoirement le calendrier par cinq chapitres de
catégories. Ce choix évite de transformer les placeholders Figma en faux
événements actuels.

## Les cinq catégories

| Ordre | Catégorie                        | Visuel                                  | Statut                                |
| ----: | -------------------------------- | --------------------------------------- | ------------------------------------- |
|     1 | Concerts et événements culturels | PNG fourni, affiché avec `astro:assets` | Activité et programmation à confirmer |
|     2 | Messes et grandes célébrations   | PNG fourni, affiché avec `astro:assets` | Dates et horaires à confirmer         |
|     3 | Friperie et entraide             | SVG Astro `AnimatedClothingRack`        | Modalités à confirmer                 |
|     4 | Rencontres communautaires        | SVG Astro `AnimatedCommunityMeal`       | Fréquence et calendrier à confirmer   |
|     5 | Familles, jeunes et générations  | SVG Astro `AnimatedGenerationsChain`    | Programmation à confirmer             |

Les cinq articles alternent le visuel et le texte sur grand écran. Sur mobile,
le visuel précède toujours son texte afin de conserver un ordre de lecture
prévisible.

## Inspection des PNG

Import effectué le 26 juillet 2026. Les sources dans Downloads n’ont pas été
modifiées.

| Fichier de production       | Format réel          |  Dimensions | Transparence |            Poids | SHA-256                                                            | Observation                                                                                                    |
| --------------------------- | -------------------- | ----------: | ------------ | ---------------: | ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `concert-paroissial-01.png` | PNG sRGB 8 bits, RGB | 1448 × 1086 | Aucune       | 2 285 339 octets | `e8c0456b1f5e1e86d2848c84e629e46bc6fd993b3db1621bdc7b89079b74e361` | Nef, public, piano et ensemble musical; aucune interface, marque en filigrane ou inscription parasite visible. |
| `grande-celebration-01.png` | PNG sRGB 8 bits, RGB | 1448 × 1086 | Aucune       | 2 520 226 octets | `0f6da1d721da45774186df53a28e0d9110c387f698355c9aafb475ae6ab50d3f` | Nef et autel ornés de fleurs blanches; aucune interface, marque en filigrane ou inscription parasite visible.  |

Ces visuels ne servent pas de preuve d’un événement, d’un lieu, d’une date ou
d’une programmation. Les textes alternatifs décrivent uniquement ce qui est
visible.

## SVG de production

Les trois illustrations sont écrites comme composants Astro :

- `AnimatedClothingRack.astro` représente un portant et trois vêtements;
- `AnimatedCommunityMeal.astro` représente une tasse, de la vapeur, du pain et
  un plat partagé.
- `AnimatedGenerationsChain.astro` représente, sans texte intégré, un enfant,
  un adolescent, une adulte et une aînée reliés de gauche à droite.

Elles utilisent la palette du site et animent uniquement `transform` et
`opacity`. Les deux premières ont une ambiance CSS continue très lente. La
chaîne intergénérationnelle emploie le contrôleur `IntersectionObserver`
partagé : enfant, adolescent, premier lien, adulte, deuxième lien, aînée,
troisième lien, puis lumière finale. La séquence dure environ 3,55 secondes et
ne se joue qu’une fois.

Sans JavaScript, la chaîne est déjà complète. Un marqueur inline prépare l’état
initial seulement si `IntersectionObserver` est disponible et si reduced
motion n’est pas demandé; un délai de sécurité restaure l’état final si le
module partagé ne confirme pas la prise en charge de l’œuvre. Avec
`prefers-reduced-motion`, toutes les silhouettes et les mains sont
immédiatement visibles, sans translation, échelle ni lueur.

L’œuvre est décorative (`aria-hidden="true"`) parce que son titre et son résumé
existent déjà en HTML. Le contrat conserve néanmoins `accessibleLabel` afin
qu’une future normalisation Sanity dispose de la même structure pour toutes les
variantes illustrées.

## Flux Astro actuel

```text
src/data/events.ts
  → getEventsPageData()
  → frontmatter de src/pages/evenements.astro
  → composants Astro typés
  → HTML, SVG, CSS et images responsives au build
```

`events.ts` contient les textes métier et les références d’images.
`EventCategories.astro` contrôle la composition. Les SVG contrôlent uniquement
leur œuvre visuelle. Aucun composant ne fait de requête et aucun composant ne
connaît la future structure brute de Sanity.

Sanity pourra sélectionner `generations-chain`, modifier le titre, le résumé,
le CTA, l’ordre et l’activation. Astro conservera les silhouettes, la palette,
le CSS, l’animation et le layout.

## Validation attendue pour les prochains lots

Avant de retirer `noindex`, S1-T07 devra encore intégrer et valider :

- les autres catégories et visuels fournis par le client;
- le comportement final de navigation ou de filtrage;
- les vrais états vides et les contenus datés;
- la section finale et les CTA;
- le responsive complet contre la maquette;
- la stratégie d’archives et de pages de détail;
- la validation éditoriale de toute programmation publiée.
