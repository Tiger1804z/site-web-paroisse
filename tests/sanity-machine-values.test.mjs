import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { vercelStegaCombine } from '@vercel/stega';
import {
  cleanMachineValues,
  MACHINE_VALUE_FIELDS,
} from '../src/lib/sanity/machine-values.ts';
import { toWeeklyMassEntries } from '../src/lib/schedules/weekly-masses.ts';
import { normalizeSanityMassSchedule } from '../src/lib/content/normalizeSanityMassSchedule.ts';
import { normalizeSanityEventsPage } from '../src/lib/content/normalizeSanityEventsPage.ts';
import { normalizeSanityParishEvents } from '../src/lib/content/normalizeSanityParishEvents.ts';
import { selectUpcomingParishEvents } from '../src/lib/events/parish-events.ts';

/**
 * Encode une chaîne exactement comme le fait la prévisualisation : l'adresse du
 * champ, en caractères de largeur nulle, collée à la valeur. C'est le même
 * encodeur que celui qu'utilise `@sanity/client`.
 */
const encoded = (value, path = 'test:field') =>
  vercelStegaCombine(value, {
    origin: 'sanity.io',
    href: `https://studio.test/intent/edit/${path}`,
  });

/** Applique `encoded` à toutes les chaînes d'une structure, en profondeur. */
function encodeDeep(value) {
  if (typeof value === 'string') return encoded(value);
  if (Array.isArray(value)) return value.map(encodeDeep);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, encodeDeep(entry)]),
    );
  }
  return value;
}

/**
 * Points de code de largeur nulle : la trace que laisse l'encodage stega.
 *
 * Écrits par leur valeur numérique, pas en littéral — ces caractères sont
 * invisibles dans un éditeur, et `no-irregular-whitespace` les refuse à juste
 * titre dans du code source.
 */
const ZERO_WIDTH_CODE_POINTS = new Set([
  0x200b, 0x200c, 0x200d, 0x200e, 0x200f, 0x2060, 0xfeff,
]);

const carriesStega = (value) =>
  [...value].some((character) =>
    ZERO_WIDTH_CODE_POINTS.has(character.codePointAt(0)),
  );

// ---------------------------------------------------------------------------
// La liste des champs machine ne doit pas prendre de retard sur le schéma.
// ---------------------------------------------------------------------------

test('tout champ à valeurs contrôlées du schéma est déclaré comme valeur machine', () => {
  // `studio/schema.json` est produit par TypeGen et n'est pas suivi par git.
  // Sans lui, cette garantie ne peut pas s'exercer : on le dit franchement
  // plutôt que de laisser remonter un ENOENT.
  let raw;
  try {
    raw = readFileSync('studio/schema.json', 'utf8');
  } catch {
    assert.fail(
      'studio/schema.json est absent. Lancer « pnpm sanity:typegen » avant les tests — la CI le fait déjà.',
    );
  }

  const schema = JSON.parse(raw);
  const uncovered = new Set();

  const isStringUnion = (value) =>
    value?.type === 'union' &&
    Array.isArray(value.of) &&
    value.of.length > 0 &&
    value.of.every(
      (member) => member?.type === 'string' && typeof member.value === 'string',
    );

  const isSlug = (value) =>
    (value?.type === 'inline' && value.name === 'slug') ||
    value?.attributes?._type?.value?.value === 'slug';

  const walk = (node) => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (!node || typeof node !== 'object') return;

    if (node.attributes && typeof node.attributes === 'object') {
      for (const [name, attribute] of Object.entries(node.attributes)) {
        const value = attribute?.value;
        if (!value) continue;
        if (
          (isStringUnion(value) || isSlug(value)) &&
          !MACHINE_VALUE_FIELDS.has(name)
        ) {
          uncovered.add(name);
        }
      }
    }

    for (const child of Object.values(node)) {
      if (child && typeof child === 'object') walk(child);
    }
  };

  walk(schema);

  assert.deepEqual(
    [...uncovered].sort(),
    [],
    'Champs à valeurs contrôlées absents de MACHINE_VALUE_FIELDS. Les ajouter dans src/lib/sanity/machine-values.ts, sinon la prévisualisation cassera silencieusement.',
  );
});

// ---------------------------------------------------------------------------
// Comportement du nettoyage.
// ---------------------------------------------------------------------------

