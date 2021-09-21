import moment from 'moment'
import { switchToIsoDateFormat } from '../../src/stringUtils'

const PrisonStatsPage = require('../pages/prisonStatsPage')

const keyworkerPrisonStatsResponse = {
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
}

const keyworkerPrisonStatsNoCurrentDataResponse = {
  summary: {
    requestedFromDate: '2018-10-12',
    requestedToDate: '2018-11-12',
  },
}

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
      cy.task('stubKeyworkerStats', keyworkerPrisonStatsNoCurrentDataResponse)
      cy.visit('/key-worker-statistics')
      cy.get('h1').contains('Key worker statistics for')
      cy.contains('There is no data for this period.')
    })

    it('keyworker dashboard should display correctly', () => {
      cy.task('stubKeyworkerStats', keyworkerPrisonStatsResponse)
      cy.visit('/key-worker-statistics')
      const prisonStatsPage = PrisonStatsPage.verifyOnPage('Key worker statistics for Moorland')
      prisonStatsPage.numberOfActiveKeyworkers().should('have.text', '100')
      prisonStatsPage.numberKeyworkerSessions().should('have.text', '2400')
      prisonStatsPage.percentagePrisonersWithKeyworker().should('have.text', '100%')
      prisonStatsPage.numProjectedKeyworkerSessions().should('have.text', '2400')
      prisonStatsPage.complianceRate().should('have.text', '100%')
      prisonStatsPage.avgNumDaysFromReceptionToAllocationDays().should('have.text', '-')
      prisonStatsPage.avgNumDaysFromReceptionToKeyWorkingSession().should('have.text', '-')
      prisonStatsPage.prisonerToKeyworkerRation().should('have.text', '3:1')
    })

    it('should make a request for stats for the last full month by default', () => {
      const lastMonth = moment().subtract(1, 'months')
      const firstDay = switchToIsoDateFormat(lastMonth.startOf('month'))
      const lastDay = switchToIsoDateFormat(lastMonth.endOf('month'))

      cy.task('stubKeyworkerStats', keyworkerPrisonStatsNoCurrentDataResponse)
      cy.visit('/key-worker-statistics')
      cy.contains('There is no data for this period.')
      cy.task('verifyPrisonStatsCalled', { prisonId: 'MDI', from: firstDay, to: lastDay }).then((val) => {
        expect(JSON.parse(val.text).count).to.equal(1)
      })
    })

    it('should load the dashboard then select the previous 7 days and make a request for stats', () => {
      const yesterday = moment().subtract(1, 'day')
      const sevenDaysAgo = moment().subtract(7, 'day')

      cy.task('stubKeyworkerStats', keyworkerPrisonStatsNoCurrentDataResponse)
      cy.visit('/key-worker-statistics')
      const prisonStatsPage = PrisonStatsPage.verifyOnPage('Key worker statistics for Moorland')
      prisonStatsPage.setFromDate(sevenDaysAgo)
      prisonStatsPage.setToDate(yesterday)

      cy.contains('There is no data for this period.')
      cy.task('verifyPrisonStatsCalled', {
        prisonId: 'MDI',
        from: switchToIsoDateFormat(sevenDaysAgo),
        to: switchToIsoDateFormat(yesterday),
      }).then((val) => {
        expect(JSON.parse(val.text).count).to.equal(1)
      })
    })
  })
})
