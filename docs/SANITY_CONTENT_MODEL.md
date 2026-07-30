# Modèle de contenu Sanity prévu

Sanity n’est pas installé. Ce document décrit la frontière future afin que les
contrats Astro actuels restent stables.

> **Note du 29 juillet 2026 — Sanity est désormais installé** et les premiers
> documents sont en production. Les sections ci-dessous restent des intentions
> pour les pages non migrées; la règle de découpage adoptée est décrite juste
> en dessous et prime sur elles.

## Règle de découpage : données partagées et pages

Le Studio est organisé en deux sections, qui reflètent une seule question :
**combien de pages affichent cette information, et survit-elle à la page?**

- affichée à deux endroits ou plus, ou vraie indépendamment de toute page →
  **document partagé**;
- n’a de sens que sur une page → **document de page**.

Application actuelle :

| Document       | Section           | Contenu                                                              |
| -------------- | ----------------- | -------------------------------------------------------------------- |
| `siteConfig`\* | Données partagées | Coordonnées, téléphone, courriel, heures du secrétariat.             |
| `massSchedule` | Données partagées | Horaires réguliers et saisonniers, date de vérification.             |
| `parishEvent`  | Collections       | Une activité datée par document, lue par `/evenements` et l’accueil. |
| `homePage`     | Pages             | Réglages de la section des activités de l’accueil.                   |
| `schedulePage` | Pages             | Hero, avis, bandeau, textes de l’encadré et FAQ de `/horaires`.      |
| `eventsPage`   | Pages             | Hero, catégories permanentes et réglages de sections.                |

\* le type s’appelle `siteSettings` dans le code.

Trois conséquences pratiques :

- les horaires des messes sont lus par `/horaires` **et** par l’accueil, donc
  ils ne peuvent pas appartenir à une page;
- les heures du secrétariat sont une coordonnée, pas du contenu de page : elles
  serviront aussi Contact et Première visite;
- les collections (événements, annonceurs) restent des collections. Un document
  de page ne contient jamais une liste d’entités qui ont leur propre cycle de
  vie.

Aucune référence Sanity ne relie ces documents : la page Astro lit les sources
dont elle a besoin et les recompose dans son getter. Une jointure GROQ n’aurait
rien apporté tant qu’il n’existe qu’un seul horaire.

## Images téléversées

Deux systèmes coexistent volontairement pendant la migration.

- **Image locale** — fichier du projet, connu au build, traité par
  `astro:assets`. C’est encore le cas de tous les heros de page.
- **Image Sanity** — téléversée par l’éditrice, servie par le CDN, rendue par
  `RemoteImage.astro`. Le recadrage qu’elle choisit dans le Studio devient un
  `object-position`, parce que la plupart des cadres du site s’étirent à la
  hauteur de leur colonne et n’ont pas de format connu à l’avance.

L’objet `eventImage` porte ce qui rend une image publiable : texte alternatif
**bloquant dès qu’un fichier est déposé**, crédit, note de licence, et deux
cases — personne reconnaissable, image générée par IA. Ces deux cases
n’interdisent rien; elles permettent de répondre à la question plus tard, ce
qui est impossible si l’information n’a jamais été saisie.

Migrer les heros de page demandera un ticket dédié, traitant tous les visuels
de page ensemble plutôt qu’une page à la fois.

## `parishLifePage`

Le futur document de page pourra contenir :

- `hero` avec eyebrow, titre, introduction et `images[]`;
- pour chaque image du hero : média, libellé, texte alternatif, position de
  recadrage, crédit, caractère documentaire et statut de génération;
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
la grille alternée, les breakpoints, la palette, les reveals, la rotation et la
lentille du hero, les composants, les règles d'accessibilité et la validation
du contrat. Le CMS ne pourra pas injecter une durée, un masque, du CSS ou du
JavaScript.

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
- ordre et activation des grandes sections;
- titres, descriptions et CTA éditoriaux;
- images, textes alternatifs, crédits et positions de recadrage;
- une variante de cadre choisie dans la liste contrôlée `arch`, `landscape`,
  `organic`, `oval` ou `portrait-offset`;
- groupes mis en avant dans « Vivre la paroisse ».

L’accueil référence la même collection `parishEvent`; il ne possède pas de
copies d’événements. Un responsable saisit donc un événement une seule fois,
active les drapeaux nécessaires, puis publie.

Sanity ne pourra pas injecter de CSS, de `clip-path`, de SVG ou de JavaScript.
Le carrousel photographique, le vitrail, les lentilles et les transitions
restent dans le code.

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

