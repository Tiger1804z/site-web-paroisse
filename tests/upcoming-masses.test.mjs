import assert from 'node:assert/strict';
import test from 'node:test';
import { parseTimeToMinutes } from '../src/lib/schedules/schedule-format.ts';
import {
  getUpcomingMasses,
  getZonedNow,
} from '../src/lib/schedules/upcoming-masses.ts';
import { toWeeklyMassEntries } from '../src/lib/schedules/weekly-masses.ts';

const TIME_ZONE = 'America/Toronto';

let keyCounter = 0;

function rawEntry(overrides = {}) {
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
    ...overrides,
  };
}

function rawDocument(regularOverrides = {}, documentOverrides = {}) {
  return {
    regularSchedule: {
      title: 'Horaires réguliers des messes',
      description: null,
      validFrom: null,
      validUntil: null,
      active: true,
      entries: [rawEntry()],
      ...regularOverrides,
    },
    seasonalSchedules: null,
    lastReviewedAt: null,
    ...documentOverrides,
  };
}

function mass(overrides = {}) {
  return {
    id: 'messe',
    weekday: 'sunday',
    time: '09:00',
    title: 'Messe dominicale',
    ...overrides,
  };
}

test('un document absent ne produit aucune célébration calculable', () => {
  assert.deepEqual(toWeeklyMassEntries(null), []);
});

test('un horaire régulier inactif ne produit rien', () => {
  assert.deepEqual(toWeeklyMassEntries(rawDocument({ active: false })), []);
});

test('les valeurs machine traversent intactes', () => {
  const [entry] = toWeeklyMassEntries(
    rawDocument({
      entries: [
        rawEntry({
          _key: 'samedi-16h',
          weekday: 'saturday',
          time: '16:00',
          title: 'Vigile',
          note: 'Chorale',
        }),
      ],
    }),
  );

  assert.deepEqual(entry, {
    id: 'samedi-16h',
    weekday: 'saturday',
    time: '16:00',
    title: 'Vigile',
    note: 'Chorale',
  });
});

test('les entrées non calculables sont écartées', () => {
  const entries = toWeeklyMassEntries(
    rawDocument({
      entries: [
        rawEntry({ weekday: 'saturday', time: '16:00', title: 'Vigile' }),
        rawEntry({ active: false }),
        rawEntry({
          recurrenceType: 'custom',
          weekday: null,
          displayLabel: 'Premier vendredi du mois',
          time: '19:00',
        }),
        rawEntry({ weekday: 'monday', time: '25:00' }),
        rawEntry({ weekday: 'tuesday', time: null }),
        rawEntry({ weekday: 'friday', title: '  ' }),
      ],
    }),
  );

  assert.deepEqual(
    entries.map(({ weekday }) => weekday),
    ['saturday'],
  );
});

test('l’ordre du tableau est conservé tel quel', () => {
  const entries = toWeeklyMassEntries(
    rawDocument({
      entries: [
        rawEntry({ weekday: 'sunday', time: '11:00' }),
        rawEntry({ weekday: 'saturday', time: '16:00' }),
        rawEntry({ weekday: 'sunday', time: '09:00' }),
      ],
    }),
  );

  // Le classement chronologique n’est pas le travail de cette fonction :
  // `getUpcomingMasses` calcule la prochaine messe à partir du jour et de
  // l’heure, quel que soit l’ordre de la liste.
  assert.deepEqual(
    entries.map(({ weekday, time }) => `${weekday} ${time}`),
    ['sunday 11:00', 'saturday 16:00', 'sunday 09:00'],
  );
});

test('les horaires saisonniers n’alimentent pas le calcul', () => {
  const entries = toWeeklyMassEntries(
    rawDocument(
      { entries: [] },
      {
        seasonalSchedules: [
          {
            _key: 'seasonal-ete',
            title: 'Horaire d’été',
            description: null,
            validFrom: null,
            validUntil: null,
            active: true,
            entries: [rawEntry({ weekday: 'sunday', time: '10:00' })],
          },
        ],
      },
    ),
  );

  assert.deepEqual(entries, []);
});

test('les minutes se dérivent de l’heure, sans second stockage', () => {
  assert.equal(parseTimeToMinutes('00:00'), 0);
  assert.equal(parseTimeToMinutes('16:30'), 990);
  assert.equal(parseTimeToMinutes('23:59'), 1439);
  assert.equal(parseTimeToMinutes('24:00'), undefined);
  assert.equal(parseTimeToMinutes(null), undefined);
});

test('l’instant est lu dans le fuseau de la paroisse, pas celui de l’hôte', () => {
  // 2026-07-29T18:00Z = mercredi 14 h à Toronto (EDT, UTC-4).
  assert.deepEqual(getZonedNow(new Date('2026-07-29T18:00:00Z'), TIME_ZONE), {
    weekdayIndex: 3,
    minutes: 14 * 60,
  });
});

