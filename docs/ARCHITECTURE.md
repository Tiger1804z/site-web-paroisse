# Architecture

## Objectif et état

Cette fondation transforme le prototype visuel Figma Make en projet de production maintenable. `S1-T01` livre le système de design et le layout global; `S1-T02` migre la première page publique complète, l’accueil.

`S1-T02.5` ajoute une architecture de contenu issue de l’audit du site existant.
Elle ne modifie aucune route ni aucun composant public. Le sitemap proposé dans
[`SITEMAP.md`](./SITEMAP.md) doit être validé avant toute adaptation de la
navigation.

`S1-T03` migre `/horaires/` et introduit le premier flux de contenu local typé
préparé pour une source CMS :

```text
src/data/schedules.ts
    ↓
src/lib/content/getSchedulePageData.ts
    ↓
frontmatter de src/pages/horaires.astro
    ↓
composants Astro typés
    ↓
HTML statique
```

`S1-T04` applique la même frontière à la page narrative
`/notre-paroisse/` :

```text
src/data/about.ts
    ↓
src/lib/content/getAboutPageData.ts
    ↓
frontmatter de src/pages/notre-paroisse.astro
    ↓
composants Astro typés avec AboutPageData
    ↓
HTML statique
```

Le contrat conserve aussi les statuts éditoriaux des faits historiques. Une
date issue de l’ancien site ou une consécration lue sur une photographie ne
devient donc pas implicitement un fait confirmé lors d’un futur import CMS.

`S1-T05` applique cette frontière aux informations de première visite :

```text
src/data/firstVisit.ts
    ↓
src/lib/content/getFirstVisitPageData.ts
    ↓
frontmatter de src/pages/premiere-visite.astro
    ↓
composants Astro typés avec FirstVisitPageData
    ↓
HTML statique
```

Le contrat identifie aussi la future source de chaque information pratique.
L’adresse et le téléphone relèveront de `siteSettings`; les étapes, la FAQ et
les indications propres à la visite relèveront de `firstVisitPage`.

`S1-T06` applique la même frontière à une page d’aperçu relationnelle :

```text
src/data/sacraments.ts
    ↓
src/lib/content/getSacramentsPageData.ts
    ↓
frontmatter de src/pages/sacrements.astro
    ↓
composants Astro typés avec SacramentsPageData
    ↓
HTML statique
```

Les slugs sont préparés dans le contrat, mais aucune route détaillée n’est
générée. Un futur `src/pages/sacrements/[slug].astro` utilisera
`getStaticPaths()` seulement après validation des contenus et du modèle CMS.

## Pourquoi Astro

Le site paroissial sera principalement composé de contenu éditorial, d’horaires, d’événements et de renseignements pratiques. Astro produit du HTML statique par défaut, limite le JavaScript envoyé au navigateur et fournit un routage fondé sur les fichiers. Ce modèle favorise la performance, le référencement, la résilience et l’accessibilité.

La sortie `static` est déclarée explicitement dans `astro.config.mjs`. Aucun adaptateur serveur n’est installé.

## Pourquoi React reste disponible

React reste disponible pour deux cas précis :

1. migrer progressivement un composant Figma complexe lorsque sa réécriture immédiate n’apporte pas de bénéfice;
2. hydrater un élément qui nécessite réellement un état côté navigateur.

Les pages, le layout et la navigation restent en Astro lorsque React n’est pas nécessaire. Le composant `ReactIntegrationCheck.tsx` est seulement une preuve technique et non un modèle d’architecture pour toutes les sections. Le header et le menu mobile de `S1-T01` utilisent du JavaScript natif : l’interaction est locale, courte et ne justifie pas une hydratation React.

## Pourquoi le prototype Figma n’est pas l’application de production

Le prototype affiche toutes les « pages » depuis un état React central. Il ne fournit ni URL distincte, ni navigation native, ni génération statique par route. Sa configuration Vite contient des plugins de prévisualisation, d’overlay et de kit propres à Figma Make.

Ces éléments sont utiles dans l’environnement de création, mais inutiles et risqués en production. L’export est donc archivé sous `reference/` et migré par petits lots contrôlés.

## Organisation des routes

Chaque fichier de `src/pages/` devient une route :

