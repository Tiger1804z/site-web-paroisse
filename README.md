# Site Web de la Paroisse Saint-René-Goupil

Site Web de production de la Paroisse Saint-René-Goupil, une paroisse catholique francophone située au Québec.

## Statut actuel

Le dépôt contient la fondation technique, le système de design, le layout global, les pages Accueil, Horaires, Notre paroisse, Première visite, Sacrements et services, Vie paroissiale et Friperie migrées depuis Figma, ainsi que l’architecture Événements fusionnée dans S1-T07 et l’audit documentaire du site existant. Il valide Astro, TypeScript strict, React en îlots, Tailwind CSS 4, la qualité automatisée, la CI et la préservation de l’export Figma Make.

Le logo officiel approuvé est préservé et intégré au header, au menu mobile, au
footer et aux favicons. Ses variantes et restrictions sont documentées dans
[docs/BRAND_ASSETS.md](docs/BRAND_ASSETS.md).

Un système de mouvement léger est appliqué aux pages pilotes Accueil, Notre
paroisse et Sacrements. Il repose sur CSS, un observateur partagé pour les
révélations et un observateur ciblé pour la chronologie, sans listener scroll
continu ni dépendance. Le vitrail vivant est intégré une seule fois à
l’accueil. Les règles de performance et d’accessibilité sont documentées dans
[docs/MOTION_SYSTEM.md](docs/MOTION_SYSTEM.md).

Les autres pages complètes, le CMS, les formulaires connectés et le déploiement ne sont pas encore implémentés. Les horaires, dates et coordonnées visibles sur l’accueil demeurent des placeholders. Les valeurs trouvées sur le site existant sont documentées, mais ne sont pas considérées comme confirmées.

La route `/horaires/` utilise également uniquement des placeholders. Son flux
de contenu local typé et sa future connexion à Sanity sont expliqués dans
[docs/ASTRO_SANITY_SCHEDULES_PREPARATION.md](docs/ASTRO_SANITY_SCHEDULES_PREPARATION.md).

La route `/notre-paroisse/` utilise une source locale `AboutPageData`. Les
textes historiques sont réécrits prudemment et conservent leur statut de
confirmation. Le futur flux Sanity, Portable Text et les images avec hotspot
sont expliqués dans
[docs/ASTRO_SANITY_ABOUT_PREPARATION.md](docs/ASTRO_SANITY_ABOUT_PREPARATION.md).
Sa chronologie immersive présente huit illustrations artistiques explicitement
non documentaires et une photographie réelle de la plaque de consécration. Le
récit demeure entièrement disponible en HTML, y compris sans JavaScript. Son
architecture est décrite dans
[docs/IMMERSIVE_HISTORY_TIMELINE.md](docs/IMMERSIVE_HISTORY_TIMELINE.md).

La route `/premiere-visite/` utilise une source locale
`FirstVisitPageData`. Les coordonnées, le stationnement et les détails
d’accessibilité restent explicitement à confirmer. La séparation entre le futur
document `firstVisitPage` et les réglages globaux `siteSettings` est expliquée
dans
[docs/ASTRO_SANITY_FIRST_VISIT_PREPARATION.md](docs/ASTRO_SANITY_FIRST_VISIT_PREPARATION.md).

La route `/sacrements/` utilise `SacramentsPageData`. Les slugs préparent de
futures pages détaillées, mais aucun lien ni fichier `[slug].astro` n’est créé
tant que le contenu n’est pas validé. Le futur flux `sacramentsPage`,
références, documents `sacrament` et `getStaticPaths()` est documenté dans
[docs/ASTRO_SANITY_SACRAMENTS_PREPARATION.md](docs/ASTRO_SANITY_SACRAMENTS_PREPARATION.md).

La route `/vie-paroissiale/` utilise `ParishLifePageData`. Les quatre groupes
de la maquette restent identifiés comme contenus à confirmer : aucune activité,
fréquence, personne responsable ou coordonnée fictive n'est publiée. La source
locale, le getter et les composants Astro préparent un futur document
`parishLifePage` sans dépendre du CMS.

La route `/friperie/` utilise `ThriftStorePageData`, une source locale et un
getter. Son hero Astro possède une lentille progressive en JavaScript natif et
réutilise `AnimatedClothingRack`; aucun React ou package n'est ajouté. Les
quatre visuels sont des prototypes temporaires aux droits non confirmés et les
six cadres de galerie attendent de vraies photographies prises à l'église. La
page reste `noindex` tant que les images, horaires, conditions de dons et
coordonnées responsables ne sont pas validés. Voir
[docs/FIGMA_THRIFT_STORE_MAPPING.md](docs/FIGMA_THRIFT_STORE_MAPPING.md) et
[docs/THRIFT_STORE_PHOTO_SHOT_LIST.md](docs/THRIFT_STORE_PHOTO_SHOT_LIST.md).

Le même contrôleur de lentille organique est branché au hero d'accueil. Il y
révèle toujours la prochaine photographie de la boucle sans modifier le
contenu, les CTA ou le comportement statique sur tactile et reduced motion.

Feuillets paroissiaux est bloqué et différé : aucun PDF réel n'est disponible.
La route placeholder `/feuillets-paroissiaux/` reste `noindex`, mais sa
promotion est masquée du desktop, du mobile, du footer, de l'accueil et
d'Horaires depuis la source canonique de navigation. La décision sera revue
avec la secrétaire le 10 août 2026 ou après son retour.

S1-T09 Contact reste volontairement en pause sur la branche séparée
`feature/s1-t09-contact-page-1to1`, non fusionnée dans `staging`, à la porte de
validation SMTP. S1-T10 ne modifie aucun fichier Contact, SMTP, API de courriel
ou fonction serverless.

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
├── public/                  # Favicons servis à des URL stables
├── reference/
│   ├── brand/               # Original officiel du logo, inchangé
│   └── figma-make-export/   # Copie lisible et inchangée de l’export
├── src/
│   ├── assets/brand/        # Variantes de logo traitées par Astro
│   ├── assets/images/paroisse/
│   ├── components/
│   │   ├── layout/
│   │   ├── motion/
│   │   ├── sections/
│   │   └── ui/
│   ├── layouts/
│   ├── lib/
│   ├── pages/               # Routes Astro
│   ├── scripts/             # JavaScript client natif et ciblé
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

Le plan complet se trouve dans
[docs/FIGMA_MIGRATION_PLAN.md](docs/FIGMA_MIGRATION_PLAN.md). Les routes
restantes, les placeholders du menu Informations et leurs dépendances sont
inventoriés dans
[docs/REMAINING_ROUTES_AUDIT.md](docs/REMAINING_ROUTES_AUDIT.md).

S1-T07 est fusionné : les catégories et les événements datés alimentent
`/evenements/` et « Prochaines activités » depuis une source unique. La route
Événements reste `noindex` jusqu'à sa validation éditoriale finale.

S1-T10 migre Friperie en page dédiée `noindex` et reporte Feuillets sans
supprimer sa route. Le prochain travail sur Feuillets dépend de la décision et
des documents réels, pas d'une priorité visuelle de la maquette.

## Volontairement non implémenté

- migration complète des routes encore listées comme placeholders dans
  `REMAINING_ROUTES_AUDIT.md`;
- contenu définitif;
- CMS;
- formulaires backend et courriels;
- réservation de salle;
- authentification;
- analytique;
- tests Vitest et Playwright;
- déploiement et prévisualisations distantes.

Vitest et Playwright seront ajoutés seulement lorsque de vrais composants interactifs et des parcours critiques justifieront des tests automatisés.
