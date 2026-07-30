import {siteSettingsType} from './documents/siteSettingsType'
import {massScheduleType} from './documents/massScheduleType'
import {thriftStoreType} from './documents/thriftStoreType'
import {parishEventType} from './documents/parishEventType'
import {eventsPageType} from './documents/eventsPageType'
import {homePageType} from './documents/homePageType'
import {schedulePageType} from './documents/schedulePageType'
import {thriftStorePageType} from './documents/thriftStorePageType'
import {eventCategoryType} from './objects/eventCategoryType'
import {eventImageType} from './objects/eventImageType'
import {scheduleEntryType} from './objects/scheduleEntryType'
import {scheduleFaqItemType} from './objects/scheduleFaqItemType'
import {scheduleNoticeType} from './objects/scheduleNoticeType'
import {schedulePeriodType} from './objects/schedulePeriodType'
import {thriftStoreCtaType} from './objects/thriftStoreCtaType'
import {thriftStoreSectionType} from './objects/thriftStoreSectionType'

export const schemaTypes = [
  // Documents — données partagées
  siteSettingsType,
  massScheduleType,
  thriftStoreType,
  // Documents — collections
  parishEventType,
  // Documents — pages
  homePageType,
  schedulePageType,
  eventsPageType,
  thriftStorePageType,
  // Objets réutilisables
  eventCategoryType,
  eventImageType,
  scheduleEntryType,
  scheduleFaqItemType,
  scheduleNoticeType,
  schedulePeriodType,
  thriftStoreCtaType,
  thriftStoreSectionType,
]
