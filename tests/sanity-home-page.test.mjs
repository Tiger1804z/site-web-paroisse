import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { normalizeSanityHomePage } from '../src/lib/content/normalizeSanityHomePage.ts';
import { normalizeSanityHomeGallery } from '../src/lib/content/normalizeSanityHomeGallery.ts';
import { homePageData } from '../src/data/homePage.ts';

const GROUP_NAMES = {
  jeunes: 'Jeunes',
  chorale: 'Chorale',
  'dames-fils-notre-dame': 'Dames et Fils de Notre-Dame',
  marguilliers: 'Marguilliers',
};

const buildSources = () => ({
  src: 'https://cdn.sanity.io/image-1920.webp',
  srcSet: 'https://cdn.sanity.io/image-480.webp 480w',
});

const rawPhoto = (overrides = {}) => ({
  _key: 'photo-1',
  title: 'Les clochers',
  description: 'Vue extérieure.',
  rightsCleared: true,
  consentConfirmed: false,
  ...overrides,
  photo: {
    alt: 'Vue extérieure de l’église',
    credit: 'Photographie de la paroisse',
    containsRecognizablePeople: false,
    generatedByAi: false,
    image: { asset: { _id: 'image-abc', metadata: { lqip: 'data:x' } } },
    ...overrides.photo,
  },
});

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

test('sans réponse Sanity, l’accueil garde tous ses textes locaux', () => {
  assert.deepEqual(normalizeSanityHomePage(null, homePageData), homePageData);
});

test('un document vide ne vide pas la page', () => {
  const result = normalizeSanityHomePage({}, homePageData);

  assert.equal(
    result.hero.title ?? result.hero.titleLines[0],
    'Un lieu de foi,',
  );
  assert.equal(result.visit.title, 'Venez nous rencontrer');
  assert.equal(result.massPreview.eyebrow, 'Célébrations');
});

test('les textes saisis dans le Studio remplacent le repli', () => {
  const result = normalizeSanityHomePage(
    {
      hero: {
        script: 'Bienvenue à tous',
        titleLines: ['Une paroisse', 'ouverte'],
        introduction: 'Texte du Studio.',
        primaryCtaLabel: 'Nos horaires',
      },
      visit: { title: 'Passez nous voir' },
    },
    homePageData,
  );

  assert.equal(result.hero.script, 'Bienvenue à tous');
  assert.deepEqual(result.hero.titleLines, ['Une paroisse', 'ouverte']);
  assert.equal(result.hero.introduction, 'Texte du Studio.');
  assert.equal(result.hero.primaryCtaLabel, 'Nos horaires');
  // Non saisi dans le Studio : le repli tient encore la ligne.
  assert.equal(result.hero.secondaryCtaLabel, 'Découvrir la paroisse');
  assert.equal(result.visit.title, 'Passez nous voir');
});

test('un titre vidé de ses lignes retombe sur le repli', () => {
  const result = normalizeSanityHomePage(
    { hero: { titleLines: ['   ', null] } },
    homePageData,
  );

  assert.deepEqual(result.hero.titleLines, homePageData.hero.titleLines);
});

test('les lignes blanches d’un titre sont écartées', () => {
  const result = normalizeSanityHomePage(
    { welcome: { titleLines: ['Une communauté', '  ', 'accueillante'] } },
    homePageData,
  );

  assert.deepEqual(result.welcome.titleLines, [
    'Une communauté',
    'accueillante',
  ]);
});

test('une citation sans source n’est pas publiée', () => {
  const result = normalizeSanityHomePage(
    { welcome: { quote: { text: '« Une parole sans auteur. »' } } },
    homePageData,
  );

  assert.deepEqual(result.welcome.quote, homePageData.welcome.quote);
});

test('une citation complète remplace celle du repli', () => {
  const result = normalizeSanityHomePage(
    {
      welcome: {
        quote: {
          text: '« Aimez-vous les uns les autres. »',
          attribution: 'Jean 13,34',
        },
      },
    },
    homePageData,
  );

  assert.deepEqual(result.welcome.quote, {
    text: '« Aimez-vous les uns les autres. »',
    attribution: 'Jean 13,34',
  });
});

