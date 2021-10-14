const OffenderSearchPage = require('../pages/offenderSearchPage')
const KeyworkerSearchPage = require('../pages/keyworkerSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const Utils = require('../support/utils')

const offenderSearchResponse = [
  {
    bookingId: -29,
    bookingNo: 'Z00029',
    offenderNo: 'Z0024ZZ',
    firstName: 'NEIL',
    middleName: 'IAN',
    lastName: 'BRADLEY',
    dateOfBirth: '1945-01-10',
    age: 73,
    agencyId: 'LEI',
    assignedLivingUnitId: -14,
    assignedLivingUnitDesc: 'H-1',
    iepLevel: 'Entry',
  },
]

const keyworkerAllocationsResponse = [
  {
    bookingId: -24,
    offenderNo: 'Z0024ZZ',
    firstName: 'LUCIUS',
    lastName: 'FOX',
    staffId: -3,
    agencyId: 'LEI',
    prisonId: 'LEI',
    assigned: '2018-04-09T14:34:35.574',
    allocationType: 'A',
    internalLocationDesc: 'H-1',
    deallocOnly: false,
  },
]

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

const keyworkerSearchResponse = [
  {
    staffId: -3,
    firstName: 'HPA',
    lastName: 'AUser',
    capacity: 6,
    numberAllocated: 4,
    scheduleType: 'Full Time',
    agencyId: 'LEI',
    agencyDescription: 'LEEDS',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
    numKeyWorkerSessions: 5,
  },
]

context('Access test', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubKeyworkerSearch', keyworkerSearchResponse)
    cy.task('stubKeyworker', keyworkerResponse)
    cy.task('stubAvailableKeyworkers')
    cy.task('stubKeyworkerAllocations', keyworkerAllocationsResponse)
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
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
      keyworkerProfilePage.editProfileButton().should('exist')
      keyworkerProfilePage.updateAllocationButton().should('exist')
    })

    it('the allocate to new key worker drop down should not be disabled on the profile page when a key worker admin', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
      keyworkerProfilePage.allocationSelect(keyworkerAllocationsResponse[0].offenderNo).should('be.enabled')
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
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
      keyworkerProfilePage.editProfileButton().should('not.exist')
      keyworkerProfilePage.updateAllocationButton().should('not.exist')
    })

    it('the allocate to new key worker drop down should be disabled on the profile page when not a key worker admin', () => {
      cy.visit('/key-worker-search')
      const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
      keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
      const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
      keyworkerProfilePage.allocationSelect(keyworkerAllocationsResponse[0].offenderNo).should('be.disabled')
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
      offenderSearchPage.keyworkerSelect(keyworkerAllocationsResponse[0].offenderNo).should('be.disabled')
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
