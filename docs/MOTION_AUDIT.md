# Audit du mouvement

## Périmètre

Cet audit précède l’implémentation de `S1-T06.5`. Il couvre les pages pilotes
Accueil, Notre paroisse et Sacrements et services, ainsi que les composants
globaux qui conditionnent leurs interactions.

Le mouvement doit rester une amélioration progressive. Le HTML produit par
Astro demeure lisible et utilisable sans JavaScript.

## Inventaire

| Élément                          | Animation actuelle                                               | Problème ou qualité                                                           | Décision                                                                                              | Implémentation cible            |
| -------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------- |
| Tokens globaux                   | `--duration-short` à `--duration-media`, easing éditorial unique | Base cohérente, mais durées non sémantiques et effets ambiants non couverts   | Conserver des alias de compatibilité et ajouter des tokens de mouvement sémantiques                   | `src/styles/global.css`         |
| Boutons                          | Couleur, fond, bordure et translation active en 200 ms           | Interaction claire; vitesse légèrement sèche                                  | Porter à 220 ms, conserver le focus et limiter le déplacement à 1 px                                  | Styles globaux `.ui-button`     |
| Liens éditoriaux                 | Ligne de 2 à 3 rem en 200 ms                                     | Motif fidèle et accessible                                                    | Conserver, ralentir légèrement et déplacer la flèche de 3 px maximum                                  | `.ui-text-link`                 |
| Images génériques                | Zoom jusqu’à `1.05` en 700 ms                                    | Plus fort que la direction premium demandée                                   | Limiter les pages pilotes à `1.02` et 800 ms                                                          | Cartes et photographies pilotes |
| Header transparent/sticky        | Listener `scroll` passif et transitions de 400 à 500 ms          | Fonctionnel et déjà validé                                                    | Ne pas modifier la logique                                                                            | `Header.astro`                  |
| Menu mobile                      | Transitions CSS, gestion focus, Escape et inert                  | Fonctionnel et accessible                                                     | Ne pas ajouter d’effet décoratif concurrent                                                           | `Header.astro`                  |
| Hero Accueil                     | Rotation toutes les 8 s, fondu 1,4 s, zoom 1 → 1,03 sur 8 s      | Bonne base; zoom lié à la cadence plutôt qu’au système cinématographique      | Garder rotation et fondu, porter l’image active sur un cycle de 22 s sans animer les images inactives | `HomeHero.astro`                |
| Indicateur de défilement Accueil | Translation verticale continue sur 2 s                           | Mouvement plus visible que nécessaire                                         | Ralentir et réduire l’amplitude                                                                       | `HomeHero.astro`                |
| Hero Notre paroisse              | Photographie et overlays statiques                               | Aucun mouvement, composition adaptée à une dérive lente                       | Ajouter transform cinématographique, lumière et particules discrètes                                  | `AboutHero.astro`               |
| Hero Sacrements                  | Photographie violette et overlay statiques                       | Aucun mouvement, lignes architecturales à préserver                           | Ajouter transform cinématographique très faible, lumière et particules limitées                       | `SacramentsHero.astro`          |
| Révélations au défilement        | Absentes                                                         | Les sections apparaissent toutes immédiatement                                | Ajouter un observateur partagé, une seule exécution et un fallback visible                            | `src/scripts/motion.ts`         |
| Stagger                          | Absent                                                           | Aucun rythme entre éléments liés                                              | Ajouter 80 ms par élément, seulement sur groupes courts                                               | Attributs `data-motion-stagger` |
| FAQ                              | `details/summary` natif; rotation d’icône existante              | Sobre et accessible                                                           | Ne pas ajouter de reveal ou d’animation complexe                                                      | FAQ inchangées                  |
| Onglets Sacrements               | JavaScript natif, ARIA et transitions de couleur                 | Fonctionnel; aucun mouvement de panneau                                       | Garder la logique, ajouter une entrée de panneau CSS très courte                                      | `SacramentsExplorer.astro`      |
| Reduced motion                   | Règle globale à 0,01 ms et protections locales                   | Bonne couverture, mais les nouveaux effets doivent être explicitement retirés | Afficher tous les reveals, supprimer dérives, lumière, particules et parallaxe                        | Styles globaux et composants    |
| Scripts existants                | Header, annonce, hero et onglets                                 | Scripts spécialisés justifiés                                                 | Ne pas fusionner les responsabilités fonctionnelles avec le mouvement décoratif                       | Scripts existants inchangés     |

## Œuvre fournie — Le vitrail vivant de la communauté

### Sources analysées

- `LivingStainedGlass.astro` : source technique principale;
- `apercu-vitrail.html` : composition de démonstration et référence visuelle.

