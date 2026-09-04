import type {
  RoomRentalDetail,
  RoomRentalPageData,
  RoomRentalRoom,
} from '@/types/roomRental';
import type { SanityRoomRentalPageResult } from '@/lib/sanity/types';
// Chemin relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`. L'alias reste réservé aux
// imports de types, effacés à l'exécution.
import { normalizeSanitySeo } from './normalizeSanitySeo.ts';

type RawPage = NonNullable<SanityRoomRentalPageResult>;
type RawRoom = NonNullable<RawPage['rooms']>[number];
type RawDetail = NonNullable<
  NonNullable<RawPage['practical']>['items']
>[number];

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanList(
  values: readonly (string | null)[] | null | undefined,
): readonly string[] {
  return (values ?? []).flatMap((value) => {
    const cleaned = cleanString(value);
    return cleaned ? [cleaned] : [];
  });
}

/**
 * Une salle sans ancre ou sans nom est écartée : l'ancre est une adresse
 * publique, et le nom est ce que la carte affiche en titre.
 *
 * Les trois autres champs disparaissent chacun de leur côté. Une salle dont le
 * tarif n'est pas arrêté s'affiche sans ligne de tarif — le contraire
 * publierait un cadre vide, ou pire, un prix deviné.
 */
function normalizeRoom(raw: RawRoom): RoomRentalRoom | undefined {
  const id = cleanString(raw.slug);
  const name = cleanString(raw.name);
  if (!id || !name) return undefined;

  const location = cleanString(raw.location);
  const capacity = cleanString(raw.capacity);
  const price = cleanString(raw.price);
  const description = cleanString(raw.description);

  return {
    id,
    name,
    ...(location ? { location } : {}),
    ...(capacity ? { capacity } : {}),
    ...(price ? { price } : {}),
    ...(description ? { description } : {}),
  };
}

/** Une moitié de ligne n'est pas une étape : « Contrat » suivi de rien. */
function normalizeDetails(
  raw: readonly RawDetail[] | null | undefined,
): readonly RoomRentalDetail[] {
  return (raw ?? []).flatMap((entry) => {
    const label = cleanString(entry.label);
    const value = cleanString(entry.value);
    if (!label || !value) return [];
    return [{ label, value }];
  });
}

/**
 * Fusionne le contenu Sanity avec le repli local, champ par champ.
 *
 * Deux choses ne viennent jamais de Sanity, comme sur Nos services : le
 * téléphone du secrétariat, lu dans `siteSettings`, et l'adresse du bouton,
 * toujours `/contact/`.
 *
 * Les salles basculent en bloc. Tant que Sanity n'en fournit aucune
 * d'exploitable, c'est la liste locale qui s'affiche — jamais un mélange d'une
 * salle réelle et d'une salle de gabarit, où rien ne dirait laquelle est
 * laquelle.
 */
export function normalizeSanityRoomRentalPage(
  raw: SanityRoomRentalPageResult,
  fallback: RoomRentalPageData,
): RoomRentalPageData {
  const paragraphs = cleanList(raw?.offer?.paragraphs);
  const amenities = cleanList(raw?.amenities?.items);
  const rooms = (raw?.rooms ?? []).flatMap((room) => {
    const normalized = normalizeRoom(room);
    return normalized ? [normalized] : [];
  });
  const practicalItems = normalizeDetails(raw?.practical?.items);
  const periodLabel =
    cleanString(raw?.offer?.periodLabel) ?? fallback.offer.periodLabel;

  return {
    // Sans constructeur d'adresses ici : l'image de partage est composée par le
    // getter, comme celle du premier écran.
    seo: normalizeSanitySeo(raw?.seo, fallback.seo),
    hero: {
      eyebrow: cleanString(raw?.hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: cleanString(raw?.hero?.title) ?? fallback.hero.title,
      introduction:
        cleanString(raw?.hero?.introduction) ?? fallback.hero.introduction,
    },
    offer: {
      eyebrow: cleanString(raw?.offer?.eyebrow) ?? fallback.offer.eyebrow,
      title: cleanString(raw?.offer?.title) ?? fallback.offer.title,
      ...(periodLabel ? { periodLabel } : {}),
      paragraphs:
        paragraphs.length > 0 ? paragraphs : fallback.offer.paragraphs,
    },
    amenities: {
      title: cleanString(raw?.amenities?.title) ?? fallback.amenities.title,
      items: amenities.length > 0 ? amenities : fallback.amenities.items,
    },
    rooms: rooms.length > 0 ? rooms : fallback.rooms,
    practical: {
      title: cleanString(raw?.practical?.title) ?? fallback.practical.title,
      items:
        practicalItems.length > 0 ? practicalItems : fallback.practical.items,
    },
    finalCta: {
      title: cleanString(raw?.finalCta?.title) ?? fallback.finalCta.title,
      description:
        cleanString(raw?.finalCta?.description) ??
        fallback.finalCta.description,
      primary: fallback.finalCta.primary,
      phone: fallback.finalCta.phone,
    },
  };
}
