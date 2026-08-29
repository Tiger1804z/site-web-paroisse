// Le numéro principal de la paroisse s'affiche partout où il sert, et ne se
// compose nulle part d'un seul geste.
//
// La raison n'est pas technique : le secrétariat reçoit les appels de la
// paroisse à domicile, 24 heures sur 24. Un lien `tel:` ou un bouton
// « Appeler » transforme une consultation de minuit en sonnerie chez quelqu'un.
// La décision est donc d'afficher le numéro sans jamais offrir le geste qui
// déclenche l'appel.
//
// Ce fichier garde trois choses :
//
//   1. le contrat — `PublicPhone` n'a plus de forme cliquable;
//   2. les champs libres — un numéro de tiers garde son lien, sauf s'il s'agit
//      du numéro principal de la paroisse;
//   3. la source rendue — aucun composant ne construit de `tel:` à partir des
//      coordonnées de la paroisse, et aucun libellé d'appel ne s'y rattache.
//
// Le contrôle sur la sortie réellement produite vit à côté, dans
// `scripts/check-parish-phone.mjs` : lire le code dit comment il est écrit,
// lire `dist/` dit ce que le visiteur reçoit.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath, URL } from 'node:url';

import { siteSettingsData } from '../src/data/siteSettings.ts';
import {
  isParishMainPhone,
  toDialableDigits,
  toThirdPartyDialableDigits,
} from '../src/lib/content/parishPhone.ts';
import { normalizeSanitySiteSettings } from '../src/lib/content/normalizeSanitySiteSettings.ts';
import { normalizeSanityAdvertisers } from '../src/lib/content/normalizeSanityAdvertisers.ts';
import { normalizeSanityParishEvents } from '../src/lib/content/normalizeSanityParishEvents.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const buildSources = () => ({ src: 'https://exemple.test/image.jpg' });

/**
 * Le code sans ses commentaires.
 *
 * Un commentaire a le droit d'écrire « pas d'adresse `tel:` ici » — c'est même
 * ce qu'on veut lire. Seul le code compte pour ce contrôle.
 */
function withoutComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

/** Tous les fichiers de `src/`, en chemins relatifs à la racine du dépôt. */
function sourceFiles(directory = 'src') {
  return readdirSync(`${rootPath}/${directory}`, {
    withFileTypes: true,
  }).flatMap((entry) => {
    const relative = `${directory}/${entry.name}`;
    if (entry.isDirectory()) return sourceFiles(relative);
    return /\.(astro|ts|tsx|mjs)$/.test(entry.name) ? [relative] : [];
  });
}

test('les coordonnées de la paroisse ne portent aucune forme cliquable', () => {
  assert.equal(siteSettingsData.phone.display, '514 722-1161');
  assert.equal(siteSettingsData.phone.e164, '+15147221161');
  assert.equal('href' in siteSettingsData.phone, false);

  // Même chose une fois le numéro relu depuis Sanity : le normalizer dérive
  // l'affichage et les formats machine, jamais un lien d'appel.
  const fromSanity = normalizeSanitySiteSettings(
    { phone: '514 555-0199' },
    siteSettingsData,
  );

  assert.equal(fromSanity.phone.display, '514 555-0199');
  assert.equal(fromSanity.phone.e164, '+15145550199');
  assert.equal('href' in fromSanity.phone, false);
});

test('le type public ne décrit plus de lien d’appel', () => {
  const contract = read('src/types/siteSettings.ts');
  const phoneBlock = contract.slice(
    contract.indexOf('export interface PublicPhone'),
  );

  assert.doesNotMatch(phoneBlock.slice(0, phoneBlock.indexOf('}')), /tel:/);
});

test('le numéro de la paroisse se reconnaît quel que soit le format saisi', () => {
  for (const written of [
    '514 722-1161',
    '(514) 722-1161',
    '514-722-1161',
    '5147221161',
  ]) {
    assert.equal(isParishMainPhone(written), true, written);
    assert.equal(toThirdPartyDialableDigits(written), undefined, written);
    // La reconnaissance n'efface pas le numéro : seuls les chiffres à composer
    // disparaissent, l'affichage reste l'affaire de l'appelant.
    assert.equal(toDialableDigits(written), '5147221161', written);
  }

  for (const other of ['514 728-4345', '', null, undefined, '722-1161']) {
    assert.equal(isParishMainPhone(other), false, String(other));
  }

  // « +1 514 722-1161 » fait onze chiffres : il n'est pas reconnu comme le
  // numéro paroissial, mais il n'est pas composable non plus, donc aucun lien
  // n'en sort de toute façon.
  assert.equal(toDialableDigits('+1 514 722-1161'), undefined);
  assert.equal(toThirdPartyDialableDigits('+1 514 722-1161'), undefined);
});

test('un annonceur garde son numéro cliquable, la paroisse non', () => {
  const [boulangerie, secretariat] = normalizeSanityAdvertisers(
    [
      {
        _id: 'a1',
        name: 'Boulangerie',
        phone: '514 728-4345',
        status: 'active',
      },
      { _id: 'a2', name: 'Paroisse', phone: '514 722-1161', status: 'active' },
    ],
    buildSources,
  );

  assert.equal(boulangerie.phone.display, '514 728-4345');
  assert.equal(boulangerie.phone.href, 'tel:+15147284345');

  // Le numéro reste affiché sur la fiche; c'est le lien qui manque.
  assert.equal(secretariat.phone.display, '514 722-1161');
  assert.equal(secretariat.phone.href, undefined);
});

