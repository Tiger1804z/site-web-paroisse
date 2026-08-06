import type { ParishEvent } from '@/types/parish-events';
import type { PublicContactDetails } from '@/types/siteSettings';
import { absoluteUrl } from './urls.ts';

/**
 * Données structurées, au format que Google lit.
 *
 * Le principe tenu partout ici : **on ne déclare que ce qu'on sait**. Un champ
 * absent est omis, jamais rempli d'une valeur plausible. Une donnée structurée
 * fausse est pire qu'une donnée structurée manquante — elle fait dire au site
 * une chose que personne n'a vérifiée, et c'est cette version-là qui apparaît
 * dans les résultats de recherche.
 *
 * Les heures du secrétariat, en particulier, ne sont **pas** publiées en
 * `openingHours` : le champ est du texte libre dans le Studio, et un horaire
 * mal formaté vaut moins que pas d'horaire du tout.
 *
 * Ce module ne lit ni l'environnement ni le réseau : tout lui est passé.
 */

export type JsonLdNode = Record<string, unknown>;

/**
 * Identifiants stables des entités, pour qu'un `Event` puisse désigner la
 * paroisse au lieu de recopier son adresse.
 */
export const WEBSITE_ID = '#site';
export const PARISH_ID = '#paroisse';

function nodeId(siteUrl: string, fragment: string): string {
  return `${absoluteUrl(siteUrl, '/')}${fragment}`;
}

/** Retire les clés dont la valeur est absente ou vide. */
function compact(node: JsonLdNode): JsonLdNode {
  return Object.fromEntries(
    Object.entries(node).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );
}

/**
 * Le titre d'un événement passe par ici avant d'entrer dans le graphe.
 *
 * Un document du jeu de données porte un espace en trop au début de son titre.
 * Le défaut se corrige dans Sanity, pas dans le code — mais en attendant, une
 * donnée structurée ne doit pas le propager.
 */
function cleanText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function websiteJsonLd(siteUrl: string, siteName: string): JsonLdNode {
  return {
    '@type': 'WebSite',
    '@id': nodeId(siteUrl, WEBSITE_ID),
    name: siteName,
    url: absoluteUrl(siteUrl, '/'),
    inLanguage: 'fr-CA',
    publisher: { '@id': nodeId(siteUrl, PARISH_ID) },
  };
}

/**
 * La paroisse elle-même : nom, adresse postale, téléphone, position.
 *
 * Tout vient de `siteSettings`, donc du Studio. Le courriel n'entre que s'il
 * est confirmé — le contrat porte déjà cette distinction, et un courriel non
 * vérifié publié en donnée structurée est une invitation au pourriel sur une
 * adresse qui n'existe peut-être pas.
 */
export function placeOfWorshipJsonLd(
  siteUrl: string,
  settings: PublicContactDetails,
): JsonLdNode {
  const { address, map } = settings;

  return compact({
    '@type': 'PlaceOfWorship',
    '@id': nodeId(siteUrl, PARISH_ID),
    name: settings.organizationName,
    url: absoluteUrl(siteUrl, '/'),
    telephone: settings.phone.international,
    email: settings.email?.confirmed ? settings.email.display : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: address.street,
      addressLocality: address.city,
      addressRegion: address.province,
      postalCode: address.postalCode,
      addressCountry: address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: map.latitude,
      longitude: map.longitude,
    },
    hasMap: settings.directionsUrl,
  });
}

/**
 * Un événement de la paroisse.
 *
 * Rendu seulement si les champs obligatoires de schema.org sont là : un nom et
 * une date de début. Sans eux, l'entrée est omise plutôt que publiée
 * incomplète.
 *
 * Les activités n'ont pas de page à elles : leur `url` est celle de la page
 * qui les affiche. Un événement annulé le dit — il reste visible sur le site,
 * et un moteur qui l'annonce encore comme prévu dirigerait quelqu'un vers une
 * église fermée.
 */
export function eventJsonLd(
  siteUrl: string,
  event: ParishEvent,
  pagePath: string,
): JsonLdNode | undefined {
  const name = cleanText(event.title);
  const startDate = cleanText(event.startAt);

  if (!name || !startDate) return undefined;

  const locationName = cleanText(event.locationName);

  return compact({
    '@type': 'Event',
    name,
    startDate,
    endDate: cleanText(event.endAt),
    description: cleanText(event.description) ?? cleanText(event.excerpt),
    url: absoluteUrl(siteUrl, pagePath),
    eventStatus:
      event.publicationStatus === 'cancelled'
        ? 'https://schema.org/EventCancelled'
        : 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    // Un lieu nommé dans la fiche l'emporte — un pèlerinage ne se tient pas à
    // l'église. Sans lieu nommé, l'activité est à la paroisse, et le graphe
    // porte déjà son adresse complète.
    location: locationName
      ? { '@type': 'Place', name: locationName }
      : { '@id': nodeId(siteUrl, PARISH_ID) },
    image: event.coverImage?.src,
    organizer: { '@id': nodeId(siteUrl, PARISH_ID) },
    offers: event.price
      ? {
          '@type': 'Offer',
          price: event.price.amount,
          priceCurrency: event.price.currency,
          url: absoluteUrl(siteUrl, pagePath),
        }
      : undefined,
  });
}

/** Emballe des nœuds dans le graphe unique attendu par les moteurs. */
export function jsonLdGraph(nodes: readonly JsonLdNode[]): JsonLdNode {
  return { '@context': 'https://schema.org', '@graph': nodes };
}
