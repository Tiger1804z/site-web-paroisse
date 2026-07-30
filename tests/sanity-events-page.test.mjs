import assert from 'node:assert/strict';
import test from 'node:test';
import {
  normalizeSanityEventsPage,
  normalizeSanityEventsPageSettings,
  normalizeSanityHomePageEvents,
} from '../src/lib/content/normalizeSanityEventsPage.ts';

// Doublure du constructeur d'adresses : le vrai lit `import.meta.env`, absent
// sous `node --test`.
const buildSources = () => ({
  src: 'https://cdn.test/image?w=1920',
  srcSet: 'https://cdn.test/image?w=480 480w',
});

// Repli minimal. `src/data/events.ts` importe des images et ne peut pas être
// chargé par Node : on reconstruit ici la forme dont le normalizer a besoin.
const fallback = {
  seo: { title: 'Événements', description: 'Description locale.' },
  hero: {
    eyebrow: 'Calendrier',
    title: 'Événements',
    introduction: 'Introduction locale.',
    image: {
      kind: 'image',
      image: { src: '/local.jpg', width: 1920, height: 1080, format: 'jpg' },
      imageAlt: 'Autel décoré',
      position: 'center 52%',
    },
  },
  overview: {
    eyebrow: 'Vie paroissiale',
    title: 'Cinq façons de se rassembler',
    introduction: 'Aperçu local.',
    confirmationNote: 'Note locale.',
  },
  categories: [
    {
      id: 'locale',
      slug: 'locale',
      title: 'Catégorie locale',
      summary: 'Résumé local.',
      category: 'community',
      visual: { kind: 'clothing-rack', accessibleLabel: 'Illustration locale' },
      featured: false,
      active: true,
      confirmationRequired: true,
    },
  ],
};

const settingsFallback = {
  showUpcomingSection: true,
  showPastSection: true,
  upcomingSectionTitle: 'Événements à venir',
  pastSectionTitle: 'Retour sur nos événements',
};

const homeFallback = {
  showHomepageUpcomingSection: true,
  homepageUpcomingTitle: 'Prochaines activités',
  homepageUpcomingLimit: 4,
};

function rawSanityImage(overrides = {}) {
  return {
    alt: 'Public assis dans la nef pendant un concert',
    credit: null,
    image: {
      _type: 'image',
      asset: {
        _id: 'image-abc-1800x1120-jpg',
        metadata: {
          lqip: 'data:image/jpeg;base64,abc',
          dimensions: { width: 1800, height: 1120, aspectRatio: 1.6 },
        },
      },
    },
    ...overrides,
  };
}

function rawCategory(overrides = {}) {
  return {
    _key: 'categorie-1',
    title: 'Concerts et événements culturels',
    summary: 'La paroisse peut accueillir des concerts.',
    kind: 'cultural',
    visualKind: 'clothing-rack',
    illustrationLabel: null,
    ctaTarget: 'none',
    ctaLabel: null,
    featured: false,
    active: true,
    confirmationRequired: true,
    image: null,
    ...overrides,
  };
}

function rawPage(overrides = {}) {
  return {
    hero: null,
    overview: null,
    categories: null,
    upcomingSectionTitle: null,
    showUpcomingSection: null,
    upcomingLimit: null,
    pastSectionTitle: null,
    showPastSection: null,
    pastLimit: null,
    ...overrides,
  };
}

function normalize(overrides) {
  return normalizeSanityEventsPage(rawPage(overrides), fallback, buildSources);
}

test('un document absent laisse le repli local intact', () => {
  const page = normalizeSanityEventsPage(null, fallback, buildSources);

  assert.deepEqual(page.hero, fallback.hero);
  assert.deepEqual(page.overview, fallback.overview);
  assert.deepEqual(page.categories, fallback.categories);
});

test('l’image du hero n’est jamais remplacée par Sanity', () => {
  const page = normalize({
    hero: {
      eyebrow: 'Agenda',
      title: 'Nos rendez-vous',
      introduction: 'Texte publié depuis Sanity.',
    },
  });

  assert.equal(page.hero.title, 'Nos rendez-vous');
  assert.deepEqual(page.hero.image, fallback.hero.image);
});

test('une catégorie sans titre est écartée', () => {
  const page = normalize({
    categories: [rawCategory({ _key: 'sans-titre', title: '   ' })],
  });

  assert.deepEqual(page.categories, fallback.categories);
});

test('une catégorie sans description est écartée', () => {
  const page = normalize({
    categories: [rawCategory({ _key: 'sans-resume', summary: null })],
  });

  assert.deepEqual(page.categories, fallback.categories);
});

test('un visuel de type inconnu écarte la catégorie', () => {
  const page = normalize({
    categories: [
      rawCategory({ _key: 'visuel-inconnu', visualKind: 'video-immersive' }),
      rawCategory({ _key: 'sans-visuel', visualKind: null }),
    ],
  });

  assert.deepEqual(page.categories, fallback.categories);
});

