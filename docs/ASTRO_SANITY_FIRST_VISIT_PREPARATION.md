# Préparation Astro et Sanity — Première visite

## Objectif

La route `/premiere-visite/` utilise une source locale typée sans attacher ses
composants à cette source. Cette frontière permettra de brancher Sanity plus
tard sans réécrire le design.

Aucun package, schéma, client, secret ou projet Sanity n’est installé dans
`S1-T05`.

## Flux actuel

```text
src/data/firstVisit.ts
    ↓
getFirstVisitPageData()
    ↓
frontmatter de premiere-visite.astro
    ↓
composants Astro recevant des props FirstVisitPageData
    ↓
HTML statique généré au build
    ↓
navigateur
```

La page importe uniquement la fonction d’accès :

```astro
---
import { getFirstVisitPageData } from '@/lib/content/getFirstVisitPageData';

const firstVisitPageData = await getFirstVisitPageData();
---
```

Le frontmatter entre les séparateurs `---` s’exécute pendant le build. Il peut
importer des composants, attendre une fonction asynchrone et préparer les props.
Ses variables ne deviennent pas automatiquement un état JavaScript dans le
navigateur.

Astro transforme ensuite le template et les composants en HTML. La FAQ utilise
`details` et `summary`; elle fonctionne donc sans React ni hydratation
`client:*`.

## Flux futur

```text
Responsable de la paroisse
    ↓
publie firstVisitPage ou siteSettings dans Sanity Studio
    ↓
un webhook déclenche un build
    ↓
getFirstVisitPageData() exécute une requête GROQ
    ↓
normalizeFirstVisitPageData() assemble et vérifie les réponses
    ↓
FirstVisitPageData
    ↓
mêmes composants Astro
    ↓
nouveau HTML statique
```

L’implémentation future pourra conceptuellement devenir :

```ts
export async function getFirstVisitPageData(): Promise<FirstVisitPageData> {
  const rawData = await sanityClient.fetch(firstVisitPageQuery);
  return normalizeFirstVisitPageData(rawData);
}
```

Ces imports et fonctions ne sont pas créés pendant ce ticket.

## `firstVisitPage` et `siteSettings`

### Contenu appartenant à `firstVisitPage`

- titre, introduction et message d’accueil;
- étapes de préparation;
- déroulement général d’une célébration;
- stationnement, entrée et accessibilité propres à la visite;
- FAQ;
- image et texte alternatif;
- CTA;
- ordre des éléments et activation des sections facultatives.

### Contenu global appartenant à `siteSettings`

- nom officiel;
- adresse;
- téléphone;
- courriel;
- heures du secrétariat;
- liens sociaux.

L’adresse ne doit pas être copiée dans chaque page. Une seule correction dans
`siteSettings` devra alimenter le footer, Contact et Première visite. La source
locale conserve des placeholders jusqu’à ce que ces valeurs soient confirmées.

Le type `PracticalInformationItem.futureSource` documente déjà cette
responsabilité avec les valeurs `site-settings` ou `page`.

## Modèles Sanity potentiels

### Documents

- `firstVisitPage` : contenu éditorial propre à la route;
- `siteSettings` : coordonnées et identité partagées.

### Objets intégrés

- `hero`;
- `visitStep`;
- `expectationItem`;
- `practicalInformationItem`;
- `faqItem`;
- `callToAction`;
- `imageWithAlt`.

Les étapes et les FAQ peuvent rester des tableaux d’objets intégrés, car elles
n’ont de sens que dans leur page et doivent pouvoir être réordonnées.

### Références

Une référence relie un document à un autre sans recopier son contenu.
`firstVisitPage` pourra référencer :

- `siteSettings` pour les coordonnées globales;
- une source d’horaires actifs, si le CMS en possède une;
- une FAQ partagée seulement si une même question est réellement réutilisée sur
  plusieurs pages.

Une référence n’est pas nécessaire pour chaque petit objet. Elle ajouterait de
la complexité sans bénéfice lorsqu’un élément appartient uniquement à cette
page.

## Objets imbriqués et tableaux

Un objet imbriqué regroupe des champs cohérents. Un `visitStep` pourra contenir
un identifiant, un numéro, un titre, une description, une note et un statut de
confirmation.

Un tableau permet aux éditeurs :

- d’ajouter une étape ou une question;
- de changer l’ordre;
- de masquer un élément;
- de corriger une formulation;
- de conserver des titres plus longs.

Le nombre de colonnes et la présentation ne seront pas enregistrés dans Sanity.
Astro adaptera automatiquement le tableau à sa grille responsive.

## Normalisation

