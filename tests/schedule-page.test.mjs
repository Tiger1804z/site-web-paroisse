import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { schedulePageData } from '../src/data/schedules.ts';
import { normalizeSanitySchedulePage } from '../src/lib/content/normalizeSanitySchedulePage.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const fallback = schedulePageData;

function document(overrides = {}) {
  return {
    hero: {
      eyebrow: 'Célébrations',
      title: 'Horaires et célébrations',
      introduction: 'Texte d’introduction publié depuis Sanity.',
      imageAlt: 'Intérieur de l’église',
    },
    notice: null,
    beforeYouVisit: null,
    sidebar: null,
    faq: null,
    ...overrides,
  };
}

function notice(overrides = {}) {
  return {
    title: 'Horaire spécial',
    message: 'Les messes du 15 août sont déplacées.',
    severity: 'important',
    actionTarget: 'none',
    active: true,
    ...overrides,
  };
}

test('un document absent laisse le repli local intact', () => {
  const result = normalizeSanitySchedulePage(null, fallback);

  assert.deepEqual(result.hero, fallback.hero);
  assert.deepEqual(result.beforeYouVisit, fallback.beforeYouVisit);
  assert.deepEqual(result.faq, fallback.faq);
  assert.equal(result.sidebar.office.eyebrow, fallback.sidebar.office.eyebrow);
  assert.equal(result.sidebar.office.message, fallback.sidebar.office.message);
  // Rien n’est inventé : ni avis, ni heures de secrétariat.
  assert.equal(result.notice, undefined);
  assert.equal(result.sidebar.office.hoursLabel, undefined);
});

test('le hero Sanity complet remplace le hero local', () => {
  const result = normalizeSanitySchedulePage(document(), fallback);

  assert.equal(
    result.hero.introduction,
    'Texte d’introduction publié depuis Sanity.',
  );
});

test('un hero incomplet retombe entièrement sur le repli', () => {
  const result = normalizeSanitySchedulePage(
    document({
      hero: {
        eyebrow: 'Célébrations',
        title: '   ',
        introduction: 'Texte partiel',
        imageAlt: 'Intérieur de l’église',
      },
    }),
    fallback,
  );

  assert.deepEqual(result.hero, fallback.hero);
});

test('un avis complet est publié avec son ton', () => {
  const result = normalizeSanitySchedulePage(
    document({ notice: notice() }),
    fallback,
  );

  assert.equal(result.notice.title, 'Horaire spécial');
  assert.equal(result.notice.severity, 'important');
  assert.equal(result.notice.active, true);
  assert.equal(result.notice.action, undefined);
});

test('un avis sans titre ou sans message n’existe pas', () => {
  const withoutTitle = normalizeSanitySchedulePage(
    document({ notice: notice({ title: '  ' }) }),
    fallback,
  );
  const withoutMessage = normalizeSanitySchedulePage(
    document({ notice: notice({ message: null }) }),
    fallback,
  );

  assert.equal(withoutTitle.notice, undefined);
  assert.equal(withoutMessage.notice, undefined);
});

test('un ton inconnu retombe sur « info »', () => {
  const result = normalizeSanitySchedulePage(
    document({ notice: notice({ severity: 'urgentissime' }) }),
    fallback,
  );

  assert.equal(result.notice.severity, 'info');
});

test('la destination de l’avis est traduite en lien connu du site', () => {
  const toCelebrations = normalizeSanitySchedulePage(
    document({ notice: notice({ actionTarget: 'specialCelebrations' }) }),
    fallback,
  );
  const toContact = normalizeSanitySchedulePage(
    document({ notice: notice({ actionTarget: 'contact' }) }),
    fallback,
  );
  const unknown = normalizeSanitySchedulePage(
    document({ notice: notice({ actionTarget: 'site-externe' }) }),
    fallback,
  );

  assert.equal(toCelebrations.notice.action.href, '#celebrations-speciales');
  assert.equal(toContact.notice.action.href, '/contact/');
  assert.equal(unknown.notice.action, undefined);
});

test('un avis masqué reste masqué', () => {
  const result = normalizeSanitySchedulePage(
    document({ notice: notice({ active: false }) }),
    fallback,
  );

  assert.equal(result.notice.active, false);
});

