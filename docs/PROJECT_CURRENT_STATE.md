# État courant du projet

Ce document constitue le point de reprise technique du dépôt. Il complète le
README, les documents d’architecture et les audits de routes sans dupliquer
leurs détails.

Dernière mise à jour : 26 juillet 2026.

## S1-T09 — Contact

### Statut

Frontend et migration visuelle terminés. Envoi réel en attente de validation.

La branche de travail est :

```text
feature/s1-t09-contact-page-1to1
```

La route préparée est :

```text
/contact/
```

### Fichiers principaux

- `src/pages/contact.astro`;
- `src/types/contact.ts`;
- `src/data/contact.ts`;
- `src/lib/content/getContactPageData.ts`;
- `src/components/sections/contact/`;
- `docs/FIGMA_CONTACT_MAPPING.md`;
- `docs/CONTACT_FORM_SECURITY_PREPARATION.md`.

### Fonctionnalités terminées

- composition migrée depuis `Contact.tsx`;
- coordonnées confirmées et centralisées;
- carte OpenStreetMap chargée paresseusement;
- lien d’itinéraire Google Maps;
- formulaire frontend typé;
- validation locale et messages d’erreur accessibles;
- consentement temporaire;
- honeypot préparatoire;
- responsive et reduced motion;
- page maintenue temporairement en `noindex`;
- préparation du futur document Sanity `contactPage`.

Le formulaire vérifie uniquement les données dans le navigateur. Il n’envoie
aucun message, ne déclenche aucune requête réseau et ne présente aucun faux
succès.

### Coordonnées confirmées

- adresse : 4251 Rue Parc René-Goupil, Montréal, Québec H1Z 1X8;
- coordonnées géographiques : 45.57847023192667, -73.61179654539147;
- téléphone : 514 722-1161.

### Informations manquantes

- courriel public officiel;
- heures du secrétariat;
- détails de stationnement;
- détails d’accessibilité;
- texte définitif de confidentialité;
- adresse qui recevra les formulaires;
- domaine ou adresse d’expédition;
- fournisseur de courriel actuel;
- plateforme d’hébergement confirmée.

### Fonctionnalités volontairement absentes

- endpoint;
- SMTP;
- API transactionnelle de courriel;
- fonction serverless;
- adapter serveur;
- secrets ou variables d’environnement réelles;
- envoi réel;
- accusé de réception;
- CAPTCHA;
- limitation de fréquence serveur;
- journaux d’envoi.

### Porte de validation

Le projet demeure en génération statique avec `output: 'static'`. Aucun
hébergeur, adapter, fournisseur ou système d’envoi n’est sélectionné.

L’option actuellement recommandée pour évaluation est une fonction serverless
appelant une API transactionnelle. Cette recommandation ne constitue pas un
choix de fournisseur. Aucune implémentation ne doit commencer sans validation
explicite après confirmation :

- de l’hébergeur;
- de l’adresse destinataire;
- de l’adresse ou du domaine expéditeur;
- du fournisseur de courriel;
- de la politique de confidentialité;
- du besoin d’un accusé de réception;
- de la stratégie anti-spam.

Les responsabilités futures du serveur comprennent la validation complète des
données, le rejet du honeypot, la limitation de fréquence, le contrôle de
l’origine et de la taille des requêtes, l’appel au système d’envoi, la gestion
des erreurs et des journaux minimaux sans contenu personnel.

### Instruction de reprise

« Reprendre S1-T09 à la porte de validation SMTP sur
feature/s1-t09-contact-page-1to1. »

Ne modifier l’architecture d’envoi qu’après validation explicite.
