import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { siteSettingsData } from '../src/data/siteSettings.ts';
import {
  isGalleryItemPublic,
  selectGalleryItems,
  selectHomepageGalleryItems,
} from '../src/lib/gallery/gallery.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));

function galleryCandidate(overrides = {}) {
  const { id = 'gallery-default', alt = 'Vue factuelle de l’église' } =
    overrides;

  return {
    item: {
      id,
      title: 'Photographie',
      description: '',
      image: { src: 'https://cdn', srcSet: 'https://cdn 480w', alt },
    },
    rightsCleared: true,
    generatedByAi: false,
    containsRecognizablePeople: false,
    consentConfirmed: false,
    ...overrides,
  };
}

test('Contact possède une route dédiée et non le placeholder générique', () => {
  const contactPage = readFileSync(
    `${rootPath}/src/pages/contact.astro`,
    'utf8',
  );
  const placeholderPage = readFileSync(
    `${rootPath}/src/pages/[slug].astro`,
    'utf8',
  );

  assert.match(contactPage, /getContactPageData/);
  assert.doesNotMatch(placeholderPage, /slug:\s*'contact'/);
});

test('les coordonnées publiques confirmées sont centralisées', () => {
  assert.equal(siteSettingsData.address.street, '4251 Rue Parc René-Goupil');
  assert.equal(siteSettingsData.address.postalCode, 'H1Z 1X8');
});

test('le téléphone possède les formats public et cliquable attendus', () => {
  assert.equal(siteSettingsData.phone.display, '514 722-1161');
  assert.equal(siteSettingsData.phone.href, 'tel:+15147221161');
});

test('les heures du secrétariat sont une coordonnée globale', () => {
  assert.match(siteSettingsData.officeHoursLabel, /9 h à 14 h 30/);
});

test('le courriel non confirmé est explicitement exclu', () => {
  assert.equal(siteSettingsData.email.confirmed, false);
  assert.equal(siteSettingsData.email.display, '');
  assert.equal(siteSettingsData.email.href, '');
});

test('une photographie aux droits non confirmés reste invisible', () => {
  assert.equal(
    isGalleryItemPublic(galleryCandidate({ rightsCleared: false })),
    false,
  );
});

test('la sélection de l’accueil respecte son plafond', () => {
  const candidates = Array.from({ length: 14 }, (_, index) =>
    galleryCandidate({ id: `item-${index}` }),
  );

  assert.equal(selectHomepageGalleryItems(candidates, 12).length, 12);
});

test('une personne reconnaissable sans consentement n’est pas publiée', () => {
  assert.equal(
    isGalleryItemPublic(galleryCandidate({ containsRecognizablePeople: true })),
    false,
  );

  assert.equal(
    isGalleryItemPublic(
      galleryCandidate({
        containsRecognizablePeople: true,
        consentConfirmed: true,
      }),
    ),
    true,
  );
});

test('Galerie reste masquée de la navigation publique', () => {
  const navigation = readFileSync(`${rootPath}/src/lib/navigation.ts`, 'utf8');

  assert.match(
    navigation,
    /\{\s*label:\s*'Galerie',\s*href:\s*'\/galerie',\s*active:\s*false\s*\}/,
  );
});

test('Galerie reste un placeholder noindex sans page autonome', () => {
  const placeholderPage = readFileSync(
    `${rootPath}/src/pages/[slug].astro`,
    'utf8',
  );

  assert.match(placeholderPage, /slug:\s*'galerie'/);
  assert.equal(existsSync(`${rootPath}/src/pages/galerie.astro`), false);
});

test('l’ordre de la liste du Studio est celui du carrousel', () => {
  const candidates = [
    galleryCandidate({ id: 'clochers' }),
    galleryCandidate({ id: 'autel' }),
    galleryCandidate({ id: 'croix' }),
  ];

  assert.deepEqual(
    selectGalleryItems(candidates).map(({ id }) => id),
    ['clochers', 'autel', 'croix'],
  );
});

test('une image sans texte alternatif est exclue', () => {
  assert.equal(isGalleryItemPublic(galleryCandidate({ alt: '   ' })), false);
});

test('une image générée par IA n’entre pas dans le carrousel', () => {
  assert.equal(
    isGalleryItemPublic(galleryCandidate({ generatedByAi: true })),
    false,
  );
});

test('Contact demeure sans endpoint ni envoi réseau', () => {
  const contactForm = readFileSync(
    `${rootPath}/src/components/sections/contact/ContactForm.astro`,
    'utf8',
  );

  assert.doesNotMatch(contactForm, /\bfetch\s*\(/);
  assert.doesNotMatch(contactForm, /XMLHttpRequest/);
  assert.match(contactForm, /event\.preventDefault\(\)/);
  assert.equal(existsSync(`${rootPath}/src/pages/api`), false);
});
