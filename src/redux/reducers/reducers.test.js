import moment from 'moment'
import { unallocated, allocated, app, offenderSearch, keyworkerSearch, keyworkerSettings, maintainRoles } from './index'
import { setMenuOpen } from '../actions'
import * as types from '../actions/actionTypes'

const appInitialState = {
  error: null,
  message: null,
  loaded: false,
}

const appWithErrorState = {
  error: 'There was a problem',
  message: null,
  loaded: false,
}

const appWithValidationErrorState = {
  validationErrors: { myField: 'An error!' },
}

const allocatedInitialState = {
  allocatedKeyworkers: [],
  allocatedList: [],
  keyworkerList: [],
  toDate: moment().format('DD/MM/YYYY'),
  fromDate: moment().format('DD/MM/YYYY'),
}

const allocatedPopulatedState = {
  allocatedKeyworkers: ['allocatedKeyworkers'],
  allocatedList: ['allocatedList'],
  keyworkerList: ['keyworkerList'],
  toDate: '01/01/2000',
  fromDate: '01/01/1999',
}

const unallocatedInitialState = {
  unallocatedList: [],
}

const offenderSearchInitialState = {
  searchText: '',
  allocationStatus: 'all',
  housingLocation: '',
}

const keyworkerSearchInitialState = {
  searchText: '',
  statusFilter: '',
  keyworkerSearchResults: [],
  keyworkerAllocations: [],
  keyworkerChangeList: [],
  keyworkerList: [],
  keyworker: null,
  status: '',
  capacity: '',
  statusChangeBehaviour: '',
  annualLeaveReturnDate: '',
}

const keyworkerSearchPopulatedState = {
  searchText: 'yes',
  statusFilter: 'UNAVAILABLE',
  keyworkerSearchResults: [{ value: 'search' }],
  keyworkerAllocations: [{ value: 'allocations' }],
  keyworkerChangeList: [],
  keyworkerList: [{ value: 'available keyworkers' }],
  keyworker: { say: 'hello' },
  status: 'ACTIVE',
  capacity: '7',
  statusChangeBehaviour: 'newBehaviour',
  annualLeaveReturnDate: '25/06/2018',
}

const keyworkerSettingsInitialState = {
  capacity: 6,
  extCapacity: 9,
  allowAuto: false,
  sequenceFrequency: 1,
  supported: false,
  migrated: false,
}

const maintainRolesInitialState = {
  roleList: [],
  roleFilterList: [],
  userList: [],
  nameFilter: '',
  roleFilter: '',
  pageNumber: 0,
  pageSize: 10,
  totalRecords: 0,
  contextUser: {},
}

describe('app (global) reducer', () => {
  it('should return the initial state', () => {
    expect(app(undefined, {})).toEqual({
      config: { mailTo: '' },
      user: { activeCaseLoadId: null },
      shouldShowTerms: false,
      error: null,
      message: null,
      loaded: false,
      menuOpen: false,
    })
  })

  it('should handle SET_CONFIG', () => {
    expect(
      app(appInitialState, {
        type: types.SET_CONFIG,
        config: { mailTo: 'a@b.com' },
      })
    ).toEqual({
      error: null,
      message: null,
      config: { mailTo: 'a@b.com' },
      loaded: false,
    })
  })

  it('should handle SET_USER_DETAILS', () => {
    expect(
      app(appInitialState, {
        type: types.SET_USER_DETAILS,
        user: { field: 'value' },
      })
    ).toEqual({
      error: null,
      message: null,
      user: { field: 'value' },
      loaded: false,
    })
  })

  it('should handle SWITCH_AGENCY', () => {
    expect(
      app(appInitialState, {
        type: types.SWITCH_AGENCY,
        activeCaseLoadId: 'BXI',
      })
    ).toEqual({
      error: null,
      message: null,
      user: { activeCaseLoadId: 'BXI' },
      loaded: false,
    })
  })

  it('should handle SET_TERMS_VISIBILITY', () => {
    expect(
      app(appInitialState, {
        type: types.SET_TERMS_VISIBILITY,
        shouldShowTerms: true,
      })
    ).toEqual({
      error: null,
      message: null,
      shouldShowTerms: true,
      loaded: false,
    })
  })

  it('should handle SET_ERROR', () => {
    expect(
      app(appInitialState, {
        type: types.SET_ERROR,
        error: 'HELP!',
      })
    ).toEqual({
      error: 'HELP!',
      message: null,
      loaded: false,
    })
  })

  it('should handle RESET_ERROR', () => {
    expect(
      app(appWithErrorState, {
        type: types.RESET_ERROR,
      })
    ).toEqual({
      error: null,
      message: null,
      loaded: false,
    })
  })

  it('should handle SET_MESSAGE', () => {
    expect(
      app(appInitialState, {
        type: types.SET_MESSAGE,
        message: 'An important message!',
      })
    ).toEqual({
      error: null,
      message: 'An important message!',
      loaded: false,
    })
  })

  it('should handle SET_LOADED', () => {
    expect(
      app(appInitialState, {
        type: types.SET_LOADED,
        loaded: true,
      })
    ).toEqual({
      error: null,
      message: null,
      loaded: true,
    })
  })

  it('should handle SET_VALIDATION_ERROR (first error)', () => {
    expect(
      app(appInitialState, {
        type: types.SET_VALIDATION_ERROR,
        fieldName: 'myField',
        message: 'An error!',
      })
    ).toEqual({
      error: null,
      message: null,
      loaded: false,
      validationErrors: { myField: 'An error!' },
    })
  })

  it('should handle SET_VALIDATION_ERROR (second error)', () => {
    expect(
      app(appWithValidationErrorState, {
        type: types.SET_VALIDATION_ERROR,
        fieldName: 'myField2',
        message: 'Another error!',
      })
    ).toEqual({
      validationErrors: {
        myField: 'An error!',
        myField2: 'Another error!',
      },
    })
  })

  it('should handle RESET_VALIDATION_ERRORS', () => {
    expect(
      app(appWithValidationErrorState, {
        type: types.RESET_VALIDATION_ERRORS,
      })
    ).toEqual({
      validationErrors: null,
    })
  })
})

