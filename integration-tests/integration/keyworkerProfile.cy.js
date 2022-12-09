const KeyworkerSearchPage = require('../pages/keyworkerSearchPage')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const KeyworkerEditProfilePage = require('../pages/keyworkerEditProfilePage')
const KeyworkerEditProfileConfirmPage = require('../pages/keyworkerEditProfileConfirmPage')
const Utils = require('../support/utils')

const caseNoteUsageResponse = [
  {
    caseNoteType: 'KA',
    caseNoteSubType: 'KS',
    offenderNo: 'Z0018ZZ',
    numCaseNotes: 4,
    latestCaseNote: '2018-06-15T11:40:00.000Z',
  },
  {
    caseNoteType: 'KA',
    caseNoteSubType: 'KE',
    offenderNo: 'Z0018ZZ',
    numCaseNotes: 2,
    latestCaseNote: '2018-06-16T11:40:00.000Z',
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
const keyworkerInactiveResponse = {
  staffId: -3,
  firstName: 'HPA',
  lastName: 'AUser',
  capacity: 6,
  numberAllocated: 0,
  scheduleType: 'Full Time',
  agencyId: 'LEI',
  agencyDescription: 'LEEDS',
  status: 'INACTIVE',
  autoAllocationAllowed: true,
  numKeyWorkerSessions: 2,
}
const keyworkerAllocationsResponse = [
  {
    bookingId: -18,
    offenderNo: 'Z0018ZZ',
    firstName: 'NICK',
    lastName: 'TALBOT',
    staffId: -3,
    agencyId: 'LEI',
    prisonId: 'LEI',
    assigned: '2018-04-09T14:34:35.616',
    allocationType: 'A',
    internalLocationDesc: 'H-1',
    deallocOnly: false,
  },
  {
    bookingId: -19,
    offenderNo: 'Z0018ZT',
    firstName: 'DAVID',
    lastName: 'BOWIE',
    staffId: -3,
    agencyId: 'LPI',
    prisonId: 'LPI',
    assigned: '2018-04-10T12:00:00.000',
    allocationType: 'M',
    internalLocationDesc: 'LPI-A-1',
    deallocOnly: true,
  },
]
const availableKeyworkersResponse = [
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
]

const navigateToEditPage = (keyworker) => {
  cy.visit('/key-worker-search')
  const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
  keyworkerSearchPage.searchAndClickKeyworker(keyworker.staffId)
  const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworker))
  keyworkerProfilePage.clickEditProfileButton()
  return KeyworkerEditProfilePage.verifyOnPage()
}

