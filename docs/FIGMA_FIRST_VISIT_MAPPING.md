# Cartographie Figma — Première visite

## Méthode

La cartographie repose sur le fichier réel
`reference/figma-make-export/src/pages/PremiereVisite.tsx`, puis sur
`App.tsx`, `main.tsx` et `index.css`. Le code exporté fixe l’ordre, les
proportions et le responsive. Les textes sont adaptés seulement lorsqu’une
affirmation pratique n’est pas confirmée par la paroisse.

| Section                | Source Figma                         | Structure observée                                                                                 | Contenu                                                         | Images                                                                                                                                             | Composant Astro cible        | Responsive                               | Notes                                                                                                                                |
| ---------------------- | ------------------------------------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Hero                   | `PremiereVisite.tsx`, lignes 13–31   | Fond charbon, ligne lumineuse verticale, conteneur 1280 px, contenu aligné à gauche, `pt-28 pb-20` | Eyebrow, H1 et introduction accueillante                        | Aucune dans l’export                                                                                                                               | `FirstVisitHero.astro`       | H1 48/64/76 px; gutters 20/40/80 px      | Le header Figma est clair sur cette route, car `App.tsx` ne classe pas Première visite parmi les pages à hero transparent.           |
| Guide pratique         | `PremiereVisite.tsx`, lignes 33–55   | Fond ivoire, titre centré, grille de six panneaux papier, bordure or fine                          | Six étapes numérotées                                           | Aucune                                                                                                                                             | `VisitPreparation.astro`     | 1 colonne, 2 dès 768 px, 3 dès 1024 px   | Adresse, signalisation, transport, accessibilité et présence d’accueillants doivent être remplacés par des formulations à confirmer. |
| Déroulement            | `PremiereVisite.tsx`, lignes 57–83   | Fond papier, largeur 900 px, quatre panneaux ivoire empilés avec filet vertical doré               | Quatre grands moments de la célébration                         | Aucune                                                                                                                                             | `WhatToExpect.astro`         | Empilement conservé à toutes les tailles | Le contenu doit rester général; aucune durée précise ni règle canonique détaillée.                                                   |
| Informations pratiques | `PremiereVisite.tsx`, lignes 85–137  | Fond ivoire, grille 2 colonnes, liste de coordonnées, deux CTA, panneau 360 px                     | Adresse, téléphone, courriel, secrétariat, horaires et contact  | Le prototype affiche une fausse carte; une photographie locale d’arrivée peut occuper le même panneau sans prétendre montrer une entrée officielle | `PracticalInformation.astro` | 1 colonne puis 2 dès 1024 px             | Les coordonnées globales sont des placeholders; elles appartiendront à `siteSettings`. Aucune carte externe n’est intégrée.          |
| FAQ                    | `PremiereVisite.tsx`, lignes 139–177 | Fond papier, largeur 800 px, quatre accordéons ivoire, bordure or                                  | Questions sur l’accueil, l’arrivée, la communion et les enfants | Aucune                                                                                                                                             | `FirstVisitFaq.astro`        | Même pile sur toutes les tailles         | `useState` et les boutons React deviennent des `details/summary` natifs, accessibles au clavier et sans JavaScript client.           |

## Valeurs visuelles observées

- largeur maximale principale : `1280px`;
- largeur du déroulement : `900px`;
- largeur de la FAQ : `800px`;
- gutters : `20px`, `40px` à 768 px, `80px` à 1024 px;
- sections : `96px` vertical sur mobile et `140px` à partir de 768 px;
- grille des étapes : `1 / 2 / 3` colonnes aux seuils `0 / 768 / 1024px`;
- panneaux : fond papier ou ivoire, bordure or translucide, sans gros rayon;
- titres : Cormorant Garamond, graisse 600;
- corps : Manrope, interlignage généreux;
- transitions : uniquement couleurs et rotation discrète du chevron;
- aucun collage, carrousel, photographie de hero ou animation d’apparition.

## Séparation contenu et présentation

### Contenu propre à `firstVisitPage`

- hero et message de bienvenue;
- étapes de préparation;
- déroulement général;
- libellés des informations pratiques;
- accessibilité et familles sous forme prudente;
- FAQ;
- CTA;
- activation des sections facultatives.

### Contenu global futur de `siteSettings`

- nom officiel;
- adresse;
- téléphone;
- courriel;
- heures du secrétariat;
- réseaux sociaux.

Ces valeurs ne doivent pas être répétées comme des données confirmées dans la
page. La source locale utilise des placeholders jusqu’à leur validation.

### Présentation restant dans le code

- ordre des sections;
- grilles, largeurs, espacements et breakpoints;
- palette, typographie et bordures;
- composant `details/summary`;
- hiérarchie des titres et règles d’accessibilité;
- routes Astro et comportement du header.

## Informations non confirmées

- adresse, téléphone, courriel et heures du secrétariat;
- stationnement, transport en commun et signalisation;
- entrée principale et accès précis;
- installations adaptées;
- durée habituelle d’une célébration;
- présence d’une équipe d’accueil;
- services ou locaux pour les enfants;
- consignes particulières données sur place.

## Divergences nécessaires

1. Les affirmations opérationnelles du prototype deviennent des placeholders ou
   des formulations à confirmer.
2. La FAQ React devient du HTML natif, sans modifier sa composition visuelle.
3. Le panneau de carte factice peut utiliser une photographie locale factuelle;
   aucune adresse, entrée ou accessibilité n’en sera déduite.
4. Le titre de route public reste « Première visite », tandis que le H1 reprend
   la formulation Figma « Votre première visite ».
5. Le header reste clair au-dessus du hero charbon, conformément au véritable
   comportement de `App.tsx`.
