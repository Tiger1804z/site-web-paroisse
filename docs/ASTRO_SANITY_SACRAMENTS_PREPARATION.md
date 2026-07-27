# Préparation Astro et Sanity — Sacrements et services

> **Document historique S1-T06.** Depuis S1-T11, cette proposition est
> remplacée par `ServicesPageData`, `src/data/services.ts`,
> `getServicesPageData()` et la route canonique `/nos-services/`. Consulter
> `SANITY_CONTENT_MODEL.md` et `SERVICES_CONTENT_AUDIT.md`. Aucun schéma Sanity
> n’est installé.

## Objectif

La route `/sacrements/` est une page d’aperçu statique. Elle utilise aujourd’hui
une source TypeScript locale, mais ses composants ne connaissent ni ce fichier
ni le futur CMS.

Aucun package, client, schéma, secret, requête GROQ ou projet Sanity n’est
installé dans `S1-T06`. Les routes détaillées ne sont pas créées non plus.

## Flux actuel

```text
src/data/sacraments.ts
    ↓
getSacramentsPageData()
    ↓
frontmatter de src/pages/sacrements.astro
    ↓
composants Astro recevant des props SacramentsPageData
    ↓
HTML statique généré au build
    ↓
navigateur
```

Le frontmatter de la page appelle seulement la couche d’accès :

```astro
---
import { getSacramentsPageData } from '@/lib/content/getSacramentsPageData';

const sacramentsPageData = await getSacramentsPageData();
---
```

Cette partie entre `---` s’exécute pendant le build. Elle peut attendre une
fonction asynchrone, préparer les métadonnées et transmettre des props. Les
données locales complètes ne deviennent pas automatiquement un store
JavaScript dans le navigateur.

Astro produit le hero, les panneaux, la démarche et la FAQ sous forme de HTML.
Seuls les onglets nécessitent un petit script natif pour leur état visuel et
leur navigation clavier. React n’est pas nécessaire pour afficher ce contenu.

## Flux futur de la page d’aperçu

```text
Sanity Studio
    ↓
document sacramentsPage
    ↓
références ordonnées vers des documents sacrament
    ↓
requête GROQ exécutée au build
    ↓
normalizeSacramentsPageData()
    ↓
SacramentsPageData
    ↓
mêmes composants Astro
    ↓
HTML statique
```

Le corps futur du getter pourrait ressembler conceptuellement à ceci :

```ts
export async function getSacramentsPageData(): Promise<SacramentsPageData> {
  const rawData = await sanityClient.fetch(sacramentsPageQuery);
  return normalizeSacramentsPageData(rawData);
}
```

Ces imports ne sont pas créés pendant ce ticket.

## Page d’aperçu contre document `sacrament`

`/sacrements/` répond à une intention de navigation : présenter les catégories,
donner un résumé et orienter vers la prochaine étape.

Un document `sacrament` représente plutôt une unité de contenu autonome :

- Baptême;
- Mariage;
- Funérailles;
- Communion et confirmation;
- Catéchuménat;
- autre démarche validée.

Le même document pourra être référencé par la page d’aperçu, l’accueil, une
navigation contextuelle ou une future page de détail. Il ne faut donc pas
recopier son résumé dans plusieurs documents.

## Modèles Sanity potentiels

### Document `sacramentsPage`

- hero;
- texte d’introduction;
- ordre des références vers les sacrements;
- services affichés;
- démarche générale;
- avertissement;
- FAQ générale;
- CTA.

### Document `sacrament`

- `title`;
- `slug`;
- `summary`;
- `body`;
- image et texte alternatif;
- `requirements`;
- `processSteps`;
- `fees`;
- `contactInstructions`;
- FAQ;
- `active`;
- `order`;
- `lastReviewedAt`.

### Document `siteSettings`

- nom de la paroisse;
- téléphone;
- courriel;
- adresse;
- heures du secrétariat;
- destination du contact général.

Les coordonnées globales ne doivent pas être répétées dans chaque sacrement.

## Slugs

Un slug est la partie stable et lisible d’une URL. Par exemple :

```text
title : Baptême
slug  : bapteme
URL   : /sacrements/bapteme/
```

Les données locales possèdent déjà des slugs, mais
`detailPageAvailable: false` empêche leur utilisation comme liens.

Un slug publié doit rester stable. Le changer de `bapteme` à
`preparer-un-bapteme` casserait les favoris, les liens partagés et
l’indexation. Si un changement devient nécessaire, le déploiement devra prévoir
une redirection permanente de l’ancienne URL.

## Futures routes dynamiques Astro

Un futur ticket pourra créer :

```text
src/pages/sacrements/[slug].astro
```

Les crochets déclarent un paramètre dynamique. Le même fichier servira de
gabarit pour plusieurs URL, mais Astro générera une page statique distincte pour
chaque slug publié.

Exemple conceptuel, non implémenté :

```astro
---
export async function getStaticPaths() {
  const sacraments = await getAllSacraments();

  return sacraments.map((sacrament) => ({
    params: {
      slug: sacrament.slug,
    },
    props: {
      sacrament,
    },
  }));
}

const { sacrament } = Astro.props;
---
```

Pendant le build, Astro :

1. récupère tous les documents actifs;
2. lit leurs slugs;
3. crée une entrée de route par document;
4. transmet le contenu comme props;
5. génère le HTML;
6. écrit les pages statiques.

Ainsi :

```text
bapteme      → /sacrements/bapteme/
mariage      → /sacrements/mariage/
funerailles  → /sacrements/funerailles/
```

