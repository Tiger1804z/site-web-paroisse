/**
 * Reprise des visuels d'annonceurs publiés sur l'ancien site.
 *
 * À lancer depuis `studio/` :
 *   pnpm exec sanity exec scripts/import-advertiser-visuals.ts --with-user-token
 *
 * Les trois fichiers ont été téléchargés depuis
 * `paroissesaintrenegoupil.com/merci-à-nos-annonceurs` à leur taille d'origine
 * (`=s0` sur l'adresse Google Sites), et vérifiés à l'œil un par un avant
 * d'être nommés : personne ne doit se retrouver sur la fiche de quelqu'un
 * d'autre.
 *
 * Ce que le script écrit dans `rightsNote` est une note interne — le champ
 * n'est projeté vers aucune page. Ce qu'il n'écrit pas est aussi important :
 * `credit` reste vide. Sophie dit que ces visuels viennent des bureaux des
 * élus; tant qu'on ne sait pas quel nom la paroisse doit afficher, en inventer
 * un serait une attribution fausse, et une attribution fausse est pire que pas
 * d'attribution.
 *
 * `containsRecognizablePeople` est coché parce que c'est un fait : les trois
 * cartes portent un portrait identifiable. La case ne bloque rien et n'atteint
 * pas le site — elle sert à retrouver ces images le jour où quelqu'un demande
 * leur retrait.
 *
 * Buffet Marina ne reçoit aucune image : l'ancien site n'en publiait pas, et
 * on n'en invente pas une.
 */
import {getCliClient} from 'sanity/cli'
import {createReadStream} from 'node:fs'
import {fileURLToPath} from 'node:url'
import {dirname, join} from 'node:path'

const client = getCliClient({apiVersion: '2024-10-01'})

const HERE = dirname(fileURLToPath(import.meta.url))
const DOSSIER = join(HERE, 'visuels-annonceurs-temp')

const NOTE_DE_PROVENANCE =
  'Visuel repris de l’ancien site de la paroisse (paroissesaintrenegoupil.com). ' +
  'Selon Sophie, fourni par le bureau de l’élu. Crédit public à afficher et ' +
  'autorisation écrite restent à confirmer avec elle.'

type Visuel = {
  /** Identifiant de la fiche publiée. */
  advertiserId: string
  fichier: string
  alt: string
}

const VISUELS: Visuel[] = [
  {
    advertiserId: 'advertiser-frantz-benjamin',
    fichier: 'legacy-frantz-benjamin.jpg',
    alt:
      'Carte d’affaire de Frantz Benjamin, député de Viau : portrait, adresse du bureau, ' +
      'téléphone, courriel et logo de l’Assemblée nationale du Québec.',
  },
  {
    advertiserId: 'advertiser-josue-corvil',
    fichier: 'legacy-josue-corvil.png',
    alt:
      'Carte d’affaire de Josué Corvil, conseiller de la Ville pour le district de ' +
      'Saint-Michel : portrait, téléphone, courriel, adresse et logo de la Ville de Montréal.',
  },
  {
    advertiserId: 'advertiser-patricia-lattanzio',
    fichier: 'legacy-patricia-lattanzio.jpg',
    alt:
      'Carte d’affaire de Patricia Lattanzio, députée de Saint-Léonard–Saint-Michel : ' +
      'portrait, adresse du bureau de circonscription, téléphone, télécopieur et courriel.',
  },
]

async function main() {
  for (const visuel of VISUELS) {
    const chemin = join(DOSSIER, visuel.fichier)

    const asset = await client.assets.upload('image', createReadStream(chemin), {
      filename: visuel.fichier,
    })

    const logo = {
      _type: 'eventImage',
      image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
      alt: visuel.alt,
      rightsNote: NOTE_DE_PROVENANCE,
      containsRecognizablePeople: true,
      generatedByAi: false,
    }

    await client.patch(visuel.advertiserId).set({logo}).commit()

    /*
     * Le brouillon de Frantz Benjamin portait déjà une tentative : la même
     * carte, recadrée plus petite et sans texte alternatif. Le laisser derrière
     * ferait réapparaître cette version à la prochaine publication faite depuis
     * le Studio, et « Publier » afficherait une modification en attente qui
     * n'en est plus une.
     *
     * On écrit donc la version finale dans le document publié, puis on retire
     * le brouillon : son intention est reprise, pas perdue.
     */
    const brouillon = await client.getDocument(`drafts.${visuel.advertiserId}`)
    if (brouillon) {
      await client.delete(`drafts.${visuel.advertiserId}`)
    }

    console.log(
      `${visuel.advertiserId} ← ${visuel.fichier} (${asset.metadata?.dimensions?.width}×${asset.metadata?.dimensions?.height})${brouillon ? ' — brouillon repris et retiré' : ''}`,
    )
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
