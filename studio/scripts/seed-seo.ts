/**
 * Pose le bloc « Apparence sur Google et dans les partages » sur les dix pages
 * indexables.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/seed-seo.ts --with-user-token
 *
 * Les valeurs sont exactement celles que le site publiait déjà : titres et
 * descriptions repris mot pour mot de `src/data/*.ts`, et — pour l'accueil et
 * les horaires — des chaînes écrites en dur dans les fichiers `.astro`. Ce
 * script déplace du texte existant, il n'en écrit aucun. La réécriture
 * éditoriale, si elle a lieu, se fera dans le Studio.
 *
 * L'onglet doit être rempli dès la première ouverture : un champ obligatoire
 * vide accueillerait l'éditrice par une erreur rouge sur dix pages, sans
 * qu'elle ait rien fait.
 *
 * `setIfMissing` : rejouable, et sans effet sur `firstVisitPage`, seule page
 * qui avait déjà son bloc.
 *
 * Aucune image de partage n'est posée : il n'en existe pas encore.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const PARISH = 'Paroisse Saint-René-Goupil'

type PageSeo = {id: string; title: string; description: string}

const PAGES: PageSeo[] = [
  {
    id: 'homePage',
    title: 'Accueil',
    description: `Découvrez les célébrations, les activités et la vie communautaire de la ${PARISH}.`,
  },
  {
    id: 'schedulePage',
    title: 'Horaires et célébrations',
    description: `Consultez les horaires des messes et les changements liés aux célébrations spéciales de la ${PARISH}.`,
  },
  {
    id: 'eventsPage',
    title: 'Événements',
    description: `Découvrez un premier aperçu des célébrations, initiatives d’entraide et rencontres de la ${PARISH}.`,
  },
  {
    id: 'thriftStorePage',
    title: 'Friperie Au Coin de l’Entraide',
    description: `La friperie Au Coin de l’Entraide, au sous-sol de la ${PARISH} : vêtements et petits articles pour la maison, dans le respect et la confidentialité.`,
  },
  {
    id: 'servicesPage',
    title: 'Nos services',
    description: `Découvrez les sacrements, les démarches, les services de prière et la location de salle proposés par la ${PARISH}.`,
  },
  {
    id: 'parishLifePage',
    title: 'Vie paroissiale',
    description: `Découvrez les façons de participer à la vie de la ${PARISH}, ses événements, ses célébrations et ses initiatives d’entraide.`,
  },
  {
    id: 'advertisersPage',
    title: 'Nos annonceurs',
    description: `Découvrez comment les contributions publicitaires peuvent soutenir les communications et la mission de la ${PARISH}.`,
  },
  {
    id: 'contactPage',
    title: 'Contact',
    description: `Consultez la page Contact de la ${PARISH} et préparez votre demande au secrétariat.`,
  },
  {
    id: 'aboutPage',
    title: 'Notre paroisse',
    description: `Découvrez l’histoire, l’architecture et la vie communautaire de la ${PARISH}.`,
  },
  {
    id: 'firstVisitPage',
    title: 'Première visite',
    description: `Préparez votre première visite à la ${PARISH} et découvrez à quoi vous attendre lors de votre venue.`,
  },
]

async function main() {
  // Un brouillon non publié porterait son propre bloc : le Studio afficherait
  // alors une page sans référencement alors que le publié en a un. On refuse
  // plutôt que de patcher à l'aveugle.
  const draftIds = PAGES.map((page) => `drafts.${page.id}`)
  const drafts: {_id: string}[] = await client.fetch('*[_id in $ids]{_id}', {ids: draftIds})

  if (drafts.length > 0) {
    throw new Error(
      `Brouillons présents (${drafts.map((draft) => draft._id).join(', ')}). ` +
        'Les publier ou les supprimer avant de lancer ce script.',
    )
  }

  const transaction = client.transaction()

  for (const page of PAGES) {
    transaction.patch(page.id, (patch) =>
      patch.setIfMissing({
        seo: {_type: 'seo', title: page.title, description: page.description},
      }),
    )
  }

  await transaction.commit()

  console.log(`Bloc de référencement posé sur ${PAGES.length} pages.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
