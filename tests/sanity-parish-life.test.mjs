import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { normalizeSanityParishLifePage } from '../src/lib/content/normalizeSanityParishLifePage.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

// Doublure du constructeur d'adresses : le vrai lit `import.meta.env`, absent
// sous `node --test`.
const buildSources = () => ({
  src: 'https://cdn.example/img.jpg',
  srcSet: 'https://cdn.example/img.jpg 480w',
});

const localVisual = (src) => ({
  kind: 'image',
  image: { src, width: 1600, height: 1067, format: 'jpg' },
  alt: 'Autel fleuri',
  desktopPosition: 'center 52%',
  mobilePosition: 'center 52%',
});

/** Image telle que la projection GROQ la remonte. */
const uploaded = (alt) => ({
  alt,
  credit: 'Photographie prise dans l’église Saint-René-Goupil',
  image: {
    hotspot: { x: 0.4, y: 0.6 },
    asset: {
      _id: 'image-abc-3468x4624-jpg',
      metadata: {
        lqip: 'data:image/jpeg;base64,xxx',
        dimensions: { width: 3468, height: 4624 },
      },
    },
  },
});

// `src/data/parishLife.ts` importe des images et ne peut pas être chargé par
// Node : on reconstruit ici la forme attendue du normalizer.
const fallback = {
  seo: { title: 'Vie paroissiale', description: 'Description locale.' },
  hero: {
    eyebrow: 'Communauté',
    title: 'Vivre la paroisse',
    introduction: 'Introduction locale.',
    images: [
      {
        kind: 'image',
        image: { src: '/hero.jpg', width: 1600, height: 900, format: 'jpg' },
        alt: 'Illustration',
        label: 'Une communauté rassemblée',
        documentary: false,
        generationStatus: 'ai-generated',
        credit: 'Image générée par IA.',
      },
    ],
  },
  introduction: {
    eyebrow: 'Vie communautaire',
    title: 'Une paroisse, plusieurs visages',
    paragraphs: ['Paragraphe local.'],
    confirmationNote: 'Note locale.',
  },
  features: [
    {
      id: 'jeunes',
      eyebrow: 'Groupe',
      title: 'Jeunes',
      summary: 'Résumé local.',
      highlights: ['Activités à confirmer'],
      visual: localVisual('/jeunes.jpg'),
      cta: { label: 'Demander de l’information', href: '/contact/' },
      active: true,
    },
    {
      id: 'chorale',
      eyebrow: 'Groupe',
      title: 'Chorale',
      summary: 'Résumé local.',
      highlights: [],
      visual: localVisual('/chorale.jpg'),
      cta: { label: 'Demander de l’information', href: '/contact/' },
      active: true,
    },
  ],
  participation: {
    accent: 'Ensemble',
    title: 'Vous souhaitez vous impliquer?',
    description: 'Description locale.',
    cta: { label: 'Communiquer avec la paroisse', href: '/contact/' },
  },
};

const sanityFeature = {
  slug: 'chorale',
  eyebrow: 'Groupe',
  title: 'Chorale — version Sanity',
  summary: 'Résumé Sanity.',
  highlights: ['Pratique le jeudi', '  '],
  ctaLabel: 'Nous écrire',
  active: true,
  visual: uploaded('Vue large de la nef'),
};

const normalize = (raw) =>
  normalizeSanityParishLifePage(raw, fallback, buildSources);

test('sans document Sanity, la page reste identique au repli local', () => {
  assert.deepEqual(normalize(null), fallback);
});

test('le contenu Sanity remplace le contenu local', () => {
  const result = normalize({
    hero: { title: 'Titre Sanity' },
    introduction: { paragraphs: ['Paragraphe Sanity.'] },
    features: [sanityFeature],
  });

  assert.equal(result.hero.title, 'Titre Sanity');
  assert.deepEqual(result.introduction.paragraphs, ['Paragraphe Sanity.']);
  assert.equal(result.features.length, 1);
  assert.equal(result.features[0].title, 'Chorale — version Sanity');
  // La ligne vide du tableau est écartée.
  assert.deepEqual(result.features[0].highlights, ['Pratique le jeudi']);
});

