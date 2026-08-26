import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import {
  CONTACT_FORM_SENDS_MESSAGES,
  PRIVACY_OFFICER_ROLE,
  RETENTION_STATEMENT,
  THIRD_PARTY_SERVICES,
} from '../src/data/legal.ts';
import { findRoute } from '../src/lib/seo/routes.ts';

const rootPath = fileURLToPath(new URL('..', import.meta.url));
const read = (relativePath) =>
  readFileSync(`${rootPath}/${relativePath}`, 'utf8');

const privacy = read('src/pages/politique-de-confidentialite.astro');
const legal = read('src/pages/mentions-legales.astro');

/* -------------------------------------------------------------------------
 * Les pages existent vraiment
 * ------------------------------------------------------------------------- */

/**
 * Le formulaire de contact et le pied de page pointent tous deux vers la
 * politique. Tant qu'elle était un gabarit « en préparation », ce lien menait
 * un visiteur curieux de ce qu'on fait de son courriel vers une page vide.
 */
test('les deux pages légales ne sont plus des gabarits', () => {
  const placeholders = read('src/pages/[slug].astro');

  for (const slug of ['politique-de-confidentialite', 'mentions-legales']) {
    assert.ok(
      !placeholders.includes(slug),
      `${slug} est encore servie par le gabarit « page en préparation ».`,
    );
  }
});

test('le formulaire pointe vers une page qui existe', () => {
  const contact = read('src/data/contact.ts');
  const match = /privacyPolicyHref:\s*'([^']+)'/.exec(contact);

  assert.ok(match, 'le formulaire ne déclare aucune politique.');
  assert.ok(
    findRoute(match[1]),
    `le formulaire renvoie à « ${match[1]} », absente du registre de routes.`,
  );
});

test('les deux pages légales sont trouvables par un moteur', () => {
  for (const path of ['/politique-de-confidentialite/', '/mentions-legales/']) {
    assert.equal(
      findRoute(path)?.indexable,
      true,
      `« ${path} » est fermée à l’indexation.`,
    );
  }
});

/* -------------------------------------------------------------------------
 * La politique dit la vérité sur le site
 * ------------------------------------------------------------------------- */

/**
 * Le cœur de ces tests. Une politique de confidentialité est une **affirmation
 * vérifiable** sur le comportement du code. Si le site se met un jour à poser
 * un témoin ou à mesurer l'audience, la page continuera d'affirmer le
 * contraire — en silence, et pour toujours.
 */
test('le site ne dépose aucun témoin ni outil de mesure, comme la page l’affirme', () => {
  const sources = [
    'src/layouts/BaseLayout.astro',
    'src/components/layout/Header.astro',
    'src/components/layout/Footer.astro',
  ].map(read);

  const forbidden = [
    'document.cookie',
    'gtag(',
    'googletagmanager',
    'google-analytics',
    'plausible',
    'matomo',
    'fathom',
    'hotjar',
  ];

  for (const source of sources) {
    for (const term of forbidden) {
      assert.ok(
        !source.includes(term),
        `« ${term} » est apparu dans le site alors que la politique de confidentialité affirme le contraire.`,
      );
    }
  }
});

test('la politique nomme chaque service tiers que le site contacte', () => {
  for (const service of THIRD_PARTY_SERVICES) {
    assert.ok(
      privacy.includes(service.name) ||
        privacy.includes('THIRD_PARTY_SERVICES'),
      `${service.name} n’est pas mentionné dans la politique.`,
    );
  }

  // La carte est le seul tiers chargé sans que le visiteur ait cliqué : elle
  // doit figurer dans la liste, sous son vrai nom.
  const names = THIRD_PARTY_SERVICES.map((service) => service.name);
  assert.ok(
    names.includes('OpenStreetMap'),
    'la carte de la page Contact n’est pas déclarée.',
  );
  assert.ok(
    names.includes('Sanity'),
    'le service qui sert les images n’est pas déclaré.',
  );
});

test('la carte déclarée est bien celle que la page Contact affiche', () => {
  const map = read('src/data/siteSettings.ts');

  assert.match(
    map,
    /openstreetmap\.org/,
    'la politique déclare OpenStreetMap, mais la carte vient d’ailleurs.',
  );
});

