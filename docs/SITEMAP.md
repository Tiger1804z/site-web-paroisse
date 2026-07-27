# Sitemap consolidé proposé

## Statut

Proposition documentaire initiale du 25 juillet 2026, actualisée le 27 juillet
2026 pour la route canonique Nos services. Elle compare :

- la navigation du site existant;
- les pages prévues dans l’export Figma;
- les besoins de contenu découverts pendant l’audit;
- les processus manuels décrits dans le questionnaire de conception.

Elle ne modifie pas la navigation publique et ne doit pas être considérée comme
définitive avant validation par la paroisse.

## Arborescence proposée

```text
Accueil
├── Découvrir
│   ├── Notre paroisse
│   ├── Première visite
│   ├── Vie paroissiale
│   ├── Soutien à la communauté
│   └── Galerie
├── Célébrer
│   ├── Horaires
│   ├── Nos services
│   ├── Catéchèse
│   └── Événements
├── Activités
│   ├── Groupes
│   ├── Pèlerinages
│   ├── Concerts et activités
│   └── Friperie
└── Informations
    ├── Feuillets paroissiaux [différé, hors navigation publique]
    ├── Merci à nos annonceurs
    └── Contact

Nos services
└── Location de salle [section intégrée]

Pages de détail potentielles
├── Baptême
├── Mariage
├── Funérailles
├── Communion et confirmation
├── Catéchuménat
├── Demande de certificat
├── Détail d’un événement
├── Détail d’un groupe
└── Détail d’un annonceur, seulement si nécessaire
```

## Routes candidates

| Page                    | Route candidate                          | Statut recommandé                 | Justification                                                                                                              |
| ----------------------- | ---------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Accueil                 | `/`                                      | Obligatoire; migrée               | Page Figma déjà livrée dans S1-T02.                                                                                        |
| Notre paroisse          | `/notre-paroisse/`                       | Obligatoire                       | Reçoit l’histoire et l’architecture actuellement placées sur l’ancien accueil.                                             |
| Première visite         | `/premiere-visite/`                      | Obligatoire                       | Besoin Figma; rassure et centralise arrivée, entrée, accessibilité et déroulement.                                         |
| Vie paroissiale         | `/vie-paroissiale/`                      | Obligatoire                       | Présentation des groupes et de l’engagement.                                                                               |
| Soutien à la communauté | `/soutien-communaute/`                   | Secondaire, à confirmer           | Ne justifie une page autonome que si l’offre dépasse la friperie.                                                          |
| Galerie                 | `/galerie/`                              | Obligatoire                       | Besoin Figma; médias avec droits confirmés uniquement.                                                                     |
| Horaires                | `/horaires/`                             | Obligatoire                       | Priorité éditoriale et prochaine migration S1-T03.                                                                         |
| Nos services            | `/nos-services/`                         | Obligatoire; canonique            | Regroupe sacrements, démarches, prière, mémoire, paiements et location de salle.                                           |
| Ancien Sacrements       | `/sacrements/`                           | Alias `noindex`                   | Compatibilité statique vers `/nos-services/`; aucune seconde page indexable.                                               |
| Catéchèse               | `/catechese/`                            | Obligatoire                       | Sépare le contenu durable des campagnes annuelles d’inscription.                                                           |
| Événements              | `/evenements/`                           | Obligatoire                       | Liste actuelle et archives gérées par statut/date.                                                                         |
| Groupes                 | `/vie-paroissiale/#groupes` initialement | Fusion recommandée                | Évite une page trop mince; détails futurs si du contenu confirmé existe.                                                   |
| Pèlerinages             | `/pelerinages/`                          | Secondaire                        | Programme distinct du site ancien, mais toutes les sorties sont volatiles.                                                 |
| Concerts et activités   | `/evenements/?type=concert` initialement | Fusion recommandée                | Une catégorie d’événement évite une liste statique dupliquée.                                                              |
| Friperie                | `/friperie/`                             | Obligatoire                       | Mission durable et informations pratiques spécifiques.                                                                     |
| Feuillets paroissiaux   | `/feuillets-paroissiaux/`                | Différé, décision requise         | Aucun PDF disponible; placeholder `noindex` hors navigation, révision le 10 août 2026 ou après le retour de la secrétaire. |
| Merci à nos annonceurs  | `/annonceurs/`                           | Obligatoire dans le futur sitemap | Programme publicitaire du feuillet; statut actif de chaque partenariat à confirmer.                                        |
| Location de salle       | `/nos-services/#location-de-salle`       | Section canonique                 | Tarifs et disponibilités communiqués par le secrétariat; jamais de réservation instantanée.                                |
| Ancienne location       | `/location-de-salle/`                    | Alias `noindex`                   | Compatibilité statique vers la section canonique.                                                                          |
| Contact                 | `/contact/`                              | Obligatoire                       | Coordonnées validées, secrétariat et futurs motifs de contact.                                                             |

