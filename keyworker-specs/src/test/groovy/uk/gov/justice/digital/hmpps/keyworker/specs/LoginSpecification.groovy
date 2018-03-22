package uk.gov.justice.digital.hmpps.keyworker.specs

import com.github.tomakehurst.wiremock.junit.WireMockRule
import geb.spock.GebReportingSpec
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.LoginPage

import static com.github.tomakehurst.wiremock.client.WireMock.*

class LoginSpecification extends GebReportingSpec {

    @Rule
    WireMockRule elite2api = new WireMockRule(8080)

    def "The login page is present"() {
        when: 'I go to the login page'
        to LoginPage

        then: 'The Login page is displayed'
        at LoginPage
    }

    def "Default URI redirects to Login page"() {
        when: "I go to the website URL using an empty path"
        go '/'

        then: 'The Login page is displayed'
        at LoginPage
    }

    def "Log in with valid credentials"() {
        given: 'I am on the Login page'
        to LoginPage
        stubValidOAuthTokenRequest()
        stubMe()
        stubCaseloads()

        when: "I login using valid credentials"
        loginAs 'ITAG_USER', 'password'

        then: 'My credentials are accepted and I am shown the Key worker management page'
        at KeyworkerManagementPage
    }

    def "Log in attempt with long delay on oauth server"() {
        given: 'I am on the Login page'
        to LoginPage
        and: 'The OAuth server responds with a long delay'
        stubValidOAuthTokenRequest(true)
        stubMe()
        stubCaseloads()

        when: "I attempt to log in using valid credentials"
        loginAs 'ITAG_USER', 'password'

        then: 'My credentials are accepted and I am shown the Key worker management page'
        at KeyworkerManagementPage
    }

    def "Unknown user is rejected"() {
        given: 'I am on the Login page'
        stubInvalidOAuthTokenRequest()
        to LoginPage

        when: 'I login using an unknown username'
        loginAs 'NOT_KNOWN', 'password'

        then: 'I remain on the login page'
        at LoginPage

        and: 'I am told why I couldn\'t log in'
        errors.message == 'The username or password you have entered is invalid.'
    }

    def "Unknown password is rejected"() {
        given: 'I am on the Login page'
        stubInvalidOAuthTokenRequest()
        to LoginPage

        when: 'I login using an unknown username'
        loginAs 'ITAG_USER', 'wildGuess'

        then: 'I remain on the login page'
        at LoginPage

        and: 'I am told why I couldn\'t log in'
        errors.message == 'The username or password you have entered is invalid.'
    }

    def "Log out"() {
        given: "I have logged in"
        stubValidOAuthTokenRequest()
        stubMe()
        stubCaseloads()

        to LoginPage
        loginAs 'ITAG_USER', 'password'
        at KeyworkerManagementPage

        when: "I log out"
        header.logout()

        then: "I am returned to the Login page."
        at LoginPage
    }

    void stubValidOAuthTokenRequest(Boolean delayOAuthResponse = false) {

        final response = aResponse()
                .withStatus(200)
                .withHeader('Content-Type', 'application/json;charset=UTF-8')
                .withBody(JsonOutput.toJson([
                access_token : 'RW_TOKEN',
                token_type   : 'bearer',
                refresh_token: 'refreshToken',
                expires_in   : 599,
                scope        : 'read write',
                internalUser : true
        ]))

        if (delayOAuthResponse) {
            response.withFixedDelay(5000)
        }

        elite2api.stubFor(
                post('/oauth/token')
                        .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                        .withRequestBody(equalTo('username=ITAG_USER&password=password&grant_type=password&client_id=omic'))
                        .willReturn(response)
        )
    }

    void stubInvalidOAuthTokenRequest(Boolean wrongPassword = false) {
        elite2api.stubFor(
                post('/oauth/token')
                        .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                        .withRequestBody(matching("username=.*&password=.*&grant_type=password&client_id=omic"))
                        .willReturn(

                        aResponse()
                                .withStatus(400)
                                .withBody(
                                wrongPassword ?
                                        '{"error":"invalid_grant","error_description":"invalid authorization specification"}'
                                        :
                                        '{"error":"invalid_grant","error_description":"invalid authorization specification - not found: NOT_KNOWN"}')
                )
        )
    }

    void stubMe() {
        elite2api.stubFor(
                get('/api/users/me')
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('{"staffId":-2,"username":"ITAG_USER","firstName":"API","lastName":"User","email":"itaguser@syscon.net","activeCaseLoadId":"LEI"}')
                )
        )
    }

    void stubCaseloads() {

        def agencies = [
                "BXI":"BRIXTON (HMP)",
                "LEI":"LEEDS (HMP)",
                "MDI":"MOORLAND CLOSED (HMP & YOI)",
                "SYI":"SHREWSBURY (HMP)",
                "WAI":"THE WEARE (HMP)"]

        def json = new JsonBuilder()
        json agencies.entrySet(), { entry ->
            caseLoadId entry.key
            description entry.value
            type "INST"
            caseloadFunction "DUMMY"
        }

        elite2api.stubFor(
                get('/api/users/me/caseLoads')
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(json.toString())
                )
        )
    }
}
