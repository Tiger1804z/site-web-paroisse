# Cartographie Figma — Contact

## Statut de migration

La composition visuelle et le frontend sont terminés sur
`feature/s1-t09-contact-page-1to1`. L’envoi réel est volontairement absent :
S1-T09 est en pause à la porte de validation du système d’envoi. La page ne
sera considérée entièrement terminée qu’après validation de l’hébergement, du
destinataire, de la confidentialité, de la validation serveur et de
l’anti-spam.

## Source et routage

La route simulée `contact` est déclarée dans
`reference/figma-make-export/src/App.tsx`. Elle rend directement
`reference/figma-make-export/src/pages/Contact.tsx` lorsque l’état React
`currentPage` vaut `contact`.

La migration Astro remplace ce routeur par la vraie route statique
`/contact/`. `Contact.tsx` demeure la source de vérité pour la composition,
mais ses placeholders et son faux envoi ne constituent pas des données ou des
comportements de production.

## Mapping visuel

| Section         | Source Figma                             | Structure observée                                                                               | Contenu et interaction source                                                 | Adaptation Astro                                                            | Responsive                                                           | Décision éditoriale ou technique                                                                                                     |
| --------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Hero            | `Contact.tsx`, lignes 48–60              | Fond bourgogne, grand arc décoratif centré, contenu aligné à gauche dans un conteneur de 1280 px | Surtitre « Communication », H1 « Nous joindre », introduction                 | `ContactHero.astro`                                                         | Espacement supérieur tenant compte du header clair; H1 de 44 à 60 px | Composition conservée; le texte ne promet pas un formulaire opérationnel                                                             |
| Coordonnées     | lignes 62–102                            | Grille de quatre panneaux papier avec pictogramme, label et valeur                               | Adresse, téléphone, courriel et Facebook sont des placeholders ou un lien `#` | `ContactMethods.astro` reçoit uniquement les méthodes actives et confirmées | Cartes et note empilées, puis composition asymétrique dès 640 px     | L’adresse et le téléphone confirmés sont affichés; courriel, heures et réseaux restent masqués et sont remplacés par une note sobre  |
| Secrétariat     | lignes 104–114                           | Panneau papier bordé, H2 et deux colonnes                                                        | Heures et urgence pastorale à confirmer                                       | Intégré à `ContactMethods.astro` comme bloc facultatif                      | 1 colonne puis 2 dès 640 px                                          | Le bloc reste masqué tant que ses informations ne sont pas validées                                                                  |
| Nous trouver    | lignes 116–143                           | Colonne gauche, H2, faux panneau cartographique de 360 px et trois repères pratiques             | Carte, transport, stationnement et accessibilité sont tous des placeholders   | `ContactLocation.astro`                                                     | Colonne avant 1024 px, moitié gauche ensuite                         | L’adresse fournie par la paroisse est localisée dans une carte OpenStreetMap; stationnement et accessibilité restent à confirmer     |
| Formulaire      | lignes 145–260                           | Colonne droite, H2, formulaire vertical; courriel et téléphone sur deux colonnes dès 640 px      | Motif, nom, courriel, téléphone, message, consentement et bouton              | `ContactForm.astro` avec contrat typé et petit script de validation locale  | Champs empilés; courriel/téléphone côte à côte dès 640 px            | Aucun endpoint et aucune requête; le bouton vérifie localement les champs et annonce explicitement qu’aucun message n’a été transmis |
| Faux succès     | lignes 149–160 et 37–44                  | `setTimeout` de 1,8 s puis panneau « Message envoyé »                                            | Simulation sans backend                                                       | Supprimé                                                                    | Sans objet                                                           | Aucun état de succès ne peut exister avant le branchement réel                                                                       |
| Confidentialité | lignes 236–250                           | Checkbox et phrase affirmant une politique paroissiale                                           | Politique présentée comme existante                                           | Consentement prudent et lien vers la route technique existante              | Cible tactile et texte lisible                                       | La route répond, mais son contenu reste un placeholder juridique; la page Contact demeure `noindex`                                  |
| Mouvement       | export statique, transitions de couleurs | Hover sur panneaux et champs                                                                     | Décoratif                                                                     | `MotionController` générique sur les grands blocs                           | Désactivé en reduced motion                                          | Le formulaire et ses messages ne dépendent jamais du mouvement                                                                       |

## Champs du formulaire

Le contrat reprend les champs réellement présents dans le prototype :

1. motif de contact;
2. nom complet;
3. courriel;
4. téléphone facultatif;
5. message;
6. consentement relatif à l’utilisation des renseignements.

Un champ honeypot technique, invisible et non focalisable, prépare une future
protection anti-spam. Il ne remplace pas la validation serveur, la limitation
de fréquence ou le contrôle de l’origine.

## Coordonnées et statuts

L’adresse `4251 Rue Parc René-Goupil, Montréal, Québec H1Z 1X8`, les
coordonnées `45.57847023192667, -73.61179654539147` et le numéro
`+1 514 722-1161` ont été confirmés directement par la paroisse pendant
S1-T09. Ils sont centralisés dans `src/lib/site.ts`, puis réutilisés par la
page Contact et le footer.

Le courriel et les heures de secrétariat observés dans l’ancien contenu exigent
toujours une confirmation. Ils restent dans l’audit éditorial, pas dans le HTML
public.

Les réseaux sociaux officiels ne sont pas confirmés. Aucun lien Facebook ou
YouTube n’est inventé.

## Frontière entre contenu et envoi

Le flux livré avant la porte de validation est :

```text
src/data/contact.ts
  → getContactPageData()
  → frontmatter Astro
  → composants Astro typés
  → HTML statique
  → validation locale facultative dans le navigateur
```

Le formulaire n’a ni endpoint, ni SDK, ni secret, ni état de succès. Une future
implémentation serveur devra valider une seconde fois chaque donnée avant de
faire appel au système d’envoi choisi. Aucun fournisseur n’est actuellement
sélectionné.

## Divergences obligatoires

- les placeholders de coordonnées ne sont pas affichés;
- le lien Facebook `#` est supprimé;
- la fausse carte est remplacée, après confirmation de l’emplacement, par une
  iframe OpenStreetMap paresseuse et un lien d’itinéraire Google Maps;
- le faux délai de réponse de deux à trois jours n’est pas repris;
- le faux envoi avec `setTimeout` est supprimé;
- le bouton indique une vérification locale et non un envoi;
- la page reste `noindex` jusqu’à la confirmation des autres coordonnées, de la
  politique et du système réel d’envoi.

## Carte et confidentialité

L’adresse demeure du vrai texte HTML et le lien d’itinéraire fonctionne
indépendamment de l’iframe. La carte est chargée avec `loading="lazy"` afin de
ne pas retarder le contenu initial. Son chargement communique néanmoins
l’adresse IP du visiteur à OpenStreetMap; le lien d’itinéraire ne contacte
Google Maps qu’après une action explicite. Ces tiers devront être mentionnés
dans la politique de confidentialité approuvée.
