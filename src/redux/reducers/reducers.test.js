import { unallocated, allocated, app, prisonerSearch, keyworkerSearch } from './index';
import * as types from '../actions/actionTypes';
import moment from 'moment';

const appInitialState = {
  error: null,
  page: 0,
  message: null
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

const prisonerSearchInitialState = {
  searchText: null,
  housingLocation: null,
  allocationStatus: null
};

const keyworkerSearchInitialState = {
  searchText: '',
  keyworkerSearchResults: [],
  keyworkerAllocations: [],
  keyworker: null
};

const keyworkerSearchPopulatedState = {
  searchText: 'yes',
  keyworkerSearchResults: [{ value: 'search' }],
  keyworkerAllocations: [{ value: 'allocations' }],
  keyworker: 321
};

describe('app (global) reducer', () => {
  it('should return the initial state', () => {
    expect(app(undefined, {})).toEqual(
      {
        user: { activeCaseLoadId: null },
        shouldShowTerms: false,
        error: null,
        message: null,
        username: '',
        password: '',
        page: 0
      }
    );
  });

  it('should handle SET_LOGIN_DETAILS', () => {
    expect(
      app(appInitialState, {
        type: types.SET_LOGIN_DETAILS,
        jwt: 'hithere',
        user: { field: 'value' }
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: null,
        jwt: 'hithere',
        user: { field: 'value' }
      }
    );
  });

  it('should handle SET_LOGIN_INPUT_CHANGE', () => {
    expect(
      app(appInitialState, {
        type: types.SET_LOGIN_INPUT_CHANGE,
        fieldName: 'username',
        value: 'myuser'
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: null,
        username: 'myuser'
      }
    );
  });

  it('should handle SWITCH_AGENCY', () => {
    expect(
      app(appInitialState, {
        type: types.SWITCH_AGENCY,
        activeCaseLoadId: 'BXI'
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: null,
        user: { activeCaseLoadId: 'BXI' }
      }
    );
  });

  it('should handle SET_TERMS_VISIBILITY', () => {
    expect(
      app(appInitialState, {
        type: types.SET_TERMS_VISIBILITY,
        shouldShowTerms: true
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: null,
        shouldShowTerms: true
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
        error: null,
        message: null
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
        error: 'HELP!',
        message: null
      }
    );
  });

  it('should handle SET_MESSAGE', () => {
    expect(
      app(appInitialState, {
        type: types.SET_MESSAGE,
        message: 'An important message!'
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: 'An important message!'
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

describe('prisoner search reducer', () => {
  it('should return the initial state', () => {
    expect(prisonerSearch(undefined, {})).toEqual(
      {
        searchText: null,
        allocationStatus: null,
        housingLocation: null
      }
    );
  });
  it('should handle SET_PRISONER_SEARCH_TEXT', () => {
    expect(prisonerSearch(prisonerSearchInitialState, {
      type: types.SET_PRISONER_SEARCH_TEXT,
      searchText: 'birdman of Alcatraz'
    })).toEqual(
      {
        searchText: 'birdman of Alcatraz',
        allocationStatus: null,
        housingLocation: null
      }
    );
  });

  it('should handle SET_PRISONER_SEARCH_ALLOCATION_STATUS', () => {
    expect(prisonerSearch(prisonerSearchInitialState, {
      type: types.SET_PRISONER_SEARCH_ALLOCATION_STATUS,
      allocationStatus: 'N'
    })).toEqual(
      {
        searchText: null,
        allocationStatus: 'N',
        housingLocation: null
      }
    );
  });

  it('should handle SET_PRISONER_SEARCH_HOUSING_LOCATION', () => {
    expect(prisonerSearch(prisonerSearchInitialState, {
      type: types.SET_PRISONER_SEARCH_HOUSING_LOCATION,
      housingLocation: 'Block C'
    })).toEqual(
      {
        searchText: null,
        allocationStatus: null,
        housingLocation: 'Block C'
      }
    );
  });
});

describe('key worker search reducer', () => {
  it('should handle SET_KEY_WORKER_SEARCH_TEXT', () => {
    expect(keyworkerSearch(keyworkerSearchInitialState, {
      type: types.SET_KEY_WORKER_SEARCH_TEXT,
      searchText: 'Kelly Keyworker'
    })).toEqual(
      {
        searchText: 'Kelly Keyworker',
        keyworkerSearchResults: [],
        keyworkerAllocations: [],
        keyworker: null
      }
    );
  });

  it('should handle SET_KEY_WORKER_SEARCH_RESULTS', () => {
    const list = [{ firstName: 'Jack', surname: 'Brown' }];
    expect(keyworkerSearch(keyworkerSearchInitialState, {
      type: types.SET_KEY_WORKER_SEARCH_RESULTS_LIST,
      keyworkerSearchResults: list
    })).toEqual(
      {
        searchText: '',
        keyworkerSearchResults: list,
        keyworkerAllocations: [],
        keyworker: null
      }
    );
  });

  it('should handle SET_KEY_WORKER', () => {
    expect(keyworkerSearch(keyworkerSearchInitialState, {
      type: types.SET_KEY_WORKER,
      keyworker: { key: 'value' }
    })).toEqual(
      {
        searchText: '',
        keyworkerSearchResults: [],
        keyworkerAllocations: [],
        keyworker: { key: 'value' }
      }
    );
  });

  it('should handle SET_KEY_WORKER maintaining existing state', () => {
    expect(keyworkerSearch(keyworkerSearchPopulatedState, {
      type: types.SET_KEY_WORKER,
      keyworker: { key: 'value' }
    })).toEqual(
      {
        searchText: 'yes',
        keyworkerSearchResults: [{ value: 'search' }],
        keyworkerAllocations: [{ value: 'allocations' }],
        keyworker: { key: 'value' }
      }
    );
  });
});
