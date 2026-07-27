# Mapping Figma — Friperie

Audit réalisé le 27 juillet 2026 pour S1-T10.

## Source et route du prototype

- route simulée : état React `currentPage === 'friperie'`;
- branchement : `reference/figma-make-export/src/App.tsx`;
- fichier principal :
  `reference/figma-make-export/src/pages/Friperie.tsx`;
- styles partagés :
  `reference/figma-make-export/src/index.css` et classes Tailwind du composant;
- route Astro native : `/friperie/`;
- fichier Astro : `src/pages/friperie.astro`.

Le prototype ne possède pas d'URL réelle. `navigate('friperie')` remplace une
navigation de navigateur et les deux boutons finaux appellent
`navigate('contact')`. La migration utilise des liens HTML natifs.

## Ordre des sections et correspondance

| Ordre | Source Figma                     | Composition Figma                                                                               | Migration Astro                 | Écart ou décision                                                                                                                                                   |
| ----- | -------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1     | Hero                             | Fond papier, eyebrow, H1 44/60 px, introduction 560 px                                          | `InteractiveThriftHero.astro`   | Divergence demandée : hero photographique plein cadre avec lentille inspirée de Patreon. Le texte HTML, l'eyebrow et le H1 restent au-dessus.                       |
| 2     | Photo principale et présentation | Grille 1/2 colonnes dès 1024 px, placeholder 4:3, H2, paragraphe, note et deux fiches pratiques | `ThriftStoreIntroduction.astro` | Le cadre 4:3 reste un placeholder élégant. Horaires et emplacement sont conservés dans les données avec `confirmed: false`, donc les fiches ne sont pas rendues.    |
| 3     | Types d'articles                 | H2 et huit cartes en grille 2/4 colonnes                                                        | `ThriftStoreReuseSection.astro` | Les catégories Figma ne sont pas confirmées et ne sont pas publiées. Le même rythme éditorial accueille `AnimatedClothingRack` et un texte prudent sur le réemploi. |
| 4     | Galerie                          | Six carrés, deux placeholders, deux photographies d'autel, deux placeholders                    | `ThriftStoreGallery.astro`      | Les deux photos Figma montrent l'autel, pas la friperie. Les six cases deviennent des cadres temporaires cohérents, sans prétendre documenter le local.             |
| 5     | Dons                             | Panneau charbon, texte, conditions en placeholder, deux boutons Contact                         | `ThriftStoreClosingCta.astro`   | Les catégories et conditions non confirmées sont supprimées. Le panneau conserve son fond et sa grille; les CTA vont vers Contact et Événements.                    |

## Textes et contenu

Les éléments conservés ou reformulés prudemment sont :

- « Services paroissiaux »;
- « La friperie »;
- « Notre friperie » et « Présentation »;
- l'existence de la friperie et son rôle de réemploi communautaire;
- la variation possible des articles et des prix;
- l'annonce occasionnelle possible de ventes spéciales.

Ne sont pas publiés comme faits :

- les horaires;
- l'emplacement ou une entrée distincte;
- les catégories d'articles acceptés ou refusés;
- les règles et périodes de dépôt;
- une personne responsable ou ses coordonnées;
- une fréquence de ventes;
- des prix fixes;
- la destination exacte des fonds;
- les partenariats, statistiques ou témoignages.

Les ventes spéciales datées devront être des documents `ParishEvent`; elles ne
seront pas codées dans cette page.

## Images

Les imports Figma `20210331_183200_-_Copy.jpg` et
`20210312_181118_-_Copy.jpg` ont été inspectés : ils montrent tous deux
l'autel de l'église sous un éclairage rose ou blanc. Ils ne documentent pas la
friperie et ne sont donc pas repris dans la galerie.

Le hero utilise temporairement les quatre fichiers entrants inventoriés dans
`docs/IMAGE_INVENTORY.md`. `fast-fashion2.jpeg` sert aussi d'image principale
parce que sa définition 2986 × 1994 px est adaptée au plein cadre. Les quatre
fichiers alimentent la séquence révélée. Aucun n'est présenté comme une image
de la paroisse ou de sa friperie.

Statut commun :

> PROTOTYPE TEMPORAIRE — DROITS À CONFIRMER

Toutes ces images devront être remplacées par les prises de vue réelles
décrites dans `docs/THRIFT_STORE_PHOTO_SHOT_LIST.md`.

