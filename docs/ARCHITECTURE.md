# Architecture

## Objectif et état

Cette fondation transforme le prototype visuel Figma Make en projet de production maintenable. `S1-T01` livre le système de design et le layout global; `S1-T02` migre la première page publique complète, l’accueil.

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

Sur l’accueil, deux scripts natifs et locaux suffisent : l’annonce peut être masquée, et le hero change de photographie avec un temporisateur remis à zéro après une action manuelle. La préférence de réduction des mouvements désactive rotation et zoom. Aucun état applicatif partagé n’est introduit.

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

## Limites actuelles

- les routes publiques autres que l’accueil restent des placeholders techniques;
- l’identité « Paroisse Saint-René-Goupil » est confirmée, mais les coordonnées, horaires et contenus éditoriaux définitifs ne le sont pas;
- aucun CMS, formulaire, backend ou déploiement n’est configuré;
- `sharp` est le seul package ajouté dans `S1-T02`, pour le traitement d’images Astro au build;
- les contrôles automatisés d’interaction et de parcours seront ajoutés avec de vrais parcours critiques, pas pour ce seul ticket.
