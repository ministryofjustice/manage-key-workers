import * as ActionTypes from './actionTypes';

export const setConfig = (config) => {
  return {
    type: ActionTypes.SET_CONFIG,
    config: config
  };
};

export const setUserDetails = (user) => {
  return {
    type: ActionTypes.SET_USER_DETAILS,
    user
  };
};

export const switchAgency = (agencyId) => {
  return {
    type: ActionTypes.SWITCH_AGENCY,
    activeCaseLoadId: agencyId
  };
};

export const setTermsVisibility = (shouldShowTerms) => ({
  type: ActionTypes.SET_TERMS_VISIBILITY,
  shouldShowTerms
});

export const setUnallocatedList = (unallocatedList) => {
  return {
    type: ActionTypes.SET_UNALLOCATED_LIST,
    unallocatedList
  };
};

export const setAllocatedDetails = (allocatedList, keyworkerList, fromDate, toDate) => {
  return {
    type: ActionTypes.SET_ALLOCATED_DETAILS,
    allocatedList: allocatedList,
    keyworkerList: keyworkerList,
    allocatedKeyworkers: []
  };
};

export const manualOverride = (allocated) => {
  return {
    type: ActionTypes.SET_MANUAL_OVERRIDE_LIST,
    allocatedKeyworkers: allocated
  };
};

export const manualOverrideDateFilter = (dateName, date) => {
  return {
    type: ActionTypes.SET_MANUAL_OVERRIDE_DATE_FILTER,
    dateName,
    date
  };
};

export const setError = (error) => {
  return {
    type: ActionTypes.SET_ERROR,
    error
  };
};

export const resetError = (error) => {
  return {
    type: ActionTypes.RESET_ERROR
  };
};

export const setMessage = (message) => {
  return {
    type: ActionTypes.SET_MESSAGE,
    message
  };
};

export const setLoaded = (loaded) => {
  return {
    type: ActionTypes.SET_LOADED,
    loaded
  };
};

export const setOffenderSearchText = (searchText) => {
  return {
    type: ActionTypes.SET_OFFENDER_SEARCH_TEXT,
    searchText
  };
};

export const setOffenderSearchAllocationStatus = (allocationStatus) => {
  return {
    type: ActionTypes.SET_OFFENDER_SEARCH_ALLOCATION_STATUS,
    allocationStatus
  };
};

export const setOffenderSearchHousingLocation = (housingLocation) => {
  return {
    type: ActionTypes.SET_OFFENDER_SEARCH_HOUSING_LOCATION,
    housingLocation
  };
};

export const setOffenderSearchLocations = (locations) => {
  return {
    type: ActionTypes.SET_OFFENDER_SEARCH_LOCATIONS,
    locations
  };
};

export const setOffenderSearchResults = (offenderResults) => {
  return {
    type: ActionTypes.SET_OFFENDER_SEARCH_RESULTS,
    offenderResults
  };
};

export const setKeyworkerSearchText = (searchText) => {
  return {
    type: ActionTypes.SET_KEY_WORKER_SEARCH_TEXT,
    searchText
  };
};

export const setKeyworkerStatusFilter = (statusFilter) => {
  return {
    type: ActionTypes.SET_KEY_WORKER_STATUS_FILTER,
    statusFilter
  };
};

export const setKeyworkerSearchResults = (keyworkerSearchResults) => {
  return {
    type: ActionTypes.SET_KEY_WORKER_SEARCH_RESULTS_LIST,
    keyworkerSearchResults
  };
};

export const setKeyworkerAllocationList = (keyworkerAllocations) => {
  return {
    type: ActionTypes.SET_KEY_WORKER_ALLOCATION_LIST,
    keyworkerAllocations
  };
};

export const setAllocationHistory = (allocationHistory) => {
  return {
    type: ActionTypes.SET_ALLOCATION_HISTORY,
    allocationHistory
  };
};

export const setKeyworker = (keyworker) => {
  return {
    type: ActionTypes.SET_KEY_WORKER,
    keyworker
  };
};

export const setKeyworkerChangeList = (keyworkerChangeList) => {
  return {
    type: ActionTypes.SET_KEY_WORKER_CHANGE_LIST,
    keyworkerChangeList
  };
};

export const setAvailableKeyworkerList = (keyworkerList) => {
  return {
    type: ActionTypes.SET_AVAILABLE_KEY_WORKER_LIST,
    keyworkerList
  };
};

