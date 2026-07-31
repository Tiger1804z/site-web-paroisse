import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { normalizeSanityServicesPage } from '../src/lib/content/normalizeSanityServicesPage.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const phone = { display: '514 722-1161', href: 'tel:+15147221161' };
const phoneCta = { label: 'Téléphoner au secrétariat', href: phone.href };

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
    images: [
      {
        image: { src: '/local.jpg', width: 1600, height: 1067, format: 'jpg' },
        alt: 'Geste de baptême',
        documentary: false,
        credit: 'Image : Pixabay.',
        frame: 'landscape',
        label: 'Le baptême',
      },
    ],
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
      image: {
        image: { src: '/icone.jpg', width: 800, height: 1200, format: 'jpg' },
        alt: 'Icône',
        documentary: false,
        credit: 'Image : teotea, Pixabay.',
        frame: 'portrait-offset',
      },
      services: [
        {
          id: 'mariage',
          title: 'Mariage',
          summary: 'Résumé local.',
          active: true,
          details: [{ label: 'Tarif 2026', value: '400 $' }],
          cta: phoneCta,
        },
      ],
    },
    {
      id: 'location-de-salle',
      eyebrow: 'Accueil',
      title: 'Location de salle',
      introduction: 'Introduction locale.',
      surface: 'burgundy',
      services: [
        {
          id: 'demande-location',
          title: 'Une demande traitée avec le secrétariat',
          summary: 'Résumé local.',
          active: true,
          cta: phoneCta,
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
    primary: phoneCta,
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

test('sans document Sanity, la page reste identique au repli local', () => {
  const result = normalizeSanityServicesPage(null, fallback);
  assert.deepEqual(result, fallback);
});

test('le contenu Sanity remplace le contenu local', () => {
  const result = normalizeSanityServicesPage(
    {
      hero: { title: 'Titre Sanity' },
      chapters: [sanityChapter],
    },
    fallback,
  );

  assert.equal(result.hero.title, 'Titre Sanity');
  assert.equal(result.chapters.length, 1);
  assert.equal(result.chapters[0].title, 'Sacrements — version Sanity');
  assert.equal(result.chapters[0].services[0].details[0].value, '450 $');
  assert.deepEqual(result.chapters[0].services[0].steps, ['Première étape.']);
  assert.equal(result.chapters[0].services[0].note, 'Une note.');
});

test('les images restent locales et se rattachent par l’ancre', () => {
  const result = normalizeSanityServicesPage(
    { chapters: [sanityChapter] },
    fallback,
  );

  // Le hero garde ses fichiers du projet, quoi que dise Sanity.
  assert.deepEqual(result.hero.images, fallback.hero.images);
  // L'image du chapitre suit son ancre, pas sa position dans le tableau.
  assert.deepEqual(result.chapters[0].image, fallback.chapters[0].image);
});

test('le bouton d’appel ne vient jamais de Sanity', () => {
  const result = normalizeSanityServicesPage(
    { chapters: [sanityChapter] },
    fallback,
  );

  assert.deepEqual(result.chapters[0].services[0].cta, phoneCta);
  assert.equal(result.finalCta.phone.href, phone.href);

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
  );

  // Plus aucun chapitre exploitable : le repli local reprend la main.
  assert.deepEqual(result.chapters, fallback.chapters);
});

test('une surface inconnue retombe sur la plus neutre', () => {
  const result = normalizeSanityServicesPage(
    { chapters: [{ ...sanityChapter, surface: 'fuchsia' }] },
    fallback,
  );

  assert.equal(result.chapters[0].surface, 'ivory');
});

test('l’ancre de la location de salle reste la cible de la redirection', () => {
  const redirect = read('src/pages/location-de-salle.astro');
  const anchor = redirect.match(/\/nos-services\/#([a-z0-9-]+)/)?.[1];

  assert.equal(anchor, 'location-de-salle');
  // Le repli local doit toujours contenir cette ancre, sinon la redirection
  // arrive sur une page sans destination.
  const localData = read('src/data/services.ts');
  assert.match(localData, /id: 'location-de-salle'/);
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
