# Audit de contenu — Nos services

## Sources inspectées

Audit réalisé le 27 juillet 2026 à partir de :

- la page publique
  `https://www.paroissesaintrenegoupil.com/nos-services`;
- la page publique
  `https://www.paroissesaintrenegoupil.com/location-de-salle`;
- `docs/LEGACY_SITE_CONTENT_AUDIT.md`;
- `docs/CONTENT_INVENTORY.md`;
- le questionnaire de la paroisse;
- l’ancienne implémentation locale de `/sacrements/`.

Le contenu a été réécrit pour être lisible et prudent. Il n’est pas copié
textuellement du site existant.

## Hero éditorial

Le hero alterne toutes les 7,6 secondes entre trois photographies externes :
baptême, mariage et première communion. Le fondu de 1,25 seconde, le très léger
zoom et le traitement colorimétrique reprennent le rythme du hero d’accueil.
Une lentille organique révèle toujours la photographie suivante sous le
pointeur, uniquement avec hover précis et sans préférence de mouvement réduit.

Le voile charbon-bourgogne est renforcé derrière le texte pour compenser la
fenêtre très claire de la photographie de mariage. Les textes restent en HTML,
au-dessus du masque, et les images sont explicitement décrites comme
illustratives, jamais comme des célébrations de Saint-René-Goupil.

Sans JavaScript ou avec `prefers-reduced-motion: reduce`, la première image de
baptême reste visible, le contenu demeure complet et la lentille disparaît.

## Contenu retenu

La page canonique `/nos-services/` regroupe :

- mariage;
- baptême;
- première communion;
- confirmation;
- catéchuménat;
- funérailles;
- demandes de certificats;
- messes annoncées;
- lampions;
- lampe du sanctuaire;
- messes commémoratives et anniversaires;
- célébrations spéciales;
- modes de paiement;
- location de salle.

## Informations 2026

Les valeurs suivantes étaient publiées lors de l’audit et sont isolées dans
`src/data/services.ts` :

- mariage : délai minimal de six mois et tarif de 400 $, sans chantre ni
  musicien;
- baptême : deuxième dimanche à 14 h, rencontre le mardi précédent à 18 h,
  aucune somme fixe et offrande suggérée;
- catéchèse : inscriptions les 12 et 19 août 2026, période de septembre 2026 à
  mai 2027, frais de 80 $;
- funérailles : 350 $, chantre et musicien en supplément;
- certificat : 20 $ plus 2 $ de poste si applicable;
- messe annoncée : 15 $;
- lampion et lampe du sanctuaire : 5 $ chacun;
- messe commémorative ou anniversaire : 150 $, sans musicien ni chantre;
- inscriptions aux célébrations spéciales : 20 $ pour cinq noms, puis 5 $ par
  nom additionnel;
- paiements publiés : argent comptant, chèque et virement Interac.

Chaque détail volatile porte `lastReviewedAt: '2026-07-27'`,
`effectiveYear: 2026` et `requiresPeriodicReview: true`. La page précise
publiquement que le secrétariat doit confirmer les montants, les documents et
les dates avant toute démarche.

## Location de salle

Le questionnaire confirme seulement un processus humain :

- disponibilité et tarif communiqués par le secrétariat;
- confirmation directement avec la paroisse;
- contrat remis et signé le jour de la réservation;
- aucune disponibilité automatique en ligne.

Les anciennes capacités, dimensions, installations, heures limites, règles
d’alcool, dépôts et valeurs tarifaires ne sont pas publiés, car ils n’ont pas
été reconfirmés. Le CTA utilise exclusivement le numéro confirmé
`514 722-1161` via `tel:+15147221161`.

## Routes et compatibilité

- canonique : `/nos-services/`;
- `/sacrements/` : alias statique `noindex` avec canonical vers
  `/nos-services/` et redirection HTML immédiate;
- `/location-de-salle/` : alias statique `noindex` avec canonical vers
  `/nos-services/` et redirection vers l’ancre `#location-de-salle`.

Le build est statique et ne peut pas garantir seul une réponse HTTP 301. Les
redirections HTML empêchent le contenu dupliqué et gardent un lien accessible
si la redirection automatique est désactivée. L’hébergement pourra ajouter de
vraies redirections HTTP plus tard.

## Frontière de données

```text
src/data/services.ts
        ↓
getServicesPageData()
        ↓
ServicesPageData
        ↓
composants Astro
```

Le futur CMS administrera les textes, catégories, détails, tarifs, périodes,
ordre, activation, images, crédits et CTA. Il n’administrera pas le CSS, les
formes arbitraires, le JavaScript, les redirections ni les secrets.

## Limites

- aucun formulaire Contact n’est présenté comme opérationnel;
- aucune réservation de salle, disponibilité automatique ou paiement en ligne;
- aucune page de détail dynamique;
- aucun tarif inventé;
- les campagnes, personnes responsables et documents précis restent à
  reconfirmer lorsque la source publique n’est pas suffisante.
