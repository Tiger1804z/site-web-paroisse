import type { PublicContactDetails, PublicEmail } from '@/types/siteSettings';
import type { SanitySiteSettingsResult } from '@/lib/sanity/types';

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function derivePhone(
  rawPhone: string | null,
  fallback: PublicContactDetails['phone'],
): PublicContactDetails['phone'] {
  const display = cleanString(rawPhone);
  if (!display) return fallback;

  const digits = display.replace(/\D/g, '');
  if (digits.length !== 10) return fallback;

  const e164 = `+1${digits}`;
  return {
    display,
    international: `+1 ${display}`,
    e164,
    href: `tel:${e164}`,
  };
}

function deriveAddress(
  rawAddress: NonNullable<SanitySiteSettingsResult>['address'],
  fallback: PublicContactDetails['address'],
): PublicContactDetails['address'] {
  const street = cleanString(rawAddress?.street) ?? fallback.street;
  const city = cleanString(rawAddress?.city) ?? fallback.city;
  const province = cleanString(rawAddress?.province) ?? fallback.province;
  const postalCode = cleanString(rawAddress?.postalCode) ?? fallback.postalCode;
  const country = cleanString(rawAddress?.country) ?? fallback.country;

  return {
    street,
    city,
    province,
    postalCode,
    country,
    formatted: `${street}, ${city}, ${province} ${postalCode}`,
  };
}

function deriveEmail(
  rawEmail: string | null,
  showPublicEmail: boolean | null,
): PublicEmail | undefined {
  const display = cleanString(rawEmail);
  if (!display || showPublicEmail !== true) return undefined;

  return {
    display,
    href: `mailto:${display}`,
    confirmed: true,
  };
}

export function normalizeSanitySiteSettings(
  raw: SanitySiteSettingsResult,
  fallback: PublicContactDetails,
): PublicContactDetails {
  return {
    organizationName:
      cleanString(raw?.organizationName) ?? fallback.organizationName,
    address: deriveAddress(raw?.address ?? null, fallback.address),
    phone: derivePhone(raw?.phone ?? null, fallback.phone),
    email: deriveEmail(raw?.publicEmail ?? null, raw?.showPublicEmail ?? null),
    directionsUrl: fallback.directionsUrl,
    map: fallback.map,
    // Coordonnée globale : la page Horaires, Contact et Première visite
    // affichent toutes la même valeur, corrigée à un seul endroit.
    officeHoursLabel:
      cleanString(raw?.officeHours) ?? fallback.officeHoursLabel,
    // Faits sur le lieu, pas contenu de page : le champ existait dans le schéma
    // depuis S1-T14 sans jamais être projeté. C’est Première visite qui les
    // consomme la première.
    parkingLabel: cleanString(raw?.parkingInformation) ?? fallback.parkingLabel,
    accessibilityLabel:
      cleanString(raw?.accessibilityInformation) ?? fallback.accessibilityLabel,
  };
}