Les composants ne doivent pas recevoir la réponse brute du CMS. Une future
fonction `normalizeFirstVisitPageData()` pourra :

- assembler `firstVisitPage` et `siteSettings`;
- remplacer un champ absent par un placeholder sûr;
- filtrer les éléments désactivés;
- valider les routes de CTA;
- vérifier les statuts de confirmation;
- résoudre les références et images;
- garantir un tableau vide plutôt qu’une valeur invalide;
- retourner exactement `FirstVisitPageData`.

Cette couche protège le design contre une évolution du schéma Sanity et empêche
une information opérationnelle non validée d’être publiée silencieusement.

## Contenu modifiable dans Sanity

- titre et introduction;
- étapes;
- moments de la célébration;
- informations pratiques propres à la page;
- contenu d’accessibilité;
- réponses pour les familles;
- FAQ;
- image, texte alternatif et légende;
- CTA;
- activation de la FAQ ou d’une image.

## Contenu restant dans le code

- route `/premiere-visite/`;
- `BaseLayout`, header et footer;
- grilles, espacements, largeurs et breakpoints;
- palette, typographie et bordures;
- boutons et accordéons natifs;
- interactions, focus et réduction des mouvements;
- règles d’accessibilité;
- validation et normalisation;
- contrat TypeScript.

Sanity administre le contenu; Astro conserve le design et les garanties
techniques.

## Portable Text

Portable Text représente un contenu riche sous forme de blocs structurés plutôt
que comme une chaîne HTML libre. Il peut gérer paragraphes, listes, liens et
annotations.

Il serait pertinent pour une introduction éditoriale plus riche ou une longue
réponse, mais pas nécessaire pour les libellés courts et les valeurs pratiques.

Astro pourra associer chaque type de bloc à un composant autorisé. L’éditeur ne
pourra donc pas injecter des styles ou balises arbitraires qui casseraient la
hiérarchie, l’accessibilité ou la composition Figma.

## Images Sanity

Une future image pourra fournir :

- `asset`;
- `alt` factuel;
- `caption`;
- `hotspot` pour le point focal;
- `crop`;
- statut des droits de publication;
- consentement lorsque des personnes sont visibles.

Le hotspot permet de préserver le bâtiment ou le cheminement lorsque le panneau
photographique change de ratio entre ordinateur et téléphone. Une photographie
d’une rampe ne doit jamais convertir automatiquement le champ
`accessibility.confirmed` en `true`.

## Correspondance TypeScript vers Sanity

| Contrat interne              | Champ Sanity futur probable | Responsabilité                             |
| ---------------------------- | --------------------------- | ------------------------------------------ |
| `seo`                        | objet                       | Métadonnées de la page                     |
| `hero`                       | objet                       | Introduction de Première visite            |
| `preparation.steps`          | tableau de `visitStep`      | Étapes ordonnées                           |
| `VisitStep.status`           | chaîne restreinte           | Validation éditoriale                      |
| `expectations.items`         | tableau d’objets            | Déroulement général                        |
| `practicalInformation.items` | tableau assemblé            | Données de page et globales                |
| `futureSource`               | logique du normaliseur      | Origine `firstVisitPage` ou `siteSettings` |
| `practicalInformation.image` | `imageWithAlt`              | Image, alt, crop et hotspot                |
| `faq.items`                  | tableau de `faqItem`        | Questions facultatives                     |
| `primaryCta`                 | `callToAction`              | Libellé et route autorisée                 |

## Pourquoi les composants n’importent pas Sanity

Une requête dans chaque section disperserait la structure brute du CMS,
dupliquerait la gestion des champs manquants et rendrait le design dépendant du
fournisseur.

Avec la couche d’accès :

- les requêtes restent centralisées;
- les composants reçoivent toujours le même contrat;
- une source locale peut servir de fixture;
- le design fonctionne sans connexion CMS;
- un changement de schéma touche surtout le normaliseur;
- remplacer Sanity ne demande pas de réécrire les sections.

## Publication et rebuild statique

Une publication Sanity ne change pas directement le HTML déjà en ligne :

1. la paroisse publie un document;
2. un webhook avertit l’hébergeur;
3. l’hébergeur lance `pnpm build`;
4. Astro exécute GROQ pendant le build;
5. le normaliseur produit `FirstVisitPageData`;
6. Astro génère la nouvelle page statique;
7. la version est déployée.

Ce modèle est rapide, sécuritaire et adapté à des informations qui ne changent
pas chaque seconde. Le SSR pourrait interroger Sanity à chaque visite, mais
ajouterait un serveur, du cache, des coûts et de nouveaux modes de panne sans
bénéfice démontré pour cette page.
