package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonBuilder
import groovy.json.JsonOutput
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.OffenderAssessmentsResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.OffenderSearchResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.OffenderSentencesResponse
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.Caseload
import uk.gov.justice.digital.hmpps.keyworker.model.Location
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


    void stubGetMyDetails(UserAccount user) {
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
//                                 The following line breaks everything, but I can't work out why.  It seems to output exactly the same data as
//                                 the constant, but...
//                                activeCaseloadId: user.workingCaseload.id
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

        stubFor(
                get('/api/users/me/locations')
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody(json.toString())
        ))
    }


    void stubOffenderSentenceResponse(AgencyLocation agencyLocation) {
        stubFor(
                post(urlPathEqualTo("/api/offender-sentences"))
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(OffenderSentencesResponse.response)
                        .withStatus(200))
        )
    }

    void stubOffenderAssessmentResponse(AgencyLocation agencyLocation) {
        stubFor(
                post(urlPathEqualTo("/api/offender-assessments/CSR"))
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(OffenderAssessmentsResponse.response)
                        .withStatus(200))
        )
    }

    void stubOffenderSearchResponse(AgencyLocation agencyLocation) {
        stubFor(
                get(urlPathEqualTo("/api/locations/description/${agencyLocation.id}/inmates"))
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(OffenderSearchResponse.response_5_results)
                        .withStatus(200))
        )
    }

    void stubOffenderSearchLargeResponse(AgencyLocation agencyLocation) {
        stubFor(
                get(urlPathEqualTo("/api/locations/description/${agencyLocation.id}/inmates"))
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(OffenderSearchResponse.response_55_results)
                        .withStatus(200))
        )
    }

    void stubEmptyOffenderSearchResponse(AgencyLocation agencyLocation) {
        stubFor(
                get(urlPathEqualTo("/api/locations/description/${agencyLocation.id}/inmates"))
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody("[]")
                        .withStatus(200))
        )
    }



//........GET /api/locations/description/LEI-H/inmates?keywords=Smith HTTP/1.1
//Accept: application/json, text/plain, */*
//    Page-Limit: 1000
//    authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjE5NDIwOTksImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiMmEyNjEyY2EtMzc0OS00MTM5LWE4ZDgtNDI3NTU1YzY0ZGFmIiwiY2xpZW50X2lkIjoib21pYyJ9.CbzNiYoCe5e5AUduB1Tzz1zFKyiK_D92ZPHWo7g8L68
//    access-control-allow-origin: localhost:3001
//    User-Agent: axios/0.17.1
//    Host: localhost:8080
//    Connection: close
//
//    ........HTTP/1.1 200
//    X-Content-Type-Options: nosniff
//    X-XSS-Protection: 1; mode=block
//    Cache-Control: no-cache, no-store, max-age=0, must-revalidate
//    Pragma: no-cache
//    Expires: 0
//    X-Frame-Options: DENY
//    X-Application-Context: application:dev,nomis-hsqldb:8080
//    Total-Records: 1
//    Page-Offset: 0
//    Page-Limit: 1000
//    Content-Type: application/json
//    Content-Length: 278
//    Date: Sun, 25 Mar 2018 01:34:38 GMT
//    Connection: close
//
//    [{"bookingId":-25,"bookingNo":"Z00025","offenderNo":"Z0025ZZ","firstName":"MATTHEW","middleName":"DAVID","lastName":"SMITH","dateOfBirth":"1974-01-01","age":44,"agencyId":"LEI","assignedLivingUnitId":-14,"assignedLivingUnitDesc":"H-1","facialImageId":-25,"iepLevel":"Standard"}]

//    ........GET /api/offender-sentences?offenderNo=Z0025ZZ& HTTP/1.1
//    Accept: application/json, text/plain, */*
//authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjE5NDIwOTksImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiMmEyNjEyY2EtMzc0OS00MTM5LWE4ZDgtNDI3NTU1YzY0ZGFmIiwiY2xpZW50X2lkIjoib21pYyJ9.CbzNiYoCe5e5AUduB1Tzz1zFKyiK_D92ZPHWo7g8L68
//access-control-allow-origin: localhost:3001
//User-Agent: axios/0.17.1
//Host: localhost:8080
//Connection: close
//
//........HTTP/1.1 200
//X-Content-Type-Options: nosniff
//X-XSS-Protection: 1; mode=block
//Cache-Control: no-cache, no-store, max-age=0, must-revalidate
//Pragma: no-cache
//Expires: 0
//X-Frame-Options: DENY
//X-Application-Context: application:dev,nomis-hsqldb:8080
//Total-Records: 1
//Page-Offset: 0
//Page-Limit: 10
//Content-Type: application/json
//Content-Length: 460
//Date: Sun, 25 Mar 2018 01:34:38 GMT
//Connection: close
//
//[{"bookingId":-25,"offenderNo":"Z0025ZZ","firstName":"MATTHEW","lastName":"SMITH","dateOfBirth":"1974-01-01","agencyLocationId":"LEI","agencyLocationDesc":"LEEDS","internalLocationDesc":"H-1","facialImageId":-25,"sentenceDetail":{"bookingId":-25,"sentenceStartDate":"2009-09-09","actualParoleDate":"2019-09-08","earlyTermDate":"2023-09-08","midTermDate":"2024-09-08","lateTermDate":"2025-09-08","confirmedReleaseDate":"2023-03-03","releaseDate":"2023-03-03"}}]

