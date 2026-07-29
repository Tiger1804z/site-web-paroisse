# Audit des routes restantes

Audit initial réalisé pendant S1-T08 et actualisé dans S1-T13 à partir de :

- `reference/figma-make-export/src/App.tsx`;
- tous les fichiers `reference/figma-make-export/src/pages/*.tsx`;
- `src/lib/navigation.ts`;
- `src/components/layout/Header.astro`;
- `src/components/layout/Footer.astro`;
- tous les fichiers de `src/pages/`;
- les liens internes des composants et sources locales.

## Routes publiques et état actuel

| Libellé visible              | Route attendue                   | Fichier Figma                  | Route Astro actuelle                      | État                  | Priorité recommandée                 | Dépendances ou contenu manquant                                                                                                                                        |
| ---------------------------- | -------------------------------- | ------------------------------ | ----------------------------------------- | --------------------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accueil                      | `/`                              | `Home.tsx`                     | `src/pages/index.astro`                   | terminé               | —                                    | Adresse et téléphone confirmés; courriel public et heures du secrétariat restent masqués.                                                                              |
| Notre paroisse               | `/notre-paroisse/`               | `NotreParoisse.tsx`            | `src/pages/notre-paroisse.astro`          | terminé               | —                                    | Validation éditoriale finale des faits historiques.                                                                                                                    |
| Horaires                     | `/horaires/`                     | `Horaires.tsx`                 | `src/pages/horaires.astro`                | terminé               | —                                    | Remplacement futur des placeholders par des horaires confirmés.                                                                                                        |
| Première visite              | `/premiere-visite/`              | `PremiereVisite.tsx`           | `src/pages/premiere-visite.astro`         | terminé               | —                                    | Coordonnées, stationnement et accessibilité à confirmer.                                                                                                               |
| Nos services                 | `/nos-services/`                 | `Sacrements.tsx` + ancien site | `src/pages/nos-services.astro`            | terminé, canonique    | Révision périodique des données 2026 | Mariage, initiation, baptême, funérailles, certificats, intentions, célébrations, paiements et location; tarifs et dates structurés dans la donnée.                    |
| Ancien Sacrements            | `/sacrements/`                   | `Sacrements.tsx`               | `src/pages/sacrements.astro`              | alias `noindex`       | Compatibilité historique             | Canonical et redirection HTML statique vers `/nos-services/`; une redirection HTTP permanente pourra être configurée à l’hébergement.                                  |
| Événements                   | `/evenements/`                   | `Evenements.tsx`               | `src/pages/evenements.astro`              | partiel               | Haute                                | S1-T07 est fusionné et la source `ParishEvent` est opérationnelle, mais la route reste `noindex` et la migration Figma complète doit être confirmée avant publication. |
| Vie paroissiale              | `/vie-paroissiale/`              | `VieParoissiale.tsx`           | `src/pages/vie-paroissiale.astro`         | terminé dans S1-T08   | —                                    | Confirmation des groupes, activités, responsables et coordonnées.                                                                                                      |
| Feuillets paroissiaux        | —                                | `Feuillets.tsx`                | aucune route                              | retiré                | —                                    | Décision du 29 juillet 2026 : pas de page Web de feuillets PDF. Route, navigation, composant d'accueil, CTA et champs Sanity supprimés.                                |
| Friperie                     | `/friperie/`                     | `Friperie.tsx`                 | `src/pages/friperie.astro`                | migré, `noindex`      | Validation éditoriale et photos      | Remplacer les prototypes, confirmer leurs droits temporaires, les horaires, les dons, l'accès et les coordonnées avant de retirer `noindex`.                           |
| Location de salle            | `/location-de-salle/`            | `LocationSalle.tsx`            | `src/pages/location-de-salle.astro`       | alias `noindex`       | Intégrée à Nos services              | Redirection statique vers `/nos-services/#location-de-salle`; tarifs et disponibilités sont communiqués manuellement par le secrétariat.                               |
| Galerie                      | `/galerie/`                      | `Galerie.tsx`                  | placeholder dans `src/pages/[slug].astro` | différée / `noindex`  | À réévaluer selon le besoin          | L’utilisateur conserve uniquement la mini-galerie de l’accueil; aucune page autonome ni promotion dans la navigation pour l’instant.                                   |
| Contact                      | `/contact/`                      | `Contact.tsx`                  | `src/pages/contact.astro`                 | frontend terminé      | Bloquée à la validation d’envoi      | Adresse, téléphone et carte confirmés; validation locale seulement. Aucun endpoint, SMTP, API, secret ou faux succès.                                                  |
| Nos annonceurs               | `/nos-annonceurs/`               | ancien site seulement          | `src/pages/nos-annonceurs.astro`          | complet, `noindex`    | Révision le 10 août 2026 ou après    | Quatre placements historiques à confirmer; aucun portrait ni annonceur n’est publié avant validation des ententes, coordonnées, logos, textes et droits.               |
| Ancien Merci aux annonceurs  | `/merci-a-nos-annonceurs/`       | ancien site seulement          | `src/pages/merci-a-nos-annonceurs.astro`  | alias `noindex`       | Compatibilité historique             | Canonical et redirection HTML vers `/nos-annonceurs/`; la variante accentuée du domaine historique exigera une règle d’hébergement.                                    |
| Politique de confidentialité | `/politique-de-confidentialite/` | aucun                          | placeholder dans `src/pages/[slug].astro` | placeholder           | Haute avant formulaire ou analytique | Texte juridique approuvé et inventaire des traitements de données.                                                                                                     |
| Mentions légales             | `/mentions-legales/`             | aucun                          | placeholder dans `src/pages/[slug].astro` | placeholder           | Moyenne                              | Propriétaire du site, responsable de publication et mentions approuvées.                                                                                               |
| Page introuvable             | toute route inconnue             | aucune page Figma              | `src/pages/404.astro`                     | terminé techniquement | —                                    | Revue finale du contenu lors du déploiement.                                                                                                                           |

