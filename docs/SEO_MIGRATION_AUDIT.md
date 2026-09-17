# Migration SEO du domaine officiel

Audit du 16 septembre 2026. Domaine en production communiqué par la paroisse :
`https://paroissesaintrenegoupil.com`. La redirection 301 de `www` vers le
domaine sans www est déjà configurée dans Cloudflare.

## Architecture conservée

`src/lib/seo/routes.ts` demeure la source des routes, de l’indexabilité et des
destinations canoniques. `siteUrl.ts` résout `SITE_URL`; `siteOrigin.mjs`
vérifie l’origine et contient la seule constante du domaine officiel.
Le sitemap, robots.txt, Open Graph et les graphes JSON-LD consomment toujours
ces sources. Les images Sanity et les liens externes gardent leurs domaines.

Le build public exige `SITE_URL=https://paroissesaintrenegoupil.com` et refuse
une origine absente, localhost, pages.dev, www ou tout autre domaine.
Astro injecte la valeur du processus avant celle de `.env`, pour éviter qu’une
ancienne configuration locale écrase la configuration Cloudflare ou CI.
Le développement sans configuration conserve localhost. Le Worker éditorial
conserve son origine, son robots.txt `Disallow: /` et son `noindex, nofollow`.

## Anciennes URLs et décisions

Les chemins ci-dessous sont relatifs au domaine officiel; les liens historiques
avec www passent d’abord par la règle de domaine existante.

| OLD URL                       | NEW URL               | ACTION                                                                                             |
| ----------------------------- | --------------------- | -------------------------------------------------------------------------------------------------- |
| `/événements-à-venir`         | `/evenements/`        | 301 permanent; cas confirmé dans Google par la paroisse.                                           |
| `/évènements-à-venir`         | `/evenements/`        | 301 permanent; autre orthographe relevée dans l’audit historique.                                  |
| `/accueil`                    | `/`                   | 301 permanent; ancienne entrée d’accueil, dont le contenu a été réparti.                           |
| `/pèlerinages`                | `/evenements/`        | 301 permanent; les pèlerinages sont désormais des événements datés.                                |
| `/inscription-à-la-catéchèse` | `/nos-services/`      | 301 permanent; les parcours et inscriptions sont dans Nos services.                                |
| `/soutien-à-la-communauté`    | `/friperie/`          | 301 permanent; l’accueil des personnes en précarité et le soutien ponctuel figurent dans Friperie. |
| `/merci-à-nos-annonceurs`     | `/nos-annonceurs/`    | 301 permanent; ancienne page accentuée des annonceurs.                                             |
| `/merci-a-nos-annonceurs/`    | `/nos-annonceurs/`    | Alias existant : ajout d’un 301 HTTP, conservation du repli HTML.                                  |
| `/sacrements/`                | `/nos-services/`      | Alias existant : ajout d’un 301 HTTP, conservation du repli HTML.                                  |
| `/nos-services`               | `/nos-services/`      | Chemin conservé; normalisation de barre finale native de Pages.                                    |
| `/friperie`                   | `/friperie/`          | Chemin conservé; normalisation de barre finale native de Pages.                                    |
| `/location-de-salle`          | `/location-de-salle/` | Page dédiée canonique depuis le 3 septembre; aucune redirection vers Nos services.                 |
| `/catechese/`                 | —                     | Proposition ancienne, publication non attestée : aucune redirection ajoutée.                       |
| `/pelerinages/`               | —                     | Proposition sans accent, publication non attestée : aucune redirection ajoutée.                    |
| `/annonceurs/`                | —                     | Proposition ancienne remplacée dans les plans : aucune redirection ajoutée.                        |
| `/soutien-communaute/`        | —                     | Proposition de page autonome non publiée : aucune redirection ajoutée.                             |
| `/feuillets-paroissiaux/`     | —                     | Ancienne route locale retirée le 29 juillet, sans page remplaçante : aucune redirection ajoutée.   |

Sources examinées :

