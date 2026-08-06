import type { ParishEvent } from '@/types/parish-events';
import type { PublicContactDetails } from '@/types/siteSettings';
import {
  eventJsonLd,
  placeOfWorshipJsonLd,
  websiteJsonLd,
  type JsonLdNode,
} from './jsonLd.ts';
import { SITE_URL } from './siteUrl.ts';
import { SITE_NAME } from '../site.ts';

/**
 * Les graphes de données structurées que les pages passent à `BaseLayout`.
 *
 * Cette couche existe pour que les pages n'aient pas à connaître `SITE_URL` :
 * elles passent la donnée qu'elles ont déjà en main, et l'adresse du site
 * reste l'affaire d'un seul module. `jsonLd.ts`, lui, ne lit rien de
 * l'environnement — c'est ce qui le rend testable.
 *
 * Trois pages seulement en portent : l'accueil décrit le site et la paroisse,
 * `/contact` redit la paroisse là où on vient chercher ses coordonnées, et
 * `/evenements` décrit ses activités. Les autres n'ont rien à déclarer qu'un
 * moteur ne lise déjà dans leur texte.
 */

/** L'accueil : le site, et la paroisse qui le publie. */
export function siteIdentityGraph(
  settings: PublicContactDetails,
): readonly JsonLdNode[] {
  return [
    websiteJsonLd(SITE_URL, SITE_NAME),
    placeOfWorshipJsonLd(SITE_URL, settings),
  ];
}

/** La paroisse seule, pour la page où l'on vient la joindre. */
export function parishGraph(
  settings: PublicContactDetails,
): readonly JsonLdNode[] {
  return [placeOfWorshipJsonLd(SITE_URL, settings)];
}

/**
 * Les activités affichées, précédées de la paroisse.
 *
 * La paroisse entre dans le même graphe parce que les activités qui s'y
 * tiennent la désignent par identifiant : sans le nœud, la référence ne mène
 * nulle part. Une activité dont les champs obligatoires manquent est écartée.
 */
export function eventsGraph(
  settings: PublicContactDetails,
  events: readonly ParishEvent[],
  pagePath: string,
): readonly JsonLdNode[] {
  return [
    placeOfWorshipJsonLd(SITE_URL, settings),
    ...events.flatMap((event) => {
      const node = eventJsonLd(SITE_URL, event, pagePath);
      return node ? [node] : [];
    }),
  ];
}
