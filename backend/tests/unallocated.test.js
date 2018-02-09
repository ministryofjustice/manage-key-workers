const unallocated = require('../controllers/unallocated').unallocated;
const elite2Api = require('../elite2Api');

const req = {
  headers: {
  },
  query: {
  }
};

const allocationResponse = createDataResponse();

describe('Unallocated controller', async () => {
  it('Should add keyworker details to allocated data array', async () => {
    elite2Api.unallocated = jest.fn();
    elite2Api.sentenceDetail = jest
      .fn()
      .mockImplementationOnce(() => createSentenceDetailResponse('2024-03-03'))
      .mockImplementationOnce(() => createSentenceDetailResponse('2025-04-03'))
      .mockImplementationOnce(() => createSentenceDetailResponse('2026-03-03'))
      .mockImplementationOnce(() => createSentenceDetailResponse('2019-03-03'))
      .mockImplementationOnce(() => createSentenceDetailResponse('2018-03-03'));

    elite2Api.assessment = jest
      .fn()
      .mockImplementationOnce(() => createAssessmentResponse('High'))
      .mockImplementationOnce(() => createAssessmentResponse('High'))
      .mockImplementationOnce(() => createAssessmentResponse('Low'))
      .mockImplementationOnce(() => createAssessmentResponse('Silly'))
      .mockImplementationOnce(() => createAssessmentResponse('Low'));

    elite2Api.unallocated.mockReturnValueOnce(allocationResponse);

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

function createSentenceDetailResponse (date) {
  return {
    data: {
      bookingId: -1,
      sentenceStartDate: "2017-03-25",
      additionalDaysAwarded: 12,
      sentenceExpiryDate: "2020-03-24",
      conditionalReleaseDate: "2019-03-24",
      nonDtoReleaseDate: "2019-03-24",
      nonDtoReleaseDateType: "CRD",
      actualParoleDate: "2018-09-27",
      confirmedReleaseDate: date,
      releaseDate: "2018-04-23"
    }
  };
}

function createAssessmentResponse (rating) {
  return {
    data: {
      classification: rating,
      assessmentCode: "CSR",
      assessmentDescription: "CSR Rating",
      cellSharingAlertFlag: true,
      assessmentDate: "2017-02-05",
      nextReviewDate: "2018-06-01"
    }
  };
}
