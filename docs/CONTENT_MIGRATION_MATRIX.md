# Matrice de migration du contenu

Cette matrice couvre toutes les pages trouvées dans la navigation du site
existant le 25 juillet 2026. « Design disponible » décrit l’export Figma ou les
composants déjà migrés; il ne signifie pas que la page publique est terminée.

| Page existante             | Destination future                                        | Action                                           | Priorité | Contenu stable                                               | Contenu à confirmer                                                                                    | Design disponible                                                   |
| -------------------------- | --------------------------------------------------------- | ------------------------------------------------ | -------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| Accueil                    | `/`, `/notre-paroisse/`, `/horaires/`, `/contact/`        | Réécrire et répartir                             | Haute    | Histoire, architecture, identité                             | Dates historiques, statut patrimonial, coordonnées, messes, secrétariat, friperie, concerts            | Accueil migré; pages Notre paroisse, Horaires et Contact dans Figma |
| Pèlerinages                | `/pelerinages/` et entrées CMS                            | Transformer en contenu CMS                       | Moyenne  | Existence possible du programme et principe de rassemblement | Année, destinations, dates, heures, prix, capacité, responsable, téléphone, inscription                | Catégorie événement disponible; aucune page complète dédiée         |
| Nos services               | `/sacrements/`, sous-pages de sacrements et `/catechese/` | Réécrire et scinder                              | Haute    | Présentation pastorale générale et contact humain            | Toutes les procédures, documents, délais, tarifs, horaires, responsables et paiements                  | Page Sacrements Figma; Catéchèse à ajouter au plan                  |
| Évènements à venir         | `/evenements/` et détails CMS                             | Transformer en contenu CMS; archiver les entrées | Haute    | Types de contenu et besoin d’actualités                      | Validité de chaque entrée, personnes, dates, lieux, prix et inscriptions                               | Liste, détail et aperçu d’événements disponibles dans Figma         |
| Friperie                   | `/friperie/`                                              | Réécrire                                         | Haute    | Nom, mission, réemploi, soutien communautaire                | Historique, partenariat, rôle financier, dons, horaires, vente, fermeture, responsable, téléphone      | Page Friperie Figma et aperçu d’accueil                             |
| Inscription à la catéchèse | `/catechese/` et `CatechesisRegistration`                 | Fusionner et transformer en contenu CMS          | Haute    | Existence des trois parcours à confirmer                     | Campagne 2026, âge, documents, frais, paiement, responsables et durée                                  | Aucun écran dédié; fondations Sacrements réutilisables              |
| Soutien à la communauté    | `/friperie/` ou `/soutien-communaute/`                    | Fusionner; confirmation nécessaire               | Moyenne  | Intention d’accueil et de confidentialité                    | Aides, publics, partenaires, critères, entrée, horaires et téléphone                                   | Vie paroissiale et Friperie disponibles comme directions            |
| Location de salle          | `/location-de-salle/`                                     | Réécrire; confirmation nécessaire                | Haute    | Processus manuel, demande d’information et contrat           | Espaces, capacités, équipements, usages, tarifs, durées, heures, permis, dépôt et disponibilité        | Page Location Figma; formulaire non connecté prévu plus tard        |
| Merci à nos annonceurs     | `/annonceurs/`                                            | Réécrire et transformer en contenu CMS           | Moyenne  | Principe d’un programme publicitaire et CTA                  | Programme actif, annonceurs, logos, autorisations, coordonnées, tarifs, période et espaces disponibles | Aucun écran dédié; à ajouter au plan                                |

## Actions détaillées

### Migrer

- les faits historiques validés vers Notre paroisse;
- les principes pastoraux et communautaires durables;
- la mission générale de la friperie;
- le processus humain de demande pour les sacrements et la location.

### Réécrire

- les longues explications de « Nos services »;
- les affirmations patrimoniales;
- les descriptions de la friperie;
- les consignes de dons;
- l’appel aux annonceurs.

La réécriture devra préserver le sens après validation sans copier les fautes,
espacements ou formulations promotionnelles de l’ancien site.

### Fusionner

- contenu historique de l’ancien Accueil dans Notre paroisse;
- Catéchèse dupliquée dans une seule page et une seule source de données;
- Soutien communautaire dans Friperie si aucune autre aide n’est confirmée;
- Groupes dans Vie paroissiale;
- Concerts dans la collection Événements.

### Archiver ou ne pas migrer

- élection de marguillier du 14 juin sans statut courant confirmé;
- vente de friperie du 11 juillet et fermeture saisonnière associée;
- anciens concerts, intentions ou pèlerinages sans année et sans validation;
- descriptions promotionnelles commerciales;
- coordonnées de responsables non consenties;
- logos récupérés depuis l’ancien site;
- horaires et tarifs remplacés ou contradictoires.

### Confirmation nécessaire

La paroisse doit approuver le questionnaire de
[`PARISH_CONTENT_CONFIRMATION.md`](./PARISH_CONTENT_CONFIRMATION.md) avant
l’intégration de valeurs réelles. Une validation doit inclure une date et, pour
les données très volatiles, une règle de révision ou d’expiration.
