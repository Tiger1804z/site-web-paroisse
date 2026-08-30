# Guide du Studio pour Sophie — rapport d'analyse

> Analyse préalable à la rédaction du PDF pédagogique destiné à Sophie,
> secrétaire de la paroisse. Réalisée le 2026-08-30 en **observation seule** :
> aucune écriture, aucune publication, aucune suppression dans le Studio ni
> dans le jeu de données.

---

## 0. Trois adresses à connaître

| Quoi                       | Adresse                                                      |
| -------------------------- | ------------------------------------------------------------ |
| Studio (Sophie)            | `https://site-web-paroisse.pages.dev`                        |
| Site public                | `https://paroisse-saint-rene-goupil.pages.dev`               |
| Aperçu (dans Presentation) | `https://paroisse-preview.sebastieneugene123600.workers.dev` |

Compte connecté pendant l'analyse : **Sebastien Eugene**. Un second avatar
« SD » apparaît sur les modifications d'il y a 1 h — à confirmer : Sophie
a-t-elle déjà un compte ?

---

## 1. Carte du Studio en langage simple

### Barre du haut, de gauche à droite

- **PS / Paroisse Saint-René-Goupil** — retour à l'accueil du Studio.
- **+** — crée un nouveau document. ⚠ Piège majeur, voir §6.
- **loupe** — recherche dans tout le contenu.
- **Structure** — l'armoire à dossiers. Tout le contenu classé.
- **Presentation** — le site affiché à gauche, le formulaire à droite. Là où
  Sophie devrait travailler le plus souvent.
- **Vision** — outil technique de requêtes. Sans usage pour elle.
- **Releases** — publication programmée. **Verrouillé** (« Upgrade to
  unlock »). Cul-de-sac.
- **Drafts ▾** — lunettes : voir le site avec les brouillons, ou seulement le
  publié.
- **✓ Tasks** — pense-bêtes. Facultatif.
- **⚡ Upgrade your project** — publicité Sanity. À ignorer.
- **👥** — qui d'autre est connecté en ce moment.
- **?** — aide Sanity (en anglais).
- **avatar** — thème clair/sombre, se déconnecter.

### Structure → « Contenu », trois dossiers

1. **Données partagées** (3 fiches) — faits qui s'affichent sur plusieurs
   pages. On corrige à un seul endroit.
2. **Collections** (2 listes) — des fiches qui vont et viennent.
3. **Pages** (10 fiches) — une fiche par page du site.

### Quand un document est ouvert

- Deux pastilles en haut : **Published** (en ligne) / **Draft** (modifications
  pas encore en ligne, pastille **orange** quand il y en a).
- **« Used on N pages »** — dit sur quelles pages ce contenu s'affiche, et y
  mène.
- **Onglets** (En-tête, Ensemble, Célébrations…) — découpent la page en
  sections.
- Bas à droite : **Publish** + **…** (Duplicate, Discard changes, Delete).
- Haut à droite : partage du lien, commentaires, **… (History)**, plein écran,
  fermer.

---

## 2. Liste des Pages (10) et lien avec le site public

| Dans le Studio       | Sur le site         |
| -------------------- | ------------------- |
| Page d'accueil       | `/`                 |
| Page Notre paroisse  | `/notre-paroisse/`  |
| Page Horaires        | `/horaires/`        |
| Page Événements      | `/evenements/`      |
| Page Nos services    | `/nos-services/`    |
| Page Vie paroissiale | `/vie-paroissiale/` |
| Page Première visite | `/premiere-visite/` |
| Page Nos annonceurs  | `/nos-annonceurs/`  |
| Page Contact         | `/contact/`         |
| Page Friperie        | `/friperie/`        |

**Pages du site absentes du Studio** (à dire dans le guide, sinon elle les
cherchera) : Politique de confidentialité et Mentions légales (écrites dans le
code, elles décrivent le fonctionnement technique) ; `/galerie/` (adresse
réservée, vide) ; `/sacrements/`, `/location-de-salle/`,
`/merci-a-nos-annonceurs/` (anciennes adresses qui redirigent).

---

## 3. Liste des Collections (2)

**Événements** — 6 fiches, toutes publiées :

