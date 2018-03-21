package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.LoginPage

class LoginSpecification extends GebReportingSpec {

    def "The login page is present"() {
        when: 'I enter the URL of the login page'
        to LoginPage

        then: 'The Login page is displayed'
        at LoginPage
    }

    def "Default URI redirects to Login page"() {
        when: "I visit the website using a URL that has an empty path"
        go '/'

        then: 'I am redirected to the Login page'
        at LoginPage
    }

    def "Able to login"() {
        given: 'I am on the Login page'
        to LoginPage

        when: "I login using legitimate credentials"
        loginAs 'ITAG_USER'

        then: 'My credentials are accepted and I see the Key worker management page'
        at KeyworkerManagementPage
    }

    def "Invalid credentials are rejected"() {
        given: 'I am on the Login page'
        to LoginPage

        when: 'I login using an unknown username'
        loginAs 'NOT_KNOWN'

        then: 'I remain on the login page'
        at LoginPage

        and: 'I am told why my login was rejected'
        errors.message == 'The username or password you have entered is invalid.'

    }

    def "Log out"() {
        given: "I have logged in"
        to LoginPage
        loginAs('ITAG_USER')
        at KeyworkerManagementPage

        when: "I log out"
        header.logout()

        then:
        at LoginPage
    }
}
