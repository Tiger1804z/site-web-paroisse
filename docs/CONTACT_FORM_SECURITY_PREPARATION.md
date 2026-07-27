# Préparation du formulaire Contact

## État avant la porte d’envoi

Le projet est généré avec `output: 'static'`. Aucun adapter Astro, endpoint,
service serverless, fournisseur de courriel, fichier `.env`, SDK d’envoi ou
hébergeur n’est configuré dans le dépôt.

S1-T09 est volontairement mis en pause dans cet état. Le point de reprise
canonique est consigné dans
[`PROJECT_CURRENT_STATE.md`](./PROJECT_CURRENT_STATE.md). Aucun choix
d’hébergeur ou de fournisseur ne doit être déduit de la recommandation
technique ci-dessous.

La page Contact fournit uniquement :

- le HTML sémantique du formulaire;
- les attributs natifs `required`, `type`, `minlength`, `maxlength`,
  `autocomplete` et `pattern`;
- un petit script de validation locale;
- les associations `label`, `aria-describedby` et `aria-invalid`;
- un résumé d’erreurs et le focus sur le premier champ invalide;
- un honeypot préparatoire;
- un état explicite indiquant qu’aucun message n’est transmis.

Le bouton est de type `button`, pas `submit`. Sans JavaScript, aucune
soumission implicite n’est déclenchée. Avec JavaScript, il vérifie uniquement
les champs et ne fait aucun `fetch`, POST ou appel externe.

## La validation frontend n’est pas une sécurité

Les attributs HTML et le script améliorent l’expérience, mais peuvent être
contournés. Une future fonction serveur devra de nouveau :

- autoriser uniquement les champs attendus;
- vérifier les types et longueurs;
- normaliser les espaces et les valeurs;
- refuser le honeypot rempli;
- limiter la fréquence par origine raisonnable;
- vérifier l’origine de la requête;
- limiter la taille totale du corps;
- échapper le contenu dans les modèles de courriel;
- produire des erreurs génériques sans exposer de secret.

## Stratégie anti-spam proposée

Première ligne de défense, adaptée à un faible volume :

1. honeypot;
2. validation serveur stricte;
3. limite de taille;
4. limitation de fréquence;
5. contrôle de l’origine et de la méthode;
6. journaux minimaux sans corps de message.

Un CAPTCHA ne devrait être ajouté que si le spam observé justifie le coût
d’accessibilité, de confidentialité et de dépendance à un tiers.

## Vie privée

La route `/politique-de-confidentialite/` répond, mais son contenu est encore
un placeholder. Avant la production, un texte approuvé doit préciser au
minimum :

- les renseignements collectés;
- la finalité de réponse;
- la personne ou l’entité responsable;
- la durée de conservation;
- les services tiers impliqués;
- les moyens d’exercer les droits applicables.

Les journaux techniques ne doivent pas contenir le nom, le courriel, le
téléphone ou le message complet. Aucun accusé automatique ne doit être activé
sans texte approuvé.

La carte OpenStreetMap est un contenu tiers chargé paresseusement sous le
premier écran. Son chargement peut communiquer l’adresse IP du visiteur au
service cartographique. Le lien d’itinéraire Google Maps ne contacte Google
qu’après activation par le visiteur. La politique finale devra identifier ces
services ou une solution de consentement devra être retenue avant production.

## Options laissées ouvertes

### Fonction serverless et API transactionnelle

Une fonction reçoit et valide le formulaire, puis appelle une API de courriel
avec une clé disponible uniquement côté serveur. Cette approche sépare bien le
site statique de l’envoi et offre généralement une bonne délivrabilité.

### Fonction serverless et SMTP

Une fonction se connecte au serveur SMTP autorisé de la paroisse. Cette option
nécessite les identifiants SMTP côté serveur et dépend des contraintes de
connexion de la plateforme serverless.

### Service externe de formulaire

Le navigateur envoie le formulaire à un fournisseur spécialisé. La mise en
place est plus courte, mais les renseignements personnels quittent directement
le site vers un tiers et le contrôle sur la validation, les journaux et
l’expérience est plus limité.

Aucune option ni aucun fournisseur n’est sélectionné dans S1-T09 avant la
validation explicite de l’utilisateur.

La préférence actuelle à évaluer est une fonction serverless et une API
transactionnelle, car les appels HTTPS sont généralement mieux adaptés à une
exécution serverless que les connexions SMTP longues. Cette préférence reste
conditionnelle à la plateforme d’hébergement, au domaine expéditeur et aux
besoins de la paroisse.

## Variables conceptuelles seulement

Communes :

- `CONTACT_RECIPIENT_EMAIL`;
- `CONTACT_FROM_EMAIL`;
- `CONTACT_REPLY_TO_EMAIL`.

API :

- `EMAIL_API_KEY`.

SMTP :

- `SMTP_HOST`;
- `SMTP_PORT`;
- `SMTP_USER`;
- `SMTP_PASSWORD`;
- `SMTP_SECURE`.

Aucun de ces noms n’est ajouté à un fichier d’environnement et aucune valeur
n’est créée dans cette phase.

## Données et Sanity

Sanity pourra administrer les libellés, sujets, textes, coordonnées confirmées
et activation des blocs. Il ne contiendra jamais les secrets, l’adresse
destinataire privée, la logique de validation serveur, la limitation de
fréquence ou le code d’envoi.

## Reprise obligatoire

Instruction de reprise :

« Reprendre S1-T09 à la porte de validation du système d’envoi, depuis l’état
frontend intégré par S1-T12. »

Avant toute implémentation, confirmer l’hébergeur, l’adresse destinataire,
l’adresse ou le domaine expéditeur, le fournisseur actuel, la politique de
confidentialité, le besoin d’un accusé de réception et la stratégie anti-spam.
