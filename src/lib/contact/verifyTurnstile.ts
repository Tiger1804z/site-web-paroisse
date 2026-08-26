/**
 * La vérification Turnstile, côté serveur.
 *
 * Le widget affiché dans la page ne protège rien : un robot n'exécute pas notre
 * JavaScript, il poste directement sur l'adresse du formulaire avec le jeton de
 * son choix. C'est cet appel-ci — de serveur à serveur, avec la clé secrète —
 * qui décide si le jeton est vrai.
 *
 * La clé secrète arrive en paramètre et ne quitte jamais le serveur. `fetch`
 * aussi arrive en paramètre : c'est ce qui permet aux tests d'exercer chaque
 * réponse de Cloudflare, y compris la panne, sans réseau.
 */

const SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Un jeton Turnstile fait quelques centaines de caractères.
 *
 * Ce plafond n'est pas une validation de format — Cloudflare seul sait lire un
 * jeton. C'est un refus économique : inutile de payer un aller-retour réseau
 * pour une chaîne qui ne peut pas en être un.
 */
const MAX_TOKEN_LENGTH = 4096;

/** Au-delà, on considère Cloudflare injoignable plutôt que d'attendre. */
const TIMEOUT_MS = 8000;

export type TurnstileVerifier = (
  token: string,
  remoteIp?: string,
) => Promise<boolean>;

/**
 * Le jeton escorte le message, il n'en fait pas partie.
 *
 * Il ne figure donc pas dans `contactSubmissionSchema` : ce n'est pas une
 * coordonnée du visiteur, rien n'en sera écrit dans le courriel, et il n'a
 * aucune raison de survivre à la vérification. On le lit à part, sur la charge
 * brute, avant que le schéma ne fasse son travail.
 */
export function readTurnstileToken(payload: unknown): string | undefined {
  if (typeof payload !== 'object' || payload === null) return undefined;

  const token = (payload as Record<string, unknown>).turnstileToken;
  if (typeof token !== 'string') return undefined;

  const trimmed = token.trim();
  if (!trimmed || trimmed.length > MAX_TOKEN_LENGTH) return undefined;

  return trimmed;
}

/**
 * La réponse de Cloudflare, réduite à ce qu'on en fait.
 *
 * `error-codes` n'est pas du contenu de visiteur : ce sont des codes fixes
 * (`invalid-input-secret`, `timeout-or-duplicate`…). Les journaliser aide à
 * comprendre une panne sans recopier quoi que ce soit de privé.
 */
interface SiteverifyResponse {
  readonly success?: unknown;
  readonly 'error-codes'?: unknown;
}

/**
 * Fabrique un vérificateur lié à une clé secrète.
 *
 * Le résultat est une fonction que le gestionnaire de requête reçoit en
 * paramètre, exactement comme la couche d'envoi. Il ne connaît donc ni la clé,
 * ni Cloudflare, ni `fetch` — seulement une question à poser.
 */
export function createTurnstileVerifier(options: {
  readonly secretKey: string;
  readonly fetchImpl?: typeof fetch;
}): TurnstileVerifier {
  const { secretKey, fetchImpl = fetch } = options;

  return async function verify(token, remoteIp) {
    // Sans clé, on ne peut rien vérifier. Répondre « vrai » ici ouvrirait le
    // formulaire en grand le jour d'une variable d'environnement oubliée :
    // c'est exactement le moment où l'on veut une porte fermée, pas ouverte.
    if (!secretKey || !token) return false;

    let response: Response;
    try {
      response = await fetchImpl(SITEVERIFY_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          secret: secretKey,
          response: token,
          // Aide Cloudflare à juger, et n'est jamais journalisé par nous.
          ...(remoteIp ? { remoteip: remoteIp } : {}),
        }),
        // Une vérification qui ne répond pas ne doit pas retenir la requête du
        // visiteur jusqu'au délai d'expiration de la plateforme.
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      console.error('[turnstile] service injoignable');
      return false;
    }

    if (!response.ok) {
      console.error(`[turnstile] réponse inattendue : ${response.status}`);
      return false;
    }

    let result: SiteverifyResponse;
    try {
      result = (await response.json()) as SiteverifyResponse;
    } catch {
      console.error('[turnstile] réponse illisible');
      return false;
    }

    // `=== true` et non un test de véracité : une réponse inattendue — une page
    // d'erreur en JSON, un champ renommé — ne doit pas se lire comme un succès.
    if (result.success === true) return true;

    const codes = Array.isArray(result['error-codes'])
      ? result['error-codes'].join(', ')
      : 'sans code';
    console.error(`[turnstile] jeton refusé (${codes})`);

    return false;
  };
}
