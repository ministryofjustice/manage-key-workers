/* eslint-disable import/no-extraneous-dependencies */

const { defineConfig } = require('cypress')

const auth = require('./integration-tests/mockApis/auth')
const users = require('./integration-tests/mockApis/users')
const prisonApi = require('./integration-tests/mockApis/prisonApi')
const prisonerSearchApi = require('./integration-tests/mockApis/prisonerSearchApi')
const tokenverification = require('./integration-tests/mockApis/tokenverification')
const keyworker = require('./integration-tests/mockApis/keyworker')
const complexityApi = require('./integration-tests/mockApis/complexityOfNeedApi')

const { resetStubs } = require('./integration-tests/mockApis/wiremock')

module.exports = defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration-tests/fixtures',
  screenshotsFolder: 'integration-tests/screenshots',
  videosFolder: 'integration-tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'cypress-reporter-config.json',
  },
  videoUploadOnPasses: false,
  taskTimeout: 60000,
  viewportWidth: 1024,
  viewportHeight: 768,
  e2e: {
    setupNodeEvents(on) {
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
            users.stubUserMe(),
            users.stubUserMeRoles(roles),
            users.stubUser(username, caseloadId),
            keyworker.stubPrisonMigrationStatus(migrationStatus),
            tokenverification.stubVerifyToken(true),
          ]),
        stubVerifyToken: (active = true) => tokenverification.stubVerifyToken(active),
        stubLoginPage: auth.redirect,
        stubAuthHealth: auth.stubHealth,
        stubManageUsersApiHealth: users.stubHealth,
        stubComplexityHealth: complexityApi.stubHealth,
        stubTokenHealth: tokenverification.stubHealth,
        stubPrisonHealth: prisonApi.stubHealth,
        stubKeyworkerHealth: keyworker.stubHealth,
        stubKeyworkerHealthTimoutError: (timout) => keyworker.stubHealthTimeoutError(timout),
        stubUpdateCaseload: prisonApi.stubUpdateCaseload,
        stubSearchOffendersPaginated: ({ response, locationPrefix, page, pageSize }) =>
          prisonerSearchApi.stubSearchOffendersPaginated(response, locationPrefix, page, pageSize),
        stubSearchOffenders: ({ response, term = '' }) => prisonerSearchApi.stubSearchOffenders(response, term),
        stubSearchOffendersError: prisonerSearchApi.stubSearchOffendersError,
        stubKeyworkerAllocations: (response) => keyworker.stubKeyworkerAllocations(response),
        stubKeyworker: (response) => keyworker.stubKeyworker(response),
        stubAvailableKeyworkers: (keyworkers) => keyworker.stubAvailableKeyworkers(keyworkers),
        stubKeyworkerSearch: (keyworkers) => keyworker.stubKeyworkerSearch(keyworkers),
        stubKeyworkerSearchError: keyworker.stubKeyworkerSearchError,
        stubOffenderKeyworker: (response) => keyworker.stubOffenderKeyworker(response),
        stubGetOffenders: (response) => prisonerSearchApi.stubGetOffenders(response),
        stubGetComplexOffenders: (offenders = []) => complexityApi.stubGetComplexOffenders(offenders),
        stubAllocationHistory: ({ offenderNo, response }) => keyworker.stubAllocationHistory({ offenderNo, response }),
        stubAllocationHistorySummary: (response) => keyworker.stubAllocationHistorySummary(response),
        stubAllocate: () => keyworker.stubAllocate(),
        stubDeallocate: (offenderNo) => keyworker.stubDeallocate(offenderNo),
        stubUnallocated: ({ agencyId, response }) => keyworker.stubUnallocated({ agencyId, response }),
        stubAutoAllocate: ({ agencyId, response, status }) =>
          keyworker.stubAutoAllocate({ agencyId, response, status }),
        stubAutoAllocated: ({ agencyId, response }) => keyworker.stubAutoAllocated({ agencyId, response }),
        stubAutoAllocateConfirm: ({ agencyId, response }) => keyworker.stubAutoAllocateConfirm({ agencyId, response }),
        stubOffenderKeyworkerList: ({ agencyId, response }) =>
          keyworker.stubOffenderKeyworkerList({ agencyId, response }),
        verifyAllocateWasCalled: () => keyworker.verifyAllocateWasCalled(),
        verifyDeallocateWasCalled: (offenderNo) => keyworker.verifyAllocateWasCalled(offenderNo),
        stubClientCredentialsRequest: () => auth.stubClientCredentialsRequest(),
        stubPrisonMigrationStatus: (settings) => keyworker.stubPrisonMigrationStatus(settings),
        stubKeyworkerStats: (response) => keyworker.stubKeyworkerStats(response),
        verifyPrisonStatsCalled: ({ prisonId, from, to }) => keyworker.verifyPrisonStatsCalled({ prisonId, from, to }),
        stubCaseNoteUsageList: (response) => prisonApi.stubCaseNoteUsageList(response),
        stubKeyworkerUpdate: (response) => keyworker.stubKeyworkerUpdate(response),
        stubUserLocations: (locations) => prisonApi.stubUserLocations(locations),
        verifyKeyworkerSearchCalled: (queryParameters) => keyworker.verifyKeyworkerSearchCalled(queryParameters),
        verifyKeyworkerUpdate: (body) => keyworker.verifyKeyworkerUpdate(body),
        verifyKeyworkerStatsCalled: ({ from, to }) => keyworker.verifyKeyworkerStatsCalled({ from, to }),
      })
    },

    baseUrl: 'http://localhost:3008',
    specPattern: 'integration-tests/integration/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'integration-tests/support/index.js',
  },
  retries: {
    runMode: 3,
  },
})
