const toOffender = ($cell) => ({
  name: $cell[0]?.textContent,
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
      { offenderNo: 'ABC123', sentenceDetail: { releaseDate: '2022-04-30' } },
      { offenderNo: 'ABC456', sentenceDetail: { releaseDate: '2030-05-30' } },
      { offenderNo: 'ABC789', sentenceDetail: { releaseDate: '2029-02-28' } },
    ])
    cy.task('stubOffenderAssessments')
    cy.task('stubGetComplexOffenders', [{ offenderNo: 'ABC123', level: 'high' }])
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

  context.only('when there are results', () => {
    beforeEach(() => {
      cy.task('stubSearchOffenders', [
        {
          offenderNo: 'ABC123',
          firstName: 'FERINAND',
          lastName: 'ALFF',
          dateOfBirth: '1982-04-06',
          agencyId: 'MDI',
          assignedLivingUnitId: 11,
          assignedLivingUnitDesc: 'MDI-1-1',
        },
        {
          offenderNo: 'ABC456',
          firstName: 'JOHN',
          lastName: 'SMITH',
          dateOfBirth: '1986-03-01',
          agencyId: 'MDI',
          assignedLivingUnitId: 12,
          assignedLivingUnitDesc: 'MDI-1-2',
        },
        {
          offenderNo: 'ABC789',
          firstName: 'SIMON',
          lastName: 'GRAY',
          dateOfBirth: '1980-04-03',
          agencyId: 'MDI',
          assignedLivingUnitId: 13,
          assignedLivingUnitDesc: 'MDI-1-3',
        },
      ])
      cy.task('stubAllocationHistory', {
        offenderNo: 'ABC123',
        response: { offender: { offenderNo: 'ABC123' }, allocationHistory: [] },
      })
      cy.task('stubAllocationHistory', {
        offenderNo: 'ABC456',
        response: {
          offender: { offenderNo: 'ABC456' },
          allocationHistory: [{ staffId: 2 }],
        },
      })
      cy.task('stubAllocationHistory', {
        offenderNo: 'ABC789',
        response: { offender: { offenderNo: 'ABC789' }, allocationHistory: [] },
      })
    })

    it('should display the correct results', () => {
      cy.visit('/manage-key-workers/view-residential-location')

      cy.get('[data-test="location-select"]').select('MDI-1')
      cy.get('[data-test="view-location-button"]').click()

      cy.get('[data-test="prisoner-count"]').should('contain', '3')
      cy.get('[data-test="location-results-table"]')
        .find('tbody')
        .find('tr')
        .then(($tableRows) => {
          cy.get($tableRows).its('length').should('eq', 3)

          const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

          // High complexity offender
          expect(offenders[0].name).to.eq('Alff, Ferinand')
          expect(offenders[0].prisonNo).to.eq('ABC123')
          expect(offenders[0].location).to.eq('MDI-1-1')
          expect(offenders[0].releaseDate.trim()).to.eq('30/04/2022')
          expect(offenders[0].keyworker.trim()).to.eq('None')
          expect(offenders[0].changeKeyworker.textContent.trim()).to.eq('N/A - high complexity')
          cy.get(offenders[0].viewHistory).find('a').should('not.exist')

          // Offender with keyworker
          expect(offenders[1].name).to.eq('Smith, John')
          expect(offenders[1].prisonNo).to.eq('ABC456')
          expect(offenders[1].location).to.eq('MDI-1-2')
          expect(offenders[1].releaseDate.trim()).to.eq('30/05/2030')
          expect(offenders[1].keyworker.trim()).to.eq('Julian Doe (9)')
          cy.get(offenders[1].changeKeyworker)
            .find('[data-test="allocate-keyworker-select"]')
            .then(($select) => {
              cy.get($select)
                .find('option')
                .then(($options) => {
                  expect($options.get(0)).to.contain('Select key worker')
                  expect($options.get(1)).to.contain('Deallocate')
                  expect($options.get(2)).to.contain('Bob Ball (6)')
                })
            })
          cy.get(offenders[1].viewHistory)
            .find('a')
            .contains('View history')
            .should('have.attr', 'href')
            .should('include', '/offender-history/ABC456')

          // Offender without keyworker
          expect(offenders[2].name).to.eq('Gray, Simon')
          expect(offenders[2].prisonNo).to.eq('ABC789')
          expect(offenders[2].location).to.eq('MDI-1-3')
          expect(offenders[2].releaseDate.trim()).to.eq('28/02/2029')
          expect(offenders[2].keyworker.trim()).to.eq('Not allocated')
          cy.get(offenders[2].changeKeyworker)
            .find('[data-test="allocate-keyworker-select"]')
            .then(($select) => {
              cy.get($select)
                .find('option')
                .then(($options) => {
                  expect($options.get(0)).to.contain('Select key worker')
                  expect($options.get(1)).to.contain('Bob Ball (6)')
                  expect($options.get(2)).to.contain('Julian Doe (9)')
                })
            })
          cy.get(offenders[2].viewHistory).find('a').should('not.exist')
        })
    })
  })

  context('when there are no results', () => {
    beforeEach(() => {
      cy.task('stubSearchOffenders', [])
    })

    it('should load the correct no results message', () => {
      cy.visit('/manage-key-workers/view-residential-location?residentialLocation=MDI-2 ')

      cy.get('[data-test="no-results-message"]').should('contain', 'There are no prisoners in this location')
    })
  })
})
