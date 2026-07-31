import type {
  ContactFormField,
  ContactPageData,
  ContactSelectField,
} from '@/types/contact';
import type { SanityContactPageResult } from '@/lib/sanity/types';

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

type RawReason = NonNullable<
  NonNullable<NonNullable<SanityContactPageResult>['form']>['reasons']
>[number];

/**
 * Un motif sans libellé ou sans clé est écarté.
 *
 * Une option sans libellé serait une ligne vide dans la liste, et une option
 * sans clé n'aurait rien à transmettre le jour où le formulaire enverra
 * vraiment.
 */
function normalizeReasons(
  raw: readonly RawReason[] | null | undefined,
): ContactSelectField['options'] {
  return (raw ?? []).flatMap((entry) => {
    const label = cleanString(entry.label);
    const value = cleanString(entry.value);
    if (!label || !value) return [];
    return [{ label, value }];
  });
}

/**
 * Remplace les motifs du champ `reason`, sans toucher au reste du champ.
 *
 * Le type, l'obligation, le message d'erreur et le nom du champ restent ceux du
 * code : seule la liste des options est du contenu.
 */
function applyReasons(
  fields: readonly ContactFormField[],
  options: ContactSelectField['options'],
): readonly ContactFormField[] {
  if (options.length === 0) return fields;

  return fields.map((field) =>
    field.name === 'reason' && field.type === 'select'
      ? { ...field, options }
      : field,
  );
}

/**
 * Fusionne le contenu Sanity avec le repli local, champ par champ.
 *
 * Rien de ce qui suit ne vient jamais de Sanity :
 *
 * - **les coordonnées** — adresse, téléphone, courriel, heures du secrétariat,
 *   stationnement, accessibilité, carte et lien d'itinéraire. Ce sont des faits
 *   sur la paroisse, lus dans `siteSettings` par le getter. Le document de page
 *   n'en porte aucun, et le bloc d'heures disparaît tout seul si l'horaire n'y
 *   est pas saisi;
 * - **la structure du formulaire** — noms de champs, types, longueurs,
 *   expressions de validation, messages d'erreur. Le script de validation les
 *   lit; une expression mal saisie casserait la page en silence. Seuls les
 *   textes autour et la liste des motifs se saisissent;
 * - **le `seo`**, `noindex` compris : retirer `noindex` suppose que le système
 *   d'envoi et une politique de confidentialité existent;
 * - **l'adresse de la politique de confidentialité**, qui est une route.
 */
export function normalizeSanityContactPage(
  raw: SanityContactPageResult,
  fallback: ContactPageData,
): ContactPageData {
  const extraNotes = cleanList(raw?.location?.extraNotes);
  const reasons = normalizeReasons(raw?.form?.reasons);

  return {
    seo: fallback.seo,
    hero: {
      eyebrow: cleanString(raw?.hero?.eyebrow) ?? fallback.hero.eyebrow,
      title: cleanString(raw?.hero?.title) ?? fallback.hero.title,
      introduction:
        cleanString(raw?.hero?.introduction) ?? fallback.hero.introduction,
    },
    methods: fallback.methods,
    methodsFallback: {
      title:
        cleanString(raw?.methodsFallback?.title) ??
        fallback.methodsFallback.title,
      description:
        cleanString(raw?.methodsFallback?.description) ??
        fallback.methodsFallback.description,
    },
    // Le bloc n'existe que si l'horaire est saisi dans les coordonnées de la
    // paroisse. Un titre écrit dans le Studio ne le fait pas apparaître seul.
    officeHours: fallback.officeHours
      ? {
          title:
            cleanString(raw?.officeHours?.title) ?? fallback.officeHours.title,
          schedule: fallback.officeHours.schedule,
          note:
            cleanString(raw?.officeHours?.note) ?? fallback.officeHours.note,
        }
      : undefined,
    location: {
      title: cleanString(raw?.location?.title) ?? fallback.location.title,
      description:
        cleanString(raw?.location?.description) ??
        fallback.location.description,
      address: fallback.location.address,
      mapEmbedUrl: fallback.location.mapEmbedUrl,
      mapTitle: fallback.location.mapTitle,
      directionsCta: fallback.location.directionsCta,
      // Les faits partagés restent en tête; les précisions du Studio suivent.
      accessNotes: [...fallback.location.accessNotes, ...extraNotes],
    },
    form: {
      title: cleanString(raw?.form?.title) ?? fallback.form.title,
      introduction:
        cleanString(raw?.form?.introduction) ?? fallback.form.introduction,
      fields: applyReasons(fallback.form.fields, reasons),
      unavailableNotice:
        cleanString(raw?.form?.unavailableNotice) ??
        fallback.form.unavailableNotice,
      validationButtonLabel:
        cleanString(raw?.form?.validationButtonLabel) ??
        fallback.form.validationButtonLabel,
      locallyValidNotice:
        cleanString(raw?.form?.locallyValidNotice) ??
        fallback.form.locallyValidNotice,
      privacyNotice:
        cleanString(raw?.form?.privacyNotice) ?? fallback.form.privacyNotice,
      privacyPolicyHref: fallback.form.privacyPolicyHref,
    },
  };
}
