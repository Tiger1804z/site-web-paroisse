import type { ImageMetadata } from 'astro';

export const PARISH_EVENT_TIME_ZONE = 'America/Toronto' as const;

export type ParishEventCategory =
  | 'pilgrimage'
  | 'liturgy'
  | 'concert'
  | 'community-meal'
  | 'family'
  | 'mutual-aid'
  | 'conference'
  | 'other';

export type ParishEventPublicationStatus = 'draft' | 'published' | 'cancelled';

export type ParishEventTemporalStatus = 'upcoming' | 'ongoing' | 'past';

export interface ParishEventImage {
  readonly image: ImageMetadata;
  readonly alt: string;
  readonly credit?: string;
  readonly caption?: string;
  readonly rightsNote?: string;
}

export interface ParishEventCallToAction {
  readonly label: string;
  readonly href: string;
}

export interface ParishEvent {
  readonly id: string;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly description?: string;
  readonly category: ParishEventCategory;
  readonly startAt: string;
  readonly endAt?: string;
  readonly timeZone: typeof PARISH_EVENT_TIME_ZONE;
  readonly locationName?: string;
  readonly meetingPoint?: string;
  readonly departureAt?: string;
  readonly returnAt?: string;
  readonly price?: {
    readonly amount: number;
    readonly currency: 'CAD';
    readonly label?: string;
  };
  readonly capacityNotice?: string;
  readonly contact?: {
    readonly name?: string;
    readonly phone?: string;
    readonly phoneHref?: `tel:${string}`;
    readonly email?: string;
  };
  readonly publicationStatus: ParishEventPublicationStatus;
  readonly showOnWebsite: boolean;
  readonly showOnHomepage: boolean;
  readonly showInArchive: boolean;
  readonly featured: boolean;
  readonly homepagePriority?: number;
  readonly coverImage?: ParishEventImage;
  readonly gallery?: readonly ParishEventImage[];
  readonly cta?: ParishEventCallToAction;
}

export type ParishEventWithTemporalStatus = ParishEvent & {
  readonly temporalStatus: ParishEventTemporalStatus;
};

export interface HomepageUpcomingEvents {
  readonly featured?: ParishEventWithTemporalStatus;
  readonly secondary: readonly ParishEventWithTemporalStatus[];
}

export interface EventsPageSettings {
  readonly showUpcomingSection: boolean;
  readonly showPastSection: boolean;
  readonly upcomingSectionTitle: string;
  readonly pastSectionTitle: string;
  readonly upcomingLimit?: number;
  readonly pastLimit?: number;
}

export interface HomepageEventsSettings {
  readonly showHomepageUpcomingSection: boolean;
  readonly homepageUpcomingTitle: string;
  readonly homepageUpcomingLimit: number;
}
