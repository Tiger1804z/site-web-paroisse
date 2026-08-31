import assert from 'node:assert/strict';
import test from 'node:test';
import { massScheduleData } from '../src/data/schedules.ts';
import { normalizeSanityMassSchedule } from '../src/lib/content/normalizeSanityMassSchedule.ts';
import {
  formatDateOnlyLabel,
  formatReviewedAtLabel,
  formatTimeLabel,
} from '../src/lib/schedules/schedule-format.ts';

const fallback = massScheduleData;

let keyCounter = 0;

function entry(overrides = {}) {
  keyCounter += 1;
  return {
    _key: `entry-${keyCounter}`,
    recurrenceType: 'weekly',
    weekday: 'sunday',
    displayLabel: null,
    time: '09:00',
    title: 'Messe dominicale',
    note: null,
    active: true,
    order: 0,
    ...overrides,
  };
}

function period(overrides = {}) {
  return {
    title: 'Horaires réguliers des messes',
    description: null,
    validFrom: null,
    validUntil: null,
    active: true,
    order: 0,
    entries: [entry()],
    ...overrides,
  };
}

function document(overrides = {}) {
  return {
    regularSchedule: period(),
    seasonalSchedules: null,
    lastReviewedAt: null,
    ...overrides,
  };
}

test('un document absent laisse le repli local intact', () => {
  assert.deepEqual(normalizeSanityMassSchedule(null, fallback), fallback);
});

test('un horaire régulier sans entrée exploitable conserve le repli', () => {
  const result = normalizeSanityMassSchedule(
    document({
      regularSchedule: period({ entries: [] }),
      seasonalSchedules: [period({ title: 'Horaire d’été' })],
    }),
    fallback,
  );

  assert.deepEqual(result, fallback);
});

test('deux messes le même jour forment une seule ligne à deux heures', () => {
  const result = normalizeSanityMassSchedule(
    document({
      regularSchedule: period({
        entries: [
          entry({ weekday: 'sunday', time: '09:00', order: 1 }),
          entry({ weekday: 'sunday', time: '11:00', order: 1 }),
        ],
      }),
    }),
    fallback,
  );

  const [line] = result.regularSchedule.entries;
  assert.equal(result.regularSchedule.entries.length, 1);
  assert.equal(line.id, 'sunday');
  assert.equal(line.dayLabel, 'Dimanche');
  assert.equal(line.note, 'Messe dominicale');
  assert.deepEqual(
    line.times.map(({ label }) => label),
    ['9 h', '11 h'],
  );
  assert.equal(line.times[0].note, undefined);
});

test('des titres différents dans un groupe passent en note par heure', () => {
  const result = normalizeSanityMassSchedule(
    document({
      regularSchedule: period({
        entries: [
          entry({
            weekday: 'sunday',
            time: '09:00',
            title: 'Messe dominicale',
          }),
          entry({
            weekday: 'sunday',
            time: '11:00',
            title: 'Messe en italien',
            note: 'Chorale',
          }),
        ],
      }),
    }),
    fallback,
  );

  const [line] = result.regularSchedule.entries;
  assert.equal(line.note, undefined);
  assert.equal(line.times[0].note, 'Messe dominicale');
  assert.equal(line.times[1].note, 'Messe en italien · Chorale');
});

test('les entrées sont triées par ordre puis par heure', () => {
  const result = normalizeSanityMassSchedule(
    document({
      regularSchedule: period({
        entries: [
          entry({ weekday: 'sunday', time: '11:00', order: 2 }),
          entry({
            weekday: 'saturday',
            time: '16:00',
            order: 1,
            title: 'Vigile',
          }),
          entry({ weekday: 'sunday', time: '09:00', order: 2 }),
        ],
      }),
    }),
    fallback,
  );

  assert.deepEqual(
    result.regularSchedule.entries.map(({ dayLabel }) => dayLabel),
    ['Samedi', 'Dimanche'],
  );
  assert.deepEqual(
    result.regularSchedule.entries[1].times.map(({ label }) => label),
    ['9 h', '11 h'],
  );
});

test('sans numéro d’ordre, la position dans le tableau fait foi', () => {
  const result = normalizeSanityMassSchedule(
    document({
      regularSchedule: period({
        entries: [
          entry({
            weekday: 'saturday',
            time: '16:00',
            title: 'Vigile',
            order: null,
          }),
          entry({ weekday: 'sunday', time: '09:00', order: null }),
        ],
      }),
    }),
    fallback,
  );

  // Sans cette règle, le tri par heure remonterait le dimanche 9 h avant le
  // samedi 16 h, à rebours de l’ordre choisi dans le Studio.
  assert.deepEqual(
    result.regularSchedule.entries.map(({ dayLabel }) => dayLabel),
    ['Samedi', 'Dimanche'],
  );
});

