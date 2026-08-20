import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { normalizeSanityContactPage } from '../src/lib/content/normalizeSanityContactPage.ts';
import {
  buildContactAccessNotes,
  buildContactMethods,
  buildContactOfficeHours,
} from '../src/data/contact.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const siteSettings = (overrides = {}) => ({
  organizationName: 'Paroisse Saint-René-Goupil',
  address: {
    street: '4251 Rue Parc René-Goupil',
    city: 'Montréal',
    province: 'Québec',
    postalCode: 'H1Z 1X8',
    country: 'Canada',
    formatted: '4251 Rue Parc René-Goupil, Montréal, Québec H1Z 1X8',
  },
  phone: {
    display: '514 722-1161',
    international: '+1 514 722-1161',
    e164: '+15147221161',
  },
  directionsUrl: 'https://maps.example/itineraire',
  map: {
    latitude: 45,
    longitude: -73,
    embedUrl: 'https://map',
    title: 'Carte',
  },
  ...overrides,
});

const fallback = {
  seo: { title: 'Contact', description: 'Locale.', noIndex: true },
  hero: {
    eyebrow: 'Communication',
    title: 'Nous joindre',
    introduction: 'Introduction locale.',
  },
  methods: [{ id: 'phone', kind: 'phone', label: 'Téléphone', value: '514' }],
  methodsFallback: { title: 'Titre local', description: 'Description locale.' },
  officeHours: {
    title: 'Heures du secrétariat',
    schedule: ['Mardi et jeudi de 9 h à 14 h 30'],
    note: 'Note locale.',
  },
  location: {
    title: 'Nous trouver',
    description: 'Description locale.',
    address: '4251 Rue Parc René-Goupil',
    mapEmbedUrl: 'https://map',
    mapTitle: 'Carte',
    directionsCta: { label: 'Itinéraire', href: 'https://maps.example' },
    accessNotes: ['Stationnement partagé.', 'Rampe d’accès.'],
  },
  form: {
    title: 'Préparer votre message',
    introduction: 'Introduction locale.',
    fields: [
      {
        name: 'reason',
        label: 'Motif de contact',
        type: 'select',
        required: true,
        placeholder: 'Choisissez un motif',
        options: [{ label: 'Question générale', value: 'general' }],
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        rows: 6,
        minLength: 20,
        maxLength: 2000,
      },
    ],
    unavailableNotice: 'Avis local.',
    validationButtonLabel: 'Vérifier',
    locallyValidNotice: 'Valide localement.',
    privacyNotice: 'Mention locale.',
    privacyPolicyHref: '/politique-de-confidentialite/',
  },
};

test('les heures du secrétariat viennent des coordonnées, pas de la page', () => {
  const avec = buildContactOfficeHours(
    siteSettings({ officeHoursLabel: 'Mardi et jeudi de 9 h à 14 h 30' }),
    'Heures du secrétariat',
  );
  const sans = buildContactOfficeHours(
    siteSettings({ officeHoursLabel: '   ' }),
    'Heures du secrétariat',
  );

  assert.deepEqual(avec.schedule, ['Mardi et jeudi de 9 h à 14 h 30']);
  // Bloc absent tant que la paroisse n'a pas confirmé ses heures.
  assert.equal(sans, undefined);
});

test('stationnement et accessibilité alimentent les notes d’accès', () => {
  const notes = buildContactAccessNotes(
    siteSettings({
      parkingLabel: 'Aucun stationnement réservé.',
      accessibilityLabel: 'Une rampe donne sur Parc René-Goupil.',
    }),
    ['Précision saisie dans le Studio.'],
  );

  assert.deepEqual(notes, [
    'Aucun stationnement réservé.',
    'Une rampe donne sur Parc René-Goupil.',
    'Précision saisie dans le Studio.',
  ]);
});

test('une valeur partagée absente ne laisse pas de ligne vide', () => {
  assert.deepEqual(
    buildContactAccessNotes(siteSettings({ parkingLabel: '  ' })),
    [],
  );
});

test('le courriel n’apparaît qu’une fois confirmé', () => {
  const sans = buildContactMethods(siteSettings());
  const nonConfirme = buildContactMethods(
    siteSettings({
      email: { display: 'x@y.ca', href: 'mailto:x@y.ca', confirmed: false },
    }),
  );
  const confirme = buildContactMethods(
    siteSettings({
      email: { display: 'x@y.ca', href: 'mailto:x@y.ca', confirmed: true },
    }),
  );

  assert.deepEqual(
    sans.map(({ kind }) => kind),
    ['address', 'phone'],
  );
  assert.equal(nonConfirme.length, 2);
  assert.deepEqual(
    confirme.map(({ kind }) => kind),
    ['address', 'phone', 'email'],
  );
});

