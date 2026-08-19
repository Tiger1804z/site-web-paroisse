import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import {
  createRemoteImageSources,
  DEFAULT_IMAGE_QUALITY,
  DEFAULT_IMAGE_QUALITY_LADDER,
  DEFAULT_IMAGE_WIDTHS,
  FALLBACK_SOURCE_WIDTH,
  HERO_IMAGE_QUALITY,
  HERO_IMAGE_QUALITY_LADDER,
  HERO_IMAGE_WIDTHS,
  readSourceWidth,
  resolveImageQuality,
  resolveImageWidths,
} from '../src/lib/sanity/image-sources.ts';
import { normalizeSanityImage } from '../src/lib/content/normalizeSanityImage.ts';

const buildSources = createRemoteImageSources({
  projectId: 'projet',
  dataset: 'production',
});

/** Une image du Studio : 4000 px de large, assez grande pour tous les barreaux. */
const largeImage = (overrides = {}) => ({
  _type: 'image',
  asset: { _id: 'image-abcdef0123456789-4000x2500-jpg' },
  ...overrides,
});

/** Les couples `largeur demandée / adresse` extraits d'un `srcset`. */
const readSrcSet = (srcSet) =>
  srcSet.split(', ').map((entry) => {
    const [url, descriptor] = entry.split(' ');
    return { url, width: Number(descriptor.replace('w', '')) };
  });

const parameterOf = (url, name) =>
  new globalThis.URL(url).searchParams.get(name) ?? undefined;

test('le profil par défaut garde les largeurs et la qualité d’hier', () => {
  const { src, srcSet } = buildSources(largeImage());
  const entries = readSrcSet(srcSet);

  assert.deepEqual(
    entries.map(({ width }) => width),
    [...DEFAULT_IMAGE_WIDTHS],
  );
  assert.equal(DEFAULT_IMAGE_QUALITY, 78);
  entries.forEach(({ url }) => {
    assert.equal(parameterOf(url, 'q'), '78');
    assert.equal(parameterOf(url, 'auto'), 'format');
  });
  assert.equal(parameterOf(src, 'w'), '1920');
  assert.equal(parameterOf(src, 'q'), '78');
});

test('le profil hero monte jusqu’à la haute densité, en qualité 85', () => {
  const { src, srcSet } = buildSources(largeImage(), { profile: 'hero' });
  const entries = readSrcSet(srcSet);

  assert.deepEqual(
    entries.map(({ width }) => width),
    [...HERO_IMAGE_WIDTHS],
  );
  assert.ok(
    entries.some(({ width }) => width === 2560),
    'un écran 1280 px en densité double doit trouver sa source',
  );
  assert.ok(entries.some(({ width }) => width === 3200));
  assert.equal(HERO_IMAGE_QUALITY, 85);
  entries.forEach(({ url, width }) => {
    assert.equal(parameterOf(url, 'auto'), 'format');
    if (width <= 1920) {
      assert.equal(
        parameterOf(url, 'q'),
        '85',
        'la qualité demandée s’applique aux largeurs qu’un écran ordinaire affiche',
      );
    }
  });

  // Les très grands barreaux existent pour être choisis, pas téléchargés
  // d'office par un client qui ignore `srcset`.
  assert.equal(parameterOf(src, 'w'), String(FALLBACK_SOURCE_WIDTH));
});

test('la qualité redescend là où le pixel est affiché à demi-taille', () => {
  const entries = readSrcSet(
    buildSources(largeImage(), { profile: 'hero' }).srcSet,
  );
  const quality = Object.fromEntries(
    entries.map(({ url, width }) => [width, Number(parameterOf(url, 'q'))]),
  );

  assert.equal(quality[1920], 85);
  assert.equal(quality[2560], 76);
  assert.equal(quality[3200], 72);
  assert.equal(resolveImageQuality(HERO_IMAGE_QUALITY_LADDER, 1600), 85);
  assert.equal(resolveImageQuality(HERO_IMAGE_QUALITY_LADDER, 2559), 85);
  assert.equal(resolveImageQuality(HERO_IMAGE_QUALITY_LADDER, 4000), 72);
  assert.equal(resolveImageQuality(DEFAULT_IMAGE_QUALITY_LADDER, 3200), 78);
});

test('la qualité 85 ne déborde pas sur les autres images', () => {
  const card = buildSources(largeImage());
  const hero = buildSources(largeImage(), { profile: 'hero' });

  readSrcSet(card.srcSet).forEach(({ url }) => {
    assert.equal(parameterOf(url, 'q'), '78');
  });
  assert.notEqual(
    parameterOf(readSrcSet(hero.srcSet)[0].url, 'q'),
    parameterOf(readSrcSet(card.srcSet)[0].url, 'q'),
  );
});

test('chaque adresse du srcset annonce exactement sa propre largeur', () => {
  for (const profile of ['default', 'hero']) {
    const { srcSet } = buildSources(largeImage(), { profile });

    readSrcSet(srcSet).forEach(({ url, width }) => {
      assert.equal(
        parameterOf(url, 'w'),
        String(width),
        `l’étiquette ${width}w doit correspondre au paramètre w`,
      );
      assert.match(
        url,
        /^https:\/\/cdn\.sanity\.io\/images\/projet\/production\//,
      );
    });
  }
});