describe('unallocated reducer', () => {
  it('should return the initial state', () => {
    expect(unallocated(undefined, {})).toEqual({
      unallocatedList: [],
    })
  })

  it('should handle SET_UNALLOCATED', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }]
    expect(
      unallocated(unallocatedInitialState, {
        type: types.SET_UNALLOCATED_LIST,
        unallocatedList: list,
      })
    ).toEqual({
      unallocatedList: list,
    })
  })
})

describe('allocated reducer', () => {
  it('should return the initial state', () => {
    expect(allocated(undefined, {})).toEqual({
      allocatedKeyworkers: [],
      allocatedList: [],
      keyworkerList: [],
      fromDate: moment().format('DD/MM/YYYY'),
      toDate: moment().format('DD/MM/YYYY'),
    })
  })

  it('should handle SET_ALLOCATED_DETAILS', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }]
    const keyWorkers = [{ name: 'Amy', staffId: 123 }]
    expect(
      allocated(allocatedInitialState, {
        type: types.SET_ALLOCATED_DETAILS,
        allocatedList: list,
        keyworkerList: keyWorkers,
      })
    ).toEqual({
      allocatedList: list,
      keyworkerList: keyWorkers,
      fromDate: moment().format('DD/MM/YYYY'),
      toDate: moment().format('DD/MM/YYYY'),
      allocatedKeyworkers: [],
    })
  })

  it('should clear allocated keyworkers when SET_ALLOCATED_DETAILS is dispatched', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }]
    const keyWorkers = [{ name: 'Amy', staffId: 123 }]
    expect(
      allocated(allocatedPopulatedState, {
        type: types.SET_ALLOCATED_DETAILS,
        allocatedList: list,
        keyworkerList: keyWorkers,
      })
    ).toEqual({
      allocatedList: list,
      keyworkerList: keyWorkers,
      fromDate: '01/01/1999',
      toDate: '01/01/2000',
      allocatedKeyworkers: [],
    })
  })

  it('should handle SET_MANUAL_OVERRIDE_LIST', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }]
    expect(
      allocated(allocatedInitialState, {
        type: types.SET_MANUAL_OVERRIDE_LIST,
        allocatedKeyworkers: list,
      })
    ).toEqual({
      allocatedList: [],
      keyworkerList: [],
      fromDate: moment().format('DD/MM/YYYY'),
      toDate: moment().format('DD/MM/YYYY'),
      allocatedKeyworkers: list,
    })
  })

  it('should handle SET_MANUAL_OVERRIDE_DATE_FILTER', () => {
    expect(
      allocated(allocatedPopulatedState, {
        type: types.SET_MANUAL_OVERRIDE_DATE_FILTER,
        date: '01/01/1888',
        dateName: 'fromDate',
      })
    ).toEqual({
      allocatedKeyworkers: ['allocatedKeyworkers'],
      allocatedList: ['allocatedList'],
      keyworkerList: ['keyworkerList'],
      fromDate: '01/01/1888',
      toDate: '01/01/2000',
    })
  })
})

