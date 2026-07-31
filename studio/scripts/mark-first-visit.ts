/**
 * Pose ou retire un marqueur temporaire dans le surtitre de la page Première
 * visite, pour prouver que la page rendue lit bien Sanity et non le repli local.
 *
 * Le contenu migré est identique au repli : sans marqueur, un HTML correct ne
 * prouverait rien. Voir la même méthode aux migrations précédentes.
 *
 *   pnpm exec sanity exec scripts/mark-first-visit.ts --with-user-token
 *
 * La valeur écrite se règle par `FIRST_VISIT_EYEBROW`; sans elle, le surtitre
 * réel est rétabli.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

const value = process.env.FIRST_VISIT_EYEBROW || 'Bienvenue'

// Pas d'`await` de premier niveau : `sanity exec` compile en CJS, qui ne le
// supporte pas.
async function main() {
  await client.patch('firstVisitPage').set({'hero.eyebrow': value}).commit()
  console.log(`hero.eyebrow = ${value}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
