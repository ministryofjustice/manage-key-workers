const verifyOnPage = () => cy.get('h1').contains('Search for a prisoner')

context('Offender search', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubLogin', { username: 'ITAG_USER', caseload: 'WWI' })
    cy.login()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
  })

  it('should show default message for no offenders found', () => {
    cy.task('stubSearchOffenders', [])
    cy.visit('/manage-key-workers/search-for-prisoner')

    verifyOnPage()

    cy.get('#no-offenders-returned-message')
      .first()
      .eq('There are no results for the name or number you have entered. You can search again.')
  })
})
