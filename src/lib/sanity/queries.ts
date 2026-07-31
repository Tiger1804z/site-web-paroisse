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

/** Contenu propre à la page `/evenements` : ni activités datées, ni réglages d’accueil. */
export const EVENTS_PAGE_QUERY = defineQuery(`
  *[_type == "eventsPage"][0]{
    hero {
      eyebrow,
      title,
      introduction
    },
    overview {
      eyebrow,
      title,
      introduction,
      confirmationNote
    },
    categories[]{
      _key,
      title,
      summary,
      kind,
      visualKind,
      illustrationLabel,
      ctaTarget,
      ctaLabel,
      featured,
      active,
      confirmationRequired,
      image {
        alt,
        credit,
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
      }
    },
    upcomingSectionTitle,
    showUpcomingSection,
    upcomingLimit,
    pastSectionTitle,
    showPastSection,
    pastLimit
  }
`);

/** Réglages propres à la page d’accueil. */
export const HOME_PAGE_QUERY = defineQuery(`
  *[_type == "homePage"][0]{
    upcomingEventsTitle,
    showUpcomingEvents,
    upcomingEventsLimit
  }
`);

/**
 * La friperie — donnée partagée, vraie indépendamment de sa page.
 *
 * Son téléphone est une ligne distincte de celle du secrétariat : il ne se lit
 * surtout pas dans `siteSettings`.
 */
export const THRIFT_STORE_QUERY = defineQuery(`
  *[_type == "thriftStore"][0]{
    name,
    hours,
    location,
    phone
  }
`);

/** Contenu propre à la page `/friperie` : ni heures, ni emplacement, ni téléphone. */
export const THRIFT_STORE_PAGE_QUERY = defineQuery(`
  *[_type == "thriftStorePage"][0]{
    hero {
      eyebrow,
      title,
      introduction
    },
    introduction {
      eyebrow,
      title,
      paragraphs,
      priceNotice,
      contactCta {
        target,
        label
      }
    },
    sections[]{
      _key,
      eyebrow,
      title,
      description,
      visualKind,
      active
    },
    gallery {
      eyebrow,
      title,
      introduction
    },
    closing {
      eyebrow,
      title,
      description,
      primaryCta {
        target,
        label
      },
      secondaryCta {
        target,
        label
      }
    }
  }
`);

/**
 * Contenu propre à la page `/nos-services`.
 *
 * Les ancres sont projetées depuis `slug.current` : ce sont des fragments
 * d'adresse publique, saisis explicitement plutôt que dérivés de `_key`, qu'une
 * réorganisation du tableau pourrait faire bouger.
 *
 * Ni téléphone ni bouton : tous les services renvoient au secrétariat, dont le
 * numéro vient de `siteSettings`.
 */
export const SERVICES_PAGE_QUERY = defineQuery(`
  *[_type == "servicesPage"][0]{
    hero {
      eyebrow,
      title,
      introduction
    },
    notice {
      title,
      message,
      reviewDate
    },
    chapters[]{
      "slug": slug.current,
      eyebrow,
      title,
      introduction,
      surface,
      services[]{
        "slug": slug.current,
        title,
        summary,
        active,
        details[]{
          _key,
          label,
          value
        },
        steps,
        note
      }
    },
    paymentMethods {
      title,
      description,
      methods
    },
    finalCta {
      title,
      description
    }
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
