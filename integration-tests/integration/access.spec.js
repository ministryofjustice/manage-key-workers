const OffenderSearchPage = require('../pages/offenderSearchPage')
const KeyworkerSearchPage = require('../pages/keyworkerSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const keyworkerResponse = require('../responses/keyworkerResponse')
const keyworkerAllocations = require('../responses/keyworkerAllocationsResponse')
const offenderSearchResponse = require('../responses/offenderSearchResponse')

const keyworkerSearchResponse = [keyworkerResponse]

context('Access test', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubKeyworkerSearch', keyworkerSearchResponse)
    cy.task('stubKeyworker', keyworkerResponse)
    cy.task('stubAvailableKeyworkers')
    cy.task('stubKeyworkerAllocations', keyworkerAllocations)
    cy.task('stubKeyworkerStats')
    cy.task('stubOffenderAssessments')
    cy.task('stubOffenderSentences')
    cy.task('stubUpdateCaseload')
    cy.task('stubOffenderSentences')
    cy.task('stubCaseNoteUsageList')
    cy.task('stubSearchOffenders', offenderSearchResponse)
    cy.task('stubOffenderKeyworker')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
  })

  describe('Admins', () => {
    before(() => {
      cy.task('stubLogin', {
        username: 'ITAG_USER',
        caseload: 'MDI',
        roles: [{ roleCode: 'OMIC_ADMIN' }],
        migrationStatus: { migrated: true },
      })
      cy.login()
    })

    it('should see the edit profile and update buttons on the profile page when a key worker admin', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Hpa Auser')
      keyworkerProfilePage.editProfileButton().should('exist')
      keyworkerProfilePage.updateAllocationButton().should('exist')
    })

    it('the allocate to new key worker drop down should not be disabled on the profile page when a key worker admin', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Hpa Auser')
      keyworkerProfilePage.allocationSelect(keyworkerAllocations[0].offenderNo).should('be.enabled')
    })

    it('the confirm and cancel buttons should not hidden on the manual allocations page when the current user is key worker admin', () => {
      cy.visit('/offender-search')
      const offenderSearchPage = OffenderSearchPage.verifyOnPage()
      offenderSearchPage.verifyPageReady()
      offenderSearchPage.search()
      offenderSearchPage.saveButton().should('exist')
    })
  })

  describe('Non admins', () => {
    beforeEach(() => {
      cy.task('stubLogin', {
        username: 'ITAG_USER',
        caseload: 'MDI',
        roles: [],
        migrationStatus: { migrated: true },
      })
      cy.login()
    })

    it('should not see the edit profile and update buttons on the profile page when the current user is not a key worker admin', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Hpa Auser')
      keyworkerProfilePage.editProfileButton().should('not.exist')
      keyworkerProfilePage.updateAllocationButton().should('not.exist')
    })

    it('the allocate to new key worker drop down should be disabled on the profile page when not a key worker admin', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Hpa Auser')
      keyworkerProfilePage.allocationSelect(keyworkerAllocations[0].offenderNo).should('be.disabled')
    })

    it('should not be able to navigate to a key workers edit profile when the current user is not a key worker admin', () => {
      cy.visit(`/key-worker/${keyworkerResponse.staffId}/edit`)
      cy.url().should('eq', `${Cypress.config().baseUrl}/`)
    })

    it('should not be able to navigate to the auto allocation page when the current user is not a key worker admin', () => {
      cy.visit(`/unallocated`)
      cy.url().should('eq', `${Cypress.config().baseUrl}/`)
    })

    it('should not be able to navigate to the provisional allocation page when the current user is not a key worker admin', () => {
      cy.visit(`/unallocated/provisional-allocation`)
      cy.url().should('eq', `${Cypress.config().baseUrl}/`)
    })

    it('the allocate to new key worker drop down should be disabled on the manual allocations page when the current user is not a key worker admin', () => {
      cy.visit('/offender-search')
      const offenderSearchPage = OffenderSearchPage.verifyOnPage()
      offenderSearchPage.verifyPageReady()
      offenderSearchPage.search()
      offenderSearchPage.keyworkerSelect(keyworkerAllocations[0].offenderNo).should('be.disabled')
    })

    it('the confirm and cancel buttons should be hidden on the manual allocations page when the current user is not a key worker admin', () => {
      cy.visit('/offender-search')
      const offenderSearchPage = OffenderSearchPage.verifyOnPage()
      offenderSearchPage.verifyPageReady()
      offenderSearchPage.search()
      offenderSearchPage.saveButton().should('not.exist')
    })
  })
})