Les accents sont évités dans les nouvelles URL. Les anciennes URL accentuées
devront recevoir des redirections lorsque le domaine sera migré.

## Pages obligatoires

- Accueil;
- Notre paroisse;
- Première visite;
- Horaires;
- Nos services;
- Catéchèse;
- Vie paroissiale;
- Événements;
- Feuillets paroissiaux — différé et hors navigation jusqu'à confirmation;
- Friperie;
- Merci à nos annonceurs;
- Location de salle, comme section de Nos services;
- Galerie;
- Contact.

« Soutien à la communauté » et « Pèlerinages » sont importants dans
l’inventaire, mais leur profondeur de contenu doit être confirmée avant de les
promouvoir au premier niveau.

## Pages et contenus secondaires

- détails de sacrements;
- détails d’événements;
- fiches de groupes;
- filtres Pèlerinages et Concerts;
- archives d’événements et de feuillets;
- politique de confidentialité;
- mentions légales;
- page d’erreur;
- éventuelles homélies ou vidéos.

## Pages pouvant être fusionnées

| Contenu                 | Fusion recommandée                  | Condition                                                                     |
| ----------------------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| Ancien Accueil          | Notre paroisse, Horaires et Contact | Le nouveau `/` reste la page Figma migrée.                                    |
| Nos services            | Sacrements et services + Catéchèse  | Les démarches détaillées peuvent devenir des sous-pages.                      |
| Soutien à la communauté | Friperie                            | À maintenir séparé seulement si d’autres aides ou partenaires sont confirmés. |
| Groupes                 | Vie paroissiale                     | Créer des détails seulement avec textes, responsables et activités validés.   |
| Concerts et activités   | Événements                          | Utiliser catégories et filtres, pas une seconde liste.                        |
| Pèlerinages datés       | Pèlerinages + collection d’entrées  | La page durable présente le programme; chaque sortie est volatile.            |

## Pages futures

- détail autonome de Baptême;
- détail autonome de Mariage;
- détail autonome de Funérailles;
- Communion et confirmation;
- Catéchuménat;
- Demande de certificat;
- détail d’un événement;
- détail d’un groupe;
- détail d’un annonceur uniquement si sa valeur éditoriale est démontrée;
- archives par année des feuillets;
- section ou page élargie de soutien communautaire.

## Pages à ne pas reproduire telles quelles

- « Évènements à venir » comme page statique contenant des entrées passées;
- « Inscription à la catéchèse » comme page annuelle dupliquée;
- « Nos services » comme très longue page sans navigation interne;
- l’ancien Accueil mêlant histoire et valeurs opérationnelles;
- une page Soutien qui répète mot pour mot la friperie;
- les fiches promotionnelles ou logos d’annonceurs non validés;
- les pages de réservation instantanée;
- les descriptions commerciales héritées;
- les campagnes, ventes et pèlerinages expirés.

## Principes de navigation à valider

1. Horaires reste accessible directement dans le header et sur mobile, sans
   CTA redondant à droite du header.
