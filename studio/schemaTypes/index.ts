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
import {firstVisitPageType} from './documents/firstVisitPageType'
import {advertiserType} from './documents/advertiserType'
import {advertisersPageType} from './documents/advertisersPageType'
import {contactPageType} from './documents/contactPageType'
import {aboutPageType} from './documents/aboutPageType'
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
import {visitStepType} from './objects/visitStepType'
import {expectationItemType} from './objects/expectationItemType'
import {practicalInfoItemType} from './objects/practicalInfoItemType'
import {firstVisitFaqItemType} from './objects/firstVisitFaqItemType'
import {contactReasonType} from './objects/contactReasonType'
import {homeGroupTeaserType} from './objects/homeGroupTeaserType'
import {homeServiceLinkType} from './objects/homeServiceLinkType'
import {galleryPhotoType} from './objects/galleryPhotoType'
import {historyEntryType} from './objects/historyEntryType'
import {aboutPrincipleType} from './objects/aboutPrincipleType'
import {architectureFeatureType} from './objects/architectureFeatureType'
import {architectProfileType} from './objects/architectProfileType'
import {seoType} from './objects/seoType'

export const schemaTypes = [
  // Documents — données partagées
  siteSettingsType,
  massScheduleType,
  thriftStoreType,
  // Documents — collections
  parishEventType,
  advertiserType,
  // Documents — pages
  homePageType,
  schedulePageType,
  eventsPageType,
  thriftStorePageType,
  servicesPageType,
  parishLifePageType,
  firstVisitPageType,
  advertisersPageType,
  contactPageType,
  aboutPageType,
  // Objets réutilisables
  seoType,
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
  visitStepType,
  expectationItemType,
  practicalInfoItemType,
  firstVisitFaqItemType,
  contactReasonType,
  homeGroupTeaserType,
  homeServiceLinkType,
  galleryPhotoType,
  historyEntryType,
  aboutPrincipleType,
  architectureFeatureType,
  architectProfileType,
]
