import * as ActionTypes from './actionTypes';

export const setLoginDetails = (jwt, user) => {
  return {
    type: ActionTypes.SET_LOGIN_DETAILS,
    jwt,
    user
  };
};

export const setLoginInputChange = (fieldName, value) => {
  return {
    type: ActionTypes.SET_LOGIN_INPUT_CHANGE,
    fieldName,
    value
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

export const setMessage = (message) => {
  return {
    type: ActionTypes.SET_MESSAGE,
    message
  };
};