describe('offender search reducer', () => {
  it('should return the initial state', () => {
    expect(offenderSearch(undefined, {})).toEqual({
      searchText: '',
      allocationStatus: 'all',
      locations: [],
      housingLocation: '',
    })
  })
  it('should handle SET_OFFENDER_SEARCH_TEXT', () => {
    expect(
      offenderSearch(offenderSearchInitialState, {
        type: types.SET_OFFENDER_SEARCH_TEXT,
        searchText: 'birdman of Alcatraz',
      })
    ).toEqual({
      searchText: 'birdman of Alcatraz',
      allocationStatus: 'all',
      housingLocation: '',
    })
  })

  it('should handle SET_OFFENDER_SEARCH_ALLOCATION_STATUS', () => {
    expect(
      offenderSearch(offenderSearchInitialState, {
        type: types.SET_OFFENDER_SEARCH_ALLOCATION_STATUS,
        allocationStatus: 'unallocated',
      })
    ).toEqual({
      searchText: '',
      allocationStatus: 'unallocated',
      housingLocation: '',
    })
  })

  it('should handle SET_OFFENDER_SEARCH_HOUSING_LOCATION', () => {
    expect(
      offenderSearch(offenderSearchInitialState, {
        type: types.SET_OFFENDER_SEARCH_HOUSING_LOCATION,
        housingLocation: 'Block C',
      })
    ).toEqual({
      searchText: '',
      allocationStatus: 'all',
      housingLocation: 'Block C',
    })
  })

  it('should handle SET_OFFENDER_SEARCH_LOCATIONS', () => {
    expect(
      offenderSearch(offenderSearchInitialState, {
        type: types.SET_OFFENDER_SEARCH_LOCATIONS,
        locations: ['The Sistine Chapel'],
      })
    ).toEqual({
      searchText: '',
      allocationStatus: 'all',
      housingLocation: '',
      locations: ['The Sistine Chapel'],
    })
  })

  it('should handle SET_OFFENDER_SEARCH_RESULTS', () => {
    expect(
      offenderSearch(offenderSearchInitialState, {
        type: types.SET_OFFENDER_SEARCH_RESULTS,
        offenderResults: [{ lastName: 'Bloggs' }],
      })
    ).toEqual({
      searchText: '',
      allocationStatus: 'all',
      housingLocation: '',
      offenderResults: [{ lastName: 'Bloggs' }],
    })
  })
})

