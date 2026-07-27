import type { ContactPageData } from '@/types/contact';
import { SITE_ADDRESS, SITE_PHONE } from '@/lib/site';

export const contactPageData: ContactPageData = {
  seo: {
    title: 'Contact',
    description:
      'Consultez la page Contact de la Paroisse Saint-René-Goupil et préparez votre demande au secrétariat.',
    noIndex: true,
  },
  hero: {
    eyebrow: 'Communication',
    title: 'Nous joindre',
    introduction:
      'Nous souhaitons répondre à vos questions avec attention. Retrouvez l’église et préparez votre message; les autres coordonnées publiques sont encore en cours de validation.',
  },
  methods: [
    {
      id: 'address',
      kind: 'address',
      label: 'Adresse',
      value: SITE_ADDRESS.formatted,
      href: '#nous-trouver',
      note: 'Emplacement confirmé par la paroisse.',
      active: true,
      order: 1,
      status: 'confirmed',
    },
    {
      id: 'phone',
      kind: 'phone',
      label: 'Téléphone',
      value: SITE_PHONE.display,
      href: SITE_PHONE.href,
      note: 'Touchez le numéro pour appeler.',
      active: true,
      order: 2,
      status: 'confirmed',
    },
  ],
  methodsFallback: {
    title: 'Autres coordonnées en cours de validation',
    description:
      'Le courriel et les heures du secrétariat seront affichés ici après leur confirmation par la paroisse.',
  },
  location: {
    title: 'Nous trouver',
    description:
      'L’église est située à Montréal. Les renseignements détaillés sur le stationnement et l’accessibilité restent à confirmer.',
    address: SITE_ADDRESS.formatted,
    mapEmbedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=-73.6177965%2C45.5744702%2C-73.6057965%2C45.5824702&layer=mapnik&marker=45.5784702%2C-73.6117965',
    mapTitle: 'Carte indiquant l’emplacement de la Paroisse Saint-René-Goupil',
    directionsCta: {
      label: 'Obtenir l’itinéraire',
      href: 'https://www.google.com/maps/dir/?api=1&destination=45.57847023192667%2C-73.61179654539147',
    },
    accessNotes: [],
    status: 'confirmed',
  },
  form: {
    title: 'Préparer votre message',
    introduction:
      'Vous pouvez remplir les champs pour vérifier votre demande. Aucun renseignement n’est transmis tant que le système d’envoi sécurisé n’est pas activé.',
    fields: [
      {
        name: 'reason',
        label: 'Motif de contact',
        type: 'select',
        required: true,
        placeholder: 'Choisissez un motif',
        requiredMessage: 'Veuillez choisir un motif de contact.',
        options: [
          { label: 'Question générale', value: 'general' },
          { label: 'Horaire', value: 'schedule' },
          { label: 'Baptême', value: 'baptism' },
          { label: 'Mariage', value: 'marriage' },
          { label: 'Location de salle', value: 'room-rental' },
          { label: 'Friperie', value: 'thrift-store' },
          { label: 'Événement', value: 'event' },
          { label: 'Vie paroissiale', value: 'parish-life' },
          { label: 'Autre', value: 'other' },
        ],
      },
      {
        name: 'fullName',
        label: 'Nom complet',
        type: 'text',
        required: true,
        autocomplete: 'name',
        placeholder: 'Votre nom et prénom',
        minLength: 2,
        maxLength: 120,
        requiredMessage: 'Veuillez entrer votre nom.',
        invalidMessage: 'Veuillez entrer un nom de 2 à 120 caractères.',
      },
      {
        name: 'email',
        label: 'Courriel',
        type: 'email',
        required: true,
        autocomplete: 'email',
        placeholder: 'votre@courriel.com',
        maxLength: 254,
        requiredMessage: 'Veuillez entrer votre courriel.',
        invalidMessage: 'Veuillez entrer une adresse courriel valide.',
      },
      {
        name: 'phone',
        label: 'Téléphone',
        type: 'tel',
        required: false,
        autocomplete: 'tel',
        placeholder: 'Votre numéro de téléphone',
        maxLength: 30,
        pattern: '(?:[0-9+.]|\\s|\\(|\\)|-){7,30}',
        invalidMessage:
          'Utilisez uniquement des chiffres, espaces, parenthèses, tirets ou le signe plus.',
      },
      {
        name: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        placeholder: 'Décrivez brièvement votre demande.',
        rows: 6,
        minLength: 20,
        maxLength: 2000,
        requiredMessage: 'Veuillez écrire votre message.',
        description: 'Entre 20 et 2 000 caractères.',
      },
      {
        name: 'privacyConsent',
        label:
          'J’accepte que les renseignements fournis soient utilisés uniquement afin de répondre à ma demande.',
        type: 'checkbox',
        required: true,
        requiredMessage:
          'Vous devez accepter l’utilisation de vos renseignements pour poursuivre.',
      },
    ],
    unavailableNotice:
      'Envoi en ligne non activé. Ce formulaire vérifie seulement les champs dans votre navigateur; aucun message ni renseignement n’est transmis.',
    validationButtonLabel: 'Vérifier le message',
    locallyValidNotice:
      'Les champs sont valides, mais l’envoi en ligne n’est pas encore activé. Aucun message n’a été transmis.',
    privacyNotice:
      'Les renseignements transmis seront utilisés uniquement afin de répondre à votre demande. Une politique de confidentialité approuvée sera requise avant l’activation de l’envoi.',
    privacyPolicyHref: '/politique-de-confidentialite/',
  },
};
