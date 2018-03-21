import * as ActionTypes from './actionTypes';

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

export const setCurrentPage = (page) => {
  return {
    type: ActionTypes.SET_CURRENT_PAGE,
    page
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