`/verification/` est une route interne `noindex` du design system. Elle ne
figure pas dans la navigation publique et ne constitue pas une page de
contenu à migrer.

## Pages restantes du menu « Informations »

Le menu desktop, le menu mobile et le footer utilisent la même liste filtrée
`informationNavigation`. Contact et Nos annonceurs sont maintenant des pages
dédiées; aucune destination active du menu Informations ne mène vers un
placeholder.

Friperie répond maintenant par une page dédiée, mais reste `noindex`.
Location de salle fait partie de `/nos-services/` et son ancienne route reste
un alias technique `noindex`, absent du menu Informations.
Feuillets n'a plus ni route ni définition de navigation : la fonctionnalité Web
a été retirée le 29 juillet 2026.

Galerie est également conservée comme définition inactive et comme placeholder
`noindex`. La mini-galerie de l’accueil reste autonome et ne pointe pas vers
cette route.

Le frontend Contact de S1-T09 est intégré par S1-T12. La route demeure
`noindex` et le formulaire n’envoie rien : le choix du système d’envoi, la
validation serveur, la confidentialité et la gestion des secrets restent une
porte de livraison distincte.

Nos annonceurs est actif dans la navigation, mais demeure `noindex`. La page
reste utile sans collection active; sa source conserve quatre placements
historiques avec le statut `confirmation-required`, tous exclus du rendu
public. La confirmation est prévue avec la secrétaire le 10 août 2026 ou après
son retour.

## Décision Feuillets — retiré le 29 juillet 2026

Le site ne publiera pas de page Web de feuillets PDF. La fonctionnalité a été
retirée plutôt que laissée inactive : route, entrée de navigation,
`ParishBulletin.astro`, CTA de l'accueil, bloc de l'encadré Horaires, champs
Sanity et types associés.

Ce qui reste à confirmer le **11 août 2026** ne concerne plus le site :

- l'existence du feuillet papier lui-même;
- l'existence et les supports du programme publicitaire, dont les promesses
  commerciales ont été ramenées à la formulation générique « communications
  paroissiales » dans `src/data/advertisers.ts`.

## Contenus présents dans l'inventaire, sans page Figma autonome

| Contenu                      | Route proposée ou état            | État                         | Décision de backlog                                                        |
| ---------------------------- | --------------------------------- | ---------------------------- | -------------------------------------------------------------------------- |
| Catéchèse                    | route à décider                   | absent                       | Ne pas créer avant confirmation des programmes et inscriptions.            |
| Soutien à la communauté      | fusion possible avec `/friperie/` | absent                       | Confirmer la portée avant de créer une route distincte.                    |
| Pèlerinages                  | documents `ParishEvent`           | intégré aux événements datés | Ne pas créer une seconde source ni une page générale sans besoin confirmé. |
| Pages de détail de services  | route future à décider            | absent                       | Attendre les contenus détaillés et la validation des besoins et slugs.     |
| Pages de détail d'événements | route future à décider            | absent                       | Ne pas créer avant qu'un contenu détaillé réel le justifie.                |

## Liens et redirections

- `/sacrements/` est un alias statique `noindex`, canonical
  `/nos-services/`, avec redirection HTML vers la page canonique.
- `/location-de-salle/` est un alias statique `noindex`, canonical
  `/nos-services/`, avec redirection HTML vers l’ancre de la section.
- `/merci-a-nos-annonceurs/` est un alias statique `noindex`, canonical
  `/nos-annonceurs/`, avec redirection HTML. La variante accentuée de l’ancien
  domaine exigera une redirection à l’hébergement.
- La sortie Astro statique ne produit pas de statut HTTP 301; l’hébergement
  pourra remplacer ces compatibilités par des redirections permanentes.
- Toutes les destinations actives de navigation répondent par des pages
  dédiées.
- Les placeholders restent `noindex`.
- Friperie reste aussi `noindex` pendant sa phase de photographies et de
  confirmation.
- Contact répond par son frontend complet `noindex`, sans envoi.
- Galerie répond encore en placeholder, mais aucun lien public ne la promeut.
- La mini-galerie de l’accueil exclut les images aux droits ou consentements en
  attente.
- Aucun bouton Figma servant de routeur React n'est conservé.
- Aucun lien public ne doit utiliser `href="#"`.
