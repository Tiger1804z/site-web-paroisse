# Système de mouvement

## Philosophie

Le mouvement soutient la lumière, l’architecture, la contemplation et la
hiérarchie éditoriale. Il ne remplace jamais le contenu et ne conditionne
aucune interaction. Les effets sont plus lents que les interactions de
l’utilisateur : un bouton répond en quelques centaines de millisecondes,
tandis qu’une lumière de hero évolue sur plusieurs dizaines de secondes.

S1-T06.5 applique ce système uniquement à l’Accueil, Notre paroisse et
Sacrements et services. Horaires, Première visite, les FAQ et les futurs
formulaires restent volontairement sobres.

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

## Règles d’utilisation

Utiliser le système pour les compositions éditoriales et photographiques
importantes. Ne pas l’appliquer automatiquement aux horaires, coordonnées,
FAQ, longs tableaux, formulaires ou informations urgentes. Ne pas imbriquer
plusieurs reveals sur le même contenu et ne pas ajouter un second observateur
pour une responsabilité déjà couverte.
