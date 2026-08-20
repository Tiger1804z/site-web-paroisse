import type { PageSeo } from '@/types/seo';

export type ContactMethodKind = 'address' | 'phone' | 'email' | 'social';

export interface ContactCallToAction {
  readonly label: string;
  readonly href: string;
}

/**
 * Une coordonnée affichée sur la page.
 *
 * Aucune n'est saisissable dans le Studio : les trois viennent de
 * « Coordonnées de la paroisse », la source unique. Une coordonnée absente ne
 * produit pas de carte — c'est ce qui fait apparaître le courriel tout seul le
 * jour où la paroisse le confirme, sans toucher au code.
 */
export interface ContactMethod {
  readonly id: string;
  readonly kind: ContactMethodKind;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly note?: string;
}

/**
 * Heures du secrétariat.
 *
 * Le titre et la note se saisissent, l'horaire non : c'est un fait sur la
 * paroisse, vrai indépendamment de la page, et il sert aussi Horaires et
 * Première visite. Absent tant que `officeHoursLabel` est vide.
 */
export interface ContactOfficeHours {
  readonly title: string;
  readonly schedule: readonly string[];
  readonly note?: string;
}

export type ContactFormFieldName =
  'reason' | 'fullName' | 'email' | 'phone' | 'message' | 'privacyConsent';

interface ContactFormFieldBase {
  readonly name: ContactFormFieldName;
  readonly label: string;
  readonly required: boolean;
  readonly description?: string;
  readonly requiredMessage?: string;
}

export interface ContactInputField extends ContactFormFieldBase {
  readonly type: 'text' | 'email' | 'tel';
  readonly autocomplete?: string;
  readonly placeholder?: string;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
  readonly invalidMessage?: string;
}

export interface ContactSelectField extends ContactFormFieldBase {
  readonly type: 'select';
  readonly placeholder: string;
  readonly options: readonly {
    readonly label: string;
    readonly value: string;
  }[];
}

export interface ContactTextareaField extends ContactFormFieldBase {
  readonly type: 'textarea';
  readonly placeholder?: string;
  readonly rows: number;
  readonly minLength?: number;
  readonly maxLength?: number;
}

export interface ContactCheckboxField extends ContactFormFieldBase {
  readonly type: 'checkbox';
}

export type ContactFormField =
  | ContactInputField
  | ContactSelectField
  | ContactTextareaField
  | ContactCheckboxField;

export interface ContactPageData {
  readonly seo: PageSeo;
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
  };
  readonly methods: readonly ContactMethod[];
  readonly methodsFallback: {
    readonly title: string;
    readonly description: string;
  };
  readonly officeHours?: ContactOfficeHours;
  readonly location: {
    readonly title: string;
    readonly description: string;
    readonly address?: string;
    readonly mapEmbedUrl?: string;
    readonly mapTitle?: string;
    readonly directionsCta?: ContactCallToAction;
    /**
     * Stationnement et accessibilité viennent de `siteSettings`; les notes
     * saisies dans le Studio les suivent. Une note vide ne produit pas de ligne.
     */
    readonly accessNotes: readonly string[];
  };
  readonly form: {
    readonly title: string;
    readonly introduction: string;
    readonly fields: readonly ContactFormField[];
    /** Libellé du bouton au repos. */
    readonly submitButtonLabel: string;
    /** Ce que le bouton affiche pendant l'envoi, et que le lecteur d'écran annonce. */
    readonly sendingLabel: string;
    /**
     * Confirmation affichée après un envoi réussi.
     *
     * Elle ne promet aucun délai : le secrétariat est ouvert deux jours et demi
     * par semaine, et une promesse qu'il ne tiendra pas déçoit à coup sûr.
     */
    readonly successNotice: string;
    /** Message d'échec, qui invite à réessayer sans accuser la personne. */
    readonly errorNotice: string;
    readonly privacyNotice: string;
    readonly privacyPolicyHref: string;
  };
}
