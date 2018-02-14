import * as actions from '../actions';
import * as types from './ActionTypes';

describe('actions', () => {
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
});

