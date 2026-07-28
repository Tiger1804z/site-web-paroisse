import { siteSettingsData } from '@/data/siteSettings';

/**
 * Constante d'identité locale (nom officiel de la paroisse).
 *
 * Utilisée de façon SYNCHRONE à l'import par ~10 fichiers (titres SEO,
 * aria-labels, textes marketing des modules de données). Elle reste
 * volontairement sourcée depuis la donnée locale, HORS périmètre S1-T15 :
 * la brancher sur Sanity via getSiteSettings() imposerait de rendre async
 * (ou d'injecter) tous ces consommateurs synchrones. Un ticket dédié devra
 * décider comment la rendre dynamique sans faire cascader l'async dans tout
 * le site. Le nom est une valeur stable et confirmée, donc ce fallback local
 * est acceptable en attendant.
 */
export const SITE_NAME = siteSettingsData.organizationName;
export const SITE_DESCRIPTOR = 'Paroisse catholique';
