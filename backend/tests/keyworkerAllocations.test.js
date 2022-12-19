const { serviceFactory } = require('../services/allocationService')
const { elite2ApiFactory } = require('../api/elite2Api')
const { keyworkerApiFactory } = require('../api/keyworkerApi')
const { prisonerSearchApiFactory } = require('../api/prisonerSearchApi')
const { oauthApiFactory } = require('../api/oauthApi')

const elite2Api = elite2ApiFactory(null)
const prisonerSearchApi = prisonerSearchApiFactory(null)
const keyworkerApi = keyworkerApiFactory(null)
const systemOauthClient = oauthApiFactory(null, {})

const { keyworkerAllocations } = serviceFactory(elite2Api, prisonerSearchApi, keyworkerApi, 100, systemOauthClient)

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

function createCaseNoteUsageResponse() {
  return [
    { offenderNo: 'A1234AA', latestCaseNote: '2018-03-01' },
    { offenderNo: 'A1234AB', latestCaseNote: '2018-03-03' },
    { offenderNo: 'A1234AF', latestCaseNote: '2017-04-13' },
    { offenderNo: 'A1234AF', latestCaseNote: '2018-04-12' },
    { offenderNo: 'A1234AF', latestCaseNote: '2018-04-13' },
    { offenderNo: 'A1234AF' },
    { offenderNo: 'A1234AC' },
  ]
}

const createOffendersResponse = () => [
  { offenderNo: 'A1234AA', releaseDate: '2024-03-03', csra: 'High' },
  { offenderNo: 'A1234AB', releaseDate: '2025-04-03', csra: 'High' },
  { offenderNo: 'A1234AF', releaseDate: '2026-03-03', csra: 'Low' },
  { offenderNo: 'A1234AC', releaseDate: '2019-03-03', csra: 'Other' },
  { offenderNo: 'A1234AD', releaseDate: '2018-03-03', csra: 'Low' },
]

function createAvailableKeyworkerResponse() {
  return [
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
}

const allocationResponse = createDataResponse()

describe('keyworkerAllocations controller', () => {
  let response

  beforeAll(async () => {
    elite2Api.caseNoteUsageList = jest.fn().mockImplementationOnce(() => createCaseNoteUsageResponse())
    prisonerSearchApi.getOffenders = jest.fn().mockImplementationOnce(() => createOffendersResponse())
    systemOauthClient.getClientCredentialsTokens = jest.fn().mockReturnValueOnce('TOKEN')

    keyworkerApi.availableKeyworkers = jest.fn().mockImplementationOnce(() => createAvailableKeyworkerResponse())

    keyworkerApi.keyworkerAllocations = jest.fn().mockReturnValueOnce(allocationResponse)

    response = await keyworkerAllocations({}, 'Dont care', 'XYZ')
  })

  it('Should add first full allocated response details to data array', () => {
    expect(response.allocatedResponse[0]).toMatchObject({
      bookingId: -1,
      offenderNo: 'A1234AA',
      firstName: 'ARTHUR',
      lastName: 'ANDERSON',
      agencyId: 'LEI',
      internalLocationDesc: 'A-1-1',
      crsaClassification: 'High',
      confirmedReleaseDate: '2024-03-03',
    })
  })

  it('Should add second allocated response details to data array', () => {
    expect(response.allocatedResponse[1]).toMatchObject({
      bookingId: -2,
      crsaClassification: 'High',
      confirmedReleaseDate: '2025-04-03',
    })
  })

  it('Should add third allocated response details to data array', () => {
    expect(response.allocatedResponse[2]).toMatchObject({
      bookingId: -6,
      crsaClassification: 'Low',
      confirmedReleaseDate: '2026-03-03',
    })
  })

  it('Should map classifications for offenders', () => {
    expect(response.allocatedResponse.map((a) => a.lastKeyWorkerSessionDate)).toEqual([
      '2018-03-01',
      '2018-03-03',
      '2018-04-13',
      null,
      null,
    ])
  })

  it('Should add keyworker details to data array', () => {
    expect(response.keyworkerResponse[0]).toMatchObject({
      staffId: 15583,
      firstName: 'Brent',
      lastName: 'Daggart',
    })
  })
})