| Titre                                            | Date            | Accueil | En vedette |
| ------------------------------------------------ | --------------- | ------- | ---------- |
| Troisième spectacle Hors les Murs automne 2026   | 29 nov. 2026    | oui     | non        |
| Deuxième spectacle Hors les Murs automne 2026    | 18 oct. 2026    | oui     | non        |
| Premier spectacle Hors les Murs automne 2026     | 4 oct. 2026     | oui     | non        |
| Fête patronale de Saint René Goupil              | 27 sept. 2026   | oui     | non        |
| Pèlerinage au Sanctuaire Notre-Dame-du-Cap       | 15 août 2026    | oui     | **oui**    |
| Pèlerinage à la Basilique Sainte-Anne-de-Beaupré | 25 juillet 2026 | non     | non        |

**Annonceurs** — 4 fiches, toutes « Actif » : Buffet Marina, Frantz Benjamin,
Josué Corvil, Patricia Lattanzio.

**Données partagées** (3) : Coordonnées de la paroisse · Horaires des messes ·
Friperie.

---

## 4. Actions réellement disponibles

### Sur un document

Modifier un champ · **Publish** · **Discard changes** (annuler les
modifications non publiées) · **Duplicate** · **Delete** · **Unpublish**
(visible seulement en perspective « Published ») · **History** (versions
passées) · Commentaires · Mode plein écran · Copy document URL / ID · panneau
**Validation** (⚠) listant erreurs et avertissements en français.

### Dans une liste (tableau)

Glisser-déposer pour réordonner · menu **…** de chaque ligne : **Remove**,
Copy, Duplicate, **Add item before / after** · bouton d'ajout en bas.

### Sur une image

**Upload** (téléverser), **Select** (reprendre une image déjà dans le Studio),
Download, Copy URL, **Clear field** (vider) · **Edit hotspot and crop** —
recadrage et point focal, avec aperçus 3:4, Carré, 16:9, Panorama.

### Dans Presentation

Barre d'adresse du site · recharger · interrupteur **Edit** (clic sur le site →
ouvre le bon champ) · ouvrir dans un onglet · vue téléphone · **Share this
preview** — interrupteur, code QR et « Copy preview link », qui donne à
**n'importe qui ayant le lien** l'accès au site avec les brouillons.

### Dans les listes de collection

Recherche · tri (date récente ou ancienne, dernière modification, création) ·
vue compacte ou détaillée · **+** pour créer.

**Pas disponible** : Releases et Schedule publish (payant).

---

## 5. Tout ce que Sophie peut faire

### Textes

Modifier un titre, un surtitre, une introduction, un paragraphe · ajouter ou
supprimer une ligne de titre (l'accueil découpe son grand titre ligne par
ligne) · modifier une citation et sa source · modifier le libellé d'un bouton ·
mettre en gras ou en italique dans une annonce d'événement (seul champ qui le
permet) · aller à la ligne sans nouveau paragraphe (Maj + Entrée).

### Coordonnées et informations pratiques

Adresse, téléphone (10 chiffres exigés), courriel public, heures du
secrétariat, stationnement, accessibilité, date de dernière révision.

### Horaires des messes

Ajouter une messe · modifier jour, heure, type · désactiver une messe sans
l'effacer (« Actif ») · réordonner · ajouter un horaire saisonnier avec dates
de début et de fin · écrire un libellé libre (« Premier vendredi du mois »).

### Événements

Créer · modifier le titre, le résumé, l'annonce complète · changer date et
heure de début et de fin · lieu, point de rassemblement, heures de départ et de
retour · coût · places · personne à joindre (avec case de consentement
obligatoire) · bouton d'inscription · image principale et galerie · **État**
(Brouillon / Publié / **Annulé**) · Afficher sur le site · Afficher sur
l'accueil · Conserver dans les archives · Mettre en avant · Priorité sur
l'accueil.

### Annonceurs

Créer ou modifier une fiche · statut (Actif / À confirmer / Brouillon /
Inactif — seul « Actif » s'affiche) · rang d'affichage · logo · note interne de
révision.

### Friperie

Nom, heures d'ouverture, emplacement, téléphone propre à la friperie (donnée
partagée) — et séparément tout le contenu rédactionnel de la page Friperie.

### Images

