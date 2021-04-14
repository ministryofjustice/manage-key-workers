const auth = require('../mockApis/auth')
const prisonApi = require('../mockApis/prisonApi')
const tokenverification = require('../mockApis/tokenverification')
const keyworker = require('../mockApis/keyworker')
const complexityApi = require('../mockApis/complexityOfNeedApi')

const { resetStubs } = require('../mockApis/wiremock')

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
    stubUpdateCaseload: prisonApi.stubUpdateCaseload,
    stubSearchOffenders: (response = {}) => prisonApi.stubSearchOffenders(response),
    stubAvailableKeyworkers: (keyworkers) => keyworker.stubAvailableKeyworkers(keyworkers),
    stubKeyworkerSearch: (keyworkers) => keyworker.stubKeyworkerSearch(keyworkers),
    stubOffenderKeyworker: (response) => keyworker.stubOffenderKeyworker(response),
    stubOffenderSentences: (response) => prisonApi.stubOffenderSentences(response),
    stubOffenderAssessments: () => prisonApi.stubOffenderAssessments(),
    stubGetComplexOffenders: (offenders = []) => complexityApi.stubGetComplexOffenders(offenders),
    stubAllocationHistory: ({ offenderNo, response }) => keyworker.stubAllocationHistory({ offenderNo, response }),
    stubAllocate: () => keyworker.stubAllocate(),
    stubDeallocate: (offenderNo) => keyworker.stubDeallocate(offenderNo),
    stubUnallocated: ({ agencyId, response }) => keyworker.stubUnallocated({ agencyId, response }),
    stubAutoAllocate: ({ agencyId, response }) => keyworker.stubAutoAllocate({ agencyId, response }),
    stubAutoAllocated: ({ agencyId, response }) => keyworker.stubAutoAllocated({ agencyId, response }),
    stubAutoAllocateConfirm: ({ agencyId, response }) => keyworker.stubAutoAllocateConfirm({ agencyId, response }),
    stubOffenderKeyworkerList: ({ agencyId, response }) => keyworker.stubOffenderKeyworkerList({ agencyId, response }),
    verifyAllocateWasCalled: () => keyworker.verifyAllocateWasCalled(),
    verifyDeallocateWasCalled: (offenderNo) => keyworker.verifyAllocateWasCalled(offenderNo),
  })
}
