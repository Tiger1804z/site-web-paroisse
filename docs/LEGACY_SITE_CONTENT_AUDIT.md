# Audit du site existant

## Méthodologie

Audit réalisé le 25 juillet 2026 sur le seul domaine officiel
`https://www.paroissesaintrenegoupil.com/`.

La page d’accueil et les huit destinations de sa navigation ont été examinées.
Le HTML a servi uniquement à confirmer les URL internes et l’existence de liens
externes; aucune image, pièce jointe, publicité ou ressource média n’a été
téléchargée. Les textes ci-dessous sont des résumés de travail, pas une copie du
site.

Le site existant est traité comme une source à valider et non comme une source
officielle automatiquement à jour. Les classements employés sont :

- **Stable et probablement réutilisable** : information durable, sous réserve
  d’une validation éditoriale;
- **Opérationnelle — confirmation nécessaire** : information utile au public
  qui peut changer;
- **Temporelle ou volatile** : date, horaire, tarif, inscription, personne ou
  activité;
- **Potentiellement périmée** : information datée ou sans année dont la validité
  n’est plus démontrée;
- **Contradictoire** : versions observables différentes;
- **À ne pas migrer** : contenu ancien, promotionnel, dupliqué ou inadapté;
- **À confirmer avec la paroisse** : statut par défaut lorsqu’une autorité
  humaine doit trancher.

Les résultats indexés par un moteur de recherche ont seulement servi à détecter
des écarts de version. Aucune recherche historique externe n’a été effectuée.

## Résumé général

Neuf pages sont accessibles depuis la navigation publiée :

1. Accueil;
2. Pèlerinages;
3. Nos services;
4. Évènements à venir;
5. Friperie;
6. Inscription à la catéchèse;
7. Soutien à la communauté;
8. Location de salle;
9. Merci à nos annonceurs.

Le site contient une base documentaire utile : histoire du bâtiment, démarches
pour les sacrements, mission de la friperie et description des espaces à louer.
Il mélange toutefois ces contenus durables avec des horaires saisonniers, tarifs
2026, dates d’inscription, événements passés, responsables nommés et publicités.

Les principales faiblesses sont :

- absence de date de mise à jour exploitable malgré la mention « Page updated »;
- duplication de la catéchèse entre deux pages;
- horaires différents entre la page actuellement rendue et une version indexée;
- page d’événements servant aussi d’archive implicite sans statut;
- année absente sur certains pèlerinages et ventes;
- aucune page de feuillets, de groupes ou de réseaux sociaux trouvée;
- mélange entre descriptions institutionnelles et affirmations promotionnelles;
- coordonnées personnelles et commerciales publiées sans indication de
  consentement ou de période de validité.

## Contradictions et risques transversaux

| Sujet                        | Observations                                                                                                                                                                                                                    | Classement                                               | Décision de migration                                                                     |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Horaires des messes          | La page rendue affiche un horaire « Juin et juillet » : mardi et jeudi à 8 h, samedi à 16 h, dimanche à 10 h. Une version indexée du même `/accueil` affiche mardi au vendredi à 8 h, samedi à 16 h, dimanche à 8 h 30 et 11 h. | Contradictoire; très volatile                            | Ne publier aucune valeur avant validation datée par la paroisse.                          |
| Événements                   | La page rendue montre une élection de marguillier et une vente du 11 juillet. Un extrait indexé plus ancien montre des intentions du 2 novembre et un spectacle.                                                                | Contradictoire entre versions; potentiellement périmé    | Transformer les futures entrées en contenus CMS avec dates de publication et d’archivage. |
| Friperie                     | L’histoire de l’accueil situe la transformation du sous-sol « vers 1990 »; la page Friperie date l’ouverture d’Au coin de l’Entraide au 8 septembre 1998.                                                                       | Chronologie à clarifier, pas nécessairement incompatible | Distinguer transformation du local et fondation de l’organisme après confirmation.        |
| Concerts                     | L’accueil affirme six concerts gratuits par année au printemps et à l’automne, mais aucun calendrier annuel complet actuel n’est fourni.                                                                                        | Opérationnelle — confirmation nécessaire                 | Conserver l’idée de partenariat seulement si le programme est encore actif.               |
| Catéchèse                    | Les mêmes données 2026 sont dupliquées dans « Nos services » et « Inscription à la catéchèse ».                                                                                                                                 | Risque de désynchronisation                              | Une seule source CMS devra alimenter la page Catéchèse et les aperçus.                    |
| Baptême et horaire dominical | La procédure prévoit la remise du certificat à la messe de 11 h le dimanche suivant, tandis que l’horaire estival rendu affiche seulement une messe à 10 h.                                                                     | Contradictoire ou saisonnier non géré                    | Valider le processus et éviter toute heure fixe dans le texte durable.                    |
| Confirmation et catéchuménat | Les listes demandent toutes deux un certificat de confirmation du parrain ou de la marraine; le rôle exact de ce document n’est pas expliqué.                                                                                   | Ambigu; à confirmer avec la paroisse                     | Faire valider une liste distincte de documents pour chaque parcours.                      |
| Valeur patrimoniale          | Le site qualifie l’église de patrimoine et de monument historique sans préciser une désignation juridique.                                                                                                                      | À confirmer avec la paroisse                             | Employer « intérêt architectural » tant qu’un statut officiel n’est pas documenté.        |

