import assert from 'node:assert/strict';
import test from 'node:test';
import {
  formatParishEventDate,
  formatParishEventTime,
  getParishEventTemporalStatus,
  selectHomepageParishEvents,
  selectPastParishEvents,
  selectUpcomingParishEvents,
} from '../src/lib/events/parish-events.ts';

const NOW = new Date('2026-07-26T12:00:00-04:00');

function event(overrides = {}) {
  return {
    id: 'event-default',
    slug: 'event-default',
    title: 'Événement',
    excerpt: 'Résumé',
    category: 'other',
    startAt: '2026-08-15T09:00:00-04:00',
    endAt: '2026-08-15T11:00:00-04:00',
    timeZone: 'America/Toronto',
    publicationStatus: 'published',
    showOnWebsite: true,
    showOnHomepage: true,
    showInArchive: true,
    featured: false,
    ...overrides,
  };
}

test('un événement futur est upcoming', () => {
  assert.equal(getParishEventTemporalStatus(event(), NOW), 'upcoming');
});

test('un événement commencé et non terminé est ongoing', () => {
  const ongoing = event({
    startAt: '2026-07-26T10:00:00-04:00',
    endAt: '2026-07-26T14:00:00-04:00',
  });
  assert.equal(getParishEventTemporalStatus(ongoing, NOW), 'ongoing');
});

test('un événement terminé est past', () => {
  const past = event({
    startAt: '2026-07-25T07:00:00-04:00',
    endAt: '2026-07-25T20:30:00-04:00',
  });
  assert.equal(getParishEventTemporalStatus(past, NOW), 'past');
});

test('un événement sans fin dont le début est passé est past', () => {
  const pastWithoutEnd = event({
    startAt: '2026-07-25T07:00:00-04:00',
  });
  delete pastWithoutEnd.endAt;
  assert.equal(getParishEventTemporalStatus(pastWithoutEnd, NOW), 'past');
});

test('les événements futurs sont triés du plus proche au plus éloigné', () => {
  const events = [
    event({ id: 'later', startAt: '2026-09-01T09:00:00-04:00' }),
    event({ id: 'nearer', startAt: '2026-08-01T09:00:00-04:00' }),
  ];
  assert.deepEqual(
    selectUpcomingParishEvents(events, NOW).map(({ id }) => id),
    ['nearer', 'later'],
  );
});

test('les événements passés sont triés du plus récent au plus ancien', () => {
  const events = [
    event({
      id: 'older',
      startAt: '2026-07-01T09:00:00-04:00',
      endAt: '2026-07-01T10:00:00-04:00',
    }),
    event({
      id: 'newer',
      startAt: '2026-07-25T09:00:00-04:00',
      endAt: '2026-07-25T10:00:00-04:00',
    }),
  ];
  assert.deepEqual(
    selectPastParishEvents(events, NOW).map(({ id }) => id),
    ['newer', 'older'],
  );
});

test('un brouillon est exclu des listes publiques', () => {
  const draft = event({ publicationStatus: 'draft' });
  assert.equal(selectUpcomingParishEvents([draft], NOW).length, 0);
});

test('showOnWebsite false exclut un événement de toutes les vues publiques', () => {
  const hidden = event({ showOnWebsite: false });
  assert.equal(selectUpcomingParishEvents([hidden], NOW).length, 0);
  assert.equal(selectHomepageParishEvents([hidden], NOW).featured, undefined);
});

test('showInArchive false exclut seulement des archives', () => {
  const future = event({ showInArchive: false });
  const past = event({
    showInArchive: false,
    startAt: '2026-07-25T09:00:00-04:00',
    endAt: '2026-07-25T10:00:00-04:00',
  });
  assert.equal(selectUpcomingParishEvents([future], NOW).length, 1);
  assert.equal(selectPastParishEvents([past], NOW).length, 0);
});

test('showOnHomepage false exclut seulement de l’accueil', () => {
  const pageOnly = event({ showOnHomepage: false });
  assert.equal(selectUpcomingParishEvents([pageOnly], NOW).length, 1);
  assert.equal(selectHomepageParishEvents([pageOnly], NOW).featured, undefined);
});

