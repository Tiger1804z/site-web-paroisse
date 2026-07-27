import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import {
  isAdvertiserPublishable,
  selectAdvertisers,
} from '../src/lib/advertisers/advertisers.ts';
import { siteSettingsData } from '../src/data/siteSettings.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));

function advertiser(overrides = {}) {
  return {
    id: 'advertiser-default',
    slug: 'advertiser-default',
    name: 'Annonceur exemple',
    status: 'active',
    featured: false,
    order: 1,
    ...overrides,
  };
}

test('un annonceur actif est publiable', () => {
  assert.equal(isAdvertiserPublishable(advertiser()), true);
});

test('un annonceur inactif et un brouillon sont exclus', () => {
  const selected = selectAdvertisers([
    advertiser({ id: 'inactive', slug: 'inactive', status: 'inactive' }),
    advertiser({ id: 'draft', slug: 'draft', status: 'draft' }),
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
    advertiser({ id: 'third', slug: 'third', order: 3 }),
    advertiser({ id: 'first', slug: 'first', order: 1 }),
    advertiser({ id: 'second', slug: 'second', order: 2 }),
    advertiser({ id: 'second', slug: 'second', order: 4 }),
    advertiser({ id: 'first', slug: 'different-slug', order: 5 }),
    advertiser({ id: 'different-id', slug: 'third', order: 6 }),
  ]);

  assert.deepEqual(
    selected.map(({ id }) => id),
    ['first', 'second', 'third'],
  );
});

test('une fiche sans logo possède un fallback typographique', () => {
  const component = readFileSync(
    `${rootPath}/src/components/sections/advertisers/AdvertiserList.astro`,
    'utf8',
  );

  assert.match(component, /advertiser-card__monogram/);
  assert.match(component, /advertiser\.logo\?\.status === 'confirmed'/);
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
  assert.equal(siteSettingsData.phone.href, 'tel:+15147221161');
  assert.match(dataSource, /phone:\s*siteSettingsData\.phone/);
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

  assert.match(aliasPage, /canonicalPath="\/nos-annonceurs\/"/);
  assert.match(aliasPage, /redirectTo="\/nos-annonceurs\/"/);
  assert.match(aliasPage, /\bnoIndex\b/);
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

test('la route dédiée existe et la navigation est active', () => {
  const navigation = readFileSync(`${rootPath}/src/lib/navigation.ts`, 'utf8');

  assert.equal(existsSync(`${rootPath}/src/pages/nos-annonceurs.astro`), true);
  assert.match(
    navigation,
    /\{\s*label:\s*'Nos annonceurs',\s*href:\s*'\/nos-annonceurs',\s*active:\s*true\s*\}/,
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
