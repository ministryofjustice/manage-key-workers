package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.pages.LoginPage

class ManualAssignAndTransferSpecification extends GebReportingSpec {

    @Rule
    Elite2Api elite2api = new Elite2Api()

//    def "Assign and Transfer home"() {
//        given: "I have logged in"
//        to LoginPage
//        elite2api.stubOAuthTokenRequest()
//        elite2api.stubMe()
//        elite2api.stubCaseloads()
//        loginAs 'ITAG_USER', 'password'
//
//        when:  "I choose the Assign and Transfer function"
//        then: "I am shown the Offender Search page"
//    }
}