2. Catéchèse doit être trouvable depuis Nos services.
3. Friperie peut apparaître dans Activités et être reliée depuis Soutien.
4. Merci à nos annonceurs appartient à Informations, près des feuillets.
5. Location de salle est une section de Nos services et une demande
   d’information, pas une action de réservation.
6. Pèlerinages et Concerts peuvent être des vues éditoriales d’une même
   collection d’événements.
7. `src/lib/navigation.ts` est la source canonique partagée du desktop, du
   mobile et du footer.

## Modèles de contenu futurs

Ces modèles décrivent les besoins du futur CMS; aucun schéma de code n’est créé
dans ce ticket.

### `Event`

| Champ                         | Rôle                                                           |
| ----------------------------- | -------------------------------------------------------------- |
| Titre et slug                 | Identification publique.                                       |
| Type                          | Célébration, concert, activité communautaire, groupe ou autre. |
| Début et fin                  | Dates et heures avec fuseau horaire.                           |
| Lieu                          | Église, salle ou autre lieu confirmé.                          |
| Description courte et contenu | Présentation éditoriale.                                       |
| Prix                          | Valeur optionnelle avec mention de confirmation.               |
| Inscription                   | Aucune, information, externe ou contact secrétariat.           |
| Responsable et coordonnées    | Données optionnelles soumises au consentement.                 |
| Image                         | Média autorisé et texte alternatif.                            |
| Statut                        | Brouillon, publié, annulé ou archivé.                          |
| Publication et archivage      | Fenêtre d’affichage automatique.                               |
| Vérification                  | Date, personne validatrice et source.                          |

### `Pilgrimage`

| Champ                      | Rôle                                                    |
| -------------------------- | ------------------------------------------------------- |
| Destination                | Nom du sanctuaire ou lieu.                              |
| Date                       | Année obligatoire.                                      |
| Départ et retour           | Heures et lieu de rassemblement.                        |
| Prix et capacité           | Valeurs optionnelles à confirmer.                       |
| Transport et accessibilité | Informations pratiques.                                 |
| Responsable                | Nom et coordonnées avec consentement.                   |
| Inscription                | Processus, date limite et statut.                       |
| Politique                  | Annulation, remboursement et conditions.                |
| Statut                     | Brouillon, ouvert, complet, annulé, terminé ou archivé. |

### `CatechesisRegistration`

| Champ             | Rôle                                                |
| ----------------- | --------------------------------------------------- |
| Année pastorale   | Période concernée.                                  |
| Parcours          | Communion, confirmation ou catéchuménat.            |
| Public et âge     | Critères validés.                                   |
| Dates et lieu     | Ouverture, séances d’inscription et durée.          |
| Documents requis  | Liste propre au parcours.                           |
| Frais et paiement | Données volatiles.                                  |
| Responsables      | Personnes confirmées et consentement.               |
| Processus         | En personne, contact ou futur formulaire d’intérêt. |
| Statut            | À venir, ouvert, fermé ou archivé.                  |
| Vérification      | Source et date de validation.                       |

### `Advertiser`

| Champ                              | Rôle                                                            |
| ---------------------------------- | --------------------------------------------------------------- |
| Nom                                | Nom commercial validé.                                          |
| Logo                               | Actif autorisé, jamais repris automatiquement de l’ancien site. |
| Texte alternatif du logo           | Description fonctionnelle.                                      |
| Catégorie                          | Classement éditorial.                                           |
| Description courte                 | Texte approuvé, non copié de l’ancien site.                     |
| Téléphone, courriel et site Web    | Coordonnées validées.                                           |
| Date de début et date de fin       | Période du partenariat.                                         |
| Statut actif                       | Contrôle d’affichage explicite.                                 |
| Ordre d’affichage                  | Priorité éditoriale.                                            |
| Autorisation d’utilisation du logo | Preuve ou référence interne.                                    |

Le CTA futur sera **Devenir annonceur**. Il pourra ouvrir le formulaire de
contact prérempli avec le motif **Publicité dans le feuillet paroissial**.
