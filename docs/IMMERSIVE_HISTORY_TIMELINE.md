# Chronologie immersive de l’histoire paroissiale

## Objectif

La section « Histoire de la paroisse » de `/notre-paroisse/` utilise une
expérience de _scrollytelling_ : le récit reste dans le flux normal du document,
mais le défilement détermine le chapitre mis en valeur. Chaque illustration
reste dans l’article auquel elle appartient, sur petit comme sur grand écran.

Une chronologie statique affiche tous les repères sans état actif. Une
chronologie pilotée par le défilement conserve ce même contenu sémantique, puis
ajoute une couche de présentation qui accompagne la lecture. L’animation ne
remplace jamais le récit.

## Ordre du récit

1. Avant 1959 — Un quartier en développement.
2. 23 février 1959 — Fondation de la paroisse.
3. 1960 — Achat du terrain.
4. 1959–1963 — Une paroisse sans église.
5. 1963–1964 — Construction de l’église.
6. 1964 — Une architecture unique.
7. Vers 1990 — Le bâtiment évolue.
8. 6 mai 2018 — Consécration de l’église et de l’autel.
9. Aujourd’hui — Un patrimoine vivant.

Les huit chapitres historiques utilisent des illustrations artistiques
générées. L’étape de 2018 utilise une photographie documentaire de la plaque
présente dans l’église. La distinction est visible dans la légende, les styles
et le contrat de données.

## Contenu sémantique et illustrations

Chaque chapitre est un véritable `article` dans une liste ordonnée. Sa période,
son titre, son résumé, ses paragraphes, sa provenance et ses précautions
éditoriales existent dans le HTML. L’ordre du DOM est l’ordre chronologique.

Les PNG générés contiennent également du texte dans leurs pixels. Ce texte :

- n’est ni sélectionnable ni indexable comme du HTML;
- peut devenir trop petit sur téléphone;
- ne peut pas être corrigé dans Sanity;
- ne remplace ni les titres ni les résumés sémantiques;
- peut contenir des formulations ou artefacts visuels non retenus par le récit.

La version finale idéale conservera la direction visuelle, mais utilisera huit
illustrations régénérées sans texte. Grâce au contrat actuel, leur remplacement
ne nécessitera pas de réécrire le composant.

## Flux Astro

```text
src/data/about.ts
    ↓
getAboutPageData()
    ↓
frontmatter de notre-paroisse.astro
    ↓
ImmersiveHistoryTimeline.astro
    ↓
HTML sémantique + images responsives
```

Le frontmatter récupère les données pendant le build. Astro résout les imports
d’images, génère leurs variantes et produit le HTML avant la visite. Aucun
composant React ni état client complet n’est nécessaire.

## Composant

`ImmersiveHistoryTimeline.astro` reçoit une prop
`HistoryTimelineContent`. Il ne connaît ni `about.ts`, ni GROQ, ni Sanity.

Chaque `article` contient sa propre image et son propre contenu. Sur un écran
d’au moins 1024 px, les chapitres utilisent trois colonnes :

- l’image à gauche, l’axe au centre et le texte à droite pour les étapes
  impaires;
- le texte à gauche, l’axe au centre et l’image à droite pour les étapes
  paires;
- une hauteur éditoriale ample qui laisse respirer chaque période;
- aucune image globale, superposée ou remplacée.

Le document défile naturellement. Aucun sticky, _scroll trap_ ou `scroll-snap`
obligatoire n’est utilisé. Sur tablette et mobile, le texte précède l’image dans
chaque article et l’axe reste dans une colonne étroite à gauche. Cette pile
verticale est aussi le rendu de base sans amélioration JavaScript.

## IntersectionObserver

`src/scripts/history-timeline.ts` possède une responsabilité ciblée :

1. trouver chaque chronologie et ses chapitres;
2. observer une bande au centre du viewport;
3. déterminer le chapitre dont le centre est le plus proche;
4. appliquer `data-history-active` au chapitre courant;
5. appliquer `data-history-past` aux segments déjà parcourus;
6. revenir au rendu statique en cas d’erreur ou de capacité absente.

L’observateur reçoit des événements lorsque les chapitres entrent ou quittent
la bande centrale. Il n’existe aucun listener `scroll` exécuté à chaque pixel,
aucune boucle `requestAnimationFrame` et aucun calcul continu.

