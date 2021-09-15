const OffenderSearchPage = require('../pages/offenderSearchPage')

const keyworkerBobResponse = {
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

const keyworkerSearchResponse = [keyworkerBobResponse]

const keyworkerBobsAllocations = [
  {
    bookingId: 2,
    offenderNo: 'G6415GD',
    firstName: 'GEORGE',
    middleNames: 'WILLIS',
    lastName: 'PETERSON',
    staffId: keyworkerBobResponse.staffId,
    agencyId: keyworkerBobResponse.agencyId,
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
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
  })

  describe('Tasks', () => {
    before(() => {
      cy.task('stubKeyworkerSearch', keyworkerSearchResponse)
      cy.task('stubKeyworker', {
        userId: keyworkerBobResponse.staffId,
        agencyId: keyworkerBobResponse.agencyId,
        response: keyworkerBobResponse,
      })
      cy.task('stubAvailableKeyworkers', [])
      cy.task('stubKeyworkerAllocations', {
        userId: keyworkerBobResponse.staffId,
        agencyId: keyworkerBobResponse.agencyId,
        response: keyworkerBobsAllocations,
      })
      cy.task('stubKeyworkerStats', {
        summary: {
          requestedFromDate: '2018-10-12',
          requestedToDate: '2018-11-12',
        },
      })
      cy.task('stubOffenderAssessments')
      cy.task('stubOffenderSentences')
      cy.task('stubUpdateCaseload')
      cy.task('stubOffenderSentences')
      cy.task('stubCaseNoteUsageList')

      // qqRP
      cy.task('stubSearchOffenders', offenderResponse)
      cy.task('stubOffenderKeyworker')
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
        cy.get('button').click()
        cy.get(`#key_worker_${keyworkerBobResponse.staffId}_link`).click()
        cy.get('h1').contains('Bob Ball') // Ensure we are actually showing the page.
        cy.get('#editProfileButton').should('exist')
        cy.get('#updateAllocationButton').should('exist')
      })
      it('the allocate to new key worker drop down should not be disabled on the profile page when a key worker admin', () => {
        cy.visit('/key-worker-search')
        cy.get('button').click()
        cy.get(`#key_worker_${keyworkerBobResponse.staffId}_link`).click()
        cy.get('h1').contains('Bob Ball') // Ensure we are actually showing the page.
        cy.get(`#keyworker-select-${keyworkerBobsAllocations[0].offenderNo}`).should('be.enabled')
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
        cy.get('button').click()
        cy.get(`#key_worker_${keyworkerBobResponse.staffId}_link`).click()
        cy.get('h1').contains('Bob Ball') // Ensure we are actually showing the page.
        cy.get('#editProfileButton').should('not.exist')
        cy.get('#updateAllocationButton').should('not.exist')
      })

      it('the allocate to new key worker drop down should be disabled on the profile page when not a key worker admin', () => {
        cy.visit('/key-worker-search')
        cy.get('button').click()
        cy.get(`#key_worker_${keyworkerBobResponse.staffId}_link`).click()
        cy.get('h1').contains('Bob Ball') // Ensure we are actually showing the page.
        cy.get(`#keyworker-select-${keyworkerBobsAllocations[0].offenderNo}`).should('be.disabled')
      })

      it('should not be able to navigate to a key workers edit profile when the current user is not a key worker admin', () => {
        cy.visit(`/key-worker/${keyworkerBobResponse.staffId}/edit`)
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
        offenderSearchPage.keyworkerSelect(keyworkerBobsAllocations[0].offenderNo).should('be.disabled')
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
})
