import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeSanityThriftStoreInformation,
  normalizeSanityThriftStorePage,
} from '../src/lib/content/normalizeSanityThriftStore.ts';

// Repli minimal. `src/data/thriftStore.ts` importe des images et ne peut pas
// être chargé par Node : on reconstruit ici la forme attendue du normalizer.
const fallback = {
  seo: {
    title: 'Friperie locale',
    description: 'Description locale.',
    canonicalPath: '/friperie/',
    noIndex: false,
  },
  hero: {
    eyebrow: 'Friperie paroissiale',
    title: 'Au Coin de l’Entraide',
    introduction: 'Introduction locale.',
    slides: [],
  },
  introduction: {
    eyebrow: 'Notre friperie',
    title: 'Présentation',
    paragraphs: ['Paragraphe local.'],
    priceNotice: 'Note de prix locale.',
  },
  practicalInformation: {
    hours: 'Mardi, mercredi et jeudi, de 13 h à 17 h',
    location: 'Sous-sol de l’église',
    phone: '514 721-2842',
    contactCta: { label: 'Communiquer avec la paroisse', href: '/contact/' },
  },
  sections: [
    {
      id: 'seconde-vie',
      eyebrow: 'Réemploi et entraide',
      title: 'Une seconde vie pour les vêtements',
      description: 'Description locale.',
      active: true,
      visualKind: 'clothing-rack',
    },
  ],
  gallery: {
    eyebrow: 'À documenter',
    title: 'La friperie en images',
    introduction: 'Introduction locale de galerie.',
    items: [],
  },
  closing: {
    eyebrow: 'Avant d’apporter des articles',
    title: 'Obtenir les renseignements à jour',
    description: 'Description locale de clôture.',
    primaryCta: { label: 'Communiquer avec la paroisse', href: '/contact/' },
    secondaryCta: { label: 'Voir les événements', href: '/evenements/' },
  },
};

// Doublure du constructeur d'adresses : le vrai lit `import.meta.env`, absent
// sous `node --test`.
const buildSources = () => ({
  src: 'https://cdn.test/image?w=1920',
  srcSet: 'https://cdn.test/image?w=480 480w',
});

/** Image telle que la projection GROQ la remonte. */
const rawImage = (alt, extra = {}) => ({
  alt,
  ...extra,
  image: {
    asset: {
      _id: 'image-abc-1200x900-jpg',
      metadata: {
        lqip: 'data:image/png;base64,x',
        dimensions: { width: 1200, height: 900 },
      },
    },
  },
});

const rawStore = {
  name: 'Au Coin de l’Entraide',
  hours: 'Tous les mardis, mercredis et jeudis, de 13 h à 17 h',
  location: 'Sous-sol de l’église — entrée par la 25e Avenue',
  phone: '514 721-2842',
};

test('sans document Sanity, la page garde le repli local', () => {
  const page = normalizeSanityThriftStorePage(
    null,
    null,
    fallback,
    buildSources,
  );

  assert.deepEqual(page, fallback);
});

test('le contenu de page Sanity remplace le repli, champ par champ', () => {
  const page = normalizeSanityThriftStorePage(
    {
      hero: {
        eyebrow: 'Friperie',
        title: 'Titre Sanity',
        introduction: 'Introduction Sanity.',
      },
      introduction: {
        eyebrow: null,
        title: 'Présentation Sanity',
        paragraphs: ['Premier paragraphe.', 'Second paragraphe.'],
        priceNotice: 'Note Sanity.',
        contactCta: null,
      },
      sections: null,
      gallery: { eyebrow: null, title: 'Galerie Sanity', introduction: null },
      closing: null,
    },
    null,
    fallback,
    buildSources,
  );

  assert.equal(page.hero.title, 'Titre Sanity');
  assert.equal(page.introduction.title, 'Présentation Sanity');
  assert.deepEqual(page.introduction.paragraphs, [
    'Premier paragraphe.',
    'Second paragraphe.',
  ]);
  assert.equal(page.gallery.title, 'Galerie Sanity');
  // Champs laissés vides dans le Studio : le texte local reste affiché.
  assert.equal(page.introduction.eyebrow, fallback.introduction.eyebrow);
  assert.equal(page.gallery.introduction, fallback.gallery.introduction);
  assert.equal(page.closing.title, fallback.closing.title);
});

test('les visuels du hero viennent du Studio', () => {
  const page = normalizeSanityThriftStorePage(
    {
      hero: {
        eyebrow: 'A',
        title: 'B',
        introduction: 'C',
        slides: [
          { _key: 's1', label: 'Portants', visual: rawImage('Des portants') },
        ],
      },
    },
    rawStore,
    fallback,
    buildSources,
  );

  assert.equal(page.hero.slides.length, 1);
  assert.equal(page.hero.slides[0].label, 'Portants');
  assert.equal(page.hero.slides[0].image.alt, 'Des portants');
  // Le SEO reste au code : il n'est pas saisissable dans le Studio.
  assert.deepEqual(page.seo, fallback.seo);
});

