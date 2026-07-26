# Préparation Astro et Sanity — Notre paroisse

## Objectif

La route `/notre-paroisse/` utilise une source locale typée, mais son design ne
dépend pas de cette source. Cette frontière permettra plus tard de brancher
Sanity sans réécrire la page ou ses composants.

Aucun package, schéma, client, secret ou projet Sanity n’est installé dans
`S1-T04`.

## Flux actuel

```text
src/data/about.ts
    ↓
getAboutPageData()
    ↓
frontmatter de notre-paroisse.astro
    ↓
composants Astro recevant des props AboutPageData
    ↓
HTML statique généré au build
    ↓
navigateur
```

Le fichier local contient les textes, images, repères et CTA. La fonction
`getAboutPageData()` est la seule porte d’entrée utilisée par la page.

## Ce qui se passe dans un fichier Astro

La partie comprise entre les deux séparateurs `---` est le frontmatter. Elle
s’exécute dans l’environnement de build :

```astro
---
import BaseLayout from '@/layouts/BaseLayout.astro';
import { getAboutPageData } from '@/lib/content/getAboutPageData';

const aboutPageData = await getAboutPageData();
---
```

Le frontmatter peut importer des composants, charger une source locale, attendre
une API et préparer les props. Ses variables ne sont pas automatiquement
sérialisées dans le navigateur.

Le template situé sous le frontmatter compose ensuite les sections :

```astro
<BaseLayout title={aboutPageData.seo.title}>
  <AboutHero hero={aboutPageData.hero} />
  <ParishHistory history={aboutPageData.history} />
</BaseLayout>
```

Astro transforme ce template en HTML avant la visite. Les composants de cette
page ne possèdent aucun `client:*` et n’envoient aucune application React. Le
navigateur reçoit principalement du HTML, du CSS et des images optimisées.

## Flux futur avec Sanity

```text
Responsable de la paroisse
    ↓
modifie et publie le document aboutPage dans Sanity Studio
    ↓
Sanity enregistre le contenu
    ↓
un webhook déclenche un nouveau build
    ↓
getAboutPageData() exécute une requête GROQ
    ↓
normalizeAboutPageData() transforme la réponse brute
    ↓
AboutPageData
    ↓
mêmes composants Astro
    ↓
nouveau HTML statique
```

L’implémentation future pourrait ressembler conceptuellement à ceci :

```ts
export async function getAboutPageData(): Promise<AboutPageData> {
  const rawData = await sanityClient.fetch(aboutPageQuery);
  return normalizeAboutPageData(rawData);
}
```

Ces imports et fonctions ne sont pas créés pendant ce ticket.

## Pourquoi normaliser

Une réponse brute Sanity reflète le schéma éditorial et peut contenir des champs
absents, des références non résolues ou des éléments désactivés. Les composants
visuels ne devraient pas gérer ces détails.

Une future fonction `normalizeAboutPageData()` pourra :

- renommer des champs Sanity;
- fournir une valeur par défaut sûre;
- filtrer une section désactivée;
- trier les repères historiques;
- résoudre les images et références;
- vérifier les statuts éditoriaux;
- adapter un ancien document après une évolution du schéma;
- garantir le contrat `AboutPageData`.

Le normaliseur formera une couche de protection entre le CMS et le design.

## Contenu potentiellement modifiable dans Sanity

- métadonnées de titre et de description;
- eyebrow, titre et introduction du hero;
- photographie du hero, texte alternatif et point focal;
- message d’introduction;
- repères historiques, dates, ordre et statut de confirmation;
- photographie et note de consécration;
- principes éditoriaux temporaires;
- textes et caractéristiques architecturales;
- profils d’architectes;
- images, légendes et droits de publication;
- libellés et destinations autorisées des CTA;
- activation des sections facultatives.

La paroisse ne contrôlera pas du HTML ou du CSS libre.

## Éléments qui restent dans le code

- route `/notre-paroisse/`;
- `BaseLayout`, header et footer;
- ordre structurel principal de la page;
- conteneur, grille, espacements et breakpoints;
- palette, typographie et états interactifs;
- recadrages de secours;
- composants, SVG décoratifs et animations;
- règles WCAG, hiérarchie des titres et focus;
- validation et normalisation des données;
- contrat TypeScript interne.

Le CMS fournit le contenu; Astro conserve la présentation et les garanties
techniques.

## Documents, objets et références

### Document autonome

Un document Sanity possède sa propre identité, son cycle de publication et peut
être recherché ou référencé. La page pourrait être un document unique
`aboutPage`.

Un profil de personne réutilisé sur plusieurs pages pourrait devenir un document
autonome, à condition que la paroisse ait réellement besoin de cette
réutilisation.

### Objet intégré

Un objet intégré appartient au document parent. Le hero, un CTA, une
caractéristique architecturale ou un repère historique peuvent rester des objets
dans `aboutPage`.

Ce choix est plus simple lorsqu’un élément n’a de sens que sur cette page.

### Référence

Une référence relie un document à un autre. Elle est utile pour une personne, un
groupe ou un média partagé à plusieurs endroits. Elle est inutile lorsqu’elle ne
fait que complexifier un contenu propre à une seule page.

### Tableau de blocs

