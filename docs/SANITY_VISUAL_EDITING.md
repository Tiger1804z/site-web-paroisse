# Prévisualisation éditoriale — Presentation et Visual Editing

Ce document décrit comment la paroisse voit ses modifications avant publication,
et pourquoi le site public n'en porte aucune trace.

## Le principe en une phrase

Le site public est un tas de fichiers HTML statiques qui ne connaissent que le
contenu publié; la prévisualisation est un **second environnement**, activé par
une variable, qui rend les mêmes pages à la demande, lit les brouillons et
laisse cliquer sur un texte pour ouvrir le champ qui le produit.

## Deux modes, un seul code

|                        | Site public           | Prévisualisation                        |
| ---------------------- | --------------------- | --------------------------------------- |
| `output` Astro         | `static`              | `server`                                |
| Adaptateur             | aucun                 | `@astrojs/cloudflare`                   |
| Rendu                  | prérendu au build     | à la demande, à chaque requête          |
| Hébergement            | Cloudflare **Pages**  | Cloudflare **Workers**                  |
| Commande               | `pnpm build:public`   | `pnpm build:preview`                    |
| Perspective Sanity     | `published`           | `drafts` si un jeton est fourni         |
| Jeton                  | aucun                 | jeton Viewer, paquet serveur uniquement |
| Content Source Maps    | non demandées         | `withKeyArraySelector`                  |
| stega                  | désactivé             | activé                                  |
| Overlays               | absents du bundle     | chargés                                 |
| Indexation             | normale               | `noindex, nofollow` + `Disallow: /`     |
| Appels Sanity au build | un par page prérendue | **aucun**                               |

### Pourquoi la prévisualisation ne peut pas être statique

C'est la question qui décide de toute l'architecture, et elle n'a qu'une
réponse.

Presentation fonctionne en boucle : la secrétaire tape dans le Studio, Sanity
émet une mutation, l'overlay dans l'iframe demande à la page de se rafraîchir.
Si la page est un fichier HTML figé, le rafraîchissement recharge **le même
fichier**. Le brouillon affiché resterait celui du dernier build.

Un environnement de prévisualisation doit donc relire Sanity à chaque requête,
ce qui exige un rendu serveur. Le jeton n'est pas ce qui tranche — un build
statique pourrait très bien lire les brouillons au moment du build. Ce qui
tranche, c'est qu'un brouillon bouge et qu'un fichier non.

Conséquence heureuse : comme rien n'est prérendu, `pnpm build:preview`
**n'adresse aucune requête à Sanity**. Le build ne peut pas échouer à cause du
contenu, et un jeton factice suffit à le construire.

### Ce que fait chaque acteur

- **Astro** décide, au build, s'il produit des fichiers (`output: 'static'`) ou
  un programme (`output: 'server'`). Les mêmes pages `.astro` servent aux deux.
- **L'adaptateur Cloudflare** traduit ce programme en Worker : `dist/server/`
  contient le code, `dist/client/` les fichiers servis tels quels.
- **Sanity** ne sait rien de tout cela. Presentation affiche l'adresse qu'on lui
  donne dans une iframe et écoute les messages qui en reviennent. Le Studio ne
  détient aucun jeton : c'est le site prévisualisé qui décide de lire les
  brouillons, avec son propre secret serveur.
- **Cloudflare** exécute le Worker à la requête, et sert `dist/client/` sans
  l'exécuter.

## Comment la topologie est choisie

Une seule variable, `PREVIEW_DEPLOYMENT`, lue dans `astro.config.mjs` :

```js
const previewDeployment = process.env.PREVIEW_DEPLOYMENT === 'true';

output: previewDeployment ? 'server' : 'static',
...(previewDeployment ? { adapter: cloudflare({ imageService: 'compile' }) } : {}),
```

Elle est lue sur `process.env`, **jamais** dans `.env` : un fichier local décrit
une session de travail, pas la forme du site produit.

`src/lib/sanity/preview.ts` a besoin de la même information. Il ne la relit pas
— la config la lui **injecte** :

```js
define: {
  'import.meta.env.PREVIEW_DEPLOYMENT': JSON.stringify(previewDeployment ? 'true' : 'false'),
},
```

### Le piège de priorité des variables d'environnement

Mesuré sur ce dépôt le 18 août 2026, et contre-intuitif :

| Type de variable   | Qui gagne                        |
| ------------------ | -------------------------------- |
| préfixée `PUBLIC_` | l'environnement du **processus** |
| non préfixée       | le fichier **`.env`**            |

C'est ce qui permet à `scripts/build-public.mjs` de forcer
`PUBLIC_SANITY_VISUAL_EDITING_ENABLED=false` sans toucher `.env`. Et c'est aussi
pourquoi `PREVIEW_DEPLOYMENT` ne doit **jamais** être écrit dans `.env` : sans
l'injection ci-dessus, `preview.ts` croirait à une topologie que le build ne
suit pas, et le verrou qui interdit de figer des brouillons dans du HTML public
serait levé en silence.

Sur Cloudflare la question ne se pose pas : il n'y a pas de `.env`, les
variables du tableau de bord sont les seules.

