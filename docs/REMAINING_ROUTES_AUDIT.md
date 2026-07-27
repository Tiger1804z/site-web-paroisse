# Audit des routes restantes

Audit initial réalisé pendant S1-T08 et actualisé dans S1-T10 à partir de :

- `reference/figma-make-export/src/App.tsx`;
- tous les fichiers `reference/figma-make-export/src/pages/*.tsx`;
- `src/lib/navigation.ts`;
- `src/components/layout/Header.astro`;
- `src/components/layout/Footer.astro`;
- tous les fichiers de `src/pages/`;
- les liens internes des composants et sources locales.

## Routes publiques et état actuel

| Libellé visible              | Route attendue                   | Fichier Figma        | Route Astro actuelle                      | État                  | Priorité recommandée                 | Dépendances ou contenu manquant                                                                                                                                        |
| ---------------------------- | -------------------------------- | -------------------- | ----------------------------------------- | --------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accueil                      | `/`                              | `Home.tsx`           | `src/pages/index.astro`                   | terminé               | —                                    | Les coordonnées et horaires définitifs restent à confirmer.                                                                                                            |
| Notre paroisse               | `/notre-paroisse/`               | `NotreParoisse.tsx`  | `src/pages/notre-paroisse.astro`          | terminé               | —                                    | Validation éditoriale finale des faits historiques.                                                                                                                    |
| Horaires                     | `/horaires/`                     | `Horaires.tsx`       | `src/pages/horaires.astro`                | terminé               | —                                    | Remplacement futur des placeholders par des horaires confirmés.                                                                                                        |
| Première visite              | `/premiere-visite/`              | `PremiereVisite.tsx` | `src/pages/premiere-visite.astro`         | terminé               | —                                    | Coordonnées, stationnement et accessibilité à confirmer.                                                                                                               |
| Sacrements                   | `/sacrements/`                   | `Sacrements.tsx`     | `src/pages/sacrements.astro`              | terminé pour l'aperçu | Moyenne pour les détails futurs      | Contenus validés et futurs documents `sacrament` avant toute route `[slug]`.                                                                                           |
| Événements                   | `/evenements/`                   | `Evenements.tsx`     | `src/pages/evenements.astro`              | partiel               | Haute                                | S1-T07 est fusionné et la source `ParishEvent` est opérationnelle, mais la route reste `noindex` et la migration Figma complète doit être confirmée avant publication. |
| Vie paroissiale              | `/vie-paroissiale/`              | `VieParoissiale.tsx` | `src/pages/vie-paroissiale.astro`         | terminé dans S1-T08   | —                                    | Confirmation des groupes, activités, responsables et coordonnées.                                                                                                      |
| Feuillets paroissiaux        | `/feuillets-paroissiaux/`        | `Feuillets.tsx`      | placeholder dans `src/pages/[slug].astro` | bloqué / différé      | Révision le 10 août 2026 ou après    | Aucun PDF disponible. Confirmer la volonté de publier, les fichiers, dates, droits, politique d'archives et responsable des mises à jour avec la secrétaire.           |
| Friperie                     | `/friperie/`                     | `Friperie.tsx`       | `src/pages/friperie.astro`                | migré, `noindex`      | Validation éditoriale et photos      | Remplacer les prototypes, confirmer leurs droits temporaires, les horaires, les dons, l'accès et les coordonnées avant de retirer `noindex`.                           |
| Location de salle            | `/location-de-salle/`            | `LocationSalle.tsx`  | placeholder dans `src/pages/[slug].astro` | placeholder           | Moyenne                              | Capacité, tarifs, disponibilités, conditions et processus de demande validés.                                                                                          |
| Galerie                      | `/galerie/`                      | `Galerie.tsx`        | placeholder dans `src/pages/[slug].astro` | placeholder           | Moyenne                              | Sélection d'images autorisées, crédits, consentements et lightbox accessible.                                                                                          |
| Contact                      | `/contact/`                      | `Contact.tsx`        | placeholder dans `src/pages/[slug].astro` | en pause hors S1-T10  | Bloquée à la validation SMTP         | S1-T09 est conservé sur `feature/s1-t09-contact-page-1to1`, non fusionné dans `staging`; aucune implémentation Contact, SMTP, courriel ou serverless dans S1-T10.      |
| Politique de confidentialité | `/politique-de-confidentialite/` | aucun                | placeholder dans `src/pages/[slug].astro` | placeholder           | Haute avant formulaire ou analytique | Texte juridique approuvé et inventaire des traitements de données.                                                                                                     |
| Mentions légales             | `/mentions-legales/`             | aucun                | placeholder dans `src/pages/[slug].astro` | placeholder           | Moyenne                              | Propriétaire du site, responsable de publication et mentions approuvées.                                                                                               |
| Page introuvable             | toute route inconnue             | aucune page Figma    | `src/pages/404.astro`                     | terminé techniquement | —                                    | Revue finale du contenu lors du déploiement.                                                                                                                           |

