import { combineReducers } from 'redux';
import * as ActionTypes from '../actions/actionTypes';
import moment from 'moment';

const unallocatedInitialState = {
  unallocatedList: []
};

const allocatedInitialState = {
  allocatedList: [],
  keyworkerList: [],
  allocatedKeyworkers: [],
  toDate: moment().format('DD/MM/YYYY'),
  fromDate: moment().format('DD/MM/YYYY')
};

const appInitialState = {
  user: { activeCaseLoadId: null },
  shouldShowTerms: false,
  error: null,
  message: null,
  username: '',
  password: '',
  page: 0
};

const offenderSearchInitialState = {
  searchText: null,
  housingLocation: null,
  allocationStatus: null
};

const keyworkerSearchInitialState = {
  searchText: '',
  keyworkerSearchResults: [],
  keyworkerAllocations: [],
  keyworker: { key: 'value' },
  keyworkerChangeList: [],
  keyworkerList: []
};

export function app (state = appInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_LOGIN_DETAILS:
      return updateObject(state, {
        jwt: action.jwt,
        user: action.user
      });
    case ActionTypes.SET_LOGIN_INPUT_CHANGE:
      return updateObject(state, {
        [action.fieldName]: action.value
      });
    case ActionTypes.SWITCH_AGENCY:
      return { ...state, user: { ...state.user, activeCaseLoadId: action.activeCaseLoadId } };

    case ActionTypes.SET_TERMS_VISIBILITY:
      return { ...state, shouldShowTerms: action.shouldShowTerms };

    case ActionTypes.SET_CURRENT_PAGE:
      return updateObject(state, {
        page: action.page,
        error: null
      });
    case ActionTypes.SET_ERROR:
      return updateObject(state, {
        page: 0,
        error: action.error
      });
    case ActionTypes.SET_MESSAGE:
      return {
        ...state,
        message: action.message
      };
    default:
      return state;
  }
}

export function unallocated (state = unallocatedInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_UNALLOCATED_LIST:
      return updateObject(state, { unallocatedList: action.unallocatedList });
    default:
      return state;
  }
}

export function allocated (state = allocatedInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_ALLOCATED_DETAILS:
      return updateObject(state, {
        allocatedList: action.allocatedList,
        keyworkerList: action.keyworkerList,
        allocatedKeyworkers: []
      });
    case ActionTypes.SET_MANUAL_OVERRIDE_LIST:
      return updateObject(state, {
        allocatedKeyworkers: action.allocatedKeyworkers
      });
    case ActionTypes.SET_MANUAL_OVERRIDE_DATE_FILTER:
      return updateObject(state, {
        [action.dateName]: action.date
      });
    default:
      return state;
  }
}

export function offenderSearch (state = offenderSearchInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_OFFENDER_SEARCH_TEXT:
      return { ...state,
        searchText: action.searchText
      };
    case ActionTypes.SET_OFFENDER_SEARCH_ALLOCATION_STATUS:
      return { ...state,
        allocationStatus: action.allocationStatus
      };
    case ActionTypes.SET_OFFENDER_SEARCH_HOUSING_LOCATION:
      return { ...state,
        housingLocation: action.housingLocation
      };
    default:
      return state;
  }
}

export function keyworkerSearch (state = keyworkerSearchInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_KEY_WORKER_SEARCH_TEXT:
      return { ...state,
        searchText: action.searchText
      };
    case ActionTypes.SET_KEY_WORKER_SEARCH_RESULTS_LIST:
      return { ...state,
        keyworkerSearchResults: action.keyworkerSearchResults
      };
    case ActionTypes.SET_KEY_WORKER_ALLOCATION_LIST:
      return { ...state,
        keyworkerAllocations: action.keyworkerAllocations
      };
    case ActionTypes.SET_KEY_WORKER:
      return { ...state,
        keyworker: action.keyworker
      };
    case ActionTypes.SET_KEY_WORKER_CHANGE_LIST:
      return { ...state,
        keyworkerChangeList: action.keyworkerChangeList
      };
    case ActionTypes.SET_AVAILABLE_KEY_WORKER_LIST:
      return { ...state,
        keyworkerList: action.keyworkerList
      };
    default:
      return state;
  }
}

function updateObject (oldObject, newValues) {
  return Object.assign({}, oldObject, newValues);
}


const allocationApp = combineReducers({
  allocated,
  unallocated,
  app,
  offenderSearch,
  keyworkerSearch
});

export default allocationApp;
