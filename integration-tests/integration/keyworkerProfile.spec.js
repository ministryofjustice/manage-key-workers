const KeyworkerSearchPage = require('../pages/keyworkerSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const KeyworkerEditProfilePage = require('../pages/keyworkerEditProfilePage')
const KeyworkerEditProfileConfirmPage = require('../pages/keyworkerEditProfileConfirmPage')
const Utils = require('../support/utils')
const CaseNoteUsageResponse = require('../responses/caseNoteUsageResponse')
const KeyworkerResponse = require('../responses/keyworkerResponse').keyworkerResponse
const KeyworkerInactiveResponse = require('../responses/keyworkerResponse').keyworkerInactiveResponse
const KeyworkerAllocationsResponse = require('../responses/keyworkerAllocationsResponse')
const AvailableKeyworkersResponse = require('../responses/availableKeyworkersResponse')
const KeyworkerSearchResponse = require('../responses/keyworkerSearchResponse')

const navigateToEditPage = (keyworker) => {
  cy.visit('/key-worker-search')
  const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
  keyworkerSearchPage.searchAndClickKeyworker(keyworker.staffId)
  const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworker))
  keyworkerProfilePage.clickEditProfileButton()
  const editKeyworkerProfilePage = KeyworkerEditProfilePage.verifyOnPage()
  return editKeyworkerProfilePage
}

context('Profile test', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubLogin', {
      username: 'ITAG_USER',
      caseload: 'MDI',
      roles: [{ roleCode: 'OMIC_ADMIN' }],
      migrationStatus: { migrated: true },
    })
    cy.login()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
    cy.task('stubKeyworkerSearch', KeyworkerSearchResponse)
    cy.task('stubKeyworker', KeyworkerResponse)
    cy.task('stubKeyworkerStats')
    cy.task('stubAvailableKeyworkers', AvailableKeyworkersResponse)
    cy.task('stubKeyworkerAllocations', KeyworkerAllocationsResponse)
    cy.task('stubOffenderAssessments')
    cy.task('stubOffenderSentences')
    cy.task('stubCaseNoteUsageList', CaseNoteUsageResponse)
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
    const editKeyworkerProfilePage = navigateToEditPage(KeyworkerResponse)
    editKeyworkerProfilePage.capacity().should('have.value', 6)
    editKeyworkerProfilePage.keyworkerStatusSelect().find('option').its('length').should('be.eq', 5)
    editKeyworkerProfilePage.parentPageLink().click()
    KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
  })

  it('key worker edit confirm - INACTIVE - is displayed correctly', () => {
    const editKeyworkerProfilePage = navigateToEditPage(KeyworkerResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('INACTIVE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.status().should('have.text', 'Inactive')
    keyworkerEditProfileConfirmPage.inactiveWarning().should('exist')
    keyworkerEditProfileConfirmPage.parentPageLink().click()
    KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
  })

  it('key worker edit confirm - UNAVAILABLE_ANNUAL_LEAVE - is displayed correctly', () => {
    const editKeyworkerProfilePage = navigateToEditPage(KeyworkerResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('UNAVAILABLE_ANNUAL_LEAVE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.status().should('have.text', 'Unavailable - annual leave')
    keyworkerEditProfileConfirmPage.annualLeaveDatePicker().should('be.visible')
  })

  it('key worker edit confirm - UNAVAILABLE_ANNUAL_LEAVE - return date is mandatory', () => {
    const editKeyworkerProfilePage = navigateToEditPage(KeyworkerResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('UNAVAILABLE_ANNUAL_LEAVE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.allocationRadios().check('REMOVE_ALLOCATIONS_NO_AUTO')
    keyworkerEditProfileConfirmPage.save()
    keyworkerEditProfileConfirmPage.errorMessage().should('have.text', 'Please choose a return date')
  })

  it('key worker edit - saving active status', () => {
    cy.task('stubKeyworker', KeyworkerInactiveResponse) // Stub a inactive user
    cy.task('stubKeyworkerUpdate')
    const editKeyworkerProfilePage = navigateToEditPage(KeyworkerInactiveResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('ACTIVE')
    // We simulate user now being active do this before the save to avoid race conditions
    cy.task('stubKeyworker', KeyworkerResponse)
    editKeyworkerProfilePage.save()
    cy.task('verifyKeyworkerUpdate', { status: 'ACTIVE', capacity: `${KeyworkerResponse.capacity}` }).then((val) => {
      expect(JSON.parse(val.text).count).to.equal(1)
    })
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
    keyworkerProfilePage.status().should('have.text', 'Active')
    keyworkerProfilePage.messageBar().should('have.text', 'Profile changed')
  })

  it('key worker edit - saved with no changes - does not display message bar', () => {
    const editKeyworkerProfilePage = navigateToEditPage(KeyworkerResponse)
    editKeyworkerProfilePage.save()
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
    keyworkerProfilePage.status().should('have.text', 'Active')
    keyworkerProfilePage.messageBar().should('not.exist')
  })

  it('key worker edit confirm - no allocations - should not display Prisoners removed message', () => {
    cy.task('stubKeyworker', KeyworkerInactiveResponse) // Stub a inactive user
    const editKeyworkerProfilePage = navigateToEditPage(KeyworkerInactiveResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('UNAVAILABLE_LONG_TERM_ABSENCE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.allocationRadios().check('REMOVE_ALLOCATIONS_NO_AUTO')
    keyworkerEditProfileConfirmPage.save()
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
    keyworkerProfilePage.messageBar().should('have.text', 'Profile changed')
  })

  it('key worker edit confirm - allocations exist - should display Prisoners removed message', () => {
    const editKeyworkerProfilePage = navigateToEditPage(KeyworkerResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('UNAVAILABLE_LONG_TERM_ABSENCE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.allocationRadios().check('REMOVE_ALLOCATIONS_NO_AUTO')
    keyworkerEditProfileConfirmPage.save()
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
    keyworkerProfilePage.messageBar().should('have.text', 'Prisoners removed from key worker')
  })
})
