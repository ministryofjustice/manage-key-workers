const KeyworkerSearchPage = require('../pages/keyworkerSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const caseNoteUsageResponse = require('../responses/caseNoteUsageResponse')
const keyworkerResponse = require('../responses/keyworkerResponse')
const keyworkAllocationsResponse = require('../responses/keyworkerAllocationsResponse')
const availableKeyworkersResponse = require('../responses/availableKeyworkersResponse')

const keyworkerAllocations = keyworkAllocationsResponse
const keyworkerSearchResponse = [keyworkerResponse]

context('Access test', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubKeyworkerSearch', keyworkerSearchResponse)
    cy.task('stubKeyworker', keyworkerResponse)
    cy.task('stubAvailableKeyworkers', availableKeyworkersResponse)
    cy.task('stubKeyworkerAllocations', keyworkAllocationsResponse)
    cy.task('stubOffenderAssessments')
    cy.task('stubOffenderSentences')
    cy.task('stubCaseNoteUsageList', caseNoteUsageResponse)
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
  })

  describe('Tasks', () => {
    before(() => {
      cy.task('stubLogin', {
        username: 'ITAG_USER',
        caseload: 'MDI',
        roles: [],
        migrationStatus: { migrated: true },
      })
      cy.login()
    })

    it('key worker profile is displayed correctly', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Hpa Auser')
      keyworkerProfilePage.allocationCount().should('have.text', '5')
      keyworkerProfilePage.allocationSelectOptions(keyworkerAllocations[0].offenderNo).its('length').should('be.eq', 5)
      keyworkerProfilePage.verifyAllocationStyleGreen()
    })
  })
})
