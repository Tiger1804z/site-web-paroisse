/**
 * Saisie des heures du secrétariat dans Sanity.
 *
 *   pnpm exec sanity exec scripts/fill-office-hours.ts --with-user-token
 *
 * La valeur vivait seulement dans le repli `src/data/siteSettings.ts`, relevée
 * le 29 juillet 2026 sur l'ancien site de la paroisse. Le site l'affichait, mais
 * le champ paraissait vide dans le Studio — une saisie l'aurait écrasée sans
 * avertissement.
 *
 * Elle reste **non confirmée par la paroisse** : elle vient de l'ancien site,
 * pas d'une vérification auprès du secrétariat.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const OFFICE_HOURS =
  'Mardi et jeudi de 9 h à 14 h 30 (appels), mercredi de 9 h à 16 h (bureau ouvert)'

async function main() {
  await client.patch('siteSettings').set({officeHours: OFFICE_HOURS}).commit()
  console.log(`officeHours = ${OFFICE_HOURS}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
