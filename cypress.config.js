/* eslint-disable import/no-extraneous-dependencies */

const { defineConfig } = require('cypress')

const auth = require('./integration-tests/mockApis/auth')
const prisonApi = require('./integration-tests/mockApis/prisonApi')
const tokenverification = require('./integration-tests/mockApis/tokenverification')
const keyworker = require('./integration-tests/mockApis/keyworker')
const complexityApi = require('./integration-tests/mockApis/complexityOfNeedApi')

const { resetStubs } = require('./integration-tests/mockApis/wiremock')

module.exports = defineConfig({
  chromeWebSecurity: false,
  fixturesFolder: 'integration_tests/fixtures',
  screenshotsFolder: 'integration_tests/screenshots',
  videosFolder: 'integration_tests/videos',
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    configFile: 'reporter-config.json',
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
        stubSearchOffenders: ({ response = [], pageOffset = '0', totalRecords = '0' }) =>
          prisonApi.stubSearchOffenders(response, pageOffset, totalRecords),
        stubSearchOffendersError: prisonApi.stubSearchOffendersError,
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
})