test('un événement passé est exclu de l’accueil', () => {
  const past = event({
    startAt: '2026-07-25T09:00:00-04:00',
    endAt: '2026-07-25T10:00:00-04:00',
  });
  assert.equal(selectHomepageParishEvents([past], NOW).featured, undefined);
});

test('un événement en cours est placé avant les événements futurs', () => {
  const future = event({ id: 'future' });
  const ongoing = event({
    id: 'ongoing',
    startAt: '2026-07-26T10:00:00-04:00',
    endAt: '2026-07-26T14:00:00-04:00',
  });
  assert.deepEqual(
    selectUpcomingParishEvents([future, ongoing], NOW).map(({ id }) => id),
    ['ongoing', 'future'],
  );
});

test('un événement featured admissible devient la grande carte', () => {
  const nearer = event({
    id: 'nearer',
    startAt: '2026-08-01T09:00:00-04:00',
  });
  const featured = event({
    id: 'featured',
    featured: true,
    startAt: '2026-08-15T09:00:00-04:00',
  });
  assert.equal(
    selectHomepageParishEvents([nearer, featured], NOW).featured?.id,
    'featured',
  );
});

test('la sélection retombe sur le premier événement sans featured', () => {
  const later = event({
    id: 'later',
    startAt: '2026-09-01T09:00:00-04:00',
  });
  const nearer = event({
    id: 'nearer',
    startAt: '2026-08-01T09:00:00-04:00',
  });
  assert.equal(
    selectHomepageParishEvents([later, nearer], NOW).featured?.id,
    'nearer',
  );
});

test('la grande carte n’est jamais dupliquée dans les cartes secondaires', () => {
  const events = [
    event({ id: 'featured', featured: true }),
    event({ id: 'secondary', startAt: '2026-08-20T09:00:00-04:00' }),
  ];
  const selection = selectHomepageParishEvents(events, NOW);
  assert.equal(selection.featured?.id, 'featured');
  assert.deepEqual(
    selection.secondary.map(({ id }) => id),
    ['secondary'],
  );
});

test('la sélection de l’accueil est limitée à quatre événements', () => {
  const events = Array.from({ length: 6 }, (_, index) =>
    event({
      id: `event-${index}`,
      startAt: `2026-08-${String(index + 10).padStart(2, '0')}T09:00:00-04:00`,
      featured: index === 0,
    }),
  );
  const selection = selectHomepageParishEvents(events, NOW, 4);
  assert.equal(1 + selection.secondary.length, 4);
});

test('zéro événement produit une sélection d’accueil vide', () => {
  assert.deepEqual(selectHomepageParishEvents([], NOW), { secondary: [] });
});

test('un événement ne produit aucune carte secondaire vide', () => {
  const selection = selectHomepageParishEvents([event()], NOW);
  assert.ok(selection.featured);
  assert.deepEqual(selection.secondary, []);
});

test('le fuseau America/Toronto produit les formats français attendus', () => {
  assert.equal(
    formatParishEventDate('2026-08-16T03:00:00Z'),
    'samedi 15 août 2026',
  );
  assert.equal(formatParishEventTime('2026-08-15T13:00:00Z'), '9 h');
  assert.equal(formatParishEventTime('2026-07-26T00:30:00Z'), '20 h 30');
});

test('Sainte-Anne apparaît dans les archives après sa fin', () => {
  const sainteAnne = event({
    id: 'sainte-anne',
    showOnHomepage: false,
    startAt: '2026-07-25T07:00:00-04:00',
    endAt: '2026-07-25T20:30:00-04:00',
  });
  assert.deepEqual(
    selectPastParishEvents([sainteAnne], NOW).map(({ id }) => id),
    ['sainte-anne'],
  );
});

test('Notre-Dame-du-Cap apparaît à venir et sur l’accueil', () => {
  const notreDame = event({
    id: 'notre-dame-du-cap',
    featured: true,
    homepagePriority: 1,
  });
  assert.equal(selectUpcomingParishEvents([notreDame], NOW).length, 1);
  assert.equal(
    selectHomepageParishEvents([notreDame], NOW).featured?.id,
    'notre-dame-du-cap',
  );
});