Les deux fichiers demeurent dans `Downloads` et ne sont pas importés directement
par le site.

### Structure du SVG

Le SVG inline utilise un `viewBox` de `500 × 710` et réserve son espace avec le
même ratio. Une arche est définie par un `clipPath`; le verre, le réseau de
laiton, la lumière et le cadre sont assemblés dans des groupes superposés.

Les 34 fragments sont des polygones irréguliers répartis en couronnes. Chaque
fragment possède :

- un gradient propre `lsgF0` à `lsgF33`;
- un déplacement initial `--tx` et `--ty`;
- une rotation initiale très faible;
- un délai `--d`;
- une opacité finale `--fo`.

Leur introduction converge vers la composition finale. Les lignes et nœuds
évoquent les liens de la communauté sans porter de contenu textuel.

### Lumière et matières

- `lsgHalo`, `lsgCore` et `lsgBloom` forment le halo central;
- la croix est composée de rectangles lumineux, doublés d’un flou doux;
- `lsgSweep` produit le reflet diagonal périodique;
- huit poussières utilisent des translations verticales lentes;
- un `feTurbulence` encodé en data URI crée le grain;
- `lsgSoft` et `lsgBloom` sont les deux filtres de flou SVG;
- les gradients de pierre, laiton, fond et vignette structurent l’arche.

### Comportements

L’introduction originale utilise un `IntersectionObserver` à 20 % de visibilité.
Après l’assemblage, une boucle ambiante anime la respiration lumineuse, quelques
fragments, les poussières, les rayons et le reflet diagonal.

La parallaxe :

- est limitée à `(pointer: fine)`;
- calcule le rectangle à `pointerenter`;
- limite les écritures à une fois par frame;
- revient à zéro à `pointerleave`;
- ne dépend d’aucun listener de scroll.

Sans JavaScript, l’état de base est l’état final complet. En reduced motion,
animations, transitions et parallaxe sont supprimées.

### IDs SVG fixes

Les IDs `lsgF0` à `lsgF33`, `lsgHalo`, `lsgCore`, `lsgBack`, `lsgSweep`,
`lsgStone`, `lsgBrass`, `lsgVig`, `lsgSoft`, `lsgBloom` et `lsgClip` sont fixes.

Conséquence : une seule instance du composant est autorisée par page. Le ticket
ne créera pas de générateur d’IDs, car le vitrail est intégré une seule fois sur
l’accueil.

### Éléments de démonstration exclus

Ne seront pas portés :

- barre « Aperçu »;
- boutons Rejouer, État final, État de départ et Ralenti;
- zones `.scroller`;
- styles `body` et grille de démonstration;
- référence Google Fonts;
- scripts de replay et reflow forcé;
- liens ou textes codés dans l’œuvre.

Le vitrail de production restera un composant visuel autonome. Le texte adjacent
continuera de venir de la section Accueil et pourra plus tard être fourni par
Sanity.

## Risques identifiés

- masquer un contenu si JavaScript ou `IntersectionObserver` échoue;
- déclencher deux introductions sur le vitrail;
- dupliquer les IDs SVG;
- animer simultanément plusieurs grandes images du hero;
- conserver des zooms à `1.05`;
- multiplier les calques par un usage permanent de `will-change`;
- utiliser des divisions CSS de durées dont la compatibilité Safari doit être
  contrôlée;
- appliquer les reveals aux FAQ ou aux informations pratiques;
- introduire du scroll horizontal avec les couches lumineuses.

## Décision d’architecture

Un seul script partagé observera les reveals, les groupes stagger et
`[data-lsg]`. Les effets continus resteront en CSS. La parallaxe du vitrail sera
le seul comportement visuel utilisant `requestAnimationFrame`, uniquement
pendant un déplacement de pointeur à l’intérieur du composant.

Le vitrail demeure une œuvre spécifique, pas un remplacement du système
générique de mouvement.

## Implémentation retenue

- `MotionController.astro` charge un seul module sur chacune des trois pages
  pilotes;
- `motion.ts` partage un observateur pour les reveals, les groupes stagger et
  le vitrail;
- le vitrail possède seulement un petit garde synchrone pour éviter un flash
  avant son introduction; il ne crée aucun observateur;
- les durées et opacités du vitrail sont pré-calculées par Astro afin d’éviter
  les divisions CSS;
- la parallaxe est le seul usage de `requestAnimationFrame` et ne fonctionne
  que pendant un mouvement de pointeur dans l’œuvre;
- le nombre maximal de particules génériques est huit; elles sont supprimées
  sur petit mobile et en reduced motion;
- les fichiers d’aperçu, leurs contrôles, leurs polices et leurs styles de page
  ne sont pas copiés dans l’application.
