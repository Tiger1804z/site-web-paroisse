# Modèle de contenu Sanity prévu

Sanity n’est pas installé. Ce document décrit la frontière future afin que les
contrats Astro actuels restent stables.

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

## `thriftStorePage`

Le futur document de page pourra contenir :

- hero, eyebrow, titre et introduction;
- image principale, quatre images de révélation, textes alternatifs, crédits,
  droits et notes de remplacement;
- sections avec identifiant, titre, texte, activation et ordre;
- galerie et sujets photographiques;
- horaires, emplacement, note de prix et modalités de dons;
- CTA de contact;
- note sur les ventes spéciales.

Les champs pratiques devront conserver un statut de confirmation. Une valeur
non confirmée n'est pas normalisée en contenu public. Les ventes spéciales
possédant une date restent des documents `parishEvent` et ne sont pas intégrées
dans `thriftStorePage`.

```text
Sanity thriftStorePage
  → GROQ
  → normalisation
  → ThriftStorePageData
  → composants Astro existants
  → HTML statique
```

Sanity ne contrôlera pas le masque, le suivi du pointeur, le JavaScript, les
timings, le SVG `AnimatedClothingRack`, les couleurs, les breakpoints ou les
tokens de mouvement.

## Publication et rebuild

Une publication déclenchera plus tard un webhook de déploiement. Un rebuild
quotidien après minuit, selon `America/Toronto`, recalculera aussi les statuts
sans modification éditoriale. Le site conservera ainsi une génération
statique : Astro produit une nouvelle version HTML, puis le navigateur la
reçoit sans application React de calendrier.
