import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { normalizeSanityAboutPage } from '../src/lib/content/normalizeSanityAboutPage.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

// Doublure du repli local : `src/data/about.ts` importe deux images du dépôt,
// et `node --test` ne résout pas l'alias `@/`. Même convention que les autres
// suites de migration.
const localImage = {
  image: { src: '/hero.webp', width: 1600, height: 1067, format: 'webp' },
  alt: 'Vue extérieure du bâtiment',
};

const aboutPageData = {
  seo: { title: 'Notre paroisse', description: 'Locale.' },
  hero: {
    eyebrow: 'Notre histoire',
    title: 'Une paroisse au cœur de sa communauté',
    introduction: 'Introduction locale.',
    image: localImage,
  },
  introduction: {
    eyebrow: 'Bienvenue',
    accent: 'Ensemble',
    title: 'Un lieu de foi et de rencontre',
    paragraphs: ['Paragraphe local.'],
  },
  history: {
    eyebrow: 'Notre histoire',
    title: 'Histoire de la paroisse',
    introduction: 'Neuf repères.',
    illustrationDisclosure: 'Illustrations artistiques, pas des archives.',
    entries: Array.from({ length: 9 }, (_, index) => ({
      id: `repere-${index + 1}`,
      periodLabel: `Repère ${index + 1}`,
      title: `Titre ${index + 1}`,
      summary: 'Résumé local.',
      imageKind: 'ai-illustration',
      sourceLabel: 'Récit historique accepté de l’ancien site',
    })),
    epilogue: { title: 'Épilogue local', paragraphs: ['Texte.'] },
  },
  principles: {
    eyebrow: 'Ce qui nous rassemble',
    title: 'Foi, rencontre et solidarité',
    items: [{ title: 'Prière', description: 'Locale.', symbol: 'book' }],
  },
  architecture: {
    eyebrow: 'Le lieu',
    title: 'L’église et son architecture',
    paragraphs: ['Paragraphe local.'],
    features: [{ title: 'Bois, brique et béton', description: 'Locale.' }],
    image: localImage,
  },
  architects: {
    eyebrow: 'Conception',
    title: 'Les architectes',
    introduction: 'Attributions à valider.',
    profiles: [
      {
        name: 'Roger D’Astous',
        role: 'Architecte principal — attribution à confirmer',
        confirmationRequired: true,
      },
      {
        name: 'Jean-Paul Pothier',
        role: 'Rôle exact à confirmer',
        confirmationRequired: true,
      },
    ],
    validationCard: {
      eyebrow: 'Documentation',
      title: 'Une histoire à valider',
      text: 'À préciser avec la paroisse.',
    },
  },
  closing: {
    accent: 'Venez',
    title: 'Venez découvrir la paroisse',
    text: 'Texte local.',
    primaryCta: {
      label: 'Préparer une première visite',
      href: '/premiere-visite/',
    },
    secondaryCta: { label: 'Nous joindre', href: '/contact/' },
  },
};

const buildSources = () => ({
  src: 'https://cdn.sanity.io/repere-1920.webp',
  srcSet: 'https://cdn.sanity.io/repere-480.webp 480w',
});

const rawEntry = (overrides = {}) => ({
  _key: 'fondation-1959',
  periodLabel: '23 février 1959',
  title: 'Fondation de la paroisse',
  summary: 'La communauté est érigée en paroisse.',
  imageKind: 'ai-illustration',
  sourceLabel: 'Récit historique accepté de l’ancien site',
  ...overrides,
  image: {
    alt: 'Illustration artistique du document d’érection paroissiale',
    image: { asset: { _id: 'image-abc', metadata: { lqip: 'data:x' } } },
    ...overrides.image,
  },
});

const withEntries = (entries) =>
  normalizeSanityAboutPage(
    { history: { entries } },
    aboutPageData,
    buildSources,
  );

test('sans réponse Sanity, la page garde tout son contenu local', () => {
  const result = normalizeSanityAboutPage(null, aboutPageData, buildSources);

  assert.equal(result.hero.title, aboutPageData.hero.title);
  assert.equal(result.history.entries.length, 9);
  assert.equal(result.architects.profiles.length, 2);
});

