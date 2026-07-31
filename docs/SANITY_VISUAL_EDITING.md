# Prévisualisation éditoriale — Presentation et Visual Editing

Ce document décrit comment la paroisse voit ses modifications avant publication,
et pourquoi le site public n'en porte aucune trace.

## Le principe en une phrase

Le site public est un tas de fichiers HTML statiques qui ne connaissent que le
contenu publié; la prévisualisation est un **second environnement**, activé par
une variable, qui rend les mêmes pages à la demande, lit les brouillons et
laisse cliquer sur un texte pour ouvrir le champ qui le produit.

## Deux modes, un seul code

|                     | Site public        | Prévisualisation                       |
| ------------------- | ------------------ | -------------------------------------- |
| Rendu               | statique, au build | à la demande (`astro dev` aujourd'hui) |
| Perspective Sanity  | `published`        | `drafts` si un jeton est fourni        |
| Jeton               | aucun              | jeton Viewer, côté serveur uniquement  |
| Content Source Maps | non demandées      | `withKeyArraySelector`                 |
| stega               | désactivé          | activé                                 |
| Overlays            | absents du bundle  | chargés                                |
| Indexation          | normale            | `noindex, nofollow` sur toute page     |

Le basculement tient à une seule variable, `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`.
Tout est concentré dans `src/lib/sanity/preview.ts` : les getters appellent
`loadQuery()` sans savoir dans quel mode ils tournent.

## Variables d'environnement

Voir `.env.example`. Résumé :

| Variable                               | Rôle                                           | Public ? |
| -------------------------------------- | ---------------------------------------------- | -------- |
| `PUBLIC_SANITY_PROJECT_ID`             | projet Sanity                                  | oui      |
| `PUBLIC_SANITY_DATASET`                | jeu de données                                 | oui      |
| `PUBLIC_SANITY_VISUAL_EDITING_ENABLED` | active la prévisualisation                     | oui      |
| `PUBLIC_SANITY_STUDIO_URL`             | adresse du Studio, pour les liens « modifier » | oui      |
| `SANITY_API_READ_TOKEN`                | lecture des brouillons                         | **non**  |

Le préfixe `PUBLIC_` n'est pas une convention de nommage : c'est **le mécanisme**
par lequel Astro décide ce qu'il inclut dans le JavaScript envoyé au navigateur.
Un jeton nommé `PUBLIC_...` serait publié. Un test le vérifie
(`tests/sanity-visual-editing.test.mjs`).

## Créer le jeton — à faire manuellement

1. Ouvrir <https://www.sanity.io/manage/project/xo2ahvjo>.
2. Onglet **API** → **Tokens** → **Add API token**.
3. Nom : `astro-preview-viewer`.
4. Permissions : **Viewer**, et rien d'autre. Ce jeton doit pouvoir lire, jamais
   écrire : s'il fuit, personne ne peut modifier ni supprimer du contenu.
5. Copier la valeur **une seule fois** dans le `.env` local, jamais dans le dépôt.

```bash
# .env (ignoré par Git)
PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true
SANITY_API_READ_TOKEN=sk...
```

Sans jeton, la prévisualisation fonctionne quand même : elle affiche le contenu
**publié** avec les overlays, et journalise un avertissement. Seuls les
brouillons manquent.

## CORS

Presentation affiche le site dans une iframe, et le code d'overlay qui y tourne
interroge Sanity **depuis le navigateur**. L'origine du site prévisualisé doit
donc être déclarée dans le projet, sans quoi Presentation reste bloqué sur
« Unable to connect » alors que la page s'affiche normalement.

Déjà fait le 30 juillet 2026 :

```bash
pnpm --dir studio exec sanity cors add http://localhost:4321 --no-credentials
pnpm --dir studio exec sanity cors list   # vérifier
```

**Ne jamais cocher « Allow credentials »** pour ces origines : le site lit Sanity
depuis le serveur avec son propre jeton, il n'a aucun besoin des identifiants de
session du navigateur. Toute nouvelle origine de prévisualisation (déploiement,
autre port) devra être ajoutée de la même manière.

## Utiliser la prévisualisation aujourd'hui

Deux processus, deux terminaux :

```bash
pnpm --dir studio dev   # Studio sur http://localhost:3333
pnpm dev                # site sur http://localhost:4321
```

Puis, dans le Studio, onglet **Presentation**. L'éditrice y voit le vrai site,
navigue, bascule desktop/mobile, et clique sur un texte pour ouvrir son champ.

Pour revenir au comportement public : remettre
`PUBLIC_SANITY_VISUAL_EDITING_ENABLED=false` (ou retirer la ligne) et
redémarrer. Il n'y a pas de cookie à effacer, parce qu'il n'y a pas de cookie :
le mode dépend de l'environnement, pas d'une session de navigateur.

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

## Déploiement

**Il n'existe aujourd'hui aucun déploiement de ce site.** Pas d'adaptateur, pas
de `vercel.json`, aucun workflow de déploiement — le seul workflow GitHub valide
le projet. La prévisualisation fonctionne donc en local uniquement.

Quand un hébergement sera choisi, la forme visée est :

- **production** : `output: 'static'`, aucune variable de prévisualisation,
  reconstruction déclenchée après publication;
- **prévisualisation** : un déploiement distinct, avec un adaptateur serveur,
  `PUBLIC_SANITY_VISUAL_EDITING_ENABLED=true` et le jeton en variable
  d'environnement serveur, son origine ajoutée aux CORS Sanity.

Ce choix — adaptateur, hébergeur, protection d'accès de l'environnement de
prévisualisation — appartient à son propre ticket.

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
  `pnpm build` reste sensible au drapeau, pour un futur environnement de
  prévisualisation déployé.

## Limites connues

- Le mode dépend de l'environnement, pas d'une session : il n'y a pas encore
  d'activation par cookie ni de route d'activation/désactivation. Cela deviendra
  nécessaire seulement si la prévisualisation est déployée sur une origine
  publique, où il faudra aussi la protéger par mot de passe.
- Les tests de ce ticket sont des gardes de source : `preview.ts` importe le
  module virtuel `sanity:client`, que Node ne résout pas hors d'Astro. Le
  comportement réel a été vérifié à la main sur le HTML servi, et les invariants
  du build public sont mesurables à tout moment sur `dist/`.
