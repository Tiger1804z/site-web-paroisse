import assert from 'node:assert/strict';
import test from 'node:test';
import { selectSpecialCelebrations } from '../src/lib/schedules/special-celebrations.ts';

const NOW = new Date('2026-09-10T12:00:00-04:00');

function event(overrides = {}) {
  return {
    id: 'event-default',
    slug: 'event-default',
    title: 'Célébration',
    excerpt: 'Résumé',
    category: 'liturgy',
    startAt: '2026-09-27T10:00:00-04:00',
    timeZone: 'America/Toronto',
    publicationStatus: 'published',
    showOnWebsite: true,
    showOnHomepage: true,
    showInArchive: true,
    featured: false,
    ...overrides,
  };
}

test('une célébration à venir est reprise dans les horaires', () => {
  const [celebration] = selectSpecialCelebrations([event()], NOW);

  assert.equal(celebration.id, 'event-default');
  assert.equal(celebration.title, 'Célébration');
  assert.equal(celebration.dateLabel, 'dimanche 27 septembre 2026');
  assert.equal(celebration.timeLabel, '10 h');
  assert.equal(celebration.note, undefined);
});

test('les activités qui ne sont pas des célébrations restent sur /evenements', () => {
  const events = [
    event({ id: 'concert', category: 'concert' }),
    event({ id: 'pelerinage', category: 'pilgrimage' }),
    event({ id: 'repas', category: 'community-meal' }),
    event({ id: 'messe', category: 'liturgy' }),
  ];

  assert.deepEqual(
    selectSpecialCelebrations(events, NOW).map(({ id }) => id),
    ['messe'],
  );
});

test('une célébration passée ne figure plus dans les horaires', () => {
  const past = event({
    startAt: '2026-08-15T10:00:00-04:00',
    endAt: '2026-08-15T11:30:00-04:00',
  });

  assert.deepEqual(selectSpecialCelebrations([past], NOW), []);
});

test('une célébration en cours reste affichée', () => {
  const ongoing = event({
    startAt: '2026-09-10T10:00:00-04:00',
    endAt: '2026-09-10T16:00:00-04:00',
  });

  assert.equal(selectSpecialCelebrations([ongoing], NOW).length, 1);
});

test('une célébration annulée reste affichée, marquée comme telle', () => {
  const [celebration] = selectSpecialCelebrations(
    [event({ publicationStatus: 'cancelled' })],
    NOW,
  );

  assert.equal(celebration.note, 'Annulée');
});

test('un brouillon ou une célébration retirée du site n’apparaît pas', () => {
  const hidden = [
    event({ id: 'brouillon', publicationStatus: 'draft' }),
    event({ id: 'retiree', showOnWebsite: false }),
  ];

  assert.deepEqual(selectSpecialCelebrations(hidden, NOW), []);
});

test('les célébrations sont triées de la plus proche à la plus éloignée', () => {
  const events = [
    event({ id: 'novembre', startAt: '2026-11-01T10:00:00-05:00' }),
    event({ id: 'septembre', startAt: '2026-09-27T10:00:00-04:00' }),
  ];

  assert.deepEqual(
    selectSpecialCelebrations(events, NOW).map(({ id }) => id),
    ['septembre', 'novembre'],
  );
});

test('la limite, quand elle est donnée, s’applique après le filtrage', () => {
  const events = [
    event({ id: 'concert', category: 'concert' }),
    event({ id: 'messe', startAt: '2026-09-27T10:00:00-04:00' }),
  ];

  assert.deepEqual(
    selectSpecialCelebrations(events, NOW, 1).map(({ id }) => id),
    ['messe'],
  );
});
