# Modèle de contenu Sanity prévu

Sanity n’est pas installé. Ce document décrit la frontière future afin que les
contrats Astro actuels restent stables.

## `contactPage`

Le document Contact pourra contenir :

- le hero, son titre et son introduction;
- les titres et textes d’accompagnement;
- les méthodes de contact à afficher;
- les libellés et options du formulaire;
- la mention de confidentialité;
- l’activation et l’ordre des blocs;
- l’adresse publique et les indications d’accès confirmées;
- les coordonnées géographiques et le fournisseur cartographique retenu;
- le lien d’itinéraire éventuel.

Les coordonnées globales et les heures du secrétariat devraient idéalement
provenir de `siteSettings`, puis être normalisées avec `contactPage` vers
`ContactPageData`. Cela évite de recopier une adresse ou un téléphone dans le
footer, l’accueil et Contact.

L’adresse confirmée est temporairement centralisée dans `src/lib/site.ts`.
Lors du branchement au CMS, elle migrera vers `siteSettings`; le composant de
carte continuera de recevoir une URL normalisée et du contenu typé sans
connaître GROQ.

```text
Sanity contactPage + siteSettings
  → GROQ
  → normalisation et filtrage des données confirmées
  → ContactPageData
  → composants Astro existants
  → HTML statique
```

Sanity ne contiendra jamais une clé API, un mot de passe SMTP, une adresse
destinataire privée, un secret anti-spam ou la logique serveur. Ces éléments
appartiendront uniquement aux variables d’environnement et au code de la
plateforme d’hébergement.

Cette préparation éditoriale est indépendante de la porte d’envoi S1-T09 :
installer Sanity ou publier `contactPage` ne rendrait pas le formulaire
opérationnel. La décision sur l’hébergement, l’endpoint et le fournisseur
demeure explicitement en attente.

## `parishLifePage`

Le futur document de page pourra contenir :

- `hero` avec eyebrow, titre, introduction, image et texte alternatif;
- `introduction` et note éditoriale de confirmation;
- `features[]` avec identifiant, titre, résumé, points clés, CTA, statut,
  activation et ordre;
- `participation` avec accent, titre, description et CTA;
- images, positions de recadrage et crédits.

Une entrée de `features[]` peut rester un objet intégré, car elle appartient à
la composition de cette page. Un groupe devrait devenir un document Sanity
référencé uniquement s'il doit être réutilisé ailleurs, posséder une page
détaillée ou être relié à des responsables et activités validés.

Sanity contrôlera le contenu, l'ordre et l'activation. Le code Astro conservera
la grille alternée, les breakpoints, la palette, les reveals, les composants,
les règles d'accessibilité et la validation du contrat.

```text
Sanity parishLifePage
  → GROQ
  → normalisation
  → ParishLifePageData
  → composants Astro existants
  → HTML statique
```

`ParishLifeFeature` reste distinct de `ParishEvent`. Une activité datée est
saisie une seule fois comme `parishEvent`; la page Vie paroissiale pourra plus
tard recevoir une sélection déjà filtrée si sa maquette évolue, sans dupliquer
les documents.

## `eventsPage`

Ce document de page pourra contenir le hero, l’introduction et l’ordre des
catégories éditoriales permanentes. Ces catégories décrivent les formes de vie
paroissiale et ne sont pas des rendez-vous de calendrier.

## `parishEvent`

Chaque occurrence datée deviendra un document autonome :

| Champ                          | Type Sanity probable                | Rôle                                   |
| ------------------------------ | ----------------------------------- | -------------------------------------- |
| `title`                        | `string`                            | Titre public                           |
| `slug`                         | `slug`                              | Identité stable et future URL          |
| `excerpt`                      | `text`                              | Résumé des cartes                      |
| `description`                  | Portable Text limité                | Contenu éditorial plus long            |
| `category`                     | `string` à liste contrôlée          | Pèlerinage, célébration, concert, etc. |
| `startAt`, `endAt`             | `datetime`                          | Calcul du statut temporel              |
| `timeZone`                     | `string` contrôlé                   | Référence d’affichage                  |
| `locationName`, `meetingPoint` | `string`                            | Lieu et rassemblement                  |
| `departureAt`, `returnAt`      | `datetime`                          | Heures pratiques facultatives          |
| `price`                        | objet `{ amount, currency, label }` | Coût structuré                         |
| `capacityNotice`               | `string`                            | Avis non quantifié                     |
| `contact`                      | objet ou référence                  | Nom et coordonnées publiables          |
| `publicationStatus`            | `string`                            | Brouillon, publié ou annulé            |
| `showOnWebsite`                | `boolean`                           | Visibilité publique                    |
| `showOnHomepage`               | `boolean`                           | Éligibilité à l’accueil                |
| `showInArchive`                | `boolean`                           | Conservation après la fin              |
| `featured`                     | `boolean`                           | Candidat à la grande carte             |
| `homepagePriority`             | `number`                            | Départage facultatif                   |
| `coverImage`                   | objet image + alt + crédit          | Image principale et droits             |
| `gallery`                      | tableau d’objets image              | Galerie future                         |
| `cta`                          | objet `{ label, href }`             | Action explicite                       |

Sanity ne stockera jamais `upcoming`, `ongoing` ou `past`. Ces états dépendent
de l’heure du build et sont dérivés par le normalisateur ou la couche de
contenu avant de produire le contrat interne `ParishEvent`.

## `eventsPageSettings`

Un document de réglages pourra contenir :

- `showUpcomingSection`;
- `showPastSection`;
- `upcomingSectionTitle`;
- `pastSectionTitle`;
- `upcomingLimit`;
- `pastLimit`.

Ces options masquent une section ou limitent son rendu. Une section vide reste
masquée même si son drapeau est actif.

## Réglages de l’accueil

Les réglages de la page d’accueil pourront contenir :

- `showHomepageUpcomingSection`;
- `homepageUpcomingTitle`, par défaut « Prochaines activités »;
- `homepageUpcomingLimit`, par défaut `4`.

L’accueil référence la même collection `parishEvent`; il ne possède pas de
copies d’événements. Un responsable saisit donc un événement une seule fois,
active les drapeaux nécessaires, puis publie.

## Requête et normalisation futures

```text
Sanity Studio
  → parishEvent + eventsPageSettings + réglages accueil
  → GROQ
  → normalisation et validation
  → ParishEvent
  → fonctions de visibilité et de tri
  → composants Astro inchangés
```

La normalisation transformera les images Sanity en données utilisables par la
couche d’image choisie, validera le fuseau, convertira les CTA et supprimera
les entrées invalides. Les composants ne connaîtront ni GROQ, ni le client
Sanity, ni la réponse brute.

## Publication et rebuild

Une publication déclenchera plus tard un webhook de déploiement. Un rebuild
quotidien après minuit, selon `America/Toronto`, recalculera aussi les statuts
sans modification éditoriale. Le site conservera ainsi une génération
statique : Astro produit une nouvelle version HTML, puis le navigateur la
reçoit sans application React de calendrier.
