context('Manage key worker settings', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
    cy.task('stubLogin', {
      username: 'ITAG_USER',
      caseload: 'MDI',
      roles: [{ roleCode: 'KW_MIGRATION' }],
      migrationStatus: {
        migrated: true,
        autoAllocatedSupported: true,
        capacityTier1: 5,
        capacityTier2: 10,
        kwSessionFrequencyInWeeks: 4,
      },
    })
    cy.login()
  })

  it('should have the correct page elements with the correct data', () => {
    cy.visit('/manage-key-worker-settings')

    cy.get('h1').should('contain', 'Manage Moorland’s key worker settings')
    cy.get('[data-test="allow-auto"]').find('#allowAuto').should('be.checked')
    cy.get('[data-test="standard-capacity"]').should('have.value', 5)
    cy.get('[data-test="extended-capacity"]').should('have.value', 10)
    cy.get('[data-test="frequency"]').should('have.value', 4)
    cy.get('[data-test="cancel-button"]')
      .should('have.attr', 'href')
      .then((href) => {
        expect(href).to.equal('/')
      })
  })

  it('should display an error when tier 2 value has higher than tier 1', () => {
    cy.visit('/manage-key-worker-settings')

    cy.get('[data-test="extended-capacity"]').type('{selectall}3')
    cy.get('[data-test="save-button"]').click()

    cy.get('[data-test="form-errors"]')
      .find('li')
      .then(($errors) => {
        expect($errors.get(0).innerText).to.contain(
          'Enter a maximum number of prisoners a key worker is able to have which is not less than the number of prisoners a key worker can have allocated'
        )
      })
  })
})
