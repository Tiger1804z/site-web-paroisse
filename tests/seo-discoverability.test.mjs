import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import {
  SITE_ROUTES,
  findRoute,
  indexableRoutes,
  routeFor,
} from '../src/lib/seo/routes.ts';
import {
  eventJsonLd,
  jsonLdGraph,
  placeOfWorshipJsonLd,
  websiteJsonLd,
} from '../src/lib/seo/jsonLd.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const SITE_URL = 'https://exemple.ca';

/* -------------------------------------------------------------------------
 * Le registre de routes
 * ------------------------------------------------------------------------- */

test('chaque chemin du registre est écrit d’une seule façon', () => {
  for (const route of SITE_ROUTES) {
    assert.ok(
      route.path.startsWith('/') && route.path.endsWith('/'),
      `« ${route.path} » n’a pas la forme servie par le site.`,
    );
  }
});

test('aucun chemin n’est enregistré deux fois', () => {
  const paths = SITE_ROUTES.map((route) => route.path);

  assert.equal(new Set(paths).size, paths.length);
});

/**
 * Sans document, une page publique entre au plan de site sans date de
 * modification : le moteur ne sait pas si elle a changé depuis sa dernière
 * visite. La seule dispense est explicite — une page dont le texte vit dans le
 * dépôt n'a aucun document à interroger.
 */
test('chaque page publique nomme le document qui la date', () => {
  for (const route of indexableRoutes()) {
    assert.ok(
      route.documentId || route.contentInCode,
      `« ${route.path} » est publique mais ne nomme aucun document Sanity, et ne déclare pas son texte dans le dépôt.`,
    );
  }
});

/** La dispense doit rester une exception nommée, pas un défaut commode. */
test('une page ne peut pas à la fois nommer un document et s’en dispenser', () => {
  for (const route of SITE_ROUTES) {
    assert.ok(
      !(route.documentId && route.contentInCode),
      `« ${route.path} » déclare son texte dans le dépôt tout en nommant ${route.documentId}.`,
    );
  }
});

test('chaque page fermée dit pourquoi', () => {
  for (const route of SITE_ROUTES.filter((entry) => !entry.indexable)) {
    assert.ok(
      route.closedBecause,
      `« ${route.path} » est fermée sans raison consignée.`,
    );
  }
});

/**
 * Une canonique qui désigne une page absente du registre, ou une page fermée,
 * envoie l'autorité de la page dans le vide.
 */
test('une canonique désigne toujours une page publique du registre', () => {
  for (const route of SITE_ROUTES) {
    if (!route.canonicalPath) continue;

    const target = findRoute(route.canonicalPath);

    assert.ok(target, `« ${route.canonicalPath} » n’est pas au registre.`);
    assert.ok(
      target?.indexable,
      `« ${route.path} » renvoie son autorité à « ${route.canonicalPath} », qui est fermée.`,
    );
  }
});

test('la recherche accepte un chemin sans barre finale', () => {
  assert.equal(findRoute('/contact')?.path, '/contact/');
  assert.equal(findRoute('/contact/')?.path, '/contact/');
});

test('une route inconnue est fermée, jamais ouverte par défaut', () => {
  const route = routeFor('/page-qui-nexiste-pas/');

  assert.equal(route.indexable, false);
});

/**
 * Lecture de source. L'information a déménagé au registre; si une copie
 * repoussait dans `src/data` ou dans une page, les deux commenceraient à se
 * contredire sans que rien ne le signale.
 */
test('l’indexation ne se décide plus ailleurs que dans le registre', () => {
  const searched = [
    ...readdirSync(`${rootPath}/src/data`)
      .filter((file) => file.endsWith('.ts'))
      .map((file) => `src/data/${file}`),
    ...readdirSync(`${rootPath}/src/pages`)
      .filter((file) => file.endsWith('.astro'))
      .map((file) => `src/pages/${file}`),
  ];

  for (const file of searched) {
    const source = read(file);

    for (const term of ['noIndex', 'canonicalPath']) {
      assert.ok(
        !source.includes(term),
        `${file} contient encore \`${term}\` : cette décision appartient à src/lib/seo/routes.ts.`,
      );
    }
  }
});

/* -------------------------------------------------------------------------
 * Plan de site et robots.txt
 * ------------------------------------------------------------------------- */

test('le plan de site lit le registre plutôt que de deviner', () => {
  const source = read('src/pages/sitemap.xml.ts');

  assert.ok(source.includes('indexableRoutes()'));
});

/** Google les ignore; les publier serait écrire des chiffres invérifiables. */
test('le plan de site ne publie ni priority ni changefreq', () => {
  const source = read('src/pages/sitemap.xml.ts');

  assert.ok(!source.includes('<priority>'));
  assert.ok(!source.includes('<changefreq>'));
});

test('robots.txt annonce le plan de site', () => {
  assert.ok(read('src/pages/robots.txt.ts').includes('Sitemap:'));
});

/* -------------------------------------------------------------------------
 * Données structurées
 * ------------------------------------------------------------------------- */