test('aucune entrée ne donne aucune prochaine messe', () => {
  assert.deepEqual(
    getUpcomingMasses(new Date('2026-07-29T18:00:00Z'), TIME_ZONE, []),
    [],
  );
});

test('une célébration plus tard le jour même reste aujourd’hui', () => {
  // Dimanche 2026-08-02, 8 h à Toronto.
  const [next] = getUpcomingMasses(
    new Date('2026-08-02T12:00:00Z'),
    TIME_ZONE,
    [mass()],
  );

  assert.equal(next.dayOffset, 0);
  assert.equal(next.relativeDayLabel, 'Aujourd’hui');
  assert.equal(next.dayLabel, 'Dimanche');
  assert.equal(next.timeLabel, '9 h');
});

test('une célébration qui commence à la minute même compte encore', () => {
  const [next] = getUpcomingMasses(
    new Date('2026-08-02T13:00:00Z'),
    TIME_ZONE,
    [mass()],
  );

  assert.equal(next.dayOffset, 0);
});

test('une célébration déjà passée bascule à la semaine suivante', () => {
  // Dimanche 10 h à Toronto : la messe de 9 h est passée.
  const [next] = getUpcomingMasses(
    new Date('2026-08-02T14:00:00Z'),
    TIME_ZONE,
    [mass()],
  );

  assert.equal(next.dayOffset, 7);
  assert.equal(next.relativeDayLabel, 'Dimanche');
});

test('la bascule dimanche → lundi respecte l’ordre de la semaine', () => {
  const upcoming = getUpcomingMasses(
    new Date('2026-08-02T14:00:00Z'),
    TIME_ZONE,
    [
      mass({ id: 'dimanche', weekday: 'sunday', time: '09:00' }),
      mass({ id: 'lundi', weekday: 'monday', time: '08:00', title: 'Messe' }),
    ],
  );

  assert.deepEqual(
    upcoming.map(({ id, relativeDayLabel }) => `${id}:${relativeDayLabel}`),
    ['lundi:Demain', 'dimanche:Dimanche'],
  );
});

test('plusieurs célébrations sont triées de la plus proche à la plus lointaine', () => {
  // Samedi 2026-08-01, 10 h à Toronto.
  const upcoming = getUpcomingMasses(
    new Date('2026-08-01T14:00:00Z'),
    TIME_ZONE,
    [
      mass({ id: 'dimanche-11h', weekday: 'sunday', time: '11:00' }),
      mass({ id: 'samedi-16h', weekday: 'saturday', time: '16:00' }),
      mass({ id: 'dimanche-9h', weekday: 'sunday', time: '09:00' }),
    ],
  );

  assert.deepEqual(
    upcoming.map(({ id }) => id),
    ['samedi-16h', 'dimanche-9h', 'dimanche-11h'],
  );
  assert.deepEqual(
    upcoming.map(({ relativeDayLabel }) => relativeDayLabel),
    ['Aujourd’hui', 'Demain', 'Demain'],
  );
});

test('la limite borne le nombre de résultats', () => {
  const entries = [
    mass({ id: 'samedi', weekday: 'saturday', time: '16:00' }),
    mass({ id: 'dimanche-9h', weekday: 'sunday', time: '09:00' }),
    mass({ id: 'dimanche-11h', weekday: 'sunday', time: '11:00' }),
  ];
  const now = new Date('2026-08-01T14:00:00Z');

  assert.equal(getUpcomingMasses(now, TIME_ZONE, entries, 1).length, 1);
  assert.deepEqual(getUpcomingMasses(now, TIME_ZONE, entries, 0), []);
});

test('le passage à l’heure d’été ne décale pas le calcul', () => {
  // Samedi 2026-03-07 20 h EST ; l’heure avance dans la nuit du 8 mars.
  const [next] = getUpcomingMasses(
    new Date('2026-03-08T01:00:00Z'),
    TIME_ZONE,
    [mass()],
  );

  assert.equal(next.dayOffset, 1);
  assert.equal(next.relativeDayLabel, 'Demain');
  assert.equal(next.timeLabel, '9 h');
});

test('le retour à l’heure normale ne décale pas le calcul non plus', () => {
  // Samedi 2026-10-31 20 h EDT ; l’heure recule dans la nuit du 1er novembre.
  const [next] = getUpcomingMasses(
    new Date('2026-11-01T00:00:00Z'),
    TIME_ZONE,
    [mass()],
  );

  assert.equal(next.dayOffset, 1);
  assert.equal(next.relativeDayLabel, 'Demain');
});

test('un jour inconnu venu du JSON client est ignoré', () => {
  assert.deepEqual(
    getUpcomingMasses(new Date('2026-08-01T14:00:00Z'), TIME_ZONE, [
      mass({ weekday: 'lundi' }),
    ]),
    [],
  );
});
