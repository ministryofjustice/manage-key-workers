const OffenderSearchPage = require('../pages/offenderSearchPage')
const KeyworkerSearchPage = require('../pages/keyworkerSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')

const keyworkerResponse = {
  staffId: 1,
  firstName: 'BOB',
  lastName: 'BALL',
  thumbnailId: 1,
  capacity: 6,
  numberAllocated: 6,
  scheduleType: 'Full Time',
  agencyId: 'MDI',
  agencyDescription: 'Moorland (HMP & YOI)',
  status: 'ACTIVE',
  autoAllocationAllowed: true,
}

const keyworkerSearchResponse = [keyworkerResponse]

const keyworkerAllocations = [
  {
    bookingId: 2,
    offenderNo: 'G6415GD',
    firstName: 'GEORGE',
    middleNames: 'WILLIS',
    lastName: 'PETERSON',
    staffId: keyworkerResponse.staffId,
    agencyId: keyworkerResponse.agencyId,
    prisonId: 'MDI',
    assigned: '2021-06-18T09:06:17.837964',
    allocationType: 'A',
    internalLocationDesc: '1-2-033',
    deallocOnly: false,
  },
]

const offenderResponse = [
  {
    offenderNo: 'G6415GD',
    firstName: 'GEORGE',
    middleName: 'WILLIS',
    lastName: 'PETERSON',
    agencyId: 'MDI',
    assignedLivingUnitId: 1,
    assignedLivingUnitDesc: 'CSWAP',
    staffId: null,
    keyworkerDisplay: '--',
    numberAllocated: 'n/a',
  },
]

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
    cy.task('stubSearchOffenders', offenderResponse)
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
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Bob Ball')
      keyworkerProfilePage.editProfileButton().should('exist')
      keyworkerProfilePage.updateAllocationButton().should('exist')
    })
    it('the allocate to new key worker drop down should not be disabled on the profile page when a key worker admin', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Bob Ball')
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
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Bob Ball')
      keyworkerProfilePage.editProfileButton().should('not.exist')
      keyworkerProfilePage.updateAllocationButton().should('not.exist')
    })

    it('the allocate to new key worker drop down should be disabled on the profile page when not a key worker admin', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage('Bob Ball')
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
