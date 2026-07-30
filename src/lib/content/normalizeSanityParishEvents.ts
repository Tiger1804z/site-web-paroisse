import type {
  ParishEvent,
  ParishEventImage,
  PARISH_EVENT_TIME_ZONE,
} from '@/types/parish-events';
import type { SanityParishEventsResult } from '@/lib/sanity/types';

type RawEvent = SanityParishEventsResult[number];
type RawImage = NonNullable<RawEvent['coverImage']>;

/**
 * Construit une adresse et un `srcset` à partir d'une image Sanity.
 *
 * Injecté plutôt qu'importé : le vrai constructeur lit `import.meta.env`, qui
 * n'existe pas sous `node --test`. Le getter fournit l'implémentation réelle,
 * les tests une doublure — et la logique de tri et de filtrage reste testable.
 */
export type ImageSourceBuilder = (source: unknown) => {
  src: string;
  srcSet: string;
};

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Une image sans fichier ou sans texte alternatif n'est pas publiable.
 *
 * Le Studio l'interdit déjà, mais un document créé avant cette règle, ou une
 * image dont l'asset a été supprimé, ne doit pas produire une balise vide.
 */
function normalizeImage(
  raw: RawImage | null | undefined,
  buildSources: ImageSourceBuilder,
): ParishEventImage | undefined {
  const alt = cleanString(raw?.alt);
  const image = raw?.image;
  if (!alt || !image?.asset?._id) return undefined;

  const dimensions = image.asset.metadata?.dimensions;
  const { src, srcSet } = buildSources(image);
  const hotspot = image.hotspot;

  return {
    src,
    srcSet,
    alt,
    width: dimensions?.width ?? undefined,
    height: dimensions?.height ?? undefined,
    lqip: image.asset.metadata?.lqip ?? undefined,
    focalPoint:
      typeof hotspot?.x === 'number' && typeof hotspot?.y === 'number'
        ? { x: hotspot.x, y: hotspot.y }
        : undefined,
    credit: cleanString(raw?.credit),
  };
}

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

  const phone = publishableContact?.phone;
  const phoneDigits = phone?.replace(/\D/g, '');

  const gallery = (raw.gallery ?? [])
    .map((item) => normalizeImage(item, buildSources))
    .filter((item): item is ParishEventImage => item !== undefined);

  return {
    id: raw._id,
    slug,
    title,
    excerpt,
    description: cleanString(raw.description),
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
            phoneHref:
              phoneDigits?.length === 10
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
    coverImage: normalizeImage(raw.coverImage, buildSources),
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
