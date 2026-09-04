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

test('le téléphone possède ses formats public, international et machine', () => {
  assert.equal(siteSettingsData.phone.display, '514 722-1161');
  assert.equal(siteSettingsData.phone.international, '+1 514 722-1161');
  assert.equal(siteSettingsData.phone.e164, '+15147221161');
  // Aucun format cliquable : voir tests/parish-phone.test.mjs.
  assert.equal('href' in siteSettingsData.phone, false);
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

/**
 * La galerie attendait, désactivée, dans le menu « Informations ». Ce menu a
 * disparu; l'entrée aussi. La route reste réservée et fermée au registre, mais
 * plus aucune liste de navigation ne la nomme — un lien vers une page vide est
 * pire qu'une page absente.
 */
test('Galerie reste masquée de la navigation publique', () => {
  const navigation = readFileSync(`${rootPath}/src/lib/navigation.ts`, 'utf8');

  assert.ok(
    !navigation.includes("label: 'Galerie'"),
    'aucune liste de navigation ne doit nommer la galerie.',
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

test('Contact n’envoie que vers sa propre adresse, et sans secret', () => {
  // Le formulaire envoie désormais pour de vrai. Ce qui reste interdit :
  // envoyer ailleurs que chez nous, et emporter quoi que ce soit de secret
  // dans un fichier servi au navigateur.
  const contactForm = readFileSync(
    `${rootPath}/src/components/sections/contact/ContactForm.astro`,
    'utf8',
  );

  // Une adresse relative, donc la même origine. Une adresse absolue enverrait
  // les coordonnées d'un paroissien vers un tiers.
  assert.match(contactForm, /data-endpoint="\/api\/contact"/);
  assert.doesNotMatch(contactForm, /fetch\(\s*['"`]https?:\/\//);

  // L'envoi reste maîtrisé : jamais la soumission native du navigateur, qui
  // partirait sans jeton ni JSON.
  assert.match(contactForm, /event\.preventDefault\(\)/);

  // Seule la clé publique Turnstile entre dans la page. Les quatre autres
  // valeurs vivent dans la Function, et n'ont pas de nom à citer ici.
  assert.match(contactForm, /PUBLIC_TURNSTILE_SITE_KEY/);
  for (const secret of [
    'TURNSTILE_SECRET_KEY',
    // L'adresse du formulaire désigne la boîte du secrétariat : dans une page,
    // elle offrirait à quiconque un accès direct, sans Zod ni Turnstile.
    'FORMSPREE_ENDPOINT',
    'formspree.io',
    'videotron.ca',
  ]) {
    assert.doesNotMatch(
      contactForm,
      new RegExp(secret.replace('.', '\\.')),
      `${secret} n’a rien à faire dans un composant servi au navigateur`,
    );
  }

  // L'adresse vit dans une Pages Function, à la racine du dépôt. Une route
  // Astro sous `src/pages/api` exigerait un adaptateur serveur et ferait
  // perdre au site public sa nature de fichiers statiques.
  assert.equal(existsSync(`${rootPath}/src/pages/api`), false);
  assert.equal(existsSync(`${rootPath}/functions/api/contact.ts`), true);
});
