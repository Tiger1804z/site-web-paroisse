# Le formulaire Contact

Livré le 20 août 2026. Ce document décrit le système **réellement en place**, et
non ce qui était envisagé — la version « préparation », antérieure à
l’implémentation, reste dans l’historique Git.

## Le trajet d’un message

```
Navigateur                  Cloudflare Pages            Formspree      Secrétariat
──────────                  ────────────────            ─────────      ───────────
/contact (HTML statique)
   │
   │  POST /api/contact
   │  JSON + jeton Turnstile
   ▼
                     functions/api/contact.ts
                     (lit l’environnement, rien d’autre)
                            │
                            ▼
                     handleContactRequest()
                       1. méthode POST
                       2. Origin = la nôtre
                       3. Content-Type JSON
                       4. taille annoncée
                       5. taille réelle
                       6. JSON.parse
                       7. schéma Zod (honeypot inclus)
                       8. Turnstile ──► siteverify
                       9. envoi ─────────────────► POST formspree.io/f/xxxxxxxx
                                                        │  (form-urlencoded)
                                                        ▼
                                             From:     Formspree
                                             To:       réglé côté Formspree
                                             Reply-To: le visiteur
```

## Où vit quoi

| Fichier                                             | Rôle                                                 |
| --------------------------------------------------- | ---------------------------------------------------- |
| `functions/api/contact.ts`                          | Coquille Pages. Lit l’environnement, câble, délègue. |
| `src/lib/contact/handleContactRequest.ts`           | Les neuf gardes. Toute la décision.                  |
| `src/lib/contact/contactSubmission.ts`              | Le schéma Zod et les motifs de contact.              |
| `src/lib/contact/verifyTurnstile.ts`                | L’appel `siteverify`.                                |
| `src/lib/contact/sendContactEmail.ts`               | L’objet, le `Reply-To`, et l’appel Formspree.        |
| `src/components/sections/contact/ContactForm.astro` | Le widget, le `fetch`, les états.                    |

**Le dossier `functions/` est à la racine du dépôt, pas dans `dist/`.** C’est ce
qui permet au site public de rester un tas de fichiers HTML : aucun adaptateur
Astro n’est chargé, `dist/_worker.js` n’existe pas, et
`scripts/check-public-bundle.mjs` continue de le vérifier à chaque
`pnpm validate`.

Rien de ce qui décide ne vit dans `functions/`. Tout est dans
`src/lib/contact/`, où `node --test` l’exerce sans Cloudflare, sans clé et sans
réseau.

## L’ordre des gardes, et pourquoi

Chaque garde est moins chère que la suivante, et refuse avant que la suivante
ait à travailler. Deux décisions méritent une explication.

**La taille se mesure deux fois.** `Content-Length` est déclaratif : c’est
l’appelant qui l’écrit. On le croit quand il s’accuse — il annonce 10 Mo, on
refuse sans rien lire — jamais quand il se disculpe. La seconde mesure porte sur
le corps réellement reçu, **avant `JSON.parse()`** : c’est l’analyse qui
construit un arbre d’objets, donc l’analyse qu’on protège.

**Turnstile vient après Zod, jamais avant.** Un jeton ne sert qu’une fois. Placé
avant la validation, il serait consommé par un courriel mal tapé : le visiteur
corrigerait, renverrait, et se ferait refuser pour « jeton déjà utilisé » sans
comprendre. Placé après, un message invalide ne coûte ni jeton ni aller-retour
réseau. `tests/contact-request.test.mjs` verrouille cet ordre — remonter la
vérification fait tomber un test précis.

Conséquence à connaître : si Turnstile passe et que Formspree tombe (502), le jeton
est brûlé. Le script client redemande donc un jeton **après chaque tentative**,
réussie ou non.

## L’origine se compare à elle-même

```ts
origin === new URL(request.url).origin;
```

Aucune liste d’origines à tenir. La Function est servie par le même domaine que
la page — en local, sur `*.pages.dev`, sur le domaine final. Le jour où le
domaine bascule, il n’y a rien à mettre à jour, donc rien à oublier.

Un `Origin` absent est refusé : le navigateur en envoie un sur toute requête qui
n’est ni `GET` ni `HEAD`.

## Échouer fermé

Une variable d’environnement manquante donne une chaîne vide, et les deux
fabriques refusent alors tout.

