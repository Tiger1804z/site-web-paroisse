import type { ContactSubmission } from './contactSubmission.ts';
// Chemin relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`.
import { validateContactSubmission } from './contactSubmission.ts';
import type { TurnstileVerifier } from './verifyTurnstile.ts';
import { readTurnstileToken } from './verifyTurnstile.ts';
/**
 * Les gardes que Zod ne peut pas poser.
 *
 * Le schéma s'exécute après `JSON.parse()` : il ne voit ni la méthode HTTP, ni
 * l'origine, ni le type de contenu, ni la taille du corps. Ce module tient
 * cette moitié-là, et appelle le schéma une fois le terrain déminé.
 *
 * Il ne connaît ni fournisseur d'envoi, ni Turnstile, ni Cloudflare : l'envoi
 * lui arrive en
 * paramètre. C'est ce qui le rend testable — on ne peut pas vérifier qu'un
 * courriel est parti, on peut vérifier qu'on a demandé qu'il parte.
 */

/** Taille maximale du corps, en octets. Le message est borné à 2000 caractères. */
const MAX_BODY_BYTES = 16 * 1024;

/**
 * Ce qu'on demande à la couche d'envoi.
 *
 * Renvoie `false` quand le fournisseur refuse. Une exception convient aussi :
 * l'appelant traite les deux de la même façon.
 */
export type ContactMessageSender = (message: {
  readonly submission: ContactSubmission;
  readonly reasonLabel: string;
}) => Promise<boolean>;
/**
 * Ce que le gestionnaire ne sait pas faire lui-même.
 *
 * Un objet plutôt que deux paramètres positionnels : deux fonctions côte à
 * côte se distinguent mal à l'appel, et se confondent silencieusement le jour
 * où l'on inverse leur ordre. Nommées, elles ne peuvent pas se croiser.
 */
export interface ContactHandlerDependencies {
  readonly verifyHuman: TurnstileVerifier;
  readonly sendMessage: ContactMessageSender;
}

/**
 * Réponses génériques.
 *
 * Le visiteur légitime a déjà eu ses messages d'erreur détaillés dans le
 * navigateur : arrivé ici, il n'y a plus que des cas de figure qui n'auraient
 * pas dû se produire. Une réponse précise ne l'aiderait donc pas, et
 * décrirait la logique du serveur à qui la sonde.
 */
const RESPONSES = {
  sent: 'Votre message a bien été transmis à la paroisse. Merci de nous avoir écrit.',
  refused: 'Envoi refusé.',
  unavailable:
    'L’envoi a échoué. Veuillez réessayer plus tard ou nous écrire autrement.',
} as const;

function json(status: number, payload: Record<string, unknown>): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      // Rien à mettre en cache ici, et surtout rien à laisser traîner dans un
      // cache partagé : la réponse dépend de ce que le visiteur a écrit.
      'cache-control': 'no-store',
    },
  });
}

const refuse = (status: number) =>
  json(status, { ok: false, error: RESPONSES.refused });

/**
 * L'origine attendue est celle de la requête elle-même.
 *
 * La Function est servie par le même domaine que la page : sur
 * `paroissesaintrenegoupil.com`, sur un déploiement `*.pages.dev`, ou sur
 * `localhost` en développement, l'origine de la page et celle de l'adresse
 * appelée coïncident toujours. Aucune liste à tenir à jour, donc aucune liste
 * à oublier de mettre à jour le jour du changement de domaine.
 *
 * Un `Origin` absent est refusé. Le navigateur en envoie un sur toute requête
 * qui n'est ni `GET` ni `HEAD` : ce qui n'en a pas ne vient pas d'une page.
 */
function hasSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;

  try {
    return origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

/**
 * Traite une soumission du formulaire Contact.
 *
 * L'ordre des gardes n'est pas décoratif : chacune est moins chère que la
 * suivante, et refuse avant que la suivante ait à travailler. Refuser un corps
 * de 10 Mo après l'avoir analysé, c'est se défendre une fois l'attaque passée.
 */
export async function handleContactRequest(
  request: Request,
  { verifyHuman, sendMessage }: ContactHandlerDependencies,
): Promise<Response> {
  // 1. La méthode. Un formulaire s'envoie, il ne se lit pas.
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: RESPONSES.refused });
  }

  // 2. L'origine. Une page tierce ne poste pas au nom de nos visiteurs.
  if (!hasSameOrigin(request)) return refuse(403);

  // 3. Le type de contenu. Le `charset` est admis, le reste non — un
  //    `multipart/form-data` ou un `text/plain` ne vient pas de notre code.
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return json(415, { ok: false, error: RESPONSES.refused });
  }

  // 4. La taille annoncée, avant même de lire. Un en-tête peut mentir ou
  //    manquer; quand il dit la vérité, il évite de tout charger pour rien.
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return json(413, { ok: false, error: RESPONSES.refused });
  }

  // 5. La taille réelle, avant l'analyse. `text()` met le corps en mémoire,
  //    `JSON.parse()` en construit un arbre — c'est la deuxième opération qui
  //    coûte, et c'est elle qu'on protège. En UTF-8 un caractère occupe au
  //    moins un octet : compter les caractères ne sous-estime jamais.
  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return refuse(400);
  }
  if (raw.length > MAX_BODY_BYTES) return refuse(413);

  // 6. L'analyse. Un corps malformé est un refus, pas une exception qui
  //    remonterait en 500 avec une trace.
  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return refuse(400);
  }

  // 7. Le contenu. À partir d'ici, c'est le schéma Zod qui décide.
  const validation = validateContactSubmission(payload);
  if (!validation.ok) return refuse(400);
  // 8. L'humain. Le message est valide : il vaut maintenant la peine de
  //    demander à Cloudflare si le jeton qui l'accompagne est vrai. Pas avant
  //    — un jeton ne sert qu'une fois, et le brûler pour un courriel mal tapé
  //    condamnerait la deuxième tentative du visiteur.
  //
  //    Le jeton se lit sur la charge brute : il escorte le message, il n'en
  //    fait pas partie, et le schéma l'a déjà écarté.
  const token = readTurnstileToken(payload);
  if (!token) return refuse(403);

  //    `cf-connecting-ip` est posé par Cloudflare, jamais par l'appelant. En
  //    développement il est absent, et la vérification s'en passe.
  const human = await verifyHuman(
    token,
    request.headers.get('cf-connecting-ip') ?? undefined,
  );
  if (!human) return refuse(403);

  // 9. L'envoi. Une panne du fournisseur n'est pas une faute du visiteur :
  //    elle mérite un autre code et un autre message, pour qu'il sache qu'il
  //    peut réessayer.
  try {
    const sent = await sendMessage({
      submission: validation.submission,
      reasonLabel: validation.reasonLabel,
    });

    if (!sent) return json(502, { ok: false, error: RESPONSES.unavailable });
  } catch {
    // Volontairement muet sur le contenu : journaliser le message reviendrait
    // à recopier des renseignements personnels dans un journal que personne
    // n'a consenti à alimenter.
    console.error('[contact] échec de la couche d’envoi');
    return json(502, { ok: false, error: RESPONSES.unavailable });
  }

  return json(200, { ok: true, message: RESPONSES.sent });
}
