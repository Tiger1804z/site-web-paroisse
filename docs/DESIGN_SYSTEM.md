# Système de design

## Statut

La fondation globale a été migrée pendant `S1-T01`. L’export Figma Make demeure la source de vérité pour la composition, les proportions, les espacements et les comportements. La seule divergence esthétique volontaire est la palette premium de production. La cartographie détaillée des valeurs observées se trouve dans [`FIGMA_DESIGN_MAPPING.md`](./FIGMA_DESIGN_MAPPING.md).

Ce ticket stabilise les fondations partagées; il ne valide pas encore le rendu définitif de chaque page publique.

## Sources et implémentation

- tokens Tailwind CSS 4 et styles globaux : `src/styles/global.css`;
- composants fondamentaux : `src/components/ui/`;
- header et menu mobile : `src/components/layout/Header.astro`;
- footer et actions mobiles : `src/components/layout/Footer.astro`;
- document global : `src/layouts/BaseLayout.astro`;
- page interne de contrôle : `/verification/`.

## Palette premium

| Token                   | Valeur    | Rôle visuel                                      |
| ----------------------- | --------- | ------------------------------------------------ |
| `--color-ivory`         | `#F5F3EE` | Fond principal chaleureux.                       |
| `--color-paper`         | `#E8E3DA` | Surface secondaire et séparation douce.          |
| `--color-surface`       | `#FCFBF8` | Surface claire élevée.                           |
| `--color-burgundy`      | `#4A1624` | Marque, sections profondes et appels à l’action. |
| `--color-burgundy-dark` | `#2E1019` | Survol profond et fond sombre bourgogne.         |
| `--color-plum`          | `#60445D` | Accent secondaire.                               |
| `--color-brick`         | `#68433A` | Accent architectural.                            |
| `--color-wood`          | `#70452E` | Accent chaleureux lié au bois.                   |
| `--color-charcoal`      | `#1C1918` | Texte principal et fonds les plus sombres.       |
| `--color-muted`         | `#6F6862` | Texte secondaire sur surface claire.             |
| `--color-gold`          | `#AA8B52` | Filets, icônes et détails premium.               |
| `--color-rose`          | `#D8B3BE` | Accent doux.                                     |
| `--color-marian`        | `#6F9EB8` | Accent bleu.                                     |

Les alias sémantiques `background`, `surface`, `text`, `muted`, `border`, `border-accent` et `overlay` évitent de lier les composants à une teinte arbitraire. Le doré sur ivoire n’atteint pas le contraste requis pour un petit texte : il reste décoratif ou accompagne un libellé bourgogne/charbon.

## Typographie

Les trois familles sont chargées une seule fois dans `global.css` :

- **Cormorant Garamond**, graisses 400 à 600 et italiques 400/500 : titres éditoriaux;
- **Manrope**, graisses 400 à 700 : corps et interface;
- **Allura**, graisse 400 : accents manuscrits rares.

| Classe                | Plage observée ou cible | Hauteur de ligne | Usage                                  |
| --------------------- | ----------------------- | ---------------- | -------------------------------------- |
| `.type-display-xl`    | 52 à 88 px              | 1,05             | Hero principal immersif.               |
| `.type-display`       | 48 à 80 px              | 1,08             | Grand titre éditorial.                 |
| `.type-h1`            | 44 à 60 px              | 1,10             | Titre principal de page.               |
| `.type-h2`            | 40 à 60 px              | 1,12             | Grande section.                        |
| `.type-h3`            | 28 à 40 px              | 1,16             | Sous-section.                          |
| `.type-h4`            | 24 à 28 px              | 1,20             | Carte ou groupe de contenu.            |
| `.type-body-large`    | 18 à 20 px              | 1,75             | Introduction éditoriale.               |
| `.type-body`          | 16 à 18 px              | 1,75             | Corps courant.                         |
| `.type-body-small`    | 14 px                   | 1,65             | Métadonnées et information secondaire. |
| `.type-eyebrow`       | 11 px                   | 1,40             | Surtitre en capitales, chasse 0,2 em.  |
| `.type-label`         | 14 px                   | 1,40             | Libellé d’interface.                   |
| `.type-script-accent` | 36 à 48 px              | 1                | Accent manuscrit ponctuel.             |

Les tailles fluides utilisent `clamp()` uniquement entre les extrêmes observés dans l’export; elles ne réduisent pas la typographie desktop.

## Grille, conteneurs et rythme

| Élément                     | Valeur de production                                              |
| --------------------------- | ----------------------------------------------------------------- |
| Conteneur principal         | 1280 px maximum, centré.                                          |
| Conteneur du header         | 1440 px maximum; gutter fluide de 20 à 80 px entre 1280 et 1440.  |
| Largeur de lecture          | 680 px; variante large de 800 px.                                 |
| Gutter horizontal           | 20 px mobile, 40 px dès 768 px, 80 px dès 1024 px.                |
| Grille                      | 4 colonnes mobile, 12 colonnes dès 1024 px.                       |
| Gouttière de grille         | 12 px mobile, 24 px dès 768 px.                                   |
| Espacement de section       | 96 px mobile, 140 px dès 768 px.                                  |
| Header                      | 64 px mobile, 80 px dès 768 px.                                   |
| Navigation desktop complète | dès 1312 px; menu mobile en dessous pour éviter tout débordement. |

Les composants `Container` et les classes `.site-container`, `.section-block` et `.layout-grid` portent ces règles. Les espacements singuliers du prototype restent locaux lorsqu’ils ne forment pas une échelle réutilisable.

## Formes, profondeur et mouvement

