/**
 * Texte de plusieurs paragraphes, avec gras et italique.
 *
 * Forme normalisée du champ `richText` de Sanity : on ne garde que ce que le
 * site sait rendre. Le format d'origine — le Portable Text — décrit bien plus
 * de choses; les recopier telles quelles obligerait chaque composant à savoir
 * quoi faire d'un titre, d'une liste ou d'un lien que le Studio ne propose même
 * pas. Ce qui n'est pas reconnu est écarté à la normalisation, une fois, plutôt
 * qu'ignoré au rendu, partout.
 */
export type RichTextMark = 'strong' | 'em';

export interface RichTextSpan {
  readonly text: string;
  readonly marks: readonly RichTextMark[];
}

/**
 * `key` vient de Sanity et sert de clé de rendu stable.
 *
 * Un index de tableau ferait l'affaire jusqu'au jour où l'éditrice insère un
 * paragraphe au milieu : tout ce qui suit changerait de clé.
 */
export interface RichTextParagraph {
  readonly key: string;
  readonly spans: readonly RichTextSpan[];
}

export type RichText = readonly RichTextParagraph[];
