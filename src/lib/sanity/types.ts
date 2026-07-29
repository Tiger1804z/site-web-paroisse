import type { SITE_SETTINGS_QUERY_RESULT } from '@/lib/sanity/sanity.types';

/**
 * Type brut du document siteSettings tel que renvoyé par SITE_SETTINGS_QUERY.
 *
 * Dérivé du type généré par Sanity TypeGen — la source de vérité est le schéma
 * Sanity plus la projection GROQ. Ce module est la seule frontière qui référence
 * le fichier généré : le normalizer et le getter importent d'ici, jamais du
 * fichier généré directement. `null` = singleton absent ou requête sans résultat.
 */
export type SanitySiteSettingsResult = SITE_SETTINGS_QUERY_RESULT;
