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

| Document          | Section           | Contenu                                                              |
| ----------------- | ----------------- | -------------------------------------------------------------------- |
| `siteConfig`\*    | Données partagées | Coordonnées, téléphone, courriel, heures du secrétariat.             |
| `massSchedule`    | Données partagées | Horaires réguliers et saisonniers, date de vérification.             |
| `thriftStore`     | Données partagées | Nom, heures, emplacement et téléphone propres à la friperie.         |
| `parishEvent`     | Collections       | Une activité datée par document, lue par `/evenements` et l’accueil. |
| `advertiser`      | Collections       | Une fiche d’annonceur par document, lue par `/nos-annonceurs`.       |
| `homePage`        | Pages             | Réglages de la section des activités de l’accueil.                   |
| `contactPage`     | Pages             | Textes de `/contact` et motifs du formulaire. Aucune coordonnée.     |
| `schedulePage`    | Pages             | Hero, avis, bandeau, textes de l’encadré et FAQ de `/horaires`.      |
| `eventsPage`      | Pages             | Hero, catégories permanentes et réglages de sections.                |
| `thriftStorePage` | Pages             | Hero, présentation, sections, textes de galerie et bloc de clôture.  |

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

## `parishLifePage` — migré

Document unique, groupes embarqués, pour la même raison que `servicesPage` :
aucune autre page ne lit ces groupes. Le jour où l'accueil ou une route
détaillée les affichera, ils deviendront une collection.

Le document contient :

- `hero` — surtitre, titre, introduction;
- `introduction` — surtitre, titre, paragraphes, note de confirmation;
- `features[]` (objet `parishGroup`) — ancre, nom, surtitre, description,
  points saillants, image, libellé du bouton, `active`;
- `participation` — accent, titre, description, libellé du bouton.

**Les images sont téléversées dans le Studio.** C'est la première page de
contenu — hors événements — à passer ses visuels dans Sanity. Elle réutilise
l'objet `eventImage` (fichier, texte alternatif, crédit, note de droits,
personnes reconnaissables, généré par IA) et le nouvel objet `heroSlide`
(libellé + image) pour le carrousel d'en-tête.

Deux chemins de rendu coexistent, distingués par `visual.kind` :

- `image` — fichier du projet, optimisé au build par `astro:assets`, recadré par
  des positions écrites à la main. C'est le **repli**, qui répond même sans
  Sanity;
- `remote-image` — fichier du Studio servi par le CDN, recadré par le **point
  focal** posé par l'éditrice, avec vignette floue pendant le chargement.

Le repli d'un groupe est retrouvé par son ancre. Un groupe sans visuel d'aucun
côté n'est pas publié : sa carte serait un cadre vide. Les images d'en-tête, en
revanche, **ne se mélangent pas** — soit le Studio en fournit, soit les fichiers
du projet prennent le relais en entier; un carrousel moitié CDN, moitié local
n'aiderait personne à déboguer.

Une image téléversée sans texte alternatif n'est pas publiée, en plus de la
validation du Studio qui l'exige déjà.

**Les boutons mènent tous à `/contact/`.** Seul leur libellé se saisit; l'adresse
n'existe pas dans le Studio.

**Champs supprimés en migrant** : le statut éditorial `ParishLifeContentStatus`
(`to-confirm`, `temporary`, `stable-direction`) — aucun composant ne l'affichait,
et ce qui reste à confirmer se dit déjà dans le texte, là où la visiteuse le lit
— et `order`, remplacé par l'ordre du tableau. Le tri correspondant a disparu du
getter; le filtre sur `active` reste.

Le code Astro conserve la grille alternée, les breakpoints, la palette, les
reveals, la rotation et la lentille du hero. Le CMS ne peut injecter ni durée,
ni masque, ni CSS, ni JavaScript.

