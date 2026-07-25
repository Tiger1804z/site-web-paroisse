# Design system initial

## Statut

Cette configuration est une base technique, pas une décision esthétique définitive. L’export Figma Make demeure la référence visuelle principale. Les couleurs, espacements, proportions et polices pourront être raffinés pendant la migration.

## Palette

Les tokens Tailwind 4 sont définis dans `src/styles/global.css`.

| Token                   | Valeur    | Intention initiale                      |
| ----------------------- | --------- | --------------------------------------- |
| `--color-ivory`         | `#F5F3EE` | Fond principal chaleureux.              |
| `--color-paper`         | `#E8E3DA` | Surface secondaire.                     |
| `--color-surface`       | `#FCFBF8` | Surface claire et élevée.               |
| `--color-burgundy`      | `#4A1624` | Couleur de marque et appels à l’action. |
| `--color-burgundy-dark` | `#2E1019` | État sombre et survol.                  |
| `--color-plum`          | `#60445D` | Accent secondaire.                      |
| `--color-brick`         | `#68433A` | Accent architectural.                   |
| `--color-wood`          | `#70452E` | Accent chaleureux lié au bois.          |
| `--color-charcoal`      | `#1C1918` | Texte principal et fonds foncés.        |
| `--color-muted`         | `#6F6862` | Texte secondaire.                       |
| `--color-gold`          | `#AA8B52` | Accent premium et focus.                |
| `--color-rose`          | `#D8B3BE` | Accent doux.                            |
| `--color-marian`        | `#6F9EB8` | Accent bleu.                            |

Les contrastes doivent être vérifiés dans les vrais composants; la présence d’un token ne garantit pas qu’une combinaison de couleurs est accessible.

## Typographie

- **Cormorant Garamond** : titres;
- **Manrope** : texte courant et interface;
- **Allura** : accents manuscrits rares.

Un seul import Google Fonts regroupe les trois familles. Ce choix est temporaire afin de préserver l’intention du prototype sans multiplier les requêtes. L’auto-hébergement, les licences, les sous-ensembles et les métriques de chargement seront évalués plus tard.

## Principes initiaux

- HTML sémantique avant composition visuelle;
- focus visible;
- respect de `prefers-reduced-motion`;
- JavaScript uniquement lorsqu’il ajoute une fonction réelle;
- photographie utilisée avec une description et des droits vérifiés;
- composants Astro par défaut, React sur justification.

## À ne pas figer pendant l’initialisation

- échelle typographique finale;
- espacements définitifs;
- variantes de boutons;
- iconographie;
- traitement, recadrage ou compression des photos;
- choix final d’hébergement des polices.