- `src/pages/index.astro` → `/`;
- `src/pages/horaires.astro` → `/horaires/`;
- `src/pages/notre-paroisse.astro` → `/notre-paroisse/`;
- `src/pages/premiere-visite.astro` → `/premiere-visite/`;
- `src/pages/sacrements.astro` → `/sacrements/`;
- `src/pages/friperie.astro` → `/friperie/`;
- `src/pages/verification.astro` → `/verification`;
- `src/pages/404.astro` → page d’erreur statique.
- `src/pages/[slug].astro` génère les placeholders temporaires des destinations de navigation avec `getStaticPaths()`.

Les destinations sont centralisées dans `src/lib/navigation.ts`. Elles emploient des URL françaises, stables et lisibles; aucune navigation n’utilise un état React simulé. Chaque placeholder sera remplacé par un fichier de page dédié dans son ticket. React Router ne sera pas ajouté.

L’accueil assemble ses sections depuis `src/components/sections/home/`. Ce découpage suit les grandes compositions de `Home.tsx` sans transformer les petits fragments éditoriaux en abstractions inutiles. Les données restent statiques et explicitement temporaires jusqu’à l’arrivée du CMS.

La route `/verification/` est interne, marquée `noindex` et absente de la navigation publique. Elle rassemble les couleurs, la typographie, les contrôles, les conteneurs et les états globaux nécessaires aux revues visuelles. Ses paramètres `preview`, `header`, `menu` et `focus` rendent les états de capture déterministes; ils n’ont aucun effet sur les autres routes. `noindex` n’est pas un contrôle d’accès : cette route ne doit pas être déployée avec sa photographie tant que les droits ne sont pas confirmés.

## Organisation des composants

- `components/layout/` : éléments globaux comme le header et le footer;
- `components/sections/` : grandes sections propres à une ou plusieurs pages;
- `components/ui/` : petits composants réutilisables et accessibles;
- `layouts/` : structure de document, métadonnées et import global des styles;
- `lib/` : fonctions pures et adaptateurs futurs;
- `types/` : types partagés;
- `assets/` : actifs traités ou référencés par Astro.
- `data/` : sources locales temporaires conformes aux contrats internes;
- `lib/content/` : fonctions d’accès et futurs normaliseurs de contenu;
- `types/schedule.ts` : contrat interne indépendant de la source CMS.
- `types/about.ts` : contrat narratif, images et statuts historiques
  indépendants de la source CMS.
- `types/firstVisit.ts` : contrat du parcours, des informations pratiques, de
  la FAQ et de leur future responsabilité éditoriale.
- `types/sacraments.ts` : contrat de la page d’aperçu, des slugs futurs, des
  sacrements et des services à confirmer.

### Composants livrés par S1-T01

- `layouts/BaseLayout.astro` : document français, métadonnées minimales, `noindex`, skip link, header, contenu principal et footer;
- `components/layout/Header.astro` : états clair/transparent/défilé, navigation desktop et menu mobile accessible;
- `components/layout/Footer.astro` : composition éditoriale responsive et actions rapides mobiles;
- `components/ui/` : `Container`, `Button`, `TextLink`, `Eyebrow`, `SectionHeading`, `Divider` et `IconButton`;
- `styles/global.css` : tokens Tailwind CSS 4, primitives de layout, typographie et états partagés.

`BaseLayout` expose volontairement peu de propriétés : `title`, `description`, `pageClass`, `headerVariant`, `footerVariant` et `noIndex`. Un système SEO complet est différé jusqu’à la connaissance du domaine et des contenus officiels.

### Composants livrés par S1-T02

- `sections/home/HomeHero.astro` : hero photographique, carte d’horaires et rotation accessible;
- `ImportantNotice.astro` et `WelcomeSection.astro` : annonce locale et composition éditoriale;
- `MassSchedulePreview.astro` et `UpcomingEvents.astro` : aperçus statiques avec placeholders;
- `ParishLifePreview.astro` et `ParishBulletin.astro` : mosaïque illustrative et feuillet sans faux téléchargement;
- `PracticalServices.astro`, `HomeGallery.astro` et `VisitSection.astro` : services, bande photographique et coordonnées temporaires;
- `lib/site.ts` : identité confirmée partagée entre le layout, le header et le footer.

Les photographies passent par `astro:assets`. `sharp` génère les variantes responsives durant le build; les fichiers source ne sont pas modifiés.

### Actifs de marque

Le flux du logo officiel sépare trois responsabilités :

```text
reference/brand/
    original approuvé et inchangé
        ↓ recadrage documenté
src/assets/brand/
    variantes importables par Astro
        ↓ astro:assets + Sharp au build
HTML et fichiers PNG hachés adaptés à l’affichage
```