## Les deux verrous de `preview.ts`

```js
// Un build PRÉRENDU de production ne peut pas activer la prévisualisation.
if (visualEditingEnabled && import.meta.env.PROD && !previewDeployment) throw …

// Un build de prévisualisation SANS overlays est une panne muette.
if (previewDeployment && !visualEditingEnabled) throw …
```

Le second mérite un mot : sans lui, un déploiement de prévisualisation mal
configuré produirait un site parfaitement fonctionnel, servi à la bonne adresse,
mais sans overlays ni brouillons. Presentation afficherait la page et répéterait
« Unable to connect » sans que rien n'ait l'air cassé. Les deux drapeaux sont
posés ensemble par un seul script, précisément pour que ce cas n'arrive pas.

## Trois barrières contre l'indexation

Un environnement de prévisualisation sert des brouillons sur une adresse
publique. Rien de ce qu'il montre ne doit être trouvable.

1. **`<meta name="robots" content="noindex, nofollow">`** sur chaque page —
   `documentHead.ts` ferme toute page quand `previewing` est vrai, même celles
   que le registre déclare indexables.
2. **`robots.txt` répond `User-agent: * / Disallow: /`** — `src/pages/robots.txt.ts`.
3. **En-tête HTTP `X-Robots-Tag: noindex, nofollow`** sur _toutes_ les réponses —
   `src/middleware.ts`. C'est la seule des trois qui couvre ce qui n'est pas du
   HTML : `sitemap.xml` n'a pas de `<head>` où écrire une balise.

Dans le site public, la condition du middleware est remplacée par `false` au
build et la branche disparaît.

## Variables d'environnement

Voir `.env.example`. Résumé :

| Variable                               | Rôle                                           | Public ? |
| -------------------------------------- | ---------------------------------------------- | -------- |
| `PUBLIC_SANITY_PROJECT_ID`             | projet Sanity                                  | oui      |
| `PUBLIC_SANITY_DATASET`                | jeu de données                                 | oui      |
| `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` | active la prévisualisation                     | oui      |
| `PUBLIC_SANITY_STUDIO_URL`             | adresse du Studio, pour les liens « modifier » | oui      |
| `SANITY_API_READ_TOKEN`                | lecture des brouillons                         | **non**  |
| `PREVIEW_DEPLOYMENT`                   | topologie du build : statique ou serveur       | **non**  |

Le préfixe `PUBLIC_` n'est pas une convention de nommage : c'est **le mécanisme**
par lequel Astro décide ce qu'il inclut dans le JavaScript envoyé au navigateur.
Un jeton nommé `PUBLIC_...` serait publié. Un test le vérifie
(`tests/sanity-visual-editing.test.mjs`).

`PREVIEW_DEPLOYMENT` ne se saisit nulle part à la main : les scripts de build
la posent, et `astro.config.mjs` injecte sa valeur dans le code. Voir « Le piège
de priorité des variables d’environnement » plus haut.

## Déploiement

**Les trois ressources sont en ligne depuis le 18 août 2026.**

Le site public et le Studio sont sur **Cloudflare Pages**. La prévisualisation
est sur **Cloudflare Workers**, et ce n'est pas un choix : depuis la version 12,
`@astrojs/cloudflare` ne prend plus Pages en charge. Il n'existe aucun
adaptateur Pages compatible avec Astro 7.

Trois ressources Cloudflare, indépendantes :

| Ressource        | Produit | Adresse                                                      | Branche de production |
| ---------------- | ------- | ------------------------------------------------------------ | --------------------- |
| public           | Pages   | `https://paroisse-saint-rene-goupil.pages.dev`               | `main`                |
| Studio           | Pages   | `https://site-web-paroisse.pages.dev`                        | `main`                |
| prévisualisation | Workers | `https://paroisse-preview.sebastieneugene123600.workers.dev` | `staging`             |

### Le Worker de prévisualisation

**Il existe et il tourne.** Créé le 18 août 2026 depuis le tableau de bord
Cloudflare → **Workers & Pages** → **Create** → **Workers** → **Import a
repository** (Workers Builds). Ce qui suit est sa configuration telle qu'elle
est : à relire pour comprendre, ou à resaisir pour le reconstruire.

| Réglage           | Valeur                                                                        |
| ----------------- | ----------------------------------------------------------------------------- |
| Repository        | `Tiger1804z/site-web-paroisse`                                                |
| Worker name       | `paroisse-preview`                                                            |
| Production branch | `staging`                                                                     |
| Root directory    | `/` (racine du dépôt)                                                         |
| Build command     | `pnpm install --frozen-lockfile && pnpm sanity:typegen && pnpm build:preview` |
| Deploy command    | `pnpm exec wrangler deploy`                                                   |
| Node version      | `22.19.0` (variable `NODE_VERSION`)                                           |

Le nom du Worker vient de `wrangler.jsonc`, à la racine du dépôt. Sans ce
fichier il serait déduit du `name` de `package.json` — `site-web-paroisse`,
c'est-à-dire le nom que porte déjà le projet Pages du Studio.

