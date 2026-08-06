# Rencontre du 11 août 2026 — checklist

Ce document sert pendant la rencontre. Il dit **quoi montrer**, **quoi demander**
et **pourquoi ça bloque**. Les chiffres ont été relevés dans le jeu de données le
2026-08-06, pas estimés.

Rien ici n'exige de connaissance technique de la part de la secrétaire.

---

## En un coup d'œil

Quatre réponses débloquent presque tout le reste :

| Réponse à obtenir                         | Ce qu'elle débloque                                   |
| ----------------------------------------- | ----------------------------------------------------- |
| **L'adresse du site** (le nom de domaine) | La mise en ligne, le formulaire de contact, Google    |
| **Les accès d'hébergement** (Cloudflare)  | La mise en ligne                                      |
| **Le nom de la photographe**              | 20 images qui attendent leur crédit                   |
| **L'accord des 4 annonceurs**             | Une page qui affichera leurs coordonnées publiquement |

Deux d'entre elles ne coûtent qu'une décision. Les deux autres demandent un
appel à quelqu'un.

---

## 1. À faire ensemble, devant l'écran

### 1.1 Montrer l'onglet « Google et partages »

Chacune des dix pages publiques a maintenant cet onglet dans l'interface
d'édition. Il contient trois champs, tous déjà remplis :

- **le titre** qui apparaît dans Google et dans l'onglet du navigateur;
- **la description** qui apparaît sous le titre dans les résultats de recherche;
- **l'image de partage**, celle qui s'affiche quand on colle l'adresse de la
  page dans Facebook, Messenger ou un courriel.

À dire clairement : ces champs sont **déjà remplis** avec le texte actuel du
site. Personne n'a à les remplir pour que le site fonctionne. On les modifie
seulement si on veut changer ce que Google affiche.

À faire pendant la rencontre : ouvrir la page d'accueil, modifier la
description, enregistrer, montrer que le changement suit. C'est la meilleure
démonstration que l'interface lui appartient vraiment.

### 1.2 Déposer une image de partage

**Aujourd'hui il n'y en a aucune.** Vérifié : le champ `shareImage` des
réglages généraux est vide, et aucune des dix pages n'a la sienne.

Conséquence, une fois le site en ligne : quand quelqu'un partagera un lien sur
Facebook ou dans un courriel, **il n'y aura aucune image**. Juste un titre et
une ligne de texte. C'est ce qui fait qu'un lien passe inaperçu.

Le code est prêt : dès qu'une image est déposée, elle sert à toutes les pages.
Une page peut ensuite avoir la sienne si on veut.

