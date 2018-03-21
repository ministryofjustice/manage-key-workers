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
        stubValidOAuthTokenRequest()
        stubMe()

        when: "I login using legitimate credentials"
        loginAs 'ITAG_USER', 'password'

        then: 'My credentials are accepted and I see the Key worker management page'
        at KeyworkerManagementPage
    }

    def "Invalid credentials are rejected"() {
        given: 'I am on the Login page'
        stubInvalidOAuthTokenRequest()
        to LoginPage

        when: 'I login using an unknown username'
        loginAs 'NOT_KNOWN', 'password'

        then: 'I remain on the login page'
        at LoginPage

        and: 'I am told why my login was rejected'
        errors.message == 'The username or password you have entered is invalid.'

    }

    def "Log out"() {
        given: "I have logged in"
        stubValidOAuthTokenRequest()
        stubMe()
        to LoginPage
        loginAs 'ITAG_USER', 'password'
        at KeyworkerManagementPage

        when: "I log out"
        header.logout()

        then:
        at LoginPage
    }

    void stubValidOAuthTokenRequest() {

        elite2api.stubFor(
            post('/oauth/token')
                .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                .withRequestBody(equalTo('username=ITAG_USER&password=password&grant_type=password&client_id=omic'))
            .willReturn(
                aResponse()
                .withStatus(200)
                .withHeader('Content-Type','application/json;charset=UTF-8')
                .withBody(JsonOutput.toJson([
                        access_token: 'RW_TOKEN',
                        token_type: 'bearer',
                        refresh_token: 'refreshToken',
                        expires_in:599,
                        scope: 'read write',
                        internalUser:true
                ]))
            )
        )
    }

    void stubInvalidOAuthTokenRequest() {
        elite2api.stubFor(
            post('/oauth/token')
                .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                .withRequestBody(equalTo('username=NOT_KNOWN&password=password&grant_type=password&client_id=omic'))
            .willReturn(
                aResponse()
                .withStatus(400)
                .withBody('{"error":"invalid_grant","error_description":"invalid authorization specification - not found: NOT_KNOWN"}')
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

        elite2api.stubFor(
            get('/api/users/me/caseLoads')
                .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
            .willReturn(
                aResponse()
                .withStatus(200)
                .withHeader('Content-Type', 'application/json')
                .withBody('''\
                            [
                            {"caseLoadId":"BXI","description":"BRIXTON (HMP)","type":"INST","caseloadFunction":"DUMMY"},
                            {"caseLoadId":"LEI","description":"LEEDS (HMP)","type":"INST","caseloadFunction":"DUMMY"},
                            {"caseLoadId":"MDI","description":"MOORLAND CLOSED (HMP & YOI)","type":"INST","caseloadFunction":"DUMMY"},
                            {"caseLoadId":"SYI","description":"SHREWSBURY (HMP)","type":"INST","caseloadFunction":"DUMMY"},
                            {"caseLoadId":"WAI","description":"THE WEARE (HMP)","type":"INST","caseloadFunction":"DUMMY"}]'''.stripIndent())
            )
        )
    }
}
