import {siteSettingsType} from './documents/siteSettingsType'
import {massScheduleType} from './documents/massScheduleType'
import {thriftStoreType} from './documents/thriftStoreType'
import {parishEventType} from './documents/parishEventType'
import {eventsPageType} from './documents/eventsPageType'
import {homePageType} from './documents/homePageType'
import {schedulePageType} from './documents/schedulePageType'
import {thriftStorePageType} from './documents/thriftStorePageType'
import {servicesPageType} from './documents/servicesPageType'
import {parishLifePageType} from './documents/parishLifePageType'
import {eventCategoryType} from './objects/eventCategoryType'
import {eventImageType} from './objects/eventImageType'
import {scheduleEntryType} from './objects/scheduleEntryType'
import {scheduleFaqItemType} from './objects/scheduleFaqItemType'
import {scheduleNoticeType} from './objects/scheduleNoticeType'
import {schedulePeriodType} from './objects/schedulePeriodType'
import {thriftStoreCtaType} from './objects/thriftStoreCtaType'
import {thriftStoreSectionType} from './objects/thriftStoreSectionType'
import {serviceChapterType} from './objects/serviceChapterType'
import {serviceDetailType} from './objects/serviceDetailType'
import {parishServiceType} from './objects/parishServiceType'
import {parishGroupType} from './objects/parishGroupType'
import {heroSlideType} from './objects/heroSlideType'

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
  servicesPageType,
  parishLifePageType,
  // Objets réutilisables
  eventCategoryType,
  eventImageType,
  scheduleEntryType,
  scheduleFaqItemType,
  scheduleNoticeType,
  schedulePeriodType,
  thriftStoreCtaType,
  thriftStoreSectionType,
  serviceChapterType,
  parishServiceType,
  serviceDetailType,
  parishGroupType,
  heroSlideType,
]