**Il n'y a pas de « Build output directory » à saisir.** L'adaptateur écrit
lui-même `dist/server/wrangler.json` (point d'entrée, dossier d'assets), et
`.wrangler/deploy/config.json` y renvoie Wrangler. C'est ce qui rend la commande
de déploiement aussi courte.

#### Branche suivie, et comment relancer un déploiement

La branche de production du Worker est **`staging`**, et les builds des branches
non-production sont **désactivés**. La prévisualisation suit donc la branche
d'intégration, pas chaque branche de travail : elle montre ce qui est sur le
point de partir en production, ce qui est exactement son rôle.

Pour la redéployer sans pousser de commit, un **Deploy Hook Workers** existe :

```text
nom      staging-preview
branche  staging
appel    POST sur son URL  →  {"success": true, "status": "queued"}
```

**L'URL de ce hook est un secret.** Quiconque la connaît peut déclencher des
déploiements : elle ne s'écrit ni ici, ni dans un ticket, ni dans une capture
d'écran. Une première URL a été exposée par accident pendant la mise en place;
le hook a été supprimé et recréé, donc l'ancienne ne vaut plus rien. C'est la
bonne réaction, et la seule — une URL de hook ne se « reprend » pas, elle se
remplace.

### Variables — et pourquoi chacune est là où elle est

Le préfixe `PUBLIC_` n'est pas une convention de nommage : c'est **le
mécanisme** par lequel Astro décide ce qui part dans le JavaScript du
navigateur. Une variable ainsi nommée est publiée, point.

#### Variables publiques (type « Plaintext »)

| Variable                   | Valeur                                                       | Pourquoi elle peut être publique                                                             |
| -------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------------------------------------- |
| `PUBLIC_SANITY_PROJECT_ID` | `xo2ahvjo`                                                   | Identifiant de projet, visible dans toute URL d'image Sanity.                                |
| `PUBLIC_SANITY_DATASET`    | `production`                                                 | Nom d'un jeu de données, sans pouvoir d'accès.                                               |
| `PUBLIC_SANITY_STUDIO_URL` | `https://site-web-paroisse.pages.dev`                        | Adresse du Studio, nécessaire au navigateur pour construire les liens « modifier ce champ ». |
| `SITE_URL`                 | `https://paroisse-preview.sebastieneugene123600.workers.dev` | Adresse publique du site prévisualisé; sans elle le build échoue volontairement.             |
| `NODE_VERSION`             | `22.19.0`                                                    | Réglage de la plateforme de build.                                                           |

`PUBLIC_SANITY_VISUAL_EDITING_ENABLED` et `PREVIEW_DEPLOYMENT` ne se saisissent
**pas** : `pnpm build:preview` les pose lui-même, ensemble. Une seule commande à
retenir, et deux drapeaux qui ne peuvent pas se désynchroniser.

#### Secret serveur (type « Secret »)

| Variable                | Pourquoi c'est un secret                                                                                                                                                                                                                                                                                 |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SANITY_API_READ_TOKEN` | Il donne accès aux brouillons non publiés. Sans préfixe `PUBLIC_`, Astro ne l'écrit jamais dans un fichier servi au navigateur — il n'existe que dans `dist/server/`, c'est-à-dire dans le code du Worker, que Cloudflare exécute mais ne sert pas. `pnpm check:preview` le vérifie fichier par fichier. |

Le jeton est **inliné dans le paquet serveur au moment du build**. Il doit donc
être disponible pendant le build, pas seulement à l'exécution — c'est le cas des
variables Cloudflare. Changer le jeton exige un redéploiement.

### Quand le webhook manque une publication

**Observé le 2026-09-04.** Le document `advertisersPage` a été publié à
02:35 UTC; vingt minutes plus tard, la production servait encore l'ancien
texte. Ce n'était pas du cache — les pages sont servies en
`Cache-Control: public, max-age=0, must-revalidate`, et une requête sans cache
renvoyait la même chose. Aucun déploiement n'avait démarré. D'autres
publications faites dans la même demi-heure, elles, avaient bien reconstruit.

Le webhook n'est donc pas fiable à 100 %, et il faut le savoir avant de conclure
qu'une correction de contenu « n'a pas marché ». Vérifier dans l'ordre :

1. le document est-il vraiment publié (et non resté en brouillon)?
2. la page produite contient-elle le texte? Si oui, c'est un cache de
   navigateur, pas le site.
3. sinon, un déploiement a-t-il démarré sur le projet Pages public?

Faute de déploiement, un commit poussé sur `main` en relance un. Le tableau de
bord Cloudflare offre aussi « Retry deployment » sur le dernier build, qui
reconstruit à partir du contenu Sanity du moment.

### Le site public n'est pas touché

Rien de ce qui précède ne concerne le projet Pages existant. Sa commande de
build reste `pnpm build:public`, qui force les deux drapeaux à `false` et vide
`dist/` avant de construire. Le webhook Sanity → Pages qui reconstruit le site
après publication continue de fonctionner : il ne connaît que ce projet-là.

## CORS Sanity — trois origines, trois raisons

Presentation affiche le site dans une iframe, et du code y tourne dans le
navigateur pour parler à Sanity. Chaque origine qui interroge Sanity **depuis le
navigateur** doit être déclarée, sinon Presentation reste bloqué sur « Unable to
connect » alors que la page s'affiche normalement.

