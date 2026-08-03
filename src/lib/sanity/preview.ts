import { sanityClient } from 'sanity:client';
import type {
  ClientReturn,
  FilterDefault,
  ResponseQueryOptions,
} from '@sanity/client';
import {
  cleanMachineValues,
  MACHINE_VALUE_FIELDS,
} from '@/lib/sanity/machine-values';

/**
 * Prévisualisation éditoriale — la frontière entre le site public et Presentation.
 *
 * Le site public est statique : il lit le contenu publié, sans jeton, sans
 * Content Source Maps. La prévisualisation est un environnement séparé, activé
 * par une variable d'environnement, où l'éditrice voit ses brouillons et peut
 * cliquer sur un texte pour ouvrir le champ qui le produit.
 *
 * Rien ici ne s'active tout seul : sans `PUBLIC_SANITY_VISUAL_EDITING_ENABLED`,
 * `loadQuery` se comporte exactement comme le `sanityClient.fetch` d'avant.
 */

/**
 * Astro n'expose au navigateur que les variables préfixées `PUBLIC_`. Ce
 * drapeau doit être lisible côté client — le composant d'overlays en dépend —
 * mais il ne révèle rien : il dit seulement dans quel environnement on est.
 */
const visualEditingFlag = import.meta.env.PUBLIC_SANITY_VISUAL_EDITING_ENABLED;

export const visualEditingEnabled = visualEditingFlag === 'true';

/**
 * La comparaison est volontairement stricte : `BaseLayout.astro` teste la même
 * chaîne littéralement pour que Vite élimine l'île d'overlays du site public.
 * Une comparaison tolérante y empêcherait l'élimination de la branche morte.
 *
 * Le revers, c'est qu'une valeur mal écrite — `true.`, `True`, `"true"` — éteint
 * la prévisualisation en silence : le site s'affiche normalement dans
 * Presentation, mais rien ne répond aux clics. On le dit donc à voix haute.
 */
if (
  visualEditingFlag &&
  visualEditingFlag !== 'true' &&
  visualEditingFlag !== 'false'
) {
  console.warn(
    `[preview] PUBLIC_SANITY_VISUAL_EDITING_ENABLED vaut ${JSON.stringify(visualEditingFlag)} — seule la valeur exacte "true" active la prévisualisation. Mode public conservé.`,
  );
}

/**
 * Jeton Viewer, lu uniquement côté serveur. L'absence de préfixe `PUBLIC_` est
 * ce qui garantit qu'Astro ne l'inclura jamais dans le JavaScript envoyé au
 * navigateur : ce n'est pas une convention de nommage, c'est le mécanisme.
 */
const readToken = import.meta.env.SANITY_API_READ_TOKEN;

const studioUrl =
  import.meta.env.PUBLIC_SANITY_STUDIO_URL ?? 'http://localhost:3333';

/**
 * La perspective `drafts` n'existe qu'à partir de cette version de l'API.
 * L'intégration Astro, elle, utilise `v2023-08-24` par défaut : le client de
 * prévisualisation doit donc déclarer la sienne.
 */
const PREVIEW_API_VERSION = '2025-02-19';

/**
 * Champs qui ne doivent jamais être encodés.
 *
 * Stega glisse des caractères invisibles dans les chaînes. Dans un texte
 * affiché c'est sans conséquence; dans une valeur que le code compare, trie ou
 * analyse, ça casse : `"tuesday"` cesse d'être une clé connue, `"08:00"` cesse
 * d'être une heure valide, `publicationStatus === 'published'` devient faux.
 *
 * La liste vit dans `machine-values.ts` et sert deux fois : ici pour ne pas
 * encoder, et après la lecture pour nettoyer ce qui l'aurait été malgré tout.
 * Deux barrières, une seule liste — c'est ce qui empêche les deux de diverger.
 */
