# Cartographie de la page d’accueil Figma

## Portée de l’audit

Cette cartographie précède l’implémentation du ticket S1-T02. La source de
vérité est `reference/figma-make-export/src/pages/Home.tsx`, complétée par
`App.tsx`, `index.css` et les sept photographies importées par la page.

L’export place toute la page dans un seul composant React. La migration Astro
conserve l’ordre, les compositions, les proportions et les interactions
visuelles, mais remplace le faux routage React par des liens Astro, applique la
palette premium de production et corrige les problèmes d’accessibilité.

## Sections

| Section                 | Source Figma           | Structure observée                                                                                                                                                                                                                        | Images                                                                                                                 | Composants Astro cibles     | Responsive                                                                                                                               | Notes                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1. Hero immersif        | `Home.tsx`, section 1  | Plein écran; couche média absolue; overlay directionnel; trois filets verticaux; contenu de 680 px dans un conteneur de 1280 px; titre 52/72/88 px; deux CTA; carte d’horaires de 260 px en bas à droite; indicateur de défilement centré | `autel-decor-rouge-01.jpg`, puis `interieur-eglise-decor-violet-01.jpg` et `autel-fleurs-blanches-01.jpg`              | `HomeHero.astro`            | `min-height: 100svh`; gouttières 20/40/80 px; recadrages distincts mobile/desktop; carte masquée sous 768 px; CTA avec retour à la ligne | Divergence volontaire demandée après l’audit: rotation de trois images sans personne, toutes centrées sur le crucifix, le puits de lumière et l’autel. S1-T11 harmonise leur chaleur et leur contraste, ralentit la cadence à 7,6 s avec un fondu de 1,25 s, limite le zoom à 1,022 et remplace la carte claire par une surface bourgogne. La première image reste prioritaire. Header transparent. |
| 2. Annonce importante   | `Home.tsx`, section 2  | Bandeau papier; bordure dorée fine; contenu horizontal; point décoratif; libellé, message, lien et fermeture                                                                                                                              | Aucune                                                                                                                 | `ImportantNotice.astro`     | Empilement lisible sur petit écran; point masqué sous 640 px                                                                             | L’état React `alertVisible` devient un masquage local en JavaScript natif. L’annonce réapparaît au rechargement; aucun CMS.                                                                                                                                                                                                                                                                         |
| 3. Message de bienvenue | `Home.tsx`, section 3  | Fond ivoire; grille texte + collage; accent Allura; H2 40/52/60 px; texte de 580 px; bloc éditorial à filet doré; collage à deux colonnes avec une image 4:3 puis deux images 3:4                                                         | `20210326_164625_-_Copy.jpg`, `20210319_184417_-_Copy.jpg`, `20210331_183200_-_Copy.jpg`                               | `WelcomeSection.astro`      | Une colonne avant 1024 px; grille `1fr 420px` ensuite; gaps 48/64 px                                                                     | Le bloc éditorial doit conserver son poids visuel sans présenter un texte temporaire comme citation officielle.                                                                                                                                                                                                                                                                                     |
| 4. Aperçu des horaires  | `Home.tsx`, section 4  | Fond charbon; filet vertical central; grille 1:1; texte et deux CTA à gauche; quatre rangées d’horaires à droite; séparateurs et état hover discret                                                                                       | Aucune                                                                                                                 | `MassSchedulePreview.astro` | Une colonne avant 1024 px; deux colonnes et gap 64 px ensuite                                                                            | Uniquement des placeholders. Depuis S1-T10, le CTA Feuillets est masqué par l'état canonique inactif; le CTA Horaires reste et la composition se referme sans trou.                                                                                                                                                                                                                                 |
| 5. Événements           | `Home.tsx`, section 5  | Fond ivoire; en-tête horizontal dès 768 px; grille `1fr 340px`; événement principal photographique 16:9 avec overlay et contenu superposé; trois événements secondaires avec vignette 80 × 80 px                                          | `20210319_165026_-_Copy.jpg`, `20210331_183200_-_Copy.jpg`, `20210312_181118_-_Copy.jpg`, `20210328_125526_-_Copy.jpg` | `UpcomingEvents.astro`      | Empilé avant 1024 px; composition asymétrique ensuite                                                                                    | Les photos sont illustratives et ne représentent pas les événements annoncés. Les descriptions accessibles doivent le préciser ou rester décoratives.                                                                                                                                                                                                                                               |
| 6. Vie paroissiale      | `Home.tsx`, section 6  | Fond papier; titre centré; quatre panneaux verticaux 3:4 avec image, overlay et texte en bas; deux colonnes mobile, quatre dès 768 px; CTA centré                                                                                         | `parish-life-marian-artwork.jpg`, œuvre illustrative                                                                   | `ParishLifePreview.astro`   | Plein cadre; liste verticale à toutes les largeurs; grille éditoriale dès 1024 px                                                        | Divergence S1-T11 demandée : arrière-plan marial, overlay charbon-bourgogne, titre plus présent et groupes en lignes éditoriales. Révélation de haut en bas par le contrôleur partagé; aucune lentille ni carrousel.                                                                                                                                                                                |
| 7. Feuillet paroissial  | `Home.tsx`, section 7  | Fond bourgogne; deux arcs décoratifs 600 × 300 et 400 × 200 px; grille 1:1; texte, encadré de feuillet, deux CTA; maquette de document 260 × 340 px avec carte décalée                                                                    | Aucune photographie                                                                                                    | `ParishBulletin.astro`      | Une colonne avant 1024 px; illustration de document masquée sous 1024 px                                                                 | Différé dans S1-T10 : aucun PDF réel. Le composant est conservé, mais la section entière n'est plus rendue tant que la route Feuillets est inactive.                                                                                                                                                                                                                                                |
| 8. Aperçu des services  | `Home.tsx`, section 8  | Fond ivoire; titre centré; deux panneaux égaux, papier puis charbon; padding 32/40 px; SVG de 48 px; quart de cercle décoratif; liens éditoriaux                                                                                          | `church-facade-editorial.jpg`                                                                                          | `PracticalServices.astro`   | Une colonne, puis texte et arche; trois volumes asymétriques dès 1200 px                                                                 | Divergence S1-T11 : Location fusionne dans `/nos-services/#location-de-salle`; la section présente cinq familles, une arche d’illustration identifiée comme Florence et un panneau Friperie. Aucun formulaire, réservation ou paiement.                                                                                                                                                             |
| 8b. Interlude spirituel | ajout S1-T11           | Passage sombre de prière et recueillement entre les services et la galerie                                                                                                                                                                | `candles-prayer.jpg`                                                                                                   | `SpiritualInterlude.astro`  | Image organique et texte empilés, deux colonnes dès 1024 px                                                                              | Nouvelle fonction claire : relier lampions, intentions et messes commémoratives à Nos services. La photographie d’illustration n’est pas présentée comme la paroisse.                                                                                                                                                                                                                               |
| 9. Galerie immersive    | `Home.tsx`, section 9  | Fond papier; titre et CTA; composition photographique centrée à cinq niveaux                                                                                                                                                              | Les six photos intérieures du prototype                                                                                | `HomeGallery.astro`         | Cinq images sur desktop; image centrale et voisines partielles sur mobile                                                                | Divergence S1-T11 demandée : carrousel manuel sans autoplay, image centrale dominante, voisines décroissantes, flèches, clavier et geste tactile. Sans JavaScript, la bande horizontale native reste disponible.                                                                                                                                                                                    |
| 10. Visite et contact   | `Home.tsx`, section 10 | Fond ivoire; titre centré; grille 1:1; quatre panneaux d’information, un panneau secrétariat sur deux colonnes et un espace carte de 420 px; CTA                                                                                          | Aucune                                                                                                                 | `VisitSection.astro`        | Une colonne avant 1024 px; sous-grille d’information à deux colonnes dès 640 px                                                          | Coordonnées et horaires explicitement en placeholders. Aucun service cartographique externe; le panneau éditorial remplace la carte interactive.                                                                                                                                                                                                                                                    |
| 11. Footer              | `App.tsx`              | Identité, navigation, coordonnées, réseaux sociaux, mentions et barre d’actions mobile                                                                                                                                                    | Aucune                                                                                                                 | `Footer.astro` existant     | Composition globale déjà migrée dans S1-T01                                                                                              | Ne modifier que l’identité confirmée si nécessaire; préserver la structure globale validée.                                                                                                                                                                                                                                                                                                         |

