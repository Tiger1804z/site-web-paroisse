# Système de mouvement

## Philosophie

Le mouvement soutient la lumière, l’architecture, la contemplation et la
hiérarchie éditoriale. Il ne remplace jamais le contenu et ne conditionne
aucune interaction. Les effets sont plus lents que les interactions de
l’utilisateur : un bouton répond en quelques centaines de millisecondes,
tandis qu’une lumière de hero évolue sur plusieurs dizaines de secondes.

Le système partagé est utilisé uniquement là où un mouvement soutient une
intention éditoriale : Accueil, Notre paroisse et Nos services. Horaires,
Première visite, les FAQ et les futurs formulaires restent volontairement
sobres.

## Tokens

| Token                           | Valeur                            | Usage                            |
| ------------------------------- | --------------------------------- | -------------------------------- |
| `--motion-duration-fast`        | `220ms`                           | bouton, lien et retour d’état    |
| `--motion-duration-normal`      | `400ms`                           | panneau et interaction locale    |
| `--motion-duration-reveal`      | `800ms`                           | entrée éditoriale                |
| `--motion-duration-slow`        | `1400ms`                          | fondu photographique             |
| `--motion-duration-cinematic`   | `22000ms`                         | dérive très lente d’un hero      |
| `--motion-ease-standard`        | `cubic-bezier(0.2, 0.65, 0.3, 1)` | mouvement naturel                |
| `--motion-ease-emphasized`      | `cubic-bezier(0.16, 1, 0.3, 1)`   | arrivée éditoriale               |
| `--motion-ease-cinematic`       | `cubic-bezier(0.37, 0, 0.63, 1)`  | ambiance continue                |
| `--motion-distance-small`       | `8px`                             | entrée d’un panneau              |
| `--motion-distance-medium`      | `24px`                            | reveal vertical                  |
| `--motion-scale-hover`          | `1.02`                            | média au survol                  |
| `--motion-scale-cinematic`      | `1.035`                           | hero photographique              |
| `--motion-light-opacity`        | `0.14`                            | lumière ambiante                 |
| `--motion-particle-opacity`     | `0.12`                            | plafond d’opacité des particules |
| `--motion-stagger-step` à `--5` | `80ms` à `400ms`                  | groupes courts, délai plafonné   |

Les anciens tokens de durée restent des alias afin de ne pas modifier
brutalement les composants déjà validés.

## Composants

- `AmbientHero.astro` assemble, de façon optionnelle, les couches décoratives
  d’un hero sans toucher au texte;
- `AmbientLight.astro` produit un grand gradient radial lent;
- `AmbientParticles.astro` génère au build au plus huit particules statiques;
- `Reveal.astro` ajoute les attributs d’une révélation, sans état React;
- `MotionController.astro` charge le contrôleur uniquement sur les trois pages
  pilotes;
- `LivingStainedGlass.astro` est une œuvre autonome propre à l’accueil.

Ces composants restent en Astro parce qu’ils génèrent du HTML et du CSS. React
n’apporterait aucun bénéfice : il faudrait hydrater du JavaScript uniquement
pour reproduire des animations que le navigateur sait composer lui-même.

## IntersectionObserver

`src/scripts/motion.ts` utilise un seul `IntersectionObserver` pour les
éléments `[data-motion-reveal]`, les groupes `[data-motion-stagger]` et le
vitrail `[data-lsg]`.

L’observateur :

1. attend qu’un élément entre dans la zone visible;
2. ajoute son attribut d’état final;
3. arrête immédiatement d’observer cet élément;
4. ne remet jamais l’élément dans son état initial.

Cette API est préférable à un listener `scroll` continu : le navigateur gère
les détections d’intersection et aucun calcul n’est exécuté à chaque pixel de
défilement.

## Amélioration progressive

