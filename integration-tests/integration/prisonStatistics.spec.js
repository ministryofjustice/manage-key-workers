import moment from 'moment'
import { switchToIsoDateFormat } from '../../src/stringUtils'

context('Key workers statistics test', () => {
  describe('Tasks', () => {
    beforeEach(() => {
      cy.clearCookies()
      cy.task('resetAndStubTokenVerification')
      cy.task('stubLogin', {
        username: 'ITAG_USER',
        caseload: 'MDI',
        roles: [],
        migrationStatus: { migrated: true },
      })
      cy.login()
    })

    it('keyworker dashboard should display correct message if there is no data', () => {
      cy.task('stubKeyworkerStats', {
        summary: {
          requestedFromDate: '2018-10-12',
          requestedToDate: '2018-11-12',
        },
      })
      cy.visit('/key-worker-statistics')
      cy.get('h1').contains('Key worker statistics for')
      cy.contains('There is no data for this period.')
    })

    it('keyworker dashboard should display correctly', () => {
      cy.task('stubKeyworkerStats', {
        summary: {
          requestedFromDate: '2018-10-12',
          requestedToDate: '2018-11-12',
          current: {
            dataRangeFrom: '2018-10-28',
            dataRangeTo: '2018-11-11',
            numPrisonersAssignedKeyWorker: 600,
            totalNumPrisoners: 600,
            numberKeyWorkerSessions: 2400,
            numberKeyWorkerEntries: 400,
            numberOfActiveKeyworkers: 100,
            percentagePrisonersWithKeyworker: 100,
            numProjectedKeyworkerSessions: 2400,
            complianceRate: 100,
          },
        },
      })
      cy.visit('/key-worker-statistics')
      cy.get('h1').contains('Key worker statistics for')
      cy.get("[data-qa='numberOfActiveKeyworkers-value']").should('have.text', '100')
      cy.get("[data-qa='numberKeyWorkerSessions-value']").should('have.text', '2400')
      cy.get("[data-qa='percentagePrisonersWithKeyworker-value']").should('have.text', '100%')
      cy.get("[data-qa='numProjectedKeyworkerSessions-value']").should('have.text', '2400')
      cy.get("[data-qa='complianceRate-value']").should('have.text', '100%')
      cy.get("[data-qa='avgNumDaysFromReceptionToAllocationDays-value']").should('have.text', '-')
      cy.get("[data-qa='avgNumDaysFromReceptionToKeyWorkingSession-value']").should('have.text', '-')
      cy.get("[data-qa='prisonerToKeyworkerRation-value']").should('have.text', '3:1')
    })

    it('should make a request for stats for the last full month by default', () => {
      const lastMonth = moment().subtract(1, 'months')
      const firstDay = switchToIsoDateFormat(lastMonth.startOf('month'))
      const lastDay = switchToIsoDateFormat(lastMonth.endOf('month'))

      cy.task('stubKeyworkerStats', {
        summary: {
          requestedFromDate: firstDay,
          requestedToDate: lastDay,
        },
      })
      cy.visit('/key-worker-statistics')
      cy.contains('There is no data for this period.')
      cy.task('verifyKeyworkerStatsCalled', { prisonId: 'MDI', from: firstDay, to: lastDay }).then((val) => {
        expect(JSON.parse(val.text).count).to.equal(1)
      })
    })

    it('should load the dashboard then select the previous 7 days and make a request for stats', () => {
      const yesterday = moment().subtract(1, 'day')
      const sevenDaysAgo = moment().subtract(7, 'day')

      cy.task('stubKeyworkerStats', {
        summary: {
          requestedFromDate: '2018-10-12',
          requestedToDate: '2018-11-12',
        },
      })
      cy.visit('/key-worker-statistics')

      cy.get('#fromDate').click()
      cy.get('.fromDate th.rdtSwitch').click()
      cy.get('.fromDate th.rdtSwitch').click()
      cy.get(`.fromDate td[data-value=${sevenDaysAgo.get('year')}]`).click()
      cy.get(`.fromDate td[data-value=${sevenDaysAgo.get('month')}]`).click()
      cy.get(`.fromDate td.rdtDay:not(.rdtOld):not(.rdtNew)[data-value=${sevenDaysAgo.date()}]`).click()

      cy.get('#toDate').click()
      cy.get('.toDate th.rdtSwitch').click()
      cy.get('.toDate th.rdtSwitch').click()
      cy.get(`.toDate td[data-value=${yesterday.get('year')}]`).click()
      cy.get(`.toDate td[data-value=${yesterday.get('month')}]`).click()
      cy.get(`.toDate td.rdtDay:not(.rdtOld):not(.rdtNew)[data-value=${yesterday.date()}]`).click()
      cy.get('form button').click()

      cy.contains('There is no data for this period.')
      cy.task('verifyKeyworkerStatsCalled', {
        prisonId: 'MDI',
        from: switchToIsoDateFormat(sevenDaysAgo),
        to: switchToIsoDateFormat(yesterday),
      }).then((val) => {
        expect(JSON.parse(val.text).count).to.equal(1)
      })
    })
  })
})