Les composants importent seulement `src/assets/brand/`. Astro lit les dimensions
intrinsèques pendant le build, génère les `srcset` et réserve le ratio dans le
HTML afin de limiter le layout shift. Les sorties du logo restent en PNG sans
perte.

Les favicons suivent une autre règle : leurs noms et URL doivent rester
prévisibles pour les navigateurs. Ils sont donc placés sous `public/` et
référencés directement depuis `BaseLayout.astro`. Le détail des recadrages,
empreintes et restrictions se trouve dans
[`BRAND_ASSETS.md`](./BRAND_ASSETS.md).

### Composants livrés par S1-T03

- `sections/schedules/SchedulesHero.astro` : hero Figma avec image locale
  optimisée au build;
- `BeforeYouVisitBanner.astro` et `ScheduleNotice.astro` : prudence durable et
  changement activable;
- `RegularSchedule.astro` et `SeasonalSchedules.astro` : périodes et entrées
  typées, y compris plusieurs heures par jour;
- `SpecialCelebrations.astro` : liste et état vide;
- `ScheduleFaq.astro` : accordéon HTML natif sans JavaScript;
- `ScheduleSidebar.astro` : feuillets et secrétariat sans faux téléchargement
  ni coordonnées inventées.

La page appelle seulement `getSchedulePageData()`. Les composants ne connaissent
ni le fichier local ni le futur fournisseur CMS.

### Composants livrés par S1-T04

- `sections/about/AboutHero.astro` : hero photographique avec recadrages
  distincts et header transparent;
- `AboutIntroduction.astro` : introduction centrée et accent manuscrit;
- `ImmersiveHistoryTimeline.astro` : neuf repères historiques sémantiques,
  compositions alternées, illustrations artistiques et interlude documentaire;
- `AboutPrinciples.astro` : trois panneaux sombres fidèles à la composition
  Figma, sans mission officielle inventée;
- `ArchitectureStory.astro` : image asymétrique, récit et caractéristiques;
- `ArchitectsSection.astro` : profils typés sans portraits ou biographies
  externes;
- `AboutClosing.astro` : invitation finale et vraies routes Astro.

La page appelle uniquement `getAboutPageData()`. Les composants ignorent le
fichier local, GROQ et la future structure brute de Sanity.

### Composants livrés par S1-T05

- `sections/first-visit/FirstVisitHero.astro` : hero charbon fidèle au fichier
  Figma réel;
- `VisitPreparation.astro` : six étapes typées dans une grille 1/2/3 colonnes;
- `WhatToExpect.astro` : déroulement général en quatre panneaux;
- `PracticalInformation.astro` : liste sémantique, CTA et photographie locale
  sans déduction d’accessibilité;
- `FirstVisitFaq.astro` : accordéons `details/summary` sans JavaScript client.

La page appelle uniquement `getFirstVisitPageData()`. Les composants ne
connaissent ni la source locale, ni GROQ, ni les futurs documents
`firstVisitPage` et `siteSettings`.

### Composants livrés par S1-T06

- `sections/sacraments/SacramentsHero.astro` : hero photographique prune;
- `SacramentsNotice.astro` : prudence opérationnelle et CTA Contact;
- `SacramentsExplorer.astro` : onglets accessibles Baptême, Mariage et Autres
  demandes, sans React;
- `GeneralProcess.astro` : démarche en cinq repères;
- `SacramentsFaq.astro` : FAQ native `details/summary`.

La page appelle uniquement `getSacramentsPageData()`. Les composants ignorent
la source locale, GROQ et les futurs documents `sacramentsPage`, `sacrament` et
`siteSettings`.

## Stratégie CSS et fidélité

Les valeurs répétées et structurantes sont des tokens sémantiques dans `global.css`; les dimensions propres à un seul composant restent près de ce composant. Cette séparation évite à la fois les valeurs magiques dispersées et une couche de tokens artificielle.

Le CSS reprend les valeurs observables de Figma : conteneur de 1280 px, gutters 20/40/80 px, sections 96/140 px, header 64/80 px, rayons de 2 px et transitions sobres. La palette premium documentée remplace seule les couleurs beige originales. La navigation desktop commence à 1312 px, car le seuil `lg` de l’export provoquait un débordement mesurable et 1280 px restait trop serré avec tous les liens et CTA.

## Interactivité globale

Le script du header est inclus par Astro et initialisé une fois par instance. Il gère :

