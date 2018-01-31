const allocated = require('../controllers/allocated').allocated;

const elite2Api = require('../elite2Api');

const req = {
  headers: {
  }
};

const keyworkResponse = createAvailableKeyworkerResponse();
const allocationResponse = createAllocatedDataResponse();

describe('Allocated controller', async () => {
  it('Should add keyworker details to allocated data array', async () => {
    elite2Api.availableKeyworkers = jest.fn();
    elite2Api.allocated = jest.fn();
    elite2Api.allocated.mockReturnValueOnce(allocationResponse);

    elite2Api.availableKeyworkers.mockReturnValueOnce(keyworkResponse);

    const response = await allocated(req);

    expect(response.allocatedResponse[0].keyworkerFirstName).toBe('Amy');
    expect(response.allocatedResponse[0].keyworkerLastName).toBe('Hanson');
    expect(response.allocatedResponse[0].numberAllocated).toBe(4);

    // todo wire up when API available
    expect(response.allocatedResponse[4].keyworkerLastName).toBe('not available');
  });
});

function createAllocatedDataResponse () {
  return {
    data: [
      {
        bookingId: -1,
        offenderNo: "A1234AA",
        firstName: "ARTHUR",
        middleNames: "BORIS",
        lastName: "ANDERSON",
        staffId: 123,
        agencyId: "LEI",
        assigned: "2017-01-01T12:00:00",
        allocationType: "M",
        internalLocationDesc: "A-1-1"
      },
      {
        bookingId: -2,
        offenderNo: "A1234AB",
        firstName: "GILLIAN",
        middleNames: "EVE",
        lastName: "ANDERSON",
        staffId: 124,
        agencyId: "LEI",
        assigned: "2017-01-01T12:01:00",
        allocationType: "M",
        internalLocationDesc: "H-1-5"
      },
      {
        bookingId: -6,
        offenderNo: "A1234AF",
        firstName: "ANTHONY",
        lastName: "ANDREWS",
        staffId: 123,
        agencyId: "LEI",
        assigned: "2017-01-01T12:05:00",
        allocationType: "M",
        internalLocationDesc: "A-1-2"
      },
      {
        bookingId: -3,
        offenderNo: "A1234AC",
        firstName: "NORMAN",
        middleNames: "JOHN",
        lastName: "BATES",
        staffId: -2,
        agencyId: "LEI",
        assigned: "2017-01-01T12:02:00",
        allocationType: "M",
        internalLocationDesc: "A-1-1"
      },
      {
        bookingId: -4,
        offenderNo: "A1234AD",
        firstName: "CHARLES",
        middleNames: "JAMES",
        lastName: "CHAPLIN",
        staffId: -2,
        agencyId: "LEI",
        assigned: "2017-01-01T12:03:00",
        allocationType: "M",
        internalLocationDesc: "A-1"
      }
    ]
  };
}

function createAvailableKeyworkerResponse () {
  return {
    data: [{
      staffId: 123,
      firstName: 'Amy',
      lastName: 'Hanson',
      numberAllocated: 4
    },
    {
      staffId: 124,
      firstName: 'James',
      lastName: 'Nesbit',
      numberAllocated: 1
    },
    {
      staffId: 125,
      firstName: 'Clem',
      lastName: 'Fandango',
      numberAllocated: 7
    }
    ]
  };
}
