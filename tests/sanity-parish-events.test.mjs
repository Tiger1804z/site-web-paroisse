import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeSanityParishEvents } from '../src/lib/content/normalizeSanityParishEvents.ts';

// Doublure du constructeur d'adresses : le vrai lit `import.meta.env`, absent
// sous `node --test`. C'est précisément pourquoi il est injecté.
const buildSources = () => ({
  src: 'https://cdn.test/image?w=1920',
  srcSet: 'https://cdn.test/image?w=480 480w',
});

function normalize(events) {
  return normalizeSanityParishEvents(events, buildSources);
}

function rawImage(overrides = {}) {
  return {
    alt: 'Façade de la basilique',
    credit: null,
    containsRecognizablePeople: false,
    generatedByAi: false,
    image: {
      _type: 'image',
      asset: {
        _id: 'image-abc-1800x1120-jpg',
        metadata: {
          lqip: 'data:image/jpeg;base64,abc',
          dimensions: { width: 1800, height: 1120, aspectRatio: 1.6 },
        },
      },
    },
    ...overrides,
  };
}

function rawEvent(overrides = {}) {
  return {
    _id: 'event-1',
    title: 'Pèlerinage au Sanctuaire Notre-Dame-du-Cap',
    slug: 'pelerinage-notre-dame-du-cap',
    excerpt: 'Une journée de pèlerinage est proposée.',
    description: null,
    category: 'pilgrimage',
    startAt: '2026-08-15T13:00:00.000Z',
    endAt: null,
    locationName: null,
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
    showOnHomepage: false,
    showInArchive: true,
    featured: false,
    homepagePriority: null,
    ...overrides,
  };
}

test('une collection vide ne produit aucun événement', () => {
  assert.deepEqual(normalize(null), []);
  assert.deepEqual(normalize([]), []);
});

test('un événement incomplet est ignoré plutôt qu’affiché troué', () => {
  const events = normalize([
    rawEvent(),
    rawEvent({ _id: 'sans-titre', title: '  ' }),
    rawEvent({ _id: 'sans-slug', slug: null }),
    rawEvent({ _id: 'sans-resume', excerpt: null }),
    rawEvent({ _id: 'sans-date', startAt: null }),
    rawEvent({ _id: 'sans-categorie', category: null }),
  ]);

  assert.deepEqual(
    events.map(({ id }) => id),
    ['event-1'],
  );
});

test('les coordonnées ne sortent pas sans consentement coché', () => {
  const [event] = normalize([
    rawEvent({
      contact: {
        name: 'Ginette Simon',
        phone: '514-996-0449',
        email: null,
        consentGiven: false,
      },
    }),
  ]);

  assert.equal(event.contact, undefined);
});

test('un consentement explicite publie les coordonnées et dérive le lien', () => {
  const [event] = normalize([
    rawEvent({
      contact: {
        name: 'Ginette Simon',
        phone: '514-996-0449',
        email: null,
        consentGiven: true,
      },
    }),
  ]);

  assert.equal(event.contact.name, 'Ginette Simon');
  assert.equal(event.contact.phoneHref, 'tel:+15149960449');
});

test('un numéro incomplet ne produit pas de lien cliquable', () => {
  const [event] = normalize([
    rawEvent({
      contact: {
        name: null,
        phone: '996-0449',
        email: null,
        consentGiven: true,
      },
    }),
  ]);

  assert.equal(event.contact.phone, '996-0449');
  assert.equal(event.contact.phoneHref, undefined);
});

test('une image sans texte alternatif n’est pas publiée', () => {
  const [event] = normalize([
    rawEvent({
      coverImage: rawImage({ alt: '   ' }),
      gallery: [
        { _key: 'a', ...rawImage() },
        { _key: 'b', ...rawImage({ alt: null }) },
      ],
    }),
  ]);

  assert.equal(event.coverImage, undefined);
  assert.equal(event.gallery.length, 1);
});

test('une image dont le fichier a disparu est écartée', () => {
  const [event] = normalize([
    rawEvent({
      coverImage: rawImage({ image: { _type: 'image', asset: null } }),
    }),
  ]);

  assert.equal(event.coverImage, undefined);
});

test('le point focal du Studio traverse jusqu’au contrat', () => {
  const [withHotspot] = normalize([
    rawEvent({
      coverImage: rawImage({
        image: {
          ...rawImage().image,
          hotspot: { _type: 'sanity.imageHotspot', x: 0.23, y: 0.68 },
        },
      }),
    }),
  ]);
  const [withoutHotspot] = normalize([rawEvent({ coverImage: rawImage() })]);

  assert.deepEqual(withHotspot.coverImage.focalPoint, { x: 0.23, y: 0.68 });
  assert.equal(withoutHotspot.coverImage.focalPoint, undefined);
  assert.equal(withoutHotspot.coverImage.width, 1800);
  assert.equal(withoutHotspot.coverImage.lqip, 'data:image/jpeg;base64,abc');
});

test('un coût sans montant n’est pas affiché', () => {
  const [withPrice] = normalize([
    rawEvent({ price: { amount: 55, label: 'par personne' } }),
  ]);
  const [withoutAmount] = normalize([
    rawEvent({ price: { amount: null, label: 'par personne' } }),
  ]);

  assert.deepEqual(withPrice.price, {
    amount: 55,
    currency: 'CAD',
    label: 'par personne',
  });
  assert.equal(withoutAmount.price, undefined);
});

test('un bouton d’action incomplet est ignoré', () => {
  const [complete] = normalize([
    rawEvent({ cta: { label: 'Réserver', url: 'tel:+15149960449' } }),
  ]);
  const [withoutUrl] = normalize([
    rawEvent({ cta: { label: 'Réserver', url: null } }),
  ]);

  assert.deepEqual(complete.cta, {
    label: 'Réserver',
    href: 'tel:+15149960449',
  });
  assert.equal(withoutUrl.cta, undefined);
});

test('les drapeaux absents prennent la valeur la plus prudente', () => {
  const [event] = normalize([
    rawEvent({
      publicationStatus: null,
      showOnWebsite: null,
      showOnHomepage: null,
      showInArchive: null,
      featured: null,
    }),
  ]);

  // Un document incomplet reste visible sur le site et dans les archives,
  // mais n'est ni publié, ni promu sur l'accueil sans décision explicite.
  assert.equal(event.publicationStatus, 'draft');
  assert.equal(event.showOnWebsite, true);
  assert.equal(event.showInArchive, true);
  assert.equal(event.showOnHomepage, false);
  assert.equal(event.featured, false);
});
