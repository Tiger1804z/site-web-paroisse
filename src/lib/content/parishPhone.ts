// Chemin relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`.
import { siteSettingsData } from '../../data/siteSettings.ts';

/**
 * Les dix chiffres d'un numéro nord-américain, ou `undefined`.
 *
 * L'éditrice écrit « 514 728-4345 »; personne ne saisit deux fois le même
 * numéro sous deux formes. Ce qui n'a pas dix chiffres n'est pas composable et
 * n'obtient donc jamais de lien : mieux vaut un texte non cliquable qu'un appel
 * vers nulle part.
 */
export function toDialableDigits(
  value: string | null | undefined,
): string | undefined {
  const digits = value?.replace(/\D/g, '');
  return digits?.length === 10 ? digits : undefined;
}

/**
 * Le numéro saisi est-il celui du secrétariat de la paroisse?
 *
 * Les numéros de tiers — annonceurs, responsables d'activité, friperie — gardent
 * leur lien d'appel : ce sont leurs lignes, pas celle du secrétariat. Mais un
 * champ libre reste un champ libre, et le jour où quelqu'un saisit le numéro
 * principal comme personne-ressource d'une activité, le bouton d'appel que la
 * paroisse vient de retirer réapparaîtrait par cette porte. Cette fonction ferme
 * la porte : le numéro reste affiché, il ne devient simplement pas cliquable.
 *
 * La référence est `e164` des coordonnées locales. C'est le même numéro que le
 * repli du site : si la paroisse change de ligne, les deux se corrigent au même
 * endroit.
 */
export function isParishMainPhone(value: string | null | undefined): boolean {
  const digits = toDialableDigits(value);
  if (!digits) return false;

  return `+1${digits}` === siteSettingsData.phone.e164;
}

/**
 * Les chiffres composables d'un numéro de tiers, le numéro de la paroisse exclu.
 *
 * Renvoyer `undefined` veut dire « pas de lien d'appel », jamais « pas de
 * numéro » : l'appelant garde toujours la valeur affichée.
 */
export function toThirdPartyDialableDigits(
  value: string | null | undefined,
): string | undefined {
  return isParishMainPhone(value) ? undefined : toDialableDigits(value);
}