Le HTML est visible par défaut. Le script ajoute `motion-enabled` uniquement
après avoir créé l’observateur avec succès. Sans JavaScript, en cas d’erreur ou
si `IntersectionObserver` est absent, aucune classe de masquage ne reste
active. Le contenu et le vitrail sont donc affichés dans leur état final.

Les animations CSS servent à la présentation. Le JavaScript sert seulement à
déterminer le moment d’une révélation et, dans le vitrail, à traduire un
pointeur précis en deux petites valeurs de transform.

## Reduced motion

Avec `prefers-reduced-motion: reduce` :

- les révélations sont immédiatement visibles;
- les translations et dérives cinématographiques sont supprimées;
- la lumière et les particules ambiantes disparaissent;
- le hero de l’accueil reste sur sa première image;
- le vitrail reste complet et statique, sans poussière, grain ni parallaxe;
- la liste « Vivre la paroisse » est immédiatement visible, sans translation;
- les changements d’état fonctionnels, le focus et la navigation restent
  disponibles.

Supprimer un mouvement décoratif ne signifie pas supprimer le retour visuel
d’un bouton ou l’ouverture fonctionnelle d’un menu.

## Performance

Le système anime principalement `transform` et `opacity`. Ces propriétés
peuvent être composées sans recalculer la géométrie de la page. À l’inverse,
animer `width`, `height`, `top`, `left`, les marges ou le padding déclencherait
des recalculs de layout et parfois davantage de paint.

Il n’existe :

- aucun listener global de scroll ajouté par ce système;
- aucune boucle JavaScript par frame;
- aucun `requestAnimationFrame` continu;
- aucune dépendance;
- aucune modification des dimensions d’image;
- aucun `will-change` permanent sur une collection de cartes.

`will-change` est limité à l’état court précédant un reveal. Le contrôleur
cesse d’observer chaque cible révélée. Les héros n’animent qu’une photographie
utile; sur l’accueil, seule la diapositive active reçoit le zoom principal.

## Révélation de « Vivre la paroisse »

La section photographique réutilise `MotionController.astro` et le même
`IntersectionObserver`. Le titre apparaît d’abord, puis les quatre lignes de
groupes de haut en bas. Chaque ligne utilise une transition de 480 ms, un
décalage vertical de 14 px et un stagger de 80 ms. Une fois révélée, elle reste
visible.

L’image de fond, l’overlay et les séparateurs ne sont pas animés. Il n’existe
ni lentille, ni carrousel, ni parallaxe dans cette section. Le HTML est visible
par défaut; JavaScript ne fait que choisir le moment de la transition.

## Header translucide

Le passage de l’état supérieur à l’état défilé anime seulement les couleurs,
la bordure et l’ombre. Le header conserve une surface translucide aux deux
états; le blur augmente après défilement sans animer la géométrie. Un fallback
CSS plus opaque garantit la lisibilité si `backdrop-filter` n’est pas pris en
charge. `prefers-reduced-motion` supprime la transition, sans modifier le
contraste ni le fonctionnement du menu.

## Hero de Nos services

Le hero réutilise le contrôleur de lentille organique de l’accueil. La
photographie principale change toutes les 7,6 secondes avec un fondu de 1,25
seconde et un zoom maximal de 1,022. La lentille révèle toujours l’image
suivante; elle ne crée ni trail ni copie persistante. Le `requestAnimationFrame`
n’existe que pendant un déplacement ou la fermeture de la lentille, puis
s’arrête.

Le contrôleur prépare les images de révélation après le premier rendu, se
désactive sur pointer coarse, nettoie ses observateurs à la sortie de page et
réagit à l’onglet masqué. Avec reduced motion, la première photographie reste
statique et la lentille, les indicateurs et le zoom sont absents.

## Galerie centrée de l’accueil

La galerie n’utilise aucun autoplay. Les flèches, les touches gauche/droite ou
un geste tactile modifient un index et laissent CSS interpoler `transform` et
`opacity` sur 520 ms. Une image domine au centre, deux voisines sont
intermédiaires et deux images plus petites ferment la composition. Sans
JavaScript, la liste reste une bande horizontale défilable; avec reduced
motion, le changement est instantané.

