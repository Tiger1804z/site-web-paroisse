import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { normalizeSanityServicesPage } from '../src/lib/content/normalizeSanityServicesPage.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const phone = { display: '514 722-1161' };
const secretariatCta = { label: 'Contacter le secrétariat', href: '/contact/' };

// `src/data/services.ts` importe des images et ne peut pas être chargé par
// Node : on reconstruit ici la forme attendue du normalizer.
const fallback = {
  seo: {
    title: 'Nos services',
    description: 'Description locale.',
    canonicalPath: '/nos-services/',
  },
  hero: {
    eyebrow: 'Accueil et accompagnement',
    title: 'Nos services',
    introduction: 'Introduction locale.',
    slides: [],
  },
  notice: {
    title: 'Titre local',
    message: 'Message local.',
    reviewDate: 'Dernière révision éditoriale : 27 juillet 2026',
  },
  chapters: [
    {
      id: 'sacrements-et-initiation',
      eyebrow: 'Célébrer et cheminer',
      title: 'Sacrements et initiation chrétienne',
      introduction: 'Introduction locale du chapitre.',
      surface: 'ivory',
      services: [
        {
          id: 'mariage',
          title: 'Mariage',
          summary: 'Résumé local.',
          active: true,
          details: [{ label: 'Tarif 2026', value: '400 $' }],
          cta: secretariatCta,
        },
      ],
    },
    {
      id: 'priere-et-memoire',
      eyebrow: 'Prière et mémoire',
      title: 'Intentions, lampions et célébrations',
      introduction: 'Introduction locale.',
      surface: 'charcoal',
      services: [
        {
          id: 'lampions',
          title: 'Lampions et lampe du sanctuaire',
          summary: 'Résumé local.',
          active: true,
          cta: secretariatCta,
        },
      ],
    },
  ],
  paymentMethods: {
    title: 'Modes de paiement publiés',
    description: 'Description locale.',
    methods: ['Argent comptant'],
  },
  finalCta: {
    title: 'Parler de votre démarche',
    description: 'Description locale.',
    primary: secretariatCta,
    phone,
  },
};

const sanityChapter = {
  slug: 'sacrements-et-initiation',
  eyebrow: 'Célébrer et cheminer',
  title: 'Sacrements — version Sanity',
  introduction: 'Introduction Sanity.',
  surface: 'paper',
  services: [
    {
      slug: 'mariage',
      title: 'Mariage',
      summary: 'Résumé Sanity.',
      active: true,
      details: [{ _key: 'a', label: 'Tarif 2026', value: '450 $' }],
      steps: ['Première étape.'],
      note: 'Une note.',
    },
  ],
};

// Doublure du constructeur d'adresses : le vrai lit `import.meta.env`, absent
// sous `node --test`.
const buildSources = () => ({
  src: 'https://cdn.test/image?w=1920',
  srcSet: 'https://cdn.test/image?w=480 480w',
});

/** Image telle que la projection GROQ la remonte. */
const rawImage = (alt, credit) => ({
  alt,
  ...(credit ? { credit } : {}),
  image: {
    asset: {
      _id: 'image-abc-1200x900-jpg',
      metadata: {
        lqip: 'data:image/png;base64,x',
        dimensions: { width: 1200, height: 900 },
      },
    },
  },
});

test('sans document Sanity, la page reste identique au repli local', () => {
  const result = normalizeSanityServicesPage(null, fallback, buildSources);
  assert.deepEqual(result, fallback);
});

test('le contenu Sanity remplace le contenu local', () => {
  const result = normalizeSanityServicesPage(
    {
      hero: { title: 'Titre Sanity' },
      chapters: [sanityChapter],
    },
    fallback,
    buildSources,
  );

  assert.equal(result.hero.title, 'Titre Sanity');
  assert.equal(result.chapters.length, 1);
  assert.equal(result.chapters[0].title, 'Sacrements — version Sanity');
  assert.equal(result.chapters[0].services[0].details[0].value, '450 $');
  assert.deepEqual(result.chapters[0].services[0].steps, ['Première étape.']);
  assert.equal(result.chapters[0].services[0].note, 'Une note.');
});

test('les images viennent du Studio, plus jamais du repli local', () => {
  const result = normalizeSanityServicesPage(
    {
      hero: {
        slides: [
          {
            _key: 's1',
            label: 'Le baptême',
            visual: rawImage('Un baptême', 'Pixabay'),
          },
        ],
      },
      chapters: [{ ...sanityChapter, image: rawImage('Une icône') }],
    },
    fallback,
    buildSources,
  );

  assert.equal(result.hero.slides.length, 1);
  assert.equal(result.hero.slides[0].label, 'Le baptême');
  assert.equal(result.hero.slides[0].image.alt, 'Un baptême');
  assert.equal(result.hero.slides[0].image.credit, 'Pixabay');
  assert.equal(result.chapters[0].image.alt, 'Une icône');
});

test('sans image dans le Studio, aucun cadre n’est réservé', () => {
  const result = normalizeSanityServicesPage(
    { chapters: [sanityChapter] },
    fallback,
    buildSources,
  );

  assert.deepEqual(result.hero.slides, []);
  assert.equal(result.chapters[0].image, undefined);
});

test('une image sans texte alternatif n’est pas publiable', () => {
  const withoutAlt = { image: rawImage('x').image };
  const result = normalizeSanityServicesPage(
    {
      hero: { slides: [{ _key: 's1', label: 'Sans alt', visual: withoutAlt }] },
      chapters: [{ ...sanityChapter, image: withoutAlt }],
    },
    fallback,
    buildSources,
  );

  assert.deepEqual(result.hero.slides, []);
  assert.equal(result.chapters[0].image, undefined);
});