Un tableau permet d’ajouter, masquer et réordonner des objets. La chronologie et
les profils d’architectes sont de bons candidats. Le normaliseur conservera
seulement les entrées publiables et les remettra dans l’ordre attendu.

## Modèles Sanity potentiels

Ces noms sont des pistes, pas des schémas implémentés :

- `aboutPage` : document principal;
- `siteSettings` : identité et réglages réellement globaux;
- `timelineEntry` : objet intégré, ou document si les repères sont réutilisés;
- `architectProfile` : objet intégré tant qu’il n’existe que sur cette page;
- `hero`, `callToAction`, `imageWithAlt` et `architectureFeature` : objets;
- `richTextSection` : objet contenant du Portable Text contrôlé.

## Portable Text

Portable Text est une structure de blocs riches, et non une chaîne HTML libre.
Il peut représenter des paragraphes, listes, liens et annotations tout en
conservant une structure de données.

Il est préférable à du HTML éditable parce que :

- l’éditeur ne peut pas injecter des styles arbitraires;
- Astro choisit le composant autorisé pour chaque type de bloc;
- la hiérarchie et l’accessibilité restent contrôlables;
- le contenu peut être réutilisé dans d’autres sorties;
- le design n’est pas cassé par des classes ou balises inconnues.

Pour cette page, Portable Text serait pertinent pour les paragraphes
éditoriaux. Les titres de section, repères, profils et CTA restent mieux
représentés par des champs structurés.

## Images Sanity, texte alternatif et hotspot

Une future image Sanity peut contenir :

- `asset` : le fichier média géré par Sanity;
- `alt` : description factuelle pour les images informatives;
- `caption` : légende éditoriale distincte du texte alternatif;
- `hotspot` : point focal à préserver lorsque le ratio change;
- `crop` : ajustement éditorial du cadrage;
- `publicationRightsConfirmed` : statut interne de droits;
- `peopleConsentConfirmed` : consentement lorsque des personnes sont visibles.

Le hotspot est particulièrement utile ici : le hero utilise un ratio large sur
ordinateur et plus vertical sur téléphone. Le normaliseur pourra transformer le
hotspot Sanity en paramètres d’image, tout en gardant les recadrages de secours
du contrat local.

Le texte alternatif ne doit pas devenir une description historique spéculative.
Une légende peut fournir le contexte visible; un champ interne séparé doit
conserver le statut des droits.

## Correspondance avec le contrat interne

| Contrat TypeScript        | Champ Sanity futur probable    | Rôle                          |
| ------------------------- | ------------------------------ | ----------------------------- |
| `seo.title`               | `string`                       | Titre de document             |
| `seo.description`         | `text`                         | Description de recherche      |
| `hero`                    | `object`                       | Contenu du hero               |
| `hero.image`              | `imageWithAlt`                 | Asset, alt, crop et hotspot   |
| `introduction.paragraphs` | `array` ou Portable Text       | Message éditorial             |
| `history.entries`         | `array` d’objets               | Repères ordonnés              |
| `TimelineEntry.status`    | `string` restreint             | Statut de validation          |
| `history.consecration`    | objet facultatif               | Repère issu de la plaque      |
| `principles.items`        | `array` d’objets               | Trois panneaux éditoriaux     |
| `architecture.features`   | `array` d’objets               | Caractéristiques              |
| `architects.profiles`     | `array` d’objets ou références | Personnes et rôles            |
| `confirmationRequired`    | `boolean`                      | Validation éditoriale requise |
| `closing.primaryCta`      | `callToAction`                 | Libellé et route autorisée    |

## Pourquoi les composants n’importent pas Sanity

Une requête dans chaque composant disperserait la structure brute du CMS,
dupliquerait la gestion d’erreurs et attacherait le design à un fournisseur.

Avec la couche actuelle :

- les requêtes futures restent centralisées;
- un changement de schéma touche le normaliseur;
- les composants restent simples et typés;
- une source locale peut servir de secours ou de fixture;
- le design peut être testé sans connexion CMS;
- remplacer Sanity ne demande pas de réécrire les sections.

## Build statique et publication

Une publication Sanity ne modifiera pas instantanément un HTML déjà déployé.
Après publication :

1. un webhook Sanity avertira l’hébergeur;
2. l’hébergeur lancera `pnpm build`;
3. Astro relancera la requête GROQ;
4. le normaliseur produira `AboutPageData`;
5. Astro générera une nouvelle page statique;
6. la nouvelle version sera déployée.

Ce modèle est rapide, sécuritaire et économique pour un contenu paroissial qui
ne change pas chaque seconde.

Le SSR pourrait interroger Sanity à chaque visite et refléter une modification
plus rapidement, mais il ajouterait un serveur, du cache, des modes de panne et
des coûts d’exploitation. Rien dans cette page ne justifie actuellement cette
complexité.

## Statuts historiques

Le contrat conserve les statuts :

- `probably-stable`;
- `legacy-source`;
- `photo-source`;
- `to-confirm`;
- `temporary`.

Ils empêchent une future migration CMS de transformer silencieusement une note
de travail en fait confirmé. Avant le lancement public, la paroisse devra
valider les dates, les architectes, la consécration, les transformations, les
droits photographiques et toute formulation patrimoniale.
