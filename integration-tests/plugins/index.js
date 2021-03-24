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
    stubLogin: ({ username = 'ITAG_USER', roles = [{ roleCode: 'OMIC_ADMIN' }] }) =>
      Promise.all([
        auth.stubLogin(username, roles),
        prisonApi.stubUserMe(),
        prisonApi.stubUserCaseloads(),
        prisonApi.stubUpdateCaseload(),
        keyworker.stubPrisonMigrationStatus({}),
        tokenverification.stubVerifyToken(true),
      ]),
    stubVerifyToken: (active = true) => tokenverification.stubVerifyToken(active),
    stubLoginPage: auth.redirect,
    stubUpdateCaseload: prisonApi.stubUpdateCaseload,
    stubSearchOffenders: (response = {}) => prisonApi.stubSearchOffenders(response),
    stubAvailableKeyworkers: (keyworkers) => keyworker.stubAvailableKeyworkers(keyworkers),
    stubOffenderKeyworker: () => keyworker.stubOffenderKeyworker(),
    stubOffenderSentences: () => prisonApi.stubOffenderSentences(),
    stubOffenderAssessments: () => prisonApi.stubOffenderAssessments(),
    stubGetComplexOffenders: (offenders = []) => complexityApi.stubGetComplexOffenders(offenders),
  })
}
