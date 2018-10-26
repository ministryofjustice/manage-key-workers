const { serviceFactory } = require('../services/allocationService')
const { elite2ApiFactory } = require('../api/elite2Api')
const { keyworkerApiFactory } = require('../api/keyworkerApi')

const elite2Api = elite2ApiFactory(null)
const keyworkerApi = keyworkerApiFactory(null)
const { searchOffenders } = serviceFactory(elite2Api, keyworkerApi)

const createDataResponse = () => [
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

const createSentenceDetailListResponse = () => [
  { offenderNo: 'A1234AA', sentenceDetail: { releaseDate: '2024-03-03' } },
  { offenderNo: 'A1234AB', sentenceDetail: { releaseDate: '2025-04-03' } },
  { offenderNo: 'A1234AF', sentenceDetail: { releaseDate: '2026-03-03' } },
  { offenderNo: 'A1234AC', sentenceDetail: { releaseDate: '2019-03-03' } },
  { offenderNo: 'A1234AD', sentenceDetail: { releaseDate: '2018-03-03' } },
]

const createSearchOffendersResponse = () => [
  { offenderNo: 'A1234AA', classification: 'High' },
  { offenderNo: 'A1234AB', classification: 'High' },
  { offenderNo: 'A1234AF', classification: 'Low' },
  { offenderNo: 'A1234AC', classification: 'Silly' },
  { offenderNo: 'A1234AD', classification: 'Low' },
]

const createAvailableKeyworkerResponse = () => [
  {
    staffId: 15583,
    firstName: 'Brent',
    lastName: 'Daggart',
    numberAllocated: 3,
    status: 'active',
    currentRole: 'Key worker2',
  },
  {
    staffId: 15585,
    firstName: 'Amy',
    lastName: 'Hanson',
    numberAllocated: 4,
    status: 'active',
    currentRole: 'Key worker',
  },
  {
    staffId: 15584,
    firstName: 'Florence',
    lastName: 'Welch',
    numberAllocated: 1,
    status: 'active',
    currentRole: 'Key worker3',
  },
]

const createSingleKeyworkerResponse = () => ({
  staffId: -2,
  firstName: 'Ben',
  lastName: 'Lard',
  numberAllocated: 4,
})

const createOffenderKeyworkerResponse = () => [
  {
    offenderKeyworkerId: -1001,
    offenderNo: 'A1234AA',
    staffId: -3,
    agencyId: 'LEI',
    assigned: '2018-08-05T10:45:54.838',
    userId: 'SRENDELL_GEN',
    active: 'Y',
  },
  {
    offenderKeyworkerId: -1002,
    offenderNo: 'A1234AB',
    staffId: -5,
    agencyId: 'LEI',
    assigned: '2018-08-07T10:47:07.845',
    userId: 'MWILLIS_GEN',
    active: 'Y',
  },
]

const offenderResponse = createDataResponse()

describe('keyworkerAllocations controller', async () => {
  let response

  beforeAll(async () => {
    keyworkerApi.availableKeyworkers = jest.fn().mockImplementationOnce(() => createAvailableKeyworkerResponse())
    keyworkerApi.offenderKeyworkerList = jest.fn().mockImplementationOnce(() => createOffenderKeyworkerResponse())
    keyworkerApi.keyworker = jest.fn().mockImplementation(() => createSingleKeyworkerResponse())

    elite2Api.searchOffenders = jest.fn().mockImplementationOnce(() => createSearchOffendersResponse())
    elite2Api.sentenceDetailList = jest.fn().mockImplementationOnce(() => createSentenceDetailListResponse())
    elite2Api.csraList = jest.fn().mockImplementationOnce(() => createSearchOffendersResponse())

    keyworkerApi.searchOffenders = jest.fn().mockReturnValueOnce(offenderResponse)

    response = await searchOffenders({}, 'Dont care', 'XYZ')
  })

  it('Should add first full offender response details to data array', () => {
    expect(response.offenderResponse[0]).toMatchObject({
      classification: 'High',
      confirmedReleaseDate: '2024-03-03',
      crsaClassification: 'High',
      offenderNo: 'A1234AA',
    })
  })

  it('Should add second offender response details to data array', () => {
    expect(response.offenderResponse[2]).toMatchObject({
      classification: 'Low',
      confirmedReleaseDate: '2026-03-03',
      crsaClassification: 'Low',
      offenderNo: 'A1234AF',
    })
  })

  it('Should map classifications for offenders', () => {
    expect(response.offenderResponse.map(a => a.staffId)).toEqual([-3, -5, null, null, null])
  })

  it('Should add keyworker details to data array', () => {
    expect(response.keyworkerResponse[0]).toMatchObject({
      staffId: 15583,
      firstName: 'Brent',
      lastName: 'Daggart',
    })
  })
})
