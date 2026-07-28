import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'

const SINGLETONS = ['siteSettings']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Coordonnées de la paroisse')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
