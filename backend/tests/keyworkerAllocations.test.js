const { serviceFactory } = require('../services/allocationService')
const { elite2ApiFactory } = require('../api/elite2Api')
const { keyworkerApiFactory } = require('../api/keyworkerApi')

const elite2Api = elite2ApiFactory(null)
const keyworkerApi = keyworkerApiFactory(null)
const { keyworkerAllocations } = serviceFactory(elite2Api, keyworkerApi)

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

function createSentenceDetailListResponse() {
  return [
    { offenderNo: 'A1234AA', sentenceDetail: { releaseDate: '2024-03-03' } },
    { offenderNo: 'A1234AB', sentenceDetail: { releaseDate: '2025-04-03' } },
    { offenderNo: 'A1234AF', sentenceDetail: { releaseDate: '2026-03-03' } },
    { offenderNo: 'A1234AC', sentenceDetail: { releaseDate: '2019-03-03' } },
    { offenderNo: 'A1234AD', sentenceDetail: { releaseDate: '2018-03-03' } },
  ]
}

function createAssessmentListResponse() {
  return [
    { offenderNo: 'A1234AA', classification: 'High' },
    { offenderNo: 'A1234AB', classification: 'High' },
    { offenderNo: 'A1234AF', classification: 'Low' },
    { offenderNo: 'A1234AC', classification: 'Silly' },
    { offenderNo: 'A1234AD', classification: 'Low' },
  ]
}

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

describe('keyworkerAllocations controller', async () => {
  let response

  beforeAll(async () => {
    elite2Api.sentenceDetailList = jest.fn().mockImplementationOnce(() => createSentenceDetailListResponse())
    elite2Api.caseNoteUsageList = jest.fn().mockImplementationOnce(() => createCaseNoteUsageResponse())
    elite2Api.csraList = jest.fn().mockImplementationOnce(() => createAssessmentListResponse())

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
    expect(response.allocatedResponse.map(a => a.lastKeyWorkerSessionDate)).toEqual([
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
