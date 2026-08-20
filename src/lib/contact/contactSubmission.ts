import { z } from 'zod';

/**
 * Un message soumis par le formulaire Contact, vérifié.
 *
 * Ni réseau ni secret ici : ce module transforme une valeur inconnue, arrivée
 * par le réseau, en message propre — ou en refus. C'est ce qui le rend testable
 * sans Cloudflare, sans clé et sans boîte courriel.
 *
 * La validation du navigateur est une politesse : elle montre ses fautes au
 * visiteur tout de suite, et ne protège rien. N'importe qui peut appeler
 * l'adresse du formulaire avec `curl` sans jamais ouvrir la page. C'est ce
 * schéma-ci, exécuté sur un serveur, qui décide.
 *
 * Ce que Zod ne voit pas, parce qu'il s'exécute après `JSON.parse()` : la
 * méthode HTTP, l'origine, le type de contenu, la taille du corps, le jeton
 * Turnstile. Ces gardes-là vivent dans la Function.
 */

/**
 * Les motifs de contact, source unique.
 *
 * Le formulaire affiche ces libellés, le serveur n'accepte que ces valeurs, et
 * le courriel reçu par la paroisse porte le libellé. Une liste recopiée
 * ailleurs finit par diverger : un motif ajouté au formulaire et refusé par le
 * serveur donne une erreur que personne ne comprend.
 *
 * Le `Record` ci-dessous est exhaustif par construction : ajouter une valeur
 * sans son libellé ne compile pas.
 */

export const CONTACT_REASON_VALUES = [
  'general',
  'schedule',
  'baptism',
  'marriage',
  'room-rental',
  'thrift-store',
  'event',
  'parish-life',
  'other',
] as const;

export type ContactReason = (typeof CONTACT_REASON_VALUES)[number];

export const CONTACT_REASON_LABELS: Record<ContactReason, string> = {
  general: 'Question générale',
  schedule: 'Horaire',
  baptism: 'Baptême',
  marriage: 'Mariage',
  'room-rental': 'Location de salle',
  'thrift-store': 'Friperie',
  event: 'Événement',
  'parish-life': 'Vie paroissiale',
  other: 'Autre',
};

/**
 * Nettoie une valeur venue du réseau.
 *
 * Ce qui n'est pas une chaîne devient chaîne vide : `null`, `42`, un tableau ou
 * un objet ne sont pas des refus à expliquer, seulement des champs absents que
 * les contraintes de longueur rejetteront d'elles-mêmes.
 *
 * Les caractères de contrôle partent — sauf le retour à la ligne, qui a un sens
 * dans un message.
 */
function clean(value: unknown): string {
  if (typeof value !== 'string') return '';

  // Filtré caractère par caractère, et non par une classe d'expression
  // régulière : une classe qui contient des caractères de contrôle littéraux
  // déclenche `no-control-regex`, et le dépôt n'a aucune suppression eslint.
  // Ce détour dit d'ailleurs plus clairement ce qu'on garde.
  return Array.from(value)
    .filter((character) => {
      if (character === '\n') return true;
      const code = character.codePointAt(0) ?? 0;
      return code > 0x1f && code !== 0x7f;
    })
    .join('')
    .trim();
}

/**
 * Même chose, sur une seule ligne.
 *
 * Les en-têtes d'un courriel sont séparés par des retours à la ligne. Un nom
 * valant « Jean\r\nBcc: mille@adresses.com » transformerait le formulaire en
 * relais de spam. Un envoi en JSON protège déjà largement de ça — on ne délègue
 * pas ce genre de défense à la prudence d'un tiers.
 */
function cleanHeaderValue(value: unknown): string {
  return clean(value).replace(/[\r\n]+/g, ' ');
}

/** Champ d'en-tête : nettoyé sur une ligne, puis vérifié. */
const header = (schema: z.ZodType<string>) =>
  z.preprocess(cleanHeaderValue, schema);

/** Champ de corps : nettoyé, retours à la ligne conservés. */
const body = (schema: z.ZodType<string>) => z.preprocess(clean, schema);

/**
 * Le schéma du formulaire.
 *
 * Zod retire les clés qu'il ne connaît pas : c'est la liste blanche de champs,
 * gratuitement. Un envoi contenant `{"to":"victime@example.com"}` voit ce champ
 * disparaître avant d'atteindre quoi que ce soit.
 *
 * Contrepartie à connaître : le honeypot `website` disparaîtrait lui aussi, et
 * le robot passerait. Il est donc déclaré, et doit être vide.
 */
export const contactSubmissionSchema = z.object({
  reason: z.enum(CONTACT_REASON_VALUES),

  fullName: header(z.string().min(2).max(120)),

  /**
   * `html5Email` — exactement la règle qu'applique `<input type="email">`.
   *
   * La règle par défaut de Zod est plus stricte. Plus stricte que le
   * navigateur, elle refuserait une adresse que le visiteur vient de voir
   * acceptée : il corrigerait à l'aveugle un champ qui n'a rien de faux. Et la
   * seule vérification qui prouve qu'une adresse existe reste d'y écrire.
   */
  email: header(z.email({ pattern: z.regexes.html5Email }).max(254)),

  phone: header(z.string().max(30)).optional(),

  message: body(z.string().min(20).max(2000)),

  /**
   * Le consentement est une décision, pas une case par défaut.
   *
   * `z.literal(true)` refuse `"on"`, `"true"`, `1`. En JavaScript, la chaîne
   * `"false"` est vraie : un simple `if (body.privacyConsent)` laisserait
   * passer un refus explicite. La Loi 25 demande un consentement manifeste.
   */
  privacyConsent: z.literal(true),

  /** Piège à robots. Caché aux humains : rempli, il désigne un programme. */
  website: z.preprocess(clean, z.literal('')).optional(),
});

/**
 * Le type dérivé du schéma, jamais écrit à la main.
 *
 * Si le schéma change, le type suit. L'inverse — un type déclaré séparément —
 * finit toujours par mentir sur ce qui est réellement vérifié.
 */
export type ContactSubmission = z.infer<typeof contactSubmissionSchema>;

export type ContactValidation =
  | {
      readonly ok: true;
      readonly submission: ContactSubmission;
      readonly reasonLabel: string;
    }
  | { readonly ok: false };

/**
 * Vérifie un message soumis.
 *
 * `payload` est typé `unknown` : c'est ce que rend `JSON.parse()`, et le
 * prétendre autrement serait se mentir — TypeScript ne vérifie rien à
 * l'exécution.
 *
 * En cas de refus, on ne renvoie pas les messages de Zod. Ils sont précis et
 * utiles en développement; renvoyés au réseau, ils décrivent la logique du
 * serveur à qui la sonde. La Function répondra une phrase générique.
 */
export function validateContactSubmission(payload: unknown): ContactValidation {
  const result = contactSubmissionSchema.safeParse(payload);
  if (!result.success) return { ok: false };

  return {
    ok: true,
    submission: result.data,
    reasonLabel: CONTACT_REASON_LABELS[result.data.reason],
  };
}
