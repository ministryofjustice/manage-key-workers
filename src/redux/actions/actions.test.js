import * as actions from './index';
import * as types from './actionTypes';

describe('actions', () => {
  it('should create an action to update the config', () => {
    const expectedAction = {
      type: types.SET_CONFIG,
      config: {
        mailTo: 'a@b.com'
      }
    };
    expect(actions.setConfig({ mailTo: 'a@b.com' })).toEqual(expectedAction);
  });

  it('should create an action to setup login details', () => {
    const user = { field: 'user' };
    const expectedAction = {
      type: types.SET_USER_DETAILS,
      user
    };
    expect(actions.setUserDetails(user)).toEqual(expectedAction);
  });

  it('should create an action to switch current Agency', () => {
    const activeCaseLoadId = 'LEI';
    const expectedAction = {
      type: types.SWITCH_AGENCY,
      activeCaseLoadId
    };
    expect(actions.switchAgency(activeCaseLoadId)).toEqual(expectedAction);
  });

  it('should create an action to toggle ts and cs', () => {
    const shouldShowTerms = true;
    const expectedAction = {
      type: types.SET_TERMS_VISIBILITY,
      shouldShowTerms
    };
    expect(actions.setTermsVisibility(shouldShowTerms)).toEqual(expectedAction);
  });

  it('should create an action to update the manual override List', () => {
    const keyworkerAllocations = ['keyworker allocation'];
    const expectedAction = {
      type: types.SET_MANUAL_OVERRIDE_LIST,
      allocatedKeyworkers: keyworkerAllocations
    };
    expect(actions.manualOverride(keyworkerAllocations)).toEqual(expectedAction);
  });

  it('should create an action to update the unallocated List', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }];
    const expectedAction = {
      type: types.SET_UNALLOCATED_LIST,
      unallocatedList: list
    };
    expect(actions.setUnallocatedList(list)).toEqual(expectedAction);
  });

  it('should create an action to update the allocated List', () => {
    const allocated = [{ name: 'Jack', keyworker: 'Jill' }];
    const keyWorkers = [{ name: 'Amy', staffId: 123 }];
    const expectedAction = {
      type: types.SET_ALLOCATED_DETAILS,
      allocatedList: allocated,
      keyworkerList: keyWorkers,
      allocatedKeyworkers: []
    };
    expect(actions.setAllocatedDetails(allocated, keyWorkers)).toEqual(expectedAction);
  });

  it('should create an action to update the manual override List', () => {
    const keyworkerAllocations = ['keyworker allocation'];
    const expectedAction = {
      type: types.SET_MANUAL_OVERRIDE_LIST,
      allocatedKeyworkers: keyworkerAllocations
    };
    expect(actions.manualOverride(keyworkerAllocations)).toEqual(expectedAction);
  });

  it('should create an action to update the manual override date filter', () => {
    const expectedAction = {
      type: types.SET_MANUAL_OVERRIDE_DATE_FILTER,
      date: '24/01/2018',
      dateName: 'fromDate'
    };
    expect(actions.manualOverrideDateFilter('fromDate', '24/01/2018')).toEqual(expectedAction);
  });

  it('should create an action to store an error', () => {
    const expectedAction = {
      type: types.SET_ERROR,
      error: 'Something went wrong'
    };
    expect(actions.setError('Something went wrong')).toEqual(expectedAction);
  });

  it('should create an action to reset the global error state', () => {
    const expectedAction = {
      type: types.RESET_ERROR
    };
    expect(actions.resetError()).toEqual(expectedAction);
  });

  it('should create an action to store an info message', () => {
    const expectedAction = {
      type: types.SET_MESSAGE,
      message: 'Your stuff was saved.'
    };
    expect(actions.setMessage('Your stuff was saved.')).toEqual(expectedAction);
  });

  it('should create an action to update a loaded flag for rendering', () => {
    const expectedAction = {
      type: types.SET_LOADED,
      loaded: true
    };
    expect(actions.setLoaded(true)).toEqual(expectedAction);
  });

  it('should create an action to save offender search criteria - text', () => {
    const expectedAction = {
      type: types.SET_OFFENDER_SEARCH_TEXT,
      searchText: 'James,Troy'
    };
    expect(actions.setOffenderSearchText('James,Troy')).toEqual(expectedAction);
  });

  it('should create an action to save offender search criteria - housing location', () => {
    const expectedAction = {
      type: types.SET_OFFENDER_SEARCH_HOUSING_LOCATION,
      housingLocation: 'Block B'
    };
    expect(actions.setOffenderSearchHousingLocation('Block B')).toEqual(expectedAction);
  });

  it('should create an action to save offender search criteria - allocation status', () => {
    const expectedAction = {
      type: types.SET_OFFENDER_SEARCH_ALLOCATION_STATUS,
      allocationStatus: 'unallocated'
    };
    expect(actions.setOffenderSearchAllocationStatus('unallocated')).toEqual(expectedAction);
  });

  it('should create an action to set offender search locations', () => {
    const expectedAction = {
      type: types.SET_OFFENDER_SEARCH_LOCATIONS,
      locations: ['loc1', 'loc2']
    };
    expect(actions.setOffenderSearchLocations(['loc1', 'loc2'])).toEqual(expectedAction);
  });

  it('should create an action to save offender search results', () => {
    const expectedAction = {
      type: types.SET_OFFENDER_SEARCH_RESULTS,
      offenderResults: [{ data: "data1" }, { data: "data2" }]
    };
    expect(actions.setOffenderSearchResults([{ data: "data1" }, { data: "data2" }])).toEqual(expectedAction);
  });

  it('should create an action to save key worker search criteria - text', () => {
    const expectedAction = {
      type: types.SET_KEY_WORKER_SEARCH_TEXT,
      searchText: 'James,Troy'
    };
    expect(actions.setKeyworkerSearchText('James,Troy')).toEqual(expectedAction);
  });

  it('should create an action to save key worker search criteria - status', () => {
    const expectedAction = {
      type: types.SET_KEY_WORKER_STATUS_FILTER,
      statusFilter: 'ACTIVE'
    };
    expect(actions.setKeyworkerStatusFilter('ACTIVE')).toEqual(expectedAction);
  });

  it('should create an action to save key worker search results', () => {
    const list = [{ firstName: 'Jack', surname: 'Brown' }];
    const expectedAction = {
      type: types.SET_KEY_WORKER_SEARCH_RESULTS_LIST,
      keyworkerSearchResults: list
    };
    expect(actions.setKeyworkerSearchResults(list)).toEqual(expectedAction);
  });

  it('should create an action to save key worker allocations list', () => {
    const list = [{ firstName: 'Jack', surname: 'Brown' }];
    const expectedAction = {
      type: types.SET_KEY_WORKER_ALLOCATION_LIST,
      keyworkerAllocations: list
    };
    expect(actions.setKeyworkerAllocationList(list)).toEqual(expectedAction);
  });

  it('should create an action to save context key worker', () => {
    const expectedAction = {
      type: types.SET_KEY_WORKER,
      keyworker: { key: 'value' }
    };
    expect(actions.setKeyworker({ key: 'value' })).toEqual(expectedAction);
  });

  it('should create an action to save key worker allocation changes', () => {
    const list = [{ firstName: 'Jack', surname: 'Brown' }];
    const expectedAction = {
      type: types.SET_KEY_WORKER_CHANGE_LIST,
      keyworkerChangeList: list
    };
    expect(actions.setKeyworkerChangeList(list)).toEqual(expectedAction);
  });

  it('should create an action to save the available key worker list', () => {
    const list = [{ firstName: 'Jack', surname: 'Brown' }];
    const expectedAction = {
      type: types.SET_AVAILABLE_KEY_WORKER_LIST,
      keyworkerList: list
    };
    expect(actions.setAvailableKeyworkerList(list)).toEqual(expectedAction);
  });

  it('should create an action to save key worker status', () => {
    const expectedAction = {
      type: types.SET_KEY_WORKER_STATUS,
      status: 'Inactive'
    };
    expect(actions.setKeyworkerStatus('Inactive')).toEqual(expectedAction);
  });

  it('should create an action to save key worker capacity', () => {
    const expectedAction = {
      type: types.SET_KEY_WORKER_CAPACITY,
      capacity: 8
    };
    expect(actions.setKeyworkerCapacity(8)).toEqual(expectedAction);
  });

  it('should create an action to save key worker status change behaviour', () => {
    const expectedAction = {
      type: types.SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR,
      statusChangeBehaviour: 'keepAllocated'
    };
    expect(actions.setKeyworkerStatusChangeBehaviour('keepAllocated')).toEqual(expectedAction);
  });

  it('should create an action to save annual leave return date', () => {
    const expectedAction = {
      type: types.SET_ANNUAL_LEAVE_RETURN_DATE,
      annualLeaveReturnDate: '23/4/2005'
    };
    expect(actions.setAnnualLeaveReturnDate('23/4/2005')).toEqual(expectedAction);
  });

  it('should create a validation error', () => {
    const expectedAction = {
      type: types.SET_VALIDATION_ERROR,
      fieldName: 'aField',
      message: 'a message'
    };
    expect(actions.setValidationError('aField', 'a message')).toEqual(expectedAction);
  });

  it('should clear all validation errors', () => {
    const expectedAction = {
      type: types.RESET_VALIDATION_ERRORS
    };
    expect(actions.resetValidationErrors()).toEqual(expectedAction);
  });

  it('should create an action to save key worker setting -  capacity', () => {
    const expectedAction = {
      type: types.SET_KEYWORKER_SETTINGS_CAPACITY,
      capacity: 8
    };
    expect(actions.setSettingsCapacity(8)).toEqual(expectedAction);
  });

  it('should create an action to save key worker setting -  ext capacity', () => {
    const expectedAction = {
      type: types.SET_KEYWORKER_SETTINGS_EXT_CAPACITY,
      extCapacity: 10
    };
    expect(actions.setSettingsExtCapacity(10)).toEqual(expectedAction);
  });

  it('should create an action to save key worker setting -  sequence frequency', () => {
    const expectedAction = {
      type: types.SET_KEYWORKER_SETTINGS_SEQUENCE_FREQUENCY,
      sequenceFrequency: 1
    };
    expect(actions.setSettingsSequenceFrequency(1)).toEqual(expectedAction);
  });

  it('should create an action to save key worker setting -  allow auto allocation', () => {
    const expectedAction = {
      type: types.SET_KEYWORKER_SETTINGS_ALLOW_AUTO_ALLOCATION,
      allowAuto: true
    };
    expect(actions.setSettingsAllowAutoAllocation(true)).toEqual(expectedAction);
  });

  it('should create an action to save key worker setting -  supported', () => {
    const expectedAction = {
      type: types.SET_KEYWORKER_SETTINGS_SUPPORTED,
      supported: true
    };
    expect(actions.setSettingsSupported(true)).toEqual(expectedAction);
  });

  it('should create an action to save key worker setting -  migrated', () => {
    const expectedAction = {
      type: types.SET_KEYWORKER_SETTINGS_MIGRATED,
      migrated: true
    };
    expect(actions.setSettingsMigrated(true)).toEqual(expectedAction);
  });

  it('should create an action to save key worker settings', () => {
    const settings = { migrated: true, capacity: 5, extCapacity: 6, allowAuto: false, supported: false, sequenceFrequency: 2 };
    const expectedAction = {
      type: types.SET_KEYWORKER_SETTINGS,
      migrated: true,
      allowAuto: false,
      capacity: 5,
      extCapacity: 6,
      sequenceFrequency: 2,
      supported: false
    };
    expect(actions.setSettings(settings)).toEqual(expectedAction);
  });

  it('should create an action to save maintain roles user list', () => {
    const list = [{ firstName: 'Jack', surname: 'Brown' }];
    const expectedAction = {
      type: types.SET_USER_SEARCH_RESULTS_LIST,
      userList: list
    };
    expect(actions.setMaintainRolesUserList(list)).toEqual(expectedAction);
  });

  it('should create an action to save maintain roles role list', () => {
    const list = [{ roleCode: 'Jack' }, { roleCode: 'Jill' }];
    const expectedAction = {
      type: types.SET_USER_SEARCH_ROLE_LIST,
      roleList: list
    };
    expect(actions.setMaintainRolesRoleList(list)).toEqual(expectedAction);
  });

  it('should create an action to save maintain roles role filter list', () => {
    const list = [{ roleCode: 'Jack' }, { roleCode: 'Jill' }];
    const expectedAction = {
      type: types.SET_USER_SEARCH_ROLE_FILTER_LIST,
      roleFilterList: list
    };
    expect(actions.setMaintainRolesRoleFilterList(list)).toEqual(expectedAction);
  });

  it('should create an action to save user search page size', () => {
    const expectedAction = {
      type: types.SET_USER_SEARCH_PAGINATION_PAGE_SIZE,
      pageSize: 4
    };
    expect(actions.setMaintainRolesUserPageSize(4)).toEqual(expectedAction);
  });

  it('should create an action to save user search page number', () => {
    const expectedAction = {
      type: types.SET_USER_SEARCH_PAGINATION_PAGE_NUMBER,
      pageNumber: 6
    };
    expect(actions.setMaintainRolesUserPageNumber(6)).toEqual(expectedAction);
  });

  it('should create an action to save user search total records', () => {
    const expectedAction = {
      type: types.SET_USER_SEARCH_PAGINATION_TOTAL_RECORDS,
      totalRecords: 6
    };
    expect(actions.setMaintainRolesUserTotalRecords(6)).toEqual(expectedAction);
  });

  it('should create an action to save a maintain roles name filter', () => {
    const expectedAction = {
      type: types.SET_USER_SEARCH_NAME_FILTER,
      nameFilter: 'aField'
    };
    expect(actions.setMaintainRolesNameFilter('aField')).toEqual(expectedAction);
  });

  it('should create an action to save a maintain roles role filter', () => {
    const expectedAction = {
      type: types.SET_USER_SEARCH_ROLE_FILTER,
      roleFilter: 'aField'
    };
    expect(actions.setMaintainRolesRoleFilter('aField')).toEqual(expectedAction);
  });
});

