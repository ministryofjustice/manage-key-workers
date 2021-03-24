const verifyOnPage = () => cy.get('h1').contains('Search for a prisoner')

const keyworkerResponse = [
  {
    staffId: 34353,
    firstName: 'BOB',
    lastName: 'BALL',
    capacity: 6,
    numberAllocated: 6,
    agencyId: 'MDI',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
  },
  {
    staffId: 485593,
    firstName: 'JULIAN',
    lastName: 'DOE',
    capacity: 6,
    numberAllocated: 9,
    agencyId: 'MDI',
    status: 'ACTIVE',
    autoAllocationAllowed: true,
  },
]

const offenderResponse = [
  {
    bookingId: 1146219,
    bookingNo: 'W97053',
    offenderNo: 'G0276VC',
    firstName: 'FERINAND',
    middleName: 'ANTHOINE',
    lastName: 'ALFF',
    dateOfBirth: '1982-04-06',
    age: 38,
    agencyId: 'MDI',
    assignedLivingUnitId: 722023,
    assignedLivingUnitDesc: 'CSWAP',
    facialImageId: 3759710,
    convictedStatus: 'Convicted',
    imprisonmentStatus: 'ADIMP_ORA',
    alertsCodes: [],
    alertsDetails: [],
    legalStatus: 'SENTENCED',
    staffId: null,
    keyworkerDisplay: '--',
    numberAllocated: 'n/a',
    crsaClassification: 'High',
    confirmedReleaseDate: '2012-04-30',
  },
]

const toOffender = ($cell) => ({
  name: $cell[0]?.textContent,
  prisonNo: $cell[1]?.textContent,
  location: $cell[2]?.textContent,
  releaseDate: $cell[3]?.textContent,
  keyworker: $cell[4]?.textContent,
  changeKeyworker: $cell[5]?.textContent,
})

context('Offender search', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubLogin', { username: 'ITAG_USER', caseload: 'WWI' })
    cy.login()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')
    cy.task('stubSearchOffenders', offenderResponse)
    cy.task('stubAvailableKeyworkers', keyworkerResponse)
    cy.task('stubOffenderKeyworker')
    cy.task('stubOffenderSentences')
    cy.task('stubOffenderAssessments')
  })

  it('should not show table or warning message on firs load', () => {
    cy.task('stubAvailableKeyworkers')
    cy.task('stubSearchOffenders')

    cy.visit('/manage-key-workers/search-for-prisoner')
    verifyOnPage()

    cy.get('#no-offenders-returned-message').should('not.exist')
    cy.get('[data-qa="offender-results-table"]').should('not.exist')
  })

  it('should show default message for no offenders found', () => {
    cy.task('stubAvailableKeyworkers')
    cy.task('stubSearchOffenders')

    cy.visit('/manage-key-workers/search-for-prisoner?searchText=hello')
    verifyOnPage()

    cy.get('#no-offenders-returned-message').contains(
      'There are no results for the name or number you have entered. You can search again.'
    )
  })

  it('should present offenders correctly', () => {
    cy.task('stubGetComplexOffenders')

    cy.visit('/manage-key-workers/search-for-prisoner')

    verifyOnPage()

    cy.get('#search-text').type('SMITH')
    cy.get('#submit-search').click()

    verifyOnPage()

    cy.get('[data-qa="offender-results-table"]')
      .find('tbody')
      .find('tr')
      .then(($tableRows) => {
        cy.get($tableRows).its('length').should('eq', 1)

        const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

        expect(offenders[0].name).to.eq('Alff, Ferinand')
        expect(offenders[0].location).to.eq('CSWAP')
        expect(offenders[0].prisonNo).to.eq('G0276VC')
        expect(offenders[0].releaseDate.trim()).to.eq('Not entered')
        expect(offenders[0].keyworker.trim()).to.eq('Not allocated')
      })
  })

  it('should label offenders with high complexity of need', () => {
    cy.task('stubGetComplexOffenders', [{ offenderNo: 'G0276VC', level: 'high' }])

    cy.visit('/manage-key-workers/search-for-prisoner')

    verifyOnPage()

    cy.get('#search-text').type('SMITH')
    cy.get('#submit-search').click()

    verifyOnPage()

    cy.get('[data-qa="offender-results-table"]')
      .find('tbody')
      .find('tr')
      .then(($tableRows) => {
        cy.get($tableRows).its('length').should('eq', 1)

        const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

        expect(offenders[0].name).to.eq('Alff, Ferinand')
        expect(offenders[0].location).to.eq('CSWAP')
        expect(offenders[0].prisonNo).to.eq('G0276VC')
        expect(offenders[0].releaseDate).to.eq('Not entered')
        expect(offenders[0].keyworker.trim()).to.eq('None')
        expect(offenders[0].changeKeyworker.trim()).to.eq('N/A - high complexity')
      })
  })
})
