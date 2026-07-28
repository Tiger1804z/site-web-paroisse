# Audit de contenu — Nos annonceurs

Audit réalisé le 27 juillet 2026 pour S1-T13.

## Sources consultées

- page historique :
  `https://www.paroissesaintrenegoupil.com/merci-%C3%A0-nos-annonceurs`;
- site public de Buffet Marina :
  `https://www.buffetmarina.com/`;
- HTML et fichiers d’image servis par Google Sites, téléchargés uniquement dans
  un dossier temporaire aux fins d’inspection.

La page historique ne constitue pas une preuve qu’une entente publicitaire est
encore active. Toutes les entrées relevées portent donc le statut
`confirmation-required`. La liste doit être revue avec la secrétaire le
**10 août 2026 ou après son retour**.

## Contenu éditorial trouvé

La page historique :

- invite les commerçants et les élus à louer un espace publicitaire dans le
  feuillet paroissial;
- présente ces revenus comme un soutien à la mission;
- affirme que des espaces sont encore disponibles;
- invite à communiquer avec le secrétariat;
- remercie les annonceurs.

L’affirmation sur la disponibilité est temporelle et n’est pas reprise comme un
fait. La nouvelle page ne publie ni prix, ni format, ni durée, ni audience
garantie. Elle précise que les supports, disponibilités et modalités doivent
être confirmés directement par le secrétariat.

## Placements et coordonnées visibles

### Buffet Marina

- nom : Buffet Marina;
- catégorie déduite du texte historique : réception et service traiteur;
- adresse affichée : 4397, rue Denis-Papin;
- téléphone affiché : 514 728-4345;
- site : `https://www.buffetmarina.com/`;
- courriel affiché : `info@buffetmarina.com`;
- texte : services pour événements corporatifs, mariages, cocktails et fêtes
  d’anniversaire, cuisine, service et tables.

Le site officiel de l’entreprise confirmait encore l’adresse et le téléphone
au moment de l’audit. Cela ne confirme toutefois ni l’entente publicitaire, ni
la validité du texte fourni à la paroisse. Aucun logo Buffet Marina n’est
présent dans les trois images de contenu de la page historique.

### Frantz Benjamin

Le placement est entièrement composé d’une image :

- nom : Frantz Benjamin;
- fonction affichée : député de Viau et troisième vice-président de
  l’Assemblée nationale du Québec;
- adresse affichée : 3333, rue Jarry Est, bureau 202, Montréal, Québec
  H1Z 2E5;
- téléphone affiché : 514 728-2474;
- courriel affiché : `Frantz.Benjamin.viau@assnat.qc.ca`.

Le mandat, la fonction, l’entente, les coordonnées et le droit d’utiliser le
portrait doivent tous être reconfirmés.

### Josué Corvil

Le placement est entièrement composé d’une image :

- nom : Josué Corvil;
- fonction affichée : conseiller de la Ville, district de Saint-Michel;
- adresse affichée : 405, avenue Ogilvy, Montréal, Québec H3N 1M3;
- téléphone affiché : 514 872-7800;
- courriel affiché : `josue.corvil@montreal.ca`.

Le mandat, l’entente, les coordonnées et le droit d’utiliser le portrait
doivent tous être reconfirmés.

### Patricia Lattanzio

Le placement est entièrement composé d’une image :

- nom : Patricia Lattanzio;
- fonction affichée : députée de Saint-Léonard–Saint-Michel;
- localisation affichée : bureau de circonscription de Saint-Léonard, Québec
  H1R 3Y6, sans rue;
- téléphone affiché : 514 256-4548;
- télécopieur affiché : 514 256-8828;
- courriel affiché : `Patricia.Lattanzio@parl.gc.ca`.

Le mandat, l’entente, l’adresse complète, les coordonnées et le droit
d’utiliser le portrait doivent tous être reconfirmés.

## Inventaire des images historiques

| Rôle historique              | Format réel |    Dimensions |          Poids | Contenu                                                                                      | Métadonnées                                              | Droits et décision                                              |
| ---------------------------- | ----------- | ------------: | -------------: | -------------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| Bandeau « Publicité »        | JPEG RGB    | 1250 × 350 px |  23 737 octets | Rectangles colorés et mot « PUBLICITÉ »; aucun portrait, aucun filigrane visible             | Commentaire « Compressed by jpeg-recompress »            | Provenance graphique non documentée; non récupéré en production |
| Placement Frantz Benjamin    | JPEG RGB    | 1050 × 736 px | 141 799 octets | Portrait reconnaissable, coordonnées, fonction et identité visuelle de l’Assemblée nationale | Logiciel Picasa; champ artiste numérique non attribuable | Portrait et composition aux droits non documentés; non récupéré |
| Placement Josué Corvil       | PNG RGB     |  570 × 320 px | 119 782 octets | Portrait reconnaissable, coordonnées, fonction et signature visuelle de Montréal             | Aucun auteur ou crédit exploitable                       | Portrait et composition aux droits non documentés; non récupéré |
| Placement Patricia Lattanzio | JPEG RGB    |  816 × 458 px |  56 531 octets | Portrait reconnaissable, coordonnées, fonction, bordure rouge                                | Aucun auteur ou crédit exploitable                       | Portrait et composition aux droits non documentés; non récupéré |

Aucune image n’affiche de filigrane visible, mais les logos institutionnels ne
sont pas des autorisations de réutilisation. Les trois portraits sont des
images de personnes reconnaissables et aucun consentement ou droit de
publication n’est documenté dans le dépôt.

Les téléchargements d’inspection ont été supprimés après l’audit. Le code final
ne contient aucun hotlink `lh3.googleusercontent.com`, aucune copie de ces
portraits et aucun chemin local absolu.

## Décision de publication

La route `/nos-annonceurs/` est complète mais reste `noindex`. Le getter public
ne rend que les entrées `active`; les quatre entrées historiques
`confirmation-required` demeurent dans la source locale pour faciliter la
révision sans être affichées publiquement.

Conditions pour retirer `noindex` :

1. confirmer la liste et les ententes actives avec la secrétaire;
2. confirmer chaque coordonnée et chaque texte commercial;
3. obtenir les logos ou visuels officiels dans une qualité suffisante;
4. documenter les droits de publication et, pour les portraits, le
   consentement;
5. confirmer le support publicitaire, les modalités et le texte de
   sollicitation;
6. valider la mention de transparence et les liens commandités.

Si aucun annonceur n’est actif, la page conserve son rôle informatif et son
bloc « Devenir annonceur » sans afficher une grille vide.

## Routes et liens

- route canonique : `/nos-annonceurs/`;
- alias local : `/merci-a-nos-annonceurs/`, `noindex`, canonical et redirection
  HTML statique;
- URL historique encodée : une redirection au niveau du domaine ou de
  l’hébergement sera nécessaire lors du déploiement;
- liens commerciaux futurs : `target="_blank"` et
  `rel="sponsored noopener noreferrer"`;
- CTA du secrétariat : téléphone global `siteSettings` et `/contact/`.

Le formulaire Contact ne transmet toujours aucune donnée. La page n’invite
donc pas à soumettre ou réserver un espace en ligne.
