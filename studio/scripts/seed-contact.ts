/**
 * Saisie initiale de la page Contact.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-contact.ts --with-user-token
 *
 * Le script vit ici et non dans `scripts/` à la racine : `sanity exec` résout
 * ses dépendances depuis le dossier du Studio. Il compile en CJS, donc pas de
 * `await` au premier niveau — d'où le `main()`.
 *
 * `createOrReplace` sur un identifiant fixe le rend rejouable, mais il écrase ce
 * qui s'y trouve : ne pas le relancer une fois que la paroisse a commencé à
 * éditer. L'identifiant ne contient pas de point — un point placerait le
 * document dans un chemin privé, invisible au build public.
 *
 * Aucune coordonnée n'est écrite ici. L'adresse, le téléphone, le courriel, les
 * heures du secrétariat, le stationnement et l'accessibilité sont dans
 * « Coordonnées de la paroisse ».
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const REASONS = [
  ['Question générale', 'general'],
  ['Horaire', 'schedule'],
  ['Baptême', 'baptism'],
  ['Mariage', 'marriage'],
  ['Location de salle', 'room-rental'],
  ['Friperie', 'thrift-store'],
  ['Événement', 'event'],
  ['Vie paroissiale', 'parish-life'],
  ['Autre', 'other'],
]

async function main() {
  await client.createOrReplace({
    _id: 'contactPage',
    _type: 'contactPage',
    hero: {
      eyebrow: 'Communication',
      title: 'Nous joindre',
      introduction:
        'Nous souhaitons répondre à vos questions avec attention. Retrouvez l’église, ses heures d’ouverture et préparez votre message.',
    },
    officeHours: {
      title: 'Heures du secrétariat',
      note: 'Ces heures sont celles du secrétariat, pas celles des célébrations. Consultez la page Horaires pour les messes.',
    },
    methodsFallback: {
      title: 'Autres coordonnées en cours de validation',
      description:
        'Le courriel du secrétariat sera affiché ici après sa confirmation par la paroisse.',
    },
    location: {
      title: 'Nous trouver',
      description:
        'L’église est située à Montréal, dans le quartier Saint-Michel. Deux entrées principales donnent sur la rue Denis-Papin et sur la rue Parc René-Goupil.',
      extraNotes: [],
    },
    form: {
      title: 'Préparer votre message',
      introduction:
        'Vous pouvez remplir les champs pour vérifier votre demande. Aucun renseignement n’est transmis tant que le système d’envoi sécurisé n’est pas activé.',
      reasons: REASONS.map(([label, value]) => ({
        _type: 'contactReason',
        _key: value,
        label,
        value: {_type: 'slug', current: value},
      })),
      unavailableNotice:
        'Envoi en ligne non activé. Ce formulaire vérifie seulement les champs dans votre navigateur; aucun message ni renseignement n’est transmis.',
      validationButtonLabel: 'Vérifier le message',
      locallyValidNotice:
        'Les champs sont valides, mais l’envoi en ligne n’est pas encore activé. Aucun message n’a été transmis.',
      privacyNotice:
        'Les renseignements transmis seront utilisés uniquement afin de répondre à votre demande. Une politique de confidentialité approuvée sera requise avant l’activation de l’envoi.',
    },
  })

  console.log('Page Contact écrite dans Sanity.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