C’est délibéré. Une porte fermée se remarque en dix minutes; une porte ouverte,
jamais. Le jour où `TURNSTILE_SECRET_KEY` manque au tableau de bord, on veut un
formulaire visiblement en panne — pas un formulaire ouvert en grand que personne
ne remarque avant le premier flot de pourriel.

## Variables et secrets

Aucune valeur réelle n’est dans le dépôt. Les trois se saisissent dans le projet
**Pages** — pas dans le Worker `paroisse-preview`, qui est un autre produit avec
ses propres réglages.

| Variable                    | Public ? | Lue au  | Où                 |
| --------------------------- | -------- | ------- | ------------------ |
| `PUBLIC_TURNSTILE_SITE_KEY` | oui      | build   | Pages → Variables  |
| `TURNSTILE_SECRET_KEY`      | non      | requête | Pages → **Secret** |
| `FORMSPREE_ENDPOINT`        | non      | requête | Pages → **Secret** |

Il n’y a **ni expéditeur ni destinataire** à configurer : Formspree attache le
destinataire au formulaire, dans son propre tableau de bord, et expédie sous sa
propre identité. `FORMSPREE_ENDPOINT` désigne donc à lui seul la boîte de
destination — et se traite pour cette raison comme un secret : quiconque le
connaît peut y poster directement, sans passer par Zod ni par Turnstile.

La clé publique Turnstile **doit** être dans le HTML — le widget en a besoin.
Elle est liée au domaine, donc sans valeur ailleurs.
`tests/gallery-and-site-settings.test.mjs` vérifie qu’aucune des deux autres
n’apparaît dans un fichier servi au navigateur.

## Destinataire

```
paroissergoupil@videotron.ca
```

Orthographe confirmée par la paroisse le 20 août 2026. Seule adresse canonique du
dépôt : `paroisse` + `rgoupil`, **sans `s` intercalé**.

Le destinataire se règle **dans le tableau de bord Formspree**, sur le formulaire
que `FORMSPREE_ENDPOINT` désigne. Il n’est ni dans le code, ni dans Sanity, ni
dans une variable d’environnement — le changer ne demandera donc **ni commit ni
redéploiement**.

✅ **C’est bien cette adresse qui reçoit, depuis le 26 août 2026.** Formspree
exige qu’une adresse soit vérifiée par son titulaire avant de lui livrer quoi que
ce soit : le secrétariat l’a fait, et le destinataire du formulaire a été basculé
vers elle dans le tableau de bord. La boîte temporaire ne sert plus.

Elle **n’est pas non plus affichée sur le site** — `showPublicEmail` reste
désactivé. Une adresse en clair dans une page est moissonnée par les robots à
pourriel et arriverait dans la même boîte que celle que le formulaire protège. Le
formulaire est le canal écrit de la paroisse.

## From, To et Reply-To

`To` n’exige aucune permission. `From` en exige une : il faut prouver qu’on a le
droit d’expédier au nom de cette adresse, par des enregistrements **DKIM** et
**SPF** dans le DNS du domaine.

C’est impossible ici, et c’est toute l’histoire de ce fichier : la paroisse garde
son ancien site sur `paroissesaintrenegoupil.com`, et **son DNS ne doit pas
bouger**.

Formspree contourne la question en ne la posant pas. Il expédie sous **sa propre
identité**, déjà prouvée, et pose l’adresse du visiteur en `Reply-To` :

```
De        : Formspree (son domaine à lui)
À         : la boîte réglée sur formspree.io
Reply-To  : jean.tremblay@videotron.ca   ← le visiteur
Objet     : [Nouveau message du site] Baptême — Jean Tremblay
```

La secrétaire clique **Répondre**, et son client courriel vise le visiteur.

### Les champs, et pourquoi ces noms-là

Formspree reconnaît certains noms de champs et leur donne un sens. Les autres
deviennent des lignes ordinaires du courriel.

| Envoyé                | Champ     | Effet                            |
| --------------------- | --------- | -------------------------------- |
| `submission.fullName` | `name`    | Nom du contact                   |
| `submission.email`    | `email`   | **Devient le `Reply-To`**        |
| `submission.phone`    | `phone`   | Téléphone (omis s’il est absent) |
| `reasonLabel`         | `reason`  | Ligne ordinaire, en clair        |
| `submission.message`  | `message` | Corps du message                 |
| objet composé         | `subject` | **Devient l’en-tête `Subject`**  |

