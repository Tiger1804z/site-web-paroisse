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

/**
 * La projection des entrées est répétée (horaire régulier + saisonniers) plutôt
 * qu'interpolée : Sanity TypeGen analyse la requête statiquement et ne résout
 * pas les fragments construits à l'exécution.
 *
 * `_key` est l'identifiant stable des éléments de tableau — il alimente le champ
 * `id` du contrat frontend, aucun identifiant n'est saisi par l'éditrice.
 */
export const SCHEDULE_PAGE_QUERY = defineQuery(`
  *[_type == "schedulePage"][0]{
    hero {
      eyebrow,
      title,
      introduction,
      imageAlt
    },
    regularSchedule {
      title,
      description,
      validFrom,
      validUntil,
      active,
      order,
      entries[]{
        _key,
        recurrenceType,
        weekday,
        displayLabel,
        time,
        title,
        note,
        active,
        order
      }
    },
    seasonalSchedules[]{
      _key,
      title,
      description,
      validFrom,
      validUntil,
      active,
      order,
      entries[]{
        _key,
        recurrenceType,
        weekday,
        displayLabel,
        time,
        title,
        note,
        active,
        order
      }
    },
    lastReviewedAt
  }
`);
