const OffenderSearchPage = require('../pages/offenderSearchPage')
const OffenderSearchResponse = require('../responses/offenderSearchResponse').offenderSearchReponse
const AvailableKeyworkerResponse = require('../responses/availableKeyworkersResponse')
const KeyworkersOfOffendersResponse = require('../responses/offenderSearchResponse').keyworkersOfOffendersResponse
const KeyworkerResponse = require('../responses/keyworkerResponse').keyworkerResponse
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const HomePage = require('../pages/homePage')
const Utils = require('../support/utils')

const userLocationResponse = [
  {
    locationId: 1,
    locationType: 'INST',
    description: 'Moorland (HMP & YOI)',
    agencyId: 'MDI',
    locationPrefix: 'MDI',
  },
]

context('Keyworker stats tests', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubAvailableKeyworkers', AvailableKeyworkerResponse)
    cy.task('stubSearchOffenders', OffenderSearchResponse)
    cy.task('stubOffenderKeyworker', KeyworkersOfOffendersResponse)
    cy.task('stubOffenderSentences')
    cy.task('stubOffenderAssessments')
    cy.task('stubKeyworker', KeyworkerResponse)
    cy.task('stubKeyworkerAllocations')
    cy.task('stubCaseNoteUsageList')
    cy.task('stubKeyworkerStats')

    cy.task('stubLogin', {
      username: 'ITAG_USER',
      caseload: 'MDI',
      roles: [{ roleCode: 'OMIC_ADMIN' }],
      migrationStatus: { migrated: true },
    })
    cy.login()
  })

  it('Assign and Transfer home', () => {
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.housingLocations().eq(0).should('have.text', userLocationResponse[0].description)
  })

  it('Assign and Transfer full results', () => {
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.search()
    offenderSearchPage.resultRows().its('length').should('eq', 5)
    offenderSearchPage.keyworkerLink(KeyworkersOfOffendersResponse[0].staffId).click()
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
    keyworkerProfilePage.parentPageLink().click()
    HomePage.verifyOnPage()
  })

  it('Assign and Transfer filtered by unallocated', () => {
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.allocationStatusSelect().select('Unallocated')
    offenderSearchPage.search()
    offenderSearchPage.resultRows().its('length').should('eq', 3)
  })

  it('Assign and Transfer filtered by allocated', () => {
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.allocationStatusSelect().select('Allocated')
    offenderSearchPage.search()
    offenderSearchPage.resultRows().its('length').should('eq', 2)
  })

  it('Search for offender returns no results', () => {
    cy.task('stubSearchOffenders', [])
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.search()
    offenderSearchPage.resultRows().should('not.exist')
  })

  it('refreshing on offender result (or typing /offender-search/results in url) - should redirect to offender search', () => {
    cy.visit('/offender-search/results')
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/offender-search')
    })
  })

  it('error returned from api call is rendered', () => {
    cy.task('stubSearchOffendersError')
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.search()
    offenderSearchPage.errorSummary().should('be.visible')
  })

  it('error is not left on screen if hitting search again with successful result', () => {
    cy.task('stubSearchOffendersError')
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.search()
    offenderSearchPage.errorSummary().should('be.visible')

    cy.task('stubSearchOffenders', OffenderSearchResponse)
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.search()
    offenderSearchPage.errorSummary().should('not.exist')
  })

  it('manual override - should stay on results page and display message bar', () => {
    cy.task('stubAllocate')
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.search()
    offenderSearchPage
      .assignNewKeyworkeSelect(OffenderSearchResponse[0].offenderNo)
      .select(`${AvailableKeyworkerResponse[1].staffId}`)
    offenderSearchPage.saveButton().click()
    offenderSearchPage.messageBar().should('have.text', 'Key workers successfully updated.')
  })
})