L'origine de la prévisualisation **est déjà déclarée**, sans identifiants,
depuis le 18 août 2026. La commande sert à en ajouter une autre — un port local
inhabituel, un futur environnement :

```bash
pnpm --dir studio exec sanity cors add https://paroisse-preview.sebastieneugene123600.workers.dev --no-credentials
pnpm --dir studio exec sanity cors list
```

| Origine déclarée                                                                | Allow credentials | Pourquoi                                                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `https://site-web-paroisse.pages.dev` — Studio (_managed origin_)               | **ON**            | Le Studio agit **au nom de la personne connectée** : il lit et écrit avec le cookie de session Sanity. Sans identifiants, personne ne peut éditer.                                                                                                                      |
| `http://localhost:3333` — Studio local                                          | **ON**            | Même rôle, sur la machine de développement.                                                                                                                                                                                                                             |
| `https://paroisse-preview.sebastieneugene123600.workers.dev` — prévisualisation | **OFF**           | Le site prévisualisé lit Sanity **depuis son serveur**, avec son propre jeton. Le navigateur n’a besoin d’aucune session. Autoriser les identifiants donnerait à cette origine le pouvoir d’agir au nom de l’éditrice connectée — un pouvoir dont elle n’a aucun usage. |
| `http://localhost:4321` — site local                                            | **OFF**           | Même raisonnement, en développement.                                                                                                                                                                                                                                    |
| `https://paroisse-saint-rene-goupil.pages.dev` — site public                    | **OFF**           | Le site public ne parle jamais à Sanity depuis le navigateur : tout est déjà dans le HTML. L’entrée existe, ne lui sert à rien, et sans identifiants n’accorde rien. La retirer serait aussi correct que la garder.                                                     |

La règle générale : **« Allow credentials » ne s'active que pour une origine qui
doit agir au nom de l'utilisateur connecté.** Partout ailleurs, c'est du pouvoir
donné sans besoin.

## Le jeton de lecture — exploitation et renouvellement

**Il est en place**, en **Secret** Cloudflare sur le Worker, sous le nom
`SANITY_API_READ_TOKEN`. Côté Sanity il s'appelle `astro-preview-viewer`.

Il a déjà été renouvelé une fois : la valeur d'origine avait été perdue, un
nouveau jeton Viewer l'a remplacée, et l'ancien a été révoqué. Aucun identifiant
inutilisé ne reste actif — c'est la moitié du travail qu'on oublie le plus
souvent. La marche à suivre, pour la prochaine fois :

1. Ouvrir <https://www.sanity.io/manage/project/xo2ahvjo>.
2. Onglet **API** → **Tokens** → **Add API token**.
3. Nom : `astro-preview-viewer`.
4. Permissions : **Viewer**, et rien d'autre. Ce jeton doit pouvoir lire, jamais
   écrire : s'il fuit, personne ne peut modifier ni supprimer du contenu.
5. Copier la valeur **une seule fois**, la coller dans la variable
   `SANITY_API_READ_TOKEN` du Worker (type **Secret**), et dans le `.env` local
   si on veut prévisualiser sur sa machine. Jamais dans le dépôt.
6. Redéployer le Worker. Le jeton est inliné dans le paquet serveur au moment du
   build : il n'est pas relu à chaud, et un secret changé sans redéploiement ne
   change rien.
7. **Révoquer l'ancien jeton** dans la même page. Un identifiant oublié survit
   toujours à la raison qui l'avait fait créer.

Sans jeton, la prévisualisation fonctionne quand même : elle affiche le contenu
**publié** avec les overlays, et journalise un avertissement. Seuls les
brouillons manquent.

## Le Studio et l'adresse de la prévisualisation

**C'est configuré.** Le Studio lit l'adresse à afficher dans son iframe :

```ts
// studio/presentation.ts
export const previewUrl =
  process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:4321';
```

Dans le projet **Pages du Studio**, la variable est posée :

```text
SANITY_STUDIO_PREVIEW_URL=https://paroisse-preview.sebastieneugene123600.workers.dev
```

Le Studio a été redéployé après cet ajout, et son journal de build l'a
confirmé :

```text
Including the following environment variables as part of the JavaScript bundle:
- SANITY_STUDIO_PREVIEW_URL
```

Cette ligne est la vérification qui compte : sans elle, la variable n'a pas
atteint le navigateur, et Presentation retomberait sur `http://localhost:4321`
sans rien dire. Le préfixe `SANITY_STUDIO_` est la convention Sanity pour ce qui
doit atteindre le navigateur — c'est une adresse, pas un secret.

Changer l'adresse de la prévisualisation se fait donc ici, et nulle part dans le
code.

## Commandes

