import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import {
  isAdvertiserPublishable,
  selectAdvertisers,
} from '../src/lib/advertisers/advertisers.ts';
import { siteSettingsData } from '../src/data/siteSettings.ts';
import { findRoute } from '../src/lib/seo/routes.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));

function advertiser(overrides = {}) {
  return {
    id: 'advertiser-default',
    name: 'Annonceur exemple',
    status: 'active',
    order: 1,
    ...overrides,
  };
}

test('un annonceur actif est publiable', () => {
  assert.equal(isAdvertiserPublishable(advertiser()), true);
});

test('un annonceur inactif et un brouillon sont exclus', () => {
  const selected = selectAdvertisers([
    advertiser({ id: 'inactive', status: 'inactive' }),
    advertiser({ id: 'draft', status: 'draft' }),
  ]);

  assert.equal(selected.length, 0);
});

test('un annonceur à confirmer est exclu par défaut', () => {
  const pending = advertiser({ status: 'confirmation-required' });

  assert.equal(isAdvertiserPublishable(pending), false);
  assert.equal(
    isAdvertiserPublishable(pending, {
      includeConfirmationRequired: true,
    }),
    true,
  );
});

test('la sélection respecte l’ordre et évite les doublons', () => {
  const selected = selectAdvertisers([
    advertiser({ id: 'third', order: 3 }),
    advertiser({ id: 'first', order: 1 }),
    advertiser({ id: 'second', order: 2 }),
    advertiser({ id: 'second', order: 4 }),
    advertiser({ id: 'first', order: 5 }),
  ]);

  assert.deepEqual(
    selected.map(({ id }) => id),
    ['first', 'second', 'third'],
  );
});

test('à rang égal, les fiches sont classées par nom', () => {
  const selected = selectAdvertisers([
    advertiser({ id: 'zephyr', name: 'Zephyr', order: 5 }),
    advertiser({ id: 'atelier', name: 'Atelier', order: 5 }),
    advertiser({ id: 'epicerie', name: 'Épicerie', order: 5 }),
  ]);

  assert.deepEqual(
    selected.map(({ name }) => name),
    ['Atelier', 'Épicerie', 'Zephyr'],
  );
});

test('une fiche sans logo possède un fallback typographique', () => {
  const component = readFileSync(
    `${rootPath}/src/components/sections/advertisers/AdvertiserList.astro`,
    'utf8',
  );

  assert.match(component, /advertiser-card__monogram/);
  assert.match(component, /\{advertiser\.logo \?/);
});

test('les données manquantes ne créent pas de lignes vides', () => {
  const component = readFileSync(
    `${rootPath}/src/components/sections/advertisers/AdvertiserList.astro`,
    'utf8',
  );

  assert.match(component, /advertiser\.address \|\|/);
  assert.match(component, /advertiser\.phone \|\|/);
  assert.match(component, /advertiser\.email/);
});

test('le téléphone du secrétariat provient des réglages globaux', () => {
  const dataSource = readFileSync(
    `${rootPath}/src/data/advertisers.ts`,
    'utf8',
  );

  assert.equal(siteSettingsData.phone.display, '514 722-1161');
  assert.equal(siteSettingsData.phone.e164, '+15147221161');
  assert.match(dataSource, /siteSettings:\s*PublicContactDetails/);
  assert.match(dataSource, /phone:\s*siteSettings\.phone/);
});

test('les liens commerciaux sont explicitement commandités', () => {
  const component = readFileSync(
    `${rootPath}/src/components/sections/advertisers/AdvertiserList.astro`,
    'utf8',
  );

  assert.match(component, /rel="sponsored noopener noreferrer"/);
  assert.match(component, /target="_blank"/);
});

test('l’ancienne route est noindex et canonique', () => {
  const aliasPage = readFileSync(
    `${rootPath}/src/pages/merci-a-nos-annonceurs.astro`,
    'utf8',
  );

  assert.match(aliasPage, /redirectTo="\/nos-annonceurs\/"/);

  // Depuis l'étape 4 du lot SEO, l'indexation et la canonique se lisent au
  // registre de routes, pas dans la page.
  const route = findRoute('/merci-a-nos-annonceurs/');
  assert.equal(route?.indexable, false);
  assert.equal(route?.canonicalPath, '/nos-annonceurs/');
});

test('la page reste utile sans annonceur confirmé', () => {
  const page = readFileSync(
    `${rootPath}/src/pages/nos-annonceurs.astro`,
    'utf8',
  );

  assert.match(page, /AdvertisersIntroduction/);
  assert.match(page, /BecomeAdvertiser/);
  assert.match(page, /page\.settings\.showAdvertisers/);
});

/**
 * « Nos annonceurs » était une entrée du menu « Informations », derrière un
 * geste que personne ne faisait. La paroisse a demandé un onglet : les
 * annonceurs paient pour être vus, et la page les remercie mal si elle est
 * introuvable.
 */
test('la route dédiée existe et l’onglet est au premier niveau', () => {
  const navigation = readFileSync(`${rootPath}/src/lib/navigation.ts`, 'utf8');

  assert.equal(existsSync(`${rootPath}/src/pages/nos-annonceurs.astro`), true);
  assert.match(
    navigation,
    /export const primaryNavigation = \[[^\]]*\{ label: 'Nos annonceurs', href: '\/nos-annonceurs' \}/s,
  );
});

test('aucune intégration d’envoi n’est ajoutée à la page', () => {
  const files = [
    `${rootPath}/src/pages/nos-annonceurs.astro`,
    `${rootPath}/src/data/advertisers.ts`,
    `${rootPath}/src/lib/content/getAdvertisersPageData.ts`,
  ];
  const source = files.map((file) => readFileSync(file, 'utf8')).join('\n');

  assert.doesNotMatch(source, /\bfetch\s*\(/);
  assert.doesNotMatch(source, /smtp|serverless|\/api\//i);
  assert.equal(existsSync(`${rootPath}/src/pages/api`), false);
});
