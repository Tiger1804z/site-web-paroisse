/**
 * Lecture tolérante d'une heure saisie à la main.
 *
 * Le site a besoin d'une heure calculable — `16:00`, sur 24 heures — mais
 * personne n'écrit ses horaires ainsi. Au téléphone comme sur un feuillet
 * paroissial, une messe est à « 8 h », « 8h30 », parfois « 8:00 ». Exiger la
 * forme machine à la saisie, c'est transformer une faute de frappe en messe
 * absente du site : une entrée dont l'heure est illisible est écartée à
 * l'affichage, sans bruit.
 *
 * On accepte donc toutes ces formes et on les ramène à `HH:mm` au moment où
 * l'éditrice quitte le champ. La valeur stockée reste unique; c'est la saisie
 * qui devient humaine.
 *
 * Ce module a un jumeau : `src/lib/schedules/schedule-time.ts`. Le Studio et
 * le site sont deux paquets distincts, et aucun des deux ne doit importer les
 * sources de l'autre. `tests/schedule-time.test.mjs` compare les deux
 * implémentations sur la même table de cas — les faire diverger fait échouer
 * la validation.
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
const NATURAL_TIME = /^(\d{1,2})(?:\s*[h:.]\s*(\d{2})?)?$/

/**
 * `8`, `8h`, `8 h`, `8h30`, `8 h 30`, `8:00`, `08.30` → `08:00` / `08:30`.
 * Toute autre saisie → `undefined`.
 */
export function normalizeScheduleTime(value: string | null | undefined): string | undefined {
  if (typeof value !== 'string') return undefined

  const clean = value.trim().toLowerCase()
  if (!clean) return undefined

  const match = NATURAL_TIME.exec(clean)
  if (!match) return undefined

  const hours = Number(match[1])
  const minutes = match[2] === undefined ? 0 : Number(match[2])

  if (hours > 23 || minutes > 59) return undefined

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
}