```text
Sanity parishLifePage
  → PARISH_LIFE_PAGE_QUERY
  → normalizeSanityParishLifePage (repli local, images par ancre, CTA dérivé)
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

## `thriftStore` et `thriftStorePage`

Migrés. La friperie est coupée en deux selon la règle de découpage.

**`thriftStore`, donnée partagée** — nom, heures d'ouverture, emplacement,
téléphone. Ce sont des faits vrais indépendamment de la page, et `/contact`
pourra les afficher sans lire un document de page. Le téléphone de la friperie
est une ligne distincte de celle du secrétariat : il ne se lit surtout pas dans
`siteSettings`.

**`thriftStorePage`, document de page** — hero (textes), présentation
(paragraphes, encadré « À noter », bouton), sections, textes de la galerie, bloc
de clôture avec ses deux boutons.

Deux choix retenus :

- **Un champ vide n'est pas publié.** Le couple `{value, confirmed}` du contrat
  local a disparu : un renseignement non confirmé n'a de toute façon aucune
  valeur à afficher, et la case doublait l'information portée par l'absence.
- **Aucun champ qui ne sort nulle part.** `donationConditions`, `pricingNote` et
  `specialSalesNote` existaient dans le contrat sans qu'aucun composant les
  rende — `pricingNote` répétait mot pour mot `introduction.priceNotice`. Ils
  ont été retirés plutôt que recréés dans le Studio. Les conditions de dons
  restent non publiées, et la page continue d'inviter à téléphoner avant
  d'apporter des articles (`tests/thrift-store.test.mjs`).

Les images du hero et les cadres de la galerie **ne sont pas migrés** : ils
suivront le ticket qui déplacera tous les visuels de page ensemble. La paroisse
n'a encore aucune photographie du local (`docs/THRIFT_STORE_PHOTO_SHOT_LIST.md`),
donc un tableau d'images dans le Studio n'aurait aucun utilisateur.

Les ventes spéciales possédant une date restent des documents `parishEvent`.

```text
Sanity thriftStorePage + thriftStore
  → GROQ (deux requêtes, aucune référence entre les documents)
  → normalisation
  → ThriftStorePageData
  → composants Astro existants
  → HTML statique
```

Sanity ne contrôlera pas le masque, le suivi du pointeur, le JavaScript, les
timings, le SVG `AnimatedClothingRack`, les couleurs, les breakpoints ou les
tokens de mouvement.

## `servicesPage` — migré

Document unique, sans jumeau « Données partagées ». Les tarifs et les délais
sont des faits, mais aucune autre page ne les lit : un document partagé sans
second consommateur serait une abstraction vide. La règle de découpage ne
s’applique qu’à partir du deuxième consommateur réel.

Le document contient :

- `hero` — surtitre, titre, introduction;
- `notice` — titre, message, mention de révision. **Seul endroit de la page où
  une date de révision est publiée**;
- `chapters[]` (objet `serviceChapter`) — ancre, surtitre, titre, introduction,
  traitement visuel dans une liste fermée (`ivory`, `paper`, `charcoal`,
  `burgundy`), et ses services;
- `services[]` (objet `parishService`) — ancre, titre, résumé, `active`,
  `details[]` (objet `serviceDetail` : intitulé et valeur), `steps[]`, `note`;
- `paymentMethods` — titre, description, modes acceptés;
- `finalCta` — titre et description seulement.

**Les ancres sont saisies, pas dérivées de `_key`.** Ce sont des fragments
d’adresse publique : le sommaire de la page s’en sert, et `/location-de-salle/`
redirige vers `/nos-services/#location-de-salle`. Une ancre qui bouge casse un
lien déjà partagé. C’est l’inverse du cas `thriftStorePage`, où la `_key` a
justement servi à prouver le basculement.

**Trois choses ne sont pas dans le Studio :**

- **le bouton d’appel** — les neuf services renvoient tous au téléphone du
  secrétariat, lu dans `siteSettings`. Un champ d’adresse dupliquerait la donnée
  et permettrait de saisir un lien arbitraire;
- **les cinq images** — trois du hero, deux de chapitres — qui restent des
  fichiers du projet avec leur cadrage et leur crédit, jusqu’au ticket des
  visuels de page. Elles se rattachent par l’ancre du chapitre;
- **l’ordre** — celui du tableau fait foi, dans le Studio comme dans le repli.

