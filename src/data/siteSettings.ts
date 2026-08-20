import type { PublicContactDetails } from '@/types/siteSettings';

export const siteSettingsData = {
  organizationName: 'Paroisse Saint-René-Goupil',
  address: {
    street: '4251 Rue Parc René-Goupil',
    city: 'Montréal',
    province: 'Québec',
    postalCode: 'H1Z 1X8',
    country: 'Canada',
    formatted: '4251 Rue Parc René-Goupil, Montréal, Québec H1Z 1X8',
  },
  phone: {
    display: '514 722-1161',
    international: '+1 514 722-1161',
    e164: '+15147221161',
  },
  /**
   * Le courriel du secrétariat n'est pas affiché publiquement.
   *
   * Décision du 20 août 2026 : le formulaire de la page Contact est le canal
   * écrit de la paroisse. Une adresse en clair dans une page est moissonnée par
   * les robots à pourriel, et arriverait dans la même boîte que celle que le
   * formulaire protège — celle que la secrétaire relève depuis chez elle.
   *
   * L'adresse existe, elle est confirmée, et elle vit dans les variables
   * d'environnement de la Function comme destinataire du formulaire. Jamais
   * dans une page.
   */
  email: {
    display: '',
    href: '',
    confirmed: false,
  },
  directionsUrl:
    'https://www.google.com/maps/dir/?api=1&destination=45.57847023192667%2C-73.61179654539147',
  map: {
    latitude: 45.57847023192667,
    longitude: -73.61179654539147,
    embedUrl:
      'https://www.openstreetmap.org/export/embed.html?bbox=-73.6177965%2C45.5744702%2C-73.6057965%2C45.5824702&layer=mapnik&marker=45.5784702%2C-73.6117965',
    title: 'Carte indiquant l’emplacement de la Paroisse Saint-René-Goupil',
  },
  // Relevé le 29 juillet 2026 sur le site actuel de la paroisse.
  officeHoursLabel:
    'Mardi et jeudi de 9 h à 14 h 30 (appels), mercredi de 9 h à 16 h (bureau ouvert)',
  // Confirmés par la paroisse le 31 juillet 2026.
  parkingLabel:
    'L’église n’a pas de stationnement réservé aux visiteurs. Le stationnement se fait dans les rues avoisinantes : rue Denis-Papin, rue Parc René-Goupil et 25e Avenue. La disponibilité varie selon le jour et l’heure.',
  // Ne dit que ce qui est confirmé : la rampe extérieure. L’accessibilité de
  // l’intérieur n’a pas été vérifiée, et l’annoncer ferait déplacer quelqu’un
  // pour rien.
  accessibilityLabel:
    'Une rampe d’accès donne sur la rue Parc René-Goupil. Pour un besoin particulier, communiquez avec le secrétariat avant votre visite.',
} as const satisfies PublicContactDetails;
