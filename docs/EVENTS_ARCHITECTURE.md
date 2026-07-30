# Architecture des événements datés

## Deux contenus différents

La page Événements contient deux familles de contenu qui ne partagent pas le
même contrat.

Les **catégories éditoriales permanentes** décrivent les formes de vie
paroissiale : culture, célébrations, entraide, rencontres et générations.
Elles n’ont pas besoin d’une date et restent utiles même si aucun rendez-vous
précis n’est programmé. Elles utilisent `EventCategory` dans
`src/types/events.ts`.

Les **événements datés** décrivent une occurrence : un pèlerinage, un concert
précis ou une célébration particulière. Ils utilisent `ParishEvent` dans
`src/types/parish-events.ts`. Une même occurrence alimente la page Événements,
l’accueil et, après sa fin, les archives. « Activité » est donc seulement le
libellé éditorial de la section d’accueil; ce n’est pas une seconde source.

## Flux unique

Depuis le 29 juillet 2026, la source est la collection Sanity `parishEvent`.
Il n’y a **aucun repli local** : un événement inventé n’aurait pas de sens, donc
une lecture vide affiche des sections vides. `src/data/parish-events.ts` ne
contient plus que des réglages, eux-mêmes lus depuis `eventsPage` et `homePage`
quand ces documents sont remplis.

```text
Sanity — collection parishEvent
  → PARISH_EVENTS_QUERY
  → normalizeSanityParishEvents (+ adresses d’images du CDN)
  → getParishEvents.ts
  → visibilité + statut temporel + tri
  ├─→ /evenements/ — Événements à venir
  ├─→ / — Prochaines activités, maximum quatre
  └─→ /evenements/ — Retour sur nos événements
```

Les images des événements sont servies par le CDN de Sanity et rendues par
`RemoteImage.astro`. Le point focal choisi dans le Studio devient un
`object-position`, parce que la plupart des cadres s’étirent à la hauteur de
leur colonne et n’ont pas de format connu à l’avance. Les images locales du
site continuent de passer par `astro:assets`; les deux systèmes coexistent
pendant la migration.

Les pages et les composants n’importent jamais le tableau brut. Le frontmatter
Astro appelle la couche de contenu pendant le build, puis transmet des props
déjà filtrées et triées. Le navigateur reçoit des `<article>`, des `<time>`,
des liens et des images statiques; il ne recalcule pas les dates.

## Contrat `ParishEvent`

Le contrat contient l’identité (`id`, `slug`), les textes, la catégorie, les
dates ISO explicites, le fuseau, les informations pratiques facultatives, les
images, le statut de publication et les drapeaux d’affichage.

`showOnWebsite` contrôle la visibilité publique générale.
`showOnHomepage` autorise une apparition sur l’accueil.
`showInArchive` autorise une conservation après la fin.
`featured` et `homepagePriority` servent uniquement à choisir la grande carte.

Les champs restent facultatifs lorsqu’une information ne s’applique pas. Le
rendu n’ajoute aucune ligne vide. Les cartes annulées peuvent rester publiques
si `showOnWebsite` est actif, mais elles portent « Annulé » et leur CTA
d’inscription est supprimé. Les brouillons ne sont jamais publics.

## Statut temporel

`getParishEventTemporalStatus(event, now)` dérive :

- `upcoming` si le début est postérieur à `now`;
- `ongoing` si le début est atteint et que la fin ne l’est pas;
- `past` si la fin est dépassée;
- `past` si le début est dépassé et qu’aucune fin n’existe.

Le statut n’est ni écrit dans la source locale ni destiné à Sanity. Passer
`now` explicitement rend la fonction pure et les tests indépendants de
l’horloge de la machine.

Toutes les valeurs locales utilisent un offset ISO explicite et le fuseau de
référence `America/Toronto`. Les helpers `Intl.DateTimeFormat` emploient
`fr-CA` et ce même fuseau; ils ne dépendent donc pas du fuseau du développeur.

## Visibilité et tri

- À venir : événements publics `ongoing`, puis `upcoming` du plus proche au
  plus éloigné.
- Archives : événements publics `past` avec `showInArchive`, du plus récent au
  plus ancien.
- Accueil : événements `published`, publics, autorisés sur l’accueil et non
  terminés.

La sélection de l’accueil comprend une grande carte et jusqu’à trois cartes
secondaires. Elle privilégie un `featured` en cours, puis un `featured` futur,
puis la date la plus proche; `homepagePriority` départage les égalités. Sans
featured, le premier événement chronologique devient la grande carte. Son
`id` est retiré des secondaires, ce qui empêche tout doublon.

Avec zéro événement, la section entière disparaît. Avec un seul événement, la
grande carte occupe la largeur disponible. Deux, trois et quatre événements
produisent respectivement une, deux et trois cartes secondaires. Aucun bloc
vide n’est réservé.

## Données locales du 26 juillet 2026

Le pèlerinage à Sainte-Anne-de-Beaupré, terminé le 25 juillet, apparaît dans
les archives et jamais sur l’accueil. Sa couverture et ses deux vues
complémentaires documentent la basilique. Elles ne prouvent toutefois ni la
présence du groupe paroissial ni le déroulement précis du pèlerinage.

Le pèlerinage au Sanctuaire Notre-Dame-du-Cap du 15 août est futur, publié,
mis en vedette et autorisé sur l’accueil. La grande carte mène à son ancre
`/evenements/#pelerinage-notre-dame-du-cap-2026`; le CTA séparé appelle
`tel:+15149960449`. Sa couverture aérienne et sa vue de façade correspondent
au sanctuaire; leurs droits de publication restent à confirmer.

## Tests

`tests/parish-events.test.mjs` couvre 21 cas : les trois statuts temporels, les
tris, les exclusions, les drapeaux d’affichage, le choix de la vedette,
l’absence de doublon, la limite de quatre, les états zéro/un événement, le
fuseau et les deux pèlerinages. Node exécute directement le helper TypeScript
avec son support natif de suppression des types; aucune dépendance de test
n’est ajoutée.

## Site statique et passage du temps

Astro calcule ces vues au build. Le HTML déjà déployé ne change pas lorsque
l’horloge franchit la fin d’un événement. Après l’installation de Sanity, deux
déclencheurs seront nécessaires :

1. un webhook après chaque publication;
2. un rebuild quotidien après minuit, avec `America/Toronto` comme référence.

Le rebuild retirera un événement terminé de l’accueil et de la section à venir,
puis l’ajoutera aux archives si `showInArchive` reste actif. Cette stratégie
préserve un HTML cohérent, indexable et utilisable sans JavaScript.

## État de S1-T07

La route reste volontairement `noindex`. Les événements datés et les archives
sont fonctionnels, mais la migration Figma complète, les derniers contenus et
la validation éditoriale finale appartiennent encore aux prochaines
itérations de S1-T07.