## Photographies utilisées par l’export

| Variable Figma | Fichier source               | Observation factuelle                                                | Emplois dans le prototype                                         |
| -------------- | ---------------------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `heroImg`      | `20210320_163052_-_Copy.jpg` | Vue large de la nef et de l’autel; une personne est visible à gauche | Hero statique et galerie dans Figma; exclue du hero de production |
| `hero2Img`     | `20210326_164625_-_Copy.jpg` | Vue large de l’autel avec décoration rouge                           | Bienvenue et vie paroissiale                                      |
| `aerialImg`    | `20210319_165026_-_Copy.jpg` | Vue frontale large de l’autel avec décoration violette               | Événement principal, vie paroissiale et galerie                   |
| `pinkImg1`     | `20210312_181118_-_Copy.jpg` | Vue verticale de l’autel sous un éclairage rose                      | Événement secondaire, vie paroissiale et galerie                  |
| `pinkImg2`     | `20210319_184417_-_Copy.jpg` | Vue verticale de l’autel sous un éclairage rose et violet            | Collage de bienvenue et galerie                                   |
| `redImg`       | `20210328_125526_-_Copy.jpg` | Détail horizontal d’une décoration rouge devant l’autel              | Événement secondaire et galerie                                   |
| `floralsImg`   | `20210331_183200_-_Copy.jpg` | Vue horizontale de l’autel avec fleurs blanches                      | Collage, événement secondaire, vie paroissiale et galerie         |

