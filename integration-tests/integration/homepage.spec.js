context('Homepage', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
  })

  describe('Tasks', () => {
    describe('Default tasks', () => {
      beforeEach(() => {
        cy.task('stubLogin', {
          username: 'ITAG_USER',
          caseload: 'MDI',
          roles: [],
          migrationStatus: { migrated: false },
        })
        cy.login()
      })

      it('should show the correct tasks', () => {
        cy.visit('/')

        cy.get('[data-test="view-without-key-worker"]').should('exist')
        cy.get('[data-test="view-residential-location"]').should('exist')
        cy.get('[data-test="search-for-prisoner"]').should('exist')
      })
    })

    describe('Config and role specific tasks', () => {
      beforeEach(() => {
        cy.task('stubLogin', {
          username: 'ITAG_USER',
          caseload: 'MDI',
          roles: [{ roleCode: 'OMIC_ADMIN' }, { roleCode: 'KW_MIGRATION' }],
          migrationStatus: { migrated: true },
        })
        cy.login()
      })

      it('should show the correct additional tasks', () => {
        cy.visit('/')

        cy.get('[data-test="key-worker-settings"]').should('exist')
        cy.get('[data-test="key-worker-statistics"]').should('exist')
        cy.get('[data-test="establishment-key-worker-settings"]').should('exist')
      })
    })
  })
})
