import {
  RESET_ERROR,
  RESET_VALIDATION_ERRORS,
  SET_ALLOCATED_DETAILS,
  SET_ALLOCATION_HISTORY,
  SET_ANNUAL_LEAVE_RETURN_DATE,
  SET_AVAILABLE_KEY_WORKER_LIST,
  SET_CONFIG,
  SET_ERROR,
  SET_KEY_WORKER,
  SET_KEY_WORKER_ALLOCATION_LIST,
  SET_KEY_WORKER_CAPACITY,
  SET_KEY_WORKER_CHANGE_LIST,
  SET_KEY_WORKER_SEARCH_RESULTS_LIST,
  SET_KEY_WORKER_SEARCH_TEXT,
  SET_KEYWORKER_SETTINGS,
  SET_KEYWORKER_SETTINGS_ALLOW_AUTO_ALLOCATION,
  SET_KEYWORKER_SETTINGS_CAPACITY,
  SET_KEYWORKER_SETTINGS_EXT_CAPACITY,
  SET_KEYWORKER_SETTINGS_MIGRATED,
  SET_KEYWORKER_SETTINGS_SEQUENCE_FREQUENCY,
  SET_KEYWORKER_SETTINGS_SUPPORTED,
  SET_KEY_WORKER_STATS,
  SET_KEY_WORKER_STATUS,
  SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR,
  SET_KEY_WORKER_STATUS_FILTER,
  SET_LOADED,
  SET_MANUAL_OVERRIDE_DATE_FILTER,
  SET_MANUAL_OVERRIDE_LIST,
  SET_MENU_OPEN,
  SET_MESSAGE,
  SET_OFFENDER_SEARCH_ALLOCATION_STATUS,
  SET_OFFENDER_SEARCH_HOUSING_LOCATION,
  SET_OFFENDER_SEARCH_LOCATIONS,
  SET_OFFENDER_SEARCH_RESULTS,
  SET_OFFENDER_SEARCH_TEXT,
  SET_PRISON_LEVEL_KEY_WORKER_STATS,
  SET_TERMS_VISIBILITY,
  SET_UNALLOCATED_LIST,
  SET_USER_DETAILS,
  SET_VALIDATION_ERROR,
  SWITCH_AGENCY,
} from './actionTypes'

export const setConfig = config => ({ type: SET_CONFIG, config })

export const setUserDetails = user => ({ type: SET_USER_DETAILS, user })

export const switchAgency = agencyId => ({ type: SWITCH_AGENCY, activeCaseLoadId: agencyId })

export const setTermsVisibility = shouldShowTerms => ({ type: SET_TERMS_VISIBILITY, shouldShowTerms })

export const setUnallocatedList = unallocatedList => ({ type: SET_UNALLOCATED_LIST, unallocatedList })

export const setAllocatedDetails = (allocatedList, keyworkerList) => ({
  type: SET_ALLOCATED_DETAILS,
  allocatedList,
  keyworkerList,
  allocatedKeyworkers: [],
})

export const manualOverride = allocated => ({ type: SET_MANUAL_OVERRIDE_LIST, allocatedKeyworkers: allocated })
export const manualOverrideDateFilter = (dateName, date) => ({ type: SET_MANUAL_OVERRIDE_DATE_FILTER, dateName, date })

export const setError = error => ({ type: SET_ERROR, error })
export const resetError = () => ({ type: RESET_ERROR })
export const handleAxiosError = error => dispatch => {
  if (
    error.response &&
    error.response.status === 401 &&
    error.response.data &&
    error.response.data.reason === 'session-expired'
  ) {
    // eslint-disable-next-line no-alert
    alert('Your session has expired, please click OK to be redirected back to the login page')
    window.location = '/auth/logout'
  } else {
    dispatch(setError((error.response && error.response.data) || `Something went wrong: ${error}`))
  }
}

export const setMessage = message => ({ type: SET_MESSAGE, message })
export const clearMessage = () => ({ type: SET_MESSAGE, message: '' })

export const setLoaded = loaded => ({ type: SET_LOADED, loaded })

