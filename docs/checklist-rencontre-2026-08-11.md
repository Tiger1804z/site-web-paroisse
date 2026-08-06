# Rencontre du 11 août 2026 — checklist

Ce document sert pendant la rencontre. Il dit **quoi montrer**, **quoi demander**
et **pourquoi ça bloque**. Les chiffres ont été relevés dans le jeu de données le
2026-08-06, pas estimés.

Rien ici n'exige de connaissance technique de la part de la secrétaire.

---

## En un coup d'œil

| À obtenir                                     | Ce que ça débloque                                    | Urgence                |
| --------------------------------------------- | ----------------------------------------------------- | ---------------------- |
| **Qui détient `paroissesaintrenegoupil.com`** | La mise en ligne, le formulaire de contact            | **avant le 14 oct.**   |
| **Photos du vrai lieu** (à prendre sur place) | Une dizaine d'images génériques à remplacer           | le jour même           |
| **L'accord des 4 annonceurs**                 | Une page qui affichera leurs coordonnées publiquement | avant la mise en ligne |
| **Responsable de la confidentialité + durée** | La politique de confidentialité                       | avant la mise en ligne |

> **Le domaine existe déjà** — il n'y a rien à choisir. Voir 2.1 : il **expire
> le 14 octobre 2026**, et c'est le seul vrai compte à rebours du dossier.

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

Ce qu'il faut : **une photo, une seule**, horizontale et large (l'idéal est
environ 1200 × 630 pixels). La façade de l'église conviendrait — et elle fait
partie des prises de vue prévues le 11.

Une fois déposée, elle sert à toutes les pages, une page pouvant ensuite avoir
la sienne. La secrétaire peut la changer elle-même quand elle veut.

### 1.3 Corriger un titre mal saisi

L'activité « Pèlerinage au Sanctuaire Notre-Dame-du-Cap » a **un espace en trop
au début de son titre**, dans l'interface d'édition.

Sans conséquence sur le site : le titre est nettoyé avant l'affichage. C'est
donc purement cosmétique, dans le Studio. Deux secondes à corriger pendant
qu'on y est.

---

## 2. À obtenir — décisions et informations

Aucune de ces réponses ne peut être devinée. Rien n'a été inventé à leur place.

### 2.1 Le domaine — il existe déjà, et il expire bientôt

La paroisse possède **`paroissesaintrenegoupil.com`**, qui sert son site
actuel. Relevé au registre public le 2026-08-06 :

|              |                             |
| ------------ | --------------------------- |
| Enregistré   | 2023-10-14                  |
| **Expire**   | **2026-10-14**              |
| Serveurs DNS | `ADNS1/2/3.DOMAINEPLUS.NET` |

**Il n'y a donc aucun nom à choisir.** On garde celui-là : c'est l'adresse que
les gens connaissent, elle a de l'historique et des liens entrants. En prendre
un autre jetterait tout ça.

Deux questions, et la première est un compte à rebours :

1. **Le renouvellement du 14 octobre est-il automatique?** Sinon, qui le fait?
   Un domaine expiré se fait racheter très vite, et le récupérer coûte cher
   quand c'est encore possible.
2. **Qui détient le compte chez Domaine Plus** (le fournisseur des serveurs
   DNS)? Il faudra y modifier deux ou trois lignes pour diriger le domaine
   vers le nouveau site. C'est l'affaire de cinq minutes — mais il faut
   l'accès.

### 2.2 L'hébergement

Le nouveau site sera hébergé chez Cloudflare, et **c'est toi qui t'en occupes**
— la secrétaire n'a rien à y faire, c'est justement le partage prévu : elle
édite le contenu, la technique reste de ton côté.

Une seule précaution, qui n'est pas technique : **créer le compte avec une
adresse courriel de la paroisse**, et t'y ajouter comme administrateur. Si un
jour tu passes à autre chose, la paroisse garde la main sur son site sans
dépendre de ta boîte de courriel. Gratuit à faire maintenant, pénible à
rattraper plus tard.

