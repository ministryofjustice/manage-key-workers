const auth = require('../mockApis/auth')
const prisonApi = require('../mockApis/prisonApi')
const tokenverification = require('../mockApis/tokenverification')
const keyworker = require('../mockApis/keyworker')
const complexityApi = require('../mockApis/complexityOfNeedApi')

const { resetStubs } = require('../mockApis/wiremock')
const { stubKeyworkerUpdate, verifyKeyworkerUpdate } = require('../mockApis/keyworker')

module.exports = (on) => {
  on('task', {
    reset: resetStubs,
    resetAndStubTokenVerification: async () => {
      await resetStubs()
      return tokenverification.stubVerifyToken(true)
    },
    getLoginUrl: auth.getLoginUrl,
    stubLogin: ({
      username = 'ITAG_USER',
      roles = [{ roleCode: 'OMIC_ADMIN' }],
      caseloadId = 'MDI',
      migrationStatus = {},
    }) =>
      Promise.all([
        auth.stubLogin(username, caseloadId, roles),
        prisonApi.stubUserMe(),
        prisonApi.stubUserCaseloads(),
        prisonApi.stubUpdateCaseload(),
        keyworker.stubPrisonMigrationStatus(migrationStatus),
        tokenverification.stubVerifyToken(true),
      ]),
    stubVerifyToken: (active = true) => tokenverification.stubVerifyToken(active),
    stubLoginPage: auth.redirect,
    stubAuthHealth: auth.stubHealth,
    stubComplexityHealth: complexityApi.stubHealth,
    stubTokenHealth: tokenverification.stubHealth,
    stubPrisonHealth: prisonApi.stubHealth,
    stubKeyworkerHealth: keyworker.stubHealth,
    stubKeyworkerHealthTimoutError: (timout) => keyworker.stubHealthTimeoutError(timout),
    stubUpdateCaseload: prisonApi.stubUpdateCaseload,
    stubSearchOffenders: (response = {}) => prisonApi.stubSearchOffenders(response),
    stubKeyworkerAllocations: (response) => keyworker.stubKeyworkerAllocations(response),
    stubKeyworker: (response) => keyworker.stubKeyworker(response),
    stubAvailableKeyworkers: (keyworkers) => keyworker.stubAvailableKeyworkers(keyworkers),
    stubKeyworkerSearch: (keyworkers) => keyworker.stubKeyworkerSearch(keyworkers),
    stubKeyworkerSearchError: keyworker.stubKeyworkerSearchError,
    stubOffenderKeyworker: (response) => keyworker.stubOffenderKeyworker(response),
    stubOffenderSentences: (response) => prisonApi.stubOffenderSentences(response),
    stubOffenderAssessments: () => prisonApi.stubOffenderAssessments(),
    stubGetComplexOffenders: (offenders = []) => complexityApi.stubGetComplexOffenders(offenders),
    stubAllocationHistory: ({ offenderNo, response }) => keyworker.stubAllocationHistory({ offenderNo, response }),
    stubAllocationHistorySummary: (response) => keyworker.stubAllocationHistorySummary(response),
    stubAllocate: () => keyworker.stubAllocate(),
    stubDeallocate: (offenderNo) => keyworker.stubDeallocate(offenderNo),
    stubUnallocated: ({ agencyId, response }) => keyworker.stubUnallocated({ agencyId, response }),
    stubAutoAllocate: ({ agencyId, response, status }) => keyworker.stubAutoAllocate({ agencyId, response, status }),
    stubAutoAllocated: ({ agencyId, response }) => keyworker.stubAutoAllocated({ agencyId, response }),
    stubAutoAllocateConfirm: ({ agencyId, response }) => keyworker.stubAutoAllocateConfirm({ agencyId, response }),
    stubOffenderKeyworkerList: ({ agencyId, response }) => keyworker.stubOffenderKeyworkerList({ agencyId, response }),
    verifyAllocateWasCalled: () => keyworker.verifyAllocateWasCalled(),
    verifyDeallocateWasCalled: (offenderNo) => keyworker.verifyAllocateWasCalled(offenderNo),
    stubClientCredentialsRequest: () => auth.stubClientCredentialsRequest(),
    stubPrisonMigrationStatus: (settings) => keyworker.stubPrisonMigrationStatus(settings),
    stubKeyworkerStats: (response) => keyworker.stubKeyworkerStats(response),
    verifyKeyworkerStatsCalled: ({ prisonId, from, to }) =>
      keyworker.verifyKeyworkerStatsCalled({ prisonId, from, to }),
    stubCaseNoteUsageList: (response) => prisonApi.stubCaseNoteUsageList(response),
    stubKeyworkerUpdate: (response) => keyworker.stubKeyworkerUpdate(response),
    verifyKeyworkerSearchCalled: (queryParameters) => keyworker.verifyKeyworkerSearchCalled(queryParameters),
    verifyKeyworkerUpdate: (body) => keyworker.verifyKeyworkerUpdate(body),
  })
}
