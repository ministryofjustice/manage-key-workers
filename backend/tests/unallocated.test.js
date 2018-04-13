const unallocated = require('../controllers/unallocated').unallocated;
const elite2Api = require('../elite2Api');
const keyworkerApi = require('../keyworkerApi');

const req = {
  headers: {
  },
  query: {
  }
};

const allocationResponse = createDataResponse();

describe('Unallocated controller', async () => {
  it('Should add keyworker details to allocated data array', async () => {
    keyworkerApi.unallocated = jest.fn();
    elite2Api.sentenceDetailList = jest.fn().mockImplementationOnce(() => createSentenceDetailListResponse());

    elite2Api.csraList = jest.fn().mockImplementationOnce(() => createAssessmentListResponse());

    keyworkerApi.unallocated.mockReturnValueOnce(allocationResponse);

    const response = await unallocated(req);

    expect(response.data[0].bookingId).toBe(-1);
    expect(response.data[0].offenderNo).toBe('A1234AA');
    expect(response.data[0].firstName).toBe('ARTHUR');
    expect(response.data[0].lastName).toBe('ANDERSON');
    expect(response.data[0].agencyId).toBe("LEI");
    expect(response.data[0].internalLocationDesc).toBe("A-1-1");
    expect(response.data[0].crsaClassification).toBe('High');
    expect(response.data[0].confirmedReleaseDate).toBe('2024-03-03');
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
    { offenderNo: "A1234AA", classification: 'High' },
    { offenderNo: "A1234AB", classification: 'High' },
    { offenderNo: "A1234AF", classification: 'Low' },
    { offenderNo: "A1234AC", classification: 'Silly' },
    { offenderNo: "A1234AD", classification: 'Low' }
  ] };
}
