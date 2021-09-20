import moment from 'moment'
import { switchToIsoDateFormat } from '../../src/stringUtils'

const KeyworkerResponse = require('../responses/keyworkerResponse').keyworkerResponse
const CaseNoteUsageResponse = require('../responses/caseNoteUsageResponse')
const KeyworkerAllocationsResponse = require('../responses/keyworkerAllocationsResponse')
const AvailableKeyworkersResponse = require('../responses/availableKeyworkersResponse')
const KeyworkerStatsResponse = require('../responses/keyworkerStatsResponse')
const KeyworkerProfilePage = require('../pages/keyworkerProfilePage')
const Utils = require('../support/utils')

context('Keyworker stats tests', () => {
  before(() => {
    cy.clearCookies()
    cy.task('resetAndStubTokenVerification')
    cy.task('stubKeyworker', KeyworkerResponse)
    cy.task('stubKeyworkerAllocations', KeyworkerAllocationsResponse)
    cy.task('stubAvailableKeyworkers', AvailableKeyworkersResponse)
    cy.task('stubOffenderSentences')
    cy.task('stubOffenderAssessments')
    cy.task('stubKeyworkerStats', KeyworkerStatsResponse)
    cy.task('stubCaseNoteUsageList', CaseNoteUsageResponse)
    cy.task('stubLogin', {
      username: 'ITAG_USER',
      caseload: 'MDI',
      roles: [],
      migrationStatus: { migrated: true },
    })
    cy.login()
  })

  it('should populate the key worker profile page with stats for a member of staff', () => {
    cy.visit(`/key-worker/${KeyworkerResponse.staffId}`)
    const lastMonth = moment().subtract(1, 'months')
    const keyworkerProfilePage = KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
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
    cy.visit(`/key-worker/${KeyworkerResponse.staffId}`)
    const lastMonth = switchToIsoDateFormat(moment().subtract(1, 'months'))
    const today = switchToIsoDateFormat(moment())
    KeyworkerProfilePage.verifyOnPage(Utils.properCaseName(KeyworkerResponse))
    cy.task('verifyKeyworkerStatsCalled', { from: lastMonth, to: today }).then((val) => {
      expect(JSON.parse(val.text).count).to.equal(1)
    })
  })
})
