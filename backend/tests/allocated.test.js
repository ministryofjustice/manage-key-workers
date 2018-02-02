const allocated = require('../controllers/allocated').allocated;

const elite2Api = require('../elite2Api');

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
    elite2Api.availableKeyworkers = jest.fn();
    elite2Api.allocated = jest.fn();
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

    elite2Api.allocated.mockReturnValueOnce(allocationResponse);

    elite2Api.availableKeyworkers.mockReturnValueOnce(keyworkResponse);

    const response = await allocated(req);

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

    // todo wire up when API available
    expect(response.allocatedResponse[4].keyworkerDisplay).toBe('--');
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
