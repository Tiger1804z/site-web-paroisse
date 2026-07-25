# Architecture

## Objectif

Cette fondation transforme un prototype visuel Figma Make en projet de production maintenable, sans entreprendre encore la migration complète de l’interface.

## Pourquoi Astro

Le site paroissial sera principalement composé de contenu éditorial, d’horaires, d’événements et de renseignements pratiques. Astro produit du HTML statique par défaut, limite le JavaScript envoyé au navigateur et fournit un routage fondé sur les fichiers. Ce modèle favorise la performance, le référencement, la résilience et l’accessibilité.

La sortie `static` est déclarée explicitement dans `astro.config.mjs`. Aucun adaptateur serveur n’est installé.

## Pourquoi React reste disponible

React est conservé pour deux cas précis :

1. migrer progressivement un composant Figma complexe lorsque sa réécriture immédiate n’apporte pas de bénéfice;
2. hydrater un élément qui nécessite réellement un état côté navigateur.

Les pages, le layout et la navigation doivent rester en Astro lorsque React n’est pas nécessaire. Le composant `ReactIntegrationCheck.tsx` est seulement une preuve technique et non un modèle d’architecture pour toutes les sections.

## Pourquoi le prototype Figma n’est pas l’application de production

Le prototype affiche toutes les « pages » depuis un état React central. Il ne fournit ni URL distincte, ni navigation native, ni génération statique par route. Sa configuration Vite contient des plugins de prévisualisation, d’overlay et de kit propres à Figma Make.

Ces éléments sont utiles dans l’environnement de création, mais inutiles et risqués en production. L’export est donc archivé sous `reference/` et migré par petits lots contrôlés.

## Organisation des routes

Chaque fichier de `src/pages/` devient une route :

- `src/pages/index.astro` → `/`;
- `src/pages/verification.astro` → `/verification`;
- `src/pages/404.astro` → page d’erreur statique.

Les futures pages utiliseront des noms d’URL français, stables et lisibles. React Router ne sera pas ajouté.

## Organisation des composants

- `components/layout/` : éléments globaux comme le header et le footer;
- `components/sections/` : grandes sections propres à une ou plusieurs pages;
- `components/ui/` : petits composants réutilisables et accessibles;
- `layouts/` : structure de document, métadonnées et import global des styles;
- `lib/` : fonctions pures et adaptateurs futurs;
- `types/` : types partagés;
- `assets/` : actifs traités ou référencés par Astro.

## Migration progressive

Un composant du prototype est d’abord évalué :

1. conserver son intention visuelle et son contenu temporaire;
2. remplacer les boutons de navigation simulée par des liens Astro;
3. convertir le HTML en structure sémantique;
4. vérifier clavier, focus, libellés et contraste;
5. utiliser Astro par défaut;
6. conserver React seulement si une interaction le justifie;
7. relier les données au CMS lors d’un ticket ultérieur.

## Ajout futur d’un CMS

Le CMS sera intégré comme source de données, pas comme moteur de routage côté client. Astro pourra charger les contenus pendant la construction statique et générer les routes nécessaires. Un mode hybride ou une reconstruction déclenchée pourra être évalué lorsque les besoins éditoriaux, la fréquence de publication et l’hébergeur seront connus.

Aucun package CMS n’est installé pendant l’initialisation.