const settings = {
  organizationName: 'Paroisse Saint-René-Goupil',
  address: {
    street: '4251 Rue Parc René-Goupil',
    city: 'Montréal',
    province: 'Québec',
    postalCode: 'H1Z 1X8',
    country: 'Canada',
    formatted: '4251 Rue Parc René-Goupil, Montréal',
  },
  phone: {
    display: '514 722-1161',
    international: '+1 514 722-1161',
    e164: '+15147221161',
    href: 'tel:+15147221161',
  },
  directionsUrl: 'https://exemple.ca/itineraire',
  map: {
    latitude: 45.5,
    longitude: -73.6,
    embedUrl: 'https://exemple.ca/carte',
    title: 'Carte',
  },
};

const event = {
  id: 'evenement-1',
  slug: 'pelerinage',
  title: ' Pèlerinage au Sanctuaire',
  excerpt: 'Une journée de pèlerinage.',
  category: 'pilgrimage',
  startAt: '2026-08-15T13:00:00Z',
  endAt: '2026-08-16T00:00:00Z',
  timeZone: 'America/Toronto',
  publicationStatus: 'published',
  showOnWebsite: true,
  showOnHomepage: false,
  showInArchive: true,
  featured: false,
};

test('le site désigne la paroisse comme son éditrice', () => {
  const site = websiteJsonLd(SITE_URL, 'Paroisse Saint-René-Goupil');
  const parish = placeOfWorshipJsonLd(SITE_URL, settings);

  assert.equal(site.publisher['@id'], parish['@id']);
});

test('la paroisse publie son adresse postale et son téléphone', () => {
  const parish = placeOfWorshipJsonLd(SITE_URL, settings);

  assert.equal(parish.telephone, '+1 514 722-1161');
  assert.equal(parish.address.postalCode, 'H1Z 1X8');
  assert.equal(parish.geo.latitude, 45.5);
});

/** Le contrat porte déjà la distinction : un courriel non vérifié n’existe pas. */
test('un courriel non confirmé n’est pas publié', () => {
  const withUnconfirmed = placeOfWorshipJsonLd(SITE_URL, {
    ...settings,
    email: { display: 'a@b.ca', href: 'mailto:a@b.ca', confirmed: false },
  });

  assert.equal(withUnconfirmed.email, undefined);

  const withConfirmed = placeOfWorshipJsonLd(SITE_URL, {
    ...settings,
    email: { display: 'a@b.ca', href: 'mailto:a@b.ca', confirmed: true },
  });

  assert.equal(withConfirmed.email, 'a@b.ca');
});

test('les heures du secrétariat ne sont pas publiées en horaire d’ouverture', () => {
  const parish = placeOfWorshipJsonLd(SITE_URL, {
    ...settings,
    officeHoursLabel: 'Du lundi au jeudi, plus ou moins',
  });

  assert.equal(parish.openingHours, undefined);
  assert.equal(parish.openingHoursSpecification, undefined);
});

test('un événement sans date de début n’est pas publié', () => {
  assert.equal(
    eventJsonLd(SITE_URL, { ...event, startAt: '' }, '/evenements/'),
    undefined,
  );
  assert.equal(
    eventJsonLd(SITE_URL, { ...event, title: '   ' }, '/evenements/'),
    undefined,
  );
});

/** Un document du jeu de données porte un espace en trop au début du titre. */
test('un titre mal saisi est nettoyé avant d’entrer dans le graphe', () => {
  const node = eventJsonLd(SITE_URL, event, '/evenements/');

  assert.equal(node.name, 'Pèlerinage au Sanctuaire');
});

test('un événement annulé le dit', () => {
  const node = eventJsonLd(
    SITE_URL,
    { ...event, publicationStatus: 'cancelled' },
    '/evenements/',
  );

  assert.equal(node.eventStatus, 'https://schema.org/EventCancelled');
});

test('un lieu nommé l’emporte, sinon l’activité se tient à la paroisse', () => {
  const elsewhere = eventJsonLd(
    SITE_URL,
    { ...event, locationName: 'Sanctuaire Notre-Dame-du-Cap' },
    '/evenements/',
  );
  assert.equal(elsewhere.location.name, 'Sanctuaire Notre-Dame-du-Cap');

  const atParish = eventJsonLd(SITE_URL, event, '/evenements/');
  assert.equal(
    atParish.location['@id'],
    placeOfWorshipJsonLd(SITE_URL, settings)['@id'],
  );
});

test('un prix absent ne produit pas une offre vide', () => {
  assert.equal(eventJsonLd(SITE_URL, event, '/evenements/').offers, undefined);

  const paid = eventJsonLd(
    SITE_URL,
    { ...event, price: { amount: 55, currency: 'CAD' } },
    '/evenements/',
  );

  assert.equal(paid.offers.price, 55);
  assert.equal(paid.offers.priceCurrency, 'CAD');
});

test('le graphe porte son contexte', () => {
  const graph = jsonLdGraph([websiteJsonLd(SITE_URL, 'Paroisse')]);

  assert.equal(graph['@context'], 'https://schema.org');
  assert.equal(graph['@graph'].length, 1);
});

test('le layout échappe le graphe avant de l’écrire', () => {
  const source = read('src/layouts/BaseLayout.astro');

  assert.ok(
    source.includes("replace(/</g, '\\\\u003c')"),
    'un titre contenant </script> refermerait la balise.',
  );
});
