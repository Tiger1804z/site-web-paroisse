// La coquille HTTP du formulaire Contact : ce qu'elle laisse passer, ce
// qu'elle refuse, et ce qu'elle ne déclenche jamais.
//
// Le schéma Zod (`tests/contact-submission.test.mjs`) vérifie le contenu d'un
// message. Ce fichier-ci vérifie tout ce qui se joue avant : la méthode,
// l'origine, le type de contenu, la taille du corps, l'analyse du JSON — et le
// fait qu'un refus ne demande jamais d'envoi.
//
// La couche d'envoi arrive en paramètre, donc on n'envoie rien : on vérifie
// qu'on a demandé qu'un courriel parte, avec quoi dedans. C'est la seule chose
// vérifiable sans fournisseur, et c'est la seule qui relève de notre code.

import assert from 'node:assert/strict';
import test from 'node:test';
import { handleContactRequest } from '../src/lib/contact/handleContactRequest.ts';

const ORIGIN = 'https://paroissesaintrenegoupil.com';
const ENDPOINT = `${ORIGIN}/api/contact`;

const validSubmission = () => ({
  // Le jeton escorte tout envoi qui doit aboutir. Zod l'écarte du message; le
  // gestionnaire le lit sur la charge brute, avant de le donner à Cloudflare.
  turnstileToken: 'jeton-de-test',
  reason: 'baptism',
  fullName: 'Jean Tremblay',
  email: 'jean.tremblay@videotron.ca',
  phone: '514 555-0199',
  message: 'Bonjour, je voudrais des informations sur le baptême de ma fille.',
  privacyConsent: true,
});

/**
 * Les deux dépendances du gestionnaire, qui notent ce qu'on leur demande.
 *
 * `verified` et `sent` sont la seule chose que les tests regardent vraiment :
 * un refus qui répond bien mais consomme quand même un jeton — ou envoie
 * quand même le courriel — serait un refus pour la forme.
 */
function contactDeps({ human = true, outcome = true } = {}) {
  const verified = [];
  const sent = [];

  return {
    verified,
    sent,
    deps: {
      verifyHuman: async (token, remoteIp) => {
        verified.push({ token, remoteIp });
        return human;
      },
      sendMessage: async (message) => {
        sent.push(message);
        if (outcome instanceof Error) throw outcome;
        return outcome;
      },
    },
  };
}

/**
 * Une requête bien formée, dont chaque test ne change qu'une chose.
 *
 * `null` veut dire « en-tête absent », et non `undefined` : une valeur
 * `undefined` réveille la valeur par défaut du paramètre, et l'en-tête qu'on
 * croyait avoir retiré serait remis. Le test passerait alors au vert en
 * vérifiant l'inverse de ce qu'il annonce.
 */
function contactRequest({
  method = 'POST',
  origin = ORIGIN,
  contentType = 'application/json',
  headers = {},
  body = validSubmission(),
} = {}) {
  const composed = new Headers(headers);
  if (origin !== null) composed.set('origin', origin);
  if (contentType !== null) composed.set('content-type', contentType);

  return new Request(ENDPOINT, {
    method,
    headers: composed,
    // Un `GET` ou un `HEAD` ne peut pas porter de corps : la plateforme le
    // refuse avant même notre code.
    ...(method === 'POST' || method === 'PUT' || method === 'DELETE'
      ? { body: typeof body === 'string' ? body : JSON.stringify(body) }
      : {}),
  });
}

/** Joue une requête et rend le statut, le corps analysé et les en-têtes. */
async function run(request, harness) {
  const response = await handleContactRequest(request, harness.deps);
  return { response, body: await response.json() };
}

test('un message valide part et reçoit une confirmation', async () => {
  const sender = contactDeps();
  const { response, body } = await run(contactRequest(), sender);

  assert.equal(response.status, 200);
  assert.equal(body.ok, true);
  assert.equal(sender.sent.length, 1);

  // Ce qui part est ce que le schéma a validé, libellé compris — la Function
  // ne réinvente rien et ne recopie rien.
  assert.equal(sender.sent[0].reasonLabel, 'Baptême');
  assert.equal(sender.sent[0].submission.email, 'jean.tremblay@videotron.ca');
  assert.equal(sender.sent[0].submission.fullName, 'Jean Tremblay');
});

