# Audit de l’export Figma Make

Date d’import : 25 juillet 2026

Archive source : `Maquettes site Web paroisse.zip`

SHA-256 de l’archive : `D0421B20BC9240888B4D5502362F12426609588A9220120FC395B75A5B9BB2F8`

## Stack de l’export

- React `19.2.4`;
- React DOM `19.2.4`;
- Vite `8.0.3`;
- TypeScript `5.9.3`, mode strict;
- Tailwind CSS et `@tailwindcss/vite` `4.2.2`;
- `@vitejs/plugin-react 6.0.1`;
- oxfmt `0.2.0`;
- pnpm lockfile version 9.

## Pages présentes

1. Accueil — `src/pages/Home.tsx`;
2. Horaires — `src/pages/Horaires.tsx`;
3. Notre paroisse — `src/pages/NotreParoisse.tsx`;
4. Première visite — `src/pages/PremiereVisite.tsx`;
5. Sacrements — `src/pages/Sacrements.tsx`;
6. Vie paroissiale — `src/pages/VieParoissiale.tsx`;
7. Événements — `src/pages/Evenements.tsx`;
8. Feuillets — `src/pages/Feuillets.tsx`;
9. Friperie — `src/pages/Friperie.tsx`;
10. Location de salle — `src/pages/LocationSalle.tsx`;
11. Galerie — `src/pages/Galerie.tsx`;
12. Contact — `src/pages/Contact.tsx`.

Aucune véritable page 404 et aucune page de détail ne sont implémentées.

## Navigation actuelle

`src/App.tsx` conserve une valeur `currentPage` dans un état React et choisit le composant à afficher. Les éléments de navigation sont des boutons qui changent cet état. Il n’y a ni URL distincte, ni historique du navigateur, ni route statique par page.

## Fichiers importants

- `src/App.tsx` : shell global, navigation simulée, header et footer;
- `src/pages/*.tsx` : maquettes de pages;
- `src/index.css` : polices, palette et utilitaires Tailwind;
- `src/imports/*.jpg` : neuf photographies originales;
- `src/imports/pasted_text/paroisse-website-mockups.md` : direction artistique et contenu demandé;
- `vite.config.ts` : configuration Vite et plugins Figma;
- `.figma/make/site.json` : métadonnées de prévisualisation;
- `AGENTS.md` et `CLAUDE.md` : consignes de l’environnement Figma.

## Parties à migrer

- intentions visuelles et hiérarchie des contenus;
- textes temporaires utiles;
- inventaire des interactions;
- motifs de header, footer et sections;
- tokens de couleurs et familles typographiques;
- composants React réellement interactifs, après revue;
- photographies autorisées.

## Parties à ne pas migrer

- `.figma/`;
- plugins Vite de configuration, overlay, refresh et Make Kit;
- `index.html`, `src/main.tsx` et le montage SPA;
- état `currentPage` et boutons servant de routeur;
- configuration de preview sur le port 8443;
- formulaires simulés par `setTimeout`;
- liens `#`, coordonnées entre crochets et données fictives;
- oxfmt et dépendances de l’environnement Vite lorsqu’elles ne servent pas Astro.

## Problèmes connus et risques

- aucune URL réelle par page;
- contenus et données codés en dur;
- formulaires sans backend;
- contrôles clavier et ARIA incomplets pour menus, FAQ, cartes cliquables et lightbox;
- liens téléphoniques et courriels contenant des placeholders;
- import distant Google Fonts;
- neuf JPEG lourds, de 3,22 à 8,00 Mo;
- répétition des mêmes images sur plusieurs grandes sections;
- noms de fichiers datés, avec underscores et suffixe `Copy`;
- `AGENTS.md` mentionne un `.mise.toml` absent;
- une photographie contient un adulte : autorisation de publication à confirmer.

## État des photographies

Neuf JPEG valides, tous en `4624 × 3468` et en orientation paysage, ont été copiés sans modification. Les hash des copies de production correspondent aux sources. Huit images ne montrent aucune personne visible; une image montre un adulte de profil/dos.

Voir [IMAGE_INVENTORY.md](IMAGE_INVENTORY.md).

## Stratégie de migration progressive

1. Stabiliser les tokens et le layout global.
2. Recréer chaque route dans `src/pages/`.
3. Migrer d’abord en Astro et HTML sémantique.
4. Conserver React uniquement pour l’état interactif utile.
5. Remplacer les données fictives lorsque les sources réelles sont validées.
6. Revoir accessibilité, responsive et droits photo à chaque lot.
7. Ajouter le CMS, les formulaires et le déploiement dans des tickets séparés.

L’export conservé sous `reference/figma-make-export/` reste la référence visuelle principale.
