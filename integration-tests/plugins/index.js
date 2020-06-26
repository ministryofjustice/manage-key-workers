const auth = require('../mockApis/auth')
const elite2api = require('../mockApis/elite2')
const tokenverification = require('../mockApis/tokenverification')
const keyworker = require('../mockApis/keyworker')

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
        elite2api.stubUserMe(),
        elite2api.stubUserCaseloads(),
        keyworker.stubPrisonMigrationStatus({}),
        tokenverification.stubVerifyToken(true),
      ]),
    stubVerifyToken: (active = true) => tokenverification.stubVerifyToken(active),
    stubLoginPage: auth.redirect,
  })
}
