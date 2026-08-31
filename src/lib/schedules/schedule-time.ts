/**
 * Lecture tolérante d'une heure, côté site.
 *
 * Le Studio normalise déjà l'heure à la saisie — voir
 * `studio/lib/scheduleTime.ts`, dont ce module est le jumeau exact. Mais le
 * jeu de données porte des documents antérieurs à cette normalisation, et une
 * valeur peut toujours être écrite par un script ou par l'API sans passer par
 * le champ du Studio.
 *
 * Le repli n'est donc pas de la prudence décorative : sans lui, une heure
 * écrite « 8:00 » au lieu de « 08:00 » fait disparaître la messe du site,
 * silencieusement — `toUsableEntry` écarte toute entrée hebdomadaire dont
 * l'heure ne se lit pas.
 *
 * `tests/schedule-time.test.mjs` compare les deux implémentations sur la même
 * table de cas : les faire diverger fait échouer la validation.
 */

/**
 * Heure, séparateur facultatif, minutes facultatives.
 *
 * `\s` couvre l'espace insécable en JavaScript, tout comme `trim()`. Ça compte
 * ici : « 8 h 30 » correctement typographié en contient deux, invisibles à
 * l'écran comme dans le champ.
 *
 * Les minutes exigent deux chiffres : « 8h5 » ne s'écrit pas, et deviner entre
 * 8 h 05 et 8 h 50 serait inventer un horaire.
 */
const NATURAL_TIME = /^(\d{1,2})(?:\s*[h:.]\s*(\d{2})?)?$/;

/**
 * `8`, `8h`, `8 h`, `8h30`, `8 h 30`, `8:00`, `08.30` → `08:00` / `08:30`.
 * Toute autre saisie → `undefined`.
 */
export function normalizeScheduleTime(
  value: string | null | undefined,
): string | undefined {
  if (typeof value !== 'string') return undefined;

  const clean = value.trim().toLowerCase();
  if (!clean) return undefined;

  const match = NATURAL_TIME.exec(clean);
  if (!match) return undefined;

  const hours = Number(match[1]);
  const minutes = match[2] === undefined ? 0 : Number(match[2]);

  if (hours > 23 || minutes > 59) return undefined;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}