test('aucune variante n’est inventée au-delà du fichier d’origine', () => {
  const small = {
    _type: 'image',
    asset: { _id: 'image-abcdef0123456789-1500x1000-jpg' },
  };
  const { src, srcSet } = buildSources(small, { profile: 'hero' });
  const widths = readSrcSet(srcSet).map(({ width }) => width);

  assert.deepEqual(widths, [720, 960, 1280, 1500]);
  assert.ok(
    widths.every((width) => width <= 1500),
    'le CDN ne peut qu’agrandir au-delà de la source',
  );
  assert.equal(parameterOf(src, 'w'), '1500');
});

test('une image plus petite que le premier barreau garde une seule variante', () => {
  const tiny = {
    _type: 'image',
    asset: { _id: 'image-abcdef0123456789-600x400-jpg' },
  };

  assert.deepEqual(
    readSrcSet(buildSources(tiny, { profile: 'hero' }).srcSet).map(
      ({ width }) => width,
    ),
    [600],
  );
});

test('le rognage du Studio réduit la largeur réellement disponible', () => {
  const cropped = largeImage({
    crop: { top: 0, bottom: 0, left: 0.25, right: 0.25 },
  });

  assert.equal(readSourceWidth(cropped), 2000);
  assert.deepEqual(
    readSrcSet(buildSources(cropped, { profile: 'hero' }).srcSet).map(
      ({ width }) => width,
    ),
    [720, 960, 1280, 1600, 1920, 2000],
  );
});

test('la largeur d’origine se lit dans les métadonnées comme dans la référence', () => {
  assert.equal(
    readSourceWidth({
      asset: {
        _ref: 'image-abcdef0123456789-4000x2500-jpg',
        metadata: { dimensions: { width: 4000 } },
      },
    }),
    4000,
  );
  assert.equal(readSourceWidth('image-abcdef0123456789-2048x1024-png'), 2048);
  assert.equal(
    readSourceWidth({ asset: { _id: 'sans-dimensions' } }),
    undefined,
  );
  assert.equal(readSourceWidth(undefined), undefined);
});

test('sans largeur d’origine connue, les barreaux demandés sont conservés', () => {
  assert.deepEqual(resolveImageWidths(HERO_IMAGE_WIDTHS), [
    ...HERO_IMAGE_WIDTHS,
  ]);
  assert.deepEqual(resolveImageWidths([1600, 480, 480, 960]), [480, 960, 1600]);
});

test('le point focal et le rognage survivent au changement de profil', () => {
  const source = largeImage({
    hotspot: { x: 0.3, y: 0.7, width: 0.5, height: 0.5 },
    crop: { top: 0.1, bottom: 0.1, left: 0.1, right: 0.1 },
  });

  for (const profile of ['default', 'hero']) {
    const { srcSet } = buildSources(source, { profile });

    readSrcSet(srcSet).forEach(({ url }) => {
      const rect = parameterOf(url, 'rect');
      assert.ok(rect, 'le rognage du Studio devient un rect sur l’adresse');
      const [left, top, width, height] = rect.split(',').map(Number);
      assert.equal(left, 400);
      assert.equal(top, 250);
      assert.equal(width, 3200);
      assert.equal(height, 2000);
    });
  }
});

test('un format imposé reste respecté, quel que soit le profil', () => {
  const { srcSet } = buildSources(largeImage(), {
    profile: 'hero',
    aspectRatio: 16 / 9,
  });

  readSrcSet(srcSet).forEach(({ url, width }) => {
    assert.equal(parameterOf(url, 'fit'), 'crop');
    assert.equal(
      Number(parameterOf(url, 'h')),
      Math.round(width / (16 / 9)),
      'la hauteur suit la largeur, donc le format reste constant',
    );
  });
});

test('des largeurs ou une qualité explicites priment sur le profil', () => {
  const { srcSet } = buildSources(largeImage(), {
    profile: 'hero',
    widths: [400, 800],
    quality: 60,
  });
  const entries = readSrcSet(srcSet);

  assert.deepEqual(
    entries.map(({ width }) => width),
    [400, 800],
  );
  entries.forEach(({ url }) => assert.equal(parameterOf(url, 'q'), '60'));
});

test('les en-têtes pleine largeur annoncent leur vraie largeur', () => {
  const heroes = [
    'src/components/sections/home/HomeHero.astro',
    'src/components/sections/parish-life/ParishLifeHero.astro',
    'src/components/sections/services/ServicesHero.astro',
    'src/components/sections/thrift-store/InteractiveThriftHero.astro',
    'src/components/sections/about/AboutHero.astro',
    'src/components/sections/events/EventsHero.astro',
    'src/components/sections/schedules/SchedulesHero.astro',
    'src/components/sections/advertisers/AdvertisersHero.astro',
  ];

  for (const hero of heroes) {
    const markup = readFileSync(hero, 'utf8');
    const declared = [...markup.matchAll(/sizes=(?:"([^"]*)"|\{([^}]*)\})/g)];

    assert.ok(declared.length > 0, `${hero} déclare une largeur d’affichage`);
    declared.forEach(([, quoted]) => {
      assert.equal(
        quoted,
        '100vw',
        `${hero} couvre toute la fenêtre : annoncer moins fait choisir une source trop petite`,
      );
    });
  }
});

test('le normalizer transmet le profil au constructeur d’adresses', () => {
  const calls = [];
  const spy = (_source, profile) => {
    calls.push(profile);
    return {
      src: 'https://cdn.test/i.jpg',
      srcSet: 'https://cdn.test/i.jpg 1w',
    };
  };
  const raw = {
    alt: 'Façade de l’église',
    image: { asset: { _id: 'image-abcdef0123456789-4000x2500-jpg' } },
  };

  normalizeSanityImage(raw, spy);
  normalizeSanityImage(raw, spy, 'hero');

  assert.deepEqual(calls, ['default', 'hero']);
});