```bash
# Développement, deux terminaux
pnpm --dir studio dev   # Studio sur http://localhost:3333
pnpm dev                # site sur http://localhost:4321 (mode dicté par .env)

# Builds
pnpm build:public       # statique, drapeaux forcés à false, dist/ vidé
pnpm build:preview      # serveur + adaptateur Cloudflare, drapeaux à true

# Contrôles sur la sortie produite
pnpm check:seo          # référencement, sur dist/ public
pnpm check:public       # sécurité, sur dist/ public
pnpm check:preview      # sécurité, sur dist/ de prévisualisation

# Portes complètes
pnpm validate           # tout le reste + build:public + check:seo + check:public
pnpm validate:preview   # build:preview + check:preview

# Essayer le Worker localement, sur le vrai moteur Cloudflare
pnpm build:preview && pnpm exec wrangler dev --port 8788
```

## Tests, et ce que chacun peut prouver

Deux niveaux, et il faut les deux. Le code peut être correct et le build
produire autre chose — c'est exactement ce qui s'est passé pendant ce ticket :
un enchaînement `build:preview` puis `build:public` laissait l'île de Visual
Editing dans la sortie publique, parce qu'`astro build` ne retire pas ce qu'il
ne produit pas. Aucun test de source ne pouvait le voir. Les deux scripts de
build vident donc `dist/` avant de construire.

### Gardes de source — `tests/sanity-visual-editing.test.mjs`

Elles lisent le code et vérifient qu'il est écrit de la bonne façon : la
topologie se lit sur `process.env`, elle est injectée et non redécouverte,
l'adaptateur n'est ajouté que sous condition, les deux drapeaux voyagent
ensemble, les deux verrous existent, le middleware pose l'en-tête, le Worker
porte un nom distinct, `wrangler.jsonc` ne contient aucun secret, l'adresse de
prévisualisation du Studio vient de l'environnement.

### Contrôles sur la sortie — `scripts/check-*-bundle.mjs`

`check-public-bundle.mjs` répond, sur `dist/` :

- la sortie est-elle purement statique (ni `_worker.js`, ni `server/`)?
- contient-elle l'île de Visual Editing?
- contient-elle des marqueurs stega?
- contient-elle une chaîne à la forme d'un jeton, ou la valeur exacte du jeton
  visible du build?
- `robots.txt` ouvre-t-il, et annonce-t-il le plan de site?
- toutes les pages sont-elles en `noindex` (ce qui trahirait une sortie de
  prévisualisation)?

`check-preview-bundle.mjs` prouve la propriété la plus intéressante, parce
qu'elle est double :

- le jeton DOIT être dans `dist/server/` — sinon le Worker ne lira aucun
  brouillon;
- le jeton NE DOIT PAS être dans un seul octet de `dist/client/`.

Il vérifie aussi qu'aucune page n'est prérendue, que l'île est complète (le
composant et le morceau de code qu'il charge), et que le paquet serveur sait
écrire `noindex, nofollow`, poser `X-Robots-Tag` et demander
`withKeyArraySelector`.

Sans jeton dans l'environnement, ce contrôle échoue au lieu de passer. Une
vérification incapable de détecter la panne qu'elle surveille est pire
qu'absente : elle rassure. La CI lui fournit un jeton factice — le build de
prévisualisation n'interroge jamais Sanity, donc un traceur suffit.

### La fausse alerte qui a servi de leçon

Le premier détecteur de stega cherchait le plan Unicode « Tags »
(U+E0000–U+E007F), la façon dont on décrit habituellement la technique. Mesuré
sur la sortie réelle de `@vercel/stega` : cet alphabet n'y figure pas. Le vrai
encodage combine U+200B, U+200C, U+200D et U+FEFF.

Le contrôle passait donc au vert sur du HTML truffé de marqueurs — et, pendant
un moment, a fait croire que la prévisualisation n'encodait rien alors qu'elle
produisait 118 séquences par page.

`scripts/stega-pattern.mjs` porte maintenant le détecteur, et un test l'oblige à
reconnaître une chaîne encodée par la bibliothèque elle-même. Si l'alphabet
change, c'est le test qui casse — pas la sortie publiée qui fuit en silence.

## Ce qui est cliquable, et ce qui ne l'est pas

**Cliquable** — tout texte venant d'un document Sanity : `thriftStorePage`,
`thriftStore`, `eventsPage`, `homePage`, `schedulePage`, `siteSettings`,
`massSchedule`, `parishEvent`, ainsi que les images Sanity des événements.

**Visible mais non cliquable :**

- les images de hero et les cadres de galerie, qui restent des fichiers du
  projet — leur migration est un ticket à part, groupé pour toutes les pages;
- le SEO (titre, description), qui n'est pas saisissable dans le Studio;
- tout texte affiché par un **repli local** parce que le champ Sanity est vide.
  C'est le piège le plus déroutant : l'éditrice voit un texte, clique, et rien
  ne s'ouvre. La cause est toujours la même — le champ n'a jamais été rempli.

**Ouvre le document, mais pas le champ exact** — les valeurs que le code
fabrique : libellés d'horaires reconstruits à partir du jour et de l'heure,
dates d'événements formatées, adresses de boutons, URL d'images. Ce ne sont plus
les chaînes de Sanity, donc elles ne portent plus leur origine. C'est une limite
de la technique, pas un défaut de configuration.

## Pourquoi stega ne casse pas les attributs

