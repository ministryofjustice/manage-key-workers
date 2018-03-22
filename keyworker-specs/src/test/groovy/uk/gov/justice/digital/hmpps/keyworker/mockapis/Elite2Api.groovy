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

    void stubOAuthTokenRequest(Boolean delayOAuthResponse = false) {

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

        for (user in UserAccount.values()) {
            // Match usernames
            if (user != UserAccount.NOT_KNOWN) {
                // with matching password
                stubFor(
                        post('/oauth/token')
                                .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                                .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                                .withRequestBody(equalTo("username=${user.username}&password=password&grant_type=password&client_id=omic"))
                                .willReturn(response)
                )

                // password doesn't match
                stubFor(
                        post('/oauth/token')
                                .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                                .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                                .withRequestBody(matching("username=${user.username}&password=[^p].*&grant_type=password&client_id=omic"))
                                .willReturn(
                                aResponse()
                                        .withStatus(400)
                                        .withBody('{"error":"invalid_grant","error_description":"invalid authorization specification"}')))

            }

            // username NOT_KNOWN
            stubFor(
                    post('/oauth/token')
                            .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                            .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                            .withRequestBody(matching("username=NOT_KNOWN&password=.*&grant_type=password&client_id=omic"))
                            .willReturn(
                                aResponse()
                                    .withStatus(400)
                                    .withBody('{"error":"invalid_grant","error_description":"invalid authorization specification - not found: NOT_KNOWN"}')))


        }
    }

    void stubMe() {
        stubFor(
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
                "BXI": "BRIXTON (HMP)",
                "LEI": "LEEDS (HMP)",
                "MDI": "MOORLAND CLOSED (HMP & YOI)",
                "SYI": "SHREWSBURY (HMP)",
                "WAI": "THE WEARE (HMP)"]

        def json = new JsonBuilder()
        json agencies.entrySet(), { entry ->
            caseLoadId entry.key
            description entry.value
            type "INST"
            caseloadFunction "DUMMY"
        }

        stubFor(
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
