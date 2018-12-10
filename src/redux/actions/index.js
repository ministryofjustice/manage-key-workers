import * as ActionTypes from './actionTypes'

export const setConfig = config => ({
  type: ActionTypes.SET_CONFIG,
  config,
})

export const setUserDetails = user => ({
  type: ActionTypes.SET_USER_DETAILS,
  user,
})

export const switchAgency = agencyId => ({
  type: ActionTypes.SWITCH_AGENCY,
  activeCaseLoadId: agencyId,
})

export const setTermsVisibility = shouldShowTerms => ({
  type: ActionTypes.SET_TERMS_VISIBILITY,
  shouldShowTerms,
})

export const setUnallocatedList = unallocatedList => ({
  type: ActionTypes.SET_UNALLOCATED_LIST,
  unallocatedList,
})

export const setAllocatedDetails = (allocatedList, keyworkerList) => ({
  type: ActionTypes.SET_ALLOCATED_DETAILS,
  allocatedList,
  keyworkerList,
  allocatedKeyworkers: [],
})

export const manualOverride = allocated => ({
  type: ActionTypes.SET_MANUAL_OVERRIDE_LIST,
  allocatedKeyworkers: allocated,
})

export const manualOverrideDateFilter = (dateName, date) => ({
  type: ActionTypes.SET_MANUAL_OVERRIDE_DATE_FILTER,
  dateName,
  date,
})

export const setError = error => ({
  type: ActionTypes.SET_ERROR,
  error,
})

export const resetError = error => ({
  type: ActionTypes.RESET_ERROR,
})

export const setMessage = message => ({
  type: ActionTypes.SET_MESSAGE,
  message,
})

export const setLoaded = loaded => ({
  type: ActionTypes.SET_LOADED,
  loaded,
})

export const setOffenderSearchText = searchText => ({
  type: ActionTypes.SET_OFFENDER_SEARCH_TEXT,
  searchText,
})

export const setOffenderSearchAllocationStatus = allocationStatus => ({
  type: ActionTypes.SET_OFFENDER_SEARCH_ALLOCATION_STATUS,
  allocationStatus,
})

export const setOffenderSearchHousingLocation = housingLocation => ({
  type: ActionTypes.SET_OFFENDER_SEARCH_HOUSING_LOCATION,
  housingLocation,
})

export const setOffenderSearchLocations = locations => ({
  type: ActionTypes.SET_OFFENDER_SEARCH_LOCATIONS,
  locations,
})

export const setOffenderSearchResults = offenderResults => ({
  type: ActionTypes.SET_OFFENDER_SEARCH_RESULTS,
  offenderResults,
})

export const setKeyworkerSearchText = searchText => ({
  type: ActionTypes.SET_KEY_WORKER_SEARCH_TEXT,
  searchText,
})

export const setKeyworkerStatusFilter = statusFilter => ({
  type: ActionTypes.SET_KEY_WORKER_STATUS_FILTER,
  statusFilter,
})

export const setKeyworkerSearchResults = keyworkerSearchResults => ({
  type: ActionTypes.SET_KEY_WORKER_SEARCH_RESULTS_LIST,
  keyworkerSearchResults,
})

export const setKeyworkerAllocationList = keyworkerAllocations => ({
  type: ActionTypes.SET_KEY_WORKER_ALLOCATION_LIST,
  keyworkerAllocations,
})

export const setAllocationHistory = allocationHistory => ({
  type: ActionTypes.SET_ALLOCATION_HISTORY,
  allocationHistory,
})

export const setKeyworker = keyworker => ({
  type: ActionTypes.SET_KEY_WORKER,
  keyworker,
})

export const setKeyworkerStats = stats => ({
  type: ActionTypes.SET_KEY_WORKER_STATS,
  stats,
})

export const setKeyworkerChangeList = keyworkerChangeList => ({
  type: ActionTypes.SET_KEY_WORKER_CHANGE_LIST,
  keyworkerChangeList,
})

export const setAvailableKeyworkerList = keyworkerList => ({
  type: ActionTypes.SET_AVAILABLE_KEY_WORKER_LIST,
  keyworkerList,
})

export const setKeyworkerCapacity = capacity => ({
  type: ActionTypes.SET_KEY_WORKER_CAPACITY,
  capacity,
})

