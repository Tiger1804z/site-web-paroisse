import {defineType, defineArrayMember} from 'sanity'

/**
 * Texte de plusieurs paragraphes, avec gras et italique.
 *
 * Réutilisable : tout champ qui gagne à porter une emphase peut passer de
 * `text` à `richText`. Le premier besoin est venu des annonces d'événements,
 * où l'ancien site met en gras l'amorce d'un paragraphe — « Pour la réception
 * qui suivra » — et les intertitres d'une distribution musicale, et en
 * italique le titre d'un album. Recopier ces annonces en texte plat perdait
 * cette hiérarchie.
 *
 * Volontairement pauvre. Pas de titres : ces textes vivent déjà sous un titre
 * de carte, et en ajouter un deuxième casserait la hiérarchie de la page pour
 * les lecteurs d'écran. Pas de liens : aucun de ces textes n'en contient, et
 * un champ qu'on n'utilise pas est un champ qui finit par mentir. Ils
 * s'ajouteront le jour où un texte réel en aura besoin.
 *
 * Le retour à la ligne simple (Maj + Entrée) est conservé à l'affichage : une
 * liste de musiciens s'écrit ainsi, sans que chaque nom devienne un paragraphe.
 */
export const richTextType = defineType({
  name: 'richText',
  title: 'Texte',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [{title: 'Paragraphe', value: 'normal'}],
      lists: [],
      marks: {
        decorators: [
          {title: 'Gras', value: 'strong'},
          {title: 'Italique', value: 'em'},
        ],
        annotations: [],
      },
    }),
  ],
})
