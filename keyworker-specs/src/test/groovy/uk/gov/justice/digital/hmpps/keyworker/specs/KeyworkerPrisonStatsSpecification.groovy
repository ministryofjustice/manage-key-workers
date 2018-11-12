package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.model.UserAccount
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerDashboardPage

class KeyworkerPrisonStatsSpecification extends GebReportingSpec{
    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def"keyworker dashboard should display correctly"() {
        keyworkerApi.stubKeyworkerPrisonStatsResponse(AgencyLocation.LEI)

        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to a key worker prison stats dashboard page"
        fixture.toKeyworkerDashboardPage()

        then: "Data should display as expected"
        at KeyworkerDashboardPage
        headingText == 'Key worker statistics'
        numberOfActiveKeyworkers == '100'
        numberKeyWorkerSessions == '2400'
        percentagePrisonersWithKeyworker == '100%'
        numProjectedKeyworkerSessions == '2400'
        complianceRate == '100%'
        avgNumDaysFromReceptionToAllocationDays == '-'
        avgNumDaysFromReceptionToKeyWorkingSession == '-'
    }
}
