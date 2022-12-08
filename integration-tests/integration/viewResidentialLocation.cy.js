const toOffender = ($cell) => ({
  name: $cell[0],
  prisonNo: $cell[1]?.textContent,
  location: $cell[2]?.textContent,
  releaseDate: $cell[3]?.textContent,
  keyworker: $cell[4]?.textContent,
  changeKeyworker: $cell[5],
  viewHistory: $cell[6],
})

context('View residential location', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubLogin', { username: 'ITAG_USER', caseload: 'WWI' })
    cy.login()
  })

  beforeEach(() => {
    Cypress.Cookies.preserveOnce('hmpps-session-dev')

    cy.task('stubAvailableKeyworkers', [
      {
        staffId: 1,
        firstName: 'BOB',
        lastName: 'BALL',
        capacity: 6,
        numberAllocated: 6,
        agencyId: 'MDI',
        status: 'ACTIVE',
        autoAllocationAllowed: true,
      },
      {
        staffId: 2,
        firstName: 'JULIAN',
        lastName: 'DOE',
        capacity: 6,
        numberAllocated: 9,
        agencyId: 'MDI',
        status: 'ACTIVE',
        autoAllocationAllowed: true,
      },
    ])
    cy.task('stubOffenderKeyworker', [
      {
        offenderKeyworkerId: 1,
        offenderNo: 'ABC456',
        staffId: 2,
        agencyId: 'MDI',
        assigned: '2018-08-05T10:45:54.838',
        userId: 'JULIAN',
        active: 'Y',
      },
    ])
    cy.task('stubOffenderSentences', [
      { offenderNo: 'ABC123', mostRecentActiveBooking: true, sentenceDetail: { releaseDate: '2022-04-30' } },
      { offenderNo: 'ABC456', mostRecentActiveBooking: true, sentenceDetail: { releaseDate: '2030-05-30' } },
      { offenderNo: 'ABC789', mostRecentActiveBooking: true, sentenceDetail: { releaseDate: '2029-02-28' } },
    ])
    cy.task('stubOffenderAssessments')
    cy.task('stubGetComplexOffenders', [{ offenderNo: 'ABC123', level: 'high' }])
    cy.task('stubClientCredentialsRequest')
  })

  it('should load correctly', () => {
    cy.visit('/manage-key-workers/view-residential-location')

    cy.get('h1').contains('All prisoners in a residential location')
    cy.get('[data-test="location-select"]')
      .find('option')
      .then(($options) => {
        expect($options.get(0)).to.contain('Select')
        expect($options.get(1)).to.contain('Houseblock 1')
        expect($options.get(2)).to.contain('Houseblock 2')
      })
    cy.get('[data-test="view-location-button"]').contains('View')
    cy.get('[data-test="return-link"]')
      .contains('Return to manage key workers')
      .should('have.attr', 'href')
      .should('include', '/manage-key-workers')
  })

  context('when there are results on page 1', () => {
    beforeEach(() => {
      const offenders = {
        content: Array.from({ length: 50 }, (_, i) => 1 + i).map((_) => ({
          prisonerNumber: 'ABC123',
          firstName: 'FERINAND',
          lastName: 'ALFF',
          dateOfBirth: '1982-04-06',
          prisonId: 'MDI',
          cellLocation: 'MDI-1-1',
        })),
        totalElements: 149,
        number: 0,
        size: 50,
      }

      cy.task('stubSearchOffendersPaginated', {
        response: offenders,
        locationPrefix: 'MDI-1',
        page: '0',
        pageSize: '50',
      })

      cy.task('stubAllocationHistorySummary', [
        {
          offenderNo: 'ABC123',
          hasHistory: false,
        },
        {
          offenderNo: 'ABC456',
          hasHistory: true,
        },
        {
          offenderNo: 'ABC789',
          hasHistory: false,
        },
      ])
    })

    it('should display the correct results', () => {
      cy.visit('/manage-key-workers/view-residential-location')

      cy.get('[data-test="location-select"]').select('MDI-1')
      cy.get('[data-test="view-location-button"]').click()

      cy.get('.moj-pagination').first().get('.moj-pagination__link').contains('Next').should('exist')
      cy.get('.moj-pagination').first().get('.moj-pagination__link').contains('Previous').should('not.exist')

      cy.get('[data-test="prisoner-count"]').should('contain', '50')
      cy.get('[data-test="location-results-table"]')
        .find('tbody')
        .find('tr')
        .then(($tableRows) => {
          cy.get($tableRows).its('length').should('eq', 50)

          const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

          // High complexity offender
          cy.get(offenders[0].name)
            .find('a')
            .contains('Alff, Ferinand')
            .should('have.attr', 'href')
            .should('include', '/prisoner/ABC123')
          expect(offenders[0].prisonNo).to.eq('ABC123')
          expect(offenders[0].location).to.eq('MDI-1-1')
          expect(offenders[0].releaseDate.trim()).to.eq('30/04/2022')
          expect(offenders[0].keyworker.trim()).to.eq('None')
          expect(offenders[0].changeKeyworker.textContent.trim()).to.eq('N/A - high complexity of need')
          cy.get(offenders[0].viewHistory).find('a').should('not.exist')
        })
    })
  })

  context('when there are results on page 2', () => {
    beforeEach(() => {
      const offenders = {
        content: Array.from({ length: 50 }, (_, i) => 1 + i).map((_) => ({
          prisonerNumber: 'ABC456',
          firstName: 'JOHN',
          lastName: 'SMITH',
          dateOfBirth: '1986-03-01',
          prisonId: 'MDI',
          cellLocation: 'MDI-1-2',
        })),
        totalElements: 149,
        number: 1,
        size: 50,
      }

      cy.task('stubSearchOffendersPaginated', {
        response: offenders,
        locationPrefix: 'MDI-1',
        page: '0',
        pageSize: '50',
      })

      cy.task('stubAllocationHistorySummary', [
        {
          offenderNo: 'ABC123',
          hasHistory: false,
        },
        {
          offenderNo: 'ABC456',
          hasHistory: true,
        },
        {
          offenderNo: 'ABC789',
          hasHistory: false,
        },
      ])
    })

    it('should display the correct results', () => {
      cy.visit('/manage-key-workers/view-residential-location')

      cy.get('[data-test="location-select"]').select('MDI-1')
      cy.get('[data-test="view-location-button"]').click()

      cy.get('.moj-pagination').first().get('.moj-pagination__link').contains('Next').should('exist')
      cy.get('.moj-pagination').first().get('.moj-pagination__link').contains('Previous').should('exist')

      cy.get('[data-test="prisoner-count"]').should('contain', '50')
      cy.get('[data-test="location-results-table"]')
        .find('tbody')
        .find('tr')
        .then(($tableRows) => {
          cy.get($tableRows).its('length').should('eq', 50)

          const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

          cy.get(offenders[0].name)
            .find('a')
            .contains('Smith, John')
            .should('have.attr', 'href')
            .should('include', '/prisoner/ABC456')
          expect(offenders[0].prisonNo).to.eq('ABC456')
          expect(offenders[0].location).to.eq('MDI-1-2')
          expect(offenders[0].releaseDate.trim()).to.eq('30/05/2030')
          expect(offenders[0].keyworker.trim()).to.eq('Julian Doe (9)')
          cy.get(offenders[0].changeKeyworker)
            .find('[data-test="allocate-keyworker-select"]')
            .then(($select) => {
              cy.get($select)
                .find('option')
                .then(($options) => {
                  expect($options.get(0)).to.contain('Select key worker')
                  expect($options.get(1)).to.contain('Deallocate')
                  expect($options.get(2)).to.contain('6 - Ball, Bob')
                })
            })
          cy.get(offenders[1].viewHistory)
            .find('a')
            .contains('View history')
            .should('have.attr', 'href')
            .should('include', '/offender-history/ABC456')
        })
    })
  })

  context('when there are results on page 3', () => {
    beforeEach(() => {
      const offenders = {
        content: Array.from({ length: 49 }, (_, i) => 1 + i).map((_) => ({
          prisonerNumber: 'ABC789',
          firstName: 'SIMON',
          lastName: 'GRAY',
          dateOfBirth: '1980-04-03',
          prisonId: 'MDI',
          cellLocation: 'MDI-1-3',
        })),
        totalElements: 149,
        number: 2,
        size: 50,
      }

      cy.task('stubSearchOffendersPaginated', {
        response: offenders,
        locationPrefix: 'MDI-1',
        page: '0',
        pageSize: '50',
      })

      cy.task('stubAllocationHistorySummary', [
        {
          offenderNo: 'ABC123',
          hasHistory: false,
        },
        {
          offenderNo: 'ABC456',
          hasHistory: true,
        },
        {
          offenderNo: 'ABC789',
          hasHistory: false,
        },
      ])
    })

    it('should display the correct results', () => {
      cy.visit('/manage-key-workers/view-residential-location')

      cy.get('[data-test="location-select"]').select('MDI-1')
      cy.get('[data-test="view-location-button"]').click()

      cy.get('.moj-pagination').first().get('.moj-pagination__link').contains('Next').should('not.exist')
      cy.get('.moj-pagination').first().get('.moj-pagination__link').contains('Previous').should('exist')

      cy.get('[data-test="prisoner-count"]').should('contain', '49')
      cy.get('[data-test="location-results-table"]')
        .find('tbody')
        .find('tr')
        .then(($tableRows) => {
          cy.get($tableRows).its('length').should('eq', 49)

          const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

          // Offender without keyworker
          cy.get(offenders[0].name)
            .find('a')
            .contains('Gray, Simon')
            .should('have.attr', 'href')
            .should('include', '/prisoner/ABC789')
          expect(offenders[0].prisonNo).to.eq('ABC789')
          expect(offenders[0].location).to.eq('MDI-1-3')
          expect(offenders[0].releaseDate.trim()).to.eq('28/02/2029')
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
          cy.get(offenders[0].viewHistory).find('a').should('not.exist')
        })
    })
  })

  context('when there are no results', () => {
    beforeEach(() => {
      cy.task('stubSearchOffendersPaginated', {
        response: { content: [], totalElements: 0, number: 0, size: 10 },
        locationPrefix: 'MDI-2',
        page: '0',
        pageSize: '50',
      })
    })

    it('should load the correct no results message', () => {
      cy.visit('/manage-key-workers/view-residential-location?residentialLocation=MDI-2 ')

      cy.get('[data-test="no-results-message"]').should('contain', 'There are no prisoners in this location')
    })
  })
})