- rayon subtil : 2 px, fidèle aux boutons et cadres presque carrés;
- bordure standard : 1 px;
- ombres : discrète pour le header, plus ample uniquement pour un élément élevé;
- transitions : 200 ms courtes, 300 ms normales, 400 ms pour le menu, 500 ms pour le header et 700 ms pour un média;
- easing éditorial : `cubic-bezier(0.4, 0, 0.2, 1)`;
- `prefers-reduced-motion: reduce` neutralise les animations non essentielles.

## Composants fondamentaux

| Composant        | Variantes ou responsabilités                                                             |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `Container`      | `full`, `narrow`, `reading`; élément HTML configurable.                                  |
| `Button`         | `primary`, `secondary`, `light`, `dark`, `text`, `icon`; lien, bouton ou état désactivé. |
| `TextLink`       | fond clair ou profond; filet animé optionnel.                                            |
| `Eyebrow`        | surtitre sémantique avec ton clair ou sombre.                                            |
| `SectionHeading` | alignement gauche ou centré, description nommée et niveau de titre configurable.         |
| `Divider`        | filet discret ou accent doré.                                                            |
| `IconButton`     | cible carrée de 48 px, SVG local fourni par le parent et libellé accessible obligatoire. |

Les états `hover`, `focus-visible`, `active` et `disabled` sont définis globalement. Aucune bibliothèque UI ou d’icônes n’est utilisée.

## Header et navigation

Le header est `fixed`, conformément au code Figma, même si son état persistant est appelé « sticky » dans le ticket. Sur un hero, il commence transparent puis devient ivoire à plus de 60 px de défilement avec bordure, léger flou et ombre. Sur une page claire, cet état est actif dès le chargement.

La navigation desktop conserve la typographie Manrope de 14 px, les espacements du prototype, le filet doré de la route active, le menu « Informations » et le CTA « Voir les horaires ». Toutes les destinations sont de vraies routes Astro.

Sous 1312 px, le menu mobile remplace la navigation complète. Il reprend le panneau bourgogne, les liens Cormorant de 24 px, les séparateurs, les coordonnées temporaires et l’action rapide Horaires.

## Menu mobile accessible

Le JavaScript natif gère seulement l’état indispensable :

- `aria-expanded`, `aria-controls`, `aria-hidden` et `inert`;
- focus initial dans le panneau et retour au déclencheur;
- fermeture avec Échap ou au clic sur un lien;
- piège de focus avec Tab et Maj+Tab;
- header déclaré modal pendant l’ouverture; logo, Horaires, Fermer et liens inclus dans la boucle de focus;
- contenu principal, footer et actions rapides rendus `inert` pendant l’ouverture;
- verrouillage du défilement de l’arrière-plan;
- défilement interne si la hauteur d’écran est réduite.

React n’apporte aucun bénéfice à cette interaction isolée et n’est donc pas hydraté.

## Footer

Le footer conserve la composition éditoriale sombre observée : identité plus large, phrase d’accueil manuscrite, coordonnées, secrétariat, navigation, informations pratiques et bande légale. Les contenus inconnus demeurent des placeholders explicites. Les liens téléphoniques, courriel et sociaux ne sont pas inventés.

Sous 1312 px, une barre d’actions rapides de 48 px minimum reste disponible au bas de l’écran. Elle tient compte de la zone sûre des appareils mobiles.

## Corrections d’accessibilité qui diffèrent légèrement de Figma

1. Le focus bicolore est plus visible que dans le prototype.
2. Les cibles principales atteignent 48 × 48 px.
3. Le petit texte informatif du footer utilise une opacité suffisante.
4. Le doré insuffisamment contrasté reste décoratif sur surface claire.
5. Un lien d’évitement, `aria-current` et des noms explicites de navigation sont ajoutés.
6. Le menu mobile possède une gestion complète du clavier et du focus.
7. Le nom temporaire de la paroisse peut revenir à la ligne sur petit écran au lieu d’être tronqué.
8. Le header a une largeur dédiée afin que l’identité, les sept entrées et les deux CTA ne débordent pas à 1280 px.
9. Un voile charbon de 10 % et un texte ivoire plein assurent le contraste AA de la navigation sur les zones claires du hero.

Ces corrections ne modifient ni la composition éditoriale, ni la hiérarchie, ni les proportions principales.

## Photographies

Les catégories disponibles sont : architecture extérieure, nef et intérieur, autel et célébrations, décorations liturgiques, Noël, détails architecturaux, art religieux et plaques historiques.

Elles pourront alimenter plus tard les héros, Notre paroisse, Première visite, la galerie, les événements saisonniers, les sections éditoriales, l’histoire, le contact et l’itinéraire. Aucune image ne doit être publiée avant confirmation des droits du photographe et des autorisations applicables; le consentement des personnes visibles doit être vérifié séparément.

## Validation de S1-T01

- comparaison structurelle avec `reference/figma-make-export/src/App.tsx`, `src/index.css` et les pages représentatives;
- captures Chrome aux largeurs 1440, 1280, 1024, 768, 430, 390 et 360 px;
- états vérifiés : transparent, sticky clair, menu mobile ouvert, palette, contrôles, focus clavier et footer;
- aucune largeur de document supérieure au viewport;
- menu contrôlé avec Tab et Échap, retour du focus, attributs ARIA et régions `inert`;
- aucune exception JavaScript, erreur console ou réponse locale HTTP en erreur;
- captures conservées uniquement dans le dossier temporaire de la machine, jamais dans Git.

## Limites du ticket

- aucune page publique complète n’est considérée comme migrée;
- l’identité, l’adresse, le téléphone, le courriel et les réseaux sociaux sont temporaires;
- les polices distantes pourront être auto-hébergées après vérification des licences;
- le recadrage et l’optimisation des photographies restent hors périmètre;
- les composants seront confrontés à chaque contexte réel pendant les tickets de pages.