//........GET /api/offender-assessments/CSR?bookingId=-25& HTTP/1.1
//Accept: application/json, text/plain, */*
//    authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjE5NDIwOTksImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiMmEyNjEyY2EtMzc0OS00MTM5LWE4ZDgtNDI3NTU1YzY0ZGFmIiwiY2xpZW50X2lkIjoib21pYyJ9.CbzNiYoCe5e5AUduB1Tzz1zFKyiK_D92ZPHWo7g8L68
//            access-control-allow-origin: localhost:3001
//    User-Agent: axios/0.17.1
//    Host: localhost:8080
//    Connection: close
//
//    ........HTTP/1.1 200
//    X-Content-Type-Options: nosniff
//    X-XSS-Protection: 1; mode=block
//    Cache-Control: no-cache, no-store, max-age=0, must-revalidate
//    Pragma: no-cache
//    Expires: 0
//    X-Frame-Options: DENY
//            X-Application-Context: application:dev,nomis-hsqldb:8080
//    Content-Type: application/json
//    Content-Length: 2
//    Date: Sun, 25 Mar 2018 01:34:38 GMT
//            Connection: close
//
//    []

    //........GET /api/key-worker/LEI/allocationHistory HTTP/1.1
//Accept: application/json, application/json, application/*+json, application/*+json
//Page-Offset: 0
//Page-Limit: 50
//correlation-id:
//Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbnRlcm5hbFVzZXIiOnRydWUsInVzZXJfbmFtZSI6IklUQUdfVVNFUiIsInNjb3BlIjpbInJlYWQiLCJ3cml0ZSJdLCJleHAiOjE1MjE5NDIwOTksImF1dGhvcml0aWVzIjpbIlJPTEVfTElDRU5DRV9DQSIsIlJPTEVfS1dfQURNSU4iXSwianRpIjoiMmEyNjEyY2EtMzc0OS00MTM5LWE4ZDgtNDI3NTU1YzY0ZGFmIiwiY2xpZW50X2lkIjoib21pYyJ9.CbzNiYoCe5e5AUduB1Tzz1zFKyiK_D92ZPHWo7g8L68
//Host: localhost:8080
//Connection: Keep-Alive
//User-Agent: Apache-HttpClient/4.5.3 (Java/1.8.0_161)
//Accept-Encoding: gzip,deflate
//
//........HTTP/1.1 200
//X-Content-Type-Options: nosniff
//X-XSS-Protection: 1; mode=block
//Cache-Control: no-cache, no-store, max-age=0, must-revalidate
//Pragma: no-cache
//Expires: 0
//X-Frame-Options: DENY
//X-Application-Context: application:dev,nomis-hsqldb:8080
//Total-Records: 23
//Page-Offset: 0
//Page-Limit: 50
//Content-Type: application/json
//Content-Length: 4026
//Date: Sun, 25 Mar 2018 01:34:38 GMT
//
//[{"offenderNo":"A1176RS","staffId":-5,"agencyId":"LEI","assigned":"2017-06-01T12:14:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.926","createdBy":"SA"},{"offenderNo":"A5576RS","staffId":-5,"agencyId":"LEI","assigned":"2017-05-01T11:14:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.926","createdBy":"SA"},{"offenderNo":"A6676RS","staffId":-5,"agencyId":"LEI","assigned":"2016-01-01T11:14:00","userId":"ITAG_USER","active":"N","created":"2018-03-25T02:24:11.926","createdBy":"SA"},{"offenderNo":"A6676RS","staffId":-5,"agencyId":"LEI","assigned":"2017-01-01T11:14:00","userId":"ITAG_USER","active":"N","created":"2018-03-25T02:24:11.926","createdBy":"SA"},{"offenderNo":"A9876RS","staffId":-5,"agencyId":"LEI","assigned":"2017-01-01T11:14:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.925","createdBy":"SA"},{"offenderNo":"A1234AP","staffId":-5,"agencyId":"LEI","assigned":"2017-01-01T11:14:00","userId":"ITAG_USER","active":"N","created":"2018-03-25T02:24:11.925","createdBy":"SA"},{"offenderNo":"A1234AP","staffId":-5,"agencyId":"LEI","assigned":"2017-01-01T12:14:00","userId":"ITAG_USER","active":"N","created":"2018-03-25T02:24:11.925","createdBy":"SA"},{"offenderNo":"A1234AI","staffId":-4,"agencyId":"LEI","assigned":"2017-01-01T12:14:00","userId":"ITAG_USER","active":"N","created":"2018-03-25T02:24:11.925","createdBy":"SA"},{"offenderNo":"A1234AI","staffId":-4,"agencyId":"LEI","assigned":"2017-01-01T12:13:00","userId":"ITAG_USER","active":"N","created":"2018-03-25T02:24:11.925","createdBy":"SA"},{"offenderNo":"A1234AL","staffId":-4,"agencyId":"LEI","assigned":"2017-01-01T12:00:00","userId":"ITAG_USER","active":"N","created":"2018-03-25T02:24:11.925","createdBy":"SA"},{"offenderNo":"A1234AL","staffId":-4,"agencyId":"LEI","assigned":"2017-01-01T12:11:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.925","createdBy":"SA"},{"offenderNo":"A1234AK","staffId":-4,"agencyId":"LEI","assigned":"2017-01-01T12:10:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.925","createdBy":"SA"},{"offenderNo":"A1234AJ","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:09:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AI","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:08:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AH","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:07:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AG","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:06:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AF","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:05:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AE","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:04:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AD","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:03:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AC","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:02:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AB","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:01:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AA","staffId":-2,"agencyId":"LEI","assigned":"2016-11-01T12:00:00","userId":"ITAG_USER","active":"N","created":"2018-03-25T02:24:11.924","createdBy":"SA"},{"offenderNo":"A1234AA","staffId":-2,"agencyId":"LEI","assigned":"2017-01-01T12:00:00","userId":"ITAG_USER","active":"Y","created":"2018-03-25T02:24:11.923","createdBy":"SA"}]

}
