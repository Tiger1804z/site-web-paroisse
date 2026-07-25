# Site Web de la Paroisse Saint-René-Goupil

Site Web de production de la Paroisse Saint-René-Goupil, une paroisse catholique francophone située au Québec.

## Statut actuel

Le dépôt contient la fondation technique, le système de design, le layout global, les pages Accueil et Horaires migrées depuis Figma, ainsi que l’audit documentaire du site existant. Il valide Astro, TypeScript strict, React en îlots, Tailwind CSS 4, la qualité automatisée, la CI et la préservation de l’export Figma Make.

Les autres pages complètes, le CMS, les formulaires connectés et le déploiement ne sont pas encore implémentés. Les horaires, dates et coordonnées visibles sur l’accueil demeurent des placeholders. Les valeurs trouvées sur le site existant sont documentées, mais ne sont pas considérées comme confirmées.

La route `/horaires/` utilise également uniquement des placeholders. Son flux
de contenu local typé et sa future connexion à Sanity sont expliqués dans
[docs/ASTRO_SANITY_SCHEDULES_PREPARATION.md](docs/ASTRO_SANITY_SCHEDULES_PREPARATION.md).

## Stack

- Astro 7 en génération statique;
- TypeScript strict;
- React 19 uniquement pour les composants qui nécessitent une hydratation ou facilitent une migration;
- Tailwind CSS 4 par le plugin Vite officiel;
- pnpm 11 géré par Corepack;
- ESLint et Prettier;
- GitHub Actions pour la validation continue.

Les versions résolues et leur justification sont détaillées dans [docs/DEPENDENCIES.md](docs/DEPENDENCIES.md).

## Prérequis

- Node.js `22.19.0` (voir `.nvmrc`), ou une version compatible avec `engines`;
- Corepack `0.34.0` ou plus récent;
- pnpm `11.17.0`, déclaré dans `packageManager`;
- Git.

Activer pnpm avec Corepack :

```sh
corepack install --global pnpm@11.17.0
corepack enable pnpm
```

Si `corepack enable` ne peut pas écrire dans l’installation système de Node sous Windows, toutes les commandes peuvent être préfixées par `corepack`, par exemple `corepack pnpm install`.

## Installation

```sh
pnpm install --frozen-lockfile
```

Le fichier `pnpm-workspace.yaml` autorise uniquement le script d’installation d’`esbuild`. `sharp` utilise ici son binaire précompilé résolu pour Windows; aucun script d’installation supplémentaire n’a dû être autorisé.

## Démarrage local

```sh
pnpm dev
```

Astro affiche l’adresse locale, normalement `http://localhost:4321`.

## Commandes

| Commande            | Rôle                                                  |
| ------------------- | ----------------------------------------------------- |
| `pnpm dev`          | Démarre le serveur de développement.                  |
| `pnpm build`        | Génère le site statique dans `dist/`.                 |
| `pnpm preview`      | Sert localement le dernier build.                     |
| `pnpm check`        | Vérifie les composants Astro et les types TypeScript. |
| `pnpm lint`         | Exécute ESLint sans accepter d’avertissement.         |
| `pnpm format`       | Formate les fichiers pris en charge par Prettier.     |
| `pnpm format:check` | Vérifie le format sans modifier les fichiers.         |
| `pnpm validate`     | Enchaîne format, lint, check et build.                |

## Structure

```text
.
├── .github/workflows/       # Intégration continue
├── docs/                    # Architecture, audit et plans
├── public/                  # Actifs servis tels quels, vide pour l’instant
├── reference/
│   └── figma-make-export/   # Copie lisible et inchangée de l’export
├── src/
│   ├── assets/images/paroisse/
│   ├── components/
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── layouts/
│   ├── lib/
│   ├── pages/               # Routes Astro
│   ├── styles/
│   └── types/
└── package.json
```

## Stratégie Git

- `main` : branche stable destinée à la production;
- `staging` : branche d’intégration avant promotion;
- `feature/*` : branches de développement créées depuis `staging`.

Une fonctionnalité doit être validée localement avec `pnpm validate` avant d’être proposée sur `staging`.

## Origine Figma

Le prototype vient de `Maquettes site Web paroisse.zip`, généré par Figma Make. Le ZIP original reste hors du dépôt et n’est jamais modifié. Sa copie extraite est conservée sous `reference/figma-make-export/` comme référence visuelle, textuelle et interactive.

Le prototype React/Vite n’est pas l’application de production. Son audit se trouve dans [docs/FIGMA_EXPORT_AUDIT.md](docs/FIGMA_EXPORT_AUDIT.md) et le plan de migration dans [docs/FIGMA_MIGRATION_PLAN.md](docs/FIGMA_MIGRATION_PLAN.md).

## Contenu et sitemap

L’ancien site paroissial a été audité sans copier ses pages ni télécharger ses
médias. Les documents de référence sont :

- [audit du site existant](docs/LEGACY_SITE_CONTENT_AUDIT.md);
- [inventaire du contenu](docs/CONTENT_INVENTORY.md);
- [sitemap proposé](docs/SITEMAP.md);
- [matrice de migration](docs/CONTENT_MIGRATION_MATRIX.md);
- [questions de confirmation](docs/PARISH_CONTENT_CONFIRMATION.md).

Le sitemap reste une proposition. Le header, le footer et
`src/lib/navigation.ts` ne doivent pas être modifiés avant sa validation. Les
horaires, tarifs, capacités, personnes, événements, inscriptions, annonceurs et
coordonnées doivent être confirmés par la paroisse avant publication.

## Photographies

- Les fichiers source ne doivent pas être retouchés, recompressés ou remplacés sans ticket explicite.
- Les noms de production sont descriptifs, en minuscules et en kebab-case.
- Les droits du photographe et les autorisations de publication doivent être confirmés avant mise en ligne.
- L’image contenant une personne ne doit pas être publiée avant confirmation explicite de l’autorisation.
- Tout ajout doit mettre à jour [docs/IMAGE_INVENTORY.md](docs/IMAGE_INVENTORY.md).

## Variables d’environnement

Aucune variable d’environnement n’est requise à ce stade. Ne créez pas de secret fictif et ne commitez jamais de fichier `.env`. Si une variable devient nécessaire, documentez uniquement son nom et son rôle dans un futur `.env.example`, sans valeur sensible.

## Validation

La commande de référence est :

```sh
pnpm validate
```

La CI l’exécute sur les pushes et pull requests visant `main` ou `staging`.

## Prochaines étapes

Le plan complet est documenté sans être exécuté dans [docs/FIGMA_MIGRATION_PLAN.md](docs/FIGMA_MIGRATION_PLAN.md). Le prochain ticket recommandé est :

`S1-T03 — Migrer la page Horaires 1:1 depuis l’export Figma`

## Volontairement non implémenté

- migration complète des pages autres que l’accueil;
- contenu définitif;
- CMS;
- formulaires backend et courriels;
- réservation de salle;
- authentification;
- analytique;
- tests Vitest et Playwright;
- déploiement et prévisualisations distantes.

Vitest et Playwright seront ajoutés seulement lorsque de vrais composants interactifs et des parcours critiques justifieront des tests automatisés.