test('la confirmation ne promet pas de réponse', async () => {
  // La paroisse est un secrétariat ouvert deux jours et demi par semaine.
  // Promettre un délai qu'elle ne tiendra pas déçoit à coup sûr; dire merci ne
  // déçoit jamais.
  const { body } = await run(contactRequest(), contactDeps());

  assert.match(body.message, /transmis/i);
  assert.doesNotMatch(
    body.message,
    /rapidement|sous \d|délai|24|48|heures?\b/i,
  );
});

test('seule la méthode POST est acceptée', async () => {
  for (const method of ['GET', 'HEAD', 'PUT', 'DELETE', 'OPTIONS']) {
    const sender = contactDeps();
    const { response } = await run(contactRequest({ method }), sender);

    assert.equal(response.status, 405, method);
    assert.equal(sender.sent.length, 0, `${method} ne doit rien envoyer`);
  }
});

test('une origine qui n’est pas la nôtre est refusée', async () => {
  const étrangères = [
    'https://evil.example',
    // Même nom, autre protocole : un intermédiaire en clair n'est pas nous.
    'http://paroissesaintrenegoupil.com',
    // Même nom, autre port : une autre application sur la même machine.
    'https://paroissesaintrenegoupil.com:8443',
    // Sous-domaine : proche n'est pas identique.
    'https://autre.paroissesaintrenegoupil.com',
    'null',
    '',
  ];

  for (const origin of étrangères) {
    const sender = contactDeps();
    const { response } = await run(contactRequest({ origin }), sender);

    assert.equal(response.status, 403, origin);
    assert.equal(sender.sent.length, 0, `${origin} ne doit rien envoyer`);
  }
});

test('une requête sans en-tête Origin est refusée', async () => {
  // Le navigateur en envoie un sur toute requête qui n'est ni GET ni HEAD : ce
  // qui n'en a pas ne vient pas d'une page.
  const sender = contactDeps();
  const { response } = await run(contactRequest({ origin: null }), sender);

  assert.equal(response.status, 403);
  assert.equal(sender.sent.length, 0);

  // Garde-fou du garde-fou : sans l'en-tête, la requête ne doit vraiment pas
  // en porter un. Un assistant de test qui le remettrait rendrait ce test muet.
  assert.equal(contactRequest({ origin: null }).headers.get('origin'), null);
});

test('le type de contenu doit annoncer du JSON', async () => {
  for (const contentType of [
    'text/plain',
    'multipart/form-data; boundary=x',
    'application/x-www-form-urlencoded',
    'application/xml',
    '',
    // Absent de notre code : la plateforme pose alors `text/plain` d'office
    // pour un corps textuel, ce qui n'est toujours pas du JSON.
    null,
  ]) {
    const sender = contactDeps();
    const { response } = await run(contactRequest({ contentType }), sender);

    assert.equal(response.status, 415, contentType ?? '(absent)');
    assert.equal(sender.sent.length, 0);
  }
});

test('le charset accompagnant le JSON est admis', async () => {
  // C'est ce que `fetch` envoie couramment. Une égalité stricte refuserait nos
  // propres visiteurs.
  for (const contentType of [
    'application/json; charset=utf-8',
    'application/json;charset=UTF-8',
    'APPLICATION/JSON',
  ]) {
    const { response } = await run(
      contactRequest({ contentType }),
      contactDeps(),
    );

    assert.equal(response.status, 200, contentType);
  }
});

test('une taille annoncée trop grande est refusée sans lire le corps', async () => {
  const sender = contactDeps();
  const { response } = await run(
    contactRequest({ headers: { 'content-length': '99999999' } }),
    sender,
  );

  assert.equal(response.status, 413);
  assert.equal(sender.sent.length, 0);
});

test('un corps réellement trop gros est refusé, même sans taille annoncée', async () => {
  // L'en-tête est déclaratif : c'est l'attaquant qui l'écrit. On le croit quand
  // il s'accuse, jamais quand il se disculpe — d'où la deuxième mesure.
  const sender = contactDeps();
  const { response } = await run(
    contactRequest({
      body: { ...validSubmission(), message: 'a'.repeat(20_000) },
    }),
    sender,
  );

  assert.equal(response.status, 413);
  assert.equal(sender.sent.length, 0);
});

