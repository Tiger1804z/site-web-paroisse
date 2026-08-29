import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import {
  LINK_TARGETS,
  normalizeSanityFirstVisitPage,
} from '../src/lib/content/normalizeSanityFirstVisitPage.ts';
import { resolvePracticalInformation } from '../src/lib/content/resolvePracticalInformation.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

// Doublure du constructeur d'adresses : le vrai lit `import.meta.env`, absent
// sous `node --test`.
const buildSources = () => ({
  src: 'https://cdn.example/img.jpg',
  srcSet: 'https://cdn.example/img.jpg 480w',
});

/** Image telle que la projection GROQ la remonte. */
const uploaded = {
  alt: 'Vue extérieure de l’église',
  credit: '',
  image: {
    hotspot: { x: 0.58, y: 0.5 },
    asset: {
      _id: 'image-abc-3468x4624-jpg',
      metadata: {
        lqip: 'data:image/jpeg;base64,xxx',
        dimensions: { width: 3468, height: 4624 },
      },
    },
  },
};

// `src/data/firstVisit.ts` importe une image et ne peut pas être chargé par
// Node : on reconstruit ici la forme attendue du normalizer.
const fallback = {
  seo: { title: 'Première visite', description: 'Description locale.' },
  hero: {
    eyebrow: 'Bienvenue',
    title: 'Votre première visite',
    introduction: 'Introduction locale.',
  },
  preparation: {
    eyebrow: 'Guide pratique',
    title: 'Avant votre visite',
    introduction: 'Introduction locale.',
    steps: [
      {
        id: 'verifier-horaire',
        numberLabel: '01',
        title: 'Vérifier l’horaire',
        description: 'Description locale.',
      },
    ],
  },
  expectations: {
    eyebrow: 'La célébration',
    title: 'À quoi s’attendre pendant une messe',
    introduction: 'Introduction locale.',
    items: [
      {
        id: 'accueil',
        title: 'Accueil et ouverture',
        description: 'Description locale.',
      },
    ],
  },
  practicalInformation: {
    eyebrow: 'Nous trouver',
    title: 'Informations pratiques',
    items: [{ id: 'adresse', label: 'Adresse', source: 'address' }],
    primaryCta: { label: 'Voir les horaires', href: '/horaires/' },
    secondaryCta: { label: 'Nous joindre', href: '/contact/' },
    image: {
      kind: 'image',
      image: { src: '/arrivee.webp', width: 1600, height: 900, format: 'webp' },
      alt: 'Vue extérieure',
      caption: 'Légende locale.',
      desktopPosition: 'center center',
      mobilePosition: '58% center',
    },
  },
  faq: {
    title: 'Questions fréquentes',
    items: [
      {
        id: 'tenue',
        question: 'Comment m’habiller?',
        answer: 'Réponse locale.',
      },
    ],
  },
};

/** Coordonnées complètes, telles que `getSiteSettings()` les renvoie. */
const contact = {
  organizationName: 'Paroisse Saint-René-Goupil',
  address: {
    street: '4251 Rue Parc René-Goupil',
    city: 'Montréal',
    province: 'Québec',
    postalCode: 'H1Z 1X8',
    country: 'Canada',
    formatted: '4251 Rue Parc René-Goupil, Montréal, Québec H1Z 1X8',
  },
  phone: {
    display: '514 722-1161',
    international: '+1 514 722-1161',
    e164: '+15147221161',
  },
  directionsUrl: 'https://example.test/itineraire',
  map: { latitude: 0, longitude: 0, embedUrl: '', title: '' },
};

test('le repli local sert quand le document est absent', () => {
  const page = normalizeSanityFirstVisitPage(null, fallback, buildSources);

  assert.equal(page.hero.title, 'Votre première visite');
  assert.equal(page.preparation.steps.length, 1);
  assert.equal(page.practicalInformation.image?.kind, 'image');
});

test('le contenu Sanity remplace le repli', () => {
  const page = normalizeSanityFirstVisitPage(
    {
      hero: {
        eyebrow: 'Accueil',
        title: 'Venir une première fois',
        introduction: 'Introduction Sanity.',
      },
      preparation: {
        title: 'Se préparer',
        steps: [
          {
            _key: 'k1',
            numberLabel: '01',
            title: 'Étape Sanity',
            description: 'Description Sanity.',
            note: 'Note Sanity.',
          },
        ],
      },
    },
    fallback,
    buildSources,
  );

  assert.equal(page.hero.title, 'Venir une première fois');
  assert.equal(page.preparation.steps[0].id, 'k1');
  assert.equal(page.preparation.steps[0].note, 'Note Sanity.');
  // Le surtitre absent du document retombe sur le repli.
  assert.equal(page.preparation.eyebrow, 'Guide pratique');
});

test('une étape sans titre ni description est écartée', () => {
  const page = normalizeSanityFirstVisitPage(
    {
      preparation: {
        steps: [
          {
            _key: 'k1',
            numberLabel: '01',
            title: 'Complète',
            description: 'Oui',
          },
          { _key: 'k2', numberLabel: '02', title: 'Sans description' },
        ],
      },
    },
    fallback,
    buildSources,
  );

  assert.equal(page.preparation.steps.length, 1);
  assert.equal(page.preparation.steps[0].id, 'k1');
});

test('un numéro manquant se replie sur le rang', () => {
  const page = normalizeSanityFirstVisitPage(
    {
      preparation: {
        steps: [
          { _key: 'k1', title: 'Une', description: 'Oui' },
          { _key: 'k2', title: 'Deux', description: 'Oui' },
        ],
      },
    },
    fallback,
    buildSources,
  );

  assert.equal(page.preparation.steps[0].numberLabel, '01');
  assert.equal(page.preparation.steps[1].numberLabel, '02');
});

