context('Manage key workers health test', () => {
  before(() => {
    cy.clearCookies()
    cy.task('reset')
  })
  describe('Tasks', () => {
    it('Health page reports ok', () => {
      cy.task('stubAuthHealth')
      cy.task('stubComplexityHealth')
      cy.task('stubTokenHealth')
      cy.task('stubPrisonHealth')
      cy.task('stubKeyWorkerHealth')
      cy.request('/health').then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.uptime).to.greaterThan(0)
        expect(response.body.name).to.eq('manage-key-workers')
        expect(response.body.status).to.eq('UP')
        expect(response.body.api).to.deep.eq({
          auth: 'UP',
          elite2: 'UP',
          keyworker: 'UP',
          tokenverification: 'UP',
          complexityOfNeed: 'UP',
        })
      })
    })
  })
})