**Champs du contrat local supprimés en migrant**, parce qu’aucun composant ne
les rendait : le bloc de métadonnées de révision entier (`sourceContext`,
`lastReviewedAt`, `effectiveYear`, `effectivePeriod`, `requiresPeriodicReview`),
le booléen `confirmed` des renseignements — toujours vrai —, la catégorie de
service et le champ `order`. Même règle que pour la friperie : ne pas recréer
dans le Studio un formulaire sans effet.

Une célébration spéciale datée reste un `parishEvent`; elle n’est pas dupliquée
dans `servicesPage`. La disponibilité d’une salle n’est jamais calculée par le
CMS et aucune réservation automatique n’est créée.

```text
Sanity servicesPage + siteSettings
  → SERVICES_PAGE_QUERY
  → normalizeSanityServicesPage (repli local, images locales, CTA dérivé)
  → ServicesPageData
  → composants Astro existants
  → HTML statique
```

Sanity ne contrôle ni la lentille du hero, ni sa rotation, ni les formes CSS,
ni la navigation, ni les redirections.

## `firstVisitPage` — migré

Document unique. Étapes, moments de la célébration et questions fréquentes n’ont
de sens que sur cette page et n’ont pas de cycle de vie propre : listes
embarquées, comme aux services et à la vie paroissiale.

Le document contient :

- `seo` — titre et description;
- `hero` — surtitre, titre, introduction;
- `preparation` — surtitre, titre, introduction, `steps[]` (objet `visitStep` :
  numéro affiché, titre, description, note);
- `expectations` — surtitre, titre, introduction, `items[]` (objet
  `expectationItem` : titre, description);
- `practicalInformation` — surtitre, titre, `items[]` (objet
  `practicalInfoItem`), libellé et destination des deux boutons, image et
  légende;
- `faq` — titre et `items[]` (objet `firstVisitFaqItem`).

**Aucun identifiant n’est saisi.** Contrairement aux services, rien ici n’est un
fragment d’adresse publique : aucune ancre, aucun lien entrant. Les `_key` du
tableau font office d’identifiants, comme pour `massSchedule`.

### La ligne d’informations pratiques désigne sa source

C’est la particularité de cette page, et l’application la plus nette de la règle
de découpage. Une adresse, un téléphone, un stationnement, un accès sont des
faits sur le lieu, vrais indépendamment de la page. La ligne ne les recopie donc
pas : son champ `source` désigne où le site va lire la valeur.

| `source`        | Valeur lue                              |
| --------------- | --------------------------------------- |
| `address`       | `siteSettings.address.formatted`        |
| `phone`         | `siteSettings.phone.display`            |
| `parking`       | `siteSettings.parkingInformation`       |
| `accessibility` | `siteSettings.accessibilityInformation` |
| `pageText`      | le champ `value` de la ligne            |
| `internalLink`  | `linkLabel` + destination fermée        |

La résolution vit dans `resolvePracticalInformation()`, appelée par le getter —
pas dans le normalizer, qui ne connaît pas les coordonnées. Elle s’applique
**au repli local comme au contenu Sanity** : les deux décrivent leurs lignes de
la même façon, donc la page se comporte pareil que le CMS réponde ou non.

**Une ligne dont la source est vide n’est pas affichée.** Une paroisse qui n’a
pas confirmé ses conditions d’accès a plus à perdre à publier un libellé vide,
ou un texte entre crochets, qu’à taire la ligne le temps de vérifier. Le jour où
la valeur est saisie dans « Coordonnées de la paroisse », la ligne réapparaît
seule.

Effet de bord de la migration : l’adresse et le téléphone réels, déjà confirmés
dans `siteSettings`, remplacent les mentions `[ADRESSE À CONFIRMER]` et
`[TÉLÉPHONE À CONFIRMER]` que la page affichait aux visiteurs.

**Champs supprimés plutôt que recréés** — 0 rendu chacun, vérifié sur les cinq
composants : `FirstVisitContentStatus` et `VisitStep.status`,
`PracticalInformationItem.confirmationRequired`, et `futureSource` avec son type
`PracticalInformationSource`. Ce dernier annonçait justement la migration qui
vient d’avoir lieu. Seul `numberLabel` survit : il est rendu dans la pastille.