describe('key worker search reducer', () => {
  it('should handle SET_KEY_WORKER_SEARCH_TEXT', () => {
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_KEY_WORKER_SEARCH_TEXT,
        searchText: 'Kelly Keyworker',
      })
    ).toEqual({
      searchText: 'Kelly Keyworker',
      statusFilter: '',
      keyworkerSearchResults: [],
      keyworkerAllocations: [],
      keyworkerChangeList: [],
      keyworkerList: [],
      keyworker: null,
      status: '',
      capacity: '',
      statusChangeBehaviour: '',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_KEY_WORKER_STATUS_FILTER', () => {
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_KEY_WORKER_STATUS_FILTER,
        statusFilter: 'INACTIVE',
      })
    ).toEqual({
      searchText: '',
      statusFilter: 'INACTIVE',
      keyworkerSearchResults: [],
      keyworkerAllocations: [],
      keyworkerChangeList: [],
      keyworkerList: [],
      keyworker: null,
      status: '',
      capacity: '',
      statusChangeBehaviour: '',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_KEY_WORKER_SEARCH_RESULTS', () => {
    const list = [{ firstName: 'Jack', surname: 'Brown' }]
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_KEY_WORKER_SEARCH_RESULTS_LIST,
        keyworkerSearchResults: list,
      })
    ).toEqual({
      searchText: '',
      statusFilter: '',
      keyworkerSearchResults: list,
      keyworkerAllocations: [],
      keyworkerChangeList: [],
      keyworkerList: [],
      keyworker: null,
      status: '',
      capacity: '',
      statusChangeBehaviour: '',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_KEY_WORKER', () => {
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_KEY_WORKER,
        keyworker: { key: 'value' },
      })
    ).toEqual({
      searchText: '',
      statusFilter: '',
      keyworkerSearchResults: [],
      keyworkerAllocations: [],
      keyworkerChangeList: [],
      keyworkerList: [],
      keyworker: { key: 'value' },
      status: '',
      capacity: '',
      statusChangeBehaviour: '',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_KEY_WORKER_STATS', () => {
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_KEY_WORKER_STATS,
        stats: { hello: 'world' },
      })
    ).toEqual({
      searchText: '',
      statusFilter: '',
      keyworkerSearchResults: [],
      keyworkerAllocations: [],
      keyworkerChangeList: [],
      keyworkerList: [],
      keyworker: { stats: { hello: 'world' } },
      status: '',
      capacity: '',
      statusChangeBehaviour: '',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_KEY_WORKER_CHANGE_LIST', () => {
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_KEY_WORKER_CHANGE_LIST,
        keyworkerChangeList: [{ key: 'value' }],
      })
    ).toEqual({
      searchText: '',
      statusFilter: '',
      keyworkerSearchResults: [],
      keyworkerAllocations: [],
      keyworkerChangeList: [{ key: 'value' }],
      keyworkerList: [],
      keyworker: null,
      status: '',
      capacity: '',
      statusChangeBehaviour: '',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_AVAILABLE_KEY_WORKER_LIST', () => {
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_AVAILABLE_KEY_WORKER_LIST,
        keyworkerList: [{ key: 'value' }],
      })
    ).toEqual({
      searchText: '',
      statusFilter: '',
      keyworkerSearchResults: [],
      keyworkerAllocations: [],
      keyworkerChangeList: [],
      keyworkerList: [{ key: 'value' }],
      keyworker: null,
      status: '',
      capacity: '',
      statusChangeBehaviour: '',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_KEY_WORKER_CAPACITY', () => {
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_KEY_WORKER_CAPACITY,
        capacity: '9',
      })
    ).toEqual({
      searchText: '',
      statusFilter: '',
      keyworkerSearchResults: [],
      keyworkerAllocations: [],
      keyworkerChangeList: [],
      keyworkerList: [],
      keyworker: null,
      status: '',
      capacity: '9',
      statusChangeBehaviour: '',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_KEY_WORKER_STATUS', () => {
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_KEY_WORKER_STATUS,
        status: 'Unavailable',
      })
    ).toEqual({
      searchText: '',
      statusFilter: '',
      keyworkerSearchResults: [],
      keyworkerAllocations: [],
      keyworkerChangeList: [],
      keyworkerList: [],
      keyworker: null,
      status: 'Unavailable',
      capacity: '',
      statusChangeBehaviour: '',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR', () => {
    expect(
      keyworkerSearch(keyworkerSearchInitialState, {
        type: types.SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR,
        statusChangeBehaviour: 'runAround',
      })
    ).toEqual({
      searchText: '',
      statusFilter: '',
      keyworkerSearchResults: [],
      keyworkerAllocations: [],
      keyworkerChangeList: [],
      keyworkerList: [],
      keyworker: null,
      status: '',
      capacity: '',
      statusChangeBehaviour: 'runAround',
      annualLeaveReturnDate: '',
    })
  })

  it('should handle SET_KEY_WORKER maintaining existing state', () => {
    expect(
      keyworkerSearch(keyworkerSearchPopulatedState, {
        type: types.SET_KEY_WORKER,
        keyworker: { key: 'value' },
      })
    ).toEqual({
      searchText: 'yes',
      statusFilter: 'UNAVAILABLE',
      keyworkerSearchResults: [{ value: 'search' }],
      keyworkerAllocations: [{ value: 'allocations' }],
      keyworkerChangeList: [],
      keyworkerList: [{ value: 'available keyworkers' }],
      keyworker: { key: 'value' },
      status: 'ACTIVE',
      capacity: '7',
      statusChangeBehaviour: 'newBehaviour',
      annualLeaveReturnDate: '25/06/2018',
    })
  })

  it('should handle SET_ANNUAL_LEAVE_RETURN_DATE maintaining existing state', () => {
    expect(
      keyworkerSearch(keyworkerSearchPopulatedState, {
        type: types.SET_ANNUAL_LEAVE_RETURN_DATE,
        annualLeaveReturnDate: '23/23/2017',
      })
    ).toEqual({
      searchText: 'yes',
      statusFilter: 'UNAVAILABLE',
      keyworkerSearchResults: [{ value: 'search' }],
      keyworkerAllocations: [{ value: 'allocations' }],
      keyworkerChangeList: [],
      keyworkerList: [{ value: 'available keyworkers' }],
      keyworker: { say: 'hello' },
      status: 'ACTIVE',
      capacity: '7',
      statusChangeBehaviour: 'newBehaviour',
      annualLeaveReturnDate: '23/23/2017',
    })
  })
  it('should handle SET_MENU_OPEN', () => {
    let state = app(appInitialState, setMenuOpen(true))

    expect(state.menuOpen).toBe(true)

    state = app(appInitialState, setMenuOpen(false))

    expect(state.menuOpen).toBe(false)
  })
})

