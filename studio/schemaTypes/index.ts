import {siteSettingsType} from './documents/siteSettingsType'
import {schedulePageType} from './documents/schedulePageType'
import {scheduleEntryType} from './objects/scheduleEntryType'
import {schedulePeriodType} from './objects/schedulePeriodType'

export const schemaTypes = [
  // Documents
  siteSettingsType,
  schedulePageType,
  // Objets réutilisables
  scheduleEntryType,
  schedulePeriodType,
]