## Valeurs structurantes observées

- Sections standard: 96 px verticalement sur mobile, 140 px dès 768 px.
- Conteneur: 1280 px avec 20, 40 puis 80 px de padding horizontal.
- Breakpoints employés par l’export: 640, 768 et 1024 px.
- Typographie du hero: 52, 72 puis 88 px, interligne 1,05.
- Typographie principale de section: 40, 52 ou 60 px selon la section.
- Boutons: hauteur minimale de 48 px, angles carrés, bordures de 1 px.
- Images: `object-fit: cover`, zoom de 5 % sur 500 ou 700 ms.
- Alternance de fonds: sombre photographique, papier, ivoire, charbon,
  ivoire, papier, bourgogne, ivoire, papier, ivoire.

## Interactions à migrer

- Fermeture locale de l’annonce.
- Liens vers les véritables routes Astro.
- Hover sobre des boutons, liens, panneaux et images.
- Indicateur de défilement du hero.
- Bande de galerie à défilement horizontal natif.
- Respect de `prefers-reduced-motion`.

Le faux routeur React, les `onClick` appliqués à des éléments non interactifs et
l’animation Tailwind `bounce` continue ne sont pas repris tels quels.

## Divergences encadrées

1. La palette premium de S1-T01 remplace les anciennes valeurs beige.
2. Le nom confirmé devient « Paroisse Saint-René-Goupil ».
3. La photo hero contenant une personne est remplacée par une vue réelle neutre.
4. Les CTA sont des liens Astro sémantiques.
5. Les photos architecturales utilisées comme illustrations de groupes ou
   d’événements ne reçoivent pas un texte alternatif laissant croire qu’elles
   montrent ces activités.
6. Le faux téléchargement du feuillet devient un lien vers les feuillets.
7. La carte interactive reste un panneau éditorial sans service externe.
8. Les focus, contrôles tactiles et comportements clavier suivent WCAG AA.
9. Le hero statique devient une rotation artistique de trois images au maximum:
   première image rouge, cadence de 7,6 secondes, fondu de 1,25 seconde et zoom
   maximal de 1,022. Les indicateurs permettent une sélection manuelle et
   réinitialisent la cadence. Avec `prefers-reduced-motion`, seule la première
   image est chargée prioritairement et affichée, sans rotation ni zoom.
