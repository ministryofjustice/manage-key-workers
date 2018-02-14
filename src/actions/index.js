import * as ActionTypes from './actionTypes';

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