test('les motifs de contact viennent de Sanity quand la liste est remplie', () => {
  const page = normalizeSanityContactPage(
    {
      hero: null,
      officeHours: null,
      methodsFallback: null,
      location: null,
      form: {
        title: null,
        introduction: null,
        reasons: [
          { _key: 'a', label: 'Baptême', value: 'baptism' },
          { _key: 'b', label: '   ', value: 'vide' },
          { _key: 'c', label: 'Sans clé', value: null },
        ],
        unavailableNotice: null,
        validationButtonLabel: null,
        locallyValidNotice: null,
        privacyNotice: null,
      },
    },
    fallback,
  );

  const reason = page.form.fields.find((field) => field.name === 'reason');
  assert.deepEqual(reason.options, [{ label: 'Baptême', value: 'baptism' }]);
  // Le reste du champ appartient toujours au code.
  assert.equal(reason.required, true);
  assert.equal(reason.placeholder, 'Choisissez un motif');
});

test('une liste de motifs vide laisse ceux du code en place', () => {
  const page = normalizeSanityContactPage(
    {
      hero: null,
      officeHours: null,
      methodsFallback: null,
      location: null,
      form: { reasons: [] },
    },
    fallback,
  );

  const reason = page.form.fields.find((field) => field.name === 'reason');
  assert.deepEqual(reason.options, [
    { label: 'Question générale', value: 'general' },
  ]);
});

test('les règles de validation ne sont jamais lues depuis Sanity', () => {
  const queries = read('src/lib/sanity/queries.ts');
  const contactQuery = queries.slice(
    queries.indexOf('CONTACT_PAGE_QUERY = defineQuery'),
    queries.indexOf('SCHEDULE_PAGE_QUERY = defineQuery'),
  );
  const schema = read('studio/schemaTypes/documents/contactPageType.ts');

  for (const forbidden of [
    'pattern',
    'minLength',
    'maxLength',
    'autocomplete',
    'requiredMessage',
    'invalidMessage',
  ]) {
    assert.doesNotMatch(contactQuery, new RegExp(forbidden), forbidden);
    assert.doesNotMatch(schema, new RegExp(`name: '${forbidden}'`), forbidden);
  }
});

test('aucune coordonnée ne se saisit dans le document de page', () => {
  const schema = read('studio/schemaTypes/documents/contactPageType.ts');
  const contract = read('src/types/contact.ts');

  for (const forbidden of [
    "name: 'phone'",
    "name: 'address'",
    "name: 'email'",
    "name: 'schedule'",
    "name: 'mapEmbedUrl'",
    "name: 'directionsCta'",
  ]) {
    assert.doesNotMatch(
      schema,
      new RegExp(forbidden.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')),
    );
  }

  // Les champs éditoriaux supprimés ne reviennent pas par la porte du contrat.
  assert.doesNotMatch(contract, /ContactContentStatus/);
  assert.doesNotMatch(contract, /readonly order:|readonly active:/);
});

test('le seo et la politique de confidentialité restent des décisions de code', () => {
  const page = normalizeSanityContactPage(null, fallback);

  assert.equal(page.seo.noIndex, true);
  assert.equal(page.form.privacyPolicyHref, '/politique-de-confidentialite/');
  assert.equal(page.location.mapEmbedUrl, 'https://map');
});

test('le bloc des heures ne s’invente pas depuis le Studio', () => {
  const page = normalizeSanityContactPage(
    { officeHours: { title: 'Titre Sanity', note: 'Note Sanity' } },
    { ...fallback, officeHours: undefined },
  );

  // Sans horaire dans les coordonnées, un titre saisi ne fait pas apparaître le
  // bloc : il n'aurait rien à afficher.
  assert.equal(page.officeHours, undefined);
});

test('les textes de page viennent de Sanity, les champs vides laissent le repli', () => {
  const page = normalizeSanityContactPage(
    {
      hero: { eyebrow: 'Merci', title: null, introduction: '  ' },
      officeHours: { title: 'Heures du bureau', note: null },
      methodsFallback: { title: null, description: 'Description Sanity.' },
      location: {
        title: 'Où nous sommes',
        description: null,
        extraNotes: ['Note Sanity.', '   '],
      },
      form: { title: 'Écrire', reasons: null },
    },
    fallback,
  );

  assert.equal(page.hero.eyebrow, 'Merci');
  assert.equal(page.hero.title, 'Nous joindre');
  assert.equal(page.hero.introduction, 'Introduction locale.');
  assert.equal(page.officeHours.title, 'Heures du bureau');
  assert.equal(page.officeHours.note, 'Note locale.');
  assert.equal(page.methodsFallback.title, 'Titre local');
  assert.equal(page.location.title, 'Où nous sommes');
  // Les faits partagés restent en tête, la précision du Studio suit.
  assert.deepEqual(page.location.accessNotes, [
    'Stationnement partagé.',
    'Rampe d’accès.',
    'Note Sanity.',
  ]);
  assert.equal(page.form.title, 'Écrire');
});
