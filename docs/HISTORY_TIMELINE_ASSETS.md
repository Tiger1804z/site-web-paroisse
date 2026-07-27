# Provenance des illustrations de la chronologie

## Méthode

Inspection réalisée le 26 juillet 2026 sur les fichiers fournis dans
`Downloads`, avant toute copie. Sharp a vérifié la signature, les dimensions,
l’espace colorimétrique et les canaux. SHA-256 a été calculé sur chaque fichier
source.

Contrairement à l’attente initiale, les huit fichiers sont des PNG **RGB**
8 bits, sans transparence. Ils mesurent tous `1122 × 1402 px`, sont orientés en
portrait et contiennent du texte intégré aux pixels.

Poids total des sources : **21 331 827 octets (20,34 Mio)**.

| Chapitre             | Fichier de production                   |    Octets | SHA-256                                                            | Observations                                                                                                                        |
| -------------------- | --------------------------------------- | --------: | ------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| Avant 1959           | `01-avant-1959.png`                     | 2 814 420 | `75d61c03f343985e806a80af369a62927a566bc18fb88b3b132ae4991d7c32f8` | Vue aérienne, rues et terrain générés; ne constitue ni une archive ni un plan authentique.                                          |
| Fondation            | `02-fondation-1959.png`                 | 2 680 762 | `452e7b74f5f7530d244a4a8eb826c3b644d386ea643b30b6f0002c091f084219` | Portrait non documentaire et faux décret. Une mention incohérente de « Saint-Charles-Borromée » apparaît dans le document illustré. |
| Achat du terrain     | `03-achat-terrain-1960.png`             | 2 932 608 | `59ea0660c635364a55f78a78fd54e39d7915fe4dd001111f3cfb8444e01e32e8` | Plan, parcelle, numéros et annotations générés; aucune valeur cadastrale.                                                           |
| Paroisse sans église | `04-paroisse-sans-eglise-1959-1963.png` | 2 189 470 | `e77b96b934b65fb4fc1a8ac1df2c1faa438650301b0479268f6216bb126d2206` | Prêtre, adultes, enfants et scène ancienne générés; inscription murale imparfaite.                                                  |
| Construction         | `05-construction-eglise-1963-1964.png`  | 2 779 410 | `1303bbd7415f0b35e9e974c4381c2f05baa9aadd2304d922147ddc72c08ad13b` | Bâtiment, chantier et portraits des architectes générés; aucune ressemblance authentifiée.                                          |
| Architecture         | `06-architecture-1964.png`              | 2 506 417 | `3384ed8abaa7a244dd2685ed83b5a28573f00dd9807dccb2d5264237b861b4a3` | Représentation artistique des matériaux, du chœur, des bancs et du fer forgé.                                                       |
| Évolution            | `07-evolution-vers-1990.png`            | 2 759 441 | `6a63ef56d9340db262b2c6cb178a35a863ae354bf020556116c336f338f014a8` | Collage généré imitant des photographies de friperie, baptistère et salle.                                                          |
| Aujourd’hui          | `08-patrimoine-vivant-aujourdhui.png`   | 2 669 299 | `1f9c751ecab77828fd3afce27e941c95945f31082fc25c27d08a08c1f28a308c` | Foule, bâtiment nocturne et événement générés. La mention visuelle de concerts ne prouve aucune activité actuelle.                  |

## Classification commune

Chaque fichier est classé :

> Illustration artistique générée — non documentaire.

Ces images ne sont ni des photographies d’archives, ni des reproductions
officielles de documents, ni des portraits vérifiés. Elles ne doivent pas être
utilisées pour confirmer un visage, un plan, une signature, une apparence
historique ou un événement.

## Stratégie de production

Une seule copie source, inchangée pixel pour pixel, est conservée dans
`src/assets/images/history-timeline/`. Astro génère au build les variantes WebP
responsives nécessaires; aucune seconde collection d’originaux ou de WebP
source n’est versionnée.

Les huit images :

- ne sont jamais préchargées;
- utilisent `loading="lazy"` et `decoding="async"`;
- réservent leur ratio `1122 / 1402`;
- restent entièrement visibles avec `object-fit: contain`;
- pourront être remplacées par des versions sans texte sans changer les
  données ni le composant.

## Recommandation

Avant la production finale, régénérer les huit illustrations sans numéro, date,
titre, paragraphe, faux document ou fausse légende. Astro ou Sanity pourra alors
afficher tout le récit en véritable HTML, sans duplication visuelle ni
affirmation involontaire inscrite dans les pixels.
