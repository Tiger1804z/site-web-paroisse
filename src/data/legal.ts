/**
 * Les faits que les pages légales déclarent, rassemblés en un endroit.
 *
 * Ces pages **ne sont pas dans le Studio**, et c'est délibéré. Elles ne
 * décrivent pas la vie de la paroisse : elles décrivent le fonctionnement
 * technique du site. Le jour où le formulaire changera, où un outil de mesure
 * d'audience apparaîtra, où l'hébergeur changera, c'est le code qui bougera —
 * et le texte doit bouger avec lui, dans le même commit. Confier ce texte à
 * l'éditrice, ce serait lui demander de tenir à jour la description d'un
 * système qu'elle ne modifie pas.
 *
 * Les coordonnées, elles, ne sont pas recopiées ici : elles viennent de
 * `siteSettings`, comme partout ailleurs sur le site.
 */

/**
 * Le formulaire transmet-il réellement les messages?
 *
 * **Faux aujourd'hui** : `/contact` vérifie les champs dans le navigateur et
 * n'envoie rien. Une politique qui décrirait un envoi inexistant serait fausse
 * le jour de sa publication.
 *
 * Le lot « formulaire » posera un vrai réglage d'environnement
 * (`CONTACT_FORM_ENABLED`) et cette constante le suivra. En attendant, une
 * seule valeur commande les deux versions du texte.
 */
export const CONTACT_FORM_SENDS_MESSAGES = false;

/**
 * Responsable de la protection des renseignements personnels.
 *
 * La loi québécoise désigne par défaut la personne ayant la plus haute
 * autorité dans l'organisation, à moins d'une délégation écrite. La paroisse
 * n'a donc rien à créer : la fonction est déjà occupée.
 *
 * On publie **la fonction et non un nom**. Un nom se périme au premier
 * changement de curé, et une page légale qui nomme quelqu'un qui n'est plus là
 * est pire qu'une page qui nomme une charge. Le point de contact est l'adresse
 * générale de la paroisse, pas une boîte personnelle.
 *
 * À faire confirmer à la paroisse — pas à décider à sa place.
 */
export const PRIVACY_OFFICER_ROLE = 'Le curé de la Paroisse Saint-René-Goupil';

/**
 * Durée de conservation des messages.
 *
 * Aucune durée chiffrée n'a été fixée par la paroisse, et il n'est pas question
 * d'en inventer une : un nombre publié est un engagement. Cette formulation dit
 * la vérité — les messages vivent dans une boîte de courriel le temps qu'on s'en
 * occupe — sans promettre un délai que personne ne tient.
 */
export const RETENTION_STATEMENT =
  'Les messages sont conservés pendant la durée nécessaire au traitement et au suivi de la demande.';

/**
 * Services tiers que le navigateur d'un visiteur contacte réellement.
 *
 * Liste vérifiée sur le HTML produit le 2026-08-06, pas recopiée d'un modèle.
 * Toute addition à cette liste est une modification du code, donc un moment où
 * la page doit être relue.
 */
export const THIRD_PARTY_SERVICES = [
  {
    name: 'Sanity',
    what: 'Les photographies et les illustrations du site sont servies depuis cdn.sanity.io.',
    when: 'À l’affichage de toute page contenant une image.',
  },
  {
    name: 'OpenStreetMap',
    what: 'La carte de la page Contact est affichée par openstreetmap.org.',
    when: 'À l’affichage de la page Contact seulement.',
  },
  {
    name: 'Cloudflare',
    what: 'Le site est hébergé par Cloudflare, qui livre les pages.',
    when: 'À l’affichage de toute page.',
  },
] as const;

/**
 * Dernière révision du contenu de ces pages, telle qu'elle s'affiche.
 * À modifier quand le texte change.
 */
export const LEGAL_PAGES_UPDATED_LABEL = '6 août 2026';
