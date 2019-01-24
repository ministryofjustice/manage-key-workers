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

    def "should make a request for stats for the last full month by default"() {
        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to the key worker prison stats dashboard page"
        keyworkerApi.stubKeyworkerPrisonStatsResponse()
        fixture.toKeyworkerDashboardPage()

        then: "I set the from and to dates to cover the last full calendar month"
        at KeyworkerDashboardPage

        LocalDate lastMonth = LocalDate.now().minusMonths(1)
        LocalDate from = lastMonth.withDayOfMonth(1)
        LocalDate to = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth())

        keyworkerApi.verify(WireMock.getRequestedFor(requestUrl)
                .withQueryParam("prisonId", WireMock.equalTo("LEI"))
                .withQueryParam("fromDate", WireMock.equalTo(from.toString()))
                .withQueryParam("toDate", WireMock.equalTo(to.toString())))
    }

    def "should load the dashboard then select the previous 7 days and make a request for stats"() {
        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to the key worker prison stats dashboard page"
        keyworkerApi.stubKeyworkerPrisonStatsResponse()
        fixture.toKeyworkerDashboardPage()

        then: "I select the from and to dates"
        at KeyworkerDashboardPage

        LocalDate yesterday = LocalDate.now().minusDays((1))
        LocalDate sevenDaysAgo = yesterday.minusDays((7))

        setDatePickers(
                sevenDaysAgo.getYear(),
                sevenDaysAgo.getMonthValue(),
                sevenDaysAgo.getDayOfMonth(),
                yesterday.getYear(),
                yesterday.getMonthValue(),
                yesterday.getDayOfMonth()
        )

        at KeyworkerDashboardPage

        keyworkerApi.verify(WireMock.getRequestedFor(requestUrl)
                .withQueryParam("prisonId", WireMock.equalTo("LEI"))
                .withQueryParam("fromDate", WireMock.equalTo(sevenDaysAgo.toString()))
                .withQueryParam("toDate", WireMock.equalTo(yesterday.toString())))
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
        LocalDate lastMonth = LocalDate.now().minusMonths(1)
        LocalDate from = lastMonth.withDayOfMonth(1)
        LocalDate to = lastMonth.withDayOfMonth(lastMonth.lengthOfMonth())

        keyworkerApi.verify(WireMock.getRequestedFor(requestUrl)
                .withQueryParam("prisonId", WireMock.equalTo("BXI"))
                .withQueryParam("fromDate", WireMock.equalTo(from.toString()))
                .withQueryParam("toDate", WireMock.equalTo(to.toString())))

    }
}
