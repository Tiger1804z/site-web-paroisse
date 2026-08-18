import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { normalizeSanityAdvertisers } from '../src/lib/content/normalizeSanityAdvertisers.ts';
import { normalizeSanityAdvertisersPage } from '../src/lib/content/normalizeSanityAdvertisersPage.ts';
import { selectAdvertisers } from '../src/lib/advertisers/advertisers.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

// Doublure du constructeur d'adresses : le vrai lit `import.meta.env`, absent
// sous `node --test`.
const buildSources = () => ({
  src: 'https://cdn.example/logo.png',
  srcSet: 'https://cdn.example/logo.png 480w',
});

const raw = (overrides = {}) => ({
  _id: 'advertiser.exemple',
  name: 'Annonceur exemple',
  category: null,
  description: null,
  addressLines: null,
  phone: null,
  email: null,
  website: null,
  status: 'active',
  order: 1,
  logo: null,
  ...overrides,
});

// `src/data/advertisers.ts` importe une image et ne peut pas être chargé par
// Node : on reconstruit ici la forme attendue du normalizer de page.
const fallbackPage = {
  seo: {
    title: 'Nos annonceurs',
    description: 'Description locale.',
    canonicalPath: '/nos-annonceurs/',
    noIndex: true,
  },
  hero: {
    eyebrow: 'Soutenir notre mission',
    title: 'Nos annonceurs',
    introduction: 'Introduction locale.',
    objectPosition: 'center 42%',
  },
  introduction: {
    eyebrow: 'Reconnaissance',
    title: 'Des présences qui contribuent',
    paragraphs: ['Paragraphe local.'],
    disclosure: 'Mention locale de transparence.',
  },
  advertisers: [],
  solicitation: {
    eyebrow: 'Devenir annonceur',
    title: 'Soutenir la paroisse',
    description: 'Description locale.',
    details: ['Précision locale.'],
    phone: {
      display: '514 722-1161',
      international: '+1 514 722-1161',
      e164: '+15147221161',
      href: 'tel:+15147221161',
    },
    phoneLabel: 'Téléphoner au secrétariat',
    contactLabel: 'Voir nos coordonnées',
    contactHref: '/contact/',
  },
  settings: { showAdvertisers: true, showSolicitation: true },
};

test('une fiche sans nom est écartée', () => {
  const normalized = normalizeSanityAdvertisers(
    [raw({ name: '   ' }), raw({ _id: 'valide', name: 'Buffet Marina' })],
    buildSources,
  );

  assert.deepEqual(
    normalized.map(({ name }) => name),
    ['Buffet Marina'],
  );
});

test('le lien d’appel est reconstruit à partir des chiffres saisis', () => {
  const [advertiser] = normalizeSanityAdvertisers(
    [raw({ phone: '514 728-4345' })],
    buildSources,
  );

  assert.deepEqual(advertiser.phone, {
    display: '514 728-4345',
    href: 'tel:+15147284345',
  });
});

test('un numéro incomplet ne devient pas un lien', () => {
  const [advertiser] = normalizeSanityAdvertisers(
    [raw({ phone: '728-4345' })],
    buildSources,
  );

  assert.equal(advertiser.phone, undefined);
});

test('le courriel devient un mailto, une valeur non valide non', () => {
  const [valide] = normalizeSanityAdvertisers(
    [raw({ email: 'info@buffetmarina.com' })],
    buildSources,
  );
  const [invalide] = normalizeSanityAdvertisers(
    [raw({ email: 'demander au secrétariat' })],
    buildSources,
  );

  assert.deepEqual(valide.email, {
    display: 'info@buffetmarina.com',
    href: 'mailto:info@buffetmarina.com',
  });
  assert.equal(invalide.email, undefined);
});

test('seuls http et https deviennent un site d’annonceur', () => {
  const [https] = normalizeSanityAdvertisers(
    [raw({ website: 'https://www.buffetmarina.com/' })],
    buildSources,
  );
  const [script] = normalizeSanityAdvertisers(
    [raw({ website: 'javascript:alert(1)' })],
    buildSources,
  );

  assert.equal(https.website, 'https://www.buffetmarina.com/');
  assert.equal(script.website, undefined);
});

test('un statut inconnu retombe sur brouillon et ne se publie pas', () => {
  const normalized = normalizeSanityAdvertisers(
    [raw({ status: 'actif' })],
    buildSources,
  );

  assert.equal(normalized[0].status, 'draft');
  assert.equal(selectAdvertisers(normalized).length, 0);
});

test('une fiche à confirmer reste invisible', () => {
  const normalized = normalizeSanityAdvertisers(
    [raw({ status: 'confirmation-required' })],
    buildSources,
  );

  assert.equal(selectAdvertisers(normalized).length, 0);
  assert.equal(
    selectAdvertisers(normalized, { includeConfirmationRequired: true }).length,
    1,
  );
});

