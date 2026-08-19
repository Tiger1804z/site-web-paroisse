// Comment reconnaître un marqueur stega dans un fichier produit.
//
// Ce détecteur a coûté une fausse alerte, et elle vaut la peine d'être dite.
//
// Sanity parle de « caractères invisibles ». Le premier contrôle écrit pour ce
// dépôt cherchait le plan Unicode « Tags » (U+E0000–U+E007F), qui est la façon
// dont on décrit souvent la technique. Mesuré sur la sortie réelle de
// `@vercel/stega` — la bibliothèque que Sanity utilise — l'encodage n'emploie
// aucun de ces caractères : il combine U+200B, U+200C, U+200D et U+FEFF.
//
// Le contrôle passait donc au vert sur du HTML truffé de marqueurs. Une
// vérification incapable de détecter la panne qu'elle surveille est pire
// qu'absente : elle rassure.
//
// `tests/sanity-visual-editing.test.mjs` encode une chaîne avec `@vercel/stega`
// et exige que ce détecteur la reconnaisse. Si la bibliothèque change son
// alphabet, c'est le test qui échoue — pas le site public qui fuit en silence.
//
// Écrit en boucle plutôt qu'en expression régulière : une classe de caractères
// contenant U+200D, le jointeur, est ambiguë, et ESLint le signale à juste
// titre. La boucle dit exactement ce qu'elle compte.

/** Les quatre caractères que `@vercel/stega` combine pour encoder. */
export const STEGA_CHARACTERS = new Set([
  '\u200B',
  '\u200C',
  '\u200D',
  '\uFEFF',
]);

/**
 * Une charge stega fait des centaines de caractères d'affilée. Un caractère
 * de largeur nulle isolé, égaré dans un texte éditorial, est plausible et sans
 * gravité : on cherche donc une séquence, pas une occurrence.
 */
export const STEGA_MINIMUM_RUN = 8;

/**
 * @param {string} text
 * @param {number} [minimumRun]
 * @returns {boolean}
 */
export function containsStega(text, minimumRun = STEGA_MINIMUM_RUN) {
  let run = 0;

  for (const character of text) {
    run = STEGA_CHARACTERS.has(character) ? run + 1 : 0;
    if (run >= minimumRun) return true;
  }

  return false;
}
