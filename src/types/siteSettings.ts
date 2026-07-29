export interface PublicAddress {
  readonly street: string;
  readonly city: string;
  readonly province: string;
  readonly postalCode: string;
  readonly country: string;
  readonly formatted: string;
}

export interface PublicPhone {
  readonly display: string;
  readonly international: string;
  readonly e164: string;
  readonly href: `tel:${string}`;
}

export interface PublicEmail {
  readonly display: string;
  readonly href: `mailto:${string}` | '';
  readonly confirmed: boolean;
}

export interface PublicMapSettings {
  readonly latitude: number;
  readonly longitude: number;
  readonly embedUrl: string;
  readonly title: string;
}

export interface PublicContactDetails {
  readonly organizationName: string;
  readonly address: PublicAddress;
  readonly phone: PublicPhone;
  readonly email?: PublicEmail;
  readonly directionsUrl: string;
  readonly map: PublicMapSettings;
  /**
   * Heures d’ouverture du secrétariat, en une ligne prête à afficher.
   *
   * Coordonnée globale : la même valeur sert la page Horaires, Contact et
   * Première visite. Absente tant que la paroisse ne l’a pas confirmée.
   */
  readonly officeHoursLabel?: string;
}