10. Le rythme S1-T11 s’inspire uniquement de la densité éditoriale observée sur
    le site de l’Oratoire Saint-Joseph; aucun HTML, CSS, texte, média, mouvement
    ou assemblage n’est copié.
11. Les cadres `arch`, `organic`, `landscape`, `oval` et `portrait-offset`
    forment un vocabulaire visuel contrôlé via `EditorialImageFrame.astro`.
    L’accueil n’emploie que les variantes utiles à sa narration.

## Implémentation S1-T02

Les dix sections de `Home.tsx` sont maintenant assemblées dans
`src/pages/index.astro`, dans le même ordre. Le header et le footer restent les
composants globaux de S1-T01. Les contenus non confirmés — horaires, dates,
adresse, téléphone, courriel, secrétariat et lieux — demeurent entre crochets.

### Médias de production employés

- `autel-decor-rouge-01.jpg`;
- `interieur-eglise-decor-violet-01.jpg`;
- `autel-fleurs-blanches-01.jpg`;
- `interieur-eglise-decoration-01.webp`;
- `eglise-exterieur-clochers-01.webp`;
- `croix-verre-entree-01.webp`;
- `decor-rouge-devant-autel-01.jpg`;
- `eglise-exterieur-jardin-01.webp`;
- `chemin-de-croix-01.webp`;
- `eglise-exterieur-identification-01.webp`.

Toutes proviennent de l’inventaire local. Les droits et autorisations de
publication restent à confirmer. Les vues architecturales employées pour les
événements ou groupes sont des illustrations et ne prétendent pas représenter
ces activités.

### Responsive et accessibilité

- les grilles suivent les seuils 640, 768 et 1024 px observés dans l’export;
- le hero et ses CTA se recomposent sans réduire mécaniquement le desktop;
- les cartes d’événements et de groupes conservent leurs ratios et leur ordre;
- la bande de galerie utilise un défilement horizontal natif;
- un seul `h1`, des niveaux de titre ordonnés et des liens sémantiques sont
  employés;
- les photographies informatives reçoivent un texte alternatif factuel; les
  illustrations décoratives ont un texte alternatif vide;
- les états de focus, les cibles tactiles et `prefers-reduced-motion` reprennent
  les garanties de S1-T01.

### Limites

Aucun horaire, événement, lieu ou renseignement de contact n’est présenté comme
confirmé. Aucun PDF, formulaire, calendrier, carte externe, galerie complète,
CMS ou backend n’est créé. Les autres routes restent des placeholders jusqu’à
leur ticket de migration.

## Validation visuelle et fonctionnelle

La page Astro a été comparée section par section avec `Home.tsx` et ses sept
photographies sources. Des captures locales temporaires, non suivies par Git,
ont été examinées aux références 1440, 768 et 390 px. Le comportement fluide a
également été mesuré à 1280, 1024, 430 et 360 px.

- aucun `scrollWidth` n’excède la largeur disponible;
- toutes les images terminent leur chargement après défilement;
- le hero, ses recadrages et sa carte d’horaires conservent leur hiérarchie;
- la carte d’horaires est présente dès 768 px et masquée sur téléphone,
  conformément au comportement observé;
- les grilles de bienvenue, événements, vie paroissiale, services et visite
  changent d’ordre ou de colonnes aux seuils documentés;
- le hero avance automatiquement de l’image 1 à l’image 2 après 7,6 secondes,
  accepte la sélection manuelle et synchronise ses attributs ARIA;
- la réduction des mouvements maintient l’image 1 sans rotation ni zoom;
- le menu mobile s’ouvre, verrouille l’arrière-plan, se ferme avec Échap et
  restitue le focus;
- le header transparent devient clair après défilement;
- toutes les destinations internes de l’accueil répondent en HTTP 200;
- aucune erreur console, exception JavaScript, erreur HTTP ou erreur réseau
  locale n’a été observée.

À la fin de S1-T02, aucune divergence visuelle restante n’est connue en dehors
des différences volontaires listées plus haut et des contenus non confirmés.