stega glisse des caractères invisibles dans les chaînes. Dans un paragraphe,
c'est sans effet. Dans un attribut, ce serait grave : une adresse `tel:`
cesserait d'être valide, un texte alternatif deviendrait du bruit pour un
lecteur d'écran. `preview.ts` écarte donc explicitement `alt`, `imageAlt`,
`phone` et `publicEmail`, en plus du filtre par défaut du client. Vérifié sur le
HTML servi : zéro attribut pollué.

## Détails d'implémentation qui surprennent

- **stega s'active par requête, pas par client.** Pas besoin de
  `@sanity/client/stega` (dont `createClient` est déprécié) : `loadQuery` dérive
  le client de l'intégration avec `withConfig()` pour la version d'API et le
  jeton, puis passe `stega` et `resultSourceMap` en options de `fetch`.
- **La perspective `drafts` exige l'API `2025-02-19` ou plus récente.**
  L'intégration Astro utilise `v2023-08-24` par défaut; le client de
  prévisualisation déclare sa propre version.
- **Un import statique du composant d'overlays pollue le build public.** Même
  rendu conditionnellement, il émettait 678 kB dans `dist/`. `BaseLayout.astro`
  l'importe dynamiquement derrière un test d'environnement littéral, ce qui
  laisse Vite éliminer la branche morte.
- **`styled-components` est une dépendance de pair obligatoire** de
  `@sanity/visual-editing` (les overlays utilisent `@sanity/ui`). Elle est
  installée à la racine, pas seulement dans `studio/`.
- **`react-compiler-runtime`, `react-is` et `lodash` sont installés à la racine
  sans être importés par notre code.** `@sanity/astro` les déclare dans
  `optimizeDeps.include`, mais pnpm les isole sous `@sanity/ui` : Vite ne peut
  pas les résoudre depuis la racine, ne les pré-empaquette pas, et l'interop
  CommonJS → ESM échoue à l'exécution des overlays. Les versions installées
  suivent celles déjà présentes dans l'arbre (`react-compiler-runtime@1.0.0`,
  `react-is@19.2.8`, `lodash@4.18.1`). **Ne pas les retirer** en croyant à des
  dépendances inutilisées.

## Faire marcher les overlays a demandé quatre correctifs distincts

Ils se sont révélés l'un après l'autre : chaque correction découvrait la
suivante, parce que seule l'exécution dans le navigateur expose ces défauts.
Dans l'ordre où ils sont apparus :

1. **`styled-components` absente de la racine** — dépendance de pair non
   optionnelle de `@sanity/visual-editing`.
2. **Alias cassés sur Windows** dans `@sanity/astro` (section suivante).
3. **`react-compiler-runtime`, `react-is`, `lodash` non résolvables depuis la
   racine** — pnpm les isole sous `@sanity/ui`, alors que l'intégration les
   déclare dans `optimizeDeps.include`.
4. **Modules CommonJS servis bruts** — `lodash/isObject.js`, `groupBy`, `keyBy`,
   `partition`, `sortedIndex`, plus `@sanity/eventsource` via `@sanity/client`.
   Ils répondent `200` mais n'exposent aucun export ESM : toute importation
   `default` échoue à l'exécution. D'où la liste `optimizeDeps.include` dans
   `astro.config.mjs`, dressée en relevant les imports réels de l'arbre installé.

Le piège de diagnostic : une vérification par requêtes HTTP ne voit **pas** le
quatrième cas. Un module CommonJS servi brut est un succès réseau et un échec
d'exécution. Pour vérifier, il faut inspecter le corps servi — un module sans
aucune ligne `export` mais avec `module.exports` cassera l'île.

## Le bogue Windows de `@sanity/astro` 3.5.0

Symptôme : Presentation reste sur « Unable to connect », et la console du
navigateur montre

```
[astro-island] error hydrating .../visual-editing-component.tsx
SyntaxError: The requested module '.../styled-components/package.json?import'
does not provide an export named 'ThemeProvider'
```

Cause : l'intégration déduit le dossier de `styled-components` en faisant

```js
require
  .resolve('styled-components/package.json')
  .replace(/\/package\.json$/, '');
```

Sur Windows, `require.resolve` renvoie un chemin à **antislashs**. La regex, qui
attend une barre oblique, ne correspond jamais : le suffixe n'est pas retiré et
l'alias pointe sur le fichier `package.json`, que Vite sert comme module.

Contournement dans `astro.config.mjs` : un greffon Vite intercepte l'identifiant
produit par l'alias cassé et le renvoie vers `dist/styled-components.esm.js`. On
ne remplace pas l'alias — il est appliqué avant tout greffon utilisateur, on
rattrape donc son résultat au moment de la résolution.

**À retirer** dès que l'intégration normalise ses chemins. Le test consiste à
supprimer le greffon, vider `node_modules/.vite`, relancer `astro dev` et
vérifier que `curl http://localhost:4321/@id/styled-components` renvoie bien le
module (≈ 225 kB, exporte `ThemeProvider`) et non le `package.json`.

L'avertissement `Cannot optimize dependency: styled-components` subsiste : le
scanner de l'optimiseur emprunte lui aussi l'alias cassé. Sans conséquence — le
module est alors servi en source, et les greffons le résolvent correctement.

