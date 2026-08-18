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

1. trouver chaque chronologie, ses chapitres et leur déclencheur de 1 px;
2. faire avancer la ligne lorsque ce déclencheur franchit 78 % du viewport;
3. préaccentuer le prochain repère avec `data-history-rail-target`;
4. activer le repère, le numéro et la période à 70 %;
5. révéler définitivement l’image à 62 %, puis le texte avec 150 ms de retard;
6. cesser d’observer la révélation d’un chapitre dès qu’elle est acquise;
7. revenir au rendu statique en cas d’erreur ou de capacité absente.

Les trois ratios sont intentionnellement distincts :

| Ancre        |  Ratio | Responsabilité                                                           |
| ------------ | -----: | ------------------------------------------------------------------------ |
| Ligne        | `0.78` | la ligne anticipe le chapitre et le prochain repère s’éclaire légèrement |
| Repère actif | `0.70` | le numéro et la période deviennent visibles                              |
| Révélation   | `0.62` | l’image commence son fondu, puis le texte suit                           |

Sur desktop, le déclencheur est aligné sur le repère central du chapitre. Sur
mobile, il reste au début de l’article. Chaque observateur utilise une zone qui
va du haut du viewport jusqu’à son ratio, plutôt qu’une bande très étroite :
un défilement rapide ne peut donc pas sauter le déclenchement.

Les observateurs reçoivent des événements seulement aux franchissements de
leurs zones. Deux `requestAnimationFrame` ponctuels laissent le navigateur
peindre l’état initial avant de commencer l’observation; ils ne constituent
pas une boucle d’animation.

## Ambiance « lumières de salle » — S1-T11

L’effet de cinéma ne modifie pas le hero de Notre paroisse. Il commence
seulement lorsque le haut de la chronologie entre dans le viewport :

1. l’intensité monte avec une courbe `smoothstep` entre 92 % et 34 % du
   viewport;
2. un voile fixe atteint au maximum 90 % de son dégradé sombre et vignetté;
3. la chronologie passe sur un plan supérieur et conserve ses couleurs, son
   texte et ses images;
4. le header reste au premier plan, mais sa luminosité descend progressivement
   jusqu’à 56 % pour évoquer une lumière ambiante;
5. l’intensité redescend lorsque l’épilogue franchit la zone comprise entre
   82 % et 22 % du viewport.

Les plans `55`, `56` et `60` appartiennent respectivement au voile, à la
chronologie active et au header. Cette séparation corrige le défaut où les
images et textes de la timeline pouvaient passer par-dessus la navigation
fixe.

L’ambiance doit connaître la progression globale, contrairement aux
observateurs de chapitres. Elle utilise donc un listener `scroll` passif et un
listener `resize`, qui demandent au plus une frame ponctuelle. Il n’existe
aucune boucle rAF persistante. Le contrôleur annule la frame éventuelle et
retire ses listeners à `pagehide` ou `astro:before-swap`; il remet aussi
l’intensité à zéro lorsque l’onglet devient caché.

## Propriétés animées

Les transitions utilisent principalement :

- `opacity` de `0` à `1` pour les métadonnées, l’image et le texte;
- `transform: translate3d()` pour une arrivée horizontale de 14 px sur mobile
  et 24 px sur desktop;
- `transform: scale()` limité à `0.985 → 1` sur l’image;
- `transform: scaleY()` sur chaque segment de progression.

La période utilise le reveal éditorial de 800 ms au moment de l’activation.
L’image et le texte utilisent ensuite la durée lente de 1400 ms et l’easing
cinématographique; le texte commence 150 ms après l’image.
`data-history-revealed` n’est jamais retiré : une fois révélé, un chapitre
reste entièrement visible même lorsqu’un autre devient actif ou lorsque le
visiteur remonte.

La largeur, la hauteur, les marges, le padding, `top` et `left` ne sont pas
animés. Les dimensions des images sont réservées par Astro, ce qui évite un
changement de mise en page pendant le chargement.

## Amélioration progressive

Le HTML et les images sont visibles par défaut. Un très petit script inline,
placé au début de la section, ajoute synchroniquement `data-history-motion`
avant que les chapitres soient peints, seulement après avoir vérifié :

- que `IntersectionObserver` est réellement une fonction;
- l’absence de préférence reduced motion.

Ce marqueur autorise le CSS à préparer `opacity: 0`; le module initialise
ensuite les observateurs et ajoute `data-history-initialized`. Un garde-fou
retire le marqueur après deux secondes si l’initialisation n’a pas eu lieu.

Si JavaScript est désactivé, si l’observateur manque, si reduced motion est
actif ou si le module échoue, `data-history-motion` est absent ou retiré. Chaque
article conserve alors son image et son contenu visibles. Aucun élément n’est
laissé à `opacity: 0`.

## Reduced motion

Avec `prefers-reduced-motion: reduce`, le script n’active pas le mode
scrollytelling. Les images et chapitres restent dans un état stable dans le flux
normal. Les transitions, translations et légers changements d’échelle sont
neutralisés et le voile d’ambiance est masqué, mais la ligne, les numéros, les
textes et les distinctions de provenance restent présents.

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

Le contrôleur de chronologie compilé ajoute 2 082 octets de JavaScript minifié,
soit 820 octets après gzip. Il n’exécute aucune boucle d’animation et ne
télécharge aucune donnée; il met seulement à jour les trois états de
progression à partir des notifications d’`IntersectionObserver`.

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
