/**
 * Retire deux restes du dataset relevés par l'audit du 31 juillet 2026.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/clean-stale-drafts.ts --with-user-token
 *
 * **1. Champs orphelins de `schedulePage`.** Le document publié porte encore
 * `regularSchedule` et `lastReviewedAt`, restes d'un modèle antérieur. Ils ne
 * sont déclarés par aucun schéma, lus par aucune requête, et dupliquent
 * l'horaire réel qui vit dans `massSchedule`. Invisibles sur le site, ils
 * rendent surtout la prochaine lecture du dataset trompeuse.
 *
 * **2. Deux brouillons périmés.** `drafts.schedulePage` ne fait que retirer ces
 * mêmes champs. `drafts.servicesPage` est une copie figée d'avant la migration
 * des images : comme la prévisualisation lit les brouillons en priorité, il
 * masquait le document publié et montrait à l'éditrice une page Nos services
 * sans aucune illustration.
 *
 * Le script vérifie avant d'agir. Si un brouillon contient autre chose que ce
 * qui est attendu, il s'arrête plutôt que de jeter un travail en cours.
 */
import {getCliClient} from 'sanity/cli'

const client = getCliClient({apiVersion: '2024-10-01'})

/** Champs qu'aucun schéma ne déclare et qu'aucune requête ne lit. */
const ORPHAN_FIELDS = ['regularSchedule', 'lastReviewedAt']

const STALE_DRAFTS = ['drafts.schedulePage', 'drafts.servicesPage']

const IGNORED_KEYS = new Set(['_id', '_rev', '_updatedAt', '_createdAt', '_system'])

/** Clés dont la valeur diffère entre deux documents. */
function changedKeys(published: Record<string, unknown>, draft: Record<string, unknown>) {
  const keys = new Set([...Object.keys(published), ...Object.keys(draft)])

  return [...keys].filter(
    (key) =>
      !IGNORED_KEYS.has(key) && JSON.stringify(published[key]) !== JSON.stringify(draft[key]),
  )
}

async function main() {
  // --- 1. Champs orphelins -------------------------------------------------
  const schedulePage = await client.getDocument('schedulePage')
  if (!schedulePage) throw new Error('Document schedulePage introuvable.')

  const orphansPresent = ORPHAN_FIELDS.filter((field) => field in schedulePage)

  if (orphansPresent.length > 0) {
    console.log(`schedulePage — retrait de : ${orphansPresent.join(', ')}`)
    await client.patch('schedulePage').unset(orphansPresent).commit()
  } else {
    console.log('schedulePage — aucun champ orphelin, rien à faire.')
  }

  // --- 2. Brouillons périmés ----------------------------------------------
  for (const draftId of STALE_DRAFTS) {
    const draft = await client.getDocument(draftId)
    if (!draft) {
      console.log(`${draftId} — absent, rien à faire.`)
      continue
    }

    const publishedId = draftId.replace('drafts.', '')
    const published = await client.getDocument(publishedId)
    if (!published) throw new Error(`${publishedId} introuvable.`)

    const differences = changedKeys(published, draft)
    const expected = new Set(publishedId === 'schedulePage' ? ORPHAN_FIELDS : ['hero', 'chapters'])
    const unexpected = differences.filter((key) => !expected.has(key))

    if (unexpected.length > 0) {
      throw new Error(
        `${draftId} contient des modifications inattendues (${unexpected.join(', ')}). ` +
          'Arrêt : ce brouillon porte peut-être un travail en cours. Le vérifier dans le Studio.',
      )
    }

    console.log(
      `${draftId} — suppression (écarts : ${differences.length > 0 ? differences.join(', ') : 'aucun'}).`,
    )
    await client.delete(draftId)
  }

  console.log('Nettoyage terminé.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
