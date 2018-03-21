package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import uk.gov.justice.digital.hmpps.keyworker.pages.HomePage
import uk.gov.justice.digital.hmpps.keyworker.pages.LoginPage

class LoginSpecification extends GebReportingSpec {

    def "The login page is present"() {
        when:
        to LoginPage

        then:
        at LoginPage
    }

    def "Default URI redirects to Login page"() {
        when:
        go '/'

        then:
        at LoginPage
    }

    def "Able to log in with valid credentials"() {
        given:
        to LoginPage

        when:
        loginAs 'PBELL'

        then:
        at HomePage
    }
}
