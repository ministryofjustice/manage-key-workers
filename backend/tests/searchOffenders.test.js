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

const createSearchOffendersResponse = () => [
  { offenderNo: 'A1234AA', releaseDate: '2024-03-03', staffId: -3, csra: 'High' },
  { offenderNo: 'A1234AB', releaseDate: '2025-04-03', staffId: -5, csra: 'High' },
  { offenderNo: 'A1234AF', releaseDate: '2026-03-03', csra: 'Low' },
  { offenderNo: 'A1234AC', releaseDate: '2019-03-03', csra: 'Silly' },
  { offenderNo: 'A1234AD', releaseDate: '2018-03-03', csra: 'Low' },
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

    systemOauthClient.getClientCredentialsTokens = jest.fn().mockReturnValueOnce('TOKEN')

    response = await searchOffenders({}, 'Dont care', 'XYZ')
  })

  it('Should add first full offender response details to data array', () => {
    expect(response.offenderResponse[0]).toMatchObject({
      confirmedReleaseDate: '2024-03-03',
      crsaClassification: 'High',
      offenderNo: 'A1234AA',
    })
  })

  it('Should add second offender response details to data array', () => {
    expect(response.offenderResponse[2]).toMatchObject({
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