## Propriétés animées

Les transitions utilisent principalement :

- `opacity` pour renforcer doucement le chapitre actif sans cacher les autres;
- `transform: translate3d()` pour une arrivée de 8 à 12 px;
- `transform: scale()` limité à `0.995 → 1`;
- `transform: scaleY()` sur chaque segment de progression.

La largeur, la hauteur, les marges, le padding, `top` et `left` ne sont pas
animés. Les dimensions des images sont réservées par Astro, ce qui évite un
changement de mise en page pendant le chargement.

## Amélioration progressive

Le HTML et les images sont visibles par défaut. Le script ajoute
`data-history-ready` seulement après avoir vérifié :

- la présence des chapitres;
- la disponibilité d’`IntersectionObserver`;
- l’absence de préférence reduced motion.

Si JavaScript est désactivé, si l’observateur manque ou si une erreur survient,
l’attribut n’existe pas. Chaque article conserve son image et son contenu
visibles. Aucun élément n’est laissé à `opacity: 0`.

## Reduced motion

Avec `prefers-reduced-motion: reduce`, le script n’active pas le mode
scrollytelling. Les images et chapitres restent dans un état stable dans le flux
normal. Les transitions, translations et légers changements d’échelle sont
neutralisés, mais la ligne, les numéros, les textes et les distinctions de
provenance restent présents.

## Images et performance

Les huit sources PNG totalisent 21 331 827 octets, soit 20,34 Mio. Elles ne sont
pas préchargées et ne sont jamais marquées prioritaires : le hero de la page
reste le candidat LCP. Toutes les images de la chronologie utilisent :

- `astro:assets`;
- `loading="lazy"`;
- `decoding="async"`;
- des largeurs adaptées;
- un `sizes` réaliste;
- une sortie WebP produite au build;
- un ratio réservé pour éviter le CLS.

Une seule balise d’image est générée par chapitre. La page référence donc neuf
images uniques : huit illustrations et la photographie documentaire.

Lors du build de validation, Astro a produit 44 fichiers WebP responsives pour
la chronologie, totalisant 7 364 648 octets dans `dist`. Le plus grand fichier
généré pèse 403 538 octets. Ces fichiers sont des candidats de `srcset` :
le navigateur ne les télécharge pas tous, il choisit pour chaque image la
variante adaptée au viewport et à la densité de l’écran. Les neuf balises
restent différées sous le hero, sans `fetchpriority="high"` ni préchargement.

Le contrôleur de chronologie compilé ajoute 1 238 octets de JavaScript minifié,
soit 607 octets après gzip. Il n’exécute aucune boucle d’animation et ne
télécharge aucune donnée; il met seulement à jour l’état actif à partir des
notifications d’`IntersectionObserver`.

## Accessibilité et provenance

- Une mention publique annonce que les scènes générées ne sont pas des archives.
- Les textes alternatifs commencent par « Illustration artistique » lorsque
  nécessaire.
- Les portraits générés ne sont pas décrits comme des portraits authentiques.
- La photographie de 2018 est explicitement identifiée comme repère
  documentaire.
- La ligne, ses segments et les numéros décoratifs sont masqués aux technologies
  d’assistance.
- Le contenu historique réel reste lisible sans couleur, animation ou image.

Le titre « Un patrimoine vivant » est éditorial. Il ne constitue pas une
désignation patrimoniale ou légale.

## Préparation Sanity

La chronologie pourra rester un tableau d’objets intégrés dans `aboutPage` :

```text
historyTimeline[]
  periodLabel
  title
  summary
  body
  image
  imageAlt
  imageKind
  embeddedText
  sourceLabel
  editorialStatus
  disclosure
  active
  order
```

Sanity pourra gérer les dates, textes, images, alt, provenances, états actifs et
ordre. Astro conservera la composition alternée, les breakpoints, la ligne, la
palette, les transitions et les règles d’accessibilité.

Si les événements historiques doivent être réutilisés sur plusieurs pages, ils
pourront devenir des documents référencés. Tant qu’ils appartiennent seulement
à cette page, des objets intégrés évitent une complexité éditoriale inutile.
