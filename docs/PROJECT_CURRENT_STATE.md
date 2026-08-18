# État actuel du projet

Dernière mise à jour : 18 août 2026 — préparation de la promotion de la
migration Sanity vers la production.

La migration comprend la prévisualisation éditoriale (Visual Editing) et les
contenus de Nos services, Vie paroissiale, Première visite, Nos annonceurs,
Contact, l’accueil entier et Notre paroisse. L’historique Git demeure la source
de vérité pour son état de promotion entre les branches.

## Pages principales

- `/` : accueil enrichi, hero interactif, vitrail vivant, événements, scène
  « Vivre la paroisse », services, interlude spirituel, carrousel Galerie et
  coordonnées confirmées. **Toutes ses sections sont lues depuis le document
  Sanity `homePage`**, photographies du carrousel comprises; seules les images
  éditoriales restent locales;
- `/notre-paroisse/` : page complète avec chronologie immersive et hero
  cinématographique statique, sans lentille. Récit, neuf repères, architecture
  et architectes lus depuis le document Sanity `aboutPage`. **Les neuf
  illustrations de la chronologie sont téléversées** — elles ne se séparent pas
  de leur repère — tandis que le hero et le cadre d’architecture restent des
  fichiers du dépôt. Huit des neuf images sont générées par IA et la page le
  déclare, image par image;
- `/horaires/` : structure complète avec données non confirmées;
- `/vie-paroissiale/` : page complète, hero illustré rotatif avec lentille;
  présentation, groupes **et images** lus depuis le document Sanity
  `parishLifePage`. Les 3 illustrations d’en-tête (domaine public, dont 2
  générées par IA et déclarées comme telles) et les 4 photographies de l’église
  sont téléversées avec texte alternatif, crédit et note de droits. Seule la
  destination des boutons reste dérivée du code. Contenu des groupes encore à
  confirmer auprès de la paroisse;
- `/nos-services/` : page canonique complète, hero rotatif avec lentille;
  chapitres, services, renseignements et modes de paiement lus depuis le
  document Sanity `servicesPage`, images et bouton d’appel toujours dérivés du
  code;
- `/premiere-visite/` : guide, déroulement de la célébration, informations
  pratiques et foire aux questions lus depuis le document Sanity
  `firstVisitPage`, repère visuel téléversé. Les lignes d’informations pratiques
  ne recopient plus les coordonnées : elles désignent leur source dans
  `siteSettings`, ce qui a fait apparaître l’adresse et le téléphone réels à la
  place des mentions entre crochets. Une ligne dont la valeur n’est pas
  confirmée n’est pas affichée;
- `/evenements/` : activités datées lues depuis la collection Sanity
  `parishEvent`, images téléversables avec point focal;
- `/friperie/` : page complète et indexable, informations pratiques réelles,
  visuels thématiques sous licence Pixabay;
- `/contact/` : frontend complet `noindex`, validation locale seulement; textes
  et motifs du formulaire lus depuis le document Sanity `contactPage`. Les
  heures du secrétariat, le stationnement et l’accessibilité s’y affichent
  désormais, lus dans `siteSettings`;
- `/nos-annonceurs/` : page complète et indexable, incluse dans le sitemap; les
  quatre fiches historiques sont publiées et lues depuis la collection Sanity
  `advertiser`, le contenu de page depuis `advertisersPage`. Aucun portrait
  n’est repris, et le champ image de chaque fiche reste vide tant qu’un logo
  n’est pas téléversé;
- `/galerie/` : placeholder `noindex`, volontairement absent de la navigation.

## Contact et coordonnées publiques

Le frontend du commit S1-T09 `43c5469` a été réintégré sélectivement sans
ancien header, footer ou mémoire de branche. La vraie route `/contact/`
remplace le placeholder dynamique.

Les données confirmées sont :

- Paroisse Saint-René-Goupil;
- 4251 Rue Parc René-Goupil, Montréal, Québec H1Z 1X8;
- 514 722-1161;
- coordonnées de carte et lien d’itinéraire.

`src/data/siteSettings.ts` est la source unique. Le normalisateur
`getSiteSettings()` masque le courriel tant que `confirmed` est faux. Les
consommateurs actuels sont Contact, la fin de l’accueil, le footer, Nos services
et Première visite.

**Migration Sanity du 31 juillet 2026.** Le document `contactPage` porte les
textes de la page et les motifs du formulaire. Il ne porte **aucune
coordonnée** : elles viennent toutes de `siteSettings`.

