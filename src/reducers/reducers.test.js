import { unallocated, allocated, app } from '../reducers';
import * as types from '../actions/ActionTypes';
import moment from 'Moment';

const appInitialState = {
  error: null,
  page: 0
};

const allocatedInitialState = {
  allocatedKeyworkers: [],
  allocatedList: [],
  keyworkerList: [],
  toDate: moment().format('DD/MM/YYYY'),
  fromDate: moment().format('DD/MM/YYYY')
};

const allocatedPopulatedState = {
  allocatedKeyworkers: ['allocatedKeyworkers'],
  allocatedList: ['allocatedList'],
  keyworkerList: ['keyworkerList'],
  toDate: '01/01/2000',
  fromDate: '01/01/1999'
};

const unallocatedInitialState = {
  unallocatedList: []
};

describe('app (global) reducer', () => {
  it('should return the initial state', () => {
    expect(app(undefined, {})).toEqual(
      {
        page: 0,
        error: null
      }
    );
  });

  it('should handle SET_CURRENT_PAGE', () => {
    expect(
      app(appInitialState, {
        type: types.SET_CURRENT_PAGE,
        page: 1
      })
    ).toEqual(
      {
        page: 1,
        error: null
      }
    );
  });
  it('should handle SET_ERROR', () => {
    expect(
      app(appInitialState, {
        type: types.SET_ERROR,
        error: 'HELP!'
      })
    ).toEqual(
      {
        page: 0,
        error: 'HELP!'
      }
    );
  });
});

describe('unallocated reducer', () => {
  it('should return the initial state', () => {
    expect(unallocated(undefined, {})).toEqual(
      {
        unallocatedList: []
      }
    );
  });

  it('should handle SET_UNALLOCATED', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }];
    expect(
      unallocated(unallocatedInitialState, {
        type: types.SET_UNALLOCATED_LIST,
        unallocatedList: list
      })
    ).toEqual(
      {
        unallocatedList: list
      }
    );
  });
});

describe('allocated reducer', () => {
  it('should return the initial state', () => {
    expect(allocated(undefined, {})).toEqual(
      {
        allocatedKeyworkers: [],
        allocatedList: [],
        keyworkerList: [],
        fromDate: moment().format('DD/MM/YYYY'),
        toDate: moment().format('DD/MM/YYYY')
      }
    );
  });

  it('should handle SET_ALLOCATED_DETAILS', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }];
    const keyWorkers = [{ name: 'Amy', staffId: 123 }];
    expect(
      allocated(allocatedInitialState, {
        type: types.SET_ALLOCATED_DETAILS,
        allocatedList: list,
        keyworkerList: keyWorkers
      })
    ).toEqual(
      {
        allocatedList: list,
        keyworkerList: keyWorkers,
        fromDate: moment().format('DD/MM/YYYY'),
        toDate: moment().format('DD/MM/YYYY'),
        allocatedKeyworkers: []
      }
    );
  });

  it('should clear allocated keyworkers when SET_ALLOCATED_DETAILS is dispatched', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }];
    const keyWorkers = [{ name: 'Amy', staffId: 123 }];
    expect(
      allocated(allocatedPopulatedState, {
        type: types.SET_ALLOCATED_DETAILS,
        allocatedList: list,
        keyworkerList: keyWorkers
      })
    ).toEqual(
      {
        allocatedList: list,
        keyworkerList: keyWorkers,
        fromDate: '01/01/1999',
        toDate: '01/01/2000',
        allocatedKeyworkers: []
      }
    );
  });

  it('should handle SET_MANUAL_OVERRIDE_LIST', () => {
    const list = [{ name: 'Jack', keyworker: 'Jill' }];
    expect(
      allocated(allocatedInitialState, {
        type: types.SET_MANUAL_OVERRIDE_LIST,
        allocatedKeyworkers: list
      })
    ).toEqual(
      {
        allocatedList: [],
        keyworkerList: [],
        fromDate: moment().format('DD/MM/YYYY'),
        toDate: moment().format('DD/MM/YYYY'),
        allocatedKeyworkers: list
      }
    );
  });

  it('should handle SET_MANUAL_OVERRIDE_DATE_FILTER', () => {
    expect(
      allocated(allocatedPopulatedState, {
        type: types.SET_MANUAL_OVERRIDE_DATE_FILTER,
        date: '01/01/1888',
        dateName: 'fromDate'
      })
    ).toEqual(
      {
        allocatedKeyworkers: ['allocatedKeyworkers'],
        allocatedList: ['allocatedList'],
        keyworkerList: ['keyworkerList'],
        fromDate: '01/01/1888',
        toDate: '01/01/2000'
      }
    );
  });
});
