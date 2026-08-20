// La couche d'envoi : ce que la paroisse reçoit, et ce qui ne sort jamais.
//
// L'API de Formspree n'est jamais appelée pour de vrai — `fetch` arrive en
// paramètre, et les tests lui substituent un espion. On vérifie donc deux
// choses : les champs que Formspree recevra, et le fait qu'une panne du
// fournisseur se traduise par un refus franc plutôt qu'un envoi imaginaire.
//
// La moitié « contenu » de ces tests — l'objet et le `Reply-To` — n'a pas bougé
// à travers trois changements de fournisseur. C'est ce qu'on attend d'une
// frontière : seul le transport se renouvelle.

import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath, URL } from 'node:url';
import {
  createFormspreeSender,
  formatContactEmail,
} from '../src/lib/contact/sendContactEmail.ts';

const ENDPOINT = 'https://formspree.io/f/exempletest';

const message = (overrides = {}) => ({
  reasonLabel: 'Baptême',
  submission: {
    fullName: 'Jean Tremblay',
    email: 'jean.tremblay@videotron.ca',
    phone: '514 555-0199',
    message: 'Bonjour,\n\nJe voudrais des informations sur le baptême.',
    ...overrides,
  },
});

/**
 * Un `fetch` qui note l'appel au lieu de le faire.
 *
 * `ok: true` par défaut : c'est ce que Formspree répond quand la soumission est
 * acceptée. Les tests qui veulent un refus le disent explicitement.
 *
 * Le corps est ré-analysé en `URLSearchParams` : c'est ainsi que Formspree le
 * lira, et c'est donc ainsi qu'il faut le vérifier.
 */
function spyFetch({ status = 200, throws = false, body } = {}) {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({
      url,
      init,
      form: Object.fromEntries(new URLSearchParams(init.body)),
    });
    if (throws) throw new Error('réseau injoignable');
    if (body === 'illisible') return new Response('<html>', { status });
    return new Response(JSON.stringify(body ?? { ok: true }), { status });
  };
  return { calls, fetchImpl };
}

const sender = (options = {}) =>
  createFormspreeSender({ endpoint: ENDPOINT, ...options });

test('le courriel porte le motif et le nom dans son objet', () => {
  // La boîte du secrétariat se trie d'un coup d'œil, sans ouvrir.
  const { subject } = formatContactEmail(message());

  assert.equal(subject, '[Nouveau message du site] Baptême — Jean Tremblay');
});

test('l’adresse du visiteur sert de Reply-To, jamais d’expéditeur', async () => {
  // Formspree lit le champ nommé `email` et le pose en `Reply-To`. C'est ce qui
  // permet à la secrétaire de cliquer « Répondre » et d'écrire à la bonne
  // personne, sans que le courriel prétende venir d'elle.
  const { replyTo } = formatContactEmail(message());
  assert.equal(replyTo, 'jean.tremblay@videotron.ca');

  const spy = spyFetch();
  await sender({ fetchImpl: spy.fetchImpl })(message());

  assert.equal(spy.calls[0].form.email, 'jean.tremblay@videotron.ca');
});

test('les champs portent les noms que Formspree reconnaît', async () => {
  // Ces noms ne sont pas libres : `email` devient le `Reply-To`, `subject`
  // l'en-tête d'objet, et `name`, `phone`, `message` sont identifiés comme
  // tels. Notre contrat interne dit `fullName`; la traduction vit ici, et
  // nulle part ailleurs.
  const spy = spyFetch();
  await sender({ fetchImpl: spy.fetchImpl })(message());

  const { url, init, form } = spy.calls[0];

  assert.equal(url, ENDPOINT);
  assert.equal(init.method, 'POST');
  assert.equal(
    init.headers['content-type'],
    'application/x-www-form-urlencoded',
  );
  // Sans cet en-tête, Formspree répond par une redirection vers sa page de
  // remerciement au lieu du JSON que la garde de succès attend.
  assert.equal(init.headers.accept, 'application/json');

  assert.deepEqual(form, {
    name: 'Jean Tremblay',
    email: 'jean.tremblay@videotron.ca',
    reason: 'Baptême',
    message: 'Bonjour,\n\nJe voudrais des informations sur le baptême.',
    subject: '[Nouveau message du site] Baptême — Jean Tremblay',
    phone: '514 555-0199',
  });

  // `fullName` est notre vocabulaire, pas celui de Formspree.
  assert.equal('fullName' in form, false);
});

test('le motif part en clair, pas en valeur machine', async () => {
  // C'est un humain qui ouvrira ce courriel : « Baptême », pas « baptism ».
  const spy = spyFetch();
  await sender({ fetchImpl: spy.fetchImpl })(message());

  assert.equal(spy.calls[0].form.reason, 'Baptême');
  assert.doesNotMatch(spy.calls[0].init.body, /baptism/);
});

test('le corps est encodé en x-www-form-urlencoded', async () => {
  // L'espace, l'arobase, les accents et les retours à la ligne doivent tous
  // survivre au transport. Écrire cet encodage à la main serait une source de
  // bogues, que le premier paroissien nommé « Côté » trouverait.
  const spy = spyFetch();
  await sender({ fetchImpl: spy.fetchImpl })(
    message({ fullName: 'Marie Côté', message: 'Ligne un\nLigne deux.' }),
  );

  const { init, form } = spy.calls[0];

  assert.match(init.body, /name=Marie\+C%C3%B4t%C3%A9/);
  assert.match(init.body, /%40videotron\.ca/);
  assert.doesNotMatch(init.body, /\n/);

  // Et l'aller-retour rend exactement ce qui est parti.
  assert.equal(form.name, 'Marie Côté');
  assert.equal(form.message, 'Ligne un\nLigne deux.');
});