const stegaFilter: FilterDefault = (props) => {
  const lastSegment = props.resultPath.at(-1);
  if (
    typeof lastSegment === 'string' &&
    MACHINE_VALUE_FIELDS.has(lastSegment)
  ) {
    return false;
  }

  return props.filterDefault(props);
};

/**
 * Client de prévisualisation.
 *
 * Dérivé du client de l'intégration plutôt que reconstruit : seules la version
 * d'API et le jeton changent. Le CDN est écarté, sinon on servirait une version
 * en cache d'un brouillon qui vient d'être modifié.
 */
const previewClient = visualEditingEnabled
  ? sanityClient.withConfig({
      apiVersion: PREVIEW_API_VERSION,
      useCdn: false,
      ...(readToken ? { token: readToken } : {}),
    })
  : undefined;

/**
 * Options de lecture en prévisualisation.
 *
 * Sans jeton, on dégrade au contenu publié plutôt que d'échouer : les overlays
 * et le click-to-edit fonctionnent quand même, seuls les brouillons manquent.
 */
const PREVIEW_OPTIONS: ResponseQueryOptions = {
  perspective: readToken ? 'drafts' : 'published',
  // `withKeyArraySelector` conserve la clé des éléments de tableau : sans elle,
  // un clic sur la troisième section ouvrirait la première.
  resultSourceMap: 'withKeyArraySelector',
  stega: {
    enabled: true,
    studioUrl,
    filter: stegaFilter,
  },
};

if (visualEditingEnabled && !readToken) {
  console.warn(
    '[preview] SANITY_API_READ_TOKEN absent — prévisualisation du contenu publié seulement, les brouillons ne seront pas visibles.',
  );
}

/**
 * Le site public est pré-rendu. Construire avec le drapeau actif figerait des
 * brouillons, des marqueurs stega et l'île d'overlays dans du HTML destiné à
 * être déployé — et un avertissement dans un journal de build ne se remarque
 * pas. On refuse donc de produire cette sortie.
 *
 * `pnpm build:public` force le drapeau à « false » le temps du build : c'est
 * la commande de production, et elle ne rencontre jamais cette barrière. Un
 * environnement de prévisualisation déployé rendra à la demande, sans passer
 * par un build statique.
 */
if (visualEditingEnabled && import.meta.env.PROD) {
  throw new Error(
    [
      'Build de production lancé avec la prévisualisation active.',
      '',
      "PUBLIC_SANITY_VISUAL_EDITING_ENABLED vaut « true ». Le HTML produit contiendrait des brouillons, des caractères stega invisibles, un noindex sur toutes les pages et l'île de Visual Editing.",
      '',
      'Utiliser « pnpm build:public », qui force le drapeau à « false » sans toucher au fichier .env.',
    ].join('\n'),
  );
}

/**
 * Lecture d'une requête GROQ, publique ou prévisualisée.
 *
 * Le type de retour reste celui que Sanity TypeGen a généré pour cette requête :
 * `ClientReturn` résout la chaîne de requête vers son type, exactement comme le
 * faisait l'appel direct à `sanityClient.fetch`.
 *
 * En prévisualisation, le résultat repasse par `cleanMachineValues` : le filtre
 * ci-dessus empêche l'encodage des valeurs machine que l'on connaît, ce second
 * passage rattrape celles qui auraient été encodées quand même — une projection
 * qui renomme un champ, par exemple, présente au filtre un nom qu'il ne
 * reconnaît pas.
 */
export async function loadQuery<const Q extends string>(
  query: Q,
): Promise<ClientReturn<Q>> {
  if (previewClient) {
    const result = await previewClient.fetch(query, {}, PREVIEW_OPTIONS);

    return cleanMachineValues(result) as ClientReturn<Q>;
  }

  // Perspective explicite : avec l'ancienne version d'API de l'intégration, le
  // défaut historique est `raw`, qui ne distingue pas brouillons et contenu
  // publié.
  return (await sanityClient.fetch(
    query,
    {},
    {
      perspective: 'published',
    },
  )) as ClientReturn<Q>;
}
