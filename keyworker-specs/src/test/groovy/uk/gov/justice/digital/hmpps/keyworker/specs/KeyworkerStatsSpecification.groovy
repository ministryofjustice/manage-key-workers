package uk.gov.justice.digital.hmpps.keyworker.specs

import com.github.tomakehurst.wiremock.client.WireMock
import com.github.tomakehurst.wiremock.matching.UrlPattern
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.TokenVerificationApi
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.model.UserAccount
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage

import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo

class KeyworkerStatsSpecification extends BrowserReportingSpec {
    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    @Rule
    TokenVerificationApi tokenVerificationApi = new TokenVerificationApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi, tokenVerificationApi)

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

        assert statsHeading[0].text() == String.format("Statistics for period: %s to %s", fromDate, toDate)

        assert statsMapArray[0].description == "Projected sessions"
        assert statsMapArray[0].value == "0"
        assert statsMapArray[0].change == "no change since last month"

        assert statsMapArray[1].description == "Recorded sessions"
        assert statsMapArray[1].value == "10"
        assert statsMapArray[1].change == "no change since last month"

        assert statsMapArray[2].description == "Session compliance"
        assert statsMapArray[2].value == "0%"
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

    static statToMap(def stat) {
        String description  = stat.find('h2').text()
        String value = stat.find('strong').text()
        String change = stat.find('p').text()

        return [description: description, value: value, change: change]
    }

    static formatToLongDate(LocalDate date) {
        return date
                .format(DateTimeFormatter.ofPattern("dd MMMM yyyy"))
    }
}
