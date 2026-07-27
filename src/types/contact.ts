export type ContactContentStatus =
  'confirmed' | 'observed-to-confirm' | 'temporary';

export type ContactMethodKind = 'address' | 'phone' | 'email' | 'social';

export interface ContactCallToAction {
  readonly label: string;
  readonly href: string;
}

export interface ContactMethod {
  readonly id: string;
  readonly kind: ContactMethodKind;
  readonly label: string;
  readonly value: string;
  readonly href?: string;
  readonly note?: string;
  readonly active: boolean;
  readonly order: number;
  readonly status: ContactContentStatus;
}

export interface ContactOfficeHours {
  readonly title: string;
  readonly schedule: readonly string[];
  readonly note?: string;
  readonly active: boolean;
  readonly status: ContactContentStatus;
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
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly noIndex: boolean;
  };
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
    readonly accessNotes: readonly string[];
    readonly status: ContactContentStatus;
  };
  readonly form: {
    readonly title: string;
    readonly introduction: string;
    readonly fields: readonly ContactFormField[];
    readonly unavailableNotice: string;
    readonly validationButtonLabel: string;
    readonly locallyValidNotice: string;
    readonly privacyNotice: string;
    readonly privacyPolicyHref: string;
  };
}
