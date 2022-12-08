const { serviceFactory } = require('../services/allocationService')
const { elite2ApiFactory } = require('../api/elite2Api')
const { prisonerSearchApiFactory } = require('../api/prisonerSearchApi')
const { keyworkerApiFactory } = require('../api/keyworkerApi')
const { oauthApiFactory } = require('../api/oauthApi')

const elite2Api = elite2ApiFactory(null)
const prisonerSearchApi = prisonerSearchApiFactory(null)
const keyworkerApi = keyworkerApiFactory(null)
const systemOauthClient = oauthApiFactory(null, {})
const { searchOffenders } = serviceFactory(elite2Api, prisonerSearchApi, keyworkerApi, 100, systemOauthClient)

const createSentenceDetailListResponse = () => [
  { offenderNo: 'A1234AA', mostRecentActiveBooking: true, sentenceDetail: { releaseDate: '2024-03-03' } },
  { offenderNo: 'A1234AB', mostRecentActiveBooking: true, sentenceDetail: { releaseDate: '2025-04-03' } },
  { offenderNo: 'A1234AF', mostRecentActiveBooking: true, sentenceDetail: { releaseDate: '2026-03-03' } },
  { offenderNo: 'A1234AC', mostRecentActiveBooking: true, sentenceDetail: { releaseDate: '2019-03-03' } },
  { offenderNo: 'A1234AD', mostRecentActiveBooking: true, sentenceDetail: { releaseDate: '2018-03-03' } },
]

const createSearchOffendersResponse = () => [
  { offenderNo: 'A1234AA', staffId: -3, classification: 'High' },
  { offenderNo: 'A1234AB', staffId: -5, classification: 'High' },
  { offenderNo: 'A1234AF', classification: 'Low' },
  { offenderNo: 'A1234AC', classification: 'Silly' },
  { offenderNo: 'A1234AD', classification: 'Low' },
]

const csraRatingsResponse = () => [
  { offenderNo: 'A1234AA', classificationCode: 'HI' },
  { offenderNo: 'A1234AB', classificationCode: 'HI' },
  { offenderNo: 'A1234AF', classificationCode: 'LOW' },
  { offenderNo: 'A1234AC', classificationCode: 'SILLY' },
  { offenderNo: 'A1234AD', classificationCode: 'LOW' },
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

describe('keyworkerAllocations controller', () => {
  let response

  beforeAll(async () => {
    keyworkerApi.availableKeyworkers = jest.fn().mockImplementationOnce(() => createAvailableKeyworkerResponse())
    keyworkerApi.offenderKeyworkerList = jest.fn().mockImplementationOnce(() => createOffenderKeyworkerResponse())
    keyworkerApi.keyworker = jest.fn().mockImplementation(() => createSingleKeyworkerResponse())

    prisonerSearchApi.searchOffenders = jest.fn().mockImplementationOnce(() => createSearchOffendersResponse())
    elite2Api.sentenceDetailList = jest.fn().mockImplementationOnce(() => createSentenceDetailListResponse())
    elite2Api.csraRatingList = jest.fn().mockImplementationOnce(() => csraRatingsResponse())

    systemOauthClient.getClientCredentialsTokens = jest.fn().mockReturnValueOnce('TOKEN')

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
    expect(response.offenderResponse.map((a) => a.staffId)).toEqual([-3, -5, null, null, null])
  })

  it('Should add keyworker details to data array', () => {
    expect(response.keyworkerResponse[0]).toMatchObject({
      staffId: 15583,
      firstName: 'Brent',
      lastName: 'Daggart',
    })
  })
})
