const HomePage = require('../pages/homePage')
const OffenderSearchPage = require('../pages/offenderSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const Utils = require('../support/utils')

const keyworkerResponse = {
  staffId: -3,
  firstName: 'HPA',
  lastName: 'AUser',
  thumbnailId: 1,
  capacity: 6,
  numberAllocated: 4,
  scheduleType: 'Full Time',
  agencyId: 'LEI',
  agencyDescription: 'Moorland (HMP & YOI)',
  status: 'ACTIVE',
  autoAllocationAllowed: true,
}

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
    cy.task('stubKeyworker', keyworkerResponse)
    cy.task('stubKeyworkerAllocations')
    cy.task('stubAvailableKeyworkers')
    cy.task('stubOffenderSentences')
    cy.task('stubOffenderAssessments')
    cy.task('stubCaseNoteUsageList')
    cy.visit(`/manage-key-workers/key-worker/${keyworkerResponse.staffId}`)
    KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
  })
})