## Le vitrail vivant de la communauté

### Rôle et emplacement

Le vitrail apparaît une seule fois, sous le premier écran, dans la colonne
visuelle de la section d’accueil « Ensemble — Une communauté enracinée dans la
foi ». Il remplace le collage photographique de cette section, mais ne remplace
jamais le hero.

Le texte adjacent reste un contenu éditorial : Sanity pourra plus tard gérer
l’eyebrow, le titre, les paragraphes, la citation et le CTA. Astro conserve le
SVG, les 34 fragments, les gradients, la croix, la lumière, les animations et
la composition visuelle.

### Props utilisées

```astro
<LivingStainedGlass intensity={0.9} speed={0.8} parallax={4} grain={true} />
```

- `intensity` règle la présence du halo, entre `0.6` et `1`;
- `speed` règle la cadence, entre `0.5` et `1`;
- `parallax` est limitée entre `0` et `5` pixels;
- `grain` active la matière visuelle légère;
- `label` permet de remplacer la description accessible.

Les durées et opacités finales sont calculées dans le frontmatter Astro. Le CSS
de production n’utilise donc pas de division ou multiplication de variables
dans `calc()`, ce qui évite de dépendre des opérateurs arithmétiques CSS récents
sur Safari mobile.

### IDs SVG fixes

Les gradients `lsgF0` à `lsgF33`, les filtres, le clip, le halo et les autres
ressources utilisent des IDs fixes. Une seule instance est autorisée par page.
Il ne faut ni dupliquer le composant sur l’accueil, ni créer une génération
d’IDs complexe dans ce ticket.

### Introduction et boucle ambiante

Le contrôleur partagé déclenche `data-lsg-visible`. Les fragments s’assemblent,
le cadre et le tracé apparaissent, puis le halo et la croix se révèlent. Une
respiration lumineuse lente, un reflet diagonal, quelques nœuds et au plus huit
poussières animent ensuite l’état final. Aucun bouton de démonstration ni script
de replay n’est intégré.

### Parallaxe

La parallaxe :

- est attachée au seul composant;
- nécessite `(pointer: fine)`;
- lit son rectangle uniquement à `pointerenter`;
- limite l’écriture à une fois par frame pendant `pointermove`;
- revient à zéro à `pointerleave`;
- est désactivée sur mobile et en reduced motion;
- ne demande ni gyroscope ni permission d’orientation.

### Mobile et performance

Le ratio `500 / 710` réserve l’espace et évite un layout shift. Sous 640 px, le
vitrail est plafonné à 320 px, la parallaxe, le grain, les poussières et le flou
secondaire disparaissent. À partir de la tablette, seules quatre poussières
restent visibles; huit constituent le maximum sur grand écran.

L’œuvre est sous le premier écran, ne charge aucune image et ne concurrence pas
le LCP photographique du hero. Elle n’utilise ni Canvas, ni WebGL, ni
dépendance.

## Chronologie immersive de Notre paroisse

La chronologie constitue un usage spécialisé du système, pas une nouvelle
bibliothèque. `ImmersiveHistoryTimeline.astro` réutilise les tokens
`--motion-*`; `history-timeline.ts` ajoute un observateur dédié uniquement
parce que l’interface doit conserver un chapitre actif et faire progresser les
segments de la ligne.

Le script n’utilise pas le reveal générique et les chapitres n’emploient pas
`data-motion-reveal`. Cette séparation évite une double mise à `opacity: 0`.
Trois observateurs spécialisés lisent le même déclencheur de 1 px : la ligne à
78 % du viewport, le repère actif et la période à 70 %, puis la révélation
irréversible à 62 %. La ligne guide ainsi le regard avant l’apparition du
contenu. Deux frames ponctuelles garantissent que l’état initial a été peint
avant l’observation.

