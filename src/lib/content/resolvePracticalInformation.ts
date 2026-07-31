import type {
  PracticalInformation,
  PracticalInformationContent,
  PracticalInfoRow,
  PracticalInformationItem,
} from '@/types/firstVisit';
import type { PublicContactDetails } from '@/types/siteSettings';
// Chemin relatif, pas l'alias `@/` : ce module est chargé tel quel par
// `node --test`, qui ne connaît pas les alias de Vite.
import { LINK_TARGETS } from './normalizeSanityFirstVisitPage.ts';

function cleanString(value: string | null | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

/**
 * Résout une ligne contre les coordonnées de la paroisse.
 *
 * Renvoie `undefined` quand la valeur désignée est absente, et la ligne
 * disparaît alors de la page. C'est le comportement voulu : une paroisse qui n'a
 * pas encore confirmé ses conditions d'accès a plus à perdre à afficher un
 * libellé vide, ou un texte entre crochets, qu'à taire la ligne. Le jour où la
 * valeur est saisie dans « Coordonnées de la paroisse », la ligne réapparaît
 * seule, sans toucher à la page.
 */
function resolveRow(
  row: PracticalInfoRow,
  contact: PublicContactDetails,
): PracticalInformationItem | undefined {
  const base = { id: row.id, label: row.label };

  switch (row.source) {
    case 'address': {
      const value = cleanString(contact.address.formatted);
      return value ? { ...base, value } : undefined;
    }
    case 'phone': {
      const value = cleanString(contact.phone.display);
      return value ? { ...base, value } : undefined;
    }
    case 'parking': {
      const value = cleanString(contact.parkingLabel);
      return value ? { ...base, value } : undefined;
    }
    case 'accessibility': {
      const value = cleanString(contact.accessibilityLabel);
      return value ? { ...base, value } : undefined;
    }
    case 'pageText': {
      const value = cleanString(row.value);
      return value ? { ...base, value } : undefined;
    }
    case 'internalLink': {
      const value = cleanString(row.linkLabel);
      const href = row.linkTarget ? LINK_TARGETS[row.linkTarget] : undefined;
      return value && href ? { ...base, value, href } : undefined;
    }
    default:
      return undefined;
  }
}

/**
 * Transforme les lignes écrites en lignes affichables.
 *
 * Le même traitement s'applique au contenu Sanity et au repli local : les deux
 * décrivent leurs lignes de la même façon, donc la page se comporte pareil que
 * le CMS réponde ou non.
 */
export function resolvePracticalInformation(
  content: PracticalInformationContent,
  contact: PublicContactDetails,
): PracticalInformation {
  const items = content.items.flatMap((row) => {
    const resolved = resolveRow(row, contact);
    return resolved ? [resolved] : [];
  });

  return {
    eyebrow: content.eyebrow,
    title: content.title,
    items,
    primaryCta: content.primaryCta,
    secondaryCta: content.secondaryCta,
    image: content.image,
  };
}
