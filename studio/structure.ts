import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {CalendarIcon} from '@sanity/icons/Calendar'

const SINGLETONS = ['siteSettings', 'schedulePage']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Coordonnées de la paroisse')
        .icon(CogIcon)
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Horaires')
        .icon(CalendarIcon)
        .child(S.document().schemaType('schedulePage').documentId('schedulePage')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
