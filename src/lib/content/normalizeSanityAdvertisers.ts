import type {
  Advertiser,
  AdvertiserStatus,
  AdvertiserWebsite,
} from '@/types/advertisers';
import type { SanityAdvertisersResult } from '@/lib/sanity/types';
// Chemin relatif, pas l'alias `@/` : ce module est chargé tel quel par
// `node --test`, qui ne connaît pas les alias de Vite.
import {
  normalizeSanityImage,
  type ImageSourceBuilder,
} from './normalizeSanityImage.ts';

type RawAdvertiser = SanityAdvertisersResult[number];

const STATUSES: readonly AdvertiserStatus[] = [
  'active',
  'inactive',
  'draft',
  'confirmation-required',
];

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
 * Un statut inconnu retombe sur `draft`, le plus discret.
 *
 * Une valeur que le code ne comprend pas ne doit jamais ouvrir la publication :
 * l'inverse ferait apparaître une fiche non confirmée à la faveur d'une faute de
 * frappe dans le schéma.
 */
function normalizeStatus(value: string | null | undefined): AdvertiserStatus {
  return STATUSES.includes(value as AdvertiserStatus)
    ? (value as AdvertiserStatus)
    : 'draft';
}

/**
 * Reconstruit le lien d'appel à partir des chiffres saisis.
 *
 * L'éditrice écrit « 514 728-4345 »; personne ne saisit deux fois le même
 * numéro sous deux formes. Un numéro qui n'a pas dix chiffres n'obtient pas de
 * lien : mieux vaut un texte non cliquable qu'un appel vers nulle part.
 */
function normalizePhone(value: string | null | undefined): Advertiser['phone'] {
  const display = cleanString(value);
  if (!display) return undefined;

  const digits = display.replace(/\D/g, '');
  if (digits.length !== 10) return undefined;

  return { display, href: `tel:+1${digits}` as const };
}

/**
 * Même principe pour le courriel : l'adresse est saisie une fois, le `mailto:`
 * en découle. Une valeur sans `@` n'est pas une adresse et ne devient pas un
 * lien.
 */
function normalizeEmail(value: string | null | undefined): Advertiser['email'] {
  const display = cleanString(value);
  if (!display || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(display)) return undefined;

  return { display, href: `mailto:${display}` as const };
}

/**
 * Le site de l'annonceur est la seule adresse que le CMS fournit sur ce site.
 *
 * Elle reste tenue en laisse : seuls `http` et `https` passent, ce qui écarte
 * `javascript:` et `data:` même si le schéma venait à perdre sa validation.
 */
function normalizeWebsite(
  value: string | null | undefined,
): AdvertiserWebsite | undefined {
  const href = cleanString(value);
  if (!href) return undefined;

  return href.startsWith('https://') || href.startsWith('http://')
    ? (href as AdvertiserWebsite)
    : undefined;
}

/**
 * Une fiche sans nom n'a rien à afficher — le nom porte le titre de la carte et
 * les initiales du monogramme quand il n'y a pas de logo.
 */
function normalizeAdvertiser(
  raw: RawAdvertiser,
  buildSources: ImageSourceBuilder,
): Advertiser | undefined {
  const name = cleanString(raw.name);
  if (!name) return undefined;

  const lines = cleanList(raw.addressLines);

  return {
    id: raw._id,
    name,
    category: cleanString(raw.category),
    description: cleanString(raw.description),
    ...(lines.length > 0 ? { address: { lines } } : {}),
    phone: normalizePhone(raw.phone),
    email: normalizeEmail(raw.email),
    website: normalizeWebsite(raw.website),
    logo: normalizeSanityImage(raw.logo, buildSources),
    status: normalizeStatus(raw.status),
    order: typeof raw.order === 'number' ? raw.order : Number.MAX_SAFE_INTEGER,
  };
}

/**
 * Convertit la collection Sanity en fiches typées.
 *
 * Aucun repli fiche par fiche : une collection vide côté Sanity veut dire
 * « aucun annonceur », pas « Sanity n'a rien dit ». C'est le getter qui décide
 * de retomber sur le repli local, et seulement quand la requête a échoué.
 */
export function normalizeSanityAdvertisers(
  raw: SanityAdvertisersResult | null | undefined,
  buildSources: ImageSourceBuilder,
): readonly Advertiser[] {
  return (raw ?? []).flatMap((entry) => {
    const normalized = normalizeAdvertiser(entry, buildSources);
    return normalized ? [normalized] : [];
  });
}