test('les valeurs machine sont nettoyées, les textes éditoriaux conservent leur encodage', () => {
  const raw = {
    weekday: encoded('tuesday'),
    time: encoded('08:00'),
    title: encoded('Messe de semaine'),
    summary: encoded('Un texte que l’éditrice peut cliquer.'),
  };

  const cleaned = cleanMachineValues(raw);

  assert.equal(cleaned.weekday, 'tuesday');
  assert.equal(cleaned.time, '08:00');
  assert.ok(carriesStega(cleaned.title), 'le titre garde son click-to-edit');
  assert.ok(carriesStega(cleaned.summary), 'le résumé garde son click-to-edit');
});

test('le nettoyage traverse tableaux et objets imbriqués', () => {
  const cleaned = cleanMachineValues({
    entries: [{ weekday: encoded('sunday'), note: encoded('Note visible') }],
    nested: { deep: { status: encoded('active') } },
  });

  assert.equal(cleaned.entries[0].weekday, 'sunday');
  assert.ok(carriesStega(cleaned.entries[0].note));
  assert.equal(cleaned.nested.deep.status, 'active');
});

test('le nettoyage ne mute pas le résultat reçu', () => {
  const raw = { weekday: encoded('friday') };
  const before = raw.weekday;

  cleanMachineValues(raw);

  assert.equal(raw.weekday, before);
});

test('hors prévisualisation, le nettoyage laisse tout intact', () => {
  const raw = { weekday: 'monday', title: 'Messe', order: 3, active: true };

  assert.deepEqual(cleanMachineValues(raw), raw);
});

test('les tableaux de chaînes machine sont nettoyés élément par élément', () => {
  const cleaned = cleanMachineValues({ slug: [encoded('a'), encoded('b')] });

  assert.deepEqual(cleaned.slug, ['a', 'b']);
});

// ---------------------------------------------------------------------------
// Régressions relevées par l'audit du 31 juillet 2026.
// Chacun de ces tests échoue si `cleanMachineValues` est retiré de `loadQuery`.
// ---------------------------------------------------------------------------

const massScheduleDocument = {
  regularSchedule: {
    title: 'Horaires réguliers des messes',
    description: 'Horaire des messes de juin et juillet.',
    validFrom: null,
    validUntil: null,
    active: true,
    order: 0,
    entries: [
      {
        _key: 'messe-mardi-08h',
        recurrenceType: 'weekly',
        weekday: 'tuesday',
        displayLabel: null,
        time: '08:00',
        title: 'Messe de semaine',
        note: null,
        active: true,
        order: 0,
      },
      {
        _key: 'messe-dimanche-10h',
        recurrenceType: 'weekly',
        weekday: 'sunday',
        displayLabel: null,
        time: '10:00',
        title: 'Messe dominicale',
        note: null,
        active: true,
        order: 1,
      },
    ],
  },
  seasonalSchedules: null,
  lastReviewedAt: '2026-07-29T20:16:00.000Z',
};

test('preview : les célébrations hebdomadaires survivent à l’encodage', () => {
  const polluted = encodeDeep(massScheduleDocument);

  assert.equal(
    toWeeklyMassEntries(polluted).length,
    0,
    'sans nettoyage, toutes les entrées sont rejetées — c’est le défaut mesuré',
  );

  const entries = toWeeklyMassEntries(cleanMachineValues(polluted));

  assert.equal(entries.length, 2);
  assert.deepEqual(
    entries.map(({ weekday, time }) => [weekday, time]),
    [
      ['tuesday', '08:00'],
      ['sunday', '10:00'],
    ],
  );
});

test('preview : la page Horaires affiche encore ses libellés de jour et d’heure', () => {
  const fallback = {
    regularSchedule: {
      id: 'repli',
      title: 'Repli',
      description: undefined,
      entries: [],
      validityLabel: undefined,
    },
    seasonalSchedules: [],
    specialCelebrations: [],
    lastUpdatedLabel: 'Repli',
    specialCelebrationsEmptyMessage: 'Aucune célébration annoncée.',
  };

  const normalized = normalizeSanityMassSchedule(
    cleanMachineValues(encodeDeep(massScheduleDocument)),
    fallback,
  );

  const labels = normalized.regularSchedule.entries.map(
    ({ dayLabel, times }) =>
      `${dayLabel} ${times.map(({ label }) => label).join(', ')}`,
  );

  assert.deepEqual(labels, ['Mardi 8 h', 'Dimanche 10 h']);
});

