import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { normalizeSanitySeo } from '../src/lib/content/normalizeSanitySeo.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

// Doublure du constructeur d'adresses : le vrai lit `import.meta.env`, absent
// sous `node --test`.
const buildSources = () => ({
  src: 'https://cdn.example/partage.jpg',
  srcSet: 'https://cdn.example/partage.jpg 1200w',
});

const fallback = {
  title: 'Titre local',
  description: 'Description locale.',
  canonicalPath: '/exemple/',
  noIndex: true,
};

/** Image de partage telle que la projection GROQ la remonte. */
const uploaded = {
  alt: 'Vue extérieure de l’église',
  image: {
    asset: {
      _id: 'image-abc-1200x630-jpg',
      metadata: { dimensions: { width: 1200, height: 630 } },
    },
  },
};

test('le titre et la description de Sanity remplacent le repli', () => {
  const seo = normalizeSanitySeo(
    { title: 'Titre Sanity', description: 'Description Sanity.' },
    fallback,
  );

  assert.equal(seo.title, 'Titre Sanity');
  assert.equal(seo.description, 'Description Sanity.');
});

test('une valeur vide ou blanche retombe sur le repli', () => {
  const seo = normalizeSanitySeo({ title: '   ', description: '' }, fallback);

  assert.equal(seo.title, 'Titre local');
  assert.equal(seo.description, 'Description locale.');
});

test('un document absent donne exactement le repli', () => {
  assert.deepEqual(normalizeSanitySeo(null, fallback), fallback);
});

test('canonicalPath et noIndex traversent : Sanity ne peut pas les toucher', () => {
  const seo = normalizeSanitySeo(
    // Champs homonymes injectés dans le document : ils n'existent pas au schéma,
    // et rien ne doit les lire même s'ils apparaissaient un jour.
    { title: 'Titre Sanity', canonicalPath: '/pirate/', noIndex: false },
    fallback,
  );

  assert.equal(seo.canonicalPath, '/exemple/');
  assert.equal(seo.noIndex, true);
});

test('l’image de partage est composée quand un constructeur est fourni', () => {
  const seo = normalizeSanitySeo(
    { title: 'Titre', description: 'Description.', image: uploaded },
    fallback,
    buildSources,
  );

  assert.equal(seo.shareImage?.src, 'https://cdn.example/partage.jpg');
  assert.equal(seo.shareImage?.alt, 'Vue extérieure de l’église');
  assert.equal(seo.shareImage?.width, 1200);
});

test('sans constructeur, l’image est absente plutôt que fausse', () => {
  const seo = normalizeSanitySeo({ title: 'Titre', image: uploaded }, fallback);

  assert.equal(seo.shareImage, undefined);
});

test('une image sans texte alternatif n’est pas publiée', () => {
  const seo = normalizeSanitySeo(
    {
      title: 'Titre',
      image: { image: { asset: { _id: 'image-abc-1200x630-jpg' } } },
    },
    fallback,
    buildSources,
  );

  assert.equal(seo.shareImage, undefined);
});

/**
 * Les deux tests suivants ne contrôlent pas un comportement mais un câblage.
 *
 * L'audit du 31 juillet a trouvé un champ au schéma complet, jamais projeté et
 * jamais rendu, pendant que les tests unitaires étaient verts : un référencement
 * oublié sur une page se lirait exactement pareil — description correcte en
 * local, invisible depuis le Studio. Une lecture de la source est le seul moyen
 * de détecter cette panne-là.
 */

const PAGE_QUERIES = [
  'HOME_PAGE_QUERY',
  'SCHEDULE_PAGE_QUERY',
  'EVENTS_PAGE_QUERY',
  'THRIFT_STORE_PAGE_QUERY',
  'SERVICES_PAGE_QUERY',
  'PARISH_LIFE_PAGE_QUERY',
  'FIRST_VISIT_PAGE_QUERY',
  'ADVERTISERS_PAGE_QUERY',
  'CONTACT_PAGE_QUERY',
  'ABOUT_PAGE_QUERY',
];

const PAGE_NORMALIZERS = [
  'normalizeSanityHomePage',
  'normalizeSanitySchedulePage',
  'normalizeSanityEventsPage',
  'normalizeSanityThriftStore',
  'normalizeSanityServicesPage',
  'normalizeSanityParishLifePage',
  'normalizeSanityFirstVisitPage',
  'normalizeSanityAdvertisersPage',
  'normalizeSanityContactPage',
  'normalizeSanityAboutPage',
];

test('les dix requêtes de page projettent le bloc de référencement', () => {
  const source = read('src/lib/sanity/queries.ts');

  for (const name of PAGE_QUERIES) {
    const start = source.indexOf(`export const ${name} =`);
    assert.notEqual(start, -1, `${name} introuvable`);

    const next = source.indexOf('export const ', start + 1);
    const body = source.slice(start, next === -1 ? undefined : next);

    assert.ok(
      body.includes('seo {'),
      `${name} ne projette pas \`seo\` : la page ne pourra jamais lire ce que le Studio affiche.`,
    );
  }
});

test('les dix normalizers de page lisent le bloc de référencement', () => {
  for (const name of PAGE_NORMALIZERS) {
    const source = read(`src/lib/content/${name}.ts`);

    assert.ok(
      source.includes('normalizeSanitySeo('),
      `${name} n’appelle pas normalizeSanitySeo : sa page reste sur le repli local.`,
    );
  }
});

test('les coordonnées de la paroisse projettent l’image de partage globale', () => {
  const source = read('src/lib/sanity/queries.ts');
  const start = source.indexOf('export const SITE_SETTINGS_QUERY =');
  const next = source.indexOf('export const ', start + 1);
  const body = source.slice(start, next);

  assert.ok(body.includes('shareImage {'));
});