**Rien à demander à la paroisse ici**, sauf peut-être une adresse courriel
officielle pour ouvrir le compte.

### 2.3 Les images — prises de vue sur place

Les images actuelles sont **provisoires**. C'est précisément pour ça qu'elles
sont dans Sanity : elles se remplacent sans toucher au code, et sans
développeur.

Sur les 50 emplacements, **23 ne montrent pas la Paroisse Saint-René-Goupil** —
des images de banque, des illustrations, ou des photos d'autres lieux. Les plus
visibles :

- les **trois images de la friperie** sont des photos génériques de vêtements
  sur un portant. Le vrai local est au sous-sol de l'église;
- l'illustration de la section « services » de l'accueil est une **façade de
  cathédrale à Florence**;
- les lampions de l'accueil viennent d'une banque d'images.

**La liste complète, emplacement par emplacement, est dans
`docs/prises-de-vue-2026-08-11.md`.** C'est le document à avoir en main sur
place le 11.

Une fois de vraies photos déposées, la question des crédits disparaît pour ces
emplacements : l'auteur est connu et l'autorisation aussi.

**Ce qui ne se règle pas en photographiant** — à demander à la paroisse :

- **des archives photographiques.** Huit illustrations de la page « Notre
  paroisse » racontent l'histoire de 1959 à aujourd'hui et sont générées par
  intelligence artificielle, faute d'images d'époque. La paroisse a-t-elle des
  photos anciennes de la construction, de l'inauguration, des curés?
- **les photos des deux pèlerinages** (Sainte-Anne-de-Beaupré,
  Notre-Dame-du-Cap) : ce sont des bâtiments appartenant à d'autres
  institutions, et la provenance des fichiers est inconnue. À remplacer par des
  images officiellement libres, ou par des photos prises lors du prochain
  pèlerinage.

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

Ce qui manque, c'est l'adresse **expéditrice**. Elle devra venir de
`paroissesaintrenegoupil.com` — un fournisseur de courriel refuse d'envoyer au
nom d'un domaine qu'il ne peut pas vérifier, et les messages finiraient dans
les indésirables.

Rien à décider maintenant : ça découle de l'accès au domaine (2.1).

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

| Sans…                        | On ne peut pas faire             |
| ---------------------------- | -------------------------------- |
| l'accès au domaine           | la mise en ligne, le formulaire  |
| le responsable + la durée    | la politique de confidentialité  |
| l'accord des annonceurs      | trancher entre garder et masquer |
| les archives photographiques | remplacer les 8 illustrations IA |

Le travail qui **ne dépend de personne** et peut continuer entretemps : le
nettoyage du code et du jeu de données, la préparation du formulaire de contact
et de la configuration d'hébergement — tout sauf le geste final de mise en
ligne.

Et si le renouvellement du domaine n'est pas réglé le 11, **c'est la seule
chose à ne pas laisser traîner** : le 14 octobre arrive vite.

---

## 4. À imprimer, si utile

Cinq questions, dans l'ordre d'importance :

1. **Le domaine `paroissesaintrenegoupil.com` se renouvelle-t-il tout seul le
   14 octobre?** Sinon, qui s'en occupe?
2. **Qui détient le compte chez Domaine Plus**, où pointent les serveurs DNS?
3. Les quatre annonceurs ont-ils donné leur accord pour être publiés, et
   y a-t-il une entente écrite?
4. Qui est le responsable de la protection des renseignements personnels, et
   combien de temps garde-t-on les messages reçus?
5. La paroisse a-t-elle des **photos d'archives** — construction, inauguration,
   anciens curés?

Et deux choses à rapporter :

- les **photos prises sur place** (liste dans
  `docs/prises-de-vue-2026-08-11.md`);
- une **photo horizontale de la façade**, qui servira aux partages de liens.