1. le passage de transparent à clair après 60 px;
2. l’ouverture et la fermeture du menu mobile;
3. Échap, le piège de focus, le retour du focus et l’isolation `inert` du contenu;
4. le verrouillage du défilement d’arrière-plan;
5. le menu desktop « Informations » fondé sur `<details>`;
6. la fermeture au changement de largeur.

Le balisage et les liens restent utilisables sans routeur client. Aucun état global React n’est réintroduit.

Sur l’accueil, deux scripts natifs et locaux suffisent : l’annonce peut être masquée, et le hero change de photographie avec un temporisateur remis à zéro après une action manuelle. Le hero branche aussi le contrôleur visuel partagé `src/scripts/organic-hero-lens.ts`; sa lentille révèle toujours la prochaine photographie de la boucle. La préférence de réduction des mouvements désactive rotation, zoom et lentille. Aucun état applicatif partagé n’est introduit.

## Migration progressive

Un composant du prototype est d’abord évalué :

1. conserver son intention visuelle et son contenu temporaire;
2. remplacer les boutons de navigation simulée par des liens Astro;
3. convertir le HTML en structure sémantique;
4. vérifier clavier, focus, libellés et contraste;
5. utiliser Astro par défaut;
6. conserver React seulement si une interaction le justifie;
7. relier les données au CMS lors d’un ticket ultérieur.

Le header et le footer constituent maintenant les références globales. Lors de chaque ticket de page, seuls leur état initial, la route active et le contexte photographique seront validés; leur structure ne doit pas être dupliquée.

## Ajout futur d’un CMS

Le CMS sera intégré comme source de données, pas comme moteur de routage côté client. Astro pourra charger les contenus pendant la construction statique et générer les routes nécessaires. Un mode hybride ou une reconstruction déclenchée pourra être évalué lorsque les besoins éditoriaux, la fréquence de publication et l’hébergeur seront connus.

Aucun package CMS n’est installé pendant l’initialisation.

La page Horaires démontre cette frontière avant l’installation du CMS. Une
future implémentation Sanity de `getSchedulePageData()` exécutera une requête
GROQ, transmettra sa réponse brute à un normaliseur, puis retournera toujours
`SchedulePageData`. Une publication Sanity devra déclencher un nouveau build
pour modifier le HTML statique déployé. Le détail pédagogique est consigné dans
[`ASTRO_SANITY_SCHEDULES_PREPARATION.md`](./ASTRO_SANITY_SCHEDULES_PREPARATION.md).

La même stratégie est décrite pour la page narrative dans
[`ASTRO_SANITY_ABOUT_PREPARATION.md`](./ASTRO_SANITY_ABOUT_PREPARATION.md).
Une future normalisation convertira les documents, objets, références, Portable
Text et images Sanity vers `AboutPageData`.

La préparation de Première visite est détaillée dans
[`ASTRO_SANITY_FIRST_VISIT_PREPARATION.md`](./ASTRO_SANITY_FIRST_VISIT_PREPARATION.md).
Le normaliseur futur assemblera le document de page et les réglages globaux,
puis retournera toujours `FirstVisitPageData`.

La page Sacrements et services suit la même frontière, documentée dans
[`ASTRO_SANITY_SACRAMENTS_PREPARATION.md`](./ASTRO_SANITY_SACRAMENTS_PREPARATION.md).
Le futur normaliseur résoudra les références `sacrament`, contrôlera les slugs
et retournera `SacramentsPageData`. Les pages détaillées seront générées plus
tard avec `getStaticPaths()`.

### Architecture du contenu

Les sources sont hiérarchisées ainsi :

1. validation datée de la paroisse;
2. documents officiels approuvés;
3. inventaire et audit du site existant;
4. notes extraites des photographies;
5. export Figma comme référence de structure et de contenu temporaire.

Une information précise trouvée sur l’ancien site ne monte pas automatiquement
au premier niveau. Les horaires, tarifs, capacités, événements, inscriptions,
personnes, coordonnées personnelles et partenaires exigent toujours une
confirmation.

Le futur CMS devra séparer :

- contenu durable : identité, histoire validée, mission et présentation;
- contenu opérationnel : coordonnées, procédures, équipements et politiques;
- contenu temporel : horaires saisonniers, événements, pèlerinages, campagnes,
  fermetures et annonces;
- contenu relationnel : personnes, groupes, partenaires et annonceurs;
- documents : feuillets et formulaires approuvés.

