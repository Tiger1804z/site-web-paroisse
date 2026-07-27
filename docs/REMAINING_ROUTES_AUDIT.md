# Audit des routes restantes

Audit réalisé pendant S1-T08 à partir de :

- `reference/figma-make-export/src/App.tsx`;
- tous les fichiers `reference/figma-make-export/src/pages/*.tsx`;
- `src/lib/navigation.ts`;
- `src/components/layout/Header.astro`;
- `src/components/layout/Footer.astro`;
- tous les fichiers de `src/pages/`;
- les liens internes des composants et sources locales.

## Routes publiques et état actuel

| Libellé visible              | Route attendue                   | Fichier Figma        | Route Astro actuelle                      | État                                | Priorité recommandée                 | Dépendances ou contenu manquant                                                                                                                                        |
| ---------------------------- | -------------------------------- | -------------------- | ----------------------------------------- | ----------------------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accueil                      | `/`                              | `Home.tsx`           | `src/pages/index.astro`                   | terminé                             | —                                    | Adresse et téléphone confirmés dans S1-T09; courriel et horaires définitifs restent à confirmer.                                                                       |
| Notre paroisse               | `/notre-paroisse/`               | `NotreParoisse.tsx`  | `src/pages/notre-paroisse.astro`          | terminé                             | —                                    | Validation éditoriale finale des faits historiques.                                                                                                                    |
| Horaires                     | `/horaires/`                     | `Horaires.tsx`       | `src/pages/horaires.astro`                | terminé                             | —                                    | Remplacement futur des placeholders par des horaires confirmés.                                                                                                        |
| Première visite              | `/premiere-visite/`              | `PremiereVisite.tsx` | `src/pages/premiere-visite.astro`         | terminé                             | —                                    | Coordonnées, stationnement et accessibilité à confirmer.                                                                                                               |
| Sacrements                   | `/sacrements/`                   | `Sacrements.tsx`     | `src/pages/sacrements.astro`              | terminé pour l'aperçu               | Moyenne pour les détails futurs      | Contenus validés et futurs documents `sacrament` avant toute route `[slug]`.                                                                                           |
| Événements                   | `/evenements/`                   | `Evenements.tsx`     | `src/pages/evenements.astro`              | partiel                             | Haute                                | S1-T07 est fusionné et la source `ParishEvent` est opérationnelle, mais la route reste `noindex` et la migration Figma complète doit être confirmée avant publication. |
| Vie paroissiale              | `/vie-paroissiale/`              | `VieParoissiale.tsx` | `src/pages/vie-paroissiale.astro`         | terminé dans S1-T08                 | —                                    | Confirmation des groupes, activités, responsables et coordonnées.                                                                                                      |
| Feuillets paroissiaux        | `/feuillets-paroissiaux/`        | `Feuillets.tsx`      | placeholder dans `src/pages/[slug].astro` | placeholder                         | Haute                                | Feuillets réels, archive PDF, dates, droits des documents et modèle de collection.                                                                                     |
| Friperie                     | `/friperie/`                     | `Friperie.tsx`       | placeholder dans `src/pages/[slug].astro` | placeholder                         | Haute                                | Mission, horaires, dons acceptés, conditions, accès et contacts confirmés.                                                                                             |
| Location de salle            | `/location-de-salle/`            | `LocationSalle.tsx`  | placeholder dans `src/pages/[slug].astro` | placeholder                         | Moyenne                              | Capacité, tarifs, disponibilités, conditions et processus de demande validés.                                                                                          |
| Galerie                      | `/galerie/`                      | `Galerie.tsx`        | placeholder dans `src/pages/[slug].astro` | placeholder                         | Moyenne                              | Sélection d'images autorisées, crédits, consentements et lightbox accessible.                                                                                          |
| Contact                      | `/contact/`                      | `Contact.tsx`        | `src/pages/contact.astro`                 | frontend terminé / envoi en attente | Porte SMTP obligatoire               | Courriel officiel, politique approuvée, hébergement, endpoint, destinataire, validation serveur et stratégie anti-spam.                                                |
| Politique de confidentialité | `/politique-de-confidentialite/` | aucun                | placeholder dans `src/pages/[slug].astro` | placeholder                         | Haute avant formulaire ou analytique | Texte juridique approuvé et inventaire des traitements de données.                                                                                                     |
| Mentions légales             | `/mentions-legales/`             | aucun                | placeholder dans `src/pages/[slug].astro` | placeholder                         | Moyenne                              | Propriétaire du site, responsable de publication et mentions approuvées.                                                                                               |
| Page introuvable             | toute route inconnue             | aucune page Figma    | `src/pages/404.astro`                     | terminé techniquement               | —                                    | Revue finale du contenu lors du déploiement.                                                                                                                           |

`/verification/` est une route interne `noindex` du design system. Elle ne
figure pas dans la navigation publique et ne constitue pas une page de
contenu à migrer.

## Pages restantes du menu « Informations »

Le menu desktop, le menu mobile et le footer utilisent la même liste
`informationNavigation`. Après la préparation frontend de S1-T09, quatre
destinations restent des placeholders :

1. Feuillets paroissiaux — `/feuillets-paroissiaux/`;
2. Friperie — `/friperie/`;
3. Location de salle — `/location-de-salle/`;
4. Galerie — `/galerie/`.

Contact répond maintenant avec sa composition finale, mais reste `noindex` et
sans envoi réel jusqu’à la validation du courriel officiel, de la
confidentialité et de l’architecture serveur. La prochaine migration de route
actionnable est Feuillets paroissiaux si ses PDF et leurs droits sont
disponibles; Friperie vient ensuite lorsque ses informations opérationnelles
sont confirmées. La politique de confidentialité reste une dépendance
prioritaire avant l’activation du formulaire, mais exige un texte approuvé.

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
- Aucun bouton Figma servant de routeur React n'est conservé.
- Aucun lien public ne doit utiliser `href="#"`.