## `servicesPage`

Le futur document canonique pourra contenir :

- hero, introduction, images, textes alternatifs et crédits;
- catégories et services avec activation et ordre;
- résumés, procédures et CTA;
- détails structurés avec statut de confirmation;
- tarif, année d’application, période, date de révision et exigence de révision
  périodique;
- moyens de paiement;
- section Location de salle et règles confirmées.

Une célébration spéciale datée reste un `parishEvent`; elle n’est pas dupliquée
dans `servicesPage`. La disponibilité d’une salle n’est jamais calculée par le
CMS et aucune réservation automatique n’est créée.

```text
Sanity servicesPage + parishService + siteSettings
  → GROQ
  → normalisation et contrôle des dates
  → ServicesPageData
  → composants Astro existants
  → HTML statique
```

Sanity ne contrôle ni la lentille du hero, ni sa rotation, ni les formes CSS,
ni la navigation, ni les redirections. Les valeurs temporelles non révisées
peuvent être masquées par le normalisateur.

## `siteSettings`

Le document global futur administrera :

- nom public de la paroisse;
- rue, ville, province, code postal et pays;
- téléphone public et formats d’affichage;
- courriel public avec état de confirmation;
- heures du secrétariat;
- lien d’itinéraire, latitude et longitude;
- informations confirmées de stationnement et d’accessibilité;
- réseaux sociaux publiables.

```text
Sanity siteSettings
  → GROQ
  → normalisation
  → PublicContactDetails
  → accueil / Contact / Footer / Nos services
```

Une valeur non confirmée est supprimée par la normalisation. `siteSettings` ne
contiendra jamais de mot de passe SMTP, destinataire privé, clé API, secret,
code serveur ou logique d’envoi.

## `galleryItem` pour l’aperçu de l’accueil

La page Galerie complète est différée. Une future collection `galleryItem`
pourra d’abord administrer la sélection photographique de l’accueil.

Chaque `galleryItem` pourra contenir :

- image et texte alternatif obligatoire;
- titre, description, catégorie et ordre;
- statut de publication et état des droits;
- mise en vedette et visibilité sur l’accueil;
- crédit, source et date de capture facultative;
- caractère documentaire ou artistique;
- présence de personnes et consentement confirmé;
- variante de composition dans une liste contrôlée.

```text
Sanity galleryItem
  → GROQ
  → normalisation droits / alt / consentement
  → GalleryItem[]
  → sélection de l’accueil
```

Le CMS ne pourra pas publier une image sans alt, aux droits en attente, ou
montrant une personne sans consentement. Il ne pourra pas injecter de CSS,
HTML arbitraire, JavaScript, `clip-path`, ni retirer automatiquement un crédit.
Le carrousel, ses transitions et sa lightbox restent dans le code Astro. Un
futur `galleryPage` ne sera préparé que si la route autonome est reprise.

## Publication et rebuild

Une publication déclenchera plus tard un webhook de déploiement. Un rebuild
quotidien après minuit, selon `America/Toronto`, recalculera aussi les statuts
sans modification éditoriale. Le site conservera ainsi une génération
statique : Astro produit une nouvelle version HTML, puis le navigateur la
reçoit sans application React de calendrier.

## `advertiser` et `advertisersPage`

Une future collection `advertiser` pourra contenir :

- nom, slug, catégorie et description;
- adresse, téléphone, courriel et site Web;
- logo et images avec texte alternatif, crédit et statut de droit;
- statut éditorial, ordre et mise en avant;
- dates de début et de fin facultatives;
- date de dernière confirmation et note interne.

Le document `advertisersPage` pourra administrer le hero, l’introduction,
l’activation de la liste, le bloc « Devenir annonceur » et ses CTA.

```text
Sanity advertiser + advertisersPage + siteSettings
  → GROQ
  → normalisation statut / dates / droits
  → AdvertisersPageData
  → composants Astro existants
```

Seuls les annonceurs `active`, non expirés, avec des coordonnées et des droits
valides seront normalisés pour la publication. Une date de fin nécessitera un
rebuild périodique selon `America/Toronto`; en l’absence de date réelle, le
statut éditorial explicite reste la seule source de décision.

La paroisse pourra ajouter, masquer, réordonner ou mettre à jour une fiche sans
modifier le code. Le CMS ne contiendra jamais de contrat complet, donnée de
paiement, numéro de carte, secret, mot de passe, HTML arbitraire, CSS ou
JavaScript. Il ne pourra pas publier un visuel sans alt ni retirer un crédit
obligatoire.