Notre contrat interne dit `fullName`, Formspree attend `name` : **la traduction
vit dans la couche de transport et nulle part ailleurs.** C’est ce qui a permis
au gestionnaire de traverser trois fournisseurs sans changer d’une ligne.

`reason` porte le libellé lisible et non la valeur machine — c’est un humain qui
lira « Baptême », pas « baptism ».

`subject` s’écrit sans tiret bas — `_subject` est l’ancienne syntaxe. **Vérifié
par un envoi réel le 21 août 2026** : l’objet arrive tel quel dans la boîte, sous
la forme `[Nouveau message du site] <Motif> — <Nom>`. Ne pas le renommer.

### Ce qu’on y perd

Formspree **compose le corps du courriel lui-même**, à partir des champs reçus.
La mise en page n’est donc plus la nôtre, et `formatContactEmail` ne décide plus
que de deux choses : l’objet et le `Reply-To`.

C’est le compromis assumé du service : on échange le contrôle du `From`, du `To`
et de la mise en page contre l’absence totale de configuration DNS.

### `accept: application/json` n’est pas décoratif

Sans cet en-tête, Formspree répond par une **redirection vers sa page de
remerciement** — ce que voit un navigateur qui poste un vrai `<form>`. C’est lui
qui garantit la forme `{"ok": true}`, et donc la garde de succès.

### La garde de succès

`response.ok` **et** `result.ok === true`. Comparer, jamais tester la véracité :
`'true'` est une chaîne non vide, donc vraie, et laisserait passer un refus.

C’est la quatrième occurrence du même réflexe dans ce formulaire, après
`z.literal(true)` pour le consentement et `success === true` pour Turnstile.

## Le trajet réel, validé le 21 août 2026

Le trajet complet a été joué en vrai depuis un déploiement Preview de cette
branche, sur `*.pages.dev`, avec les vraies clés :

```
navigateur → /api/contact → gardes HTTP → Zod → Turnstile siteverify
           → Formspree → boîte de réception
```

Ce qui a été observé, et non déduit :

- le widget Turnstile se charge et se résout sur le déploiement Pages;
- la Function répond, et la page affiche sa confirmation;
- la soumission arrive dans Formspree;
- la notification arrive dans la boîte du destinataire, en réception normale —
  pas dans le dossier indésirable;
- l’objet personnalisé arrive intact;
- les cinq champs arrivent : `name`, `email`, `reason`, `message`, `phone`.

### La livraison au secrétariat, validée le 26 août 2026

Le dernier maillon — l’acheminement jusqu’à `paroissergoupil@videotron.ca` — a
été rejoué en vrai depuis le formulaire d’un déploiement Preview, une fois
l’adresse confirmée par la paroisse et le destinataire basculé dans Formspree :

- Turnstile se résout;
- `/api/contact` répond en succès;
- les gardes HTTP et le schéma Zod passent normalement;
- Formspree accepte la soumission;
- la notification arrive dans la boîte Vidéotron de la paroisse;
- **le secrétariat a confirmé la réception**, explicitement : « Message bien
  reçu. »

Le trajet est donc validé de bout en bout, sans maillon déduit.

### Formshield est désactivé, délibérément

Formspree a classé la première soumission réelle en indésirable. Son filtre
maison, **Formshield**, produisait un faux positif sur une soumission
parfaitement légitime — celle-là même que nos propres gardes venaient d’accepter.

Il a donc été désactivé. Ce n’est pas un renoncement : la soumission qui atteint
Formspree a déjà franchi le contrôle d’origine, les limites de taille, le piège à
robots, le schéma Zod et **Cloudflare Turnstile**. Ajouter par-dessus un filtre
heuristique qui refuse ce que ces gardes-là ont accepté, c’est perdre des
messages de paroissiens sans rien gagner.

Le **CAPTCHA de Formspree reste désactivé** lui aussi, pour la même raison :
Turnstile occupe déjà ce rôle, et en demander deux fois au visiteur serait le
punir d’écrire.

À relire si Formspree change ses réglages par défaut, ou si du pourriel commence
réellement à passer.

## ⚠️ Ce qui reste à faire

**Aucune modification DNS**, ni maintenant ni ensuite. C’est la contrainte qui a
dicté le choix de Formspree, et elle tient : rien à toucher sur
`paroissesaintrenegoupil.com`, qui sert encore l’ancien site.

