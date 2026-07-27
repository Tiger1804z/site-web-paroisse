# Rythme éditorial de l’accueil

## Intention

Le raffinement S1-T11 enrichit la page d’accueil sans reproduire un site
externe. L’Oratoire Saint-Joseph sert uniquement de référence de rythme :
alternance de grandes respirations, de blocs informatifs plus denses, de
passages clairs et sombres et de formats photographiques variés.

La palette, les contenus, les composants, les formes et les animations restent
propres à la Paroisse Saint-René-Goupil.

## Audit avant raffinement

Trois zones donnaient une impression de contenu incomplet :

1. « Vivre la paroisse » concentrait quatre petites cartes au centre d’une
   section haute;
2. « À votre service » répétait deux panneaux de même poids sans présenter
   l’étendue réelle des services;
3. la transition entre les services, la galerie et le CTA final manquait d’un
   passage spirituel plus intime.

La section du vitrail vivant était déjà pertinente, mais sa respiration était
un peu longue par rapport à sa densité. Son padding et son écart de grille ont
été légèrement resserrés et le vitrail a gagné en présence.

## Séquence actuelle

1. hero cinématique sombre;
2. accueil clair et vitrail vivant;
3. horaires sur fond charbon;
4. activités à venir;
5. grande scène photographique « Vivre la paroisse »;
6. aperçu asymétrique de Nos services et de la friperie;
7. interlude sombre de prière aux lampions;
8. carrousel éditorial centré de photographies réelles de la paroisse;
9. informations de visite et CTA final.

Cette séquence densifie uniquement les zones qui semblaient incomplètes. Les
horaires et les événements demeurent faciles à trouver.

## Vocabulaire d’images

`EditorialImageFrame.astro` définit cinq variantes contrôlées :

- `arch`;
- `landscape`;
- `organic`;
- `oval`;
- `portrait-offset`.

La page n’emploie pas toutes les variantes à la fois. L’accueil utilise surtout
l’arche, la forme organique, les paysages/portraits de la galerie et le
plein-cadre de « Vivre la paroisse ». Les formes n’ajoutent aucun sens
essentiel et conservent un rectangle propre lorsque les techniques de masque
ne sont pas disponibles.

## Mouvement

- le hero conserve sa lentille et sa boucle existantes;
- le vitrail demeure l’animation principale de sa section;
- « Vivre la paroisse » utilise le contrôleur partagé pour une apparition
  verticale de 14 px, 480 ms et un décalage de 80 ms;
- la galerie utilise une composition manuelle en cinq profondeurs : l’image
  courante domine au centre, les voisines diminuent vers les côtés et les
  flèches ou gestes tactiles déplacent la sélection. Elle ne défile pas seule;
  un cadre fin, une légende synchronisée et une lightbox accessible renforcent
  l’image active sans créer une page Galerie séparée;
- les autres nouveaux blocs utilisent seulement les révélations secondaires
  déjà prévues par le système.

Sans JavaScript et avec `prefers-reduced-motion: reduce`, tous les contenus sont
immédiatement visibles. Sans JavaScript, la galerie redevient une bande
horizontale native; avec reduced motion, ses changements d’état sont
instantanés.

## Médias

Les images éditoriales sous `src/assets/images/home/editorial/` sont transformées
par `astro:assets`. Seul le hero charge une image en priorité; les nouveaux
visuels situés plus bas utilisent `loading="lazy"`, des largeurs responsives et
une qualité de transformation raisonnable.

Les œuvres et photographies provenant de banques d’images ne sont jamais
présentées comme des vues documentaires de Saint-René-Goupil.
