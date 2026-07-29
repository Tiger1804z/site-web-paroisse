import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import { siteSettingsData } from '../src/data/siteSettings.ts';
import {
  getPublishedGalleryItems,
  isGalleryItemPublic,
  selectHomepageGalleryItems,
} from '../src/lib/gallery/gallery.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));

function galleryItem(overrides = {}) {
  return {
    id: 'gallery-default',
    order: 1,
    status: 'published',
    rightsStatus: 'approved-for-site',
    alt: 'Vue factuelle de l’église',
    documentary: true,
    generatedByAi: false,
    containsRecognizablePeople: false,
    homepageVisible: true,
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

test('un brouillon est exclu de la galerie publique', () => {
  assert.equal(
    getPublishedGalleryItems([galleryItem({ id: 'draft', status: 'draft' })])
      .length,
    0,
  );
});

test('un droit en attente est exclu de la galerie publique', () => {
  assert.equal(
    isGalleryItemPublic(
      galleryItem({
        status: 'rights-pending',
        rightsStatus: 'pending',
      }),
    ),
    false,
  );
});

test('la sélection de l’accueil respecte sa limite', () => {
  const items = Array.from({ length: 8 }, (_, index) =>
    galleryItem({ id: `item-${index}`, order: index }),
  );

  assert.equal(selectHomepageGalleryItems(items, 6).length, 6);
});

test('homepageVisible false exclut une image du carrousel', () => {
  const items = [
    galleryItem({ id: 'visible', order: 1 }),
    galleryItem({
      id: 'hidden',
      homepageVisible: false,
      order: 2,
    }),
  ];

  assert.deepEqual(
    selectHomepageGalleryItems(items, 6).map(({ id }) => id),
    ['visible'],
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

test('l’ordre éditorial de la galerie est respecté', () => {
  const items = [
    galleryItem({ id: 'third', order: 3 }),
    galleryItem({ id: 'first', order: 1 }),
    galleryItem({ id: 'second', order: 2 }),
  ];

  assert.deepEqual(
    getPublishedGalleryItems(items).map(({ id }) => id),
    ['first', 'second', 'third'],
  );
});

test('une image sans texte alternatif est exclue', () => {
  assert.equal(isGalleryItemPublic(galleryItem({ alt: '   ' })), false);
});

test('une image générée par IA ne peut pas être documentaire et publique', () => {
  assert.equal(
    isGalleryItemPublic(galleryItem({ generatedByAi: true })),
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
