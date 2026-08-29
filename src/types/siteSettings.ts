import type { SanityRenderableImage } from '@/types/sanityImage';

export interface PublicAddress {
  readonly street: string;
  readonly city: string;
  readonly province: string;
  readonly postalCode: string;
  readonly country: string;
  readonly formatted: string;
}

/**
 * Le numéro principal de la paroisse, sous ses trois formes utiles.
 *
 * Aucune adresse `tel:` : le secrétariat reçoit ces appels à domicile, à toute
 * heure, et un numéro cliquable transforme une consultation nocturne en
 * sonnerie. Le numéro reste affiché partout où il sert — c'est le déclenchement
 * de l'appel d'un seul geste qui disparaît, pas l'information.
 *
 * `international` sert aux données structurées (`schema.org`), qui décrivent la
 * paroisse sans offrir de bouton d'appel dans la page. `e164` reste la forme
 * machine de référence : c'est elle qui identifie le numéro principal quand il
 * faut le reconnaître ailleurs (voir `isParishMainPhone`).
 */
export interface PublicPhone {
  readonly display: string;
  readonly international: string;
  readonly e164: string;
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
  /**
   * Informations de stationnement, en une ligne prête à afficher.
   *
   * Même statut que `officeHoursLabel` : c’est un fait sur le lieu, vrai
   * indépendamment de la page qui l’affiche. Absent tant que la paroisse ne
   * l’a pas confirmé.
   */
  readonly parkingLabel?: string;
  /**
   * Informations d’accessibilité, en une ligne prête à afficher.
   *
   * Absent tant que la paroisse ne l’a pas confirmé — et il vaut mieux ne rien
   * afficher qu’annoncer un accès dont personne n’a vérifié la réalité.
   */
  readonly accessibilityLabel?: string;
  /**
   * Image de partage du site, servie à toute page qui n’a pas la sienne.
   *
   * Absente tant que la paroisse n’en a pas fourni une. Aucune image locale ne
   * la remplace : partager sans image vaut mieux que partager une image qui
   * n’a rien à voir avec la page.
   */
  readonly shareImage?: SanityRenderableImage;
}
