const toOffender = ($cell) => ({
  name: $cell[0],
  prisonNo: $cell[1]?.textContent,
  location: $cell[2]?.textContent,
  releaseDate: $cell[3]?.textContent,
  keyworker: $cell[4]?.textContent,
  changeKeyworker: $cell[5],
  viewHistory: $cell[6],
})

context('Allocate key worker to unallocated prisoners', () => {
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
    cy.task('stubOffenderSentences')
    cy.task('stubOffenderAssessments')
    cy.task('stubUnallocated', { agencyId: 'MDI' })
  })

  it('should load correctly', () => {
    cy.visit('/manage-key-workers/allocate-key-worker')

    cy.get('h1').contains('Allocate a key worker')
    cy.get('[data-test="no-results-message"]').contains('All prisoners have a key worker allocated.')
    cy.get('[data-test="return-link"]')
      .contains('Return to manage key workers')
      .should('have.attr', 'href')
      .should('include', '/manage-key-workers')
  })

  context('with results', () => {
    beforeEach(() => {
      cy.task('stubUnallocated', {
        agencyId: 'MDI',
        response: [
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
        ],
      })

      cy.task('stubOffenderSentences', [
        {
          offenderNo: 'ABC123',
          firstName: 'FERINAND',
          lastName: 'ALFF',
          sentenceDetail: { confirmedReleaseDate: '2022-04-30', releaseDate: '2022-04-30' },
          internalLocationDesc: 'MDI-1-1',
        },
        {
          offenderNo: 'ABC456',
          firstName: 'JOHN',
          lastName: 'SMITH',
          sentenceDetail: { confirmedReleaseDate: '2030-05-30', releaseDate: '2030-05-30' },
          internalLocationDesc: 'MDI-1-2',
        },
      ])

      cy.task('stubAllocationHistory', {
        offenderNo: 'ABC456',
        response: {
          offender: { offenderNo: 'ABC456' },
          allocationHistory: [{ staffId: 2 }],
        },
      })

      cy.task('stubAllocate')
    })

    it('should load correctly', () => {
      cy.visit('/manage-key-workers/allocate-key-worker')

      cy.get('h1').contains('Allocate a key worker')
      cy.get('[data-test="no-results-message"]').should('not.exist')

      cy.get('[data-test="prisoner-count"]').should('contain', '2')
      cy.get('[data-test="results-table"]')
        .find('tbody')
        .find('tr')
        .then(($tableRows) => {
          cy.get($tableRows).its('length').should('eq', 2)

          const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

          cy.get(offenders[0].name)
            .find('a')
            .contains('Alff, Ferinand')
            .should('have.attr', 'href')
            .should('include', 'http://localhost:3002/prisoner/ABC123')
          expect(offenders[0].prisonNo).to.eq('ABC123')
          expect(offenders[0].location).to.eq('MDI-1-1')
          expect(offenders[0].releaseDate.trim()).to.eq('30/04/2022')
          expect(offenders[0].keyworker.trim()).to.eq('Not allocated')
          cy.get(offenders[0].changeKeyworker)
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
          cy.get(offenders[0].viewHistory).find('a').should('not.exist')

          cy.get(offenders[1].name)
            .find('a')
            .contains('Smith, John')
            .should('have.attr', 'href')
            .should('include', 'http://localhost:3002/prisoner/ABC456')
          expect(offenders[1].prisonNo).to.eq('ABC456')
          expect(offenders[1].location).to.eq('MDI-1-2')
          expect(offenders[1].releaseDate.trim()).to.eq('30/05/2030')
          expect(offenders[1].keyworker.trim()).to.eq('Not allocated')
          cy.get(offenders[1].changeKeyworker)
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
          cy.get(offenders[1].viewHistory)
            .find('a')
            .contains('View history')
            .should('have.attr', 'href')
            .should('include', '/offender-history/ABC456')
        })

      cy.get('[data-test="return-link"]')
        .contains('Return to manage key workers')
        .should('have.attr', 'href')
        .should('include', '/manage-key-workers')
    })

    context('when saving changes', () => {
      beforeEach(() => {
        cy.task('stubAllocate')
      })

      it('should display any changes made', () => {
        cy.visit('/manage-key-workers/allocate-key-worker')

        cy.get('[data-test="results-table"]')
          .find('tbody')
          .find('tr')
          .then(($tableRows) => {
            cy.get($tableRows).its('length').should('eq', 2)

            const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

            cy.get(offenders[1].changeKeyworker).find('[data-test="allocate-keyworker-select"]').select('2:ABC456:M')
          })

        cy.task('stubUnallocated', {
          agencyId: 'MDI',
          response: [
            {
              offenderNo: 'ABC123',
              firstName: 'FERINAND',
              lastName: 'ALFF',
              dateOfBirth: '1982-04-06',
              agencyId: 'MDI',
              assignedLivingUnitId: 11,
              assignedLivingUnitDesc: 'MDI-1-1',
            },
          ],
        })

        cy.get('[type="submit"]').click()

        cy.get('[data-test="results-table"]')
          .find('tbody')
          .find('tr')
          .then(($tableRows) => {
            cy.get($tableRows).its('length').should('eq', 2)

            const offenders = Array.from($tableRows).map(($row) => toOffender($row.cells))

            cy.get(offenders[0].name)
              .find('a')
              .contains('Alff, Ferinand')
              .should('have.attr', 'href')
              .should('include', 'http://localhost:3002/prisoner/ABC123')
            expect(offenders[0].prisonNo).to.eq('ABC123')
            expect(offenders[0].location).to.eq('MDI-1-1')
            expect(offenders[0].releaseDate.trim()).to.eq('30/04/2022')
            expect(offenders[0].keyworker.trim()).to.eq('Not allocated')
            cy.get(offenders[0].changeKeyworker)
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
            cy.get(offenders[0].viewHistory).find('a').should('not.exist')

            cy.get(offenders[1].name)
              .find('a')
              .contains('Smith, John')
              .should('have.attr', 'href')
              .should('include', 'http://localhost:3002/prisoner/ABC456')
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
                    expect($options.get(1)).to.contain('Bob Ball (6)')
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
  })
})
