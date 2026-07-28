export interface SanitySiteSettingsAddress {
  readonly street: string | null;
  readonly city: string | null;
  readonly province: string | null;
  readonly postalCode: string | null;
  readonly country: string | null;
}

export interface SanitySiteSettingsDocument {
  readonly organizationName: string | null;
  readonly address: SanitySiteSettingsAddress | null;
  readonly phone: string | null;
  readonly publicEmail: string | null;
  readonly showPublicEmail: boolean | null;
}