`/verification/` est une route interne `noindex` du design system. Elle ne
figure pas dans la navigation publique et ne constitue pas une page de
contenu à migrer.

## Pages restantes du menu « Informations »

Le menu desktop, le menu mobile et le footer utilisent la même liste filtrée
`informationNavigation`. Après S1-T10, trois destinations publiques restent
des placeholders :

1. Contact — `/contact/`;
2. Location de salle — `/location-de-salle/`;
3. Galerie — `/galerie/`.

Friperie répond maintenant par une page dédiée, mais reste `noindex`.
Feuillets est conservé comme définition inactive et comme placeholder
`noindex`; il est absent du menu desktop, du menu mobile, du footer, du bloc
Feuillets de l'accueil, du CTA Horaires de l'accueil et des promotions de la
page Horaires.

Contact est volontairement en pause sur sa branche distincte, à la porte de
validation SMTP. S1-T10 ne modifie ni cette branche ni son implémentation.

## Décision Feuillets — bloqué / différé

Aucun véritable feuillet PDF n'est actuellement disponible. La page ne doit
pas être livrée vide ni promue comme une archive existante.

Condition de reprise :

- confirmer que la paroisse souhaite publier les feuillets;
- obtenir les vrais fichiers PDF;
- confirmer les dates et les droits de publication;
- définir la politique d'archives;
- déterminer qui effectuera les mises à jour.

Date de révision : **10 août 2026 ou après le retour de la secrétaire**.

## Contenus présents dans l'inventaire, sans page Figma autonome

| Contenu                       | Route proposée ou état            | État                         | Décision de backlog                                                        |
| ----------------------------- | --------------------------------- | ---------------------------- | -------------------------------------------------------------------------- |
| Catéchèse                     | route à décider                   | absent                       | Ne pas créer avant confirmation des programmes et inscriptions.            |
| Soutien à la communauté       | fusion possible avec `/friperie/` | absent                       | Confirmer la portée avant de créer une route distincte.                    |
| Pèlerinages                   | documents `ParishEvent`           | intégré aux événements datés | Ne pas créer une seconde source ni une page générale sans besoin confirmé. |
| Pages de détail de sacrements | `/sacrements/[slug]/` future      | absent                       | Attendre les contenus détaillés et la validation des slugs.                |
| Pages de détail d'événements  | route future à décider            | absent                       | Ne pas créer avant qu'un contenu détaillé réel le justifie.                |

## Liens et redirections

- Aucune redirection publique n'est actuellement définie.
- Toutes les destinations de navigation répondent grâce aux pages migrées ou
  aux placeholders statiques.
- Les placeholders restent `noindex`.
- Friperie reste aussi `noindex` pendant sa phase de photographies et de
  confirmation.
- Feuillets répond encore en placeholder, mais aucun lien public ne le promeut.
- Aucun bouton Figma servant de routeur React n'est conservé.
- Aucun lien public ne doit utiliser `href="#"`.