**Les destinations sont fermées.** Les deux boutons et les lignes `internalLink`
choisissent dans `LINK_TARGETS` (`schedule`, `contact`, `services`); une valeur
hors liste fait retomber sur le repli, jamais sur la chaîne saisie.

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
  → accueil / Contact / Footer / Nos services / Horaires / Première visite
```

`parkingInformation` et `accessibilityInformation` ont dormi dans le schéma
depuis S1-T14 sans figurer dans la projection GROQ : le champ existait, se
saisissait, et n’atteignait jamais le site. Première visite les a réveillés en
juillet 2026. C’est la répétition exacte du signal d’alarme `officeHours` —
**vérifier la projection, pas seulement le schéma**, avant de conclure qu’une
donnée partagée manque.

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

## `advertiser` et `advertisersPage` — migrés

Une **collection** et un document de page. Une fiche d’annonceur arrive, se
confirme, se retire, sans que le reste de la page bouge : c’est la définition
d’un cycle de vie propre, et donc d’une collection. C’est le seul cas, avec les
événements, où une liste ne vit pas dans son document de page.

La collection `advertiser` contient :

- `name`, `category`, `description`;
- `addressLines[]`, `phone`, `email`, `website`;
- `logo` (objet `eventImage` réutilisé);
- `status`, `order`;
- `confirmationNote` — note de révision interne.

Le document `advertisersPage` administre `hero`, `introduction` (dont la mention
de transparence), `solicitation` et `settings`.

```text
Sanity advertiser + advertisersPage + siteSettings
  → GROQ
  → normalisation + selectAdvertisers()
  → AdvertisersPageData
  → composants Astro existants