test('l’image téléversée remplace le fichier du projet', () => {
  const page = normalizeSanityFirstVisitPage(
    {
      practicalInformation: {
        image: uploaded,
        imageCaption: 'Légende Sanity.',
      },
    },
    fallback,
    buildSources,
  );

  const visual = page.practicalInformation.image;
  assert.equal(visual?.kind, 'remote-image');
  assert.equal(visual.image.src, 'https://cdn.example/img.jpg');
  assert.equal(visual.caption, 'Légende Sanity.');
});

test('sans image téléversée, le fichier du projet garde la main', () => {
  const page = normalizeSanityFirstVisitPage(
    { practicalInformation: { title: 'Informations' } },
    fallback,
    buildSources,
  );

  assert.equal(page.practicalInformation.image?.kind, 'image');
});

test('les boutons ne prennent leur adresse que dans la liste fermée', () => {
  const page = normalizeSanityFirstVisitPage(
    {
      practicalInformation: {
        primaryCtaLabel: 'Voir les services',
        primaryCtaTarget: 'services',
        secondaryCtaLabel: 'Ailleurs',
        secondaryCtaTarget: 'https://exemple.test/malveillant',
      },
    },
    fallback,
    buildSources,
  );

  assert.equal(page.practicalInformation.primaryCta.href, '/nos-services/');
  // Destination inconnue : on retombe sur le repli, jamais sur la valeur saisie.
  assert.equal(page.practicalInformation.secondaryCta?.href, '/contact/');
});

test('la liste des destinations reste fermée', () => {
  assert.deepEqual(Object.keys(LINK_TARGETS).toSorted(), [
    'contact',
    'schedule',
    'services',
  ]);
});

test('une ligne dont la source est inconnue est écartée', () => {
  const page = normalizeSanityFirstVisitPage(
    {
      practicalInformation: {
        items: [
          { _key: 'a', label: 'Adresse', source: 'address' },
          { _key: 'b', label: 'Mystère', source: 'inventee' },
        ],
      },
    },
    fallback,
    buildSources,
  );

  assert.equal(page.practicalInformation.items.length, 1);
  assert.equal(page.practicalInformation.items[0].source, 'address');
});

test('les lignes partagées se résolvent contre les coordonnées', () => {
  const resolved = resolvePracticalInformation(
    {
      ...fallback.practicalInformation,
      items: [
        { id: 'adresse', label: 'Adresse', source: 'address' },
        { id: 'telephone', label: 'Téléphone', source: 'phone' },
      ],
    },
    { ...contact, parkingLabel: undefined, accessibilityLabel: undefined },
  );

  assert.deepEqual(
    resolved.items.map((item) => item.value),
    ['4251 Rue Parc René-Goupil, Montréal, Québec H1Z 1X8', '514 722-1161'],
  );
});

test('une ligne dont la valeur partagée est absente n’est pas affichée', () => {
  const resolved = resolvePracticalInformation(
    {
      ...fallback.practicalInformation,
      items: [
        { id: 'adresse', label: 'Adresse', source: 'address' },
        { id: 'stationnement', label: 'Stationnement', source: 'parking' },
        {
          id: 'accessibilite',
          label: 'Accessibilité',
          source: 'accessibility',
        },
        { id: 'entree', label: 'Entrée', source: 'pageText' },
      ],
    },
    contact,
  );

  assert.deepEqual(
    resolved.items.map((item) => item.id),
    ['adresse'],
  );
});

test('une ligne partagée réapparaît dès que la valeur est saisie', () => {
  const resolved = resolvePracticalInformation(
    {
      ...fallback.practicalInformation,
      items: [
        { id: 'stationnement', label: 'Stationnement', source: 'parking' },
      ],
    },
    { ...contact, parkingLabel: 'Stationnement gratuit derrière l’église.' },
  );

  assert.equal(resolved.items.length, 1);
  assert.equal(
    resolved.items[0].value,
    'Stationnement gratuit derrière l’église.',
  );
});

test('un lien interne prend son adresse dans la liste fermée', () => {
  const resolved = resolvePracticalInformation(
    {
      ...fallback.practicalInformation,
      items: [
        {
          id: 'horaires',
          label: 'Horaires',
          source: 'internalLink',
          linkLabel: 'Consulter la page Horaires',
          linkTarget: 'schedule',
        },
        {
          id: 'ailleurs',
          label: 'Ailleurs',
          source: 'internalLink',
          linkLabel: 'Suivre',
          linkTarget: 'https://exemple.test/malveillant',
        },
      ],
    },
    contact,
  );

  assert.equal(resolved.items.length, 1);
  assert.equal(resolved.items[0].href, '/horaires/');
});

test('aucune adresse ni téléphone ne reste écrit dans le repli de la page', () => {
  const source = read('src/data/firstVisit.ts');

  assert.ok(
    !source.includes('514 722-1161'),
    'Le téléphone appartient aux coordonnées de la paroisse, pas à la page.',
  );
  assert.ok(
    !source.includes('4251 Rue Parc'),
    'L’adresse appartient aux coordonnées de la paroisse, pas à la page.',
  );
});

test('les champs morts ne sont pas réapparus dans le contrat', () => {
  const source = read('src/types/firstVisit.ts');

  for (const dead of [
    'FirstVisitContentStatus',
    'confirmationRequired',
    'futureSource',
  ]) {
    assert.ok(
      !source.includes(dead),
      `${dead} avait 0 rendu : il ne doit pas revenir.`,
    );
  }
});

test('les coordonnées projettent le stationnement et l’accessibilité', () => {
  const source = read('src/lib/sanity/queries.ts');

  assert.ok(source.includes('parkingInformation'));
  assert.ok(source.includes('accessibilityInformation'));
});
