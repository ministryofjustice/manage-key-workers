package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.model.UserAccount

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

        assert statsMapArray[0].description == "Number of projected key worker sessions last month"
        assert statsMapArray[0].value == "0"
        assert statsMapArray[0].change == "no change since last month"

        assert statsMapArray[1].description == "Number of recorded key worker sessions last month"
        assert statsMapArray[1].value == "10"
        assert statsMapArray[1].change == "no change since last month"

        assert statsMapArray[2].description == "Compliance rate"
        assert statsMapArray[2].value == "0"
        assert statsMapArray[2].change == "no change since last month"

        assert statsMapArray[3].description == "Total number of key worker case notes written"
        assert statsMapArray[3].value == "20"
        assert statsMapArray[3].change == "no change since last month"
    }

    static statToMap(def stat) {
        String description  = stat.find('h2').text()
        String value = stat.find('strong').text()
        String change = stat.find('p').text()

        return [description: description, value: value, change: change]
    }
}