Les modèles `Event`, `Pilgrimage`, `CatechesisRegistration` et `Advertiser` sont
décrits dans `SITEMAP.md`. Ils ne sont pas encore implémentés. La disponibilité
d’une salle restera vérifiée manuellement; un futur formulaire exprimera une
demande, jamais une réservation confirmée.

## Architecture du mouvement

Les pages Astro restent statiques : les composants de mouvement génèrent du
HTML, du SVG et du CSS au build. Seules les pages pilotes chargent
`MotionController.astro`, qui importe le petit module
`src/scripts/motion.ts`.

Le module centralise `IntersectionObserver` pour éviter un listener scroll et
des initialisations concurrentes. Les composants restent visibles sans
JavaScript. Les effets continus sont exécutés en CSS; seule la parallaxe locale
du vitrail utilise un `requestAnimationFrame` ponctuel.

`LivingStainedGlass.astro` appartient au code de présentation et non au modèle
de contenu. Sanity pourra modifier le texte voisin, mais ne pilotera pas les
fragments SVG ou leurs animations. L’architecture et les contraintes sont
documentées dans [`MOTION_SYSTEM.md`](./MOTION_SYSTEM.md).

La chronologie de Notre paroisse réutilise les tokens et les principes
d’amélioration progressive, mais possède un initialiseur ciblé :
`src/scripts/history-timeline.ts`. Trois observateurs lisent le même
déclencheur de chapitre : la ligne progresse à 78 % du viewport, le repère et
la période s’activent à 70 %, puis l’image et le texte se révèlent à 62 %. Cette
responsabilité spécialisée ne se superpose pas aux révélations génériques et
n’écoute jamais l’événement `scroll`.

Le rendu reste visible sans JavaScript. Un marqueur inline pré-paint ne prépare
l’état masqué que lorsque `IntersectionObserver` existe et que reduced motion
n’est pas demandé. Un garde-fou retire ce marqueur si l’initialiseur ne prend
pas le relais. Toutes les images restent dans leur article.

Le contrat `HistoryTimelineContent` sépare les dates, textes, images, types de
source et statuts éditoriaux du comportement visuel. Sanity pourra remplacer la
source locale; Astro conservera la grille alternée, les transitions, la ligne
et les breakpoints. Voir
[`IMMERSIVE_HISTORY_TIMELINE.md`](./IMMERSIVE_HISTORY_TIMELINE.md).

## Architecture Événements — S1-T07 en cours

La route `/evenements/` possède maintenant une première implémentation
volontairement incomplète et `noindex`. Son contenu suit la frontière :

```text
src/data/events.ts
  → src/lib/content/getEventsPageData.ts
  → frontmatter Astro
  → composants de sections typés
  → HTML statique
```

`EventVisual` est une union discriminée qui accepte une image Astro ou l’une
des œuvres SVG contrôlées par le code (`clothing-rack`, `community-meal` et
`generations-chain`). Sanity pourra plus tard fournir un
`visualType`; le normalisateur le transformera en cette union. Le CMS ne
stockera ni SVG, ni CSS, ni animation.

Les catégories du lot 1 ne sont pas des événements datés. Un second contrat
`ParishEvent` décrit maintenant les occurrences datées. Une source unique
alimente les événements à venir, les archives et « Prochaines activités » sur
l’accueil :

```text
src/data/parish-events.ts
  → src/lib/content/getParishEvents.ts
  → statut temporel, visibilité et tri
  → composants Astro typés de /evenements/ et /
  → HTML statique
```

Le frontmatter calcule les listes pendant le build. Les composants ne
connaissent ni l’heure courante, ni la source locale, ni Sanity. Le statut
temporel n’est jamais enregistré : il est dérivé des dates ISO avec
`America/Toronto`. Un futur webhook et un rebuild quotidien permettront au
HTML déployé de suivre le passage du temps.

La chaîne intergénérationnelle réutilise l’`IntersectionObserver` global et
n’ajoute ni listener `scroll`, ni boucle d’animation JavaScript. Voir
[`EVENTS_VISUALS_BATCH_1.md`](./EVENTS_VISUALS_BATCH_1.md) et
[`EVENTS_ARCHITECTURE.md`](./EVENTS_ARCHITECTURE.md).

## Architecture Vie paroissiale — S1-T08

La page suit la même frontière de contenu que les migrations précédentes :

```text
src/data/parishLife.ts
  → src/lib/content/getParishLifePageData.ts
  → frontmatter de src/pages/vie-paroissiale.astro
  → composants Astro typés
  → HTML statique
```

