import type { UpcomingMass, WeeklyMassEntry } from '@/types/schedule';
import { SCHEDULE_TIME_ZONE } from '@/lib/schedules/schedule-format.ts';
import { getUpcomingMasses } from '@/lib/schedules/upcoming-masses.ts';

const DEFAULT_LIMIT = 3;
const ENHANCED_TITLE = 'Prochaines messes';

function parseEntries(card: HTMLElement): WeeklyMassEntry[] {
  const payload = card.querySelector<HTMLScriptElement>(
    '[data-upcoming-masses-data]',
  )?.textContent;
  if (!payload) return [];

  try {
    const parsed: unknown = JSON.parse(payload);
    return Array.isArray(parsed) ? (parsed as WeeklyMassEntry[]) : [];
  } catch {
    // Charge utile illisible : la carte rendue par le serveur reste affichée.
    return [];
  }
}

function renderRows(list: HTMLElement, masses: readonly UpcomingMass[]): void {
  const rows = masses.map((mass) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');

    term.textContent = mass.relativeDayLabel;
    description.textContent = mass.timeLabel;
    row.append(term, description);

    return row;
  });

  list.replaceChildren(...rows);
}

/**
 * Amélioration progressive : remplace la liste des horaires réguliers par les
 * prochaines célébrations, calculées dans le fuseau de la paroisse.
 *
 * Le serveur a déjà rendu une carte juste et complète ; en cas d'absence de
 * données, de JSON illisible ou de JavaScript désactivé, rien n'est touché.
 */
export function initializeUpcomingMassesCards(now: Date = new Date()): void {
  document
    .querySelectorAll<HTMLElement>('[data-upcoming-masses]')
    .forEach((card) => {
      if (card.dataset.upcomingMassesReady === 'true') return;

      const list = card.querySelector<HTMLElement>(
        '[data-upcoming-masses-list]',
      );
      if (!list) return;

      const entries = parseEntries(card);
      if (entries.length === 0) return;

      const limit = Number(card.dataset.upcomingMassesLimit) || DEFAULT_LIMIT;
      const upcoming = getUpcomingMasses(
        now,
        SCHEDULE_TIME_ZONE,
        entries,
        limit,
      );
      if (upcoming.length === 0) return;

      renderRows(list, upcoming);

      const title = card.querySelector<HTMLElement>(
        '[data-upcoming-masses-title]',
      );
      if (title) title.textContent = ENHANCED_TITLE;

      card.dataset.upcomingMassesReady = 'true';
    });
}
