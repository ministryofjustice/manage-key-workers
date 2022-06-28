context('ping tests', () => {
  it('ping returns pong', () => {
    cy.visit('/ping')
    cy.get('body').should('have.text', 'pong')
  })
})