describe('key worker settings reducer', () => {
  it('should return the initial state', () => {
    expect(keyworkerSettings(undefined, {})).toEqual(keyworkerSettingsInitialState)
  })

  it('should handle SET_KEYWORKER_SETTINGS_CAPACITY', () => {
    const updatedKeyworkerSettings = keyworkerSettingsInitialState
    updatedKeyworkerSettings.capacity = 4
    expect(
      keyworkerSettings(keyworkerSettingsInitialState, {
        type: types.SET_KEYWORKER_SETTINGS_CAPACITY,
        capacity: 4,
      })
    ).toEqual(updatedKeyworkerSettings)
  })

  it('should handle SET_KEYWORKER_SETTINGS_EXT_CAPACITY', () => {
    const updatedKeyworkerSettings = keyworkerSettingsInitialState
    updatedKeyworkerSettings.extCapacity = 11
    expect(
      keyworkerSettings(keyworkerSettingsInitialState, {
        type: types.SET_KEYWORKER_SETTINGS_EXT_CAPACITY,
        extCapacity: 11,
      })
    ).toEqual(updatedKeyworkerSettings)
  })

  it('should handle SET_KEYWORKER_SETTINGS_SEQUENCE_FREQUENCY', () => {
    const updatedKeyworkerSettings = keyworkerSettingsInitialState
    updatedKeyworkerSettings.sequenceFrequency = 11
    expect(
      keyworkerSettings(keyworkerSettingsInitialState, {
        type: types.SET_KEYWORKER_SETTINGS_SEQUENCE_FREQUENCY,
        sequenceFrequency: 11,
      })
    ).toEqual(updatedKeyworkerSettings)
  })

  it('should handle SET_KEYWORKER_SETTINGS_ALLOW_AUTO_ALLOCATION', () => {
    const updatedKeyworkerSettings = keyworkerSettingsInitialState
    updatedKeyworkerSettings.allowAuto = true
    expect(
      keyworkerSettings(keyworkerSettingsInitialState, {
        type: types.SET_KEYWORKER_SETTINGS_ALLOW_AUTO_ALLOCATION,
        allowAuto: true,
      })
    ).toEqual(updatedKeyworkerSettings)
  })

  it('should handle SET_KEYWORKER_SETTINGS_MIGRATED', () => {
    const updatedKeyworkerSettings = keyworkerSettingsInitialState
    updatedKeyworkerSettings.migrated = true
    expect(
      keyworkerSettings(keyworkerSettingsInitialState, {
        type: types.SET_KEYWORKER_SETTINGS_MIGRATED,
        migrated: true,
      })
    ).toEqual(updatedKeyworkerSettings)
  })

  it('should handle SET_KEYWORKER_SETTINGS_SUPPORTED', () => {
    const updatedKeyworkerSettings = keyworkerSettingsInitialState
    updatedKeyworkerSettings.supported = true
    expect(
      keyworkerSettings(keyworkerSettingsInitialState, {
        type: types.SET_KEYWORKER_SETTINGS_SUPPORTED,
        supported: true,
      })
    ).toEqual(updatedKeyworkerSettings)
  })

  it('should handle SET_KEYWORKER_SETTINGS', () => {
    const updatedKeyworkerSettings = keyworkerSettingsInitialState
    updatedKeyworkerSettings.supported = true
    updatedKeyworkerSettings.capacity = 1
    updatedKeyworkerSettings.extCapacity = 2
    updatedKeyworkerSettings.sequenceFrequency = 3
    updatedKeyworkerSettings.allowAuto = true
    updatedKeyworkerSettings.migrated = true

    expect(
      keyworkerSettings(keyworkerSettingsInitialState, {
        type: types.SET_KEYWORKER_SETTINGS,
        supported: true,
        migrated: true,
        allowAuto: true,
        capacity: 1,
        extCapacity: 2,
        sequenceFrequency: 3,
      })
    ).toEqual(updatedKeyworkerSettings)
  })
})

