package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.CaseNoteUsageResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.OffenderAssessmentsResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.OffenderSearchResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.OffenderSentencesResponse
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.Caseload
import uk.gov.justice.digital.hmpps.keyworker.model.Location
import uk.gov.justice.digital.hmpps.keyworker.model.UserAccount

import java.lang.reflect.Array

import static com.github.tomakehurst.wiremock.client.WireMock.*

class Elite2Api extends WireMockRule {

    Elite2Api() {
        super(8080)
    }

    void stubValidOAuthTokenRequest(UserAccount user, Boolean delayOAuthResponse = false) {

        final accessToken = JwtFactory.token()

        final response = aResponse()
                .withStatus(200)
                .withHeader('Content-Type', 'application/json;charset=UTF-8')
                .withBody(JsonOutput.toJson([
                access_token : accessToken,
                token_type   : 'bearer',
                refresh_token: JwtFactory.token(),
                expires_in   : 599,
                scope        : 'read write',
                internalUser : true
        ]))

        if (delayOAuthResponse) {
            response.withFixedDelay(5000)
        }

        this.stubFor(
                post('/oauth/token')
                        .withHeader('authorization', equalTo('Basic ZWxpdGUyYXBpY2xpZW50OmNsaWVudHNlY3JldA=='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                        .withRequestBody(equalTo("username=${user.username}&password=password&grant_type=password"))
                        .willReturn(response))

    }

    void stubInvalidOAuthTokenRequest(UserAccount user, boolean badPassword = false) {
        this.stubFor(
                post('/oauth/token')
                        .withHeader('authorization', equalTo('Basic ZWxpdGUyYXBpY2xpZW50OmNsaWVudHNlY3JldA=='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                        .withRequestBody(matching("username=${user.username}&password=.*&grant_type=password"))
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

    void stubGetMyDetails(UserAccount user) {
        this.stubFor(
                get('/api/users/me')
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
                        ]))))
    }

    void stubGetMyCaseloads(List<Caseload> caseloads) {
        def json = new JsonBuilder()
        json caseloads, { caseload ->
            caseLoadId caseload.id
            description caseload.description
            type caseload.type
            caseloadFunction 'DUMMY'
        }

        this.stubFor(
                get('/api/users/me/caseLoads')
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(json.toString())
                ))
    }

    void stubGetMyLocations(List<Location> locations) {

        JsonBuilder json = new JsonBuilder()
        json locations, {
            locationId it.locationId
            locationType it.locationType
            description it.description
            agencyId it.agencyId
            if (it.currentOccupancy != null) currentOccupancy it.currentOccupancy
            locationPrefix it.locationPrefix
            if (it.userDescription) userDescription it.userDescription
        }

        this.stubFor(
                get('/api/users/me/locations')
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(json.toString())
        ))
    }


    void stubOffenderSentenceResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                post(urlPathEqualTo("/api/offender-sentences"))
                        .willReturn(aResponse()
                        .withBody(OffenderSentencesResponse.response)
                        .withStatus(200))
        )
    }

    void stubCaseNoteUsageResponse() {
        this.stubFor(
                get(urlPathMatching("/api/case-notes/usage?.*"))
                        .willReturn(aResponse()
                        .withBody(CaseNoteUsageResponse.response)
                        .withStatus(200))
        )
    }

    void stubOffenderAssessmentResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                post(urlPathEqualTo("/api/offender-assessments/csra/list"))
                        .willReturn(aResponse()
                        .withBody(OffenderAssessmentsResponse.response)
                        .withStatus(200))
        )
    }

    void stubOffenderSearchResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                get(urlPathEqualTo("/api/locations/description/${agencyLocation.id}/inmates"))
                        .willReturn(aResponse()
                        .withBody(OffenderSearchResponse.response_5_results)
                        .withStatus(200))
        )
    }

    void stubOffenderSearchLargeResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                get(urlPathEqualTo("/api/locations/description/${agencyLocation.id}/inmates"))
                        .willReturn(aResponse()
                        .withBody(OffenderSearchResponse.response_55_results)
                        .withStatus(200))
        )
    }

    void stubEmptyOffenderSearchResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                get(urlPathEqualTo("/api/locations/description/${agencyLocation.id}/inmates"))
                        .willReturn(aResponse()
                        .withBody("[]")
                        .withStatus(200))
        )
    }

    void stubHealth() {
        this.stubFor(
            get('/health')
                .willReturn(
                aResponse()
                    .withStatus(200)
                    .withHeader('Content-Type', 'application/json')
                    .withBody('''
                {
                    "status": "UP",
                    "healthInfo": {
                        "status": "UP",
                        "version": "version not available"
                    },
                    "diskSpace": {
                        "status": "UP",
                        "total": 510923390976,
                        "free": 143828922368,
                        "threshold": 10485760
                    },
                    "db": {
                        "status": "UP",
                        "database": "HSQL Database Engine",
                        "hello": 1
                    }
                }'''.stripIndent())
        ))
    }

    void stubPostError(url, status) {
        this.stubFor(
                post(url)
                        .willReturn(
                        aResponse()
                                .withStatus(status)))
    }

    void stubHealthError() {
        this.stubFor(
                get('/health')
                        .willReturn(
                        aResponse()
                                .withStatus(500)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('''
                        {
                              "status": "DOWN",
                              "healthInfo": {
                                "status": "UP",
                                "version": "2018-05-04"
                              },
                              "diskSpace": {
                                "status": "UP",
                                "total": 121123069952,
                                "free": 30912241664,
                                "threshold": 10485760
                              },
                              "db": {
                                "status": "DOWN",
                                "error": "org.springframework.jdbc.CannotGetJdbcConnectionException: Could not get JDBC Connection; nested exception is java.sql.SQLTransientConnectionException: Elite2-CP - Connection is not available, request timed out after 1010ms."
                              }
                            }'''.stripIndent())))
    }

    void stubErrorWithMessage(url, status, message) {
        this.stubFor(
                get(urlPathEqualTo(url))
                        .willReturn(
                        aResponse()
                                .withStatus(status)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(JsonOutput.toJson([
                                    status         : status,
                                    userMessage        : message]))))
    }

    void stubGetStaffRoles(Integer staffId, AgencyLocation agencyLocation, def roles) {

        def json = JsonOutput.toJson(roles)

        this.stubFor(
                get(urlPathEqualTo("/api/staff/${staffId}/${agencyLocation.id}/roles"))
                        .willReturn(aResponse()
                        .withBody(json)
                        .withStatus(200)))
    }
}
