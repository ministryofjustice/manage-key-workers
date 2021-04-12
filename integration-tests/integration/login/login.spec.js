const HomePage = require('../../pages/homePage')
const SearchPage = require('../../pages/searchPage')

context('Login functionality', () => {
  before(() => {
    cy.clearCookies()
  })

  beforeEach(() => {
    cy.task('reset')
    cy.task('stubUpdateCaseload')
  })

  it('Root (/) redirects to the auth login page if not logged in', () => {
    cy.task('stubLoginPage')
    cy.visit('/')
    cy.url().should('include', 'authorize')
    cy.get('h1').should('contain.text', 'Sign in')
  })

  it('Login page redirects to the auth login page if not logged in', () => {
    cy.task('stubLoginPage')
    cy.visit('/login')
    cy.url().should('include', 'authorize')
    cy.get('h1').should('contain.text', 'Sign in')
  })

  it('Page redirects to the auth login page if not logged in', () => {
    cy.task('stubLogin', {})
    cy.visit('/login')
    cy.url().should('include', 'authorize')
    cy.get('h1').should('contain.text', 'Sign in')
  })

  it('Logout takes user to login page', () => {
    cy.task('stubLogin', {})
    cy.login()
    HomePage.verifyOnPage()

    // can't do a visit here as cypress requires only one domain
    cy.request('/auth/logout').its('body').should('contain', 'Sign in')
  })

  it('Token verification failure clears user session', () => {
    cy.task('stubLogin', {})
    cy.login()
    HomePage.verifyOnPage()
    cy.task('stubVerifyToken', false)

    // can't do a visit here as cypress requires only one domain
    cy.request('/').its('body').should('contain', 'Sign in')
  })

  it("Log in as ordinary user shouldn't show settings or auto allocate", () => {
    cy.task('stubLogin', { username: 'joe', roles: [{}] })
    cy.login()
    const homePage = HomePage.verifyOnPage()
    homePage.keyworkerSettingsLink().should('not.exist')
  })

  it('Log in as keyworker migration user', () => {
    cy.task('stubLogin', { roles: [{ roleCode: 'KW_MIGRATION' }] })
    cy.login()
    const homePage = HomePage.verifyOnPage()
    homePage.keyworkerSettingsLink().should('exist')
  })

  it('Log in as keyworker admin user', () => {
    cy.task('stubLogin', { roles: [{ roleCode: 'OMIC_ADMIN' }] })
    cy.login()
    const homePage = HomePage.verifyOnPage()
    homePage.keyworkerSettingsLink().should('not.exist')
  })

  it('User login takes user back to requested page', () => {
    cy.task('stubLogin', { username: 'joe', roles: [{}] })
    // has to be request rather than visit so we don't get cross origin issues
    cy.request('/key-worker-search')
    cy.task('getLoginUrl').then(cy.visit)
    SearchPage.verifyOnPage()
  })
})
