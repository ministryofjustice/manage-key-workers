import { combineReducers } from 'redux'
import moment from 'moment'
import * as ActionTypes from '../actions/actionTypes'

const unallocatedInitialState = {
  unallocatedList: [],
}

const allocatedInitialState = {
  allocatedList: [],
  keyworkerList: [],
  allocatedKeyworkers: [],
  toDate: moment().format('DD/MM/YYYY'),
  fromDate: moment().format('DD/MM/YYYY'),
}

const appInitialState = {
  config: {
    mailTo: '',
    keyworkerProfileStatsEnabled: 'false',
    keyworkerDashboardStatsEnabled: false,
    notmEndpointUrl: '',
    prisonStaffHubUrl: '',
  },
  user: {
    activeCaseLoadId: '',
    caseLoadOptions: [],
    expiredFlag: false,
    firstName: '',
    lastName: '',
    lockedFlag: false,
    maintainAccess: false,
    maintainAccessAdmin: false,
    migration: false,
    staffId: 0,
    username: '',
    writeAccess: false,
  },
  shouldShowTerms: false,
  error: '',
  message: '',
  loaded: false,
  menuOpen: false,
  page: 0,
  validationErrors: {},
}

const offenderSearchInitialState = {
  searchText: '',
  housingLocation: '',
  locations: [],
  allocationStatus: 'all',
  offenderResults: {
    keyworkerResponse: [],
    offenderResponse: [],
    partialResults: false,
  },
}

const keyworkerSearchInitialState = {
  agencyId: '',
  searchText: '',
  statusFilter: '',
  keyworkerSearchResults: [],
  keyworkerAllocations: [],
  keyworker: {
    key: 'value',
    agencyId: '',
    agencyDescription: '',
    autoAllocationAllowed: false,
    capacity: 0,
    firstName: '',
    lastName: '',
    numberAllocated: 0,
    scheduleType: '',
    staffId: 0,
    status: '',
  },
  keyworkerChangeList: [],
  keyworkerList: [],
  status: '',
  capacity: 0,
  statusChangeBehaviour: '',
  annualLeaveReturnDate: '',
}

const allocationHistoryInitialState = {
  allocationHistory: {},
}

const keyworkerSettingsInitialState = {
  capacity: 6,
  extCapacity: 9,
  allowAuto: false,
  sequenceFrequency: 1,
  supported: false,
  migrated: false,
}

const prisonLevelKeyWorkerStatsDashboardInitialState = {
  data: [],
  prisonerToKeyWorkerRatio: 0,
  duration: 4,
  period: 'week',
  fromDate: '',
  toDate: '',
}

function updateObject(oldObject, newValues) {
  return Object.assign({}, oldObject, newValues)
}

export function app(state = appInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_CONFIG:
      return updateObject(state, {
        config: action.config,
      })
    case ActionTypes.SET_USER_DETAILS:
      return updateObject(state, {
        user: action.user,
      })
    case ActionTypes.SWITCH_AGENCY:
      return { ...state, user: { ...state.user, activeCaseLoadId: action.activeCaseLoadId } }

    case ActionTypes.SET_TERMS_VISIBILITY:
      return { ...state, shouldShowTerms: action.shouldShowTerms }

    case ActionTypes.SET_ERROR:
      return updateObject(state, {
        error: action.error,
      })
    case ActionTypes.RESET_ERROR:
      return updateObject(state, {
        error: '',
      })
    case ActionTypes.SET_MESSAGE:
      return {
        ...state,
        message: action.message,
      }
    case ActionTypes.SET_LOADED:
      return {
        ...state,
        loaded: action.loaded,
      }
    case ActionTypes.SET_VALIDATION_ERROR: {
      const newError = { [action.fieldName]: action.message }
      return {
        ...state,
        validationErrors: state.validationErrors ? { ...state.validationErrors, ...newError } : newError,
      }
    }
    case ActionTypes.RESET_VALIDATION_ERRORS:
      return {
        ...state,
        validationErrors: {},
      }
    case ActionTypes.SET_MENU_OPEN:
      return {
        ...state,
        menuOpen: action.payload,
      }
    default:
      return state
  }
}

export function unallocated(state = unallocatedInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_UNALLOCATED_LIST:
      return updateObject(state, { unallocatedList: action.unallocatedList })
    default:
      return state
  }
}

export function allocated(state = allocatedInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_ALLOCATED_DETAILS:
      return updateObject(state, {
        allocatedList: action.allocatedList,
        keyworkerList: action.keyworkerList,
        allocatedKeyworkers: [],
      })
    case ActionTypes.SET_MANUAL_OVERRIDE_LIST:
      return updateObject(state, {
        allocatedKeyworkers: action.allocatedKeyworkers,
      })
    case ActionTypes.SET_MANUAL_OVERRIDE_DATE_FILTER:
      return updateObject(state, {
        [action.dateName]: action.date,
      })
    default:
      return state
  }
}

