# Contribuer

## Branches

1. Partir de `staging`.
2. Créer une branche `feature/description-courte`.
3. Réaliser un changement limité à un ticket.
4. Exécuter `pnpm validate`.
5. Ouvrir une pull request vers `staging`.
6. Promouvoir `staging` vers `main` seulement après validation.

## Installation

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Si le lanceur pnpm n’est pas disponible, utilisez `corepack pnpm` à la place.

## Qualité obligatoire

```sh
pnpm format
pnpm validate
```

Ne contournez pas les erreurs de lint, de types ou de build. Expliquez tout avertissement qui ne peut pas être corrigé dans le ticket.

## Règles d’architecture

- Utiliser les routes Astro sous `src/pages/`.
- Préférer Astro et HTML sémantique.
- Ajouter React seulement pour une interaction justifiée ou une migration ciblée.
- Ne pas introduire React Router.
- Ne pas connecter un CMS, un backend ou un service externe hors ticket dédié.
- Ne pas copier les plugins ou configurations Figma Make dans l’application de production.

## Contenu et photographies

- Traiter le contenu actuel comme temporaire.
- Ne jamais modifier `reference/figma-make-export/`.
- Ne jamais écraser une photographie source.
- Mettre à jour `docs/IMAGE_INVENTORY.md` lors de tout ajout ou variante.
- Confirmer les droits et autorisations avant publication.

## Dépendances

Toute nouvelle dépendance doit être nécessaire, configurée immédiatement et documentée dans `docs/DEPENDENCIES.md` avec sa version, son type, son usage, son emplacement, son alternative simple et sa justification.

## Commits

Utiliser des messages courts de style Conventional Commits, par exemple :

```text
feat: add parish schedule route
docs: clarify image publication rules
fix: restore keyboard focus in gallery
```

Ne jamais commiter de secret, `.env`, cache, `node_modules` ou `dist`.