Ce qu'il faut : **une photo, une seule**, de préférence horizontale et large
(l'idéal est environ 1200 × 630 pixels). La façade de l'église conviendrait.
Elle peut être déposée pendant la rencontre, en deux minutes.

> Aucune image n'a été choisie à sa place. Le site n'affiche pas d'image de
> remplissage : mieux vaut aucune image qu'une image qui n'a rien à voir.

### 1.3 Corriger un titre mal saisi

L'activité « Pèlerinage au Sanctuaire Notre-Dame-du-Cap » a **un espace en trop
au début de son titre**, dans l'interface d'édition.

Sans conséquence sur le site : le titre est nettoyé avant l'affichage. C'est
donc purement cosmétique, dans le Studio. Deux secondes à corriger pendant
qu'on y est.

---

## 2. À obtenir — décisions et informations

Aucune de ces réponses ne peut être devinée. Rien n'a été inventé à leur place.

### 2.1 L'adresse du site (bloque le plus de choses)

**Le nom de domaine n'est pas choisi.** Tant qu'il ne l'est pas :

- le site ne peut pas être mis en ligne;
- Google ne peut pas être averti de l'adresse des pages;
- le formulaire de contact ne peut pas envoyer de courriel — l'expéditeur doit
  venir d'un domaine vérifié, et `videotron.ca` ne convient pas.

Le code est prêt et attend une seule variable. Un site construit sans elle
échoue volontairement, plutôt que de publier des adresses fausses.

**Question à poser :** la paroisse a-t-elle déjà un nom de domaine? Si oui,
lequel, et qui en détient le compte? Sinon, quel nom veut-elle?

### 2.2 Les accès d'hébergement

Le site sera hébergé chez Cloudflare. Il faut :

- un compte, ou l'accès à celui qui existe;
- le droit d'y créer le projet et d'y saisir la configuration.

**Question à poser :** qui, dans la paroisse, détient ou peut créer ce compte?

### 2.3 Les crédits photographiques

**50 images du site portent une note interne sur leur provenance.** Ces notes
ne sont **jamais affichées** — elles servent à savoir ce qu'on a le droit de
publier. Répartition réelle :

| Situation                                                | Nombre | Action                    |
| -------------------------------------------------------- | -----: | ------------------------- |
| Provenance réglée (domaine public, Pixabay, IA déclarée) |     20 | rien à faire              |
| Page source à archiver, licence connue                   |      3 | travail interne           |
| **Attend une réponse humaine**                           | **27** | **à demander le 11 août** |

Les 27 se regroupent en **cinq questions**, pas 27 :

| #   | Question                                                                                                                                                               | Images |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----: |
| 1   | **Quel est le nom de la photographe?** Photos prises dans l'église par une proche, avec son autorisation. La note dit explicitement « nom à inscrire dans le crédit ». |     11 |
| 2   | **Qui a pris les photos de l'église?** Leur note renvoie à la paroisse. C'est peut-être la même personne qu'en 1 — à confirmer, pas à supposer.                        |      9 |
| 3   | **Le nom de la mère de l'administratrice du site** (page Première visite), qui a autorisé sa photo.                                                                    |      1 |
| 4   | **Deux illustrations de l'accueil** : générées par intelligence artificielle ou non? D'où viennent-elles? Sans réponse, aucun crédit ne peut être écrit.               |      2 |
| 5   | **Les images de deux activités** : fournies avec le projet, auteur et licence inconnus. L'une est datée de 2011.                                                       |      4 |

Si les questions 1 et 2 ont la même réponse — ce qui est probable — **une seule
information règle 20 des 27 lignes**.

En attendant : aucun crédit inventé, aucun texte « à confirmer » affiché,
aucune image retirée. Le site est correct tel quel; c'est la **traçabilité** qui
manque.

> Le rapport détaillé, image par image, est le prochain livrable. Il n'attend
> pas ces réponses pour être écrit.

### 2.4 L'accord des quatre annonceurs

Le site n'est **déployé nulle part** : rien n'est encore visible par Google, et
la question n'est donc pas urgente. Mais la page `/nos-annonceurs` a été rendue
**indexable** le 6 août, ce qui veut dire qu'elle le deviendra dès la mise en
ligne. Elle affiche quatre fiches avec leur nom, leur téléphone et leur
courriel :

- Buffet Marina — 514 728-4345
- Frantz Benjamin — 514 728-2474
- Josué Corvil — 514 872-7800
- Patricia Lattanzio — 514 256-4548

Trois sont des élus, et leurs coordonnées de bureau sont publiques par
ailleurs. **La question n'est donc pas la confidentialité, c'est le
consentement** : personne n'a confirmé qu'ils acceptent de figurer comme
annonceurs de la paroisse. C'est un accord commercial affiché en leur nom.

**Question à poser :** ces quatre annonceurs ont-ils donné leur accord? Y a-t-il
une entente écrite, ou un montant versé?

Si la réponse est non ou incertaine, un réglage permet de **masquer les fiches
sans fermer la page** — c'est une case à cocher, réversible en tout temps.

### 2.5 La politique de confidentialité

Deux informations manquent, et elles ne peuvent pas être inventées :

- **le nom du responsable de la protection des renseignements personnels** —
  au Québec, toute organisation doit en désigner un. Par défaut c'est la
  personne ayant la plus haute autorité, mais elle peut déléguer;
- **la durée de conservation** des messages reçus par le formulaire.

**Questions à poser :** qui remplit ce rôle à la paroisse? Combien de temps
garde-t-on les demandes reçues?

### 2.6 L'adresse d'envoi du formulaire

Le destinataire est confirmé : `paroissergoupil@videotron.ca`.

Ce qui manque, c'est l'adresse **expéditrice**. Elle doit venir du domaine du
site, une fois celui-ci choisi — un fournisseur de courriel refuse d'envoyer au
nom d'un domaine qu'il ne peut pas vérifier, et les messages finiraient dans
les indésirables.

Rien à décider maintenant : cette réponse découle du domaine.

### 2.7 Les horaires — une vérification

Les heures affichées ont été relevées sur l'**ancien site**, jamais confirmées
auprès du secrétariat :

- **Secrétariat** — mardi et jeudi de 9 h à 14 h 30 (appels), mercredi de 9 h à
  16 h (bureau ouvert)
- **Messes** — mardi et jeudi 8 h, samedi 16 h, dimanche 10 h. Attention :
  l'ancien site les présentait comme les horaires de **juin et juillet**. La
  rentrée arrive.
- **Friperie Au Coin de l'Entraide** — mardi, mercredi et jeudi de 13 h à 17 h,
  téléphone 514 721-2842

**Question à poser :** ces heures sont-elles exactes, et changent-elles à la
rentrée?

C'est la seule chose de cette liste qu'une personne peut corriger elle-même
dans l'interface, en deux minutes. Bon deuxième exercice après la description.

---

## 3. Ce qui reste bloqué si on ne repart avec rien

| Sans…                     | On ne peut pas faire             |
| ------------------------- | -------------------------------- |
| le domaine                | la mise en ligne, le formulaire  |
| les accès Cloudflare      | la mise en ligne                 |
| le responsable + la durée | la politique de confidentialité  |
| les noms des photographes | fermer le dossier des crédits    |
| l'accord des annonceurs   | trancher entre garder et masquer |

Le travail qui **ne dépend de personne** et peut continuer entretemps : le
rapport détaillé des crédits, le nettoyage du code et du jeu de données, la
préparation du formulaire de contact et de la configuration d'hébergement — tout
sauf le geste final de mise en ligne.

---

## 4. À imprimer, si utile

Cinq questions, dans l'ordre d'importance :

1. Quel sera le nom de domaine du site, et qui détient le compte?
2. Qui a, ou peut créer, le compte Cloudflare?
3. Quel est le nom de la photographe, et est-ce la même qui a photographié
   l'église?
4. Les quatre annonceurs ont-ils donné leur accord pour être publiés?
5. Qui est le responsable de la protection des renseignements personnels, et
   combien de temps garde-t-on les messages reçus?

Et une chose à rapporter : **une photo horizontale pour les partages.**
