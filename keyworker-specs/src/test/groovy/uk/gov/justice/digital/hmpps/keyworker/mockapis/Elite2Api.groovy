package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import uk.gov.justice.digital.hmpps.keyworker.model.UserAccount

import static com.github.tomakehurst.wiremock.client.WireMock.*

class Elite2Api extends WireMockRule {

    Elite2Api() {
        super(8080)
    }

    void stubValidOAuthTokenRequest(UserAccount user, Boolean delayOAuthResponse = false) {
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

        stubFor(
                post('/oauth/token')
                        .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                        .withRequestBody(equalTo("username=${user.username}&password=password&grant_type=password&client_id=omic"))
                        .willReturn(response))

    }

    void stubInvalidOAuthTokenRequest(UserAccount user, boolean badPassword = false) {
        stubFor(
                post('/oauth/token')
                        .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                        .withRequestBody(matching("username=${user.username}&password=.*&grant_type=password&client_id=omic"))
                        .willReturn(
                        aResponse()
                                .withStatus(400)
                                .withBody(JsonOutput.toJson([
                                error            : 'invalid_grant',
                                error_description:
                                        badPassword ?
                                                "invalid authorization specification - not found: ${user.username}"
                                                :
                                                "invalid authorization specification"
                        ]))))
    }


    void stubGetUsersMe(UserAccount user) {
        stubFor(
                get('/api/users/me')
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(JsonOutput.toJson([
                                staffId         : user.staffMember.id,
                                username        : user.username,
                                firstName       : user.staffMember.firstName,
                                lastName        : user.staffMember.lastName,
                                email           : 'itaguser@syscon.net',
                                activeCaseLoadId: 'LEI'
// The following line breaks everything, but I can't work out why.  It seems to output exactly the same data...
//                                activeCaseloadId: user.workingCaseload.id
                        ]))))
    }

    void stubGetUsersMeCaseloads(UserAccount user) {
        def json = new JsonBuilder()
        json user.caseloads, { caseload ->
            caseLoadId caseload.id
            description caseload.description
            type caseload.type
            caseloadFunction 'DUMMY'
        }

        stubFor(
                get('/api/users/me/caseLoads')
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(json.toString())
                ))
    }
}
