package uk.gov.justice.digital.hmpps.keyworker.specs

import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.matching.UrlPattern
import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.model.UserAccount
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerDashboardPage

import java.time.LocalDate

import static uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation.BXI

class KeyworkerPrisonStatsSpecification extends GebReportingSpec{
    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    UrlPattern requestUrl =
            WireMock.urlPathEqualTo("/key-worker-stats")

    def "keyworker dashboard should display correctly"() {
        keyworkerApi.stubKeyworkerPrisonStatsResponse()

        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to a key worker prison stats dashboard page"
        fixture.toKeyworkerDashboardPage()

        then: "Data should display as expected"
        at KeyworkerDashboardPage
        headingText == 'Key worker statistics - LEEDS (HMP)'
        numberOfActiveKeyworkers == '100'
        numberKeyWorkerSessions == '2400'
        percentagePrisonersWithKeyworker == '100%'
        numProjectedKeyworkerSessions == '2400'
        complianceRate == '100%'
        avgNumDaysFromReceptionToAllocationDays == '-'
        avgNumDaysFromReceptionToKeyWorkingSession == '-'

        then: "Should see the prisoner to key worker ratio"
        prisonerToKeyworkerRation == '3:1'
    }

    def "should make a request for stats over the last four weeks by default"() {
        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to the key worker prison stats dashboard page"
        keyworkerApi.stubKeyworkerPrisonStatsResponse()
        fixture.toKeyworkerDashboardPage()

        then: "a request for stats over the last 4 weeks should be made"
        at KeyworkerDashboardPage

        LocalDate from = LocalDate.now().minusWeeks(4)
        LocalDate to = LocalDate.now()

        keyworkerApi.verify(WireMock.getRequestedFor(requestUrl)
                .withQueryParam("prisonId", WireMock.equalTo("LEI"))
                .withQueryParam("fromDate", WireMock.equalTo(from.toString()))
                .withQueryParam("toDate", WireMock.equalTo(to.toString())))
    }

    def "should make a request for stats for the last 12 months"() {
        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to the key worker prison stats dashboard page"
        keyworkerApi.stubKeyworkerPrisonStatsResponse()
        fixture.toKeyworkerDashboardPage()

        then: "I set duration to 12 and period to monthly"
        at KeyworkerDashboardPage
        fetchStatsFor(12, 'month')

        at KeyworkerDashboardPage

        LocalDate from = LocalDate.now().minusMonths(12)
        LocalDate to = LocalDate.now()

        keyworkerApi.verify(WireMock.getRequestedFor(requestUrl)
                .withQueryParam("prisonId", WireMock.equalTo("LEI"))
                .withQueryParam("fromDate", WireMock.equalTo(from.toString()))
                .withQueryParam("toDate", WireMock.equalTo(to.toString())))
    }

    def "should make a request for stats for the previous year"() {
        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to the key worker prison stats dashboard page"
        keyworkerApi.stubKeyworkerPrisonStatsResponse()
        fixture.toKeyworkerDashboardPage()

        then: "I set duration to 1 and period to yearly"
        at KeyworkerDashboardPage
        fetchStatsFor(1, 'year')

        at KeyworkerDashboardPage

        LocalDate from = LocalDate.now().minusYears(1)
        LocalDate to = LocalDate.now()

        keyworkerApi.verify(WireMock.getRequestedFor(requestUrl)
                .withQueryParam("prisonId", WireMock.equalTo("LEI"))
                .withQueryParam("fromDate", WireMock.equalTo(from.toString()))
                .withQueryParam("toDate", WireMock.equalTo(to.toString())))
    }

    def "should stay on the dashboard after a case load switch"() {
        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to the key worker prison stats dashboard page"
        keyworkerApi.stubKeyworkerPrisonStatsResponse()
        fixture.toKeyworkerDashboardPage()

        at KeyworkerDashboardPage

        then: "I switch caseloads"
        elite2api.stubSetActiveCaseload()
        keyworkerApi.stubPrisonMigrationStatus(BXI, true, true, 0, true)

        header.dropDown.click()
        header.brixtonCaseLoad.click()

        then: "I still be on the dashboard"
        at KeyworkerDashboardPage

        then: "a call for Brixton stats should be made"
        LocalDate from = LocalDate.now().minusWeeks(4)
        LocalDate to = LocalDate.now()

        keyworkerApi.verify(WireMock.getRequestedFor(requestUrl)
                .withQueryParam("prisonId", WireMock.equalTo("BXI"))
                .withQueryParam("fromDate", WireMock.equalTo(from.toString()))
                .withQueryParam("toDate", WireMock.equalTo(to.toString())))

    }
}
