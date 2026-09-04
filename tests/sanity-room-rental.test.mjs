import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { buildRoomRentalPageData } from '../src/data/roomRental.ts';
import { normalizeSanityRoomRentalPage } from '../src/lib/content/normalizeSanityRoomRentalPage.ts';
import { findRoute } from '../src/lib/seo/routes.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const siteSettings = {
  organizationName: 'Paroisse Saint-René-Goupil',
  phone: {
    display: '514 722-1161',
    international: '+1 514 722-1161',
    e164: '+15147221161',
  },
};

const fallback = buildRoomRentalPageData(siteSettings);

function room(overrides = {}) {
  return {
    slug: 'la-ruchee',
    name: 'La Ruchée',
    location: 'Située au jubé',
    capacity: 'Jusqu’à 50 personnes',
    price: '250 $ pour 4 heures',
    description: null,
    ...overrides,
  };
}

function document(overrides = {}) {
  return {
    seo: null,
    hero: null,
    offer: null,
    amenities: null,
    rooms: null,
    practical: null,
    finalCta: null,
    ...overrides,
  };
}

/* -------------------------------------------------------------------------
 * Le repli local
 * ------------------------------------------------------------------------- */

test('un document absent laisse le repli local intact', () => {
  const result = normalizeSanityRoomRentalPage(null, fallback);

  assert.deepEqual(result, fallback);
});

test('le repli publie les deux salles de la paroisse', () => {
  assert.deepEqual(
    fallback.rooms.map(({ name }) => name),
    ['La Ruchée', 'Le sous-sol de l’église'],
  );
});

/* -------------------------------------------------------------------------
 * Ce que Sanity peut changer, et ce qu'il ne peut pas
 * ------------------------------------------------------------------------- */

test('les textes saisis remplacent le repli, champ par champ', () => {
  const result = normalizeSanityRoomRentalPage(
    document({
      hero: {
        eyebrow: 'Louer chez nous',
        title: 'Nos salles',
        introduction: 'Introduction publiée depuis Sanity.',
        image: null,
      },
      offer: {
        eyebrow: null,
        title: 'Titre publié',
        periodLabel: 'Location 2027-2028',
        paragraphs: ['Un seul paragraphe.'],
      },
    }),
    fallback,
  );

  assert.equal(result.hero.title, 'Nos salles');
  assert.equal(result.offer.title, 'Titre publié');
  assert.equal(result.offer.periodLabel, 'Location 2027-2028');
  assert.deepEqual(result.offer.paragraphs, ['Un seul paragraphe.']);
  // Le surtitre n'a pas été saisi : le repli reprend la main sur ce champ seul.
  assert.equal(result.offer.eyebrow, fallback.offer.eyebrow);
});

test('le téléphone et l’adresse du bouton ne viennent jamais du Studio', () => {
  const result = normalizeSanityRoomRentalPage(
    document({
      finalCta: { title: 'Titre publié', description: 'Description publiée.' },
    }),
    fallback,
  );

  assert.equal(result.finalCta.title, 'Titre publié');
  assert.equal(result.finalCta.phone.display, '514 722-1161');
  assert.equal(result.finalCta.primary.href, '/contact/');
});

/* -------------------------------------------------------------------------
 * Les salles
 * ------------------------------------------------------------------------- */

test('une salle sans ancre ou sans nom n’est pas publiée', () => {
  const result = normalizeSanityRoomRentalPage(
    document({
      rooms: [
        room(),
        room({ slug: null, name: 'Salle sans ancre' }),
        room({ slug: 'sans-nom', name: '   ' }),
      ],
    }),
    fallback,
  );

  assert.deepEqual(
    result.rooms.map(({ id }) => id),
    ['la-ruchee'],
  );
});

/**
 * Une salle dont le tarif n'est pas arrêté s'affiche sans ligne de tarif. Le
 * contraire — « à venir », « nous consulter » — est une promesse que le
 * secrétariat devra tenir au téléphone.
 */
test('un tarif ou une capacité absente disparaît, sans texte de remplacement', () => {
  const result = normalizeSanityRoomRentalPage(
    document({
      rooms: [room({ price: '  ', capacity: null })],
    }),
    fallback,
  );

  const [only] = result.rooms;
  assert.equal(only.price, undefined);
  assert.equal(only.capacity, undefined);
  assert.equal(only.location, 'Située au jubé');
});

/**
 * Les salles basculent en bloc : une liste où aucune entrée n'est exploitable
 * ne doit pas produire une page vide, mais rendre la main au repli.
 */
test('une liste de salles inexploitable rend la main au repli', () => {
  const result = normalizeSanityRoomRentalPage(
    document({ rooms: [room({ slug: null, name: null })] }),
    fallback,
  );

  assert.deepEqual(result.rooms, fallback.rooms);
});

test('une étape à moitié saisie n’est pas affichée', () => {
  const result = normalizeSanityRoomRentalPage(
    document({
      practical: {
        title: 'Réserver',
        items: [
          { _key: 'a', label: 'Contrat', value: 'Signé sur place.' },
          { _key: 'b', label: 'Réservation', value: null },
        ],
      },
    }),
    fallback,
  );

  assert.deepEqual(
    result.practical.items.map(({ label }) => label),
    ['Contrat'],
  );
});

/* -------------------------------------------------------------------------
 * La route et le Studio
 * ------------------------------------------------------------------------- */

/**
 * La page a un onglet, un document unique et une adresse canonique. Les trois
 * doivent rester d'accord : un document qu'aucune structure n'ouvre est
 * inéditable, et un onglet vers une page fermée à l'indexation est une
 * contradiction que Google tranche seul.
 */
test('la route est canonique d’elle-même et datée par son document', () => {
  const route = findRoute('/location-de-salle/');

  assert.ok(route, 'la route doit être au registre.');
  assert.equal(route.indexable, true);
  assert.equal(route.documentId, 'roomRentalPage');
  // Plus aucune canonique : la page ne renvoie plus son autorité à
  // /nos-services/, elle la garde.
  assert.equal(route.canonicalPath, undefined);
});

test('le document est unique, et protégé comme tel', () => {
  const structure = read('studio/structure.ts');

  assert.match(structure, /schemaType\('roomRentalPage'\)/);
  // `studio-guardrails` vérifie déjà que tout type ouvert par la structure est
  // déclaré unique; on garde ici la trace de l'intention.
  assert.match(structure, /'roomRentalPage',/);
});

test('Presentation sait quelle page ce document produit', () => {
  const presentation = read('studio/presentation.ts');

  assert.match(presentation, /roomRentalPage: defineLocations/);
  assert.match(
    presentation,
    /\{route: '\/location-de-salle\/', filter: `_type == "roomRentalPage"`\}/,
  );
});

/**
 * Le tarif et la capacité sont maintenant publiés. La phrase qui affirmait le
 * contraire venait du chapitre d'origine; la garder aurait fait une page qui se
 * contredit dans le même écran.
 */
test('la page ne prétend plus ne rien publier avant confirmation', () => {
  const data = read('src/data/roomRental.ts');

  assert.ok(!data.includes('Aucune capacité, aucun tarif'));
});
