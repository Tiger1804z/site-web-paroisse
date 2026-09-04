import type { PageSeo } from '@/types/seo';
import type { SanityRenderableImage } from '@/types/sanityImage';

/**
 * Une salle de réception offerte à la location.
 *
 * `id` est l'ancre publique de la fiche, saisie explicitement : un lien envoyé
 * par courriel vers une salle précise doit continuer de fonctionner après une
 * réorganisation du tableau.
 *
 * Tous les champs sauf le nom sont facultatifs, et chacun disparaît seul. Une
 * salle dont le tarif n'est pas encore arrêté s'affiche sans ligne de tarif —
 * jamais avec « à venir », qui est une promesse.
 *
 * `hourlyExtra` et `curfew` viennent de l'ancien site et avaient été perdus à
 * la première migration. Ce sont deux faits qu'on découvre autrement le soir
 * de la fête : le prix d'une heure de plus, et l'heure à laquelle il faut être
 * parti.
 */
export interface RoomRentalRoom {
  readonly id: string;
  readonly name: string;
  readonly location?: string;
  readonly capacity?: string;
  readonly price?: string;
  /** « 50 $ pour chaque heure supplémentaire ». */
  readonly hourlyExtra?: string;
  /** « 22 h » — heure limite de départ. */
  readonly curfew?: string;
  readonly description?: string;
}

/**
 * La location de l'église elle-même.
 *
 * Séparée des salles de réception, comme sur l'ancien site : elle n'a ni
 * cuisinette ni vestiaire, elle se loue à la journée, et elle n'est pas offerte
 * à tout le monde. La ranger dans le même tableau que La Ruchée aurait rendu
 * faux le bloc « dans chacune des deux salles ».
 */
export interface RoomRentalChurch {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly capacity?: string;
  readonly price?: string;
  readonly note?: string;
}

/**
 * Le dépôt de garantie, exigé sur toute location.
 *
 * Un bloc à lui seul, et non une ligne au milieu d'un paragraphe : c'est de
 * l'argent demandé en plus du tarif affiché, et une personne qui le découvre
 * au comptoir a le droit de se sentir trompée.
 */
export interface RoomRentalDeposit {
  readonly title: string;
  readonly message: string;
}

/**
 * Les règles sur les boissons alcoolisées.
 *
 * Une règle par entrée. L'ancien site les donnait en un seul bloc commençant
 * par « NOTE: », où le délai de dix jours — le seul fait qui peut faire rater
 * une réservation — se lisait en dernier, après deux virgules.
 */
export interface RoomRentalAlcohol {
  readonly title: string;
  readonly rules: readonly string[];
  /** Adresse officielle de la demande de permis, si elle est publiée. */
  readonly permitUrl?: string;
  readonly permitLinkLabel: string;
}

/** Une ligne de la marche à suivre (« Réservation », « Contrat »). */
export interface RoomRentalDetail {
  readonly label: string;
  readonly value: string;
}

export interface RoomRentalCallToAction {
  readonly label: string;
  readonly href: string;
}

export interface RoomRentalPageData {
  readonly seo: PageSeo;
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    /** Sans image, l'en-tête garde son fond sombre et le titre reste lisible. */
    readonly image?: SanityRenderableImage;
  };
  readonly offer: {
    readonly eyebrow: string;
    readonly title: string;
    /** « Location 2026-2027 » : la période que couvrent les tarifs affichés. */
    readonly periodLabel?: string;
    readonly paragraphs: readonly string[];
  };
  /**
   * Ce que les deux salles ont en commun, écrit une fois.
   *
   * La liste vivait en double dans le texte d'une seule salle, sur l'ancienne
   * page. Un équipement retiré devait alors être retiré deux fois — et ne
   * l'était pas.
   */
  readonly amenities: {
    readonly title: string;
    readonly items: readonly string[];
  };
  readonly rooms: readonly RoomRentalRoom[];
  /** Absente tant que la paroisse ne publie pas la location de l'église. */
  readonly church?: RoomRentalChurch;
  readonly deposit?: RoomRentalDeposit;
  /** Absentes si aucune règle n'est saisie : un titre seul n'informe personne. */
  readonly alcohol?: RoomRentalAlcohol;
  readonly practical: {
    readonly title: string;
    readonly items: readonly RoomRentalDetail[];
  };
  readonly finalCta: {
    readonly title: string;
    readonly description: string;
    readonly primary: RoomRentalCallToAction;
    /**
     * Le numéro du secrétariat, affiché seul.
     *
     * Pas d'adresse `tel:` : la paroisse ne veut plus qu'un geste sur le numéro
     * déclenche un appel, le secrétariat recevant ces appels à domicile à toute
     * heure. Le bouton voisin mène à la page Contact.
     */
    readonly phone: {
      readonly display: string;
    };
  };
}