### `504 (Outdated Optimize Dep)` — et la règle du premier chargement

Ce message n'est **pas** un défaut de configuration, et il explique la panne la
plus déroutante de ce ticket.

Mesuré sur le graphe de modules servi, après un démarrage à froid :

```
1er chargement : 2 modules en 504 (react-dom, styled-components)
2e chargement  : 901 modules, 0 problème
```

Vite pré-empaquette ces dépendances **à la découverte**, ce qui change
l'empreinte d'optimisation. Sur un site normal il force alors un rechargement
complet; dans l'iframe de Presentation, ce signal ne passe pas. L'île de Visual
Editing meurt donc au premier chargement, et Presentation affiche « Unable to
connect » sans autre explication.

**La règle :** après avoir démarré `pnpm dev`, ouvrir une fois
`http://localhost:4321/` dans un onglet normal, puis ouvrir Presentation. Ou,
plus simplement, recharger Presentation avec `Ctrl+Shift+R` la première fois.

## Messages de console qui ne sont pas des pannes

Une fois les overlays connectés, il reste du bruit attendu :

- `[@sanity/comlink] Received no response to message 'comlink/heartbeat'` —
  c'est la preuve que le canal **fonctionne** : le Studio et la page échangent
  des messages, certains restent sans réponse pendant les rechargements.
- `504 (Outdated Optimize Dep)` sur
  `/@id/astro/runtime/client/dev-toolbar/entrypoint.js` — la barre d'outils de
  développement d'Astro, sans rapport avec Sanity.
- `WebSocket ... api.sanity.io/socket/production?tag=sanity.studio failed` —
  l'écoute temps réel du Studio, pas de la prévisualisation.
- `Maximum update depth exceeded` — provient du bundle du Studio
  (`lib-*.js`), pas de notre code ni de l'île.

## Deux pièges vécus

- **La valeur du drapeau doit être exactement `true`.** `true.`, `True` ou
  `"true"` éteignent la prévisualisation **en silence** : Presentation affiche le
  site, mais aucun clic ne répond et le message « Unable to connect » apparaît,
  parce que l'île d'overlays n'est jamais rendue. La comparaison ne peut pas être
  rendue tolérante — `BaseLayout.astro` teste la même chaîne littéralement pour
  que Vite élimine l'île du bundle public. Une valeur mal formée déclenche donc
  un avertissement au démarrage.
- **Ne jamais lancer `pnpm build` avec le drapeau actif.** Le site est en
  `output: 'static'` : le build figerait des brouillons et des marqueurs stega
  dans du HTML destiné au public. Un avertissement est journalisé si cela arrive.
  Ce piège a été vécu depuis la porte de validation elle-même : avec le drapeau
  à `true` dans `.env`, `pnpm validate` produisait un `dist/` de
  prévisualisation — 43 fichiers, stega dans 18 d'entre eux, île `VisualEditing`
  émise — et ne prouvait donc plus rien sur la sortie publiée. C'est pourquoi
  `validate` appelle `pnpm build:public` et non `pnpm build` :
  `scripts/build-public.mjs` force le drapeau à `false` par variable de process,
  sans toucher `.env` ni interrompre la session de prévisualisation en cours.
  `pnpm build` reste sensible au drapeau; l’environnement de prévisualisation
  déployé, lui, passe par `pnpm build:preview`, qui pose les deux drapeaux
  ensemble et vide `dist/` avant de construire.

## Vérification manuelle, de bout en bout

Chaque étape prouve une chose précise; l'ordre compte.

| #   | Geste                                                   | Ce que ça prouve                                                                                           |
| --- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | Ouvrir le Studio déployé                                | Le Studio est en ligne et lit le bon projet.                                                               |
| 2   | Modifier un texte sans publier                          | Il existe un brouillon, distinct du contenu publié.                                                        |
| 3   | Ouvrir l'onglet Presentation                            | Le Studio charge l'adresse de `SANITY_STUDIO_PREVIEW_URL`, et le CORS de cette origine est accepté.        |
| 4   | Voir la modification non publiée dans l'iframe          | Le Worker lit avec la perspective `drafts` : le jeton serveur fonctionne. C'est le cœur du ticket.         |
| 5   | Cliquer sur un texte venu de Sanity                     | Les Content Source Maps et stega arrivent jusqu'au HTML.                                                   |
| 6   | Vérifier que le champ ouvert est le bon                 | `withKeyArraySelector` fait son travail : sans lui, un clic sur le troisième élément ouvrirait le premier. |
| 7   | Ouvrir le site public : le brouillon n'y est pas        | La séparation tient. Le public ne lit que le publié.                                                       |
| 8   | Publier depuis le Studio                                | Le contenu quitte l'état de brouillon.                                                                     |
| 9   | Voir un déploiement démarrer sur le projet Pages public | Le webhook Sanity vers Cloudflare fonctionne toujours.                                                     |
| 10  | Recharger le site public : la modification est là       | La chaîne complète tient, publication comprise.                                                            |

Contrôles rapides depuis un terminal :

