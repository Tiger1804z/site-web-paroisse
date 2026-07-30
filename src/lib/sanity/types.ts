import type {
  SITE_SETTINGS_QUERY_RESULT,
  MASS_SCHEDULE_QUERY_RESULT,
  PARISH_EVENTS_QUERY_RESULT,
  EVENTS_PAGE_QUERY_RESULT,
  HOME_PAGE_QUERY_RESULT,
  SCHEDULE_PAGE_QUERY_RESULT,
  THRIFT_STORE_QUERY_RESULT,
  THRIFT_STORE_PAGE_QUERY_RESULT,
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
 * Type brut du document massSchedule tel que renvoyé par MASS_SCHEDULE_QUERY.
 *
 * Même frontière que ci-dessus : structure machine (jours en anglais, heures
 * `HH:mm`), les libellés français sont dérivés dans le normalizer.
 */
export type SanityMassScheduleResult = MASS_SCHEDULE_QUERY_RESULT;

/** Type brut du contenu de page renvoyé par SCHEDULE_PAGE_QUERY. */
export type SanitySchedulePageResult = SCHEDULE_PAGE_QUERY_RESULT;

/**
 * Type brut des événements renvoyés par PARISH_EVENTS_QUERY.
 *
 * Les images y sont encore des objets Sanity complets — référence de fichier,
 * point focal et rognage — parce que le constructeur d'adresses en a besoin.
 */
export type SanityParishEventsResult = PARISH_EVENTS_QUERY_RESULT;

/** Type brut du contenu de page renvoyé par EVENTS_PAGE_QUERY. */
export type SanityEventsPageResult = EVENTS_PAGE_QUERY_RESULT;

/** Type brut des réglages d’accueil renvoyés par HOME_PAGE_QUERY. */
export type SanityHomePageResult = HOME_PAGE_QUERY_RESULT;

/**
 * Type brut de la friperie renvoyé par THRIFT_STORE_QUERY.
 *
 * Donnée partagée : heures, emplacement et téléphone propres à la friperie,
 * distincts de ceux du secrétariat.
 */
export type SanityThriftStoreResult = THRIFT_STORE_QUERY_RESULT;

/** Type brut du contenu de page renvoyé par THRIFT_STORE_PAGE_QUERY. */
export type SanityThriftStorePageResult = THRIFT_STORE_PAGE_QUERY_RESULT;
