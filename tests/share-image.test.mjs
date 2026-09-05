import assert from 'node:assert/strict';
import test from 'node:test';
import { URL } from 'node:url';
import { normalizeShareImage } from '../src/lib/content/normalizeShareImage.ts';
import {
  createRemoteImageSources,
  REMOTE_IMAGE_PROFILES,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
} from '../src/lib/sanity/image-sources.ts';

/**
 * La vignette de partage est la seule image du site qu'aucun visiteur ne voit
 * dans un navigateur : elle est lue par Facebook, Messenger, WhatsApp et
 * consorts, qui recadrent d'autorité tout ce qui n'est pas au format 1,91:1.
 *
 * Ces tests tiennent donc deux promesses : le recadrage est demandé au CDN, et
 * les dimensions annoncées dans le `<head>` sont celles de l'image réellement
 * servie — pas celles du fichier d'origine.
 */

/** Constructeur d'adresses factice, qui note le profil qu'on lui demande. */
function spyBuilder() {
  const calls = [];
  const build = (source, profile = 'default') => {
    calls.push({ source, profile });
    return {
      src: 'https://cdn.sanity.io/images/partage.jpg',
      srcSet: 'https://cdn.sanity.io/images/partage.jpg 1200w',
    };
  };

  return { build, calls };
}

const rawImage = (width, height) => ({
  alt: 'La façade de l’église et ses clochers',
  image: {
    asset: {
      _id: `image-abc-${width}x${height}-webp`,
      metadata: { dimensions: { width, height } },
    },
  },
});

test('la vignette de partage passe par le profil « share »', () => {
  const { build, calls } = spyBuilder();

  normalizeShareImage(rawImage(1360, 1017), build);

  assert.equal(calls.length, 1);
  assert.equal(calls[0].profile, 'share');
});

test('les dimensions annoncées sont celles de la vignette, pas du fichier', () => {
  const { build } = spyBuilder();

  const image = normalizeShareImage(rawImage(4624, 3468), build);

  assert.equal(image?.width, SHARE_IMAGE_WIDTH);
  assert.equal(image?.height, SHARE_IMAGE_HEIGHT);
});

/**
 * Le CDN n'agrandit pas. Annoncer 1200 × 630 pour une source de 900 px de
 * large serait une dimension que le réseau constaterait fausse en téléchargeant
 * le fichier — ce que l'annonce était censée lui épargner.
 */
test('une source étroite est annoncée à sa taille réelle', () => {
  const { build } = spyBuilder();

  const image = normalizeShareImage(rawImage(900, 675), build);

  assert.equal(image?.width, 900);
  assert.equal(image?.height, Math.round(900 / (1200 / 630)));
});

test('le texte alternatif de la vignette vient du Studio', () => {
  const { build } = spyBuilder();

  const image = normalizeShareImage(rawImage(1360, 1017), build);

  assert.equal(image?.alt, 'La façade de l’église et ses clochers');
});

/**
 * Sans texte alternatif, `normalizeSanityImage` refuse l'image — et la vignette
 * de partage n'y échappe pas. Une image sans description ne part pas sur les
 * réseaux au nom de la paroisse.
 */
test('une image sans texte alternatif n’est pas une vignette', () => {
  const { build } = spyBuilder();

  assert.equal(
    normalizeShareImage({ ...rawImage(1360, 1017), alt: '' }, build),
    undefined,
  );
  assert.equal(normalizeShareImage(null, build), undefined);
});

test('le profil « share » impose le format 1,91:1', () => {
  assert.equal(
    REMOTE_IMAGE_PROFILES.share.aspectRatio,
    SHARE_IMAGE_WIDTH / SHARE_IMAGE_HEIGHT,
  );
  assert.deepEqual(REMOTE_IMAGE_PROFILES.share.widths, [SHARE_IMAGE_WIDTH]);
});

/**
 * Le vrai constructeur, cette fois : c'est l'adresse produite qui compte, pas
 * l'intention déclarée dans le profil.
 */
test('l’adresse produite demande bien un recadrage 1200 × 630', () => {
  const build = createRemoteImageSources({
    projectId: 'xo2ahvjo',
    dataset: 'production',
  });

  const { src, srcSet } = build(
    { _type: 'image', asset: { _ref: 'image-abc-1360x1017-webp' } },
    { profile: 'share' },
  );

  const url = new URL(src);
  assert.equal(url.searchParams.get('w'), String(SHARE_IMAGE_WIDTH));
  assert.equal(url.searchParams.get('h'), String(SHARE_IMAGE_HEIGHT));
  assert.equal(url.searchParams.get('fit'), 'crop');
  // Les virgules de `rect=` interdisent de compter les barreaux au séparateur :
  // ce sont les descripteurs de largeur qu'il faut compter.
  assert.equal(
    srcSet.match(/\s\d+w(?:,|$)/g)?.length,
    1,
    'La vignette n’a qu’un barreau : personne ne choisit parmi plusieurs.',
  );
});

/**
 * Le profil ne doit pas déborder sur les autres images du site : un en-tête
 * s'étire à la hauteur de sa colonne et n'a pas de format connu à l'avance.
 */
test('les autres profils gardent leur image entière', () => {
  const build = createRemoteImageSources({
    projectId: 'xo2ahvjo',
    dataset: 'production',
  });

  for (const profile of ['default', 'hero']) {
    const { src } = build(
      { _type: 'image', asset: { _ref: 'image-abc-4624x3468-jpg' } },
      { profile },
    );

    assert.equal(
      new URL(src).searchParams.get('h'),
      null,
      `Le profil « ${profile} » impose une hauteur qu'il ne devrait pas.`,
    );
  }
});
