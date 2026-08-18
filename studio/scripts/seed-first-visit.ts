/**
 * Saisie initiale de la page Première visite.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-first-visit.ts --with-user-token
 *
 * Le script vit ici et non dans `scripts/` à la racine : `sanity exec` résout
 * ses dépendances depuis le dossier du Studio.
 *
 * Il téléverse le repère visuel puis écrit le document. `createOrReplace` sur un
 * identifiant fixe le rend rejouable — mais il écrase ce qui s'y trouve, donc
 * il ne doit pas être relancé une fois que la paroisse a commencé à éditer.
 *
 * Le crédit photographique attend le nom de la photographe : la note de droits
 * le dit explicitement, comme pour les quatre photographies de la vie
 * paroissiale.
 */
import {getCliClient} from 'sanity/cli'
import {createReadStream} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const client = getCliClient({apiVersion: '2024-10-01'})

const HERE = dirname(fileURLToPath(import.meta.url))
const IMAGE_PATH = join(
  HERE,
  '../../src/assets/images/paroisse/eglise-exterieur-accessibilite-01.webp',
)

async function uploadVisual() {
  const asset = await client.assets.upload('image', createReadStream(IMAGE_PATH), {
    filename: 'eglise-exterieur-accessibilite-01.webp',
  })

  return {
    _type: 'eventImage',
    image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
    alt: 'Vue extérieure de l’église, de la pelouse et d’une longue allée bordée de garde-corps',
    credit: '',
    rightsNote:
      'Photographie prise par la mère de l’administratrice du site, avec son autorisation. Le crédit reste à compléter avec son nom.',
    containsRecognizablePeople: false,
    generatedByAi: false,
  }
}

