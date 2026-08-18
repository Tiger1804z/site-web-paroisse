import {defineType, defineField} from 'sanity'
import {CogIcon} from '@sanity/icons/Cog'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Coordonnées de la paroisse',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'organizationName',
      title: 'Nom officiel',
      type: 'string',
      description: 'Nom complet et officiel de la paroisse. Ex. : Paroisse Saint-René-Goupil.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'shortName',
      title: 'Nom court',
      type: 'string',
      description:
        'Version abrégée pour les espaces restreints (facultatif). Ex. : Saint-René-Goupil.',
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'object',
      options: {collapsible: true, collapsed: false},
      fields: [
        defineField({
          name: 'street',
          title: 'Rue',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'city',
          title: 'Ville',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'province',
          title: 'Province',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'postalCode',
          title: 'Code postal',
          type: 'string',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'country',
          title: 'Pays',
          type: 'string',
          initialValue: 'Canada',
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({
      name: 'phone',
      title: 'Téléphone',
      type: 'string',
      description:
        'Numéro principal tel qu’affiché. Ex. : 514 722-1161. Les formats techniques (tel:, international) sont dérivés automatiquement.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value) return true // le cas vide est déjà couvert par required()
          const digits = value.replace(/\D/g, '')
          return digits.length === 10
            ? true
            : 'Le numéro doit contenir exactement 10 chiffres (format nord-américain).'
        }),
    }),
    defineField({
      name: 'publicEmail',
      title: 'Courriel public',
      type: 'string',
      description:
        'Adresse courriel affichée au public. Laisser vide tant qu’elle n’est pas confirmée.',
      validation: (rule) => rule.email().error('Saisir une adresse courriel valide.'),
    }),
    defineField({
      name: 'showPublicEmail',
      title: 'Afficher le courriel publiquement',
      type: 'boolean',
      description:
        'Rester désactivé tant que le courriel n’est pas confirmé et validé pour diffusion.',
      initialValue: false,
      hidden: ({parent}) => !parent?.publicEmail,
    }),

    defineField({
      name: 'officeHours',
      title: 'Heures du secrétariat',
      type: 'text',
      rows: 4,
      description:
        'Horaire d’ouverture du secrétariat. Laisser vide tant qu’il n’est pas confirmé.',
    }),
    defineField({
      name: 'parkingInformation',
      title: 'Stationnement',
      type: 'text',
      rows: 3,
      description:
        'Informations de stationnement. Laisser vide tant qu’elles ne sont pas confirmées.',
    }),
    defineField({
      name: 'accessibilityInformation',
      title: 'Accessibilité',
      type: 'text',
      rows: 3,
      description:
        'Informations d’accessibilité (accès, rampe, ascenseur, etc.). Laisser vide tant qu’elles ne sont pas confirmées.',
    }),
    defineField({
      name: 'shareImage',
      title: 'Image de partage par défaut',
      type: 'eventImage',
      description:
        'Image utilisée quand on partage une page qui n’a pas la sienne. Une seule image pour tout le site, corrigée à un seul endroit. Choisir une vue reconnaissable de l’église. Idéalement 1200 pixels sur 630.',
    }),

    defineField({
      name: 'lastReviewedAt',
      title: 'Dernière révision des informations',
      type: 'datetime',
      description: 'Date de la dernière vérification de ces coordonnées.',
    }),
  ],
})
