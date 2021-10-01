const { serviceFactory } = require('../services/allocationService')
const { elite2ApiFactory } = require('../api/elite2Api')
const { keyworkerApiFactory } = require('../api/keyworkerApi')

const elite2Api = elite2ApiFactory(null)
const keyworkerApi = keyworkerApiFactory(null)
const { unallocated } = serviceFactory(elite2Api, keyworkerApi)

function createDataResponse() {
  return [
    {
      bookingId: -1,
      offenderNo: 'A1234AA',
      firstName: 'ARTHUR',
      lastName: 'ANDERSON',
      agencyId: 'LEI',
      internalLocationDesc: 'A-1-1',
    },
    {
      bookingId: -2,
      offenderNo: 'A1234AB',
      firstName: 'GILLIAN',
      lastName: 'ANDERSON',
      agencyId: 'LEI',
      internalLocationDesc: 'H-1-5',
    },
    {
      bookingId: -6,
      offenderNo: 'A1234AF',
      firstName: 'ANTHONY',
      lastName: 'ANDREWS',
      agencyId: 'LEI',
      internalLocationDesc: 'A-1-2',
    },
    {
      bookingId: -3,
      offenderNo: 'A1234AC',
      firstName: 'NORMAN',
      lastName: 'BATES',
      staffId: -2,
      agencyId: 'LEI',
      internalLocationDesc: 'A-1-1',
    },
    {
      bookingId: -4,
      offenderNo: 'A1234AD',
      firstName: 'CHARLES',
      lastName: 'CHAPLIN',
      agencyId: 'LEI',
      internalLocationDesc: 'A-1',
    },
  ]
}

function createSentenceDetailListResponse() {
  return [
    { offenderNo: 'A1234AA', sentenceDetail: { releaseDate: '2024-03-03', mostRecentActiveBooking: true } },
    { offenderNo: 'A1234AB', sentenceDetail: { releaseDate: '2025-04-03', mostRecentActiveBooking: true } },
    { offenderNo: 'A1234AF', sentenceDetail: { releaseDate: '2026-03-03', mostRecentActiveBooking: true } },
    { offenderNo: 'A1234AC', sentenceDetail: { releaseDate: '2019-03-03', mostRecentActiveBooking: true } },
    { offenderNo: 'A1234AD', sentenceDetail: { releaseDate: '2018-03-03', mostRecentActiveBooking: true } },
  ]
}

function createAssessmentListResponse() {
  return [
    { offenderNo: 'A1234AA', classificationCode: 'HI' },
    { offenderNo: 'A1234AB', classificationCode: 'HI' },
    { offenderNo: 'A1234AF', classificationCode: 'LOW' },
    { offenderNo: 'A1234AC', classificationCode: 'SILLY' },
    { offenderNo: 'A1234AD', classificationCode: 'LOW' },
  ]
}

const allocationResponse = createDataResponse()

describe('Unallocated controller', () => {
  it('Should add keyworker details to allocated data array', async () => {
    keyworkerApi.unallocated = jest.fn()
    elite2Api.sentenceDetailList = jest.fn().mockImplementationOnce(() => createSentenceDetailListResponse())

    elite2Api.csraRatingList = jest.fn().mockImplementationOnce(() => createAssessmentListResponse())

    keyworkerApi.unallocated.mockReturnValueOnce(allocationResponse)

    const response = await unallocated({}, 'LEI')

    expect(response[0].bookingId).toBe(-1)
    expect(response[0].offenderNo).toBe('A1234AA')
    expect(response[0].firstName).toBe('ARTHUR')
    expect(response[0].lastName).toBe('ANDERSON')
    expect(response[0].agencyId).toBe('LEI')
    expect(response[0].internalLocationDesc).toBe('A-1-1')
    expect(response[0].crsaClassification).toBe('High')
    expect(response[0].confirmedReleaseDate).toBe('2024-03-03')
  })
})