## Pages trouvées

### Accueil

- **URL** :
  `https://www.paroissesaintrenegoupil.com/accueil`
- **Objectif observé** : présenter l’histoire de la construction, l’intérêt
  architectural, les coordonnées et les horaires.
- **Contenu disponible** : érection de la paroisse en 1959, terrain acheté
  l’année suivante, construction de 1963 à 1964, architectes, matériaux,
  transition entre rue et lieu de culte, mobilier, transformations, récit
  patrimonial, adresse, téléphone, courriel, horaires de messes, secrétariat et
  friperie.
- **Informations stables** : identité, récit historique, caractéristiques
  architecturales et présence du presbytère intégré.
- **Informations à confirmer** : dates historiques, auteurs, artisans,
  chronologie des transformations, formulation patrimoniale, adresse et
  coordonnées.
- **Contenus potentiellement périmés** : horaires saisonniers et réguliers,
  horaire du secrétariat, fréquence annuelle des concerts et horaire de la
  friperie.
- **Utilisation prévue** : déplacer le récit vers « Notre paroisse »; alimenter
  « Horaires », « Contact » et « Friperie » seulement après validation. Ne pas
  remplacer la nouvelle page d’accueil par cette ancienne composition.

### Pèlerinages

- **URL** :
  `https://www.paroissesaintrenegoupil.com/pèlerinages`
- **Objectif observé** : annoncer des déplacements organisés sous l’appellation
  « Les Pèlerins de Saint-René-Goupil ».
- **Contenu disponible** : destinations Sainte-Anne-de-Beaupré et
  Notre-Dame-du-Cap, dates des 25 juillet et 15 août, heures de départ et retour,
  coûts, lieu de rassemblement, responsable, téléphone et places limitées.
- **Informations stables** : existence possible d’une activité de pèlerinages
  paroissiaux et besoin d’un point de rassemblement.
- **Informations à confirmer** : nom du programme, statut actuel, responsable,
  mode de réservation, assurance, accessibilité et politique d’annulation.
- **Contenus potentiellement périmés** : toutes les dates, heures, prix, places
  et coordonnées; aucune année n’est affichée.
- **Utilisation prévue** : page ou vue filtrée « Pèlerinages » alimentée par des
  contenus datés, jamais un bloc statique permanent.

### Nos services

- **URL** :
  `https://www.paroissesaintrenegoupil.com/nos-services`
- **Objectif observé** : regrouper mariage, communion, confirmation,
  catéchuménat, baptême, funérailles, certificats et services liturgiques.
- **Contenu disponible** :
  - mariage : contacts, rencontres, délai minimal, documents, préparation,
    autorisation territoriale, pratique et tarif;
  - communion, confirmation et catéchuménat : profils, documents, période,
    inscriptions, coût et responsables;
  - baptême : fréquence, préparation, documents, rencontre et remise du
    certificat;
  - funérailles : prise de date, tarif et possibilité de musiciens;
  - certificats : types, frais et poste;
  - autres services : messes annoncées, lampions, lampe du sanctuaire, messe
    commémorative, intentions et modes de paiement.
- **Informations stables** : objectifs pastoraux généraux et nécessité de
  communiquer avec le secrétariat.
- **Informations à confirmer** : toutes les procédures, documents, délais,
  fréquences, tarifs, responsables, modes de paiement et coordonnées.
