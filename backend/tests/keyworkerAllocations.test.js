const keyworkerAllocations = require('../controllers/keyworkerAllocations').keyworkerAllocations;
const elite2Api = require('../elite2Api');

const req = {
  headers: {
  },
  query: {
  }
};

const allocationResponse = createDataResponse();

describe('keyworkerAllocations controller', async () => {
  it('Should add keyworker details to data array', async () => {
    elite2Api.keyworkerAllocations = jest.fn();
    elite2Api.sentenceDetailList = jest.fn().mockImplementationOnce(() => createSentenceDetailListResponse());

    elite2Api.csraList = jest.fn().mockImplementationOnce(() => createAssessmentListResponse());

    elite2Api.keyworkerAllocations.mockReturnValueOnce(allocationResponse);

    const response = await keyworkerAllocations(req);

    expect(response.data[0].bookingId).toBe(-1);
    expect(response.data[0].offenderNo).toBe('A1234AA');
    expect(response.data[0].firstName).toBe('ARTHUR');
    expect(response.data[0].lastName).toBe('ANDERSON');
    expect(response.data[0].agencyId).toBe("LEI");
    expect(response.data[0].internalLocationDesc).toBe("A-1-1");
    expect(response.data[0].crsaClassification).toBe('High');
    expect(response.data[0].confirmedReleaseDate).toBe('2024-03-03');
    expect(response.data[1].bookingId).toBe(-2);
    expect(response.data[1].crsaClassification).toBe('High');
    expect(response.data[1].confirmedReleaseDate).toBe('2025-04-03');
    expect(response.data[2].bookingId).toBe(-6);
    expect(response.data[2].crsaClassification).toBe('Low');
    expect(response.data[2].confirmedReleaseDate).toBe('2026-03-03');
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