Trois points sont **tombés le 26 août 2026** : la paroisse a confirmé son adresse
chez Formspree, le destinataire du formulaire a été basculé vers elle, et un
envoi réel est arrivé dans la boîte du secrétariat, en réception normale. Restent :

1. Saisir les trois variables dans l’environnement **Production** de Pages, comme
   elles l’ont été en Preview.
2. Supprimer les anciennes variables devenues inutiles en Production —
   `RESEND_API_KEY`, `CONTACT_RECIPIENT_EMAIL`. Le code n’en dépend plus, mais
   une variable orpheline finit par faire croire à un mécanisme qui n’existe pas.
3. Surveiller le **quota** du plan Formspree : le gratuit plafonne les
   soumissions mensuelles, et un formulaire de paroisse silencieux passerait
   longtemps inaperçu.

### Les variables se saisissent par environnement

Piège rencontré le 21 août 2026 : les variables posées en **Production** ne sont
**pas** visibles depuis un déploiement **Preview**. Cloudflare Pages tient les
deux environnements séparément. Il faut donc saisir les trois **deux fois**, une
par environnement, puis relancer le déploiement.

Rien ne le signale à l’écran : par construction, une variable absente donne une
chaîne vide et le formulaire refuse tout — porte fermée, comme voulu. Le
diagnostic se lit dans les journaux de la Function, pas dans la page.

### Le jour où le domaine sera libre

Rien d’obligatoire — le système continue de fonctionner tel quel. Si l’on
voulait alors reprendre le contrôle du `From` et de la mise en page, un seul
fichier changerait : `sendContactEmail.ts`. Il a déjà été réécrit trois fois sans
que rien d’autre bouge.

## Ce qu’on peut tester sans compte

Cloudflare publie des clés factices, documentées et volontairement publiques :

| Clé                                   | Effet                     |
| ------------------------------------- | ------------------------- |
| `1x00000000000000000000AA`            | sitekey — passe toujours  |
| `2x00000000000000000000AB`            | sitekey — bloque toujours |
| `1x0000000000000000000000000000000AA` | secret — accepte toujours |
| `2x0000000000000000000000000000000AA` | secret — refuse toujours  |

Toute la logique — gardes, validation, Turnstile, erreurs — est couverte par
`node --test`, sans réseau : la couche d’envoi et `fetch` arrivent en paramètres.

Formspree, lui, n’a pas de clés factices : son adresse de formulaire EST la
configuration. Le trajet complet devait donc se vérifier en vrai, une fois,
depuis le déploiement Pages — **c’est fait, le 21 août 2026**.

## Couverture

| Fichier                             | Tests |
| ----------------------------------- | ----- |
| `tests/contact-submission.test.mjs` | 16    |
| `tests/contact-request.test.mjs`    | 22    |
| `tests/contact-email.test.mjs`      | 13    |

Chaque garde a été vérifiée par mutation : on la retire, et le test qui prétend
la surveiller tombe. Une garde qu’aucun test ne pleure n’est pas une garde.

L’API de Formspree n’est jamais appelée pour de vrai dans la suite.

Deux tests gardent la frontière elle-même. Le premier : `formatContactEmail()` ne
doit mentionner aucun fournisseur — elle a traversé **trois transporteurs** sans
changer de rôle. Le second : `formspree.io` ne doit apparaître dans aucun fichier
du dépôt, commentaires exclus. L’adresse du formulaire désigne la boîte du
secrétariat, et n’existe que dans l’environnement du serveur.

## Vie privée

`src/data/legal.ts` est la source unique des faits que les pages légales
déclarent. `CONTACT_FORM_SENDS_MESSAGES` est passée à `true` le 20 août 2026, et
`THIRD_PARTY_SERVICES` nomme désormais **Cloudflare Turnstile** et **Formspree**.

`tests/legal-pages.test.mjs` refuse que la constante et la Function se
contredisent : annoncer un envoi que rien ne réalise, ou l’inverse, fait échouer
la suite.

Rien n’est enregistré côté site — aucune base de données. Le message vit dans la
boîte du secrétariat, comme n’importe quel courriel. Les journaux ne contiennent
jamais le contenu d’un message : seulement des codes d’erreur et des statuts
HTTP.