const parishEventDocuments = [
  {
    _id: 'event-a',
    title: 'Pèlerinage au Sanctuaire Notre-Dame-du-Cap',
    slug: 'pelerinage-notre-dame-du-cap',
    excerpt: 'Une journée de pèlerinage.',
    description: null,
    category: 'pilgrimage',
    startAt: '2026-08-15T12:00:00.000Z',
    endAt: null,
    locationName: 'Trois-Rivières',
    meetingPoint: null,
    departureAt: null,
    returnAt: null,
    price: null,
    capacityNotice: null,
    contact: null,
    cta: null,
    coverImage: null,
    gallery: null,
    publicationStatus: 'published',
    showOnWebsite: true,
    showOnHomepage: true,
    showInArchive: true,
    featured: true,
    homepagePriority: 1,
  },
];

test('preview : les événements publiés restent visibles', () => {
  const polluted = encodeDeep(parishEventDocuments);
  const buildSources = () => ({ src: 'https://cdn.test/x', srcSet: '' });
  const now = new Date('2026-08-01T00:00:00.000Z');

  const withoutCleaning = selectUpcomingParishEvents(
    normalizeSanityParishEvents(polluted, buildSources),
    now,
  );
  assert.equal(
    withoutCleaning.length,
    0,
    'sans nettoyage, publicationStatus ne vaut plus « published » — c’est le défaut mesuré',
  );

  const events = selectUpcomingParishEvents(
    normalizeSanityParishEvents(cleanMachineValues(polluted), buildSources),
    now,
  );

  assert.equal(events.length, 1);
  assert.equal(events[0].category, 'pilgrimage');
  assert.equal(events[0].slug, 'pelerinage-notre-dame-du-cap');
});

test('preview : les catégories d’événements gardent leur visuel et leur nature', () => {
  const document = {
    hero: null,
    overview: null,
    categories: [
      {
        _key: 'concerts',
        title: 'Concerts et événements culturels',
        summary: 'La paroisse peut accueillir des concerts.',
        kind: 'cultural',
        visualKind: 'clothing-rack',
        illustrationLabel: null,
        ctaTarget: 'none',
        ctaLabel: null,
        featured: true,
        active: true,
        confirmationRequired: true,
        image: null,
      },
    ],
    upcomingSectionTitle: null,
    showUpcomingSection: null,
    upcomingLimit: null,
    pastSectionTitle: null,
    showPastSection: null,
    pastLimit: null,
  };

  const fallback = {
    seo: { title: 'Repli', description: 'Repli' },
    hero: {
      eyebrow: 'Repli',
      title: 'Repli',
      introduction: 'Repli',
      image: { kind: 'image', image: {}, imageAlt: 'Repli' },
    },
    overview: {
      eyebrow: 'Repli',
      title: 'Repli',
      introduction: 'Repli',
      confirmationNote: 'Repli',
    },
    categories: [
      {
        slug: 'repli-local',
        title: 'Catégorie du repli local',
        summary: 'Ne doit pas apparaître.',
        category: 'mutual-aid',
        visual: { kind: 'generations-chain' },
        featured: false,
        active: true,
        confirmationRequired: false,
      },
    ],
    upcomingSectionTitle: 'Repli',
    pastSectionTitle: 'Repli',
    upcomingLimit: 4,
    pastLimit: 4,
  };

  const buildSources = () => ({ src: 'https://cdn.test/x', srcSet: '' });

  const withoutCleaning = normalizeSanityEventsPage(
    encodeDeep(document),
    fallback,
    buildSources,
  );
  // Sans nettoyage, `visualKind` et `kind` sont illisibles : la catégorie perd
  // son illustration et retombe sur un libellé par défaut.
  assert.equal(withoutCleaning.categories[0].visual, undefined);
  assert.notEqual(withoutCleaning.categories[0].category, 'cultural');

  const page = normalizeSanityEventsPage(
    cleanMachineValues(encodeDeep(document)),
    fallback,
    buildSources,
  );

  assert.equal(page.categories.length, 1);
  // Le titre est du texte éditorial : il garde son encodage, c'est lui qui
  // porte le click-to-edit. Seules les valeurs machine sont nettoyées.
  assert.ok(
    page.categories[0].title.startsWith('Concerts et événements culturels'),
    'la catégorie vient bien de Sanity',
  );
  assert.ok(carriesStega(page.categories[0].title));
  assert.equal(page.categories[0].category, 'cultural');
  assert.equal(page.categories[0].visual.kind, 'clothing-rack');
});
