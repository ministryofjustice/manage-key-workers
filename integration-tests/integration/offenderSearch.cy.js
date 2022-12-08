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

const offenderResponseContent = [
  {
    prisonerNumber: 'G0276VC',
    firstName: 'FERINAND',
    middleName: 'ANTHOINE',
    lastName: 'ALFF',
    prisonId: 'MDI',
    cellLocation: 'CSWAP',
  },
  {
    prisonerNumber: 'G12345',
    firstName: 'DANNY',
    middleName: '',
    lastName: 'Deets',
    prisonId: 'MDI',
    cellLocation: 'MDI',
  },
  {
    prisonerNumber: 'G12346',
    firstName: 'Ash',
    middleName: '',
    lastName: 'Blusher',
    prisonId: 'MDI',
    cellLocation: 'MDI',
  },
]

const offenderResponse = {
  content: offenderResponseContent,
  totalElements: 3,
  number: 0,
  size: 10,
}

const toOffender = ($cell) => ({
  name: $cell[0]?.textContent,
  prisonNo: $cell[1]?.textContent,
  location: $cell[2]?.textContent,
  releaseDate: $cell[3]?.textContent,
  keyworker: $cell[4]?.textContent,
  changeKeyworker: $cell[5],
  viewHistory: $cell[6],
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
    cy.task('stubAvailableKeyworkers', keyworkerResponse)
    cy.task('stubOffenderKeyworker', [
      {
        offenderKeyworkerId: 1,
        offenderNo: 'G12345',
        staffId: 34353,
        agencyId: 'MDI',
        assigned: '2018-08-05T10:45:54.838',
        userId: 'JULIAN',
        active: 'Y',
      },
    ])
    cy.task('stubAllocationHistorySummary', [
      {
        offenderNo: 'G12345',
        hasHistory: false,
      },
      {
        offenderNo: 'G12346',
        hasHistory: false,
      },
      {
        offenderNo: 'G0276VC',
        hasHistory: true,
      },
    ])
    cy.task('stubOffenderSentences')
    cy.task('stubOffenderAssessments')
    cy.task('stubGetComplexOffenders', [{ offenderNo: 'G12346', level: 'high' }])
    cy.task('stubOffenderSentences', [
      { offenderNo: 'G12346', mostRecentActiveBooking: true, sentenceDetail: { releaseDate: '2022-04-30' } },
    ])
    cy.task('stubClientCredentialsRequest')
  })

  context('Page functionality', () => {
    it('should not show table or warning message on first load', () => {
      cy.visit('/manage-key-workers/search-for-prisoner')
      verifyOnPage()

      cy.get('#no-offenders-returned-message').should('not.exist')
      cy.get('[data-qa="offender-results-table"]').should('not.exist')
    })

    it('should show default message for no offenders found', () => {
      cy.task('stubSearchOffenders', { response: { totalElements: 0, content: [] }, term: 'hello' })

      cy.visit('/manage-key-workers/search-for-prisoner?searchText=hello')
      verifyOnPage()

      cy.get('#no-offenders-returned-message').contains(
        'There are no results for the name or number you have entered. You can search again.'
      )
    })

    it('should make a request to allocate', () => {
      cy.task('stubAllocate')
      cy.task('stubGetComplexOffenders')
      cy.task('stubSearchOffenders', { response: offenderResponse, term: 'smith' })

      cy.visit('/manage-key-workers/search-for-prisoner?searchText=smith')

      verifyOnPage()

      cy.get('[data-test="allocate-keyworker-select"]').first().select('34353:G0276VC')

      cy.get('#submit-changes').click()

      cy.task('verifyAllocateWasCalled').then((val) => {
        expect(JSON.parse(val.text).count).to.equal(1)
      })
    })

    it('should make a request to deallocate', () => {
      cy.task('stubDeallocate', 'G12345')
      cy.task('stubGetComplexOffenders')
      cy.task('stubSearchOffenders', { response: offenderResponse, term: 'smith' })

      cy.visit('/manage-key-workers/search-for-prisoner?searchText=smith')

      verifyOnPage()

      cy.get('[data-test="allocate-keyworker-select"]').eq(1).select('34353:G12345:true')

      cy.get('#submit-changes').click()

      verifyOnPage()

      cy.task('verifyDeallocateWasCalled', 'G12345').then((val) => {
        expect(JSON.parse(val.text).count).to.equal(1)
      })
    })
  })

  context('Results table', () => {
    it('no key worker allocated', () => {
      cy.visit('/manage-key-workers/search-for-prisoner')
      cy.task('stubSearchOffenders', { response: offenderResponse, term: 'SMITH' })

      verifyOnPage()

      cy.get('#search-text').type('SMITH')
      cy.get('#submit-search').click()

      verifyOnPage()

      cy.get('.results-table')
        .find('tbody')
        .find('tr')
        .then(($tableRows) => {
          cy.get($tableRows).its('length').should('eq', 3)

          const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

          // No key worker
          expect(offenders[0].name).to.eq('Alff, Ferinand')
          expect(offenders[0].location).to.eq('CSWAP')
          expect(offenders[0].prisonNo).to.eq('G0276VC')
          expect(offenders[0].releaseDate.trim()).to.eq('Not entered')
          expect(offenders[0].keyworker.trim()).to.eq('Not allocated')
          cy.get(offenders[0].changeKeyworker)
            .find('[data-test="allocate-keyworker-select"]')
            .then(($select) => {
              cy.get($select)
                .find('option')
                .then(($options) => {
                  expect($options.get(0)).to.contain('Select key worker')
                  expect($options.get(1)).to.contain('6 - Ball, Bob')
                  expect($options.get(2)).to.contain('9 - Doe, Julian')
                })
            })
          cy.get(offenders[0].viewHistory)
            .find('a')
            .contains('View history')
            .should('have.attr', 'href')
            .should('include', '/offender-history/G0276VC')

          // With key worker
          expect(offenders[1].name).to.eq('Deets, Danny')
          expect(offenders[1].location).to.eq('MDI')
          expect(offenders[1].prisonNo).to.eq('G12345')
          expect(offenders[1].releaseDate.trim()).to.eq('Not entered')
          expect(offenders[1].keyworker.trim()).to.eq('Bob Ball (6)')
          cy.get(offenders[1].changeKeyworker)
            .find('[data-test="allocate-keyworker-select"]')
            .then(($select) => {
              cy.get($select)
                .find('option')
                .then(($options) => {
                  expect($options.get(0)).to.contain('Select key worker')
                  expect($options.get(1)).to.contain('Deallocate')
                  expect($options.get(2)).to.contain('9 - Doe, Julian')
                })
            })

          cy.get(offenders[1].viewHistory).find('a').should('not.exist')

          // Complex offender
          expect(offenders[2].name).to.eq('Blusher, Ash')
          expect(offenders[2].location).to.eq('MDI')
          expect(offenders[2].prisonNo).to.eq('G12346')
          expect(offenders[2].releaseDate).to.eq('30/04/2022')
          expect(offenders[2].keyworker).to.eq('None')
          expect(offenders[2].changeKeyworker.textContent).to.eq('N/A - high complexity of need')
        })
    })
  })
})