test('une entrée inactive est exclue', () => {
  const result = normalizeSanityMassSchedule(
    document({
      regularSchedule: period({
        entries: [
          entry({ weekday: 'saturday', time: '16:00', title: 'Vigile' }),
          entry({ weekday: 'sunday', time: '09:00', active: false }),
        ],
      }),
    }),
    fallback,
  );

  assert.deepEqual(
    result.regularSchedule.entries.map(({ dayLabel }) => dayLabel),
    ['Samedi'],
  );
});

test('une entrée hebdomadaire sans heure valide est ignorée', () => {
  const result = normalizeSanityMassSchedule(
    document({
      regularSchedule: period({
        entries: [
          entry({ weekday: 'saturday', time: '16:00', title: 'Vigile' }),
          entry({ weekday: 'sunday', time: '25:00' }),
          entry({ weekday: 'monday', time: null }),
        ],
      }),
    }),
    fallback,
  );

  assert.deepEqual(
    result.regularSchedule.entries.map(({ dayLabel }) => dayLabel),
    ['Samedi'],
  );
});

test('une entrée personnalisée sans heure affiche son titre comme heure', () => {
  const result = normalizeSanityMassSchedule(
    document({
      regularSchedule: period({
        entries: [
          entry({
            recurrenceType: 'custom',
            weekday: null,
            displayLabel: 'Premier vendredi du mois',
            time: null,
            title: 'Adoration',
          }),
        ],
      }),
    }),
    fallback,
  );

  const [line] = result.regularSchedule.entries;
  assert.equal(line.dayLabel, 'Premier vendredi du mois');
  assert.equal(line.note, undefined);
  assert.deepEqual(line.times, [{ label: 'Adoration', note: undefined }]);
});

test('un groupe inactif est conservé mais marqué inactif', () => {
  const result = normalizeSanityMassSchedule(
    document({ regularSchedule: period({ active: false }) }),
    fallback,
  );

  assert.equal(result.regularSchedule.active, false);
});

test('les horaires saisonniers gardent leur _key comme identifiant', () => {
  const result = normalizeSanityMassSchedule(
    document({
      seasonalSchedules: [
        {
          _key: 'seasonal-ete',
          ...period({
            title: 'Horaire d’été',
            validFrom: '2026-06-21',
            validUntil: '2026-09-06',
          }),
        },
        { _key: 'seasonal-vide', ...period({ entries: [] }) },
      ],
    }),
    fallback,
  );

  assert.equal(result.seasonalSchedules.length, 1);
  assert.equal(result.seasonalSchedules[0].id, 'seasonal-ete');
  assert.equal(result.seasonalSchedules[0].validFromLabel, '21 juin 2026');
  assert.equal(result.seasonalSchedules[0].validUntilLabel, '6 septembre 2026');
});

test('lastReviewedAt est lu dans le fuseau de la paroisse', () => {
  const sameDay = normalizeSanityMassSchedule(
    document({ lastReviewedAt: '2026-08-11T14:00:00Z' }),
    fallback,
  );
  const previousEvening = normalizeSanityMassSchedule(
    document({ lastReviewedAt: '2026-08-11T02:00:00Z' }),
    fallback,
  );

  assert.equal(sameDay.lastUpdatedLabel, '11 août 2026');
  assert.equal(previousEvening.lastUpdatedLabel, '10 août 2026');
});

test('sans lastReviewedAt aucune date n’est inventée', () => {
  const result = normalizeSanityMassSchedule(document(), fallback);

  assert.equal(result.lastUpdatedLabel, undefined);
});

test('le repli local ne contient aucune heure en dur', () => {
  assert.deepEqual(massScheduleData.regularSchedule.entries, []);
  assert.deepEqual(massScheduleData.seasonalSchedules, []);
});

test('les heures sont formatées à la française', () => {
  assert.equal(formatTimeLabel('16:00'), '16 h');
  assert.equal(formatTimeLabel('10:30'), '10 h 30');
  assert.equal(formatTimeLabel('09:05'), '9 h 05');
  assert.equal(formatTimeLabel('24:00'), undefined);
  // `16h00` était refusé jusqu'au 30 août 2026. Il ne l'est plus : c'est ainsi
  // qu'on écrit une heure, et refuser cette forme faisait disparaître la messe
  // du site. Voir `tests/schedule-time.test.mjs` pour la table complète.
  assert.equal(formatTimeLabel('16h00'), '16 h');
  assert.equal(formatTimeLabel(null), undefined);
});

test('les dates seules ne glissent pas d’un jour', () => {
  assert.equal(formatDateOnlyLabel('2026-01-01'), '1 janvier 2026');
  assert.equal(formatDateOnlyLabel('2026-13-01'), undefined);
  assert.equal(formatDateOnlyLabel('pas une date'), undefined);
  assert.equal(formatReviewedAtLabel('pas une date'), undefined);
});
