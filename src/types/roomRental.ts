import type { PageSeo } from '@/types/seo';
import type { SanityRenderableImage } from '@/types/sanityImage';

/**
 * Une salle offerte à la location.
 *
 * `id` est l'ancre publique de la fiche, saisie explicitement : un lien envoyé
 * par courriel vers une salle précise doit continuer de fonctionner après une
 * réorganisation du tableau.
 *
 * Emplacement, capacité et tarif sont facultatifs, et chacun disparaît seul.
 * Une salle dont le tarif n'est pas encore arrêté s'affiche sans ligne de
 * tarif — jamais avec « à venir », qui est une promesse.
 */
export interface RoomRentalRoom {
  readonly id: string;
  readonly name: string;
  readonly location?: string;
  readonly capacity?: string;
  readonly price?: string;
  readonly description?: string;
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
