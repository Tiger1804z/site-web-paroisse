import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeSanityRichText,
  richTextToPlainText,
} from '../src/lib/content/normalizeSanityRichText.ts';

function block(children, key = 'p0') {
  return { _type: 'block', _key: key, style: 'normal', markDefs: [], children };
}

function span(text, marks = [], key = 's0') {
  return { _type: 'span', _key: key, text, marks };
}

test('un paragraphe simple traverse la normalisation', () => {
  const result = normalizeSanityRichText([block([span('Bonjour')])]);

  assert.deepEqual(result, [
    { key: 'p0', spans: [{ text: 'Bonjour', marks: [] }] },
  ]);
});

test('le gras et l’italique sont conservés', () => {
  const result = normalizeSanityRichText([
    block([
      span('Pour la réception qui suivra', ['strong'], 's0'),
      span(', apportez un plat.', [], 's1'),
    ]),
  ]);

  assert.deepEqual(result?.[0].spans, [
    { text: 'Pour la réception qui suivra', marks: ['strong'] },
    { text: ', apportez un plat.', marks: [] },
  ]);
});

test('les deux emphases se cumulent sur un même fragment', () => {
  const result = normalizeSanityRichText([
    block([span('Titre', ['strong', 'em'])]),
  ]);

  assert.deepEqual(result?.[0].spans[0].marks, ['strong', 'em']);
});

/**
 * Le Studio ne propose ni lien ni surlignage, mais une annotation ajoutée un
 * jour — ou collée depuis un autre document — laisserait une clé de `markDefs`
 * dans `marks`. Elle ne doit pas atteindre le rendu, et surtout pas emporter le
 * texte avec elle.
 */
test('une marque inconnue est retirée sans perdre le texte', () => {
  const result = normalizeSanityRichText([
    block([span('Un lien', ['strong', 'a1b2c3', 'underline'])]),
  ]);

  assert.deepEqual(result?.[0].spans, [{ text: 'Un lien', marks: ['strong'] }]);
});

test('un paragraphe vide est écarté', () => {
  const result = normalizeSanityRichText([
    block([span('')], 'vide'),
    block([span('Du texte')], 'plein'),
  ]);

  assert.equal(result?.length, 1);
  assert.equal(result?.[0].key, 'plein');
});

test('un bloc qui n’est pas du texte est écarté', () => {
  const result = normalizeSanityRichText([
    { _type: 'image', _key: 'img', asset: { _ref: 'image-abc-10x10-jpg' } },
    block([span('Du texte')], 'texte'),
  ]);

  assert.equal(result?.length, 1);
  assert.equal(result?.[0].key, 'texte');
});

test('la clé du bloc sert de clé de rendu, avec un repli sur la position', () => {
  const result = normalizeSanityRichText([
    { _type: 'block', style: 'normal', children: [span('Sans clé')] },
  ]);

  assert.equal(result?.[0].key, 'paragraphe-0');
});

test('une valeur absente ou vide ne produit pas de texte', () => {
  assert.equal(normalizeSanityRichText(undefined), undefined);
  assert.equal(normalizeSanityRichText(null), undefined);
  assert.equal(normalizeSanityRichText('du texte brut'), undefined);
  assert.equal(normalizeSanityRichText([]), undefined);
  assert.equal(normalizeSanityRichText([block([span('')])]), undefined);
});

/**
 * Les données structurées n'acceptent qu'une chaîne. Le balisage se perd, mais
 * aucun mot ne doit disparaître : c'est ce texte que Google affiche.
 */
test('l’aplatissement garde tous les mots et sépare les paragraphes', () => {
  const blocks = normalizeSanityRichText([
    block(
      [
        span('Pour la réception', ['strong'], 's0'),
        span(', apportez un plat.', [], 's1'),
      ],
      'p0',
    ),
    block([span('Merci d’avance.')], 'p1'),
  ]);

  assert.equal(
    richTextToPlainText(blocks),
    'Pour la réception, apportez un plat.\nMerci d’avance.',
  );
});

test('l’aplatissement d’un texte absent ne rend rien', () => {
  assert.equal(richTextToPlainText(undefined), undefined);
  assert.equal(richTextToPlainText([]), undefined);
});
