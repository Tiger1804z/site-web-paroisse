import type {StructureResolver} from 'sanity/structure'
import {BasketIcon} from '@sanity/icons/Basket'
import {CogIcon} from '@sanity/icons/Cog'
import {CalendarIcon} from '@sanity/icons/Calendar'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {FolderIcon} from '@sanity/icons/Folder'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {HomeIcon} from '@sanity/icons/Home'

const SINGLETONS = [
  'siteSettings',
  'massSchedule',
  'thriftStore',
  'homePage',
  'schedulePage',
  'eventsPage',
  'thriftStorePage',
  'servicesPage',
  'parishLifePage',
  'firstVisitPage',
  'advertisersPage',
  'contactPage',
]

// Les collections ont leur propre section : ce sont des documents multiples,
// pas des réglages uniques.
const COLLECTIONS = ['parishEvent', 'advertiser']

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
              S.listItem()
                .title('Friperie')
                .icon(BasketIcon)
                .child(S.document().schemaType('thriftStore').documentId('thriftStore')),
            ]),
        ),
      S.listItem()
        .title('Collections')
        .icon(CalendarIcon)
        .child(
          S.list()
            .title('Collections')
            .items([
              S.documentTypeListItem('parishEvent').title('Événements'),
              S.documentTypeListItem('advertiser').title('Annonceurs'),
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
                .title('Page d’accueil')
                .icon(HomeIcon)
                .child(S.document().schemaType('homePage').documentId('homePage')),
              S.listItem()
                .title('Page Horaires')
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('schedulePage').documentId('schedulePage')),
              S.listItem()
                .title('Page Événements')
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('eventsPage').documentId('eventsPage')),
              S.listItem()
                .title('Page Nos services')
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('servicesPage').documentId('servicesPage')),
              S.listItem()
                .title('Page Vie paroissiale')
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('parishLifePage').documentId('parishLifePage')),
              S.listItem()
                .title('Page Première visite')
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('firstVisitPage').documentId('firstVisitPage')),
              S.listItem()
                .title('Page Nos annonceurs')
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('advertisersPage').documentId('advertisersPage')),
              S.listItem()
                .title('Page Contact')
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('contactPage').documentId('contactPage')),
              S.listItem()
                .title('Page Friperie')
                .icon(DocumentTextIcon)
                .child(S.document().schemaType('thriftStorePage').documentId('thriftStorePage')),
            ]),
        ),
      S.divider(),
      ...S.documentTypeListItems().filter((listItem) => {
        const id = listItem.getId() as string
        return !SINGLETONS.includes(id) && !COLLECTIONS.includes(id)
      }),
    ])