test('le repli de la chronologie n’a aucune illustration', () => {
  const fallback = read('src/data/about.ts');

  // Les huit illustrations et la photographie de la plaque vivent maintenant
  // dans le Studio : plus aucun fichier de chronologie n'est importé ici.
  assert.doesNotMatch(fallback, /history-timeline\//);
  assert.doesNotMatch(fallback, /plaque-consecration/);
  // Les neuf repères, eux, gardent leurs textes.
  assert.equal((fallback.match(/periodLabel:/g) ?? []).length, 9);
});

test('un repère du Studio arrive avec son illustration', () => {
  const [entry] = withEntries([rawEntry()]).history.entries;

  assert.equal(entry.id, 'fondation-1959');
  assert.equal(entry.title, 'Fondation de la paroisse');
  assert.equal(entry.image.src, 'https://cdn.sanity.io/repere-1920.webp');
  assert.equal(
    entry.image.alt,
    'Illustration artistique du document d’érection paroissiale',
  );
});

test('un repère sans source éditoriale n’est pas publié', () => {
  const entries = withEntries([
    rawEntry(),
    rawEntry({ _key: 'sans-source', sourceLabel: '  ' }),
  ]).history.entries;

  assert.deepEqual(
    entries.map(({ id }) => id),
    ['fondation-1959'],
  );
});

test('une nature d’image inconnue retombe sur l’illustration artistique', () => {
  const [entry] = withEntries([rawEntry({ imageKind: 'photo-argentique' })])
    .history.entries;

  assert.equal(entry.imageKind, 'ai-illustration');
});

test('un repère sans fichier garde son texte et perd son cadre', () => {
  const [entry] = withEntries([rawEntry({ image: { image: null } })]).history
    .entries;

  assert.equal(entry.title, 'Fondation de la paroisse');
  assert.equal(entry.image, undefined);
});

test('une attribution non marquée reste affichée comme à confirmer', () => {
  const result = normalizeSanityAboutPage(
    {
      architects: {
        profiles: [{ name: 'Roger D’Astous', role: 'Architecte principal' }],
      },
    },
    aboutPageData,
    buildSources,
  );

  assert.equal(result.architects.profiles[0].confirmationRequired, true);
});

test('les adresses des boutons ne viennent jamais du Studio', () => {
  const result = normalizeSanityAboutPage(
    { closing: { primaryCtaLabel: 'Venir nous voir' } },
    aboutPageData,
    buildSources,
  );

  assert.equal(result.closing.primaryCta.label, 'Venir nous voir');
  assert.equal(result.closing.primaryCta.href, '/premiere-visite/');
});

test('les images du hero et de l’architecture restent des fichiers du dépôt', () => {
  const schema = read('studio/schemaTypes/documents/aboutPageType.ts');

  assert.doesNotMatch(schema, /name: 'image'.*\n.*type: 'eventImage'/);
  assert.match(schema, /L’image de fond est un fichier du site/);
});

test('la numérotation des repères suit la liste, elle n’est pas saisie', () => {
  const component = read(
    'src/components/sections/about/ImmersiveHistoryTimeline.astro',
  );
  const schema = read('studio/schemaTypes/objects/historyEntryType.ts');

  assert.match(component, /\(index \+ 1\)\.toString\(\)\.padStart\(2, '0'\)/);
  assert.doesNotMatch(schema, /stepNumber/);
});

test('le compte de repères annoncé aux lecteurs d’écran suit la liste', () => {
  const component = read(
    'src/components/sections/about/ImmersiveHistoryTimeline.astro',
  );

  assert.match(component, /history\.entries\.length/);
  assert.doesNotMatch(component, /aria-label="Neuf repères/);
});

test('une illustration ne peut pas se présenter comme une archive', () => {
  const schema = read('studio/schemaTypes/objects/historyEntryType.ts');

  assert.match(schema, /cocher aussi « générée par IA »/);
  assert.match(
    schema,
    /elle ne peut pas être présentée comme une photographie/,
  );
});

test('le seed de la page ne peut pas écraser une correction de la paroisse', () => {
  const seed = read('studio/scripts/seed-about-page.ts');

  assert.match(seed, /setIfMissing/);
  assert.doesNotMatch(seed, /client\.createOrReplace/);
});
