import {defineType, defineField} from 'sanity'

/**
 * Référencement d'une page : ce que lisent les moteurs de recherche et les
 * aperçus de partage.
 *
 * Trois champs, pas plus. L'éditrice écrit le titre, la description et choisit
 * l'image de partage. Le canonique, le sitemap, le `noindex`, l'Open Graph
 * technique et le JSON-LD restent au code : ce sont des règles, pas du contenu,
 * et une valeur saisie à la main les casserait sans que personne le voie.
 *
 * Les textes d'aide sont écrits pour quelqu'un qui n'a jamais entendu les mots
 * « SEO », « balise » ou « méta description ». Aucun de ces mots n'apparaît
 * dans l'interface. Chaque champ dit où son texte s'affiche, pour qui, et donne
 * un exemple tiré du site réel.
 *
 * Les limites de longueur sont des avertissements, jamais des erreurs :
 * au-delà de 60 ou 160 caractères la fin est coupée dans les résultats de
 * recherche, ce qui est laid mais pas faux. Un titre vide, lui, est une faute.
 */
export const seoType = defineType({
  name: 'seo',
  title: 'Apparence sur Google et dans les partages',
  type: 'object',
  description:
    'Ces trois éléments ne s’affichent pas sur la page elle-même. Ils servent ailleurs : dans la liste des résultats de Google, et dans l’aperçu qui apparaît quand on colle l’adresse de cette page dans Messenger, Facebook ou un courriel. Les modifier ne change rien au contenu visible du site.',
  fields: [
    defineField({
      name: 'title',
      title: 'Titre',
      type: 'string',
      description:
        'La ligne bleue cliquable dans les résultats de Google, et le nom de l’onglet du navigateur. Écrire de quoi parle la page, en quelques mots. Le nom de la paroisse est ajouté tout seul à la fin : inutile de le répéter ici. Exemple : « Horaires et célébrations ».',
      validation: (rule) => [
        rule
          .required()
          .error('Titre obligatoire : sans lui, Google choisit lui-même quoi afficher.'),
        rule
          .max(60)
          .warning(
            'Passé 60 caractères, Google coupe la fin et remplace par « … ». Raccourcir si possible.',
          ),
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description:
        'Les deux lignes grises affichées sous le titre dans Google. Elles s’adressent à quelqu’un qui ne connaît pas encore la paroisse et qui hésite entre plusieurs résultats : lui dire ce qu’il trouvera ici. Une ou deux phrases complètes. Ce n’est pas le texte d’introduction de la page — celui-là s’adresse à quelqu’un déjà arrivé.',
      validation: (rule) => [
        rule
          .required()
          .error(
            'Description obligatoire : sans elle, Google choisit lui-même un extrait de la page.',
          ),
        rule.min(50).warning('Moins de 50 caractères, c’est trop court pour renseigner quelqu’un.'),
        rule
          .max(160)
          .warning('Passé 160 caractères, Google coupe la fin. Garder l’essentiel au début.'),
      ],
    }),
    defineField({
      name: 'image',
      title: 'Image de partage',
      type: 'eventImage',
      description:
        'L’image qui apparaît quand quelqu’un colle l’adresse de cette page dans Messenger, Facebook ou un courriel. Facultative : sans elle, c’est l’image générale du site (fiche « Coordonnées de la paroisse ») qui sert. Une image large fonctionne mieux qu’une image haute — idéalement 1200 pixels sur 630.',
    }),
  ],
})
