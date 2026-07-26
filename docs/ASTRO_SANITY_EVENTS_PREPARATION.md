# Préparation Astro et Sanity — Événements

## Flux actuel

```text
src/data/events.ts
  → getEventsPageData()
  → frontmatter Astro
  → composants Astro avec props typées
  → HTML statique
```

Le frontmatter de `src/pages/evenements.astro` s’exécute pendant le build. Il
attend `getEventsPageData()`, puis transmet `hero`, `overview` et `categories`
aux composants. Les fichiers TypeScript ne deviennent pas un état React envoyé
au navigateur. Le navigateur reçoit principalement du HTML, du SVG, du CSS et
les variantes d’images produites par Astro.

React n’est pas nécessaire pour ce lot : les cinq catégories sont générées en
HTML statique et les animations décoratives sont exprimées en CSS. Le petit
contrôleur partagé utilise `IntersectionObserver` uniquement pour déclencher
une fois la chaîne intergénérationnelle. Un futur filtre interactif pourra
employer un script ciblé ou un composant hydraté seulement si le besoin
fonctionnel le justifie.

## Contrat interne

`EventsPageData` est le contrat stable entre le contenu et la présentation.
`EventCategory` contient :

- `id` : identité technique interne;
- `slug` : identifiant stable utilisable par une ancre ou une future route;
- `title` et `summary` : contenu éditorial;
- `category` : taxonomie contrôlée;
- `visual` : union discriminée;
- `featured` : mise en vedette éditoriale;
- `active` : publication dans l’aperçu;
- `confirmationRequired` : prudence éditoriale;
- `cta` : action facultative.

Le tableau porte déjà son ordre d’affichage. Un futur normalisateur triera la
réponse Sanity avant de retourner `EventsPageData`; le contrat interne n’a donc
pas besoin d’un champ `order` inutilisé aujourd’hui.

## Visuels polymorphes

La propriété `visual.kind` sélectionne une branche précise :

```text
kind = image
  → Astro Image avec image et texte alternatif

kind = clothing-rack
  → AnimatedClothingRack

kind = community-meal
  → AnimatedCommunityMeal

kind = generations-chain
  → AnimatedGenerationsChain
```

TypeScript empêche un composant de demander `imageAlt` à un SVG ou
`accessibleLabel` à une image. C’est l’intérêt de l’union discriminée :
l’interface reste flexible sans employer `any`.

## Flux futur Sanity

```text
Sanity Studio
  → eventsPage et catégories
  → requête GROQ centralisée
  → normalisation
  → EventsPageData
  → mêmes composants Astro
  → nouvelle version HTML statique
```

Sanity pourra modifier :

- le titre et le résumé;
- la catégorie;
- une image et son texte alternatif;
- le CTA;
- l’état actif;
- l’ordre;
- la mise en vedette;
- plus tard, les dates et informations d’un véritable événement.

Le normalisateur pourra renommer `visualType` en `kind`, fournir des valeurs par
défaut, filtrer les entrées inactives, trier les catégories et vérifier qu’une
image possède un texte alternatif.

## Ce qui reste dans Astro

Le CMS ne contient pas le SVG, le CSS ou le JavaScript de présentation. Astro
conserve :

- `AnimatedClothingRack.astro`;
- `AnimatedCommunityMeal.astro`;
- `AnimatedGenerationsChain.astro`;
- les mouvements, couleurs et règles reduced motion;
- la grille, les espacements et les breakpoints;
- le choix du composant correspondant à `visual.kind`;
- les règles d’accessibilité et de validation;
- les routes.

Cette frontière évite qu’un éditeur doive manipuler du code ou du HTML libre.
Sanity choisit un type de visuel; Astro garantit son rendu.

## Modèle Sanity possible

Le lot ne crée aucun schéma, mais un futur document `eventsPage` pourrait
contenir un tableau ordonné de références ou d’objets `eventCategory`.

| Contrat interne   | Champ Sanity potentiel         | Rôle                     |
| ----------------- | ------------------------------ | ------------------------ |
| `title`           | `string`                       | Titre éditorial          |
| `summary`         | `text` ou Portable Text limité | Résumé                   |
| `category`        | `string` avec liste contrôlée  | Taxonomie                |
| `visual.kind`     | `string` avec liste contrôlée  | Sélection du rendu Astro |
| `visual.image`    | `image`                        | Asset éditorial          |
| `visual.imageAlt` | `string`                       | Alternative textuelle    |
| `featured`        | `boolean`                      | Mise en vedette          |
| `active`          | `boolean`                      | Publication              |
| ordre du tableau  | tableau réordonnable           | Ordre d’affichage        |
| `cta`             | `object`                       | Libellé et destination   |

Les SVG restent des options contrôlées telles que `clothing-rack`,
`community-meal` et `generations-chain`. Sanity n’enregistre jamais leur
balisage. Pour la chaîne intergénérationnelle, il contrôle le type de visuel, le
titre, le résumé, le CTA, l’ordre et l’activation; Astro contrôle les
personnages, les couleurs, l’animation, le CSS et le layout.

## Catégorie contre événement daté

Les cinq objets du lot 1 décrivent des catégories éditoriales, pas des
occurrences datées. Une étape future pourra introduire un type `event` avec
date, heure, lieu, statut d’annulation et archive. Une catégorie pourra alors
regrouper plusieurs événements sans dupliquer sa présentation.

Cette distinction évite d’ajouter aujourd’hui des champs de calendrier qui ne
sont ni utilisés ni confirmés.

## Publication statique

Une publication Sanity ne modifiera pas instantanément le HTML déjà déployé.
Un webhook devra déclencher un nouveau build :

```text
publication Sanity
  → webhook
  → build Astro
  → GROQ et normalisation
  → fichiers HTML et images
  → nouvelle version du site
```

Ce modèle reste rapide, résilient et adapté à un site paroissial. Aucun package
Sanity, secret, webhook ou schéma n’est installé dans ce lot.