describe('Maintain roles reducer', () => {
  it('should return the initial state', () => {
    expect(maintainRoles(undefined, {})).toEqual(maintainRolesInitialState)
  })

  it('should handle SET_USER_SEARCH_ROLE_FILTER', () => {
    const updatedMaintainRoles = maintainRolesInitialState
    updatedMaintainRoles.roleFilter = 'newRole'
    expect(
      maintainRoles(maintainRolesInitialState, {
        type: types.SET_USER_SEARCH_ROLE_FILTER,
        roleFilter: 'newRole',
      })
    ).toEqual(updatedMaintainRoles)
  })

  it('should handle SET_USER_SEARCH_NAME_FILTER', () => {
    const updatedMaintainRoles = maintainRolesInitialState
    updatedMaintainRoles.nameFilter = 'name'
    expect(
      maintainRoles(maintainRolesInitialState, {
        type: types.SET_USER_SEARCH_NAME_FILTER,
        nameFilter: 'name',
      })
    ).toEqual(updatedMaintainRoles)
  })

  it('should handle SET_USER_SEARCH_PAGINATION_PAGE_SIZE', () => {
    const updatedMaintainRoles = maintainRolesInitialState
    updatedMaintainRoles.pageSize = 5
    expect(
      maintainRoles(maintainRolesInitialState, {
        type: types.SET_USER_SEARCH_PAGINATION_PAGE_SIZE,
        pageSize: 5,
      })
    ).toEqual(updatedMaintainRoles)
  })

  it('should handle SET_USER_SEARCH_PAGINATION_PAGE_NUMBER', () => {
    const updatedMaintainRoles = maintainRolesInitialState
    updatedMaintainRoles.pageNumber = 5
    expect(
      maintainRoles(maintainRolesInitialState, {
        type: types.SET_USER_SEARCH_PAGINATION_PAGE_NUMBER,
        pageNumber: 5,
      })
    ).toEqual(updatedMaintainRoles)
  })

  it('should handle SET_USER_SEARCH_PAGINATION_TOTAL_RECORDS', () => {
    const updatedMaintainRoles = maintainRolesInitialState
    updatedMaintainRoles.totalRecords = 5
    expect(
      maintainRoles(maintainRolesInitialState, {
        type: types.SET_USER_SEARCH_PAGINATION_TOTAL_RECORDS,
        totalRecords: 5,
      })
    ).toEqual(updatedMaintainRoles)
  })

  it('should handle SET_USER_SEARCH_ROLE_LIST', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }]
    const updatedMaintainRoles = maintainRolesInitialState
    updatedMaintainRoles.roleList = list
    expect(
      maintainRoles(maintainRolesInitialState, {
        type: types.SET_USER_SEARCH_ROLE_LIST,
        roleList: list,
      })
    ).toEqual(updatedMaintainRoles)
  })

  it('should handle SET_USER_SEARCH_ROLE_FILTER_LIST', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }]
    const updatedMaintainRoles = maintainRolesInitialState
    updatedMaintainRoles.roleFilterList = list
    expect(
      maintainRoles(maintainRolesInitialState, {
        type: types.SET_USER_SEARCH_ROLE_FILTER_LIST,
        roleFilterList: list,
      })
    ).toEqual(updatedMaintainRoles)
  })

  it('should handle SET_USER_SEARCH_USER_LIST', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }]
    const updatedMaintainRoles = maintainRolesInitialState
    updatedMaintainRoles.userList = list
    expect(
      maintainRoles(maintainRolesInitialState, {
        type: types.SET_USER_SEARCH_RESULTS_LIST,
        userList: list,
      })
    ).toEqual(updatedMaintainRoles)
  })

  it('should handle SET_USER_SEARCH_CONTEXT_USER', () => {
    const user = { firstName: 'Jack', lastName: 'Jill' }
    const updatedMaintainRoles = maintainRolesInitialState
    updatedMaintainRoles.contextUser = user
    expect(
      maintainRoles(maintainRolesInitialState, {
        type: types.SET_USER_SEARCH_CONTEXT_USER,
        contextUser: user,
      })
    ).toEqual(updatedMaintainRoles)
  })
})