test('un téléphone absent ne devient pas une ligne vide', async () => {
  const spy = spyFetch();
  await sender({ fetchImpl: spy.fetchImpl })(message({ phone: undefined }));

  assert.equal('phone' in spy.calls[0].form, false);
  assert.doesNotMatch(spy.calls[0].init.body, /phone/);
});

test('une adresse d’envoi absente refuse au lieu d’envoyer dans le vide', async () => {
  // Le pire résultat serait un message qui disparaît en promettant d'être
  // arrivé. Une panne visible vaut mieux qu'un silence.
  const spy = spyFetch();
  const send = sender({ endpoint: '', fetchImpl: spy.fetchImpl });

  assert.equal(await send(message()), false);
  assert.equal(spy.calls.length, 0, 'aucun appel ne doit partir');
});

test('une panne du fournisseur se traduit par un refus franc', async () => {
  for (const état of [
    { status: 401 },
    // Formspree refuse une soumission mal formée par un 422 et un tableau
    // `errors`, dont les messages recopient la saisie : on ne les journalise pas.
    {
      status: 422,
      body: { errors: [{ message: 'Le champ email est requis' }] },
    },
    { status: 429 },
    // Un endpoint supprimé ou mal recopié.
    { status: 404, body: {} },
    { status: 500 },
    { throws: true },
    { body: 'illisible' },
  ]) {
    const spy = spyFetch(état);

    assert.equal(
      await sender({ fetchImpl: spy.fetchImpl })(message()),
      false,
      JSON.stringify(état),
    );
  }
});

test('un 200 qui ne dit pas « ok » n’est pas un envoi réussi', async () => {
  // Quatrième occurrence du même piège dans ce formulaire — après
  // `z.literal(true)` pour le consentement et `success === true` pour
  // Turnstile. Comparer, jamais tester la véracité : `'true'` est une chaîne
  // non vide, donc vraie, et laisserait passer un refus.
  for (const body of [
    {},
    { ok: false },
    { ok: 'true' },
    { ok: 1 },
    { next: '/merci' },
  ]) {
    const spy = spyFetch({ status: 200, body });

    assert.equal(
      await sender({ fetchImpl: spy.fetchImpl })(message()),
      false,
      JSON.stringify(body),
    );
    assert.equal(spy.calls.length, 1, 'la requête doit bien avoir été tentée');
  }
});

test('un envoi accepté rend vrai', async () => {
  const spy = spyFetch({ status: 200, body: { ok: true } });

  assert.equal(await sender({ fetchImpl: spy.fetchImpl })(message()), true);
});

test('aucun retour à la ligne ne peut se glisser dans l’objet', async () => {
  // Les en-têtes d'un courriel sont séparés par des retours à la ligne. Le
  // schéma Zod les a déjà retirés du nom; on vérifie ici que la mise en forme
  // ne les réintroduit pas — c'est la dernière porte avant le fournisseur.
  const spy = spyFetch();
  await sender({ fetchImpl: spy.fetchImpl })(
    message({ fullName: 'Jean Bcc: mille@adresses.com' }),
  );

  assert.doesNotMatch(spy.calls[0].form.subject, /[\r\n]/);
});

test('la mise en forme du message ne dépend d’aucun fournisseur', () => {
  // `formatContactEmail` a traversé trois transporteurs sans changer de rôle.
  // C'est la définition d'une frontière qui tient : le transport se renouvelle,
  // ce qui reste à nous — l'objet et le `Reply-To` — ne bouge pas.
  const source = readFileSync(
    fileURLToPath(
      new URL('../src/lib/contact/sendContactEmail.ts', import.meta.url),
    ),
    'utf8',
  );
  // De la signature à son accolade fermante, en colonne zéro : le corps de la
  // fonction et rien d'autre. Prendre jusqu'au bloc suivant embarquerait sa
  // documentation, qui a le droit de nommer le fournisseur.
  const start = source.indexOf('export function formatContactEmail');
  const formatter = source.slice(start, source.indexOf('\n}', start) + 2);

  assert.ok(formatter.length > 0, 'la mise en forme a disparu du fichier');
  for (const fournisseur of [
    'formspree',
    'Formspree',
    'postmark',
    'Postmark',
    'resend',
    'Resend',
    'fetch',
    'URLSearchParams',
  ]) {
    assert.doesNotMatch(
      formatter,
      new RegExp(fournisseur),
      `la mise en forme mentionne « ${fournisseur} » : la frontière a fui`,
    );
  }
});

test('l’adresse du formulaire n’est écrite nulle part dans le dépôt', () => {
  // Elle désigne la boîte du secrétariat : quiconque la connaît peut y poster
  // directement, sans passer par Zod ni par Turnstile. Elle vit dans
  // l'environnement du serveur, et seulement là.
  const rootPath = fileURLToPath(new URL('..', import.meta.url));

  for (const file of [
    'src/lib/contact/sendContactEmail.ts',
    'functions/api/contact.ts',
    'src/components/sections/contact/ContactForm.astro',
  ]) {
    // Sans les commentaires : un `https://formspree.io/f/xxxxxxxx` qui montre
    // la forme attendue est de la documentation, pas une adresse.
    const code = readFileSync(`${rootPath}/${file}`, 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');

    assert.doesNotMatch(
      code,
      /formspree\.io/i,
      `${file} contient une adresse de formulaire en dur`,
    );
  }
});
