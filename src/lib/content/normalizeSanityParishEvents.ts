import type {
  ParishEvent,
  ParishEventImage,
  PARISH_EVENT_TIME_ZONE,
} from '@/types/parish-events';
import type { SanityParishEventsResult } from '@/lib/sanity/types';
// Chemin relatif, pas l'alias `@/` : ce module est chargé tel quel par
// `node --test`, qui ne connaît pas les alias de Vite. Un import de type
// serait effacé à la compilation, celui-ci ne l'est pas.
import {
  normalizeSanityImage,
  type ImageSourceBuilder,
} from './normalizeSanityImage.ts';
import { normalizeSanityRichText } from './normalizeSanityRichText.ts';
import { toThirdPartyDialableDigits } from './parishPhone.ts';

export type { ImageSourceBuilder };

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

type RawEvent = SanityParishEventsResult[number];

function normalizeEvent(
  raw: RawEvent,
  buildSources: ImageSourceBuilder,
): ParishEvent | undefined {
  const title = cleanString(raw.title);
  const slug = cleanString(raw.slug);
  const excerpt = cleanString(raw.excerpt);
  const startAt = cleanString(raw.startAt);
  const category = raw.category;

  // Sans titre, adresse, résumé, date ou catégorie, l'événement n'a rien à
  // afficher : mieux vaut l'ignorer qu'afficher une carte trouée.
  if (!title || !slug || !excerpt || !startAt || !category) return undefined;

  const contact = raw.contact;
  // Les coordonnées ne sortent que si l'accord est explicitement coché : le
  // Studio le refuse déjà, la lecture le refuse aussi.
  const publishableContact =
    contact?.consentGiven === true
      ? {
          name: cleanString(contact.name),
          phone: cleanString(contact.phone),
          email: cleanString(contact.email),
        }
      : undefined;

  // La personne-ressource d'une activité garde son lien d'appel : c'est sa
  // ligne à elle. Le numéro principal de la paroisse, lui, s'affiche sans jamais
  // devenir cliquable — le secrétariat reçoit ces appels à domicile, à toute
  // heure, et un champ libre ne doit pas rouvrir la porte qu'on vient de fermer.
  const phoneDigits = toThirdPartyDialableDigits(publishableContact?.phone);

  const gallery = (raw.gallery ?? [])
    .map((item) => normalizeSanityImage(item, buildSources))
    .filter((item): item is ParishEventImage => item !== undefined);

  return {
    id: raw._id,
    slug,
    title,
    excerpt,
    description: normalizeSanityRichText(raw.description),
    category,
    startAt,
    endAt: cleanString(raw.endAt),
    timeZone: 'America/Toronto' as typeof PARISH_EVENT_TIME_ZONE,
    locationName: cleanString(raw.locationName),
    meetingPoint: cleanString(raw.meetingPoint),
    departureAt: cleanString(raw.departureAt),
    returnAt: cleanString(raw.returnAt),
    price:
      typeof raw.price?.amount === 'number'
        ? {
            amount: raw.price.amount,
            currency: 'CAD',
            label: cleanString(raw.price.label),
          }
        : undefined,
    capacityNotice: cleanString(raw.capacityNotice),
    contact:
      publishableContact &&
      (publishableContact.name ||
        publishableContact.phone ||
        publishableContact.email)
        ? {
            ...publishableContact,
            phoneHref: phoneDigits
              ? (`tel:+1${phoneDigits}` as const)
              : undefined,
          }
        : undefined,
    publicationStatus: raw.publicationStatus ?? 'draft',
    showOnWebsite: raw.showOnWebsite !== false,
    showOnHomepage: raw.showOnHomepage === true,
    showInArchive: raw.showInArchive !== false,
    featured: raw.featured === true,
    homepagePriority:
      typeof raw.homepagePriority === 'number'
        ? raw.homepagePriority
        : undefined,
    coverImage: normalizeSanityImage(raw.coverImage, buildSources),
    gallery: gallery.length > 0 ? gallery : undefined,
    cta:
      cleanString(raw.cta?.label) && cleanString(raw.cta?.url)
        ? {
            label: cleanString(raw.cta?.label) as string,
            href: cleanString(raw.cta?.url) as string,
          }
        : undefined,
  };
}

/**
 * Transforme les documents Sanity en contrat interne `ParishEvent`.
 *
 * Le statut temporel n'est pas calculé ici : il dépend de l'heure du rendu et
 * reste la responsabilité de `src/lib/events/parish-events.ts`.
 */
export function normalizeSanityParishEvents(
  raw: SanityParishEventsResult | null,
  buildSources: ImageSourceBuilder,
): ParishEvent[] {
  return (raw ?? []).flatMap((event) => {
    const normalized = normalizeEvent(event, buildSources);
    return normalized ? [normalized] : [];
  });
}