export const setKeyworkerStatus = status => ({
  type: ActionTypes.SET_KEY_WORKER_STATUS,
  status,
})

export const setKeyworkerStatusChangeBehaviour = statusChangeBehaviour => ({
  type: ActionTypes.SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR,
  statusChangeBehaviour,
})

export const setAnnualLeaveReturnDate = annualLeaveReturnDate => ({
  type: ActionTypes.SET_ANNUAL_LEAVE_RETURN_DATE,
  annualLeaveReturnDate,
})

export const setValidationError = (fieldName, message) => ({
  type: ActionTypes.SET_VALIDATION_ERROR,
  fieldName,
  message,
})

export const resetValidationErrors = () => ({
  type: ActionTypes.RESET_VALIDATION_ERRORS,
})

export const setMenuOpen = payload => ({
  type: ActionTypes.SET_MENU_OPEN,
  payload,
})

export const setSettingsCapacity = capacity => ({
  type: ActionTypes.SET_KEYWORKER_SETTINGS_CAPACITY,
  capacity,
})

export const setSettingsExtCapacity = extCapacity => ({
  type: ActionTypes.SET_KEYWORKER_SETTINGS_EXT_CAPACITY,
  extCapacity,
})

export const setSettingsAllowAutoAllocation = allowAuto => ({
  type: ActionTypes.SET_KEYWORKER_SETTINGS_ALLOW_AUTO_ALLOCATION,
  allowAuto,
})

export const setSettingsMigrated = migrated => ({
  type: ActionTypes.SET_KEYWORKER_SETTINGS_MIGRATED,
  migrated,
})

export const setSettingsSupported = supported => ({
  type: ActionTypes.SET_KEYWORKER_SETTINGS_SUPPORTED,
  supported,
})

export const setSettingsSequenceFrequency = sequenceFrequency => ({
  type: ActionTypes.SET_KEYWORKER_SETTINGS_SEQUENCE_FREQUENCY,
  sequenceFrequency,
})

export const setMaintainRolesUserList = userList => ({
  type: ActionTypes.SET_USER_SEARCH_RESULTS_LIST,
  userList,
})

export const setMaintainRolesRoleList = roleList => ({
  type: ActionTypes.SET_USER_SEARCH_ROLE_LIST,
  roleList,
})

export const setMaintainRolesRoleFilterList = roleFilterList => ({
  type: ActionTypes.SET_USER_SEARCH_ROLE_FILTER_LIST,
  roleFilterList,
})

export const setMaintainRolesNameFilter = nameFilter => ({
  type: ActionTypes.SET_USER_SEARCH_NAME_FILTER,
  nameFilter,
})

export const setMaintainRolesRoleFilter = roleFilter => ({
  type: ActionTypes.SET_USER_SEARCH_ROLE_FILTER,
  roleFilter,
})

export const setMaintainRolesRoleAdd = roleAdd => ({
  type: ActionTypes.SET_USER_SEARCH_ROLE_ADD,
  roleAdd,
})

export const setMaintainRolesUserPageNumber = pageNumber => ({
  type: ActionTypes.SET_USER_SEARCH_PAGINATION_PAGE_NUMBER,
  pageNumber,
})

export const setMaintainRolesUserPageSize = pageSize => ({
  type: ActionTypes.SET_USER_SEARCH_PAGINATION_PAGE_SIZE,
  pageSize,
})

export const setMaintainRolesUserTotalRecords = totalRecords => ({
  type: ActionTypes.SET_USER_SEARCH_PAGINATION_TOTAL_RECORDS,
  totalRecords,
})

export const setMaintainRolesUserContextUser = contextUser => ({
  type: ActionTypes.SET_USER_SEARCH_CONTEXT_USER,
  contextUser,
})

export const setSettings = settings => ({
  type: ActionTypes.SET_KEYWORKER_SETTINGS,
  migrated: settings.migrated,
  allowAuto: settings.allowAuto,
  capacity: settings.capacity,
  extCapacity: settings.extCapacity,
  supported: settings.supported,
  sequenceFrequency: settings.sequenceFrequency,
})

export const setPrisonLevelKeyworkerStats = ({ data, prisonerToKeyWorkerRatio, duration, period }) => ({
  type: ActionTypes.SET_PRISON_LEVEL_KEY_WORKER_STATS,
  data,
  period,
  duration,
  prisonerToKeyWorkerRatio,
})
