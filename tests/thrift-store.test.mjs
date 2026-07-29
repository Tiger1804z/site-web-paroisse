import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';

const rootPath = fileURLToPath(new URL('..', import.meta.url));

// `src/data/thriftStore.ts` importe des images : Node ne peut pas le charger.
// On vérifie donc la source, comme pour les autres gardes structurelles.
const thriftStoreSource = readFileSync(
  `${rootPath}/src/data/thriftStore.ts`,
  'utf8',
);

test('aucun visuel de la friperie n’a de droits inconnus', () => {
  assert.doesNotMatch(thriftStoreSource, /rights-unverified/);
});

test('les prototypes sans licence ont quitté le dépôt', () => {
  const removed = [
    'blue-rack-temporary.webp',
    'clothing-rack-primary-temporary.jpeg',
    'leather-jacket-temporary.jpg',
    'vintage-rack-temporary.jpg',
  ];

  for (const file of removed) {
    assert.equal(
      existsSync(`${rootPath}/src/assets/images/thrift-store/${file}`),
      false,
      `${file} devrait avoir été supprimé`,
    );
  }
});

test('chaque visuel du hero déclare sa source et son remplacement', () => {
  const slideCount = (
    thriftStoreSource.match(/satisfies ThriftStoreImage/g) ?? []
  ).length;
  const sourceNotes = (thriftStoreSource.match(/sourceNote:/g) ?? []).length;
  const replacementNotes = (
    thriftStoreSource.match(/replacementNote: sharedReplacementNote/g) ?? []
  ).length;

  assert.equal(slideCount, 3);
  assert.equal(sourceNotes, slideCount);
  assert.equal(replacementNotes, slideCount);
});

test('les informations pratiques relevées sont publiées', () => {
  assert.match(thriftStoreSource, /Au Coin de l’Entraide/);
  assert.match(
    thriftStoreSource,
    /mardis, mercredis et jeudis, de 13 h à 17 h/,
  );
  assert.match(thriftStoreSource, /25e Avenue/);
  assert.match(thriftStoreSource, /514 721-2842/);
});

test('la page est indexable par les moteurs de recherche', () => {
  assert.match(thriftStoreSource, /noIndex: false/);
});

test('les conditions de dons restent non publiées', () => {
  assert.match(
    thriftStoreSource,
    /donationConditions: \{\s*confirmed: false,\s*\}/,
  );
});

test('le hero de la friperie alterne avec le contrôleur partagé', () => {
  const hero = readFileSync(
    `${rootPath}/src/components/sections/thrift-store/InteractiveThriftHero.astro`,
    'utf8',
  );
  const homeHero = readFileSync(
    `${rootPath}/src/components/sections/home/HomeHero.astro`,
    'utf8',
  );

  for (const source of [hero, homeHero]) {
    assert.match(source, /initializeHeroSlideshow/);
    assert.match(source, /data-hero-slide/);
    assert.match(source, /data-hero-indicator/);
  }
});
