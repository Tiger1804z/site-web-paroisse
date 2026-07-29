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
    href: 'tel:+15147221161',
  },
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
} as const satisfies PublicContactDetails;
