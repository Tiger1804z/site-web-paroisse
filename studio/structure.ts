import type {StructureResolver} from 'sanity/structure'
import {CogIcon} from '@sanity/icons/Cog'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {FolderIcon} from '@sanity/icons/Folder'
import {DocumentsIcon} from '@sanity/icons/Documents'

const SINGLETONS = ['siteSettings', 'massSchedule', 'schedulePage']

/**
 * Deux sections, pour rendre visible la distinction du modèle de contenu :
 * ce qui est partagé par plusieurs pages, et ce qui appartient à une page.
 */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Contenu')
    .items([
      S.listItem()
        .title('Données partagées')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Données partagées')
            .items([
              S.listItem()
                .title('Coordonnées de la paroisse')
                .icon(CogIcon)
                .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
              S.listItem()
                .title('Horaires des messes')
                .icon(CalendarIcon)
                .child(S.document().schemaType('massSchedule').documentId('massSchedule')),
            ]),
        ),
      S.listItem()
        .title('Pages')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Page Horaires')
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('schedulePage').documentId('schedulePage')),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETONS.includes(listItem.getId() as string),
      ),
    ])
