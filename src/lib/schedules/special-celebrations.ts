import type {
  ParishEvent,
  ParishEventCategory,
  ParishEventWithTemporalStatus,
} from '@/types/parish-events';
import type { SpecialCelebration } from '@/types/schedule';
// Chemin relatif et extension explicite : ce module est chargé tel quel par
// `node --test`, qui ne résout pas l'alias `@/`.
import {
  formatParishEventDate,
  formatParishEventTime,
  selectUpcomingParishEvents,
} from '../events/parish-events.ts';

/**
 * Les catégories d'activités qui ont leur place dans les horaires.
 *
 * « Célébration » (`liturgy`) et rien d'autre : la page Horaires répond à la
 * question « à quelle heure est la messe cette semaine? ». Un concert ou un
 * pèlerinage n'y change rien — ils vivent sur `/evenements/`, où le bas de
 * cette section renvoie déjà.
 */
const CELEBRATION_CATEGORIES: ReadonlySet<ParishEventCategory> = new Set([
  'liturgy',
]);

/**
 * Une célébration annulée reste affichée, marquée comme telle.
 *
 * La retirer serait pire que de ne rien annoncer : quelqu'un qui l'a lue la
 * semaine dernière se déplacerait quand même. Le libellé occupe la pastille
 * `note`, qui est un marqueur court et non une phrase.
 */
const CANCELLED_NOTE = 'Annulée';

function toSpecialCelebration(
  event: ParishEventWithTemporalStatus,
): SpecialCelebration {
  return {
    id: event.id,
    title: event.title,
    dateLabel: formatParishEventDate(event.startAt),
    timeLabel: formatParishEventTime(event.startAt),
    ...(event.publicationStatus === 'cancelled'
      ? { note: CANCELLED_NOTE }
      : {}),
  };
}

/**
 * Les célébrations datées à venir, mises en forme pour la page Horaires.
 *
 * Une même célébration ne peut pas avoir deux sources de vérité : elle se
 * saisit une seule fois, dans les Événements, et se lit ici. Les règles de
 * publication sont donc exactement celles de `/evenements/` — activité
 * publiée, affichée sur le site, pas encore passée.
 */
export function selectSpecialCelebrations(
  events: readonly ParishEvent[],
  now: Date,
  limit?: number,
): SpecialCelebration[] {
  const celebrations = selectUpcomingParishEvents(events, now)
    .filter(({ category }) => CELEBRATION_CATEGORIES.has(category))
    .map(toSpecialCelebration);

  return typeof limit === 'number'
    ? celebrations.slice(0, limit)
    : celebrations;
}
