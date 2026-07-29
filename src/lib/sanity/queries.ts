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
    showPublicEmail,
    officeHours
  }
`);

/**
 * Horaires des messes — donnée partagée entre `/horaires` et l’accueil.
 *
 * La projection des entrées est répétée (horaire régulier + saisonniers) plutôt
 * qu’interpolée : Sanity TypeGen analyse la requête statiquement et ne résout
 * pas les fragments construits à l’exécution.
 *
 * `_key` est l’identifiant stable des éléments de tableau — il alimente le champ
 * `id` du contrat frontend, aucun identifiant n’est saisi par l’éditrice.
 */
export const MASS_SCHEDULE_QUERY = defineQuery(`
  *[_type == "massSchedule"][0]{
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

/**
 * Événements — collection partagée entre `/evenements` et l’accueil.
 *
 * L’objet image est projeté entier (`image{...}`) : la librairie d’adresses a
 * besoin du point focal et du rognage, pas seulement de l’identifiant du
 * fichier. Les dimensions et la vignette floue viennent des métadonnées de
 * l’asset, pour réserver la place avant le chargement.
 */
export const PARISH_EVENTS_QUERY = defineQuery(`
  *[_type == "parishEvent"]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    description,
    category,
    startAt,
    endAt,
    locationName,
    meetingPoint,
    departureAt,
    returnAt,
    price {
      amount,
      label
    },
    capacityNotice,
    contact {
      name,
      phone,
      email,
      consentGiven
    },
    cta {
      label,
      url
    },
    coverImage {
      alt,
      credit,
      containsRecognizablePeople,
      generatedByAi,
      image {
        ...,
        asset->{
          _id,
          metadata {
            lqip,
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
      }
    },
    gallery[]{
      _key,
      alt,
      credit,
      containsRecognizablePeople,
      generatedByAi,
      image {
        ...,
        asset->{
          _id,
          metadata {
            lqip,
            dimensions {
              width,
              height,
              aspectRatio
            }
          }
        }
      }
    },
    publicationStatus,
    showOnWebsite,
    showOnHomepage,
    showInArchive,
    featured,
    homepagePriority
  }
`);

/** Contenu propre à la page `/horaires` : ni horaires, ni coordonnées. */
export const SCHEDULE_PAGE_QUERY = defineQuery(`
  *[_type == "schedulePage"][0]{
    hero {
      eyebrow,
      title,
      introduction,
      imageAlt
    },
    notice {
      title,
      message,
      severity,
      actionTarget,
      active
    },
    beforeYouVisit {
      title,
      message
    },
    sidebar {
      officeEyebrow,
      officeMessage
    },
    faq[]{
      _key,
      question,
      answer,
      active
    }
  }
`);
