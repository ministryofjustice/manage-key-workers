Reflect.deleteProperty(process.env, 'APPINSIGHTS_INSTRUMENTATIONKEY');
const allocated = require('../controllers/allocated').allocated;
const elite2Api = require('../elite2Api');
const keyworkerApi = require('../keyworkerApi');

const req = {
  headers: {
  },
  query: {
  }
};

const keyworkResponse = createAvailableKeyworkerResponse();
const allocationResponse = createAllocatedDataResponse();

describe('Allocated controller', async () => {
  it('Should add keyworker details to allocated data array', async () => {
    keyworkerApi.autoAllocate = jest.fn();
    keyworkerApi.availableKeyworkers = jest.fn();
    keyworkerApi.autoallocated = jest.fn();
    elite2Api.sentenceDetailList = jest.fn().mockImplementationOnce(() => createSentenceDetailListResponse());

    elite2Api.csraList = jest.fn().mockImplementationOnce(() => createAssessmentListResponse());

    keyworkerApi.keyworker = jest
      .fn()
      .mockImplementation(() => createSingleKeyworkerResponse());

    keyworkerApi.autoallocated.mockReturnValueOnce(allocationResponse);

    keyworkerApi.availableKeyworkers.mockReturnValueOnce(keyworkResponse);

    const response = await allocated(req);

    expect(keyworkerApi.autoAllocate.mock.calls.length).toBe(1);

    expect(response.allocatedResponse[0].bookingId).toBe(-1);
    expect(response.allocatedResponse[0].offenderNo).toBe('A1234AA');
    expect(response.allocatedResponse[0].firstName).toBe('ARTHUR');
    expect(response.allocatedResponse[0].lastName).toBe('ANDERSON');
    expect(response.allocatedResponse[0].staffId).toBe(123);
    expect(response.allocatedResponse[0].agencyId).toBe("LEI");
    expect(response.allocatedResponse[0].staffId).toBe(123);
    expect(response.allocatedResponse[0].internalLocationDesc).toBe("A-1-1");
    expect(response.allocatedResponse[0].keyworkerDisplay).toBe('Hanson, Amy');
    expect(response.allocatedResponse[0].numberAllocated).toBe(4);
    expect(response.allocatedResponse[0].crsaClassification).toBe('High');
    expect(response.allocatedResponse[0].confirmedReleaseDate).toBe('2024-03-03');


    expect(response.allocatedResponse[4].keyworkerDisplay).toBe('Lard, Ben');
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

function createSingleKeyworkerResponse () {
  return {
    data: {
      staffId: -2,
      firstName: 'Ben',
      lastName: 'Lard',
      numberAllocated: 4
    }
  };
}

function createSentenceDetailListResponse () {
  return { data: [
    { offenderNo: "A1234AA", sentenceDetail: { releaseDate: '2024-03-03' } },
    { offenderNo: "A1234AB", sentenceDetail: { releaseDate: '2025-04-03' } },
    { offenderNo: "A1234AF", sentenceDetail: { releaseDate: '2026-03-03' } },
    { offenderNo: "A1234AC", sentenceDetail: { releaseDate: '2019-03-03' } },
    { offenderNo: "A1234AD", sentenceDetail: { releaseDate: '2018-03-03' } }
  ] };
}

function createAssessmentListResponse () {
  return { data: [
    { offenderNo: "A1234AA", classification: 'High' },
    { offenderNo: "A1234AB", classification: 'High' },
    { offenderNo: "A1234AF", classification: 'Low' },
    { offenderNo: "A1234AC", classification: 'Silly' },
    { offenderNo: "A1234AD", classification: 'Low' }
  ] };
}