S1-T11 ajoute une ambiance « salle de théâtre » strictement limitée à cette
section. Un voile fixe assombrit progressivement ce qui entoure la chronologie
pendant que la section elle-même reste au-dessus, comme une scène éclairée. Le
header demeure au premier plan et sa luminosité descend séparément jusqu’à
56 %, ce qui empêche les chapitres de traverser visuellement la navigation.
L’intensité monte avec un `smoothstep` entre 92 % et 34 % du viewport, reste
stable pendant les chapitres, puis redescend entre 82 % et 22 % à l’approche de
l’épilogue.

Ce contrôleur d’ambiance possède un listener `scroll` passif et un listener
`resize`. Ils ne font aucun travail directement : ils regroupent les mises à
jour dans un unique `requestAnimationFrame` ponctuel et ne maintiennent aucune
boucle continue. Les listeners et la frame éventuelle sont nettoyés à
`pagehide` et `astro:before-swap`; un passage de l’onglet en arrière-plan remet
l’ambiance à zéro.

À partir de 1024 px, chaque article alterne son image et son texte autour d’un
axe central. Il n’existe aucun panneau partagé : les neuf images restent dans
leurs neuf articles. Sur mobile, la composition devient une pile verticale.

Les transitions utilisent `opacity` de 0 à 1, `translate3d`, une échelle
`0.985 → 1` et `scaleY` pour la ligne. L’image et le texte emploient la durée
lente de 1400 ms; le texte commence 150 ms après l’image. Le marqueur inline
pré-paint n’est ajouté que lorsque JavaScript, `IntersectionObserver` et la
préférence de mouvement le permettent. Reduced motion conserve la structure,
mais retire l’accentuation active, le voile d’ambiance et toutes les
transitions. Sans JavaScript, le voile reste transparent et tout le récit reste
visible. Le détail se trouve dans
[`IMMERSIVE_HISTORY_TIMELINE.md`](./IMMERSIVE_HISTORY_TIMELINE.md).

## Règles d’utilisation

Utiliser le système pour les compositions éditoriales et photographiques
importantes. Ne pas l’appliquer automatiquement aux horaires, coordonnées,
FAQ, longs tableaux, formulaires ou informations urgentes. Ne pas imbriquer
plusieurs reveals sur le même contenu et ne pas ajouter un second observateur
pour une responsabilité déjà couverte.

## Chaîne intergénérationnelle — Événements

`AnimatedGenerationsChain.astro` est une illustration éditoriale propre à la
cinquième catégorie du lot Événements. Elle représente quatre générations
reliées de gauche à droite. Sa séquence dure environ 3,55 secondes : les
silhouettes apparaissent successivement, les trois liens de mains se dessinent,
puis une lumière dorée traverse brièvement l’ensemble. Rien ne reboucle.

Le composant utilise les tokens `--motion-ease-*` et le contrôleur
`src/scripts/motion.ts` déjà chargé sur la page. L’observateur partagé détecte
`data-generations-chain`, ajoute `data-art-visible`, puis cesse d’observer
l’œuvre. Le JavaScript ne calcule aucune animation et n’écoute pas le
défilement : le navigateur exécute uniquement les keyframes CSS basées sur
`transform` et `opacity`.

Le SVG est visible par défaut. Un court script inline ajoute
`data-art-motion` avant le premier rendu uniquement lorsque
`IntersectionObserver` est disponible et que reduced motion est désactivé. Si
le module partagé ne confirme pas l’observation, un délai de sécurité retire ce
marqueur. Un élément correctement observé peut donc rester préparé hors écran
sans perdre son animation. Sans JavaScript ou avec
`prefers-reduced-motion: reduce`, les quatre personnes et leurs liens sont
immédiatement visibles et stables.

Le titre, le résumé et un éventuel CTA restent des contenus éditoriaux
normalisables depuis Sanity. Les silhouettes, la palette, les timings et la
composition SVG restent dans Astro.

