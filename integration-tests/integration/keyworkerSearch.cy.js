const HomePage = require('../pages/homePage')
const KeyworkerSearchPage = require('../pages/keyworkerSearchPage')

const keyworkerSearchResponse = [
  {
    staffId: -3,
    firstName: 'HPA',
    lastName: 'AUser',
    capacity: 6,
    numberAllocated: 4,
    scheduleType: 'Full Time',
    agencyId: 'LEI',
    agencyDescription: 'LEEDS',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
    numKeyWorkerSessions: 5,
  },
  {
    staffId: -1,
    firstName: 'Elite2',
    lastName: 'Buser',
    capacity: 6,
    numberAllocated: 0,
    scheduleType: 'Full Time',
    agencyId: 'LEI',
    agencyDescription: 'LEEDS',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
    numKeyWorkerSessions: 2,
  },
]

const caseNoteUsageResponse = [
  {
    caseNoteType: 'KA',
    caseNoteSubType: 'KE',
    offenderNo: 'A1178RS',
    numCaseNotes: 2,
    latestCaseNote: '2018-06-15T09:38:38.525Z',
  },
]

const navigateToSearchPage = () => {
  cy.visit('/')
  const homePage = HomePage.verifyOnPage()
  homePage.keyworkerSettings().click()
  return KeyworkerSearchPage.verifyOnPage()
}

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
    cy.task('stubCaseNoteUsageList', caseNoteUsageResponse)
    cy.task('stubKeyworkerSearch', keyworkerSearchResponse)
  })

  it('key worker search', () => {
    cy.visit('/')
    const homePage = HomePage.verifyOnPage()
    homePage.keyworkerSettings().click()
    KeyworkerSearchPage.verifyOnPage()
  })

  it('Search for key worker returns no results', () => {
    cy.task('stubKeyworkerSearch', []) // Stub empty results
    const keyworkerSearchPage = navigateToSearchPage()
    keyworkerSearchPage.searchTextInput().type('Non matching text')
    keyworkerSearchPage.search()
    cy.get('body').contains('No key worker found')
  })

  it('Search for all key workers returns results', () => {
    const keyworkerSearchPage = navigateToSearchPage()
    keyworkerSearchPage.search()
    keyworkerSearchPage.searchRows().its('length').should('eq', 2)
  })

  it('Search for all key workers returns results show last KW Sessions in last month', () => {
    const keyworkerSearchPage = navigateToSearchPage()
    keyworkerSearchPage.search()
    keyworkerSearchPage.getHeaderElement(6).should('have.html', 'No. KW sessions<br>in last month')
  })

  it('key worker filtered search', () => {
    const keyworkerSearchPage = navigateToSearchPage()
    keyworkerSearchPage.selectStatus('UNAVAILABLE_ANNUAL_LEAVE')
    keyworkerSearchPage.search()
    keyworkerSearchPage.searchRows().its('length').should('eq', 2)
    cy.task('verifyKeyworkerSearchCalled', {
      statusFilter: {
        equalTo: 'UNAVAILABLE_ANNUAL_LEAVE',
      },
    }).then((val) => {
      expect(JSON.parse(val.text).count).to.equal(1)
    })
  })

  it('Search for key worker renders error', () => {
    const keyworkerSearchPage = navigateToSearchPage()
    cy.task('stubKeyworkerSearchError', keyworkerSearchResponse)
    keyworkerSearchPage.search()
    keyworkerSearchPage.errorSummary().should('be.visible')
  })
})