test('l’image téléversée l’emporte sur le fichier du projet', () => {
  const result = normalize({ features: [sanityFeature] });
  const { visual } = result.features[0];

  assert.equal(visual.kind, 'remote-image');
  assert.equal(visual.image.src, 'https://cdn.example/img.jpg');
  assert.equal(visual.image.alt, 'Vue large de la nef');
  // Le point focal du Studio arrive jusqu'au contrat : c'est lui qui remplace
  // les positions de recadrage écrites à la main.
  assert.deepEqual(visual.image.focalPoint, { x: 0.4, y: 0.6 });
  assert.equal(visual.image.lqip, 'data:image/jpeg;base64,xxx');
});

test('sans image téléversée, le fichier du projet reprend la main', () => {
  const result = normalize({
    features: [{ ...sanityFeature, visual: undefined }],
  });

  assert.deepEqual(result.features[0].visual, fallback.features[1].visual);
});

test('une image sans texte alternatif n’est pas publiée', () => {
  const result = normalize({
    features: [
      {
        ...sanityFeature,
        slug: 'groupe-inconnu',
        visual: { ...uploaded('   ') },
      },
    ],
  });

  // Ni image utilisable, ni repli local pour cette ancre : le groupe disparaît,
  // et la page retombe entièrement sur le repli.
  assert.deepEqual(result.features, fallback.features);
});

test('un groupe sans visuel d’aucun côté n’est pas publié', () => {
  const result = normalize({
    features: [{ ...sanityFeature, slug: 'groupe-inconnu', visual: undefined }],
  });

  assert.deepEqual(result.features, fallback.features);
});

test('les images d’en-tête ne se mélangent pas', () => {
  const result = normalize({
    hero: {
      slides: [
        { label: 'Une communauté', visual: uploaded('Illustration') },
        // Sans libellé : écartée.
        { visual: uploaded('Autre illustration') },
      ],
    },
  });

  assert.equal(result.hero.images.length, 1);
  assert.equal(result.hero.images[0].kind, 'remote-image');
  assert.equal(result.hero.images[0].label, 'Une communauté');
});

test('un en-tête sans image utilisable retombe sur les fichiers du projet', () => {
  const result = normalize({ hero: { slides: [{ label: 'Sans fichier' }] } });

  assert.deepEqual(result.hero.images, fallback.hero.images);
  assert.equal(result.hero.images[0].kind, 'image');
});

test('l’adresse des boutons ne vient jamais de Sanity', () => {
  const result = normalize({
    features: [sanityFeature],
    participation: { ctaLabel: 'Nous joindre' },
  });

  // Le libellé se saisit, l’adresse non.
  assert.equal(result.features[0].cta.label, 'Nous écrire');
  assert.equal(result.features[0].cta.href, '/contact/');
  assert.equal(result.participation.cta.label, 'Nous joindre');
  assert.equal(result.participation.cta.href, '/contact/');

  const schema = read('studio/schemaTypes/objects/parishGroupType.ts');
  assert.doesNotMatch(schema, /name: '(href|url|link)'/);
});

test('un groupe masqué garde son drapeau, il n’est pas supprimé', () => {
  const result = normalize({
    features: [{ ...sanityFeature, active: false }],
  });

  assert.equal(result.features[0].active, false);
});

test('les champs que rien n’affiche ne sont pas recréés dans le Studio', () => {
  const schemas = [
    read('studio/schemaTypes/documents/parishLifePageType.ts'),
    read('studio/schemaTypes/objects/parishGroupType.ts'),
  ].join('\n');

  for (const dead of ['status', 'order']) {
    assert.doesNotMatch(
      schemas,
      new RegExp(`name: '${dead}'`),
      `${dead} n’est rendu par aucun composant de cette page`,
    );
  }

  const contract = read('src/types/parishLife.ts');
  assert.doesNotMatch(contract, /ParishLifeContentStatus/);
  assert.doesNotMatch(contract, /readonly order/);
});

test('une image téléversée doit déclarer ses droits et son origine', () => {
  // Sans ces champs, personne ne saura dans deux ans si on avait le droit de
  // publier l’image, ni si elle montre un lieu réel.
  const imageSchema = read('studio/schemaTypes/objects/eventImageType.ts');

  for (const field of [
    'alt',
    'credit',
    'rightsNote',
    'containsRecognizablePeople',
    'generatedByAi',
  ]) {
    assert.match(imageSchema, new RegExp(`name: '${field}'`));
  }

  // Le texte alternatif reste exigible dès qu’un fichier est déposé.
  assert.match(imageSchema, /Ajouter un texte alternatif/);
});
