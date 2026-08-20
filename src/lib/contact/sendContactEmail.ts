import type { ContactMessageSender } from './handleContactRequest.ts';

/**
 * L'envoi du message vers la boîte de la paroisse, par l'API HTTP de Formspree.
 *
 * Pas de SDK : l'appel est un `fetch`, et une dépendance de moins à suivre dans
 * un runtime Workers. Pas de SMTP non plus — une connexion persistante n'a pas
 * sa place dans une fonction qui vit le temps d'une requête.
 *
 * **Pourquoi Formspree.** La paroisse garde son ancien site pendant la
 * transition, et son DNS ne doit pas bouger. Un transporteur classique exige de
 * prouver une identité d'expéditeur — un domaine par DKIM et SPF, au mieux une
 * adresse à confirmer. Formspree n'en demande aucune : il expédie sous sa propre
 * identité, et pose l'adresse du visiteur en `Reply-To`.
 *
 * **Ce qu'on y perd, et qu'il faut savoir.** Le destinataire n'est plus une
 * variable : il est attaché au formulaire, côté Formspree, et c'est l'adresse de
 * l'endpoint qui le désigne. L'expéditeur ne se choisit pas non plus. Formspree
 * compose enfin le corps du courriel lui-même, à partir des champs reçus : la
 * paroisse lit une mise en page qui n'est pas la nôtre.
 *
 * Ce qui reste à nous : l'objet, et le `Reply-To`.
 *
 * **L'adresse de l'endpoint vaut un secret.** Elle désigne la boîte de
 * destination, et quiconque la connaît peut y poster directement — sans passer
 * par Zod ni par Turnstile. Elle arrive donc en paramètre, depuis
 * l'environnement du serveur, et n'apparaît jamais dans une page.
 */

/** Au-delà, on considère le fournisseur injoignable plutôt que de retenir le visiteur. */
const TIMEOUT_MS = 10_000;

export interface ContactEmailConfig {
  /**
   * L'adresse du formulaire Formspree, de la forme
   * `https://formspree.io/f/xxxxxxxx`.
   *
   * Elle encode le destinataire : c'est pour cela qu'elle vit dans
   * l'environnement du serveur, et jamais dans le navigateur.
   */
  readonly endpoint: string;
  readonly fetchImpl?: typeof fetch;
}

export interface ContactEmailContent {
  readonly subject: string;
  readonly replyTo: string;
}

/**
 * Décide de ce qui, dans le courriel, dépend encore de nous.
 *
 * Fonction pure, séparée de l'envoi : elle ne connaît aucun fournisseur, et
 * c'est ce qui permet de la vérifier sans réseau. Elle a traversé deux
 * changements de transporteur sans bouger — c'est la définition d'une frontière
 * qui tient.
 *
 * Le corps, lui, n'est plus mis en forme ici : Formspree le compose à partir des
 * champs reçus.
 */
export function formatContactEmail(message: {
  readonly submission: {
    readonly fullName: string;
    readonly email: string;
    readonly phone?: string;
    readonly message: string;
  };
  readonly reasonLabel: string;
}): ContactEmailContent {
  const { submission, reasonLabel } = message;

  return {
    // Le motif et le nom en objet : la boîte se trie d'un coup d'œil, sans
    // ouvrir. Les deux valeurs sont déjà nettoyées de tout retour à la ligne
    // par le schéma — un objet de courriel est un en-tête.
    subject: `[Nouveau message du site] ${reasonLabel} — ${submission.fullName}`,
    /**
     * L'adresse du visiteur sert de `Reply-To`, jamais d'expéditeur.
     *
     * C'est ce qui permet à la secrétaire de cliquer « Répondre » et d'écrire à
     * la bonne personne, sans que le courriel prétende venir d'elle.
     */
    replyTo: submission.email,
  };
}

/**
 * La réponse de Formspree, réduite à ce qu'on en fait.
 *
 * Un envoi accepté rend `{"ok": true}`. Les refus portent un tableau `errors`
 * dont les messages décrivent le champ fautif — jamais journalisés, ils
 * recopieraient la saisie du visiteur.
 */
interface FormspreeResponse {
  readonly ok?: unknown;
}

/**
 * Fabrique la couche d'envoi que le gestionnaire de requête reçoit.
 *
 * Elle rend `false` sur tout ce qui n'est pas un succès franc. Le gestionnaire
 * traduit ce `false` en 502 : le message du visiteur était bon, c'est nous qui
 * n'avons pas pu le transmettre, et il peut réessayer.
 */
export function createFormspreeSender(
  config: ContactEmailConfig,
): ContactMessageSender {
  const { endpoint, fetchImpl = fetch } = config;

  return async function send(message) {
    // Une configuration incomplète est une panne, pas un envoi silencieux dans
    // le vide. Mieux vaut que le visiteur voie « réessayez » et que le journal
    // le dise, plutôt qu'un message disparaisse en promettant d'être arrivé.
    if (!endpoint) {
      console.error('[contact] adresse d’envoi absente');
      return false;
    }

    const { submission, reasonLabel } = message;
    const { subject, replyTo } = formatContactEmail(message);

    /**
     * Les noms de champs ne sont pas libres.
     *
     * Formspree en reconnaît certains et leur donne un sens : `email` devient le
     * `Reply-To`, `subject` devient l'en-tête d'objet, `name`, `phone` et
     * `message` sont identifiés comme tels. Les autres — ici `reason` —
     * deviennent des lignes ordinaires du courriel.
     *
     * D'où la traduction : notre contrat interne dit `fullName`, Formspree
     * attend `name`. C'est exactement le travail d'une couche de transport.
     *
     * `reason` porte le libellé lisible et non la valeur machine : c'est un
     * humain qui lira « Baptême », pas « baptism ».
     */
    const form = new URLSearchParams({
      name: submission.fullName,
      email: replyTo,
      reason: reasonLabel,
      message: submission.message,
      subject,
    });

    // Absent veut dire absent : une ligne « Téléphone : » vide dans le courriel
    // vaudrait moins que pas de ligne du tout.
    if (submission.phone) form.set('phone', submission.phone);

    let response: Response;
    try {
      response = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
          // Sans cet en-tête, Formspree répond par une redirection vers sa page
          // de remerciement au lieu du JSON. C'est lui qui garantit la forme
          // `{"ok": true}` que la garde ci-dessous vérifie.
          accept: 'application/json',
        },
        body: form.toString(),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
    } catch {
      console.error('[contact] fournisseur d’envoi injoignable');
      return false;
    }

    if (!response.ok) {
      // Le statut seul, jamais le corps : une réponse d'erreur recopie souvent
      // la requête, donc le message du visiteur.
      console.error(`[contact] envoi refusé (HTTP ${response.status})`);
      return false;
    }

    let result: FormspreeResponse;
    try {
      result = (await response.json()) as FormspreeResponse;
    } catch {
      console.error('[contact] réponse d’envoi illisible');
      return false;
    }

    // `=== true` et non un test de véracité : une réponse inattendue — un champ
    // renommé, une page d'erreur en JSON — ne doit pas se lire comme un succès.
    if (result.ok !== true) {
      console.error('[contact] envoi refusé par le fournisseur');
      return false;
    }

    return true;
  };
}
