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
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo

class KeyworkerStatsSpecification extends GebReportingSpec {
    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "should populate the key worker profile page with stats for a member of staff"() {
        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to a key workers profile page"
        fixture.toKeyworkerProfilePage()

        then: "I should see the stats for the current key worker"

        def statsMapArray = stats.collect{stat -> statToMap(stat) }

        String toDate = formatToLongDate(LocalDate.now())

        String fromDate = formatToLongDate(LocalDate.now()
                .minus(1, ChronoUnit.MONTHS))

        assert statsHeading[0].text() == String.format("Hpa-3 Auser statistics: %s to %s", fromDate, toDate)

        assert statsMapArray[0].description == "Projected sessions"
        assert statsMapArray[0].value == "0"
        assert statsMapArray[0].change == "no change since last month"

        assert statsMapArray[1].description == "Recorded sessions"
        assert statsMapArray[1].value == "10"
        assert statsMapArray[1].change == "no change since last month"

        assert statsMapArray[2].description == "Session compliance"
        assert statsMapArray[2].value == "0 %"
        assert statsMapArray[2].change == "no change since last month"

        assert statsMapArray[3].description == "Case notes written"
        assert statsMapArray[3].value == "20"
        assert statsMapArray[3].change == "no change since last month"
    }

    def "should pull stats from a month ago to today"() {
        given: "I am logged in"
        fixture.loginAs(UserAccount.ITAG_USER)

        when: "I navigate to a key workers profile page"
        fixture.toKeyworkerProfilePage()

        then: "I have made a request from the correct fromDate and toDate"

        String path = "/key-worker-stats/${KeyworkerResultsPage.test_keyworker_staffId}/prison/LEI"

        LocalDate toDate = LocalDate.now()
        LocalDate fromDate = LocalDate.now().minus(1, ChronoUnit.MONTHS)

        UrlPattern requestUrl =
               urlPathEqualTo(
                        "${path}")

        keyworkerApi.verify(WireMock
                .getRequestedFor(requestUrl)
                .withQueryParam("fromDate", WireMock.equalTo(fromDate.toString()))
                .withQueryParam("toDate", WireMock.equalTo(toDate.toString())))
    }

    def "should parse date correctly"() {

        expect:
        assert formatToLongDate(LocalDate.parse("2018-11-01")) == "1st November 2018"
        assert formatToLongDate(LocalDate.parse("2018-11-02")) == "2nd November 2018"
        assert formatToLongDate(LocalDate.parse("2018-11-03")) == "3rd November 2018"
        assert formatToLongDate(LocalDate.parse("2018-11-04")) == "4th November 2018"
        assert formatToLongDate(LocalDate.parse("2018-11-11")) == "11th November 2018"
        assert formatToLongDate(LocalDate.parse("2018-11-12")) == "12th November 2018"
        assert formatToLongDate(LocalDate.parse("2018-11-13")) == "13th November 2018"

        assert formatToLongDate(LocalDate.parse("2018-11-21")) == "21st November 2018"
        assert formatToLongDate(LocalDate.parse("2018-11-22")) == "22nd November 2018"
        assert formatToLongDate(LocalDate.parse("2018-11-23")) == "23rd November 2018"

        assert formatToLongDate(LocalDate.parse("2018-10-31")) == "31st October 2018"
    }

    static statToMap(def stat) {
        String description  = stat.find('h2').text()
        String value = stat.find('strong').text()
        String change = stat.find('p').text()

        return [description: description, value: value, change: change]
    }

    static formatToLongDate(LocalDate date) {
        String ordinal = getOrdinalFor(date.dayOfMonth)
        String datePattern = String.format("d'%s' MMMM yyyy", ordinal)

        return date
                .format(DateTimeFormatter.ofPattern(datePattern))
    }

    static String getOrdinalFor(int value) {
        if(value == 11 || value == 12 || value == 13) return "th"

        int remainder = value % 10
        switch (remainder) {
            case 1:
                return "st"
            case 2:
                return "nd"
            case 3:
                return "rd"
            default:
                return "th"
        }
    }
}