Cela a réparé un défaut de la même classe qu’à Première visite — des faits
confirmés dans `siteSettings` que la page ne lisait pas. Les **heures du
secrétariat** n’étaient jamais affichées alors que la page annonçait qu’elles
étaient « en cours de validation »; le **stationnement** et l’**accessibilité**
étaient absents des notes d’accès que la description disait « à confirmer ».
Les trois s’affichent maintenant. Le bloc des heures disparaît de lui-même si
l’horaire est effacé, et la carte du courriel apparaîtra seule le jour où il
sera confirmé et rendu public.

La **structure du formulaire** reste dans le code : noms de champs, types,
longueurs, expressions de validation et messages d’erreur. Le script de
validation les lit, et une expression mal saisie dans le Studio casserait la
page en silence. Seule la liste des motifs se saisit, parce qu’elle suit les
services offerts.

Le formulaire Contact demeure une préparation frontend :

- champs, honeypot, validation locale et erreurs accessibles;
- submit bloqué avec `preventDefault()`;
- aucun `fetch`, endpoint, faux succès ou stockage;
- aucun secret, fournisseur SMTP/API ou fonction serverless.

S1-T09 devra donc encore être repris à la porte de validation du système
d’envoi avant livraison.

## Mini-galerie de l’accueil

Une page Galerie autonome n’est pas utile pour l’instant. La route technique
reste réservée comme placeholder `noindex`, mais sa définition est inactive
dans la navigation canonique.

Depuis le 31 juillet 2026, les photographies du carrousel sont **téléversées
dans le Studio** : elles vivent dans `homePage.gallery.photos`, servies par le
CDN de Sanity. L’ordre de la liste est celui du carrousel, et être dans la
liste, c’est être visible — ni champ d’ordre, ni case « afficher ». Le plafond
de douze est une garde technique, pas un réglage éditorial. Sans photographie
publiable, la section disparaît de la page : il n’y a pas de repli local.

L’image centrale est mise en valeur par un cadre éditorial; son
titre, sa description et son compteur sont synchronisés. La lightbox utilise
`<dialog>` avec fermeture `Escape`, flèches clavier et restauration du focus.
Sans JavaScript, les images restent visibles en bande horizontale et chaque
carte demeure un lien direct.

Les images IA, externes, temporaires ou sans consentement ne sont pas mélangées
à la collection documentaire.

## Compatibilité

- `/sacrements/` redirige statiquement vers `/nos-services/`;
- `/location-de-salle/` redirige statiquement vers
  `/nos-services/#location-de-salle`;
- `/feuillets-paroissiaux/` n’existe plus : décision du 29 juillet 2026 de ne
  pas publier de page Web de feuillets PDF. Route, entrée de navigation,
  composant d’accueil et CTA supprimés.

## Navigation et header

La source canonique est `src/lib/navigation.ts`. Contact est actif dans le menu
Informations desktop/mobile et le footer. Galerie et Location de salle y restent
inactifs; Location de salle demeure intégrée à Nos services.

Le header reste translucide au sommet et après défilement, avec fallback
lisible lorsque `backdrop-filter` n’est pas pris en charge.

## Nos annonceurs

La nouvelle route `/nos-annonceurs/` est active dans la source canonique de
navigation. L’ancienne route locale `/merci-a-nos-annonceurs/` est un alias
`noindex` avec canonical et redirection HTML.

**Contenu migré vers Sanity le 31 juillet 2026** : la collection `advertiser` et
le document `advertisersPage`. La révision du 10 août se fait donc dans le
Studio, fiche par fiche, sans changement de code.

L’audit historique a relevé Buffet Marina ainsi que trois placements composés
des portraits et coordonnées de Frantz Benjamin, Josué Corvil et Patricia
Lattanzio.

**Les quatre fiches sont publiées, en statut `active`, depuis le 31 juillet 2026.** Décision de l’administratrice du site : ces placements figurent encore
sur l’ancien site de la paroisse, donc les reprendre est la continuité de ce qui
est déjà en ligne, pas une divulgation nouvelle. Ce n’est pas au site de décider
à la place de la paroisse; la secrétaire retire une fiche en la passant à
« Inactif ». Chaque fiche garde sa note de révision interne, invisible du
public.

Les images Google Sites n’ont pas été importées, car les droits et les
consentements ne sont pas documentés : **aucun portrait n’est publié**, seules
les coordonnées déjà affichées le sont. Sans image, une fiche affiche les
initiales du nom; le champ image reste vide par défaut et se remplit dans le
Studio.