test('une photographie sans texte alternatif écarte la catégorie', () => {
  const page = normalize({
    categories: [
      rawCategory({
        _key: 'photo-muette',
        visualKind: 'image',
        image: rawSanityImage({ alt: '  ' }),
      }),
    ],
  });

  assert.deepEqual(page.categories, fallback.categories);
});

test('une photographie annoncée mais absente écarte la catégorie', () => {
  const page = normalize({
    categories: [
      rawCategory({ _key: 'photo-promise', visualKind: 'image', image: null }),
      rawCategory({
        _key: 'fichier-supprime',
        visualKind: 'image',
        image: rawSanityImage({ image: { _type: 'image', asset: null } }),
      }),
    ],
  });

  assert.deepEqual(page.categories, fallback.categories);
});

test('une catégorie invalide n’emporte pas les valides autour d’elle', () => {
  const page = normalize({
    categories: [
      rawCategory({ _key: 'avant', title: 'Avant' }),
      rawCategory({ _key: 'cassee', title: null }),
      rawCategory({
        _key: 'apres',
        title: 'Après',
        visualKind: 'image',
        image: rawSanityImage(),
      }),
    ],
  });

  // La grille garde exactement les cartes affichables, dans l'ordre du tableau.
  assert.deepEqual(
    page.categories.map(({ id, title }) => `${id}:${title}`),
    ['avant:Avant', 'apres:Après'],
  );
});

test('une photographie valide devient un visuel distant complet', () => {
  const page = normalize({
    categories: [
      rawCategory({
        visualKind: 'image',
        image: rawSanityImage({
          credit: 'Paroisse',
          image: {
            ...rawSanityImage().image,
            hotspot: { _type: 'sanity.imageHotspot', x: 0.4, y: 0.6 },
          },
        }),
      }),
    ],
  });

  const [category] = page.categories;
  assert.equal(category.visual.kind, 'remote-image');
  assert.equal(
    category.visual.image.alt,
    'Public assis dans la nef pendant un concert',
  );
  assert.deepEqual(category.visual.image.focalPoint, { x: 0.4, y: 0.6 });
  assert.equal(category.visual.image.credit, 'Paroisse');
});

test('une illustration codée reçoit sa description par défaut', () => {
  const page = normalize({
    categories: [
      rawCategory({ _key: 'defaut', visualKind: 'community-meal' }),
      rawCategory({
        _key: 'precise',
        visualKind: 'generations-chain',
        illustrationLabel: 'Description écrite par la paroisse',
      }),
    ],
  });

  assert.match(page.categories[0].visual.accessibleLabel, /repas partagé/);
  assert.equal(
    page.categories[1].visual.accessibleLabel,
    'Description écrite par la paroisse',
  );
});

test('le bouton n’existe que pour une destination connue du site', () => {
  const page = normalize({
    categories: [
      rawCategory({ _key: 'sans-bouton', ctaTarget: 'none' }),
      rawCategory({ _key: 'horaires', ctaTarget: 'schedules' }),
      rawCategory({
        _key: 'personnalise',
        ctaTarget: 'contact',
        ctaLabel: 'Nous écrire',
      }),
      rawCategory({ _key: 'inconnu', ctaTarget: 'site-externe' }),
    ],
  });

  const cta = Object.fromEntries(
    page.categories.map(({ id, cta: action }) => [id, action]),
  );

  assert.equal(cta['sans-bouton'], undefined);
  assert.equal(cta['inconnu'], undefined);
  assert.deepEqual(cta['horaires'], {
    label: 'Consulter les horaires',
    href: '/horaires/',
  });
  assert.deepEqual(cta['personnalise'], {
    label: 'Nous écrire',
    href: '/contact/',
  });
});

test('les réglages de sections retombent sur le local champ par champ', () => {
  const partial = normalizeSanityEventsPageSettings(
    rawPage({ upcomingSectionTitle: 'À l’agenda', showPastSection: false }),
    settingsFallback,
  );

  assert.equal(partial.upcomingSectionTitle, 'À l’agenda');
  assert.equal(partial.pastSectionTitle, settingsFallback.pastSectionTitle);
  assert.equal(partial.showPastSection, false);
  assert.equal(partial.showUpcomingSection, true);
  assert.equal(partial.upcomingLimit, undefined);
});

test('les réglages d’accueil refusent une limite absurde', () => {
  const valid = normalizeSanityHomePageEvents(
    {
      upcomingEventsTitle: 'Ce mois-ci',
      showUpcomingEvents: true,
      upcomingEventsLimit: 2,
    },
    homeFallback,
  );
  const zero = normalizeSanityHomePageEvents(
    {
      upcomingEventsTitle: null,
      showUpcomingEvents: null,
      upcomingEventsLimit: 0,
    },
    homeFallback,
  );

  assert.equal(valid.homepageUpcomingTitle, 'Ce mois-ci');
  assert.equal(valid.homepageUpcomingLimit, 2);
  assert.equal(zero.homepageUpcomingLimit, homeFallback.homepageUpcomingLimit);
  assert.equal(zero.showHomepageUpcomingSection, true);
});
