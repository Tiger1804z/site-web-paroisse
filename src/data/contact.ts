import type {
  ContactMethod,
  ContactOfficeHours,
  ContactPageData,
} from '@/types/contact';
import type { PublicContactDetails } from '@/types/siteSettings';

/**
 * Coordonnées affichées, dérivées de « Coordonnées de la paroisse ».
 *
 * Rien ici ne se saisit dans le document de page : une adresse ou un téléphone
 * est un fait sur la paroisse, vrai indépendamment de la page qui l'affiche, et
 * le recopier créerait une deuxième vérité à corriger en cas de déménagement.
 *
 * Le courriel n'apparaît qu'une fois confirmé et rendu public. Tant qu'il ne
 * l'est pas, il n'y a pas de carte : mieux vaut taire la ligne qu'afficher une
 * adresse que personne ne relève.
 */
export function buildContactMethods(
  siteSettings: PublicContactDetails,
): readonly ContactMethod[] {
  const methods: ContactMethod[] = [
    {
      id: 'address',
      kind: 'address',
      label: 'Adresse',
      value: siteSettings.address.formatted,
      href: '#nous-trouver',
      note: 'Emplacement confirmé par la paroisse.',
    },
    // Pas de `href` : le numéro s'affiche, il ne se compose pas d'un geste. Le
    // secrétariat reçoit ces appels à domicile, à toute heure, et la carte
    // renvoie donc aux heures d'ouverture plutôt qu'à un bouton d'appel.
    {
      id: 'phone',
      kind: 'phone',
      label: 'Téléphone',
      value: siteSettings.phone.display,
      note: 'Le secrétariat répond durant ses heures d’ouverture.',
    },
  ];

  const email = siteSettings.email;
  if (email?.confirmed && email.href) {
    methods.push({
      id: 'email',
      kind: 'email',
      label: 'Courriel',
      value: email.display,
      href: email.href,
    });
  }

  return methods;
}

/**
 * Bloc des heures du secrétariat.
 *
 * Absent tant que `officeHoursLabel` est vide. La valeur n'est pas recopiée ici
 * : elle sert aussi Horaires et Première visite.
 */
export function buildContactOfficeHours(
  siteSettings: PublicContactDetails,
  title: string,
  note?: string,
): ContactOfficeHours | undefined {
  const schedule = siteSettings.officeHoursLabel?.trim();
  if (!schedule) return undefined;

  return { title, schedule: [schedule], ...(note ? { note } : {}) };
}

/**
 * Notes d'accès : les faits partagés d'abord, les précisions de la page ensuite.
 *
 * Le stationnement et l'accessibilité décrivent le lieu, pas la page. Une valeur
 * absente ne laisse pas de trou — la ligne n'existe simplement pas.
 */
export function buildContactAccessNotes(
  siteSettings: PublicContactDetails,
  extraNotes: readonly string[] = [],
): readonly string[] {
  return [
    siteSettings.parkingLabel,
    siteSettings.accessibilityLabel,
    ...extraNotes,
  ].flatMap((note) => {
    const trimmed = note?.trim();
    return trimmed ? [trimmed] : [];
  });
}

export function buildContactPageData(
  siteSettings: PublicContactDetails,
): ContactPageData {
  return {
    seo: {
      title: 'Contact',
      description:
        'Consultez la page Contact de la Paroisse Saint-René-Goupil et préparez votre demande au secrétariat.',
    },
    hero: {
      eyebrow: 'Communication',
      title: 'Nous joindre',
      introduction:
        'Nous souhaitons répondre à vos questions avec attention. Retrouvez l’église, ses heures d’ouverture et préparez votre message.',
    },
    methods: buildContactMethods(siteSettings),
    methodsFallback: {
      title: 'Autres coordonnées en cours de validation',
      description:
        'Le courriel du secrétariat sera affiché ici après sa confirmation par la paroisse.',
    },
    officeHours: buildContactOfficeHours(
      siteSettings,
      'Heures du secrétariat',
      'Ces heures sont celles du secrétariat, pas celles des célébrations. Consultez la page Horaires pour les messes.',
    ),
    location: {
      title: 'Nous trouver',
      description:
        'L’église est située à Montréal, dans le quartier Saint-Michel. Deux entrées principales donnent sur la rue Denis-Papin et sur la rue Parc René-Goupil.',
      address: siteSettings.address.formatted,
      mapEmbedUrl: siteSettings.map.embedUrl,
      mapTitle: siteSettings.map.title,
      directionsCta: {
        label: 'Obtenir l’itinéraire',
        href: siteSettings.directionsUrl,
      },
      accessNotes: buildContactAccessNotes(siteSettings),
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
}