test('sans visuel dans le Studio, l’en-tête ne réserve aucun cadre', () => {
  const page = normalizeSanityThriftStorePage(
    { hero: { eyebrow: 'A', title: 'B', introduction: 'C' } },
    rawStore,
    fallback,
    buildSources,
  );

  assert.deepEqual(page.hero.slides, []);
  assert.deepEqual(page.gallery.items, []);
});

test('la galerie applique les mêmes verrous que le carrousel de l’accueil', () => {
  const page = normalizeSanityThriftStorePage(
    {
      gallery: {
        photos: [
          {
            _key: 'ok',
            title: 'Portants organisés',
            rightsCleared: true,
            photo: rawImage('Des portants garnis'),
          },
          {
            _key: 'droits-absents',
            title: 'Vue large',
            rightsCleared: false,
            photo: rawImage('Une vue large'),
          },
          {
            _key: 'personne-sans-consentement',
            title: 'Bénévole',
            rightsCleared: true,
            consentConfirmed: false,
            photo: rawImage('Une bénévole', {
              containsRecognizablePeople: true,
            }),
          },
          {
            _key: 'sans-alt',
            title: 'Sans texte alternatif',
            rightsCleared: true,
            photo: { image: rawImage('x').image },
          },
        ],
      },
    },
    rawStore,
    fallback,
    buildSources,
  );

  assert.deepEqual(
    page.gallery.items.map(({ id }) => id),
    ['ok'],
  );
});

test('les renseignements pratiques viennent du document partagé', () => {
  const page = normalizeSanityThriftStorePage(
    null,
    rawStore,
    fallback,
    buildSources,
  );

  assert.equal(page.practicalInformation.hours, rawStore.hours);
  assert.equal(page.practicalInformation.location, rawStore.location);
  assert.equal(page.practicalInformation.phone, rawStore.phone);
});

test('un renseignement vidé dans le Studio disparaît de la page', () => {
  const information = normalizeSanityThriftStoreInformation(
    { name: 'Au Coin de l’Entraide', hours: null, location: '   ', phone: '' },
    fallback.practicalInformation,
    fallback.practicalInformation.contactCta,
  );

  assert.equal(information.hours, undefined);
  assert.equal(information.location, undefined);
  assert.equal(information.phone, undefined);
});

test('sans document friperie, les renseignements locaux servent de repli', () => {
  const information = normalizeSanityThriftStoreInformation(
    null,
    fallback.practicalInformation,
    fallback.practicalInformation.contactCta,
  );

  assert.equal(information.hours, fallback.practicalInformation.hours);
  assert.equal(information.phone, fallback.practicalInformation.phone);
});

test('les sections sans titre ou sans description sont écartées', () => {
  const page = normalizeSanityThriftStorePage(
    {
      sections: [
        { _key: 'a', title: '  ', description: 'Description.', active: true },
        { _key: 'b', title: 'Titre.', description: null, active: true },
        {
          _key: 'c',
          eyebrow: 'Réemploi',
          title: 'Une seconde vie',
          description: 'Description complète.',
          visualKind: 'none',
          active: false,
        },
      ],
    },
    null,
    fallback,
    buildSources,
  );

  assert.equal(page.sections.length, 1);
  assert.deepEqual(page.sections[0], {
    id: 'c',
    eyebrow: 'Réemploi',
    title: 'Une seconde vie',
    description: 'Description complète.',
    active: false,
    visualKind: 'none',
  });
});

test('sans section exploitable, les sections locales restent affichées', () => {
  const page = normalizeSanityThriftStorePage(
    { sections: [{ _key: 'a', title: null, description: null }] },
    null,
    fallback,
    buildSources,
  );

  assert.deepEqual(page.sections, fallback.sections);
});

test('l’adresse des boutons est construite par le code, jamais saisie', () => {
  const page = normalizeSanityThriftStorePage(
    {
      introduction: { contactCta: { target: 'schedules', label: null } },
      closing: {
        primaryCta: { target: 'contact', label: 'Nous joindre' },
        secondaryCta: { target: 'events', label: '   ' },
      },
    },
    null,
    fallback,
    buildSources,
  );

  assert.deepEqual(page.practicalInformation.contactCta, {
    label: 'Consulter les horaires',
    href: '/horaires/',
  });
  assert.deepEqual(page.closing.primaryCta, {
    label: 'Nous joindre',
    href: '/contact/',
  });
  // Libellé vide : le texte par défaut de la destination prend le relais.
  assert.deepEqual(page.closing.secondaryCta, {
    label: 'Voir les événements de la paroisse',
    href: '/evenements/',
  });
});

test('une destination inconnue garde le bouton local plutôt qu’un lien mort', () => {
  const page = normalizeSanityThriftStorePage(
    { closing: { primaryCta: { target: 'inexistante', label: 'Aller' } } },
    null,
    fallback,
    buildSources,
  );

  assert.deepEqual(page.closing.primaryCta, fallback.closing.primaryCta);
});