Aucun serveur permanent n’est requis pour servir ces fichiers. Ces routes ne
sont pas créées dans `S1-T06`, car le contenu détaillé et les slugs officiels
n’ont pas encore été validés.

## Rôle de `getStaticPaths()`

En sortie statique, Astro ne peut pas deviner toutes les valeurs possibles de
`[slug]`. `getStaticPaths()` lui donne la liste exacte pendant le build.

Cette fonction :

- s’exécute avant la génération des pages;
- peut appeler Sanity;
- filtre les documents inactifs;
- retourne `params` pour l’URL et `props` pour le template;
- crée de nouvelles routes lors du rebuild suivant une publication;
- ne s’exécute pas dans le navigateur du visiteur.

## Références Sanity

La page d’aperçu devrait référencer les documents `sacrament` plutôt que copier
leurs champs. Une référence permet :

- une seule source pour le titre et le résumé;
- une correction propagée à tous les aperçus;
- un ordre choisi par `sacramentsPage`;
- la réutilisation sur l’accueil;
- l’activation ou le retrait d’un document;
- une page de détail alimentée par le même contenu.

Un objet propre à la page, comme l’avertissement général, peut rester intégré au
document `sacramentsPage`. Tout ne doit pas devenir une référence.

## Normalisation

Les composants ne doivent jamais recevoir directement une réponse Sanity
brute. Une future fonction `normalizeSacramentsPageData()` pourra :

- résoudre les références;
- filtrer les documents inactifs;
- trier selon l’ordre éditorial;
- vérifier les slugs;
- calculer `detailPageAvailable`;
- fournir des tableaux vides sûrs;
- transformer les images et leurs points focaux;
- remplacer une valeur opérationnelle non confirmée par un placeholder;
- garantir le type `SacramentsPageData`.

Cette couche protège le design lorsque le schéma du CMS évolue.

## Portable Text

Portable Text stocke un contenu riche sous forme de blocs structurés plutôt que
comme du HTML libre. Il conviendra au corps d’une future page détaillée :

- paragraphes;
- listes;
- liens;
- citations approuvées;
- encadrés contrôlés.

Astro associera chaque type de bloc à un composant autorisé. L’éditeur pourra
modifier le contenu sans injecter de classes, de scripts ou de balises qui
casseraient le design ou l’accessibilité.

Les titres courts, slugs, CTA, tarifs et délais ne devraient pas utiliser
Portable Text : des champs structurés sont plus précis.

## Contenu structuré

Les champs suivants ne doivent pas être noyés dans un seul grand texte :

| Champ futur      | Structure recommandée                                       | Pourquoi                                       |
| ---------------- | ----------------------------------------------------------- | ---------------------------------------------- |
| `requirements`   | tableau d’objets                                            | Valider, réordonner ou masquer chaque exigence |
| `processSteps`   | tableau numéroté                                            | Conserver une démarche lisible et ordonnée     |
| `fees`           | objet facultatif, montant, devise, note et date de révision | Éviter un tarif sans contexte ou périmé        |
| FAQ              | tableau question/réponse                                    | Produire des accordéons accessibles            |
| `lastReviewedAt` | date                                                        | Savoir quand une procédure a été validée       |
| `active`         | booléen                                                     | Retirer un contenu sans le supprimer           |

Une valeur observée sur l’ancien site ne doit jamais remplir automatiquement
ces champs comme information approuvée.

## Correspondance avec le contrat TypeScript

| Contrat interne         | Champ Sanity futur probable | Rôle                         |
| ----------------------- | --------------------------- | ---------------------------- |
| `seo`                   | objet                       | Titre et description         |
| `hero`                  | objet `hero`                | Introduction et image        |
| `notice`                | objet facultatif            | Prudence et CTA              |
| `overview.items`        | références et objets        | Ordre des onglets            |
| `SacramentSummary.slug` | `slug`                      | Identité future de route     |
| `detailPageAvailable`   | valeur normalisée           | Autoriser ou bloquer un lien |
| `information.items`     | tableau structuré           | Informations ou placeholders |
| `services`              | objets ou références        | Autres demandes              |
| `generalProcess.steps`  | tableau d’objets            | Démarche générale            |
| `faq.items`             | tableau d’objets            | Questions générales          |
| `status`                | chaîne restreinte           | Validation éditoriale        |

## Ce qui sera modifiable dans Sanity

- titre, introduction et image du hero;
- ordre et activation des catégories;
- résumés;
- informations générales;
- services présentés;
- étapes de démarche;
- avertissement;
- FAQ;
- CTA;
- images, textes alternatifs et points focaux;
- slugs et état de publication;
- date de dernière validation.

## Ce qui restera dans le code

- routes et gabarits Astro;
- `BaseLayout`, header et footer;
- grilles, proportions et breakpoints;
- palette et typographie;
- comportement des onglets;
- composants de FAQ;
- focus et règles WCAG;
- validation des CTA;
- normalisation;
- contrat TypeScript.

Sanity administre le contenu; Astro conserve la présentation.

## Publication et rebuild statique

Le flux futur sera :

1. la paroisse modifie et publie un document;
2. un webhook avertit l’hébergeur;
3. l’hébergeur exécute `pnpm build`;
4. Astro lance les requêtes GROQ;
5. les données sont normalisées;
6. `/sacrements/` est régénérée;
7. `getStaticPaths()` ajoute ou retire les futures routes détaillées;
8. la nouvelle version statique est déployée.

Une publication Sanity ne modifie donc pas instantanément le HTML déjà
déployé. Le rebuild est approprié ici : il produit un site rapide, économique
et sans serveur applicatif permanent pour un contenu qui ne change pas chaque
seconde.
