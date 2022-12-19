Reflect.deleteProperty(process.env, 'APPINSIGHTS_INSTRUMENTATIONKEY')

const { serviceFactory } = require('../services/allocationService')
const { elite2ApiFactory } = require('../api/elite2Api')
const { prisonerSearchApiFactory } = require('../api/prisonerSearchApi')
const { keyworkerApiFactory } = require('../api/keyworkerApi')
const { oauthApiFactory } = require('../api/oauthApi')

const elite2Api = elite2ApiFactory(null)
const prisonerSearchApi = prisonerSearchApiFactory(null)
const keyworkerApi = keyworkerApiFactory(null)
const systemOauthClient = oauthApiFactory(null, {})
const { allocated } = serviceFactory(elite2Api, prisonerSearchApi, keyworkerApi, 100, systemOauthClient)

function createAllocatedDataResponse() {
  return [
    {
      bookingId: -1,
      offenderNo: 'A1234AA',
      firstName: 'ARTHUR',
      middleNames: 'BORIS',
      lastName: 'ANDERSON',
      staffId: 123,
      agencyId: 'LEI',
      assigned: '2017-01-01T12:00:00',
      allocationType: 'M',
      internalLocationDesc: 'A-1-1',
    },
    {
      bookingId: -2,
      offenderNo: 'A1234AB',
      firstName: 'GILLIAN',
      middleNames: 'EVE',
      lastName: 'ANDERSON',
      staffId: 124,
      agencyId: 'LEI',
      assigned: '2017-01-01T12:01:00',
      allocationType: 'M',
      internalLocationDesc: 'H-1-5',
    },
    {
      bookingId: -6,
      offenderNo: 'A1234AF',
      firstName: 'ANTHONY',
      lastName: 'ANDREWS',
      staffId: 123,
      agencyId: 'LEI',
      assigned: '2017-01-01T12:05:00',
      allocationType: 'M',
      internalLocationDesc: 'A-1-2',
    },
    {
      bookingId: -3,
      offenderNo: 'A1234AC',
      firstName: 'NORMAN',
      middleNames: 'JOHN',
      lastName: 'BATES',
      staffId: -2,
      agencyId: 'LEI',
      assigned: '2017-01-01T12:02:00',
      allocationType: 'M',
      internalLocationDesc: 'A-1-1',
    },
    {
      bookingId: -4,
      offenderNo: 'A1234AD',
      firstName: 'CHARLES',
      middleNames: 'JAMES',
      lastName: 'CHAPLIN',
      staffId: -2,
      agencyId: 'LEI',
      assigned: '2017-01-01T12:03:00',
      allocationType: 'M',
      internalLocationDesc: 'A-1',
    },
  ]
}

function createAvailableKeyworkerResponse() {
  return [
    {
      staffId: 123,
      firstName: 'Amy',
      lastName: 'Hanson',
      numberAllocated: 4,
    },
    {
      staffId: 124,
      firstName: 'James',
      lastName: 'Nesbit',
      numberAllocated: 1,
    },
    {
      staffId: 125,
      firstName: 'Clem',
      lastName: 'Fandango',
      numberAllocated: 7,
    },
  ]
}

function createSingleKeyworkerResponse() {
  return {
    staffId: -2,
    firstName: 'Ben',
    lastName: 'Lard',
    numberAllocated: 4,
  }
}

const createSearchOffendersResponse = () => [
  { offenderNo: 'A1234AA', releaseDate: '2024-03-03', csra: 'High' },
  { offenderNo: 'A1234AB', releaseDate: '2025-04-03' },
  { offenderNo: 'A1234AF', csra: 'Low' },
  { offenderNo: 'A1234AC', fred: 'someValue', csra: 'Other' },
  { offenderNo: 'A1234AD' },
]

function createCaseNoteUsageListResponse() {
  return [
    { offenderNo: 'A1234AA', latestCaseNote: '2012-04-13' },
    { offenderNo: 'A1234AB' },
    { offenderNo: 'A1234AF', latestCaseNote: '2014-02-03' },
    { offenderNo: 'A1234AC', latestCaseNote: '2015-03-04' },
  ]
}

describe('Allocated controller', () => {
  let response

  beforeAll(async () => {
    keyworkerApi.autoAllocate = jest.fn()
    keyworkerApi.availableKeyworkers = jest.fn()
    keyworkerApi.autoallocated = jest.fn()

    prisonerSearchApi.getOffenders = jest.fn().mockImplementationOnce(() => createSearchOffendersResponse())
    elite2Api.caseNoteUsageList = jest.fn().mockImplementationOnce(() => createCaseNoteUsageListResponse())
    systemOauthClient.getClientCredentialsTokens = jest.fn().mockReturnValueOnce('TOKEN')

    keyworkerApi.keyworker = jest.fn().mockImplementation(() => createSingleKeyworkerResponse())
    keyworkerApi.autoallocated.mockReturnValueOnce(createAllocatedDataResponse())
    keyworkerApi.availableKeyworkers.mockReturnValueOnce(createAvailableKeyworkerResponse())

    response = await allocated({}, 'LEI')
  })

  it('Should call auto allocate', () => {
    expect(keyworkerApi.autoAllocate.mock.calls.length).toBe(1)
  })

  it('Should create data items in allocated data array', () => {
    expect(response.allocatedResponse[0]).toMatchObject({
      bookingId: -1,
      offenderNo: 'A1234AA',
      firstName: 'ARTHUR',
      lastName: 'ANDERSON',
      staffId: 123,
      agencyId: 'LEI',
      internalLocationDesc: 'A-1-1',
      keyworkerDisplay: 'Amy Hanson',
      numberAllocated: 4,
      crsaClassification: 'High',
      confirmedReleaseDate: '2024-03-03',
    })
  })

  it('Should get classifications for offenders', () => {
    expect(response.allocatedResponse.map((a) => a.crsaClassification)).toEqual([
      'High',
      undefined,
      'Low',
      'Other',
      undefined,
    ])
  })

  it('Should get release date for offenders', () => {
    expect(response.allocatedResponse.map((a) => a.confirmedReleaseDate)).toEqual([
      '2024-03-03',
      '2025-04-03',
      undefined,
      undefined,
      undefined,
    ])
  })

  it('Should add keyworker details to allocated data array', () => {
    expect(response.allocatedResponse[4].keyworkerDisplay).toBe('Ben Lard')
  })
})
