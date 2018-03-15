const keyworkerAllocations = require('../controllers/keyworkerAllocations').keyworkerAllocations;
const elite2Api = require('../elite2Api');
const keyworkerApi = require('../keyworkerApi');

const req = {
  headers: {
  },
  query: {
  }
};

const allocationResponse = createDataResponse();

describe('keyworkerAllocations controller', async () => {
  it('Should add keyworker details to data array', async () => {
    elite2Api.sentenceDetailList = jest.fn().mockImplementationOnce(() => createSentenceDetailListResponse());

    elite2Api.csraList = jest.fn().mockImplementationOnce(() => createAssessmentListResponse());

    keyworkerApi.availableKeyworkers = jest.fn().mockImplementationOnce(() => createAvailableKeyworkerResponse());

    keyworkerApi.keyworkerAllocations = jest.fn().mockReturnValueOnce(allocationResponse);

    const response = await keyworkerAllocations(req);

    expect(response.allocatedResponse[0].bookingId).toBe(-1);
    expect(response.allocatedResponse[0].offenderNo).toBe('A1234AA');
    expect(response.allocatedResponse[0].firstName).toBe('ARTHUR');
    expect(response.allocatedResponse[0].lastName).toBe('ANDERSON');
    expect(response.allocatedResponse[0].agencyId).toBe("LEI");
    expect(response.allocatedResponse[0].internalLocationDesc).toBe("A-1-1");
    expect(response.allocatedResponse[0].crsaClassification).toBe('High');
    expect(response.allocatedResponse[0].confirmedReleaseDate).toBe('2024-03-03');
    expect(response.allocatedResponse[1].bookingId).toBe(-2);
    expect(response.allocatedResponse[1].crsaClassification).toBe('High');
    expect(response.allocatedResponse[1].confirmedReleaseDate).toBe('2025-04-03');
    expect(response.allocatedResponse[2].bookingId).toBe(-6);
    expect(response.allocatedResponse[2].crsaClassification).toBe('Low');
    expect(response.allocatedResponse[2].confirmedReleaseDate).toBe('2026-03-03');

    expect(response.keyworkerResponse[0].staffId).toBe(15583);
    expect(response.keyworkerResponse[0].firstName).toBe('Brent');
    expect(response.keyworkerResponse[0].lastName).toBe('Daggart');
  });
});

function createDataResponse () {
  return {
    data: [
      {
        bookingId: -1,
        offenderNo: "A1234AA",
        firstName: "ARTHUR",
        lastName: "ANDERSON",
        agencyId: "LEI",
        internalLocationDesc: "A-1-1"
      },
      {
        bookingId: -2,
        offenderNo: "A1234AB",
        firstName: "GILLIAN",
        lastName: "ANDERSON",
        agencyId: "LEI",
        internalLocationDesc: "H-1-5"
      },
      {
        bookingId: -6,
        offenderNo: "A1234AF",
        firstName: "ANTHONY",
        lastName: "ANDREWS",
        agencyId: "LEI",
        internalLocationDesc: "A-1-2"
      },
      {
        bookingId: -3,
        offenderNo: "A1234AC",
        firstName: "NORMAN",
        lastName: "BATES",
        staffId: -2,
        agencyId: "LEI",
        internalLocationDesc: "A-1-1"
      },
      {
        bookingId: -4,
        offenderNo: "A1234AD",
        firstName: "CHARLES",
        lastName: "CHAPLIN",
        agencyId: "LEI",
        internalLocationDesc: "A-1"
      }
    ]
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
    { bookingId: -1, classification: 'High' },
    { bookingId: -2, classification: 'High' },
    { bookingId: -6, classification: 'Low' },
    { bookingId: -3, classification: 'Silly' },
    { bookingId: -4, classification: 'Low' }
  ] };
}

function createAvailableKeyworkerResponse () {
  return {
    data: [
      {
        staffId: 15583,
        firstName: 'Brent',
        lastName: 'Daggart',
        numberAllocated: 3,
        status: "active",
        currentRole: "Key worker2"
      },
      {
        staffId: 15585,
        firstName: 'Amy',
        lastName: 'Hanson',
        numberAllocated: 4,
        status: "active",
        currentRole: "Key worker"
      },
      {
        staffId: 15584,
        firstName: 'Florence',
        lastName: 'Welch',
        numberAllocated: 1,
        status: "active",
        currentRole: "Key worker3"
      }
    ]
  };
}
