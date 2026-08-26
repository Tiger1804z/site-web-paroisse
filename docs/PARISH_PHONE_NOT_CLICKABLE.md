# Le numéro de la paroisse n’est pas cliquable

Décision du 20 août 2026, demandée par la paroisse.

## Pourquoi

Le secrétariat reçoit les appels de la paroisse **à domicile, 24 heures sur 24**.
Un lien `tel:` ou un bouton « Appeler » transforme une consultation de minuit en
sonnerie chez quelqu’un : le site encourageait un geste dont la personne au bout
du fil payait le prix.

La décision n’est pas de cacher le numéro. Il reste affiché partout où il sert —
pied de page, menu mobile, accueil, Contact, Nos services, Nos annonceurs,
mentions légales, politique de confidentialité. Ce qui disparaît, c’est le geste
unique qui déclenche l’appel.

## Ce que ça veut dire dans le code

`PublicPhone` (`src/types/siteSettings.ts`) n’a plus de champ `href`. Ce n’est
pas une omission mais le verrou : sans forme cliquable dans le contrat, aucune
page ne peut en fabriquer une par distraction, et le compilateur signale toute
tentative.

Restent trois formats :

| Champ           | À quoi il sert                                          |
| --------------- | ------------------------------------------------------- |
| `display`       | Ce que le visiteur lit : `514 722-1161`.                |
| `international` | Les données structurées `schema.org` (`telephone`).     |
| `e164`          | La forme machine de référence, qui identifie le numéro. |

## Les numéros qui restent cliquables

Ceux des tiers, et eux seuls : annonceurs, personne responsable d’une activité,
friperie. Ce sont leurs lignes, pas celle du secrétariat, et rien ne justifie de
compliquer un appel à une boulangerie.

Ces numéros viennent de champs libres du Studio. Le jour où quelqu’un y saisit le
numéro principal de la paroisse — comme personne-ressource d’une activité, par
exemple — le bouton d’appel qu’on vient de retirer réapparaîtrait par cette
porte. `src/lib/content/parishPhone.ts` la ferme : `isParishMainPhone` reconnaît
le numéro quel que soit son format d’écriture, et `toThirdPartyDialableDigits`
renvoie alors « pas de lien ». Le numéro reste affiché; il ne devient simplement
pas cliquable.

## Ce qui garde la décision

Deux contrôles, qui ne regardent pas la même chose :

- `tests/parish-phone.test.mjs` lit le code. Il vérifie le contrat, le
  comportement des normalizers sur un champ libre, et qu’aucune source ne
  fabrique de `tel:` hors du garde-fou.
- `scripts/check-parish-phone.mjs` lit `dist/`, après `pnpm build:public`. Il
  vérifie ce que le visiteur reçoit : aucun lien d’appel vers le numéro de la
  paroisse, aucun bouton « Appeler » — **et** que le numéro figure bien encore
  sur au moins une page, pour qu’un contrôle vert ne puisse pas signifier « le
  numéro a disparu ».

Le second tourne dans `pnpm validate` (`pnpm check:phone`).

## Ce qui a changé pour le visiteur

- **Barre mobile d’actions rapides** : l’action « Appeler » est remplacée par
  « Contact », qui mène à `/contact/`. La barre garde ses trois entrées, et la
  personne y trouve le numéro, les heures d’ouverture et de quoi écrire.
- **Nos services** : les boutons « Téléphoner au secrétariat » — dix au fil des
  chapitres, plus celui du bloc de clôture — deviennent « Contacter le
  secrétariat » et mènent à `/contact/`.
- **Nos annonceurs, bloc « Devenir annonceur »** : le bouton d’appel disparaît;
  il ne reste que « Voir nos coordonnées ». Le champ Studio « Libellé du bouton
  d’appel » a été retiré du schéma en même temps — un champ que le site ne lit
  plus n’a rien à faire sous les yeux de la secrétaire.
- **Page Contact** : la carte « Téléphone » n’est plus un lien, et sa note
  « Touchez le numéro pour appeler » devient « Le secrétariat répond durant ses
  heures d’ouverture ».

## Ce qui n’a pas été touché

- Les liens courriel, itinéraire et horaires.
- La ligne propre de la friperie (`514 721-2842`) et les numéros des quatre
  annonceurs.
- `telephone` dans les données structurées `schema.org`
  (`src/lib/seo/jsonLd.ts`). C’est une description de la paroisse pour les
  moteurs de recherche, pas un bouton dans la page. Un moteur peut choisir d’en
  faire un bouton d’appel dans ses résultats : si la paroisse veut fermer aussi
  cette porte, c’est une décision à prendre à part, avec le coût qu’elle a en
  référencement local.
