// Point d'entrée du formulaire Contact : `POST /api/contact`.
//
// Cloudflare Pages sert le dossier `functions/` à la racine du dépôt, à côté
// du site — et non depuis `dist/`. Le build public reste donc exactement ce
// qu'il est : un tas de fichiers HTML, sans `_worker.js`, sans adaptateur
// Astro, sans rien que `scripts/check-public-bundle.mjs` refuserait.
//
// Ce fichier ne contient aucune logique. Il lit l'environnement, fabrique les
// deux dépendances, et passe la main. Tout ce qui se décide — les gardes HTTP,
// la validation, l'ordre des vérifications — vit dans `src/lib/contact/`, où
// `node --test` peut l'exercer sans Cloudflare, sans clé et sans réseau.
//
// AUCUN SECRET ICI. Ce fichier est versionné. Les deux valeurs se saisissent
// dans les variables et secrets du projet Pages.

import { handleContactRequest } from '../../src/lib/contact/handleContactRequest.ts';
import { createFormspreeSender } from '../../src/lib/contact/sendContactEmail.ts';
import { createTurnstileVerifier } from '../../src/lib/contact/verifyTurnstile.ts';

/**
 * Les variables lues à l'exécution.
 *
 * Aucune n'est préfixée `PUBLIC_` : aucune n'atteint le navigateur. La seule
 * valeur Turnstile que la page connaît est la clé publique, injectée au build.
 */
interface ContactEnv {
  readonly TURNSTILE_SECRET_KEY?: string;
  /**
   * L'adresse du formulaire Formspree, de la forme
   * `https://formspree.io/f/xxxxxxxx`.
   *
   * Elle vaut un secret : elle désigne la boîte du secrétariat, et quiconque la
   * connaît peut y poster directement, sans passer par Zod ni par Turnstile.
   *
   * Il n'y a ni destinataire ni expéditeur à côté d'elle. Formspree attache le
   * premier au formulaire, dans son propre tableau de bord, et expédie sous sa
   * propre identité — l'adresse du visiteur voyage en `Reply-To`.
   */
  readonly FORMSPREE_ENDPOINT?: string;
}

interface PagesContext {
  readonly request: Request;
  readonly env: ContactEnv;
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const { request, env } = context;

  return handleContactRequest(request, {
    // Une variable absente donne une chaîne vide, et les deux fabriques
    // refusent alors tout — porte fermée. C'est voulu : le jour d'une variable
    // oubliée dans le tableau de bord, on veut un formulaire en panne visible,
    // pas un formulaire ouvert en grand que personne ne remarque.
    verifyHuman: createTurnstileVerifier({
      secretKey: env.TURNSTILE_SECRET_KEY ?? '',
    }),
    sendMessage: createFormspreeSender({
      endpoint: env.FORMSPREE_ENDPOINT ?? '',
    }),
  });
}
