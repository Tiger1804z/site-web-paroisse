# Prises de vue — 11 août 2026

Document à avoir en main **sur place**. Il dit quoi photographier, et à quel
endroit du site chaque photo ira.

Les images actuelles sont provisoires : elles vivent dans Sanity précisément
pour être remplacées sans toucher au code. Relevé du 2026-08-06 : sur les 50
emplacements d'images, **23 ne montrent pas la Paroisse Saint-René-Goupil**.

---

## Comment cadrer

Trois règles, et c'est tout :

1. **Horizontal, et large.** Le site recadre chaque image selon son
   emplacement — 4/3, 16/10, carré, parfois vertical. Une photo cadrée large
   laisse de la marge pour tous ces formats; une photo cadrée serré ne peut
   plus être recadrée.
2. **La plus grande résolution possible.** Le site fabrique lui-même les
   versions réduites. Il ne peut pas fabriquer ce qui n'a jamais été capté.
   Ne pas envoyer d'images déjà réduites par un envoi de messagerie.
3. **Ne pas s'inquiéter du centrage.** Dans Sanity, on clique sur le point
   important de l'image, et tous les cadres du site s'y ajustent. Une photo
   dont le sujet est décentré reste utilisable.

**Pas de personnes reconnaissables** sans leur accord, surtout pour les
enfants. Des salles vides ou des plans larges de dos évitent la question.

---

## Priorité 1 — La friperie

**Le plus gros écart du site.** Les trois images du haut de la page `/friperie`
sont des photos de banque : des chandails sur un portant, une pelote de laine,
des bottes d'hiver. Leur propre note interne dit qu'elles « ne montrent pas le
local paroissial ».

La friperie **Au Coin de l'Entraide** est au sous-sol de l'église, entrée par
la porte de la 25e Avenue. Ouverte mardi, mercredi et jeudi de 13 h à 17 h — la
rencontre du 11 août est un **mardi**, donc elle devrait être ouverte.

| À photographier                            | Remplace                                |
| ------------------------------------------ | --------------------------------------- |
| Vue d'ensemble du local, plan large        | `hero.slides[0]` — portant de chandails |
| Les articles présentés (vêtements, maison) | `hero.slides[1]` — pelote de laine      |
| L'entrée ou l'accueil du local             | `hero.slides[2]` — bottes d'hiver       |

Trois photos suffisent. Cinq ou six donnent du choix.

---

## Priorité 2 — Ce qui remplace une image d'ailleurs

| À photographier                                              | Va remplacer                                                         |
| ------------------------------------------------------------ | -------------------------------------------------------------------- |
| **La façade de l'église**, plan large                        | `/` → section services — actuellement **la cathédrale de Florence**  |
| **Le lampionnaire allumé**                                   | `/` → interlude, et `/nos-services` → chapitre 3 (deux emplacements) |
| **Une œuvre mariale** de l'église (statue, vitrail, tableau) | `/` → section vie paroissiale — aquarelle de provenance inconnue     |

La façade sert deux fois : ici, et comme **image de partage** du site entier —
celle qui apparaîtra quand on collera un lien du site dans Facebook ou dans un
courriel. Il n'y en a aucune aujourd'hui. Une bonne photo horizontale de la
façade règle les deux d'un coup.

---

## Priorité 3 — Les abords, pour la page Première visite

La page `/premiere-visite` décrit ce qu'on voit en arrivant. Ce qui y est
affirmé et mérite une photo :

- l'**entrée principale** (il y en a deux);
- la **rampe d'accès**, rue Parc René-Goupil;
- les **rues où se garer** — il n'y a pas de stationnement à l'église :
  Denis-Papin, Parc René-Goupil, 25e Avenue.

Utile aussi : **l'intérieur du vestibule**, ce qu'on voit en franchissant la
porte. C'est exactement ce que cherche quelqu'un qui n'est jamais venu.

> À vérifier sur place pendant qu'on y est : **l'accessibilité intérieure**.
> Le site ne l'affirme nulle part, faute de le savoir. Y a-t-il un ascenseur,
> des toilettes accessibles, un accès au sous-sol pour la friperie?

---

## Priorité 4 — Refaire le fonds général

Douze photos de l'église servent aujourd'hui à 21 endroits — la même vue de
l'autel revient quatre fois, la façade trois fois. Ça se voit.

De nouvelles prises de vue élargiraient le fonds :

- la **nef**, depuis le fond, et depuis l'avant;
- l'**autel** — le site en montre surtout des décorations rouges et violettes,
  liées à un temps liturgique précis. Une vue neutre vieillirait mieux;
- la **croix de verre coloré** de l'entrée (déjà utilisée, une seule photo);
- des **détails d'architecture** : brique, poutres de bois, lumière du chœur;
- l'**extérieur** aux deux extrémités de la journée, si l'occasion se présente.

Rien d'obligatoire. C'est du confort pour la suite.

---

## Ce qu'aucune photo ne réglera

Deux dossiers restent ouverts après le 11, et ils demandent une réponse de la
paroisse plutôt qu'un appareil photo.

### Les huit illustrations historiques

La page `/notre-paroisse` raconte l'histoire de 1959 à aujourd'hui avec **huit
illustrations générées par intelligence artificielle** — faute d'images
d'époque. Elles sont déclarées comme telles dans leur fiche, et la page le dit
au lecteur.

**À demander :** la paroisse possède-t-elle des photographies d'archives? La
construction (1963-1964), l'inauguration, les anciens curés, les
transformations des années 1990. Chaque photo d'archive remplacerait une
illustration inventée par un document réel.

### Les deux pèlerinages

Quatre images montrent la **basilique Sainte-Anne-de-Beaupré** et le
**sanctuaire Notre-Dame-du-Cap**. Ce sont des bâtiments appartenant à d'autres
institutions, et la provenance des fichiers est inconnue — l'une est une vue
aérienne, une autre est datée de 2011 dans ses métadonnées.

Trois issues possibles :

1. photos prises lors du prochain pèlerinage — la meilleure;
2. images officielles des deux sanctuaires, qui en diffusent pour la presse;
3. retirer les images : la fiche d'activité fonctionne sans.

---

## Après la rencontre

Les photos se déposent dans Sanity, à l'emplacement indiqué dans les tableaux
ci-dessus. Pour chacune, trois champs à remplir :

- le **texte alternatif** — ce que montre l'image, pour qui ne la voit pas;
- le **point important** — un clic sur le sujet, pour le recadrage automatique;
- la **note de provenance** — qui a pris la photo et quand.

Cette dernière n'est jamais affichée sur le site. Elle sert à ce que, dans
trois ans, quelqu'un puisse encore répondre à la question « d'où vient cette
image? ». C'est aussi ce qui fait disparaître les questions de crédit : une
photo prise par la paroisse, notée comme telle, ne pose plus de problème.
