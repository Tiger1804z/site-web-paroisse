# Consignes pour les agents

## Projet

Fondation Astro du site Web d’une paroisse catholique francophone au Québec.

## Commandes de référence

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm validate
```

Sous Windows, utiliser `corepack pnpm` si le shim Corepack ne peut pas être activé.

## Architecture

- Astro statique et TypeScript strict.
- Routes natives dans `src/pages/`.
- React seulement pour les îlots interactifs justifiés.
- Tailwind CSS 4 via `@tailwindcss/vite`.
- Alias `@/` vers `src/`.
- HTML sémantique et accessibilité dès la création.

## Contraintes

- Ne jamais modifier l’export sous `reference/figma-make-export/`.
- Ne jamais remettre les plugins, le routeur par état ou la configuration `.figma` en production.
- Ne jamais ajouter React Router.
- Ne jamais écraser ou retoucher les photographies originales.
- Vérifier `docs/IMAGE_INVENTORY.md` avant d’utiliser une image contenant une personne.
- Ne jamais inventer de coordonnées, d’horaires ou de contenu définitif.
- Ne jamais ajouter de secret, jeton ou valeur sensible.
- Documenter chaque dépendance directe dans `docs/DEPENDENCIES.md`.

## Périmètre actuel

L’initialisation est terminée lorsque `pnpm validate` réussit. Les pages complètes, le CMS, les formulaires, le backend, l’analytique, les tests E2E et le déploiement doivent rester dans des tickets futurs.