## Hero interactif — divergence demandée

La composition est, de l'arrière vers l'avant :

1. image principale optimisée par `astro:assets`;
2. scrim garantissant le contraste;
3. quatre couches secondaires plein cadre;
4. ouverture SVG organique unique suivant le pointeur;
5. texte HTML;
6. contour organique discret de la lentille.

Paramètres retenus :

- diamètre maximal : `clamp(150px, 15vw, 250px)`;
- diamètre réel : de 0 à 100 % selon l'énergie du mouvement;
- interpolation de position : `0.13` par frame;
- croissance : `0.17`; retrait : `0.105`;
- tracé : 12 points lissés, déformés par la vitesse et la direction;
- un seul listener `pointermove` attaché au hero;
- une seule demande `requestAnimationFrame` active;
- fermeture après 105 ms sans mouvement réel;
- changement séquentiel après au moins 180 px parcourus et 560 ms;
- fondu croisé de 360 ms;
- découpe naturelle aux limites du hero par `overflow: hidden`;
- `pointer-events: none` sur toutes les couches décoratives.

Les images secondaires utilisent `loading="lazy"`, `fetchpriority="low"` et
sont promues vers `eager`, puis décodées, pendant un temps d'inactivité ou au
premier geste si nécessaire. Cette promotion contrôlée évite que Chrome
maintienne hors réseau des images entièrement masquées. La lentille ne devient
visible qu'après décodage des quatre images, ce qui évite une fenêtre vide ou
un flash noir. Seule l'image principale est `eager` et `fetchpriority="high"`
dès le HTML initial.

La boucle rAF cesse lorsque la position et le rayon sont revenus au repos. À
`pointerleave`, la forme se résorbe avant l'arrêt; elle est annulée
immédiatement lorsque l'onglet devient caché, lorsque la capacité de pointeur
change et au nettoyage `pagehide` ou `astro:before-swap`.

La vidéo de référence fournie le 27 juillet 2026 a servi à calibrer cette
divergence : apparition liée au geste, volume variable, retard court,
déformation directionnelle et disparition au repos. Le curseur système reste
inchangé et aucun trail n'est créé.

## Responsive et modes de repli

- 1024 px et plus : grille introduction 1:1 et composition réemploi
  asymétrique;
- 768 px et plus : galerie de trois colonnes;
- sous 768 px : galerie de deux colonnes et hero recadré;
- `hover: none` ou `pointer: coarse` : aucune lentille, image principale
  statique;
- `prefers-reduced-motion: reduce` : lentille et transitions supprimées;
- sans JavaScript : image principale, scrim, H1, texte et liens restent
  visibles; les couches de révélation restent cachées.

Largeurs de contrôle : 1440, 1280, 1024, 768, 430, 390 et 360 px.

Le contrôle Chrome headless du 27 juillet 2026 confirme : aucun débordement
horizontal aux sept largeurs, une seule frame rAF pendant le geste, tracé
organique présent en mouvement, puis zéro frame et aucun tracé 800 ms après
l'arrêt et après la sortie. Les modes reduced motion, pointeur grossier et
JavaScript désactivé conservent un hero statique complet.

## Accessibilité

- un seul H1;
- hiérarchie H2 pour les quatre sections suivantes;
- lentille et images de révélation `aria-hidden`;
- image de hero décorative avec `alt=""`;
- illustration du portant dotée d'un nom accessible;
- placeholders non essentiels et cachés aux technologies d'assistance;
- aucune information essentielle dans le mouvement;
- CTA sous forme de liens natifs avec focus du design system.

## Données, Sanity et SEO

Flux local :

```text
src/data/thriftStore.ts
  → src/lib/content/getThriftStorePageData.ts
  → ThriftStorePageData
  → composants Astro
  → HTML statique
```

Le futur document `thriftStorePage` pourra contrôler les textes, images,
crédits, champs pratiques, ordre, activation et CTA. Astro conservera le
masque, le script, le responsive et le SVG du portant.

La route porte le canonical relatif `/friperie/` et reste `noindex, nofollow`.
Le `noindex` pourra être retiré seulement après :

- remplacement de tous les visuels temporaires;
- confirmation des droits et crédits;
- confirmation des horaires;
- confirmation des modalités de dons;
- confirmation des coordonnées responsables;
- validation éditoriale finale.