```bash
curl -sI https://paroisse-preview.sebastieneugene123600.workers.dev/ | grep -i x-robots-tag
#   X-Robots-Tag: noindex, nofollow

curl -s https://paroisse-preview.sebastieneugene123600.workers.dev/robots.txt
#   User-agent: *
#   Disallow: /

curl -s https://paroisse-saint-rene-goupil.pages.dev/robots.txt
#   User-agent: *
#   Allow: /
#   Sitemap: ...
```

## Ce qui est normal, et ne se corrige pas

Trois comportements observés en production ressemblent à des pannes. Aucun n'en
est une. Ils sont écrits ici pour que personne ne les « répare ».

### Cloudflare Pages avertit qu'il ignore `wrangler.jsonc`

Depuis que le fichier est sur `main`, les builds Pages du site public et du
Studio affichent :

```text
A Wrangler configuration file was found but it does not appear to be valid.
Did you mean to use wrangler.toml to configure Pages?
...
Skipping file and continuing.
```

`wrangler.jsonc` appartient au **Worker** de prévisualisation. Il ne contient pas
`pages_build_output_dir` parce qu'il ne décrit pas un projet Pages. Les deux
builds Pages détectent le fichier, l'ignorent, et se terminent verts.

**Ne pas ajouter `pages_build_output_dir` pour faire taire l'avertissement.** Un
même fichier décrirait alors deux produits Cloudflare différents, et le silence
gagné coûterait la lisibilité du seul fichier qui nomme le Worker.

### Presentation demande parfois un rafraîchissement manuel

Observé sur `aboutPage.hero.introduction` : la modification est bien enregistrée
comme brouillon, mais l'iframe ne la rend pas immédiatement. Un clic sur le
bouton **Refresh** de l'iframe affiche la bonne valeur.

Ce n'est pas un défaut de lecture des brouillons, ni de correspondance des
champs : les deux ont été vérifiés ailleurs sur la même session. C'est le signal
de rafraîchissement qui n'atteint pas toujours la page. Non bloquant, et laissé
tel quel : le comprendre demanderait une enquête à part.

### La prévisualisation n'est pas derrière Cloudflare Access

État connu et accepté, pas un oubli. Voir « Limites connues ».

## Retour arrière

La prévisualisation est un environnement séparé. L'annuler ne demande donc
jamais de toucher au site public.

| Situation                            | Geste                                                                                                                                                                                       |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| La prévisualisation se comporte mal  | Supprimer le Worker `paroisse-preview` dans Cloudflare. Le site public et le Studio ne bougent pas.                                                                                         |
| Le jeton a fuité                     | Le révoquer dans sanity.io/manage, en créer un autre, le saisir dans le Worker, redéployer. Le jeton est en lecture seule : rien n'a pu être modifié.                                       |
| Il faut annuler le code              | `git revert` de la PR. Le site public repasse par `pnpm build:public`, dont le comportement n'a pas changé : sans `PREVIEW_DEPLOYMENT`, `astro.config.mjs` ne charge même pas l'adaptateur. |
| Presentation doit repointer ailleurs | Changer `SANITY_STUDIO_PREVIEW_URL` dans le projet Pages du Studio et redéployer. Aucun code à modifier.                                                                                    |

## Limites connues

- La prévisualisation est accessible à qui connaît son adresse. Elle est
  interdite d'indexation par trois moyens, mais elle n'est **pas** derrière
  Cloudflare Access. **C'est une décision, pas un oubli** : ce qu'on y voit est
  le contenu d'un site paroissial public, à quelques heures près. Poser Access
  devant le Worker reste le geste à faire si des brouillons devenaient
  sensibles; c'est un réglage de compte, pas du code.
- `@astrojs/cloudflare` est épinglé en `14.1.7`. La série `14.2.x` déclare
  accepter Astro `^7.0.0` mais importe `beginContentEntryCollection`
  d'`astro/app`, qui n'existe qu'à partir d'Astro 7.2. Monter l'adaptateur
  imposerait de monter Astro, donc de toucher au site public — un autre ticket.
- Les images de la prévisualisation ne sont pas optimisées. `sharp` n'existe pas
  sur Workers; comme rien n'est prérendu, `imageService: 'compile'` les laisse
  passer telles quelles. On prévisualise du contenu, pas des poids de fichiers.
- `getStaticPaths()` est ignoré en prévisualisation, et Astro le signale à
  chaque build. `src/pages/[slug].astro` retrouve donc sa page en cherchant le
  slug lui-même, et répond 404 pour une adresse inconnue.
- L'adaptateur déclare une liaison KV `SESSION`. Astro s'en sert pour les
  sessions; le site n'en ouvre aucune. Wrangler provisionne l'espace au premier
  déploiement. Si un déploiement s'en plaint, créer un espace KV et le nommer
  dans `wrangler.jsonc`.
- Les tests de ce ticket ne remplacent pas l'essai réel. La prévisualisation a
  été exécutée sur workerd (`wrangler dev`) avant d'être documentée : 200 sur
  l'accueil, `X-Robots-Tag` posé, `robots.txt` fermé, île d'overlays présente
  dans le HTML, 118 séquences stega, 404 sur une adresse inconnue.