test('un corps de taille normale passe, taille annoncée ou non', async () => {
  const { response } = await run(contactRequest(), contactDeps());
  assert.equal(response.status, 200);

  const annoncée = await run(
    contactRequest({
      headers: {
        'content-length': String(JSON.stringify(validSubmission()).length),
      },
    }),
    contactDeps(),
  );
  assert.equal(annoncée.response.status, 200);
});

test('un JSON malformé est un refus, pas une exception', async () => {
  for (const body of ['{pas du json', '', 'null', '[]', '"chaîne"', '42']) {
    const sender = contactDeps();
    const { response } = await run(contactRequest({ body }), sender);

    assert.equal(response.status, 400, JSON.stringify(body));
    assert.equal(sender.sent.length, 0);
  }
});

test('un contenu refusé par le schéma n’atteint pas la couche d’envoi', async () => {
  const refusés = {
    'consentement absent': { privacyConsent: 'on' },
    'courriel invalide': { email: 'pas-une-adresse' },
    'message trop court': { message: 'Allo' },
    'motif inconnu': { reason: 'piratage' },
    'piège à robots rempli': { website: 'http://spam.example' },
  };

  for (const [nom, écart] of Object.entries(refusés)) {
    const sender = contactDeps();
    const { response } = await run(
      contactRequest({ body: { ...validSubmission(), ...écart } }),
      sender,
    );

    assert.equal(response.status, 400, nom);
    assert.equal(sender.sent.length, 0, `${nom} ne doit rien envoyer`);
  }
});

test('une panne du fournisseur se distingue d’un message refusé', async () => {
  // 400 veut dire « ton message est refusé ». 502 veut dire « ton message est
  // bon, c'est nous qui sommes en panne » : deux situations opposées, deux
  // messages, et seul le second invite à réessayer.
  const refus = await run(contactRequest(), contactDeps({ outcome: false }));
  assert.equal(refus.response.status, 502);
  assert.match(refus.body.error, /réessayer/i);

  const exception = await run(
    contactRequest(),
    contactDeps({ outcome: new Error('fournisseur injoignable') }),
  );
  assert.equal(exception.response.status, 502);
  assert.match(exception.body.error, /réessayer/i);
});

test('aucune réponse ne décrit la règle qui a échoué', async () => {
  const sondes = [
    contactRequest({ method: 'GET' }),
    contactRequest({ origin: 'https://evil.example' }),
    contactRequest({ contentType: 'text/plain' }),
    contactRequest({ body: '{pas du json' }),
    contactRequest({ body: { ...validSubmission(), email: 'x' } }),
  ];

  for (const request of sondes) {
    const { body } = await run(request, contactDeps());

    assert.equal(body.ok, false);
    // Ni le nom du champ fautif, ni la borne, ni la bibliothèque employée.
    assert.doesNotMatch(
      body.error,
      /email|courriel invalide|reason|consent|zod|origin|content-type|length|honeypot|website/i,
    );
  }
});

test('aucune réponse ne renvoie ce que le visiteur a écrit', async () => {
  // Une réponse qui recopie la saisie est un réflecteur : elle transporte du
  // contenu choisi par l'appelant vers un autre écran.
  const { body } = await run(
    contactRequest({
      body: {
        ...validSubmission(),
        fullName: 'MARQUEUR_UNIQUE_XYZ',
        email: 'pas-une-adresse',
      },
    }),
    contactDeps(),
  );

  assert.doesNotMatch(JSON.stringify(body), /MARQUEUR_UNIQUE_XYZ/);
  assert.doesNotMatch(JSON.stringify(body), /pas-une-adresse/);
});

test('toute réponse est du JSON qu’aucun cache ne conserve', async () => {
  // La réponse dépend de ce que le visiteur a écrit : elle n'a rien à faire
  // dans un cache, encore moins dans un cache partagé.
  const requêtes = [
    contactRequest(),
    contactRequest({ method: 'GET' }),
    contactRequest({ origin: 'https://evil.example' }),
    contactRequest({ contentType: 'text/plain' }),
    contactRequest({ body: '{pas du json' }),
  ];

  for (const request of requêtes) {
    const response = await handleContactRequest(request, contactDeps().deps);

    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.match(response.headers.get('content-type'), /application\/json/);
  }
});