test('l’accueil ne recopie aucune coordonnée ni aucune adresse de bouton', () => {
  const schema = read('studio/schemaTypes/documents/homePageType.ts');

  // Les coordonnées viennent de siteSettings, les heures de massSchedule, et
  // les routes du code. Un champ saisissable ici créerait une seconde vérité.
  assert.doesNotMatch(schema, /name: 'address'/);
  assert.doesNotMatch(schema, /name: 'phone'/);
  assert.doesNotMatch(schema, /type: 'url'/);
  assert.doesNotMatch(schema, /Href'/);
});

test('le texte d’attente des horaires reste dans le code', () => {
  const component = read(
    'src/components/sections/home/MassSchedulePreview.astro',
  );

  assert.match(component, /EMPTY_SCHEDULE_INTRODUCTION/);
  assert.match(component, /Les horaires réguliers seront publiés/);
});

test('les titres de l’accueil se composent par lignes, jamais par du HTML saisi', () => {
  const hero = read('src/components/sections/home/HomeHero.astro');
  const welcome = read('src/components/sections/home/WelcomeSection.astro');

  for (const component of [hero, welcome]) {
    assert.match(component, /titleLines\.map/);
    assert.doesNotMatch(component, /set:html=\{content/);
  }
});

test('le nom d’un groupe vient de la page Vie paroissiale, pas de l’accueil', () => {
  const result = normalizeSanityHomePage(
    {
      parishLife: {
        groups: [{ group: 'chorale', teaser: 'Chant liturgique' }],
      },
    },
    homePageData,
    { ...GROUP_NAMES, chorale: 'Chorale paroissiale' },
  );

  assert.deepEqual(result.parishLife.groups, [
    { id: 'chorale', name: 'Chorale paroissiale', teaser: 'Chant liturgique' },
  ]);
});

test('un groupe absent de la page Vie paroissiale disparaît de l’accueil', () => {
  const result = normalizeSanityHomePage(
    {
      parishLife: {
        groups: [
          { group: 'chorale', teaser: 'Chant liturgique' },
          { group: 'groupe-supprime', teaser: 'Ligne orpheline' },
        ],
      },
    },
    homePageData,
    GROUP_NAMES,
  );

  assert.deepEqual(
    result.parishLife.groups.map(({ id }) => id),
    ['chorale'],
  );
});

test('le repli des groupes est filtré par les groupes encore actifs', () => {
  const result = normalizeSanityHomePage({}, homePageData, {
    jeunes: 'Jeunes',
  });

  assert.deepEqual(
    result.parishLife.groups.map(({ id }) => id),
    ['jeunes'],
  );
});

test('un raccourci vers une destination inconnue est écarté', () => {
  const result = normalizeSanityHomePage(
    {
      services: {
        links: [
          { label: 'Location de salle', target: 'location-de-salle' },
          { label: 'Ailleurs', target: 'page-qui-nexiste-pas' },
          { label: 'Sans destination' },
        ],
      },
    },
    homePageData,
    GROUP_NAMES,
  );

  assert.deepEqual(result.services.links, [
    {
      label: 'Location de salle',
      target: 'location-de-salle',
      href: '/nos-services/#location-de-salle',
    },
  ]);
});

test('deux raccourcis peuvent viser la même section', () => {
  const result = normalizeSanityHomePage(
    {
      services: {
        links: [
          { label: 'Mariage', target: 'sacrements-et-initiation' },
          { label: 'Baptême', target: 'sacrements-et-initiation' },
        ],
      },
    },
    homePageData,
    GROUP_NAMES,
  );

  assert.equal(result.services.links.length, 2);
  assert.equal(
    result.services.links[1].href,
    '/nos-services/#sacrements-et-initiation',
  );
});

test('la galerie n’a aucun repli local', () => {
  const result = normalizeSanityHomePage({}, homePageData, GROUP_NAMES);

  assert.deepEqual(result.gallery.items, []);
});

test('une photographie du Studio devient une candidate rendue', () => {
  const [candidate] = normalizeSanityHomeGallery([rawPhoto()], buildSources);

  assert.equal(candidate.item.id, 'photo-1');
  assert.equal(candidate.item.title, 'Les clochers');
  assert.equal(candidate.item.image.alt, 'Vue extérieure de l’église');
  assert.equal(candidate.item.image.credit, 'Photographie de la paroisse');
  assert.equal(candidate.rightsCleared, true);
});

test('une photographie sans titre ou sans fichier n’est pas candidate', () => {
  assert.equal(
    normalizeSanityHomeGallery([rawPhoto({ title: '  ' })], buildSources)
      .length,
    0,
  );

  assert.equal(
    normalizeSanityHomeGallery(
      [rawPhoto({ photo: { image: null } })],
      buildSources,
    ).length,
    0,
  );
});

test('un drapeau absent ne vaut jamais « oui »', () => {
  const [candidate] = normalizeSanityHomeGallery(
    [rawPhoto({ rightsCleared: undefined, consentConfirmed: undefined })],
    buildSources,
  );

  assert.equal(candidate.rightsCleared, false);
  assert.equal(candidate.consentConfirmed, false);
});

test('le seed de l’accueil ne peut pas effacer les réglages des activités', () => {
  const seed = read('studio/scripts/seed-home-page.ts');

  assert.match(seed, /setIfMissing/);
  // L'appel, pas le mot : le commentaire d'en-tête explique justement pourquoi
  // `createOrReplace` est écarté ici.
  assert.doesNotMatch(seed, /client\.createOrReplace/);
});
