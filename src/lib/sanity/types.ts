import type {
  SITE_SETTINGS_QUERY_RESULT,
  SCHEDULE_PAGE_QUERY_RESULT,
} from '@/lib/sanity/sanity.types';

/**
 * Type brut du document siteSettings tel que renvoyé par SITE_SETTINGS_QUERY.
 *
 * Dérivé du type généré par Sanity TypeGen — la source de vérité est le schéma
 * Sanity plus la projection GROQ. Ce module est la seule frontière qui référence
 * le fichier généré : le normalizer et le getter importent d'ici, jamais du
 * fichier généré directement. `null` = singleton absent ou requête sans résultat.
 */
export type SanitySiteSettingsResult = SITE_SETTINGS_QUERY_RESULT;

/**
 * Type brut du document schedulePage tel que renvoyé par SCHEDULE_PAGE_QUERY.
 *
 * Même frontière que ci-dessus : structure machine (jours en anglais, heures
 * `HH:mm`), les libellés français sont dérivés dans le normalizer.
 */
export type SanitySchedulePageResult = SCHEDULE_PAGE_QUERY_RESULT;
