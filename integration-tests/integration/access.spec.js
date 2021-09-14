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

context('Access test', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
  })

  describe('Tasks', () => {
    describe('Non admins', () => {
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
        cy.task('stubLogin', {
          username: 'ITAG_USER',
          caseload: 'MDI',
          roles: [],
          // roles: [{ roleCode: 'OMIC_ADMIN' }, { roleCode: 'KW_MIGRATION' }],
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
    })
  })
})