test('un jeton absent ou vide est refusé sans déranger Cloudflare', async () => {
  // La quasi-totalité des robots n'envoie aucun jeton. Leur répondre coûte une
  // comparaison de chaîne, pas un aller-retour réseau.
  for (const turnstileToken of [
    undefined,
    '',
    '   ',
    42,
    null,
    'a'.repeat(5000),
  ]) {
    const sender = contactDeps();
    const body = { ...validSubmission(), turnstileToken };
    if (turnstileToken === undefined) delete body.turnstileToken;

    const { response } = await run(contactRequest({ body }), sender);

    assert.equal(response.status, 403, JSON.stringify(turnstileToken));
    assert.equal(
      sender.verified.length,
      0,
      'aucune vérification ne doit partir',
    );
    assert.equal(sender.sent.length, 0);
  }
});

test('un jeton refusé par Cloudflare n’envoie rien', async () => {
  const sender = contactDeps({ human: false });
  const { response } = await run(contactRequest(), sender);

  assert.equal(response.status, 403);
  assert.equal(sender.verified.length, 1, 'la vérification doit avoir eu lieu');
  assert.equal(sender.sent.length, 0);
});

test('aucun jeton n’est consommé pour un message invalide', async () => {
  // C'est la raison d'être de l'ordre retenu. Un jeton ne sert qu'une fois :
  // le brûler pour un courriel mal tapé condamnerait la deuxième tentative du
  // visiteur, qui ne comprendrait pas pourquoi son envoi corrigé est refusé.
  const invalides = {
    'consentement absent': { privacyConsent: 'on' },
    'courriel invalide': { email: 'pas-une-adresse' },
    'message trop court': { message: 'Allo' },
    'motif inconnu': { reason: 'piratage' },
    'piège à robots rempli': { website: 'http://spam.example' },
  };

  for (const [nom, écart] of Object.entries(invalides)) {
    const sender = contactDeps();
    const { response } = await run(
      contactRequest({ body: { ...validSubmission(), ...écart } }),
      sender,
    );

    assert.equal(response.status, 400, nom);
    assert.equal(
      sender.verified.length,
      0,
      `${nom} ne doit pas brûler de jeton`,
    );
  }
});

test('aucun jeton n’est consommé quand la requête est refusée plus tôt', async () => {
  const refusées = [
    contactRequest({ method: 'GET' }),
    contactRequest({ origin: 'https://evil.example' }),
    contactRequest({ origin: null }),
    contactRequest({ contentType: 'text/plain' }),
    contactRequest({ headers: { 'content-length': '99999999' } }),
    contactRequest({ body: '{pas du json' }),
  ];

  for (const request of refusées) {
    const sender = contactDeps();
    await run(request, sender);

    assert.equal(sender.verified.length, 0, `${request.method} ${request.url}`);
    assert.equal(sender.sent.length, 0);
  }
});

test('le jeton est transmis tel quel, avec l’adresse posée par Cloudflare', async () => {
  const sender = contactDeps();
  await run(
    contactRequest({
      body: { ...validSubmission(), turnstileToken: '  jeton-espacé  ' },
      headers: { 'cf-connecting-ip': '203.0.113.7' },
    }),
    sender,
  );

  // Rogné, mais pas altéré : Cloudflare seul sait lire un jeton.
  assert.equal(sender.verified[0].token, 'jeton-espacé');
  assert.equal(sender.verified[0].remoteIp, '203.0.113.7');
});

test('le jeton n’atteint jamais la couche d’envoi', async () => {
  // Il escorte le message, il n'en fait pas partie : rien de lui ne doit
  // pouvoir finir dans le courriel de la paroisse.
  const sender = contactDeps();
  await run(contactRequest(), sender);

  assert.equal(sender.sent.length, 1);
  assert.equal('turnstileToken' in sender.sent[0].submission, false);
  assert.doesNotMatch(JSON.stringify(sender.sent[0]), /jeton-de-test/);
});