`ParishLifeFeature` représente un groupe ou une porte d'entrée éditoriale
durable. Il ne représente jamais une occurrence de calendrier. `ParishEvent`
reste le seul contrat des événements datés et n'est ni importé ni recopié par
la page Vie paroissiale.

Le getter filtre les chapitres actifs et applique leur ordre pendant le build.
Les composants reçoivent uniquement `ParishLifePageData`; ils ne connaissent
ni le fichier local, ni GROQ, ni Sanity. Le futur branchement remplacera la
source du getter par une requête et une normalisation sans modifier le
frontmatter ou la composition visuelle.

Les quatre groupes viennent de Figma et de l'inventaire interne, mais leur
activité actuelle reste à confirmer. Le statut et les formulations prudentes
sont conservés dans la source de contenu; les fréquences, responsables et
coordonnées fictives de la maquette ne sont pas repris.

## Architecture Friperie et report des Feuillets — S1-T10

La route `/friperie/` remplace son entrée dans le placeholder dynamique. Elle
reste statique, en Astro et `noindex` :

```text
src/data/thriftStore.ts
  → src/lib/content/getThriftStorePageData.ts
  → frontmatter de src/pages/friperie.astro
  → composants Astro typés avec ThriftStorePageData
  → HTML statique
```

Le contrat distingue les images confirmées, temporaires, placeholders et aux
droits non vérifiés. Les horaires, l'emplacement, les conditions de don et les
coordonnées responsables portent `confirmed: false`; les composants ne les
affichent pas. Le getter filtre et ordonne les sections actives pendant le
build. Aucun composant n'importe directement les données métier.

Le hero est le seul composant doté d'un script propre à la page. Il utilise une
image principale et quatre couches optimisées par `astro:assets`, un masque
SVG organique et le contrôleur partagé `src/scripts/organic-hero-lens.ts`. Ce
contrôleur maintient un seul rAF par instance et sert aussi le hero d'accueil,
sans coupler les données des deux pages. Il n'ajoute ni React, ni Canvas, ni
WebGL, ni dépendance. `AnimatedClothingRack` est réutilisé sans copier son SVG,
son CSS ou sa logique.

Les cadres de galerie sont des placeholders graphiques; ils ne simulent pas un
local photographique. La substitution des images se fait dans
`src/data/thriftStore.ts`. Le futur CMS pourra remplacer la source du getter,
mais ne pilotera pas la lentille, le SVG, les animations ou le responsive.

La source canonique des destinations d'information reste
`src/lib/navigation.ts`. `informationRouteDefinitions` conserve la définition
de Feuillets avec `active: false`; la liste filtrée alimente le desktop, le
mobile et le footer. L'accueil et Horaires interrogent le même état avant de
rendre leurs CTA, ce qui évite une seconde liste de navigation.

`/feuillets-paroissiaux/` reste générée par `src/pages/[slug].astro`, répond
comme placeholder complet et porte `noindex`. Aucun PDF n'est disponible.
L'archive est bloquée et différée jusqu'à confirmation avec la secrétaire le
10 août 2026 ou après son retour : décision de publier, vrais PDF, dates,
droits, politique d'archives et responsabilité des mises à jour.

S1-T09 Contact n'appartient pas à cette branche. Sur `staging`, `/contact/`
reste le placeholder `noindex`; le travail Contact, SMTP, API de courriel et
fonction serverless demeure en pause sur
`feature/s1-t09-contact-page-1to1`.

## Limites actuelles

- la route Événements expose ses catégories et une première architecture
  d’événements datés, mais reste `noindex` jusqu’à la migration Figma complète;
  Friperie est migrée mais reste `noindex` jusqu'au remplacement des photos et
  à la confirmation de ses informations pratiques; les autres routes publiques
  non migrées restent des placeholders techniques;
- Feuillets est un placeholder différé, non promu dans la navigation publique;
- l’identité « Paroisse Saint-René-Goupil » est confirmée, mais les coordonnées, horaires et contenus éditoriaux définitifs ne le sont pas;
- le sitemap consolidé est une proposition en attente de validation;
- les valeurs extraites du site existant sont inventoriées, mais non publiables sans le statut de confirmation approprié;
- aucun CMS, formulaire, backend ou déploiement n’est configuré;
- `sharp` est le seul package ajouté dans `S1-T02`, pour le traitement d’images Astro au build;
- les contrôles automatisés d’interaction et de parcours seront ajoutés avec de vrais parcours critiques, pas pour ce seul ticket.