- [`LEGACY_SITE_CONTENT_AUDIT.md`](./LEGACY_SITE_CONTENT_AUDIT.md) : navigation de l’ancien site Google Sites, URLs exactes relevées le 25 juillet 2026.
- [`CONTENT_MIGRATION_MATRIX.md`](./CONTENT_MIGRATION_MATRIX.md) et [`SITEMAP.md`](./SITEMAP.md) : destinations envisagées à l’époque, qui ne prouvent pas leur publication.
- [`REMAINING_ROUTES_AUDIT.md`](./REMAINING_ROUTES_AUDIT.md) : intégration des pèlerinages aux événements; les indications de pages absentes et de location en alias sont historiques.
- `src/data/services.ts`, `src/data/thriftStore.ts` et le registre actuel : présence des parcours d’initiation et du soutien communautaire, page de location rétablie.
- Navigation historique de `reference/figma-make-export/` et aliases Astro existants : aucun autre ancien chemin publié avec équivalent certain découvert.

## Redirections livrées

Le hook `astro:build:done` dans `astro.config.mjs` produit `dist/_redirects`
à partir des entrées `canonicalPath` du registre, via `legacyRedirectRules`,
uniquement pour le build statique public. Cloudflare Pages lit
ce fichier et applique les 301 avant de servir les fichiers statiques.
Les règles couvrent chaque alias avec et sans barre finale. Les sources sont
encodées pour le transport HTTP : Pages normalise aussi les URLs accentuées
vers cette forme. Publier simultanément les deux formes créerait des règles
en double. Elles restent exactes, sans joker, sans chaîne et sans
redirection globale vers l’accueil.

La route dynamique existante `src/pages/[slug].astro` produit les anciens
aliases et les nouveaux en conservant Galerie. Elle les reconnaît aussi en
SSR pour le Worker, où `getStaticPaths` est ignoré. Le composant
`src/components/LegacyRedirect.astro` réutilise le repli HTML : `noindex, nofollow`, un canonical absolu
vers la destination et la redirection HTML existante. `BaseLayout` lit cette
destination dans le registre. Un serveur Astro local peut montrer ce repli;
la réponse HTTP 301 est assurée par Pages.

La Function existante ne couvre que `/api/contact`; elle n’intercepte pas ces
routes. Le Worker de prévisualisation garde son rendu serveur et n’utilise pas
ce fichier comme mécanisme de redirection Pages.

Références : [redirections Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/redirects/)
et [normalisation des pages HTML](https://developers.cloudflare.com/pages/configuration/serving-pages/).

## Validation et déploiement

`tests/seo-migration.test.mjs` vérifie les origines, les anciennes URLs,
l’encodage et les destinations. Des sorties de build factices vérifient que
`scripts/check-built-seo.mjs` détecte les régressions de canonical, sitemap,
robots, Open Graph, JSON-LD et fichier de 301. Le contrôle lit le build réel
dans `dist/` lors de `pnpm validate`.

Résultats sur cette branche :

- `pnpm validate` : réussi, 565 tests, aucun diagnostic Astro; 25 pages produites, 13 au sitemap et 12 `noindex`.
- `pnpm build:public` et `pnpm check:seo` : réussis avec `SITE_URL` officiel fourni dans le processus.
- `pnpm validate:preview` : réussi avec l’origine du Worker; aucune page prérendue, aucun jeton dans les fichiers du navigateur.
- Wrangler Pages local : 18 règles de redirection valides, sans doublon; 30 requêtes d’aliases accentués/encodés, avec/sans barre finale, répondent en 301 avec la bonne destination. Les destinations répondent en 200 avec canonical officiel; robots.txt autorise le crawl, une route inconnue répond en 404.

Ces contrôles portent sur les artefacts de la branche; les nouvelles 301 sur
le domaine en production restent à vérifier après le déploiement.

Avant déploiement sur Pages, conserver la commande `pnpm build:public` et le
dossier `dist`. Dans les variables du projet public Cloudflare Pages,
`SITE_URL` doit valoir `https://paroissesaintrenegoupil.com`. Une ancienne valeur
pages.dev fait maintenant échouer le build au lieu de publier de mauvais
canonicals. Ne pas modifier l’origine du Worker éditorial ou l’URL du Studio.

Cette branche ne déploie pas et ne fusionne pas dans main. Après publication,
contrôler le 301 et son en-tête Location sur le domaine officiel, vérifier
robots.txt et le sitemap, puis soumettre le sitemap et demander l’inspection
des URLs migrées dans Google Search Console. L’actualisation de Google dépend
du prochain crawl.
