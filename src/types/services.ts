import type { ImageMetadata } from 'astro';

export type ServiceSurface = 'ivory' | 'paper' | 'charcoal' | 'burgundy';

export interface ServicesCallToAction {
  readonly label: string;
  readonly href: string;
}

/**
 * Une ligne de renseignement affichée sous un service.
 *
 * Le booléen `confirmed` et le bloc de métadonnées de révision qui vivaient ici
 * ont disparu en migrant : aucun composant ne les rendait, et `confirmed` valait
 * toujours vrai. La seule date de révision publiée est celle de `notice`.
 */
export interface ParishServiceDetail {
  readonly label: string;
  readonly value: string;
}

export interface ServicesEditorialImage {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly documentary: boolean;
  readonly credit?: string;
  readonly objectPosition?: string;
  readonly frame: 'arch' | 'landscape' | 'organic' | 'oval' | 'portrait-offset';
}

/**
 * `id` est l'ancre publique de la section, pas une clé technique : le sommaire
 * et la redirection de `/location-de-salle/` s'en servent.
 *
 * `order` a disparu : l'ordre du tableau fait foi, dans Sanity comme dans le
 * repli local. `category` aussi — aucun composant ne la lisait.
 */
export interface ParishService {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly active: boolean;
  readonly details?: readonly ParishServiceDetail[];
  readonly steps?: readonly string[];
  readonly note?: string;
  readonly cta?: ServicesCallToAction;
}

export interface ParishServiceChapter {
  readonly id: string;
  readonly eyebrow: string;
  readonly title: string;
  readonly introduction: string;
  readonly surface: ServiceSurface;
  readonly services: readonly ParishService[];
  readonly image?: ServicesEditorialImage;
}

export interface ServicesPageData {
  readonly seo: {
    readonly title: string;
    readonly description: string;
    readonly canonicalPath: string;
  };
  readonly hero: {
    readonly eyebrow: string;
    readonly title: string;
    readonly introduction: string;
    readonly images: readonly (ServicesEditorialImage & {
      readonly label: string;
    })[];
  };
  readonly notice: {
    readonly title: string;
    readonly message: string;
    readonly reviewDate: string;
  };
  readonly chapters: readonly ParishServiceChapter[];
  readonly paymentMethods: {
    readonly title: string;
    readonly description: string;
    readonly methods: readonly string[];
  };
  readonly finalCta: {
    readonly title: string;
    readonly description: string;
    readonly primary: ServicesCallToAction;
    readonly phone: {
      readonly display: string;
      readonly href: `tel:${string}`;
    };
  };
}
