const HomePage = require('../pages/homePage')
const KeyworkerSearchPage = require('../pages/keyworkerSearchPage')
const CaseNoteUsageResponse = require('../responses/caseNoteUsageResponse')

context('Keyworker search tests', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubLogin', {
      username: 'ITAG_USER',
      caseload: 'MDI',
      roles: [{ roleCode: 'OMIC_ADMIN' }],
      migrationStatus: { migrated: true },
    })
    cy.login()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
    cy.task('stubCaseNoteUsageList', CaseNoteUsageResponse)
  })

  it('key worker profile is displayed correctly', () => {
    cy.visit('/')
    const homePage = HomePage.verifyOnPage()
    homePage.keyworkerSettings().click()
    KeyworkerSearchPage.verifyOnPage()
  })

  it('key worker profile is displayed correctly', () => {
    cy.task('stubKeyworkerSearch', []) // Stub empty results
    cy.visit('/')
    const homePage = HomePage.verifyOnPage()
    homePage.keyworkerSettings().click()
    const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
    keyworkerSearchPage.searchTextInput().type('Non matching text')
    keyworkerSearchPage.search()
    cy.get('body').contains('No key worker found')
  })
})