export const setOffenderSearchText = searchText => ({ type: SET_OFFENDER_SEARCH_TEXT, searchText })
export const setOffenderSearchAllocationStatus = allocationStatus => ({
  type: SET_OFFENDER_SEARCH_ALLOCATION_STATUS,
  allocationStatus,
})
export const setOffenderSearchHousingLocation = housingLocation => ({
  type: SET_OFFENDER_SEARCH_HOUSING_LOCATION,
  housingLocation,
})
export const setOffenderSearchLocations = locations => ({ type: SET_OFFENDER_SEARCH_LOCATIONS, locations })
export const setOffenderSearchResults = offenderResults => ({ type: SET_OFFENDER_SEARCH_RESULTS, offenderResults })

export const setKeyworkerSearchText = searchText => ({ type: SET_KEY_WORKER_SEARCH_TEXT, searchText })
export const setKeyworkerStatusFilter = statusFilter => ({ type: SET_KEY_WORKER_STATUS_FILTER, statusFilter })
export const setKeyworkerSearchResults = keyworkerSearchResults => ({
  type: SET_KEY_WORKER_SEARCH_RESULTS_LIST,
  keyworkerSearchResults,
})
export const setKeyworkerAllocationList = keyworkerAllocations => ({
  type: SET_KEY_WORKER_ALLOCATION_LIST,
  keyworkerAllocations,
})

export const setAllocationHistory = allocationHistory => ({ type: SET_ALLOCATION_HISTORY, allocationHistory })

export const setKeyworker = keyworker => ({ type: SET_KEY_WORKER, keyworker })
export const setKeyworkerStats = stats => ({ type: SET_KEY_WORKER_STATS, stats })
export const setKeyworkerChangeList = keyworkerChangeList => ({ type: SET_KEY_WORKER_CHANGE_LIST, keyworkerChangeList })

export const setAvailableKeyworkerList = keyworkerList => ({ type: SET_AVAILABLE_KEY_WORKER_LIST, keyworkerList })

export const setKeyworkerCapacity = capacity => ({ type: SET_KEY_WORKER_CAPACITY, capacity })
export const setKeyworkerStatus = status => ({ type: SET_KEY_WORKER_STATUS, status })
export const setKeyworkerStatusChangeBehaviour = statusChangeBehaviour => ({
  type: SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR,
  statusChangeBehaviour,
})

export const setAnnualLeaveReturnDate = annualLeaveReturnDate => ({
  type: SET_ANNUAL_LEAVE_RETURN_DATE,
  annualLeaveReturnDate,
})

export const setValidationError = (fieldName, message) => ({ type: SET_VALIDATION_ERROR, fieldName, message })
export const resetValidationErrors = () => ({ type: RESET_VALIDATION_ERRORS })

export const setMenuOpen = payload => ({ type: SET_MENU_OPEN, payload })

export const setSettingsCapacity = capacity => ({ type: SET_KEYWORKER_SETTINGS_CAPACITY, capacity })
export const setSettingsExtCapacity = extCapacity => ({ type: SET_KEYWORKER_SETTINGS_EXT_CAPACITY, extCapacity })
export const setSettingsAllowAutoAllocation = allowAuto => ({
  type: SET_KEYWORKER_SETTINGS_ALLOW_AUTO_ALLOCATION,
  allowAuto,
})
export const setSettingsMigrated = migrated => ({ type: SET_KEYWORKER_SETTINGS_MIGRATED, migrated })
export const setSettingsSupported = supported => ({ type: SET_KEYWORKER_SETTINGS_SUPPORTED, supported })
export const setSettingsSequenceFrequency = sequenceFrequency => ({
  type: SET_KEYWORKER_SETTINGS_SEQUENCE_FREQUENCY,
  sequenceFrequency,
})

export const setSettings = settings => ({
  type: SET_KEYWORKER_SETTINGS,
  migrated: settings.migrated,
  allowAuto: settings.allowAuto,
  capacity: settings.capacity,
  extCapacity: settings.extCapacity,
  supported: settings.supported,
  sequenceFrequency: settings.sequenceFrequency,
})

export const setPrisonLevelKeyworkerStats = ({ data, prisonerToKeyWorkerRatio, fromDate, toDate }) => ({
  type: SET_PRISON_LEVEL_KEY_WORKER_STATS,
  data,
  fromDate,
  toDate,
  prisonerToKeyWorkerRatio,
})