- **Contenus potentiellement périmés** : tarifs étiquetés 2026, calendrier
  catéchétique 2026–2027, rendez-vous d’août 2026 et horaires de baptême liés à
  des heures de messe contradictoires.
- **Utilisation prévue** : scinder en page « Sacrements et services », page
  « Catéchèse » et pages de détail lorsque le volume le justifie. Réécrire pour
  la clarté; ne pas recopier le texte intégral.

### Évènements à venir

- **URL** :
  `https://www.paroissesaintrenegoupil.com/évènements-à-venir`
- **Objectif observé** : publier des nouvelles et événements ponctuels.
- **Contenu disponible au moment de l’audit** : résultat d’une élection de
  marguillier tenue le 14 juin et vente de friperie du 11 juillet, avec fermeture
  estivale et demande de bénévoles.
- **Informations stables** : aucune entrée individuelle n’est durable; le rôle
  administratif des marguilliers pourrait alimenter « Notre paroisse » après
  réécriture.
- **Informations à confirmer** : personne élue, mandat, dates, événements
  encore actifs et contenu à archiver.
- **Contenus potentiellement périmés** : les deux entrées visibles sont
  antérieures au 25 juillet 2026; l’année n’est pas toujours explicite.
- **Utilisation prévue** : ne migrer aucune entrée directement. Créer un modèle
  `Event` avec statuts brouillon, publié, annulé et archivé.

### Friperie

- **URL** :
  `https://www.paroissesaintrenegoupil.com/friperie`
- **Objectif observé** : présenter « Au coin de l’Entraide », solliciter des
  dons, expliquer les achats et annoncer des ventes.
- **Contenu disponible** : mission sociale, ouverture le 8 septembre 1998,
  succession à la Société de Saint-Vincent-de-Paul, collaboration de réinsertion
  sociale, soutien financier à l’église, vente du 11 juillet, fermeture
  estivale, bénévolat, lieu de dépôt, articles acceptés/refusés, achats, travaux
  communautaires, horaire, responsable et téléphone.
- **Informations stables** : mission générale, rôle communautaire, principe de
  réemploi, catégories générales d’articles et possibilité de bénévolat.
- **Informations à confirmer** : histoire exacte, partenariat gouvernemental,
  rôle financier actuel, politiques de dons, emplacement de la boîte, consigne
  lorsque la boîte est pleine, responsable et téléphone.
- **Contenus potentiellement périmés** : vente, fermeture, horaires, personne
  nommée et formulations sur les stocks.
- **Utilisation prévue** : page Friperie dédiée, avec contenu durable éditorial
  et blocs CMS séparés pour horaires, fermetures et ventes.

### Inscription à la catéchèse

- **URL** :
  `https://www.paroissesaintrenegoupil.com/inscription-à-la-catéchèse`
- **Objectif observé** : annoncer la campagne d’inscription 2026–2027.
- **Contenu disponible** : inscriptions les 12 et 19 août 2026, période
  septembre 2026 à mai 2027, coût, paiement, documents pour première communion,
  confirmation et catéchumènes, tranche d’âge et trois responsables.
- **Informations stables** : existence de parcours distincts et nécessité d’un
  dossier documentaire.
- **Informations à confirmer** : maintien des parcours, critères d’âge,
  documents réellement requis, responsables, mode d’inscription et possibilité
  d’un accompagnement hors campagne.
- **Contenus potentiellement périmés** : campagne, dates, année pastorale,
  tarif, modes de paiement et responsables.
- **Utilisation prévue** : page « Catéchèse » durable et entrées
  `CatechesisRegistration` temporaires. Ne pas reproduire une page annuelle
  statique.

### Soutien à la communauté

- **URL** :
  `https://www.paroissesaintrenegoupil.com/soutien-à-la-communauté`
- **Objectif observé** : informer les nouveaux arrivants et les personnes en
  situation de précarité de l’aide offerte par la friperie.
- **Contenu disponible** : vêtements et petits articles domestiques, accueil
  confidentiel, localisation au sous-sol, entrée par la 25e Avenue, téléphone
  et horaire.
- **Informations stables** : intention d’accueil, soutien ponctuel et respect de
  la confidentialité.
- **Informations à confirmer** : publics servis, critères, types d’aide,
  capacité d’accompagnement, partenaires, entrée, téléphone et horaires.