export function offenderSearch(state = offenderSearchInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_OFFENDER_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.searchText,
      }
    case ActionTypes.SET_OFFENDER_SEARCH_ALLOCATION_STATUS:
      return {
        ...state,
        allocationStatus: action.allocationStatus,
      }
    case ActionTypes.SET_OFFENDER_SEARCH_HOUSING_LOCATION:
      return {
        ...state,
        housingLocation: action.housingLocation,
      }
    case ActionTypes.SET_OFFENDER_SEARCH_LOCATIONS:
      return {
        ...state,
        locations: action.locations,
      }
    case ActionTypes.SWITCH_AGENCY:
      return Object.assign({}, offenderSearchInitialState)
    case ActionTypes.SET_OFFENDER_SEARCH_RESULTS:
      return {
        ...state,
        offenderResults: action.offenderResults,
      }
    case ActionTypes.SET_KEY_WORKER_CHANGE_LIST:
      return {
        ...state,
        keyworkerChangeList: action.keyworkerChangeList,
      }
    default:
      return state
  }
}

export function keyworkerSearch(state = keyworkerSearchInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_KEY_WORKER_SEARCH_TEXT:
      return {
        ...state,
        searchText: action.searchText,
      }
    case ActionTypes.SET_KEY_WORKER_STATUS_FILTER:
      return {
        ...state,
        statusFilter: action.statusFilter,
      }
    case ActionTypes.SET_KEY_WORKER_SEARCH_RESULTS_LIST:
      return {
        ...state,
        keyworkerSearchResults: action.keyworkerSearchResults,
      }
    case ActionTypes.SET_KEY_WORKER_ALLOCATION_LIST:
      return {
        ...state,
        keyworkerAllocations: action.keyworkerAllocations,
      }
    case ActionTypes.SET_KEY_WORKER:
      return {
        ...state,
        keyworker: action.keyworker,
      }
    case ActionTypes.SET_KEY_WORKER_STATS:
      return {
        ...state,
        keyworker: {
          ...state.keyworker,
          stats: {
            data: action.stats.data,
            fromDate: action.stats.fromDate,
            toDate: action.stats.toDate,
          },
        },
      }
    case ActionTypes.SET_KEY_WORKER_CHANGE_LIST:
      return {
        ...state,
        keyworkerChangeList: action.keyworkerChangeList,
      }
    case ActionTypes.SET_AVAILABLE_KEY_WORKER_LIST:
      return {
        ...state,
        keyworkerList: action.keyworkerList,
      }
    case ActionTypes.SET_KEY_WORKER_CAPACITY:
      return {
        ...state,
        capacity: action.capacity,
      }
    case ActionTypes.SET_KEY_WORKER_STATUS:
      return {
        ...state,
        status: action.status,
      }
    case ActionTypes.SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR:
      return {
        ...state,
        statusChangeBehaviour: action.statusChangeBehaviour,
      }
    case ActionTypes.SET_ANNUAL_LEAVE_RETURN_DATE:
      return {
        ...state,
        annualLeaveReturnDate: action.annualLeaveReturnDate,
      }
    default:
      return state
  }
}

export function keyworkerSettings(state = keyworkerSettingsInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_KEYWORKER_SETTINGS_CAPACITY:
      return {
        ...state,
        capacity: action.capacity,
      }
    case ActionTypes.SET_KEYWORKER_SETTINGS_EXT_CAPACITY:
      return {
        ...state,
        extCapacity: action.extCapacity,
      }
    case ActionTypes.SET_KEYWORKER_SETTINGS_SUPPORTED:
      return {
        ...state,
        supported: action.supported,
      }
    case ActionTypes.SET_KEYWORKER_SETTINGS_MIGRATED:
      return {
        ...state,
        migrated: action.migrated,
      }
    case ActionTypes.SET_KEYWORKER_SETTINGS_ALLOW_AUTO_ALLOCATION:
      return {
        ...state,
        allowAuto: action.allowAuto,
      }
    case ActionTypes.SET_KEYWORKER_SETTINGS_SEQUENCE_FREQUENCY:
      return {
        ...state,
        sequenceFrequency: action.sequenceFrequency,
      }
    case ActionTypes.SET_KEYWORKER_SETTINGS:
      return {
        ...state,
        allowAuto: action.allowAuto,
        migrated: action.migrated,
        extCapacity: action.extCapacity,
        capacity: action.capacity,
        supported: action.supported,
        sequenceFrequency: action.sequenceFrequency,
      }
    default:
      return state
  }
}

export function allocationHistory(state = allocationHistoryInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_ALLOCATION_HISTORY:
      return {
        ...state,
        allocationHistory: action.allocationHistory,
      }

    default:
      return state
  }
}

export function prisonLevelKeyWorkerStatsDashboard(state = prisonLevelKeyWorkerStatsDashboardInitialState, action) {
  switch (action.type) {
    case ActionTypes.SET_PRISON_LEVEL_KEY_WORKER_STATS:
      return {
        ...state,
        data: action.data,
        fromDate: action.fromDate,
        toDate: action.toDate,
        prisonerToKeyWorkerRatio: action.prisonerToKeyWorkerRatio,
      }
    default:
      return state
  }
}

const allocationApp = combineReducers({
  allocated,
  unallocated,
  app,
  offenderSearch,
  keyworkerSearch,
  allocationHistory,
  keyworkerSettings,
  prisonLevelKeyWorkerStatsDashboard,
})

export default allocationApp
