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
    firstVisitCta: null,
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

/* -------------------------------------------------------------------------
 * La carte « Première visite »
 * ------------------------------------------------------------------------- */

/**
 * « Première visite » a quitté la barre de navigation : c'est une page qu'on
 * lit une fois, pas une destination hebdomadaire. Elle se rattrape ici, au seul
 * moment où la question se pose — juste après avoir lu l'heure de la messe.
 * Si la carte disparaît, la page devient introuvable pour qui n'inspecte pas le
 * pied de page.
 */
test('la carte Première visite porte le texte demandé par la paroisse', () => {
  assert.equal(fallback.firstVisitCta.title, 'C’est votre première visite?');
  assert.match(fallback.firstVisitCta.message, /où entrer, où vous stationner/);
  assert.equal(
    fallback.firstVisitCta.link.label,
    'Préparer ma première visite',
  );
  assert.equal(fallback.firstVisitCta.link.href, '/premiere-visite/');
});

test('le Studio peut réécrire la carte, mais pas sa destination', () => {
  const result = normalizeSanitySchedulePage(
    document({
      firstVisitCta: {
        title: 'Vous venez pour la première fois?',
        message: 'Texte publié depuis Sanity.',
        linkLabel: 'Tout savoir avant de venir',
      },
    }),
    fallback,
  );

  assert.equal(result.firstVisitCta.title, 'Vous venez pour la première fois?');
  assert.equal(result.firstVisitCta.link.label, 'Tout savoir avant de venir');
  // La destination est une route du site, pas du contenu.
  assert.equal(result.firstVisitCta.link.href, '/premiere-visite/');
});

test('un champ vide laisse le repli reprendre la main, seul', () => {
  const result = normalizeSanitySchedulePage(
    document({
      firstVisitCta: { title: '   ', message: null, linkLabel: 'Y aller' },
    }),
    fallback,
  );

  assert.equal(result.firstVisitCta.title, fallback.firstVisitCta.title);
  assert.equal(result.firstVisitCta.message, fallback.firstVisitCta.message);
  assert.equal(result.firstVisitCta.link.label, 'Y aller');
});

test('la page Horaires affiche la carte sous les horaires réguliers', () => {
  const page = readFileSync(`${rootPath}/src/pages/horaires.astro`, 'utf8');
  const regular = page.indexOf('<RegularSchedule');
  const cta = page.indexOf('<FirstVisitCta');

  assert.ok(
    cta > regular,
    'la carte doit venir après les horaires, pas avant.',
  );
  assert.match(page, /content=\{schedulePageData\.firstVisitCta\}/);
});

/* -------------------------------------------------------------------------
 * La date de vérification
 * ------------------------------------------------------------------------- */

/**
 * Le 1er septembre 2026, deux messes ont été ajoutées au document `massSchedule`
 * sans que `lastReviewedAt` bouge. La page a continué d'afficher « Dernière mise
 * à jour : 29 juillet 2026 » au-dessus d'horaires qui, eux, avaient changé.
 *
 * Le champ est une date de vérification saisie à la main, et il le restera : une
 * date d'enregistrement ne prouve pas qu'on a téléphoné au secrétariat. Ce qui
 * change, c'est que le site cesse de la présenter comme autre chose.
 */
test('le site nomme la date qu’il affiche, sans promettre une mise à jour', () => {
  for (const file of [
    'src/components/sections/schedules/BeforeYouVisitBanner.astro',
    'src/components/sections/schedules/RegularSchedule.astro',
    'src/components/sections/home/MassSchedulePreview.astro',
  ]) {
    const source = readFileSync(`${rootPath}/${file}`, 'utf8');

    assert.match(
      source,
      /Horaires vérifiés le/,
      `${file} doit nommer la vérification, pas la mise à jour.`,
    );
    assert.ok(
      !source.includes('Dernière mise à jour'),
      `${file} promet encore une fraîcheur que le champ ne garantit pas.`,
    );
  }
});

/** L'avertissement du Studio est la seule chose qui pose la question à temps. */
test('le Studio avertit quand la date de vérification a pris du retard', () => {
  const schema = readFileSync(
    `${rootPath}/studio/schemaTypes/documents/massScheduleType.ts`,
    'utf8',
  );

  assert.match(schema, /_updatedAt/);
  assert.match(schema, /\.warning\(\)/);
});