test('un logo sans texte alternatif ne produit pas de balise vide', () => {
  const asset = {
    hotspot: { x: 0.5, y: 0.5 },
    asset: {
      _id: 'image-abc-800x400-png',
      metadata: { lqip: 'data:image/png;base64,xxx' },
    },
  };

  const [sansAlt] = normalizeSanityAdvertisers(
    [raw({ logo: { alt: '  ', image: asset } })],
    buildSources,
  );
  const [avecAlt] = normalizeSanityAdvertisers(
    [raw({ logo: { alt: 'Logo de Buffet Marina', image: asset } })],
    buildSources,
  );

  assert.equal(sansAlt.logo, undefined);
  assert.equal(avecAlt.logo.src, 'https://cdn.example/logo.png');
  assert.equal(avecAlt.logo.alt, 'Logo de Buffet Marina');
});

test('la note de révision n’est jamais projetée vers le site', () => {
  const queries = read('src/lib/sanity/queries.ts');
  const advertisersQuery = queries.slice(
    queries.indexOf('ADVERTISERS_QUERY = defineQuery'),
    queries.indexOf('ADVERTISERS_PAGE_QUERY = defineQuery'),
  );

  assert.match(advertisersQuery, /_type == "advertiser"/);
  assert.doesNotMatch(advertisersQuery, /confirmationNote/);
});

test('le contrat public ne porte plus de note de révision', () => {
  const contract = read('src/types/advertisers.ts');

  assert.doesNotMatch(contract, /confirmationNote/);
  assert.doesNotMatch(contract, /lastConfirmedAt|validFrom|validUntil/);
});

test('le contenu de page vient de Sanity, le seo reste au code', () => {
  const page = normalizeSanityAdvertisersPage(
    {
      hero: {
        eyebrow: 'Merci',
        title: 'Nos annonceurs',
        introduction: 'Introduction Sanity.',
      },
      introduction: {
        eyebrow: null,
        title: 'Titre Sanity',
        paragraphs: ['Paragraphe Sanity.', '   '],
        disclosure: null,
      },
      solicitation: {
        eyebrow: null,
        title: null,
        description: null,
        details: [],
        phoneLabel: 'Appeler',
        contactLabel: null,
      },
      settings: { showAdvertisers: false, showSolicitation: null },
    },
    fallbackPage,
  );

  assert.equal(page.hero.eyebrow, 'Merci');
  assert.equal(page.hero.introduction, 'Introduction Sanity.');
  // Le seo reste une décision de code. L'image, elle, est composée par le
  // getter à partir du Studio : le normalizer n'en porte plus.
  assert.equal(page.seo.noIndex, true);
  assert.equal(page.hero.image, undefined);
  // Un champ vide laisse le repli en place, un champ rempli le remplace.
  assert.equal(page.introduction.eyebrow, 'Reconnaissance');
  assert.equal(page.introduction.title, 'Titre Sanity');
  assert.deepEqual(page.introduction.paragraphs, ['Paragraphe Sanity.']);
  assert.equal(page.introduction.disclosure, 'Mention locale de transparence.');
  assert.deepEqual(page.solicitation.details, ['Précision locale.']);
  // Une case décochée est une décision; une valeur absente ne l'est pas.
  assert.equal(page.settings.showAdvertisers, false);
  assert.equal(page.settings.showSolicitation, true);
});

test('Sanity ne fournit ni téléphone ni adresse de bouton pour la page', () => {
  const schema = read('studio/schemaTypes/documents/advertisersPageType.ts');
  const page = normalizeSanityAdvertisersPage(null, fallbackPage);

  assert.doesNotMatch(
    schema,
    /name: 'href'|name: 'phoneHref'|name: 'contactHref'/,
  );
  assert.equal(page.solicitation.contactHref, '/contact/');
  assert.equal(page.solicitation.phone.href, 'tel:+15147221161');
});

test('une collection vide n’est pas un échec de requête', () => {
  const getter = read('src/lib/content/getAdvertisersPageData.ts');

  assert.deepEqual(normalizeSanityAdvertisers([], buildSources), []);
  assert.match(getter, /rawAdvertisers === null/);
});

test('les liens sortants restent déclarés comme publicitaires', () => {
  const component = read(
    'src/components/sections/advertisers/AdvertiserList.astro',
  );

  assert.match(component, /rel="sponsored noopener noreferrer"/);
  assert.match(component, /target="_blank"/);
});

test('aucun identifiant de fiche ne contient de point', () => {
  const seed = read('studio/scripts/seed-advertisers.ts');
  const ids = [...seed.matchAll(/_id: '([^']+)'/g)].map(([, id]) => id);

  // Un point place le document dans un chemin privé de Sanity : la lecture
  // publique du build ne le voit pas, alors que la CLI porteuse d'un jeton le
  // voit très bien. Le site se construit sans erreur et sans annonceur.
  assert.ok(ids.length > 0);
  for (const id of ids) {
    assert.doesNotMatch(id, /\./, `identifiant privé : ${id}`);
  }
});

test('les annonceurs sont une collection, pas une liste dans la page', () => {
  const structure = read('studio/structure.ts');
  const pageSchema = read(
    'studio/schemaTypes/documents/advertisersPageType.ts',
  );

  assert.match(structure, /COLLECTIONS = \['parishEvent', 'advertiser'\]/);
  assert.match(structure, /documentTypeListItem\('advertiser'\)/);
  assert.doesNotMatch(pageSchema, /type: 'advertiser'/);
});