/**
 * Tant que l'envoi est inactif, la page doit le dire. Le jour où le lot
 * « formulaire » basculera la constante, le paragraphe disparaîtra tout seul —
 * mais ce test vérifie que les deux versions du texte existent bel et bien.
 */
test('l’état réel du formulaire commande le texte affiché', () => {
  // La constante ne décrit pas une intention, mais ce que le code fait. Elle a
  // basculé le 20 août 2026, quand le formulaire s'est mis à transmettre pour
  // de vrai — et elle doit rester d'accord avec la Function qui l'exécute.
  assert.equal(
    CONTACT_FORM_SENDS_MESSAGES,
    true,
    'la constante a changé : relire la politique avant de publier.',
  );

  assert.equal(
    existsSync(`${rootPath}/functions/api/contact.ts`),
    CONTACT_FORM_SENDS_MESSAGES,
    'la politique annonce un envoi que rien ne réalise, ou l’inverse.',
  );

  assert.ok(
    privacy.includes('CONTACT_FORM_SENDS_MESSAGES'),
    'la politique décrit l’envoi sans consulter son état réel.',
  );
  // Les deux versions du texte doivent coexister : la page doit pouvoir
  // redire que l'envoi est inactif si quelqu'un débranche la Function.
  assert.ok(
    privacy.includes('n’est pas encore activé'),
    'la politique a perdu sa version « envoi inactif ».',
  );
});

test('la page annonce toujours ce que le formulaire demande', () => {
  const contact = read('src/data/contact.ts');
  const fields = [...contact.matchAll(/name:\s*'(\w+)'/g)].map(
    (match) => match[1],
  );

  // Les champs qui portent un renseignement personnel doivent être décrits.
  for (const [field, mention] of [
    ['fullName', 'nom'],
    ['email', 'courriel'],
    ['phone', 'téléphone'],
    ['message', 'message'],
  ]) {
    if (!fields.includes(field)) continue;

    assert.ok(
      privacy.toLowerCase().includes(mention),
      `le formulaire collecte « ${field} » sans que la politique le mentionne.`,
    );
  }
});

/* -------------------------------------------------------------------------
 * Ce qui n'est pas inventé
 * ------------------------------------------------------------------------- */

/** Une durée chiffrée serait un engagement que personne n'a pris. */
test('aucune durée de conservation n’est inventée', () => {
  assert.ok(RETENTION_STATEMENT.length > 0);
  assert.doesNotMatch(
    RETENTION_STATEMENT,
    /\b\d+\s*(jour|mois|an)/i,
    'une durée chiffrée est apparue sans que la paroisse l’ait fixée.',
  );
});

/**
 * On publie une fonction, pas un nom : un nom se périme au premier changement
 * de curé, et la loi désigne de toute façon la plus haute autorité par défaut.
 */
test('le responsable est une fonction, pas une personne nommée', () => {
  assert.match(PRIVACY_OFFICER_ROLE, /curé|secrétaire|responsable/i);
  assert.ok(
    privacy.includes('PRIVACY_OFFICER_ROLE'),
    'la politique écrit le responsable en dur au lieu de le lire.',
  );
});

test('les coordonnées ne sont recopiées dans aucune des deux pages', () => {
  for (const [name, source] of [
    ['la politique', privacy],
    ['les mentions légales', legal],
  ]) {
    assert.ok(
      source.includes('getSiteSettings'),
      `${name} n’utilise pas les coordonnées partagées.`,
    );

    assert.doesNotMatch(
      source,
      /514[\s-]?\d{3}[\s-]?\d{4}/,
      `un numéro de téléphone est recopié dans ${name}.`,
    );
    assert.doesNotMatch(
      source,
      /@videotron\.ca/,
      `une adresse courriel est recopiée dans ${name}.`,
    );
  }
});

test('le courriel n’apparaît que s’il est confirmé', () => {
  for (const source of [privacy, legal]) {
    assert.ok(
      source.includes('email &&') || source.includes('email ?'),
      'une des pages affiche le courriel sans vérifier qu’il est confirmé.',
    );
  }
});
