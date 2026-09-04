import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeScheduleTime as normalizeInSite } from '../src/lib/schedules/schedule-time.ts';
import { normalizeScheduleTime as normalizeInStudio } from '../studio/lib/scheduleTime.ts';
import {
  formatTimeLabel,
  parseTimeToMinutes,
} from '../src/lib/schedules/schedule-format.ts';
import { normalizeSanityMassSchedule } from '../src/lib/content/normalizeSanityMassSchedule.ts';
import { massScheduleData } from '../src/data/schedules.ts';

/**
 * Espace insécable (U+00A0), nommé parce qu'il est indiscernable d'une espace
 * ordinaire dans le code comme dans le champ du Studio.
 */
const NBSP = ' ';

/**
 * La table de référence. Chaque ligne est une saisie plausible au secrétariat.
 *
 * La colonne de gauche vient d'une intention — « écrire l'heure comme on la
 * dit ». Celle de droite est la seule forme que le site sait calculer.
 */
const ACCEPTED = [
  ['8', '08:00'],
  ['8h', '08:00'],
  ['8 h', '08:00'],
  ['8H', '08:00'],
  ['8:00', '08:00'],
  ['08:00', '08:00'],
  ['8h30', '08:30'],
  ['8 h 30', '08:30'],
  ['08.30', '08:30'],
  ['16', '16:00'],
  ['16 h', '16:00'],
  ['16:00', '16:00'],
  ['16 h 05', '16:05'],
  ['0', '00:00'],
  ['00:00', '00:00'],
  ['23:59', '23:59'],
  // Espaces insécables, tels que les produit une saisie typographiée
  // correctement, ou un copier-coller depuis Word.
  [`8${NBSP}h${NBSP}30`, '08:30'],
  [`${NBSP}16${NBSP}h${NBSP}`, '16:00'],
  [` 8${NBSP}h `, '08:00'],
];

const REJECTED = [
  '',
  '   ',
  '24:00',
  '25 h',
  '8h60',
  // Minute à un seul chiffre : 8 h 05 ou 8 h 50 ? Deviner serait inventer un
  // horaire.
  '8h5',
  '8:0',
  'midi',
  '8 heures',
  '8h30min',
  '8h305',
  '-8',
  '8,30',
];

test('les heures écrites naturellement sont ramenées à HH:mm', () => {
  for (const [input, expected] of ACCEPTED) {
    assert.equal(
      normalizeInSite(input),
      expected,
      `« ${input} » aurait dû donner ${expected}`,
    );
  }
});

test('les saisies incompréhensibles sont refusées plutôt que devinées', () => {
  for (const input of REJECTED) {
    assert.equal(
      normalizeInSite(input),
      undefined,
      `« ${input} » aurait dû être refusé`,
    );
  }
});

test('les valeurs absentes ne produisent pas une heure', () => {
  assert.equal(normalizeInSite(undefined), undefined);
  assert.equal(normalizeInSite(null), undefined);
  assert.equal(normalizeInStudio(undefined), undefined);
  assert.equal(normalizeInStudio(null), undefined);
});

/**
 * Le verrou du jumeau.
 *
 * Le Studio et le site portent chacun leur copie de la fonction : deux paquets
 * distincts, aucun n'important les sources de l'autre. Ce test est ce qui
 * empêche les deux copies de diverger — corriger l'une sans l'autre fait
 * échouer `pnpm validate`.
 */
test('le Studio et le site normalisent exactement pareil', () => {
  for (const [input] of ACCEPTED) {
    assert.equal(
      normalizeInStudio(input),
      normalizeInSite(input),
      `divergence sur « ${input} »`,
    );
  }

  for (const input of REJECTED) {
    assert.equal(
      normalizeInStudio(input),
      normalizeInSite(input),
      `divergence sur « ${input} »`,
    );
  }
});

test('l’affichage accepte une heure écrite à la main', () => {
  assert.equal(formatTimeLabel('8 h 30'), '8 h 30');
  assert.equal(formatTimeLabel('8:00'), '8 h');
  assert.equal(formatTimeLabel('08:00'), '8 h');
  assert.equal(formatTimeLabel('16h'), '16 h');
  assert.equal(formatTimeLabel('midi'), undefined);

  assert.equal(parseTimeToMinutes('8 h 30'), 510);
  assert.equal(parseTimeToMinutes('16:30'), 990);
  assert.equal(parseTimeToMinutes('midi'), undefined);
});

function scheduleFrom(entries) {
  return normalizeSanityMassSchedule(
    {
      regularSchedule: {
        title: 'Horaires réguliers des messes',
        description: null,
        validFrom: null,
        validUntil: null,
        active: true,
        order: 0,
        entries,
      },
      seasonalSchedules: [],
      lastReviewedAt: null,
    },
    massScheduleData,
  );
}

function entry(overrides) {
  return {
    _key: 'entree',
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

/**
 * Le défaut réel qui a motivé tout ceci : une messe saisie « 8:00 » au lieu de
 * « 08:00 » disparaissait du site sans un mot.
 */
test('une heure écrite à la main ne fait plus disparaître la messe', () => {
  const result = scheduleFrom([
    entry({
      _key: 'mercredi',
      weekday: 'wednesday',
      time: '8:00',
      title: 'Messe de semaine',
    }),
  ]);

  const [mercredi] = result.regularSchedule.entries;
  assert.equal(mercredi.dayLabel, 'Mercredi');
  assert.deepEqual(
    mercredi.times.map((time) => time.label),
    ['8 h'],
  );
});

/**
 * Les heures d'un même jour s'affichent dans l'ordre du tableau Sanity, quelle
 * que soit la forme saisie. Le site les triait autrefois sur leur forme
 * normalisée; il ne trie plus rien — voir `normalizeSanityMassSchedule`, où le
 * champ « Ordre d'affichage » et le glisser-déposer se contredisaient. La
 * normalisation reste indispensable : sans elle, « 8:00 » ne produit aucun
 * libellé et la messe disparaît, ce que vérifie le test précédent.
 */
test('les heures d’un même jour suivent l’ordre choisi dans le Studio', () => {
  const result = scheduleFrom([
    entry({ _key: 'matin', time: '8:00' }),
    entry({ _key: 'soir', time: '16:00' }),
  ]);

  const [dimanche] = result.regularSchedule.entries;
  assert.deepEqual(
    dimanche.times.map((time) => time.label),
    ['8 h', '16 h'],
  );

  const inverse = scheduleFrom([
    entry({ _key: 'soir', time: '16:00' }),
    entry({ _key: 'matin', time: '8:00' }),
  ]);

  assert.deepEqual(
    inverse.regularSchedule.entries[0].times.map((time) => time.label),
    ['16 h', '8 h'],
  );
});
