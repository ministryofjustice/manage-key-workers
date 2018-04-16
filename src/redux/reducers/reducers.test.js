import { unallocated, allocated, app, offenderSearch, keyworkerSearch } from './index';
import * as types from '../actions/actionTypes';
import moment from 'moment';

const appInitialState = {
  error: null,
  page: 0,
  message: null,
  loaded: false
};

const appWithErrorState = {
  error: 'There was a problem',
  page: 0,
  message: null,
  loaded: false
};

const appWithValidationErrorState = {
  validationErrors: { myField: 'An error!' }
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

const offenderSearchInitialState = {
  searchText: '',
  housingLocation: '',
  allocationStatus: ''
};

const keyworkerSearchInitialState = {
  searchText: '',
  keyworkerSearchResults: [],
  keyworkerAllocations: [],
  keyworkerChangeList: [],
  keyworkerList: [],
  keyworker: null,
  status: '',
  capacity: "",
  statusChangeBehaviour: ''
};

const keyworkerSearchPopulatedState = {
  searchText: 'yes',
  keyworkerSearchResults: [{ value: 'search' }],
  keyworkerAllocations: [{ value: 'allocations' }],
  keyworkerChangeList: [],
  keyworkerList: [{ value: 'available keyworkers' }],
  keyworker: { say: "hello" },
  status: 'ACTIVE',
  capacity: "7",
  statusChangeBehaviour: 'newBehaviour'
};

describe('app (global) reducer', () => {
  it('should return the initial state', () => {
    expect(app(undefined, {})).toEqual(
      {
        config: { mailTo: '' },
        user: { activeCaseLoadId: null },
        shouldShowTerms: false,
        error: null,
        message: null,
        page: 0,
        loaded: false
      }
    );
  });

  it('should handle SET_CONFIG', () => {
    expect(
      app(appInitialState, {
        type: types.SET_CONFIG,
        config: { mailTo: 'a@b.com' }
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: null,
        config: { mailTo: 'a@b.com' },
        loaded: false
      });
  });

  it('should handle SET_USER_DETAILS', () => {
    expect(
      app(appInitialState, {
        type: types.SET_USER_DETAILS,
        user: { field: 'value' }
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: null,
        user: { field: 'value' },
        loaded: false
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
        user: { activeCaseLoadId: 'BXI' },
        loaded: false
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
        shouldShowTerms: true,
        loaded: false
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
        message: null,
        loaded: false
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
        message: null,
        loaded: false
      }
    );
  });

  it('should handle RESET_ERROR', () => {
    expect(
      app(appWithErrorState, {
        type: types.RESET_ERROR
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: null,
        loaded: false
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
        message: 'An important message!',
        loaded: false
      }
    );
  });

  it('should handle SET_LOADED', () => {
    expect(
      app(appInitialState, {
        type: types.SET_LOADED,
        loaded: true
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: null,
        loaded: true
      }
    );
  });

  it('should handle SET_VALIDATION_ERROR (first error)', () => {
    expect(
      app(appInitialState, {
        type: types.SET_VALIDATION_ERROR,
        fieldName: 'myField',
        message: 'An error!'
      })
    ).toEqual(
      {
        page: 0,
        error: null,
        message: null,
        loaded: false,
        validationErrors: { myField: 'An error!' }
      }
    );
  });

  it('should handle SET_VALIDATION_ERROR (second error)', () => {
    expect(
      app(appWithValidationErrorState, {
        type: types.SET_VALIDATION_ERROR,
        fieldName: 'myField2',
        message: 'Another error!'
      })
    ).toEqual(
      {
        validationErrors: {
          myField: 'An error!',
          myField2: 'Another error!'
        }
      }
    );
  });

  it('should handle RESET_VALIDATION_ERRORS', () => {
    expect(
      app(appWithValidationErrorState, {
        type: types.RESET_VALIDATION_ERRORS
      })
    ).toEqual(
      {
        validationErrors: null
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

describe('offender search reducer', () => {
  it('should return the initial state', () => {
    expect(offenderSearch(undefined, {})).toEqual(
      {
        searchText: '',
        allocationStatus: '',
        locations: [],
        housingLocation: ''
      }
    );
  });
  it('should handle SET_OFFENDER_SEARCH_TEXT', () => {
    expect(offenderSearch(offenderSearchInitialState, {
      type: types.SET_OFFENDER_SEARCH_TEXT,
      searchText: 'birdman of Alcatraz'
    })).toEqual(
      {
        searchText: 'birdman of Alcatraz',
        allocationStatus: '',
        housingLocation: ''
      }
    );
  });

  it('should handle SET_OFFENDER_SEARCH_ALLOCATION_STATUS', () => {
    expect(offenderSearch(offenderSearchInitialState, {
      type: types.SET_OFFENDER_SEARCH_ALLOCATION_STATUS,
      allocationStatus: 'N'
    })).toEqual(
      {
        searchText: '',
        allocationStatus: 'N',
        housingLocation: ''
      }
    );
  });

  it('should handle SET_OFFENDER_SEARCH_HOUSING_LOCATION', () => {
    expect(offenderSearch(offenderSearchInitialState, {
      type: types.SET_OFFENDER_SEARCH_HOUSING_LOCATION,
      housingLocation: 'Block C'
    })).toEqual(
      {
        searchText: '',
        allocationStatus: '',
        housingLocation: 'Block C'
      }
    );
  });

  it('should handle SET_OFFENDER_SEARCH_LOCATIONS', () => {
    expect(offenderSearch(offenderSearchInitialState, {
      type: types.SET_OFFENDER_SEARCH_LOCATIONS,
      locations: ['The Sistine Chapel']
    })).toEqual(
      {
        searchText: '',
        allocationStatus: '',
        housingLocation: '',
        locations: ['The Sistine Chapel']
      }
    );
  });

  it('should handle SET_OFFENDER_SEARCH_RESULTS', () => {
    expect(offenderSearch(offenderSearchInitialState, {
      type: types.SET_OFFENDER_SEARCH_RESULTS,
      offenderResults: [{ lastName: "Bloggs" }]
    })).toEqual(
      {
        searchText: '',
        allocationStatus: '',
        housingLocation: '',
        offenderResults: [{ lastName: "Bloggs" }]
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
        keyworkerChangeList: [],
        keyworkerList: [],
        keyworker: null,
        status: '',
        capacity: '',
        statusChangeBehaviour: ''
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
        keyworkerChangeList: [],
        keyworkerList: [],
        keyworker: null,
        status: '',
        capacity: '',
        statusChangeBehaviour: ''
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
        keyworkerChangeList: [],
        keyworkerList: [],
        keyworker: { key: 'value' },
        status: '',
        capacity: '',
        statusChangeBehaviour: ''
      }
    );
  });

  it('should handle SET_KEY_WORKER_CHANGE_LIST', () => {
    expect(keyworkerSearch(keyworkerSearchInitialState, {
      type: types.SET_KEY_WORKER_CHANGE_LIST,
      keyworkerChangeList: [{ key: 'value' }]
    })).toEqual(
      {
        searchText: '',
        keyworkerSearchResults: [],
        keyworkerAllocations: [],
        keyworkerChangeList: [{ key: 'value' }],
        keyworkerList: [],
        keyworker: null,
        status: '',
        capacity: '',
        statusChangeBehaviour: ''
      }
    );
  });

  it('should handle SET_AVAILABLE_KEY_WORKER_LIST', () => {
    expect(keyworkerSearch(keyworkerSearchInitialState, {
      type: types.SET_AVAILABLE_KEY_WORKER_LIST,
      keyworkerList: [{ key: 'value' }]
    })).toEqual(
      {
        searchText: '',
        keyworkerSearchResults: [],
        keyworkerAllocations: [],
        keyworkerChangeList: [],
        keyworkerList: [{ key: 'value' }],
        keyworker: null,
        status: '',
        capacity: '',
        statusChangeBehaviour: ''
      }
    );
  });

  it('should handle SET_KEY_WORKER_CAPACITY', () => {
    expect(keyworkerSearch(keyworkerSearchInitialState, {
      type: types.SET_KEY_WORKER_CAPACITY,
      capacity: '9'
    })).toEqual(
      {
        searchText: '',
        keyworkerSearchResults: [],
        keyworkerAllocations: [],
        keyworkerChangeList: [],
        keyworkerList: [],
        keyworker: null,
        status: '',
        capacity: '9',
        statusChangeBehaviour: ''
      }
    );
  });

  it('should handle SET_KEY_WORKER_STATUS', () => {
    expect(keyworkerSearch(keyworkerSearchInitialState, {
      type: types.SET_KEY_WORKER_STATUS,
      status: 'Unavailable'
    })).toEqual(
      {
        searchText: '',
        keyworkerSearchResults: [],
        keyworkerAllocations: [],
        keyworkerChangeList: [],
        keyworkerList: [],
        keyworker: null,
        status: 'Unavailable',
        capacity: '',
        statusChangeBehaviour: ''
      }
    );
  });

  it('should handle SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR', () => {
    expect(keyworkerSearch(keyworkerSearchInitialState, {
      type: types.SET_KEY_WORKER_STATUS_CHANGE_BEHAVIOUR,
      statusChangeBehaviour: 'runAround'
    })).toEqual(
      {
        searchText: '',
        keyworkerSearchResults: [],
        keyworkerAllocations: [],
        keyworkerChangeList: [],
        keyworkerList: [],
        keyworker: null,
        status: '',
        capacity: '',
        statusChangeBehaviour: 'runAround'
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
        keyworkerChangeList: [],
        keyworkerList: [{ value: 'available keyworkers' }],
        keyworker: { key: 'value' },
        status: 'ACTIVE',
        capacity: '7',
        statusChangeBehaviour: 'newBehaviour'
      }
    );
  });
});
