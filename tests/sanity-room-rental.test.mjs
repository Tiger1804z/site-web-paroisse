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
    church: null,
    deposit: null,
    alcohol: null,
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
  // Sur le contenu publié, pas sur le texte du fichier : le commentaire du
  // module cite justement la phrase pour dire pourquoi elle est partie.
  const publie = JSON.stringify(fallback);

  assert.ok(!publie.includes('Aucune capacité, aucun tarif'));
});

/* -------------------------------------------------------------------------
 * Ce que l'ancien site publiait, et que la page doit continuer de dire
 * ------------------------------------------------------------------------- */

/**
 * Six faits de l'ancien site avaient disparu à la première migration, parce que
 * le champ Sanity dont elle est partie ne les portait déjà plus. Chacun coûte
 * quelque chose à la personne qui loue : le prix d'une heure de plus, l'heure à
 * laquelle il faut être parti, un dépôt réclamé au comptoir, un permis à
 * demander dix jours d'avance — et l'église, qu'on ne savait plus pouvoir
 * louer.
 */
test('les tarifs des salles portent le supplément horaire et le couvre-feu', () => {
  const ruchee = fallback.rooms.find(({ id }) => id === 'la-ruchee');
  const sousSol = fallback.rooms.find(({ id }) => id === 'sous-sol-de-leglise');

  assert.equal(ruchee.hourlyExtra, '50 $ par heure supplémentaire');
  assert.equal(ruchee.curfew, '22 h');
  // Le sous-sol n'annonçait aucun supplément sur l'ancien site : on n'en
  // invente pas un par symétrie.
  assert.equal(sousSol.hourlyExtra, undefined);
  assert.equal(sousSol.curfew, '23 h');
});

test('le dépôt de garantie est publié, remboursement compris', () => {
  assert.match(fallback.deposit.message, /dépôt de garantie/);
  assert.match(fallback.deposit.message, /remboursé si la salle est remise/);
});

test('les quatre règles sur l’alcool sont publiées, délai compris', () => {
  const rules = fallback.alcohol.rules.join(' ');

  assert.match(rules, /permis de la Ville de Montréal/);
  assert.match(rules, /à vos frais/);
  assert.match(rules, /Aucune vente d’alcool n’est autorisée/);
  assert.match(rules, /au moins 10 jours avant/);
  assert.match(fallback.alcohol.permitUrl, /^https:\/\//);
});

test('la location de l’église est publiée avec sa capacité et son tarif', () => {
  assert.match(fallback.church.description, /organismes religieux/);
  assert.equal(fallback.church.capacity, 'Jusqu’à 250 personnes');
  assert.match(fallback.church.price, /250 \$ par jour/);
  assert.match(fallback.church.note, /long terme/);
});

/** L'église n'a ni cuisinette ni vestiaire : elle reste hors du tableau. */
test('l’église n’est pas rangée parmi les salles de réception', () => {
  assert.deepEqual(
    fallback.rooms.map(({ id }) => id),
    ['la-ruchee', 'sous-sol-de-leglise'],
  );
  assert.match(fallback.amenities.title, /deux salles/);
});

/* -------------------------------------------------------------------------
 * Ce que le Studio peut retirer, et ce qui disparaît alors
 * ------------------------------------------------------------------------- */

test('une église sans description cesse d’être annoncée', () => {
  const result = normalizeSanityRoomRentalPage(
    document({
      church: {
        eyebrow: 'Autre espace',
        title: 'Location de l’église',
        description: '   ',
        capacity: null,
        price: null,
        note: null,
      },
    }),
    fallback,
  );

  assert.equal(result.church, undefined);
});

test('un dépôt sans message disparaît plutôt que d’inquiéter', () => {
  const result = normalizeSanityRoomRentalPage(
    document({ deposit: { title: 'Dépôt de garantie', message: null } }),
    fallback,
  );

  assert.equal(result.deposit, undefined);
});

test('sans règle saisie, la section sur l’alcool disparaît', () => {
  const result = normalizeSanityRoomRentalPage(
    document({
      alcohol: {
        title: 'Boissons alcoolisées',
        rules: [],
        permitUrl: 'https://exemple.ca',
        permitLinkLabel: 'Demander',
      },
    }),
    fallback,
  );

  assert.equal(result.alcohol, undefined);
});

/** Un libellé de bouton sans adresse produirait un lien mort vers une démarche obligatoire. */
test('sans adresse de permis, aucun bouton n’est promis', () => {
  const result = normalizeSanityRoomRentalPage(
    document({
      alcohol: {
        title: 'Boissons alcoolisées',
        rules: ['Une règle.'],
        permitUrl: '  ',
        permitLinkLabel: 'Demander',
      },
    }),
    fallback,
  );

  assert.equal(result.alcohol.permitUrl, undefined);
  assert.equal(result.alcohol.rules.length, 1);
});

test('la page rend les trois sections restaurées', () => {
  const page = read('src/pages/location-de-salle.astro');

  assert.match(page, /RoomRentalChurch/);
  assert.match(page, /RoomRentalAlcohol/);
  assert.match(page, /deposit=\{roomRentalPageData\.deposit\}/);
});