test('une image sans libellé ne rejoint pas le carrousel d’en-tête', () => {
  const result = normalizeSanityServicesPage(
    { hero: { slides: [{ _key: 's1', visual: rawImage('Une image') }] } },
    fallback,
    buildSources,
  );

  assert.deepEqual(result.hero.slides, []);
});

test('le bouton vers le secrétariat ne vient jamais de Sanity', () => {
  const result = normalizeSanityServicesPage(
    { chapters: [sanityChapter] },
    fallback,
    buildSources,
  );

  assert.deepEqual(result.chapters[0].services[0].cta, secretariatCta);
  // Le numéro s'affiche sous le bouton, sans jamais déclencher d'appel.
  assert.equal(result.finalCta.phone.display, phone.display);
  assert.equal(result.finalCta.phone.href, undefined);

  // Aucun champ d'adresse dans le schéma : l'éditrice ne peut pas saisir un lien.
  const serviceSchema = read('studio/schemaTypes/objects/parishServiceType.ts');
  assert.doesNotMatch(serviceSchema, /name: '(href|url|cta|link)'/);
});

test('un service masqué garde son drapeau, il n’est pas supprimé', () => {
  const result = normalizeSanityServicesPage(
    {
      chapters: [
        {
          ...sanityChapter,
          services: [{ ...sanityChapter.services[0], active: false }],
        },
      ],
    },
    fallback,
    buildSources,
  );

  assert.equal(result.chapters[0].services[0].active, false);
});

test('une entrée incomplète est écartée plutôt qu’affichée à moitié', () => {
  const result = normalizeSanityServicesPage(
    {
      chapters: [
        {
          ...sanityChapter,
          services: [
            { ...sanityChapter.services[0], summary: '   ' },
            {
              slug: 'bapteme',
              title: 'Baptême',
              summary: 'Résumé.',
              details: [
                { _key: 'b', label: 'Tarif', value: null },
                { _key: 'c', label: 'Horaire', value: 'Deuxième dimanche.' },
              ],
            },
          ],
        },
      ],
    },
    fallback,
    buildSources,
  );

  const services = result.chapters[0].services;
  assert.equal(services.length, 1);
  assert.equal(services[0].id, 'bapteme');
  // Le renseignement sans valeur disparaît, celui qui est complet reste.
  assert.equal(services[0].details.length, 1);
  assert.equal(services[0].details[0].label, 'Horaire');
});

test('un chapitre sans service valide ne laisse pas un bandeau vide', () => {
  const result = normalizeSanityServicesPage(
    { chapters: [{ ...sanityChapter, services: [] }] },
    fallback,
    buildSources,
  );

  // Plus aucun chapitre exploitable : le repli local reprend la main.
  assert.deepEqual(result.chapters, fallback.chapters);
});

test('une surface inconnue retombe sur la plus neutre', () => {
  const result = normalizeSanityServicesPage(
    { chapters: [{ ...sanityChapter, surface: 'fuchsia' }] },
    fallback,
    buildSources,
  );

  assert.equal(result.chapters[0].surface, 'ivory');
});

/**
 * La location de salle a quitté cette page le 3 septembre 2026.
 *
 * Elle y était le dernier chapitre, et `/location-de-salle/` n'était qu'une
 * redirection vers son ancre. Les deux se tenaient : si le chapitre revenait
 * ici, la page dédiée et Nos services publieraient les mêmes tarifs à deux
 * adresses, et rien ne dirait laquelle Google doit croire.
 */
test('la location de salle ne revient pas dans Nos services', () => {
  const localData = read('src/data/services.ts');

  assert.ok(
    !/id: 'location-de-salle'/.test(localData),
    'le chapitre est reparti : sa page est /location-de-salle/.',
  );
  assert.ok(
    !localData.includes('/nos-services/#location-de-salle'),
    'plus aucun lien ne doit viser l’ancienne ancre.',
  );
});

test('la page Location de salle ne redirige plus vers Nos services', () => {
  const page = read('src/pages/location-de-salle.astro');

  assert.ok(
    !page.includes('redirectTo'),
    'la route est canonique d’elle-même : elle n’envoie plus ailleurs.',
  );
  assert.match(page, /getRoomRentalPageData/);
});

test('les champs que rien n’affiche ne sont pas recréés dans le Studio', () => {
  const schemas = [
    read('studio/schemaTypes/documents/servicesPageType.ts'),
    read('studio/schemaTypes/objects/serviceChapterType.ts'),
    read('studio/schemaTypes/objects/parishServiceType.ts'),
    read('studio/schemaTypes/objects/serviceDetailType.ts'),
  ].join('\n');

  for (const dead of [
    'confirmed',
    'sourceContext',
    'lastReviewedAt',
    'effectiveYear',
    'effectivePeriod',
    'requiresPeriodicReview',
    'category',
    'order',
  ]) {
    assert.doesNotMatch(
      schemas,
      new RegExp(`name: '${dead}'`),
      `${dead} n’est rendu par aucun composant : ce serait un formulaire sans effet`,
    );
  }

  // Et ils ne doivent pas revenir dans le contrat frontend non plus.
  const contract = read('src/types/services.ts');
  assert.doesNotMatch(contract, /ServiceReviewMetadata/);
  assert.doesNotMatch(contract, /readonly confirmed/);
  assert.doesNotMatch(contract, /readonly order/);
});