Trois textes ont été réécrits en même temps, parce qu’ils devenaient faux une
fois les fiches publiées : la description de Buffet Marina (qui contenait sa
propre condition de révision), le titre « Les annonceurs confirmés », et le
paragraphe affirmant qu’une présence n’apparaît qu’après confirmation. Ce
dernier annonce désormais la marche à suivre pour corriger ou retirer une fiche.

La page affiche l’introduction et le bloc « Devenir annonceur » même sans
annonceur actif : la case « Afficher la liste » autorise la section, elle ne la
remplit pas, et une grille vide ne s’affiche jamais. Le téléphone du secrétariat
vient de `siteSettings`; aucun tarif, espace disponible ou formulaire
publicitaire n’est inventé. La page est volontairement indexable et incluse
dans le sitemap. La publication des quatre fiches actives et de leurs
coordonnées actuelles est approuvée pour la mise en production.

## Contenus en attente

- choix, sécurité et activation du système d’envoi Contact;
- courriel public, toujours absent : aucune carte ne s’affiche tant qu’il n’est
  pas confirmé;
- heures du secrétariat saisies le 31 juillet 2026 et **affichées** sur Contact,
  Horaires et Première visite, mais relevées sur l’ancien site et **non
  vérifiées auprès du secrétariat**;
- existence du feuillet papier et du programme publicitaire, à confirmer le
  11 août 2026;
- horaires, procédures pastorales et données temporelles à réviser;
- décision future sur l’utilité d’une page Galerie complète et enrichissement
  des crédits photographiques;
- ajout éventuel de logos d’annonceurs lorsque leurs droits seront documentés;
- photographies réelles du local de la friperie et conditions de dons;
- **nom de la photographe** à inscrire dans le crédit des quatre photographies
  de l’église publiées sur la Vie paroissiale, et de celle de Première visite.
  Leur note de droits, saisie dans le Studio, le réclame explicitement;
- **accessibilité intérieure** — la paroisse a confirmé le 31 juillet 2026 une
  rampe d’accès donnant sur la rue Parc René-Goupil. Ce qui se passe **une fois
  la rampe franchie** (dénivelé, toilettes, place réservée) n’est pas vérifié :
  le site nomme donc la rampe et renvoie au secrétariat, sans jamais écrire que
  le bâtiment est accessible. À compléter après visite des lieux;
- **heures du secrétariat** — saisies dans Sanity le 31 juillet 2026, mais
  **relevées sur l’ancien site de la paroisse**, pas vérifiées auprès du
  secrétariat. Elles ne sont plus seulement dans le repli local, donc le Studio
  ne montre plus un champ vide qu’une saisie écraserait; leur exactitude reste à
  confirmer.

## Migration Sanity

Quatorze documents sont administrés depuis le Studio : `siteSettings`,
`massSchedule`, `parishEvent`, `advertiser`, `homePage`, `aboutPage`,
`schedulePage`, `eventsPage`, `thriftStore` et `thriftStorePage`,
`servicesPage`, `parishLifePage`, `firstVisitPage`, `advertisersPage`,
`contactPage`.

**Plus aucune page ne lit son contenu depuis un fichier du dépôt.** Chaque page
migrée conserve en plus son repli local : si Sanity ne répond pas, le site se
construit avec le dernier contenu connu du dépôt. Trois exceptions assumées,
sans repli : les événements, les photographies du carrousel et les illustrations
de la chronologie historique. Un événement inventé n’aurait aucun sens, et une
image n’existe que là où la paroisse l’a déposée.

Les images sont téléversées pour les Événements, la Vie paroissiale et Première
visite. Les autres pages gardent leurs visuels dans `src/assets/`.

`siteSettings` a gagné deux lecteurs au passage : `parkingInformation` et
`accessibilityInformation` existaient dans le schéma depuis S1-T14 sans jamais
être projetés par la requête. Première visite est la première page à les lire —
même défaut que `officeHours` à l’époque, et même correctif.

## Architecture

Astro demeure statique et TypeScript strict. Les mouvements passent par CSS et
des contrôleurs JavaScript natifs.

Sanity est installé et sert de source de contenu : requête GROQ, normalisation,
contrat typé, HTML statique. Le détail est dans
[`ARCHITECTURE.md`](./ARCHITECTURE.md), section « Pipeline de contenu Sanity ».
Les images locales passent par `astro:assets`, celles du Studio par le CDN de
Sanity avec point focal.

L’envoi du formulaire Contact, la réservation et les paiements ne sont toujours
pas installés. Le site n’est déployé nulle part : aucun adaptateur, aucun
domaine, et la CI valide sans déployer.
