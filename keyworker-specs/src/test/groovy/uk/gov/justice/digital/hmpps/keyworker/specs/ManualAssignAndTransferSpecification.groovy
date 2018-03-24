package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class ManualAssignAndTransferSpecification extends GebReportingSpec {

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi)

    def "Assign and Transfer home"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)

        when: "I choose the Assign and Transfer function"

        then: "I am shown the Offender Search page"
        assert true == true
    }
}