## Vie paroissiale — S1-T08

La page réutilise uniquement le contrôleur générique. L'introduction, chacun
des quatre articles complets et le CTA final portent `data-motion-reveal`.
Observer l'article plutôt que son image et son texte séparément évite de
laisser une moitié de chapitre masquée lors d'un défilement rapide.

Chaque cible passe de `opacity: 0` à `1` et de
`translate3d(0, 24px, 0)` à sa position finale. Le reveal est exécuté une seule
fois, puis l'observation cesse. Le zoom photographique de `1.02` n'existe que
sur un appareil avec survol et pointeur précis.

Sans JavaScript, la classe `motion-enabled` n'est jamais ajoutée et tout le
contenu est visible. Avec reduced motion, le contrôleur appelle son état final
et les transitions décoratives sont ramenées à une durée négligeable par la
stratégie globale. Aucun script, observer ou listener supplémentaire n'est
créé pour cette page.

## Lentilles organiques des héros — S1-T10

`src/scripts/organic-hero-lens.ts` centralise l'amélioration progressive
inspirée du principe visuel du hero Patreon. Une seule ouverture masquée révèle
une couche photographique plein cadre derrière l'image principale. Friperie et
le hero d'accueil utilisent le même contrôleur; les autres héros restent hors
du périmètre de S1-T10.

La vidéo de référence fournie le 27 juillet 2026 précise le mouvement : la
fenêtre n'est pas un disque fixe. Elle naît au début du geste, gonfle avec
l'énergie du pointeur, s'étire légèrement dans sa direction, accuse un retard
court, puis se résorbe lorsque le mouvement cesse. Le diamètre maximal reste
`clamp(150px, 15vw, 250px)`.

Un listener `pointermove` passif, attaché uniquement au hero, mesure la
distance, la vitesse et la direction. Une seule boucle `requestAnimationFrame`
interpole la position à `0.13`, la croissance à `0.17` et le retrait à
`0.105`. Douze points, deux harmoniques discrètes et des courbes quadratiques
produisent le tracé SVG organique. La forme se referme après 105 ms sans
mouvement réel; elle ne demeure donc pas comme une vignette flottante.

Sur Friperie, les quatre révélations avancent dans un ordre fixe après 180 px
de distance cumulée et au moins 560 ms de mouvement. Sur l'accueil, la lentille
révèle toujours la prochaine image de la boucle : 1 révèle 2, 2 révèle 3 et 3
révèle 1, y compris après une sélection manuelle. L'opacité des révélations se
croise sur 360 ms. L'ouverture SVG continue de suivre le pointeur pendant le
fondu : ni le hero complet ni son texte ne disparaissent.

Le script :

- conserve les images en faible priorité dans le HTML, puis les promeut vers
  `eager` et les décode pendant un temps d'inactivité ou au premier geste;
- refuse d'afficher la lentille tant que les quatre images ne sont pas prêtes;
- recalcule la géométrie avec `ResizeObserver`;
- laisse la forme se résorber à `pointerleave`, mais l'annule immédiatement
  lorsque l'onglet est caché;
- nettoie listeners, observer, idle callback et frame à `pagehide` ou
  `astro:before-swap`.

Le hero coupe naturellement la forme à ses bords avec `overflow: hidden` :
elle peut atteindre un coin comme dans la référence sans provoquer de
débordement horizontal. La couche révélée reste sous le texte HTML, mais
au-dessus du voile sombre afin de garder ses couleurs perceptibles.

La lentille n'existe que pour `(hover: hover)`, `(pointer: fine)` et
`prefers-reduced-motion: no-preference`. Sur mobile, tablette tactile, reduced
motion et sans JavaScript, le hero reste une image statique complète. Le texte
HTML, la navigation et les CTA ne dépendent jamais de l'effet.

Cette interaction est du code de présentation. Un futur CMS ne contrôlera ni
le masque, ni les seuils, ni le rAF, ni la séquence.
