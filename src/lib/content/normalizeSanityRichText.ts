// Chemin relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`.
import type {
  RichText,
  RichTextMark,
  RichTextParagraph,
  RichTextSpan,
} from '../../types/richText.ts';

/**
 * Les seules emphases que le Studio propose, donc les seules qui arrivent ici.
 *
 * Une marque inconnue — une annotation de lien ajoutée plus tard, une clé de
 * `markDefs` — n'est pas une erreur : elle est simplement retirée, et le texte
 * qu'elle portait reste lisible.
 */
const SUPPORTED_MARKS: readonly string[] = ['strong', 'em'];

type RawSpan = {
  _type?: unknown;
  text?: unknown;
  marks?: unknown;
};

type RawBlock = {
  _type?: unknown;
  _key?: unknown;
  children?: unknown;
};

function normalizeMarks(raw: unknown): readonly RichTextMark[] {
  if (!Array.isArray(raw)) return [];

  return raw.filter(
    (mark): mark is RichTextMark =>
      typeof mark === 'string' && SUPPORTED_MARKS.includes(mark),
  );
}

function normalizeSpan(raw: unknown): RichTextSpan | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined;

  const span = raw as RawSpan;
  if (span._type !== undefined && span._type !== 'span') return undefined;
  if (typeof span.text !== 'string' || span.text === '') return undefined;

  return { text: span.text, marks: normalizeMarks(span.marks) };
}

function normalizeParagraph(
  raw: unknown,
  index: number,
): RichTextParagraph | undefined {
  if (typeof raw !== 'object' || raw === null) return undefined;

  const block = raw as RawBlock;

  // Un bloc qui n'est pas du texte — une image intercalée, un encadré — ne se
  // rend pas ici. Le Studio n'en propose aucun; s'il en proposait un jour, il
  // faudrait un composant pour lui, pas un rendu approximatif.
  if (block._type !== 'block') return undefined;
  if (!Array.isArray(block.children)) return undefined;

  const spans = block.children.flatMap((child) => {
    const span = normalizeSpan(child);
    return span ? [span] : [];
  });

  // Un paragraphe vide vient d'une double frappe sur Entrée. Le rendre
  // dessinerait un trou dans la colonne.
  if (spans.length === 0) return undefined;

  const key =
    typeof block._key === 'string' ? block._key : `paragraphe-${index}`;

  return { key, spans };
}

/**
 * Convertit le champ `richText` de Sanity en paragraphes rendables.
 *
 * Retourne `undefined` plutôt qu'un tableau vide : l'appelant distingue ainsi
 * « pas de texte » de « du texte, mais rien d'affichable ».
 */
export function normalizeSanityRichText(raw: unknown): RichText | undefined {
  if (!Array.isArray(raw)) return undefined;

  const paragraphs = raw.flatMap((block, index) => {
    const paragraph = normalizeParagraph(block, index);
    return paragraph ? [paragraph] : [];
  });

  return paragraphs.length > 0 ? paragraphs : undefined;
}

/**
 * Le même texte, sans emphase ni structure.
 *
 * Les données structurées lues par Google n'acceptent qu'une chaîne. Les
 * paragraphes y sont recollés par un saut de ligne : le sens se garde, le
 * balisage se perd, et c'est exactement ce que ce format attend.
 */
export function richTextToPlainText(
  blocks: RichText | undefined,
): string | undefined {
  if (!blocks || blocks.length === 0) return undefined;

  const text = blocks
    .map((paragraph) => paragraph.spans.map((span) => span.text).join(''))
    .join('\n')
    .trim();

  return text ? text : undefined;
}
