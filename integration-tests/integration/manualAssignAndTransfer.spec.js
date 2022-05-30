const Utils = require('../support/utils')
const OffenderSearchPage = require('../pages/offenderSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const HomePage = require('../pages/homePage')

const offenderSearchResponse = [
  {
    bookingId: -1,
    bookingNo: 'A00111',
    offenderNo: 'A1178RS',
    firstName: 'ARTHUR',
    middleName: 'BORIS',
    lastName: 'ANDERSON',
    dateOfBirth: '1969-12-30',
    age: 48,
    agencyId: 'LEI',
    assignedLivingUnitId: -3,
    assignedLivingUnitDesc: 'A-1-1',
    facialImageId: -1,
    iepLevel: 'Standard',
  },
  {
    bookingId: -29,
    bookingNo: 'Z00029',
    offenderNo: 'Z0024ZZ',
    firstName: 'NEIL',
    middleName: 'IAN',
    lastName: 'BRADLEY',
    dateOfBirth: '1945-01-10',
    age: 73,
    agencyId: 'LEI',
    assignedLivingUnitId: -14,
    assignedLivingUnitDesc: 'H-1',
    iepLevel: 'Entry',
  },
]
const availableKeyworkerResponse = [
  {
    staffId: -3,
    firstName: 'HPA',
    lastName: 'AUser',
    capacity: 6,
    numberAllocated: 4,
    agencyId: 'LEI',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
    numKeyWorkerSessions: 3,
  },
  {
    staffId: -4,
    firstName: 'Test',
    lastName: 'TUser',
    capacity: 6,
    numberAllocated: 5,
    agencyId: 'LEI',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
    numKeyWorkerSessions: 6,
  },
]

const keyworkersOfOffendersResponse = [
  {
    offenderKeyworkerId: -1001,
    offenderNo: 'A1178RS',
    staffId: -3,
    agencyId: 'LEI',
    assigned: '2018-08-05T10:45:54.838',
    userId: 'SRENDELL_GEN',
    active: 'Y',
  },
  {
    offenderKeyworkerId: -1002,
    offenderNo: 'A5577RS',
    staffId: -3,
    agencyId: 'LEI',
    assigned: '2018-08-07T10:47:07.845',
    userId: 'MWILLIS_GEN',
    active: 'Y',
  },
]

const keyworkerResponse = {
  staffId: -3,
  firstName: 'HPA',
  lastName: 'AUser',
  thumbnailId: 1,
  capacity: 6,
  numberAllocated: 4,
  scheduleType: 'Full Time',
  agencyId: 'LEI',
  agencyDescription: 'Moorland (HMP & YOI)',
  status: 'ACTIVE',
  autoAllocationAllowed: true,
}

context('manual assign and transfer test', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubAvailableKeyworkers', availableKeyworkerResponse)
    cy.task('stubSearchOffenders', { reponse: offenderSearchResponse })
    cy.task('stubOffenderKeyworker', keyworkersOfOffendersResponse)
    cy.task('stubOffenderSentences')
    cy.task('stubOffenderAssessments')
    cy.task('stubKeyworker', keyworkerResponse)
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
    offenderSearchPage.housingLocations().eq(0).should('have.text', 'Moorland (HMP & YOI)')
  })

  it('Assign and Transfer full results', () => {
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.search()
    offenderSearchPage.resultRows().its('length').should('eq', 2)
    offenderSearchPage.keyworkerLink(keyworkersOfOffendersResponse[0].staffId).click()
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
    keyworkerProfilePage.parentPageLink().click()
    HomePage.verifyOnPage()
  })

  it('Assign and Transfer filtered by unallocated', () => {
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.allocationStatusSelect().select('Unallocated')
    offenderSearchPage.search()
    offenderSearchPage.resultRows().its('length').should('eq', 1)
  })

  it('Assign and Transfer filtered by allocated', () => {
    cy.visit('/offender-search')
    const offenderSearchPage = OffenderSearchPage.verifyOnPage()
    offenderSearchPage.verifyPageReady()
    offenderSearchPage.allocationStatusSelect().select('Allocated')
    offenderSearchPage.search()
    offenderSearchPage.resultRows().its('length').should('eq', 1)
  })

  it('Search for offender returns no results', () => {
    cy.task('stubSearchOffenders')
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

    cy.task('stubSearchOffenders', { response: offenderSearchResponse })
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
      .assignNewKeyworkeSelect(offenderSearchResponse[0].offenderNo)
      .select(`${availableKeyworkerResponse[1].staffId}`)
    offenderSearchPage.saveButton().click()
    offenderSearchPage.messageBar().contains('Key workers successfully updated.')
  })
})
