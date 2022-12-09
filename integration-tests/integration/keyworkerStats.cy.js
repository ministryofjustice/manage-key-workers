import moment from 'moment'
import { switchToIsoDateFormat } from '../../src/stringUtils'

const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')

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

const keyworkerStatsResponse = {
  caseNoteEntryCount: 10,
  caseNoteSessionCount: 10,
  complianceRate: 0,
  projectedKeyworkerSessions: 0,
}

const Utils = require('../support/utils')

context('Keyworker stats tests', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubKeyworker', keyworkerResponse)
    cy.task('stubKeyworkerAllocations')
    cy.task('stubAvailableKeyworkers')
    cy.task('stubGetOffenders')
    cy.task('stubKeyworkerStats', keyworkerStatsResponse)
    cy.task('stubCaseNoteUsageList')
    cy.task('stubLogin', {
      username: 'ITAG_USER',
      caseload: 'MDI',
      roles: [],
      migrationStatus: { migrated: true },
    })
    cy.login()
  })

  it('should populate the key worker profile page with stats for a member of staff', () => {
    cy.visit(`/key-worker/${keyworkerResponse.staffId}`)
    const lastMonth = moment().subtract(1, 'months')
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
    keyworkerProfilePage
      .statsHeading()
      .find('span')
      .contains(`${lastMonth.format('DD MMMM YYYY')} to ${moment().format('DD MMMM YYYY')}`)

    keyworkerProfilePage.statsColumnTitle(1).should('have.text', 'Projected sessions')
    keyworkerProfilePage.statsColumnValue(1).should('have.text', '0')
    keyworkerProfilePage.statsColumnMessage(1).should('have.text', 'No change')

    keyworkerProfilePage.statsColumnTitle(2).should('have.text', 'Recorded sessions')
    keyworkerProfilePage.statsColumnValue(2).should('have.text', '10')
    keyworkerProfilePage.statsColumnMessage(2).should('have.text', 'No change')

    keyworkerProfilePage.statsColumnTitle(3).should('have.text', 'Session compliance')
    keyworkerProfilePage.statsColumnValue(3).should('have.text', '0%')
    keyworkerProfilePage.statsColumnMessage(3).should('have.text', 'No change')

    keyworkerProfilePage.statsColumnTitle(4).should('have.text', 'Case notes written')
    keyworkerProfilePage.statsColumnValue(4).should('have.text', '20')
    keyworkerProfilePage.statsColumnMessage(4).should('have.text', 'No change')
  })

  it('should pull stats from a month ago to today', () => {
    cy.visit(`/key-worker/${keyworkerResponse.staffId}`)
    const lastMonth = switchToIsoDateFormat(moment().subtract(1, 'months'))
    const today = switchToIsoDateFormat(moment())
    KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(keyworkerResponse))
    cy.task('verifyKeyworkerStatsCalled', { from: lastMonth, to: today }).then((val) => {
      expect(JSON.parse(val.text).count).to.equal(1)
    })
  })
})
