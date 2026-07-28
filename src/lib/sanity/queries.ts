import { defineQuery } from 'groq';

export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    organizationName,
    address {
      street,
      city,
      province,
      postalCode,
      country
    },
    phone,
    publicEmail,
    showPublicEmail
  }
`);