test('la personne-ressource d’une activité garde son numéro cliquable, la paroisse non', () => {
  const rawEvent = (phone) => ({
    _id: `event-${phone}`,
    title: 'Souper communautaire',
    slug: `souper-${phone.replace(/\D/g, '')}`,
    excerpt: 'Un souper.',
    startAt: '2026-09-12T23:00:00.000Z',
    category: 'communaute',
    contact: { consentGiven: true, name: 'Responsable', phone },
    publicationStatus: 'published',
  });

  const [organisatrice, secretariat] = normalizeSanityParishEvents(
    [rawEvent('514 996-0449'), rawEvent('514 722-1161')],
    buildSources,
  );

  assert.equal(organisatrice.contact.phoneHref, 'tel:+15149960449');

  // Le numéro reste publié — la carte affiche « Téléphone : 514 722-1161 » —
  // mais rien ne le compose.
  assert.equal(secretariat.contact.phone, '514 722-1161');
  assert.equal(secretariat.contact.phoneHref, undefined);
});

test('la friperie garde sa propre ligne cliquable', () => {
  const component = read(
    'src/components/sections/thrift-store/ThriftStoreIntroduction.astro',
  );

  // Le composant dérive le lien du numéro saisi, en passant par le garde-fou :
  // la friperie a sa ligne à elle, le secrétariat n'en a plus.
  assert.match(component, /toThirdPartyDialableDigits\(phoneDisplay\)/);
  assert.equal(toThirdPartyDialableDigits('514 721-2842'), '5147212842');
});

test('aucune source ne fabrique un lien d’appel vers le numéro de la paroisse', () => {
  // Les seuls `tel:` admis viennent de champs de tiers : annonceurs,
  // personne-ressource d'une activité, friperie. Tous passent par le garde-fou
  // de `parishPhone.ts`, dont c'est le rôle de refuser le numéro paroissial.
  const allowed = new Set([
    'src/lib/content/normalizeSanityAdvertisers.ts',
    'src/lib/content/normalizeSanityParishEvents.ts',
    'src/components/sections/thrift-store/ThriftStoreIntroduction.astro',
    // Repli local des fiches d'annonceurs : leurs numéros à eux, écrits en
    // toutes lettres. Le contrôle du numéro paroissial se fait juste en dessous.
    'src/data/advertisers.ts',
    // Contrats de type : ils décrivent la forme d'un lien de tiers.
    'src/types/advertisers.ts',
    'src/types/parish-events.ts',
  ]);

  const offenders = sourceFiles()
    .filter((file) => withoutComments(read(file)).includes('tel:'))
    .filter((file) => !allowed.has(file));

  assert.deepEqual(
    offenders,
    [],
    `Ces fichiers construisent un lien d’appel hors du garde-fou : ${offenders.join(', ')}`,
  );

  // Et chaque source admise passe bien par le garde-fou plutôt que de dériver
  // les chiffres elle-même.
  for (const file of allowed) {
    const source = read(file);
    if (!source.includes('`tel:+1${')) continue;
    assert.match(
      source,
      /parishPhone|toThirdPartyDialableDigits|isParishMainPhone/,
      `${file} fabrique un « tel: » sans passer par parishPhone.ts`,
    );
  }

  // Les numéros écrits en dur, eux, ne peuvent pas passer par un garde-fou :
  // on vérifie directement qu'aucun n'est celui de la paroisse.
  for (const file of allowed) {
    for (const [, digits] of read(file).matchAll(/tel:\+1(\d{10})/g)) {
      assert.notEqual(
        `+1${digits}`,
        siteSettingsData.phone.e164,
        `${file} écrit en dur un lien d’appel vers le numéro de la paroisse`,
      );
    }
  }
});

test('aucun libellé d’appel ne se rattache plus au numéro de la paroisse', () => {
  const surfaces = [
    'src/components/layout/Header.astro',
    'src/components/layout/Footer.astro',
    'src/components/sections/home/VisitSection.astro',
    'src/components/sections/services/ServicesClosing.astro',
    'src/components/sections/advertisers/BecomeAdvertiser.astro',
    'src/components/sections/contact/ContactMethods.astro',
    'src/data/contact.ts',
    'src/data/services.ts',
    'src/data/advertisers.ts',
    'src/pages/mentions-legales.astro',
    'src/pages/politique-de-confidentialite.astro',
  ];

  for (const file of surfaces) {
    // « téléphonez au 514 722-1161 » reste une phrase acceptable : elle donne le
    // numéro sans offrir le geste. Ce qui disparaît, c'est le libellé de bouton
    // ou d'étiquette d'accessibilité, qui promet une action.
    assert.doesNotMatch(
      read(file),
      /aria-label=\{?[`'"][^`'"]*Appeler|>\s*Appeler\s*<|label: '(Appeler|Téléphoner)[^']*'|Touchez le numéro/,
      `${file} propose encore une action d’appel`,
    );
  }
});

test('la barre d’actions rapides mène au contact, pas à un appel', () => {
  const footer = read('src/components/layout/Footer.astro');
  const bar = footer.slice(
    footer.indexOf('class="mobile-quick-actions"'),
    footer.indexOf('</nav>', footer.indexOf('class="mobile-quick-actions"')),
  );

  assert.match(bar, /contactNavigation\.href/);
  assert.doesNotMatch(bar, /phone/);
});
