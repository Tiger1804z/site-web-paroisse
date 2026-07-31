/**
 * Saisie des informations d'accès confirmées par la paroisse le 31 juillet 2026 :
 * stationnement, entrées principales et rampe d'accès.
 *
 *   pnpm exec sanity exec scripts/fill-access-info.ts --with-user-token
 *
 * Le stationnement et l'accessibilité vont dans `siteSettings` : ce sont des
 * faits sur le lieu, vrais indépendamment de la page qui les affiche. Les
 * entrées vont dans la page, faute d'un deuxième consommateur.
 *
 * Les mentions « à confirmer » des étapes 02 à 04 et de la question sur
 * l'accessibilité disparaissent en même temps : elles annonçaient précisément
 * ces informations.
 *
 * Ce que le texte ne dit PAS, faute de confirmation : que l'intérieur soit
 * accessible une fois la rampe franchie. La rampe est nommée, le reste renvoie
 * au secrétariat.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const PARKING =
  'L’église n’a pas de stationnement réservé aux visiteurs. Le stationnement se fait dans les rues avoisinantes : rue Denis-Papin, rue Parc René-Goupil et 25e Avenue. La disponibilité varie selon le jour et l’heure.'

const ACCESSIBILITY =
  'Une rampe d’accès donne sur la rue Parc René-Goupil. Pour un besoin particulier, communiquez avec le secrétariat avant votre visite.'

const ENTRANCES =
  'Deux entrées principales : l’une sur la rue Denis-Papin, l’autre sur la rue Parc René-Goupil.'

async function main() {
  await client
    .patch('siteSettings')
    .set({parkingInformation: PARKING, accessibilityInformation: ACCESSIBILITY})
    .commit()

  await client
    .patch('firstVisitPage')
    .set({
      'practicalInformation.items[_key=="entree"].value': ENTRANCES,
      // L'adresse n'est pas répétée ici : elle appartient à `siteSettings` et
      // s'affiche déjà dans les informations pratiques. La recopier créerait
      // une seconde vérité à corriger le jour d'un déménagement.
      'preparation.steps[_key=="preparer-arrivee"].description':
        'Deux entrées principales : l’une sur la rue Denis-Papin, l’autre sur la rue Parc René-Goupil. L’adresse complète est indiquée plus bas, dans les informations pratiques.',
      'preparation.steps[_key=="stationnement-transport"].description':
        'L’église n’a pas de stationnement réservé. Le stationnement se fait dans les rues avoisinantes — Denis-Papin, Parc René-Goupil et 25e Avenue — et la disponibilité varie selon le jour et l’heure.',
      'preparation.steps[_key=="entree-accessibilite"].description':
        'Une rampe d’accès donne sur la rue Parc René-Goupil. Si vous avez un besoin particulier, communiquez avec le secrétariat avant votre venue.',
      'faq.items[_key=="accessibilite"].answer':
        'Une rampe d’accès donne sur la rue Parc René-Goupil. Les détails sur les installations intérieures ne sont pas encore confirmés : communiquez avec le secrétariat avant votre visite pour vérifier votre besoin particulier.',
    })
    .unset([
      'preparation.steps[_key=="preparer-arrivee"].note',
      'preparation.steps[_key=="stationnement-transport"].note',
      'preparation.steps[_key=="entree-accessibilite"].note',
    ])
    .commit()

  console.log('Stationnement, accessibilité et entrées saisis.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
