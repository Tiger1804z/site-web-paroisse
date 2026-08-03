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

test('le repli local ne porte plus aucune image', () => {
  // Les visuels de la friperie vivent dans le Studio depuis la migration des
  // images éditoriales. Un repli qui en garderait une copie ferait diverger
  // deux vérités, et la paroisse ne pourrait pas la remplacer elle-même.
  assert.ok(!thriftStoreSource.includes('@/assets/images'));
  assert.ok(thriftStoreSource.includes('slides: []'));
});

test('aucun cadre « photographie prévue » n’est imposé par le code', () => {
  // Six cadres vides annonçaient un chantier sur une page publique et
  // indexable. La galerie n'existe désormais que si le Studio la remplit.
  assert.doesNotMatch(thriftStoreSource, /placeholder/i);
  assert.equal(
    existsSync(
      `${rootPath}/src/components/sections/thrift-store/ThriftStorePhotoPlaceholder.astro`,
    ),
    false,
  );
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
  // La paroisse ne les a jamais publiées. Depuis la migration Sanity, la
  // garantie ne tient plus à un champ « non confirmé » : ni le repli local ni
  // le Studio ne proposent d'endroit où en inventer, et la page dit clairement
  // qu'il faut téléphoner avant d'apporter des articles.
  assert.doesNotMatch(thriftStoreSource, /donationConditions/);

  const thriftStoreSchema = readFileSync(
    `${rootPath}/studio/schemaTypes/documents/thriftStoreType.ts`,
    'utf8',
  );
  assert.doesNotMatch(thriftStoreSchema, /donationConditions/);

  assert.match(
    thriftStoreSource,
    /Les conditions de don .* ne sont pas encore publiées/,
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