test('les heures du secrétariat viennent des coordonnées globales', () => {
  const result = normalizeSanitySchedulePage(
    document(),
    fallback,
    'Mardi de 9 h à 12 h',
  );

  assert.equal(result.sidebar.office.hoursLabel, 'Mardi de 9 h à 12 h');
});

test('sans coordonnées, aucune heure de secrétariat n’est inventée', () => {
  const result = normalizeSanitySchedulePage(document(), fallback);

  assert.equal(result.sidebar.office.hoursLabel, undefined);
});

test('la destination des boutons reste définie par le code', () => {
  const result = normalizeSanitySchedulePage(
    document({
      beforeYouVisit: { title: 'Avant de venir', message: 'Vérifiez l’heure.' },
      sidebar: { officeEyebrow: 'Bureau', officeMessage: 'Appelez-nous.' },
    }),
    fallback,
  );

  assert.equal(result.beforeYouVisit.title, 'Avant de venir');
  assert.equal(
    result.beforeYouVisit.contactLink.href,
    fallback.beforeYouVisit.contactLink.href,
  );
  assert.equal(result.sidebar.office.eyebrow, 'Bureau');
  assert.equal(
    result.sidebar.office.link.href,
    fallback.sidebar.office.link.href,
  );
});

test('la FAQ Sanity remplace la FAQ locale et garde l’ordre du tableau', () => {
  const result = normalizeSanitySchedulePage(
    document({
      faq: [
        {
          _key: 'faq-2',
          question: 'Deuxième question?',
          answer: 'Deuxième réponse.',
          active: true,
        },
        {
          _key: 'faq-1',
          question: 'Première question?',
          answer: 'Première réponse.',
          active: false,
        },
      ],
    }),
    fallback,
  );

  assert.deepEqual(
    result.faq.map(({ id, active }) => `${id}:${active}`),
    ['faq-2:true', 'faq-1:false'],
  );
});

test('une question incomplète est écartée sans vider la FAQ', () => {
  const result = normalizeSanitySchedulePage(
    document({
      faq: [
        { _key: 'faq-1', question: 'Vraie question?', answer: 'Réponse.' },
        { _key: 'faq-2', question: 'Sans réponse?', answer: '   ' },
      ],
    }),
    fallback,
  );

  assert.deepEqual(
    result.faq.map(({ id }) => id),
    ['faq-1'],
  );
});

test('une FAQ Sanity vide conserve la FAQ locale', () => {
  const result = normalizeSanitySchedulePage(document({ faq: [] }), fallback);

  assert.deepEqual(result.faq, fallback.faq);
});

test('les sections encore locales traversent la normalisation', () => {
  const result = normalizeSanitySchedulePage(document(), fallback);

  assert.deepEqual(result.specialCelebrations, fallback.specialCelebrations);
  assert.equal(
    result.specialCelebrationsEmptyMessage,
    fallback.specialCelebrationsEmptyMessage,
  );
});

test('les données locales des horaires ne contiennent plus de gabarit', () => {
  assert.doesNotMatch(JSON.stringify(schedulePageData), /\[[A-ZÀ-Ü\s'’]+\]/u);
});

test('l’accueil ne contient plus de gabarit d’heure', () => {
  const homePage = readFileSync(`${rootPath}/src/pages/index.astro`, 'utf8');
  const hero = readFileSync(
    `${rootPath}/src/components/sections/home/HomeHero.astro`,
    'utf8',
  );
  const preview = readFileSync(
    `${rootPath}/src/components/sections/home/MassSchedulePreview.astro`,
    'utf8',
  );

  assert.doesNotMatch(hero, /\[HEURE\]/);
  assert.doesNotMatch(preview, /\[HEURE\]/);
  assert.doesNotMatch(preview, /\[DATE\]/);
  assert.match(homePage, /getWeeklyMasses/);
  assert.match(hero, /Horaires à confirmer/);
  assert.match(preview, /Horaires à confirmer/);
});

test('la fonctionnalité Feuillets paroissiaux est retirée du site', () => {
  const navigation = readFileSync(`${rootPath}/src/lib/navigation.ts`, 'utf8');
  const placeholderPage = readFileSync(
    `${rootPath}/src/pages/[slug].astro`,
    'utf8',
  );

  assert.doesNotMatch(navigation, /feuillets-paroissiaux/);
  assert.doesNotMatch(placeholderPage, /feuillets-paroissiaux/);
  assert.doesNotMatch(JSON.stringify(schedulePageData), /feuillet/i);
});
