const KeyworkerSearchPage = require('../pages/keyworkerSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const EditKeyworkerProfilePage = require('../pages/editKeyworkerProfilePage')
const CaseNoteUsageResponse = require('../responses/caseNoteUsageResponse')
const KeyworkerResponse = require('../responses/keyworkerResponse')
const KeyworkerAllocationsResponse = require('../responses/keyworkerAllocationsResponse')
const AvailableKeyworkersResponse = require('../responses/availableKeyworkersResponse')

const KeyworkerSearchResponse = [KeyworkerResponse]

context('Access test', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubKeyworkerSearch', KeyworkerSearchResponse)
    cy.task('stubKeyworker', KeyworkerResponse)
    cy.task('stubAvailableKeyworkers', AvailableKeyworkersResponse)
    cy.task('stubKeyworkerAllocations', KeyworkerAllocationsResponse)
    cy.task('stubOffenderAssessments')
    cy.task('stubOffenderSentences')
    cy.task('stubCaseNoteUsageList', CaseNoteUsageResponse)
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
  })

  describe('Tasks', () => {
    before(() => {
      cy.task('stubLogin', {
        username: 'ITAG_USER',
        caseload: 'MDI',
        roles: [{ roleCode: 'OMIC_ADMIN' }],
        migrationStatus: { migrated: true },
      })
      cy.login()
    })

    it('key worker profile is displayed correctly', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(KeyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Hpa Auser')

      // Page context
      keyworkerProfilePage.allocationCount().should('have.text', '5')
      keyworkerProfilePage
        .allocationSelectOptions(KeyworkerAllocationsResponse[0].offenderNo)
        .its('length')
        .should('be.eq', 5)
      keyworkerProfilePage.verifyAllocationStyleGreen()

      // Page allocations table
      keyworkerProfilePage.getResultElement(4, 1).find('a').should('have.text', 'Talbot, Nick')
      keyworkerProfilePage.getResultElement(5, 1).should('have.text', 'Bowie, David')
      keyworkerProfilePage.getResultElement(5, 1).find('a').should('not.exist')
      keyworkerProfilePage.getResultElement(2, 6).should('have.text', '03/06/2018')
      keyworkerProfilePage.getResultElement(2, 7).should('have.text', '3')
    })

    it('key worker edit profile is displayed correctly', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(KeyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Hpa Auser')
      keyworkerProfilePage.clickEditProfileButton()
      const editKeyworkerProfilePage = EditKeyworkerProfilePage.verifyOnPage()
      editKeyworkerProfilePage.capacity().should('have.value', 6)
      editKeyworkerProfilePage.keyworkerStatusOptions().its('length').should('be.eq', 5)
      editKeyworkerProfilePage.parentPageLink().click()
      keyworkerProfilePage.checkStillOnPage()
    })
  })
})