context('Profile test', () => {
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
    cy.task('stubKeyworkerSearch', keyworkerSearchResponse)
    cy.task('stubKeyworker', keyworkerResponse)
    cy.task('stubKeyworkerStats')
    cy.task('stubAvailableKeyworkers', availableKeyworkersResponse)
    cy.task('stubKeyworkerAllocations', keyworkerAllocationsResponse)
    cy.task('stubGetOffenders', [
      {
        prisonerNumber: 'Z0018ZZ',
        confirmedReleaseDate: '2022-04-29',
        releaseDate: '2022-04-30',
        csra: 'High',
      },
      {
        prisonerNumber: 'Z0018ZT',
        confirmedReleaseDate: '2030-05-29',
        releaseDate: '2030-05-30',
        csra: 'Standard',
      },
    ])
    cy.task('stubCaseNoteUsageList', caseNoteUsageResponse)
  })

  it('key worker profile is displayed correctly', () => {
    cy.visit('/key-worker-search')
    const keyworkerSearchPage = KeyworkerSearchPage.verifyOnPage()
    keyworkerSearchPage.searchAndClickKeyworker(keyworkerResponse.staffId)
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))

    // Page context
    keyworkerProfilePage.allocationCount().should('have.text', '2')
    keyworkerProfilePage
      .allocationSelectOptions(keyworkerAllocationsResponse[0].offenderNo)
      .its('length')
      .should('be.eq', 3)
    keyworkerProfilePage.verifyAllocationStyleGreen()

    // Page allocations table
    keyworkerProfilePage.getResultElement(1, 1).find('a').should('have.text', 'Talbot, Nick')
    keyworkerProfilePage.getResultElement(2, 1).should('have.text', 'Bowie, David')
    keyworkerProfilePage.getResultElement(1, 4).should('have.text', '30/04/2022')
    keyworkerProfilePage.getResultElement(1, 5).should('have.text', 'High')
    keyworkerProfilePage.getResultElement(1, 6).should('have.text', '16/06/2018')
    keyworkerProfilePage.getResultElement(1, 7).should('have.text', '4')
    keyworkerProfilePage.getResultElement(2, 4).should('have.text', '30/05/2030')
    keyworkerProfilePage.getResultElement(2, 5).should('have.text', 'Standard')
    keyworkerProfilePage.getResultElement(2, 1).find('a').should('not.exist')
  })

  it('key worker edit profile is displayed correctly', () => {
    const editKeyworkerProfilePage = navigateToEditPage(keyworkerResponse)
    editKeyworkerProfilePage.capacity().should('have.value', 6)
    editKeyworkerProfilePage.keyworkerStatusSelect().find('option').its('length').should('be.eq', 5)
    editKeyworkerProfilePage.parentPageLink().click()
    KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
  })

  it('key worker edit confirm - INACTIVE - is displayed correctly', () => {
    const editKeyworkerProfilePage = navigateToEditPage(keyworkerResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('INACTIVE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.status().should('have.text', 'Inactive')
    keyworkerEditProfileConfirmPage.inactiveWarning().should('exist')
    keyworkerEditProfileConfirmPage.parentPageLink().click()
    KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
  })

  it('key worker edit confirm - UNAVAILABLE_ANNUAL_LEAVE - is displayed correctly', () => {
    const editKeyworkerProfilePage = navigateToEditPage(keyworkerResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('UNAVAILABLE_ANNUAL_LEAVE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.status().should('have.text', 'Unavailable - annual leave')
    keyworkerEditProfileConfirmPage.annualLeaveDatePicker().should('be.visible')
  })

  it('key worker edit confirm - UNAVAILABLE_ANNUAL_LEAVE - return date is mandatory', () => {
    const editKeyworkerProfilePage = navigateToEditPage(keyworkerResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('UNAVAILABLE_ANNUAL_LEAVE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.allocationRadios().check('REMOVE_ALLOCATIONS_NO_AUTO')
    keyworkerEditProfileConfirmPage.save()
    keyworkerEditProfileConfirmPage.errorMessage().should('have.text', 'Please choose a return date')
  })

  it('key worker edit - saving active status', () => {
    cy.task('stubKeyworker', keyworkerInactiveResponse) // Stub a inactive user
    cy.task('stubKeyworkerUpdate')
    const editKeyworkerProfilePage = navigateToEditPage(keyworkerInactiveResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('ACTIVE')
    // We simulate user now being active do this before the save to avoid race conditions
    cy.task('stubKeyworker', keyworkerResponse)
    editKeyworkerProfilePage.save()
    cy.task('verifyKeyworkerUpdate', { status: 'ACTIVE', capacity: `${keyworkerResponse.capacity}` }).then((val) => {
      expect(JSON.parse(val.text).count).to.equal(1)
    })
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
    keyworkerProfilePage.status().should('have.text', 'Active')
    keyworkerProfilePage.messageBar().contains('Profile changed')
  })

  it('key worker edit - saved with no changes - does not display message bar', () => {
    const editKeyworkerProfilePage = navigateToEditPage(keyworkerResponse)
    editKeyworkerProfilePage.save()
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
    keyworkerProfilePage.status().should('have.text', 'Active')
    keyworkerProfilePage.messageBar().should('not.exist')
  })

  it('key worker edit confirm - no allocations - should not display Prisoners removed message', () => {
    cy.task('stubKeyworker', keyworkerInactiveResponse) // Stub a inactive user
    const editKeyworkerProfilePage = navigateToEditPage(keyworkerInactiveResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('UNAVAILABLE_LONG_TERM_ABSENCE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.allocationRadios().check('REMOVE_ALLOCATIONS_NO_AUTO')
    keyworkerEditProfileConfirmPage.save()
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
    keyworkerProfilePage.messageBar().contains('Profile changed')
  })

  it('key worker edit confirm - allocations exist - should display Prisoners removed message', () => {
    const editKeyworkerProfilePage = navigateToEditPage(keyworkerResponse)
    editKeyworkerProfilePage.keyworkerStatusSelect().select('UNAVAILABLE_LONG_TERM_ABSENCE')
    editKeyworkerProfilePage.save()
    const keyworkerEditProfileConfirmPage = KeyworkerEditProfileConfirmPage.verifyOnPage()
    keyworkerEditProfileConfirmPage.allocationRadios().check('REMOVE_ALLOCATIONS_NO_AUTO')
    keyworkerEditProfileConfirmPage.save()
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
    keyworkerProfilePage.messageBar().contains('Prisoners removed from key worker')
  })
})
