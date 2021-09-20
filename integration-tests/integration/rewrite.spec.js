const HomePage = require('../pages/homePage')
const OffenderSearchPage = require('../pages/offenderSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const Utils = require('../support/utils')
const KeyworkerAllocationsResponse = require('../responses/keyworkerAllocationsResponse')
const KeyworkerResponse = require('../responses/keyworkerResponse').keyworkerResponse
const AvailableKeyworkersResponse = require('../responses/availableKeyworkersResponse')
const CaseNoteUsageResponse = require('../responses/caseNoteUsageResponse')

context('rewrite tests', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')

    cy.task('stubLogin', {
      username: 'ITAG_USER',
      caseload: 'MDI',
      roles: [],
      migrationStatus: { migrated: true },
    })
    cy.login()
  })
  it('should route to the home page using old URL', () => {
    cy.visit('/manage-key-workers')
    HomePage.verifyOnPage()
  })

  it('should route to the offender search page using old URL', () => {
    cy.visit('/manage-key-workers/offender-search')
    OffenderSearchPage.verifyOnPage()
  })

  it('should route to edit keyworker using old URL', () => {
    cy.task('stubKeyworker', KeyworkerResponse)
    cy.task('stubKeyworkerAllocations', KeyworkerAllocationsResponse)
    cy.task('stubAvailableKeyworkers', AvailableKeyworkersResponse)
    cy.task('stubOffenderSentences')
    cy.task('stubOffenderAssessments')
    cy.task('stubCaseNoteUsageList', CaseNoteUsageResponse)
    cy.visit(`/manage-key-workers/key-worker/${KeyworkerResponse.staffId}`)
    KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
  })
})