```

### Le statut est un champ, pas l’état de publication de Sanity

Un brouillon Sanity veut dire « modification en cours ». Une fiche d’annonceur à
confirmer n’est pas une modification en cours : c’est une entente dont personne
n’a encore vérifié qu’elle existe. Confondre les deux ferait disparaître une
fiche du Studio dès qu’on la corrige.

`status` vaut donc `active`, `confirmation-required`, `draft` ou `inactive`, et
**seul `active` s’affiche**. Une valeur inconnue retombe sur `draft` : ce que le
code ne comprend pas ne doit jamais ouvrir la publication.

Les quatre fiches historiques sont `active` depuis le 31 juillet 2026 : elles
figurent encore sur l’ancien site de la paroisse. Le retrait se fait dans le
Studio, en passant la fiche à « Inactif ». Voir
`docs/ADVERTISERS_CONTENT_AUDIT.md`.

Le filtrage n’est **pas** fait en GROQ. `selectAdvertisers()` décide, et il
décide aussi pour le repli local — les deux origines passent par le même code.

### Trois champs qui ne se saisissent pas deux fois

- le **lien d’appel** est reconstruit à partir des chiffres du téléphone
  affiché; un numéro qui n’a pas dix chiffres n’obtient pas de lien;
- le **`mailto:`** est reconstruit à partir de l’adresse; une valeur qui n’est
  pas une adresse n’en obtient pas;
- la **note de révision** n’est jamais projetée par la requête : elle sert la
  secrétaire dans le Studio et n’atteint pas le HTML public.

### La seule adresse de lien saisissable du site

`website` est l’exception assumée à la règle « le CMS ne fournit jamais une
adresse de lien ». L’adresse d’un annonceur est son contenu à lui, et une page
de reconnaissance sans lien vers l’annonceur n’a pas de sens. Elle reste tenue
en laisse : seuls `http` et `https` passent le normalisateur, même si le schéma
venait à perdre sa validation, et le lien sortant porte
`rel="sponsored noopener noreferrer"`.

### Champs supprimés plutôt que migrés

Comptés à 0 rendu sur les quatre composants : `featured`, `validFrom`,
`validUntil`, `lastConfirmedAt`, `images[]`, `website.label`, `slug` et le statut
de droit du média. Les dates de validité auraient de plus exigé un rebuild
nocturne pour rien : sans date réelle, le statut explicite est la seule source
de décision, ce que l’audit disait déjà.

Le `logo` est passé à Sanity, en `SanityRenderableImage` sans variante locale :
aucun logo n’existe dans le dépôt, et la paroisse pourra en téléverser un sans
changement de code. Sans logo, la fiche affiche les initiales du nom.

### Piège : un point dans l’identifiant rend le document privé

Les quatre fiches ont d’abord été écrites sous `advertiser.buffet-marina` et
consorts. Le point place le document dans un **chemin privé** : la CLI porteuse
d’un jeton les voyait, la lecture publique du build ne les voyait pas. Le site
se construisait sans erreur et sans annonceur. Identifiants repris en
`advertiser-buffet-marina`; un test interdit désormais le point.

La paroisse peut ajouter, masquer, réordonner ou mettre à jour une fiche sans
modifier le code. Le CMS ne contient jamais de contrat complet, donnée de
paiement, numéro de carte, secret, mot de passe, HTML arbitraire, CSS ou
JavaScript. Il ne peut pas publier un visuel sans alt ni retirer la mention de
transparence.

## `contactPage` — migré

Document unique. C'est la page où la **règle de découpage rend le plus** : le
document ne porte que des textes, et **aucune coordonnée**.

Adresse, téléphone, courriel, heures du secrétariat, stationnement,
accessibilité, carte et lien d'itinéraire viennent tous de `siteSettings`. Ce
sont des faits sur la paroisse, vrais indépendamment de la page, lus par
plusieurs pages. Les recopier ici créerait une deuxième vérité à corriger.

Le document contient :

- `hero` — surtitre, titre, introduction;
- `officeHours` — titre du bloc et note. **L'horaire lui-même n'y est pas**;
- `methodsFallback` — titre et description affichés quand une coordonnée
  publique manque encore;
- `location` — titre, description, `extraNotes[]`;
- `form` — titre, introduction, `reasons[]` (objet `contactReason`), avis
  « envoi non activé », libellé du bouton, message de vérification, mention de
  confidentialité.

### La structure du formulaire n'est pas du contenu

Noms de champs, types, longueurs minimales et maximales, expressions de
validation, valeurs d'`autocomplete`, messages d'erreur : **rien de tout cela ne
passe par le CMS**. Le script de validation les lit, et une expression mal
saisie casserait la page sans que personne le voie. Un test interdit à la
requête comme au schéma de porter ces champs.

Seule la **liste des motifs** se saisit, parce qu'elle est éditoriale : elle
suit les services offerts par la paroisse. Le libellé se lit, la clé sert au
routage futur; renommer un libellé ne doit pas changer un routage, d'où la clé
saisie plutôt que dérivée. Une liste vide laisse les motifs du code en place.

### Ce que la migration a réparé

Même classe de défaut qu'à Première visite, et trouvée pareillement : des faits
confirmés dans `siteSettings` que la page ne lisait pas.

- les **heures du secrétariat** n'étaient jamais affichées, et la page disait au
  visiteur qu'elles étaient « en cours de validation »;
- le **stationnement** et l'**accessibilité** étaient absents des notes d'accès,
  que la description annonçait pourtant comme « à confirmer ».

Les trois valeurs existaient depuis le 31 juillet 2026. La page les affiche
maintenant, et le bloc des heures disparaît tout seul si l'horaire est effacé —
un titre saisi dans le Studio ne le fait pas apparaître seul, il n'aurait rien à
montrer.

Le **courriel** suit la même mécanique : sa carte n'existe pas tant qu'il n'est
pas confirmé et rendu public, et elle apparaîtra seule le jour où il le sera.

### Champs supprimés plutôt que migrés

Comptés à 0 rendu sur les six composants : `ContactContentStatus` en entier,
`status`, `active` et `order` sur les coordonnées, `active` et `status` sur les
heures du secrétariat, `status` sur le bloc de localisation. Les coordonnées ne
sont plus une liste éditoriale à trier et filtrer : elles sont dérivées d'une
source unique et apparaissent quand la valeur existe. Le tri et le filtre du
getter ont disparu avec les champs.

```text
Sanity contactPage + siteSettings
  → GROQ
  → normalizeSanityContactPage (textes seulement)
  → ContactPageData
  → composants Astro existants
```

Le `seo`, `noindex` compris, et l'adresse de la politique de confidentialité
restent des décisions de code : retirer `noindex` suppose qu'un système d'envoi
et une politique approuvée existent, ce qui n'est pas le cas.
