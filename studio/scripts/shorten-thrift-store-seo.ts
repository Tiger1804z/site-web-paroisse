/**
 * Raccourcit la description de référencement de `/friperie`.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/shorten-thrift-store-seo.ts --with-user-token
 *
 * `seed-seo.ts` a repris le texte du site mot pour mot : 165 caractères, au-delà
 * de la limite de 160 posée dans le schéma. L'éditrice aurait vu un
 * avertissement jaune sur cette seule page, sans rien avoir fait.
 *
 * Un mot retiré — « petits » — et le sens est intact. Le repli local
 * (`src/data/thriftStore.ts`) porte exactement la même phrase : les deux
 * origines doivent dire la même chose.
 *
 * `set` guardé par une lecture : le script refuse d'écraser un texte que la
 * paroisse aurait réécrit entre-temps.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const PARISH = 'Paroisse Saint-René-Goupil'

const PREVIOUS = `La friperie Au Coin de l’Entraide, au sous-sol de la ${PARISH} : vêtements et petits articles pour la maison, dans le respect et la confidentialité.`

const NEXT = `La friperie Au Coin de l’Entraide, au sous-sol de la ${PARISH} : vêtements et articles pour la maison, dans le respect et la confidentialité.`

async function main() {
  const current: string | null = await client.fetch(
    "*[_id == 'thriftStorePage'][0].seo.description",
  )

  if (current === NEXT) {
    console.log('Description déjà raccourcie — rien à faire.')
    return
  }

  if (current !== PREVIOUS) {
    throw new Error(
      'La description de `thriftStorePage` n’est plus celle posée par seed-seo.ts. ' +
        'Arrêt : elle a été réécrite depuis, la raccourcir à la main dans le Studio.',
    )
  }

  await client.patch('thriftStorePage').set({'seo.description': NEXT}).commit()

  console.log(`Description raccourcie : ${PREVIOUS.length} → ${NEXT.length} caractères.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
