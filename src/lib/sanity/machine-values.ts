import { stegaClean } from '@sanity/client/stega';

/**
 * Valeurs machine : les chaînes que le code lit, jamais un être humain.
 *
 * En prévisualisation, Sanity encode dans chaque chaîne une adresse de champ
 * faite de caractères de largeur nulle. C'est ce qui permet de cliquer sur un
 * texte pour ouvrir le champ qui le produit — excellent sur un paragraphe,
 * destructeur sur `"tuesday"` ou `"08:00"` :
 *
 * - `WEEKDAY_INDEXES["tuesday␀␀␀"]` vaut `undefined`;
 * - `/^([01]\d|2[0-3]):([0-5]\d)$/` ne reconnaît plus `"08:00␀␀␀"`;
 * - `publicationStatus === 'published'` devient faux.
 *
 * L'audit du 31 juillet 2026 a mesuré les trois conséquences : l'horaire des
 * messes et la liste des événements disparaissaient de Presentation, et les
 * catégories retombaient silencieusement sur le repli local. L'éditrice voyait
 * un site faux dans l'outil censé lui montrer le vrai.
 *
 * La liste ci-dessous est vérifiée contre `studio/schema.json` par
 * `tests/sanity-machine-values.test.mjs` : tout champ dont le schéma déclare
 * une liste de valeurs — ou un slug — doit y figurer. Ajouter une énumération
 * dans le Studio sans l'ajouter ici fait échouer la suite de tests.
 */
export const MACHINE_VALUE_FIELDS: ReadonlySet<string> = new Set([
  // Énumérations déclarées par un `options.list` dans le Studio.
  'actionTarget',
  'category',
  'ctaTarget',
  'group',
  'imageKind',
  'kind',
  'linkTarget',
  'primaryCtaTarget',
  'publicationStatus',
  'recurrenceType',
  'secondaryCtaTarget',
  'severity',
  'source',
  'status',
  'surface',
  'symbol',
  'target',
  'visualKind',
  'weekday',

  // Emphases d'un fragment de texte enrichi : « strong », « em ». Le rendu
  // compare ces chaînes pour choisir sa balise. Encodées, aucune ne
  // correspondrait plus, et le gras disparaîtrait de la seule
  // prévisualisation — la panne que ce module existe pour empêcher.
  'marks',

  // Style d'un bloc de texte enrichi. Le rendu compare cette chaîne pour
  // choisir sa balise; encodée, elle ne vaudrait plus « normal » et le
  // paragraphe changerait d'apparence dans la seule prévisualisation.
  'style',

  // Slugs : fragments d'adresse publique et ancres de page.
  'slug',
  'value',

  // Formats stricts, comparés ou analysés par le code.
  'time',
  'startAt',
  'endAt',
  'departureAt',
  'returnAt',
  'validFrom',
  'validUntil',
  'lastReviewedAt',

  // Destinations et coordonnées : atterrissent dans un attribut `href`.
  'url',
  'website',
  'email',
  'publicEmail',
  'phone',

  // Textes alternatifs : atterrissent dans un attribut `alt`, lu à voix haute
  // par les lecteurs d'écran. Du bruit invisible y serait épelé.
  'alt',
  'imageAlt',

  // Métadonnées Sanity. Le filtre par défaut du client les écarte déjà; on ne
  // dépend pas de ce détail d'implémentation.
  '_id',
  '_key',
  '_ref',
  '_type',
]);

/**
 * Retire l'encodage de prévisualisation des seules valeurs machine.
 *
 * Les textes éditoriaux le conservent : c'est lui qui relie un paragraphe
 * affiché au champ du Studio, et le perdre reviendrait à éteindre le
 * click-to-edit qu'on cherche justement à offrir.
 *
 * Hors prévisualisation, aucune chaîne n'est encodée et `stegaClean` est un
 * passage à vide : la fonction reste sûre à appeler sur un résultat public.
 *
 * Le résultat est reconstruit plutôt que muté — un résultat GROQ peut être
 * partagé entre deux lectures, et le modifier en place ferait dépendre le
 * rendu de l'ordre des appels.
 */
export function cleanMachineValues<T>(result: T): T {
  return cleanValue(result, undefined) as T;
}

function cleanValue(value: unknown, key: string | undefined): unknown {
  if (typeof value === 'string') {
    return key !== undefined && MACHINE_VALUE_FIELDS.has(key)
      ? stegaClean(value)
      : value;
  }

  if (Array.isArray(value)) {
    // La clé du tableau se propage à ses éléments : `methods[]` porte des
    // chaînes dont le nom de champ est celui du tableau, pas un index.
    return value.map((entry) => cleanValue(entry, key));
  }

  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([entryKey, entryValue]) => [
        entryKey,
        cleanValue(entryValue, entryKey),
      ]),
    );
  }

  return value;
}