- **Contenus potentiellement périmés** : toutes les informations pratiques.
- **Utilisation prévue** : la page actuelle duplique presque entièrement la
  friperie. La fusion dans Friperie est recommandée tant que d’autres services
  communautaires ne sont pas confirmés; réserver une future page « Soutien à la
  communauté » si l’offre devient plus large.

### Location de salle

- **URL** :
  `https://www.paroissesaintrenegoupil.com/location-de-salle`
- **Objectif observé** : présenter deux salles de réception et la possibilité de
  louer l’église.
- **Contenu disponible** :
  - **La Ruchée** : au jubé, capacité affichée de 50 personnes, quatre heures,
    tarif et heure limite;
  - **Sous-sol** : capacité affichée de 125 personnes, six heures, tarif et heure
    limite;
  - **Église** : organismes religieux, groupes ou concerts, capacité affichée de
    250 personnes, tarif quotidien et possibilité à long terme;
  - cuisinette, salle de bain, vestiaire, tables et chaises pour les salles;
  - permis pour boissons alcoolisées, interdiction de vente, délai de remise,
    dépôt de garantie et signature d’un bail.
- **Informations stables** : existence de trois espaces potentiels et processus
  humain avec le secrétariat.
- **Informations à confirmer** : disponibilité actuelle, conformité des
  capacités, équipements, usages, accessibilité, sécurité, assurance, permis,
  conditions, durée, tarifs, heures limites et montant du dépôt.
- **Contenus potentiellement périmés** : toutes les valeurs opérationnelles.
- **Utilisation prévue** : page de demande d’information. Le secrétariat vérifie
  manuellement la disponibilité, confirme les conditions, remet le contrat et
  recueille la signature. Aucune réservation instantanée ne doit être proposée.

### Merci à nos annonceurs

- **URL** :
  `https://www.paroissesaintrenegoupil.com/merci-à-nos-annonceurs`
- **Objectif observé** : remercier les annonceurs et solliciter de nouveaux
  espaces publicitaires dans le feuillet.
- **Contenu disponible** : message aux commerçants et élus, disponibilité
  alléguée d’espaces, invitation à joindre le secrétariat et une fiche
  commerciale avec images, coordonnées et texte promotionnel.
- **Informations stables** : principe possible d’une publicité finançant la
  mission et futur CTA « Devenir annonceur ».
- **Informations à confirmer** : programme encore actif, politique éditoriale,
  tarifs, formats, durée, annonceurs, coordonnées et autorisations de logo.
- **Contenus potentiellement périmés** : disponibilité des espaces et toute
  fiche commerciale.
- **Utilisation prévue** : page officielle du nouveau sitemap. Chaque fiche doit
  porter le statut « partenariat actif à confirmer » jusqu’à validation. Aucun
  logo ni texte promotionnel du site ancien n’est importé.

Mise à jour S1-T13 : l’inspection visuelle des images révèle aussi trois
placements d’élus — Frantz Benjamin, Josué Corvil et Patricia Lattanzio — en
plus de la fiche texte Buffet Marina. Les fonctions et coordonnées sont
intégrées dans les images et peuvent être périmées. Les portraits, logos
institutionnels, droits et consentements ne sont pas documentés; aucun de ces
visuels n’est importé. Voir
[`ADVERTISERS_CONTENT_AUDIT.md`](./ADVERTISERS_CONTENT_AUDIT.md).

## Contenus recherchés mais non trouvés comme pages distinctes

- feuillets paroissiaux ou archives PDF;
- équipe paroissiale complète;
- page détaillée des groupes;
- Facebook ou YouTube;
- contact séparé;
- galerie séparée;
- première visite;
- détail autonome du catéchuménat;
- carte d’accessibilité;
- politique de confidentialité et mentions légales propres au site paroissial.

Ces absences ne signifient pas que les activités ou documents n’existent pas;
elles indiquent seulement qu’ils ne sont pas accessibles comme pages de la
navigation auditée.

## Liens externes observés sans navigation

- un site gouvernemental est affiché pour la demande de permis liée à l’alcool;
- le site Web d’un annonceur est lié depuis « Merci à nos annonceurs »;
- Google Sites et ses ressources techniques apparaissent dans le gabarit.

Leur contenu n’a pas été audité. Les liens devront être revalidés avant toute
migration.