Remplacer une image · choisir le point focal · recadrer · écrire le texte
alternatif (obligatoire dès qu'une image est déposée) · crédit · note de
droits · cocher « personnes reconnaissables » · cocher « générée par IA » ·
ajouter ou retirer une photo de la galerie de l'accueil · cocher « Droits
confirmés » et « Consentement obtenu ».

### Réglages d'affichage

Afficher ou masquer les activités sur l'accueil · nombre d'activités
affichées · afficher ou masquer les sections « à venir » et « archives » ·
afficher ou masquer la liste des annonceurs et le bloc « Devenir annonceur ».

### Google et partages

Titre et description qui apparaissent dans Google · image de partage par page ·
image de partage par défaut du site.

### Cycle de travail

Prévisualiser avant publication · comparer brouillon et publié · publier ·
annuler ses modifications non publiées · consulter l'historique · partager un
aperçu · retrouver un contenu par la recherche · savoir où un contenu s'affiche
(« Used on N pages »).

---

## 6. Zones à éviter

### Ne jamais toucher

- **Le bouton « + » de la barre du haut.** Il propose de créer une deuxième
  « Page d'accueil », une deuxième « Coordonnées de la paroisse », etc. Le
  doublon ne s'affichera **nulle part** sur le site et **n'apparaîtra pas**
  dans les dossiers — un fantôme introuvable. C'est le piège le plus grave du
  Studio aujourd'hui.
- **Delete** sur une Page ou une fiche de Données partagées. Le site cesserait
  d'afficher la section correspondante.
- **Vision** — outil de requêtes techniques.
- **Identifiant d'adresse** d'un événement déjà publié, et son bouton
  **Generate**.

### À manier avec précaution

- **Discard changes** — annule _tout_ le travail non publié du document. Utile,
  mais collé à **Delete** dans le même petit menu.
- **Remove** dans un tableau — retire la ligne immédiatement, sans
  confirmation. Récupérable tant que ce n'est pas publié, par Discard changes.
- **Clear field** sur une image.
- **Share this preview** — rend le site en brouillon visible par toute personne
  ayant le lien.
- **Afficher le courriel publiquement** — délibérément laissé désactivé
  (pourriel).
- Coordonnées d'un bénévole sans la case d'accord — le Studio bloque, c'est
  voulu.

### Pour masquer sans supprimer

C'est le message central du chapitre.

| Objectif                          | Le bon geste                                            |
| --------------------------------- | ------------------------------------------------------- |
| Retirer un événement du site      | décocher **Afficher sur le site** (et non Delete)       |
| Retirer un événement de l'accueil | décocher **Afficher sur l'accueil**                     |
| Annoncer une annulation           | État → **Annulé**                                       |
| Retirer une messe temporairement  | décocher **Actif**                                      |
| Retirer un annonceur              | statut → **Inactif**                                    |
| Retirer une photo du carrousel    | la sortir de la liste (le fichier reste dans le Studio) |
| Masquer toute une section         | interrupteur « Afficher… » de la page concernée         |

---

## 7. Plan proposé du PDF

### Partie A — Se repérer

1. Ce que tu peux changer toute seule (carte site ↔ Studio, une page par ligne)
2. Ouvrir le Studio et s'y connecter
3. Visite guidée : la barre du haut
4. Les trois dossiers : Données partagées, Collections, Pages
5. Brouillon et Publié : les deux pastilles
6. Presentation : voir le site pendant qu'on écrit

### Partie B — Les gestes de base

Chaque chapitre = étapes numérotées et capture.

7. Modifier un texte
8. Remplacer une image
9. Choisir ce qui reste visible sur une image (recadrage et point focal)
10. Ajouter ou retirer une ligne dans une liste
11. Changer une date ou une heure
12. Prévisualiser
13. Publier
14. Annuler ce que je viens de faire
15. Retrouver une version d'avant (History)

### Partie C — Les tâches courantes

16. Ajouter un événement (parcours complet, 5 onglets)
17. Modifier un événement
18. Annuler ou retirer un événement
19. Mettre un événement en avant sur l'accueil
20. Modifier les horaires des messes
21. Ajouter un horaire saisonnier
22. Modifier les coordonnées de la paroisse
23. Modifier la Friperie (les deux endroits : la fiche et la page)
24. Modifier un annonceur
25. Modifier les blocs de l'accueil
26. Ajouter une photo au carrousel de l'accueil
27. Modifier ce que Google affiche

### Partie D — Se sortir d'ennui

28. Le bouton Publier est gris : que faire
29. Les messages d'avertissement (⚠) et comment les lire
30. Ce que j'ai publié n'apparaît pas encore sur le site
31. Bonnes pratiques pour les images (taille, texte alternatif, droits,
    personnes)
32. Ce qu'il vaut mieux ne pas toucher
33. Partager un aperçu à quelqu'un
34. Que faire si quelque chose semble bizarre — et qui appeler

### Annexes

- **A.** Petit lexique anglais → français (Publish, Draft, Discard changes,
  Remove, Upload, Select, Clear field, History…)
- **B.** Aide-mémoire une page : « je veux masquer X → je fais Y »
- **C.** Formats acceptés : heure `08:00`, date `2026-09-27 10:00`, téléphone
  `514 722-1161`

---

## 8. Captures à prendre (30)

Toutes en **thème clair**, fenêtre 1440×900, avec le compte de Sophie.

| #   | Fichier                           | Écran                                | Ce qu'elle regarde                                  |
| --- | --------------------------------- | ------------------------------------ | --------------------------------------------------- |
| 01  | `studio-connexion.png`            | page de connexion                    | le bouton de son fournisseur                        |
| 02  | `studio-accueil-structure.png`    | Contenu, 3 dossiers                  | les trois dossiers                                  |
| 03  | `barre-du-haut-annotee.png`       | barre du haut                        | Structure et Presentation ; zones grisées à ignorer |
| 04  | `dossier-donnees-partagees.png`   | les 3 fiches                         | —                                                   |
| 05  | `dossier-collections.png`         | Événements et Annonceurs             | —                                                   |
| 06  | `dossier-pages.png`               | les 10 pages                         | correspondance avec le site                         |
| 07  | `document-anatomie.png`           | Coordonnées ouvert                   | pastilles, onglets, Publish                         |
| 08  | `pastilles-published-draft.png`   | zoom sur les pastilles               | orange = pas encore en ligne                        |
| 09  | `used-on-pages.png`               | « Used on 4 pages » déplié           | où ce texte s'affiche                               |
| 10  | `presentation-vue-generale.png`   | site à gauche, champs à droite       | —                                                   |
| 11  | `presentation-clic-sur-texte.png` | clic sur un texte → champ ouvert     | flèche du site vers le champ                        |
| 12  | `presentation-barre-adresse.png`  | barre d'adresse de l'aperçu          | changer de page                                     |
| 13  | `presentation-partager.png`       | « Share this preview »               | encadré Attention                                   |
| 14  | `texte-avant-apres.png`           | un champ modifié et l'aperçu         | —                                                   |
| 15  | `bouton-publier-actif.png`        | Publish en couleur                   | —                                                   |
| 16  | `bouton-publier-gris.png`         | Publish gris avec ⚠                  | le réflexe : ouvrir le ⚠                            |
| 17  | `panneau-validation.png`          | panneau Validation ouvert            | message en français                                 |
| 18  | `menu-document-actions.png`       | Duplicate / Discard changes / Delete | Discard = annuler ; Delete = ne pas toucher         |
| 19  | `menu-history.png`                | History                              | —                                                   |
| 20  | `historique-versions.png`         | une version passée                   | —                                                   |
| 21  | `image-champ.png`                 | champ image complet                  | Fichier, Texte alternatif, Crédit, Droits, cases    |
| 22  | `image-menu.png`                  | Upload / Select / Clear field        | Upload = remplacer                                  |
| 23  | `image-recadrage.png`             | Edit hotspot and crop                | rectangle = cadre, cercle = à garder visible        |
| 24  | `evenement-liste.png`             | liste des Événements                 | + pour créer, pastilles                             |
| 25  | `evenement-onglets.png`           | les 5 onglets                        | où va quoi                                          |
| 26  | `evenement-publication.png`       | onglet Publication                   | ⚠ « État » ≠ pastille Sanity                        |
| 27  | `evenement-dates.png`             | Début et Fin avec calendrier         | format de la date                                   |
| 28  | `horaires-liste-celebrations.png` | liste des célébrations               | ajouter, réordonner, Remove                         |
| 29  | `horaires-une-celebration.png`    | une célébration ouverte              | heure sur 2 chiffres                                |
| 30  | `menu-plus-interdit.png`          | menu du « + » barré en rouge         | l'interdit principal                                |

Jamais dans les captures : jetons, variables d'environnement, Vision, adresses
de déploiement, courriels privés.

---

## 9. Points où l'interface va la perdre

1. **Interface bilingue.** Le contenu est en français, la coquille Sanity en
   anglais : _Publish, Draft, Discard changes, Remove, Upload, Select, Clear
   field, History, Used on 4 pages_. C'est le problème n°1.
2. **« Brouillon » a deux sens.** La pastille _Draft_ de Sanity, et le champ
   **État → Brouillon** d'un événement. Un événement peut être « Publié »
   (État) et quand même invisible parce que non publié dans Sanity. Et
   l'inverse.
3. **Le bouton Publier devient gris sans explication** quand une erreur bloque.
   C'est le cas en ce moment — voir §11.
4. **Les horaires s'affichent en anglais dans la liste** : `tuesday · 08:00`,
   `wednesday · 8:00`. Le site, lui, affiche « Mardi ». Défaut d'aperçu, pas de
   données.
5. **L'heure exige deux chiffres.** `8:00` est refusé, `08:00` accepté. Erreur
   réellement présente en ce moment.
6. **Les dates s'écrivent `2026-09-27 10:00`**, pas « 27 septembre ».
7. **Presentation n'est pas fiable.** Les zones cliquables du site
   n'apparaissent qu'au premier chargement ; changer de page dans la barre
   d'adresse met à jour le formulaire de droite mais parfois pas l'image de
   gauche. Sophie croira avoir cassé quelque chose.
8. **La recherche est floue** : « friperie » ramène « Page Notre paroisse » et
   « Nous joindre » avant « Au Coin de l'Entraide ».
9. **Cliquer la pastille « Published »** change les lunettes de tout le Studio
   et remplace _Publish_ par un **Unpublish rouge** au même endroit.
10. **Deux cases peuvent masquer une photo en silence** : « Droits de
    publication confirmés » et « Consentement des personnes obtenu ». Non
    cochée, la photo reste dans la liste et n'apparaît pas sur le site.
11. **Delete est collé à Discard changes** dans le même menu.
12. **Releases** promet une publication programmée qui est verrouillée.
13. **Thème sombre par défaut** — mauvais pour un PDF imprimé.
14. **Le site public ne change pas tout de suite** après Publish : Cloudflare
    reconstruit le site (quelques minutes). Sans cette phrase, elle republiera
    dix fois.

---

## 10. Recommandations — et la décision à prendre

**La question :** six correctifs simples changeraient l'interface que Sophie
voit. Faits **avant** les captures, le guide est deux fois plus court et deux
fois plus sûr. Faits après, les captures sont à refaire.

| #     | Correctif                                                               | Effet                                                                                                                                                        | Coût        |
| ----- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| **A** | Installer le pack français `@sanity/locale-fr-FR`                       | _Publish → Publier_, _Draft → Brouillon_, _Discard changes → Annuler les modifications_… Supprime environ 80 % du vocabulaire anglais, donc l'annexe lexique | faible      |
| **B** | Limiter le « + » aux Événements et Annonceurs                           | supprime le piège des doublons fantômes                                                                                                                      | faible      |
| **C** | Retirer **Vision** et **Releases** de la barre                          | deux onglets inutiles de moins                                                                                                                               | très faible |
| **D** | Afficher « Mardi » au lieu de `tuesday` dans la liste des horaires      | la liste devient lisible                                                                                                                                     | faible      |
| **E** | Accepter `8:00` et le normaliser en `08:00`                             | supprime l'erreur bloquante la plus probable                                                                                                                 | faible      |
| **F** | Empêcher **Delete** et **Duplicate** sur les Pages et Données partagées | supprime le geste irréversible                                                                                                                               | moyen       |

### Autres recommandations

- **Régler les brouillons en attente avant les captures** — voir §11.
- **Captures en thème clair**, et **avec le compte de Sophie**, pas celui du
  développeur : les menus diffèrent selon les droits.
- **Une page A5 plastifiée** à côté du poste : « je veux masquer X → je fais
  Y », les trois adresses, et qui appeler.
- **Ne pas documenter** Vision, Releases, Tasks, Inspect, Incoming references,
  Copy et Paste document, Copy document ID. Une ligne suffit : « si tu tombes
  là-dessus, referme, tu n'en as pas besoin. »

---

## 11. Trouvé dans le Studio, à régler avant les captures

1. **Un brouillon bloqué sur « Horaires des messes »** — modifié il y a 1 h.
   Une messe du **mercredi 8 h** a été ajoutée avec l'heure `8:00` au lieu de
   `08:00`. La fiche est **invalide**, le bouton Publish est **gris**, et la
   messe du mercredi **n'est pas en ligne**. Correction : `08:00`, puis
   publier.
2. **Un brouillon sur la Page d'accueil** depuis le 19 août. En-tête et section
   « Ensemble » identiques au publié — reste à vérifier ce qui diffère ailleurs
   avant de publier ou d'annuler.
3. Le pèlerinage Notre-Dame-du-Cap garde son **espace en trop en début de
   titre**, visible seulement dans le Studio (retiré à l'affichage).

---

## 12. Prochaine étape

Au choix :

1. Appliquer A–F, puis prendre les 30 captures et monter le PDF.
2. Prendre les captures du Studio tel quel ; le guide documente alors
   l'anglais.
3. Ajuster d'abord ce plan.