export const setKeyworkerCapacity = (capacity) => {
  return {
    type: ActionTypes.SET_KEY_WORKER_CAPACITY,
    capacity
  };
};

export const setKeyworkerStatus = (status) => {
  return {
    type: ActionTypes.SET_KEY_WORKER_STATUS,
    status
  };
};

export const setKeyworkerStatusChangeBehaviour = (statusChangeBehaviour) => {
  return {
    type: ActionTypes.SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR,
    statusChangeBehaviour
  };
};

export const setAnnualLeaveReturnDate = (annualLeaveReturnDate) => {
  return {
    type: ActionTypes.SET_ANNUAL_LEAVE_RETURN_DATE,
    annualLeaveReturnDate
  };
};

export const setValidationError = (fieldName, message) => {
  return {
    type: ActionTypes.SET_VALIDATION_ERROR,
    fieldName,
    message
  };
};

export const resetValidationErrors = (fieldName, message) => {
  return {
    type: ActionTypes.RESET_VALIDATION_ERRORS
  };
};

export const setMenuOpen = (payload) => {
  return {
    type: ActionTypes.SET_MENU_OPEN,
    payload
  };
};

export const setSettingsCapacity = (capacity) => {
  return {
    type: ActionTypes.SET_KEYWORKER_SETTINGS_CAPACITY,
    capacity
  };
};

export const setSettingsExtCapacity = (extCapacity) => {
  return {
    type: ActionTypes.SET_KEYWORKER_SETTINGS_EXT_CAPACITY,
    extCapacity
  };
};

export const setSettingsAllowAutoAllocation = (allowAuto) => {
  return {
    type: ActionTypes.SET_KEYWORKER_SETTINGS_ALLOW_AUTO_ALLOCATION,
    allowAuto
  };
};

export const setSettingsMigrated = (migrated) => {
  return {
    type: ActionTypes.SET_KEYWORKER_SETTINGS_MIGRATED,
    migrated
  };
};

export const setSettingsSupported = (supported) => {
  return {
    type: ActionTypes.SET_KEYWORKER_SETTINGS_SUPPORTED,
    supported
  };
};

export const setSettingsSequenceFrequency = (sequenceFrequency) => {
  return {
    type: ActionTypes.SET_KEYWORKER_SETTINGS_SEQUENCE_FREQUENCY,
    sequenceFrequency
  };
};

export const setMaintainRolesUserList = (userList) => {
  return {
    type: ActionTypes.SET_USER_SEARCH_RESULTS_LIST,
    userList
  };
};

export const setMaintainRolesRoleList = (roleList) => {
  return {
    type: ActionTypes.SET_USER_SEARCH_ROLE_LIST,
    roleList
  };
};

export const setMaintainRolesRoleFilterList = (roleFilterList) => {
  return {
    type: ActionTypes.SET_USER_SEARCH_ROLE_FILTER_LIST,
    roleFilterList
  };
};

export const setMaintainRolesNameFilter = (nameFilter) => {
  return {
    type: ActionTypes.SET_USER_SEARCH_NAME_FILTER,
    nameFilter
  };
};

export const setMaintainRolesRoleFilter = (roleFilter) => {
  return {
    type: ActionTypes.SET_USER_SEARCH_ROLE_FILTER,
    roleFilter
  };
};

export const setMaintainRolesUserPageNumber = (pageNumber) => {
  return {
    type: ActionTypes.SET_USER_SEARCH_PAGINATION_PAGE_NUMBER,
    pageNumber
  };
};

export const setMaintainRolesUserPageSize = (pageSize) => {
  return {
    type: ActionTypes.SET_USER_SEARCH_PAGINATION_PAGE_SIZE,
    pageSize
  };
};

export const setMaintainRolesUserTotalRecords = (totalRecords) => {
  return {
    type: ActionTypes.SET_USER_SEARCH_PAGINATION_TOTAL_RECORDS,
    totalRecords
  };
};

export const setMaintainRolesUserContextUser = (contextUser) => {
  return {
    type: ActionTypes.SET_USER_SEARCH_CONTEXT_USER,
    contextUser
  };
};

export const setSettings = (settings) => {
  return {
    type: ActionTypes.SET_KEYWORKER_SETTINGS,
    migrated: settings.migrated,
    allowAuto: settings.allowAuto,
    capacity: settings.capacity,
    extCapacity: settings.extCapacity,
    supported: settings.supported,
    sequenceFrequency: settings.sequenceFrequency
  };
};


