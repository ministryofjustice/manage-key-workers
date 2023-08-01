context('Manage key workers health test', () => {
  before(() => {
    cy.clearCookies()
    cy.task('reset')
  })
  it('Health page reports ok', () => {
    cy.task('stubAuthHealth')
    cy.task('stubManageUsersApiHealth')
    cy.task('stubComplexityHealth')
    cy.task('stubTokenHealth')
    cy.task('stubPrisonHealth')
    cy.task('stubKeyworkerHealth')
    cy.request('/health').then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.uptime).to.greaterThan(0)
      expect(response.body.name).to.eq('manage-key-workers')
      expect(response.body.status).to.eq('UP')
      expect(response.body.api).to.deep.eq({
        auth: 'UP',
        manageusers: "UP",
        elite2: 'UP',
        keyworker: 'UP',
        tokenverification: 'UP',
        complexityOfNeed: 'UP',
      })
    })
  })

  it('Health page reports API down', () => {
    cy.task('stubAuthHealth')
    cy.task('stubManageUsersApiHealth')
    cy.task('stubComplexityHealth')
    cy.task('stubTokenHealth')
    cy.task('stubPrisonHealth')
    cy.task('stubKeyworkerHealthTimoutError', 2000)
    cy.request({ method: 'GET', url: '/health', failOnStatusCode: false }).then((response) => {
      expect(response.status).to.eq(503)
      expect(response.body.uptime).to.greaterThan(0)
      expect(response.body.name).to.eq('manage-key-workers')
      expect(response.body.status).to.eq('DOWN')
      expect(response.body.api).to.deep.eq({
        auth: 'UP',
        manageusers: "UP",
        elite2: 'UP',
        keyworker: {
          timeout: 1000,
          code: 'ECONNABORTED',
          errno: 'ETIMEDOUT',
          retries: 2,
        },
        tokenverification: 'UP',
        complexityOfNeed: 'UP',
      })
    })
  })
})
