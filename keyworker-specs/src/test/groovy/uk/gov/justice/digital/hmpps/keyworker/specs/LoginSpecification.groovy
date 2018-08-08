package uk.gov.justice.digital.hmpps.keyworker.specs

import com.github.tomakehurst.wiremock.client.WireMock
import geb.spock.GebReportingSpec
import org.junit.Rule
import spock.lang.Ignore
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.LoginPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER
import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.NOT_KNOWN

class LoginSpecification extends GebReportingSpec {

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi)

    def "The login page is present"() {
        given:
        keyworkerApi.stubHealth()
        elite2api.stubHealth()

        when: 'I go to the login page'
        to LoginPage

        then: 'The Login page is displayed'
        at LoginPage
    }

    def "Default URI redirects to Login page"() {
        given:
        keyworkerApi.stubHealth()
        elite2api.stubHealth()

        when: "I go to the website URL using an empty path"
        go '/'

        then: 'The Login page is displayed'
        at LoginPage
    }

    def "Log in with valid credentials"() {
        given: 'I am on the Login page'
        keyworkerApi.stubHealth()
        elite2api.stubHealth()
        to LoginPage

        elite2api.stubValidOAuthTokenRequest(ITAG_USER)
        elite2api.stubGetMyDetails(ITAG_USER)
        elite2api.stubGetMyCaseloads(ITAG_USER.caseloads)

        when: "I login using valid credentials"
        loginAs ITAG_USER, 'password'

        then: 'My credentials are accepted and I am shown the Key worker management page'
        at KeyworkerManagementPage
    }

    def "Login page displays service unavilable message if health returns unhealthy"() {
        when: 'I am on the Login page'
        keyworkerApi.stubHealth()
        elite2api.stubHealthError()
        to LoginPage

        then: 'Service is unavailable message is displayed on login page'
        at LoginPage
        errors.message == 'Service unavailable. Please try again later.'
    }

    def "Log in attempt displays service unavailable message if health returns unhealthy"() {
        given: 'I am on the Login page'
        keyworkerApi.stubHealth()
        elite2api.stubHealth()
        to LoginPage

        WireMock.reset()

        when: "I login using valid credentials"
        keyworkerApi.stubHealthError()
        elite2api.stubHealth()
        elite2api.stubPostError('/oauth/token', 503)
        elite2api.stubGetMyDetails(ITAG_USER)
        elite2api.stubGetMyCaseloads(ITAG_USER.caseloads)
        loginAs ITAG_USER, 'password'

        then: 'user remains on login page with service unavailable message displayed'
        at LoginPage
        errors.message == 'Service unavailable. Please try again later.'
    }

    def "Log in attempt with long delay on oauth server"() {

        given: 'I am on the Login page'
        keyworkerApi.stubHealth()
        elite2api.stubHealth()
        to LoginPage

        and: 'The OAuth server responds with a long delay'
        elite2api.stubValidOAuthTokenRequest(ITAG_USER, true)
        elite2api.stubGetMyDetails(ITAG_USER)
        elite2api.stubGetMyCaseloads(ITAG_USER.caseloads)

        when: "I attempt to log in using valid credentials"
        loginAs ITAG_USER, 'password'

        then: 'My credentials are accepted and I am shown the Key worker management page'
        at KeyworkerManagementPage
    }

    def "Unknown user is rejected"() {

        given: 'I am on the Login page'
        keyworkerApi.stubHealth()
        elite2api.stubHealth()
        elite2api.stubInvalidOAuthTokenRequest(NOT_KNOWN)
        to LoginPage

        when: 'I login using an unknown username'
        loginAs NOT_KNOWN, 'password'

        then: 'I remain on the login page'
        at LoginPage

        and: 'I am told why I couldn\'t log in'
        errors.message == 'The username or password you have entered is invalid.'
    }

    def "Unknown password is rejected"() {
        given: 'I am on the Login page'
        keyworkerApi.stubHealth()
        elite2api.stubHealth()
        elite2api.stubInvalidOAuthTokenRequest(ITAG_USER, true)
        to LoginPage

        when: 'I login using an unknown username'
        loginAs ITAG_USER, 'wildGuess'

        then: 'I remain on the login page'
        at LoginPage

        and: 'I am told why I couldn\'t log in'
        errors.message == 'The username or password you have entered is invalid.'
    }

    def "Log out"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)

        when: "I log out"
        keyworkerApi.stubHealth()
        elite2api.stubHealth()
        header.logout()

        then: "I am returned to the Login page."
        at LoginPage
    }
}
