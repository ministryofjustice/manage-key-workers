import * as actions from './index';
import * as types from './actionTypes';

describe('actions', () => {
  it('should create an action to setup login details', () => {
    const jwt = 'myjwt';
    const user = { field: 'user' };
    const expectedAction = {
      type: types.SET_LOGIN_DETAILS,
      jwt, user
    };
    expect(actions.setLoginDetails(jwt, user)).toEqual(expectedAction);
  });

  it('should create an action to change login input', () => {
    const fieldName = 'username';
    const value = 'me';
    const expectedAction = {
      type: types.SET_LOGIN_INPUT_CHANGE,
      fieldName, value
    };
    expect(actions.setLoginInputChange(fieldName, value)).toEqual(expectedAction);
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

  it('should create an action to set the current page', () => {
    const expectedAction = {
      type: types.SET_CURRENT_PAGE,
      page: 1
    };
    expect(actions.setCurrentPage(1)).toEqual(expectedAction);
  });

  it('should create an action to store an error', () => {
    const expectedAction = {
      type: types.SET_ERROR,
      error: 'Something went wrong'
    };
    expect(actions.setError('Something went wrong')).toEqual(expectedAction);
  });

  it('should create an action to store an info message', () => {
    const expectedAction = {
      type: types.SET_MESSAGE,
      message: 'Your stuff was saved.'
    };
    expect(actions.setMessage('Your stuff was saved.')).toEqual(expectedAction);
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
      allocationStatus: 'A'
    };
    expect(actions.setOffenderSearchAllocationStatus('A')).toEqual(expectedAction);
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
});