async function main() {
  const visual = await uploadVisual()

  await client.createOrReplace({
    _id: 'firstVisitPage',
    _type: 'firstVisitPage',
    seo: {
      title: 'Première visite',
      description:
        'Préparez votre première visite à la Paroisse Saint-René-Goupil et découvrez à quoi vous attendre lors de votre venue.',
    },
    hero: {
      eyebrow: 'Bienvenue',
      title: 'Votre première visite',
      introduction:
        'Tout ce qu’il faut savoir pour préparer votre première venue à la Paroisse Saint-René-Goupil. Vous pouvez venir comme vous êtes et participer à votre rythme.',
    },
    preparation: {
      eyebrow: 'Guide pratique',
      title: 'Avant votre visite',
      introduction:
        'Quelques repères simples peuvent vous aider à découvrir les lieux plus sereinement.',
      steps: [
        {
          _key: 'verifier-horaire',
          _type: 'visitStep',
          numberLabel: '01',
          title: 'Vérifier l’horaire',
          description:
            'Consultez la page Horaires avant votre déplacement, particulièrement lors des fêtes et des célébrations spéciales.',
        },
        {
          _key: 'preparer-arrivee',
          _type: 'visitStep',
          numberLabel: '02',
          title: 'Préparer son arrivée',
          description:
            'L’adresse exacte, les indications d’entrée et les repères utiles seront publiés après leur confirmation par la paroisse.',
          note: '[ADRESSE À CONFIRMER]',
        },
        {
          _key: 'stationnement-transport',
          _type: 'visitStep',
          numberLabel: '03',
          title: 'Stationnement et transport',
          description:
            'Communiquez avec le secrétariat si vous souhaitez vérifier les options disponibles avant votre venue.',
          note: '[INFORMATION DE STATIONNEMENT À CONFIRMER]',
        },
        {
          _key: 'entree-accessibilite',
          _type: 'visitStep',
          numberLabel: '04',
          title: 'Entrée et accessibilité',
          description:
            'Les accès, les installations et les possibilités d’accompagnement doivent encore être confirmés.',
          note: '[INFORMATION D’ACCESSIBILITÉ À CONFIRMER]',
        },
        {
          _key: 'prendre-place',
          _type: 'visitStep',
          numberLabel: '05',
          title: 'Prendre place librement',
          description:
            'Sauf indication donnée sur place, vous pouvez choisir une place disponible et vous installer calmement.',
        },
        {
          _key: 'participer-rythme',
          _type: 'visitStep',
          numberLabel: '06',
          title: 'Participer à son rythme',
          description:
            'Il n’est pas nécessaire de connaître les chants ou les prières. Vous pouvez écouter, observer et participer selon votre aisance.',
        },
      ],
    },
    expectations: {
      eyebrow: 'La célébration',
      title: 'À quoi s’attendre pendant une messe',
      introduction:
        'Le déroulement peut varier, mais une célébration comprend généralement quelques grands moments.',
      items: [
        {
          _key: 'accueil',
          _type: 'expectationItem',
          title: 'Accueil et ouverture',
          description:
            'La communauté se rassemble et la célébration commence. Vous pouvez simplement suivre les indications données sur place.',
        },
        {
          _key: 'parole',
          _type: 'expectationItem',
          title: 'Liturgie de la Parole',
          description:
            'Des textes bibliques sont proclamés, puis une homélie propose un éclairage pour la vie d’aujourd’hui.',
        },
        {
          _key: 'eucharistie',
          _type: 'expectationItem',
          title: 'Liturgie eucharistique',
          description:
            'La célébration se poursuit autour de l’autel. Les personnes qui ne communient pas peuvent rester à leur place ou suivre les indications données sur place.',
        },
        {
          _key: 'envoi',
          _type: 'expectationItem',
          title: 'Envoi',
          description:
            'Une prière et une bénédiction concluent la célébration avant le départ de l’assemblée.',
        },
      ],
    },
    practicalInformation: {
      eyebrow: 'Nous trouver',
      title: 'Informations pratiques',
      items: [
        {_key: 'adresse', _type: 'practicalInfoItem', label: 'Adresse', source: 'address'},
        {
          _key: 'stationnement',
          _type: 'practicalInfoItem',
          label: 'Stationnement',
          source: 'parking',
        },
        {_key: 'entree', _type: 'practicalInfoItem', label: 'Entrée', source: 'pageText'},
        {
          _key: 'accessibilite',
          _type: 'practicalInfoItem',
          label: 'Accessibilité',
          source: 'accessibility',
        },
        {_key: 'telephone', _type: 'practicalInfoItem', label: 'Téléphone', source: 'phone'},
        {
          _key: 'horaires',
          _type: 'practicalInfoItem',
          label: 'Horaires',
          source: 'internalLink',
          linkLabel: 'Consulter la page Horaires',
          linkTarget: 'schedule',
        },
      ],
      primaryCtaLabel: 'Voir les horaires',
      primaryCtaTarget: 'schedule',
      secondaryCtaLabel: 'Nous joindre',
      secondaryCtaTarget: 'contact',
      image: visual,
      imageCaption:
        'Repère visuel extérieur; l’entrée et les conditions d’accessibilité restent à confirmer.',
    },
    faq: {
      title: 'Questions fréquentes',
      items: [
        {
          _key: 'venir-sans-etre-catholique',
          _type: 'firstVisitFaqItem',
          question: 'Puis-je venir même si je ne suis pas catholique?',
          answer:
            'Oui. Vous pouvez entrer, vous asseoir, écouter et découvrir la célébration sans devoir connaître les prières ou les chants.',
        },
        {
          _key: 'arrivee',
          _type: 'firstVisitFaqItem',
          question: 'À quel moment dois-je arriver?',
          answer:
            'Vous pouvez arriver un peu avant le début afin de prendre place calmement. Vérifiez toujours l’heure sur la page Horaires avant votre déplacement.',
        },
        {
          _key: 'tenue',
          _type: 'firstVisitFaqItem',
          question: 'Comment dois-je m’habiller?',
          answer:
            'Aucune tenue particulière n’est exigée. Une tenue simple et respectueuse convient. Vous pouvez aussi mettre votre téléphone en mode silencieux pendant la célébration.',
        },
        {
          _key: 'familles',
          _type: 'firstVisitFaqItem',
          question: 'Puis-je venir avec des enfants?',
          answer:
            'Les enfants peuvent accompagner leurs parents. Les éventuels services ou espaces destinés aux familles seront précisés après confirmation par la paroisse.',
        },
        {
          _key: 'communion',
          _type: 'firstVisitFaqItem',
          question: 'Que faire au moment de la communion?',
          answer:
            'Si vous ne communiez pas, vous pouvez rester à votre place ou suivre les indications données sur place.',
        },
        {
          _key: 'horaire',
          _type: 'firstVisitFaqItem',
          question: 'Où puis-je confirmer l’horaire?',
          answer:
            'Consultez la page Horaires et, lors d’une célébration spéciale, communiquez avec le secrétariat si une confirmation supplémentaire est nécessaire.',
        },
        {
          _key: 'accessibilite',
          _type: 'firstVisitFaqItem',
          question: 'Le bâtiment est-il accessible?',
          answer:
            'Les informations précises sur les accès et les installations ne sont pas encore confirmées. Communiquez avec le secrétariat avant votre visite pour vérifier votre besoin particulier.',
        },
      ],
    },
  })

  console.log('firstVisitPage écrit, image téléversée.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
