package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.AllocatedResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.AllocationsForKeyworkerResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.AvailableKeyworkerResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.KeyworkerDetailResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.KeyworkerSearchResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.OffenderSearchResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.UnallocatedResponse
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.post
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo

class KeyworkerApi extends WireMockRule {
    KeyworkerApi() {
        super(8081)
    }

    void stubEmptyListResponse(url) {
        this.stubFor(
            get(url)
            .willReturn(
                aResponse()
                    .withStatus(200)
                    .withHeader('Content-Type', 'application/json')
                    .withBody('[]')
            ))
    }

    void stubError(url, status) {
        this.stubFor(
            get(url)
            .willReturn(
                aResponse()
                   .withStatus(status)))
    }

    void stubDelayedError(url, status) {
        this.stubFor(
                get(url)
                .willReturn(
                    aResponse()
                        .withStatus(status)
                        .withFixedDelay(3000)))
    }

    void stubErrorWithMessage(url, status, message) {
        this.stubFor(
            get(urlPathEqualTo(url))
            .willReturn(
                aResponse()
                    .withStatus(status)
                    .withHeader('Content-Type', 'application/json')
                    .withBody(JsonOutput.toJson([
                    status     : status,
                    userMessage: message]))))
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

    void stubKeyworkerSearchResponse(AgencyLocation agencyLocation, nameFilter = '', statusFilter = '') {
        this.stubFor(
            get("/key-worker/${agencyLocation.id}/members?statusFilter=${statusFilter}&nameFilter=${nameFilter}")
            .willReturn(
                aResponse()
                    .withBody(KeyworkerSearchResponse.response)
                    .withStatus(200))
        )
    }

    void stubKeyworkerDetailResponse(AgencyLocation agencyLocation, int staffId = KeyworkerResultsPage.test_keyworker_staffId) {
        this.stubFor(
            get("/key-worker/${staffId}/prison/${agencyLocation.id}")
                .willReturn(aResponse()
                .withBody(KeyworkerDetailResponse.getResponse(staffId))
                .withStatus(200))
        )
    }

    void stubInactiveKeyworkerDetailResponse(AgencyLocation agencyLocation) {
        this.stubFor(
            get("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}")
                .willReturn(aResponse()
                .withBody(KeyworkerDetailResponse.response_keyworker_inactive)
                .withStatus(200))
        )
    }

    void stubAllocationsForKeyworkerResponse(AgencyLocation agencyLocation) {
        this.stubFor(
            get("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}/offenders")
                .willReturn(aResponse()
                .withBody(AllocationsForKeyworkerResponse.response)
                .withStatus(200))
        )
    }

    void stubAvailableKeyworkersResponse(AgencyLocation agencyLocation, boolean insufficient) {
        this.stubFor(
            get("/key-worker/${agencyLocation.id}/available")
            .willReturn(
                aResponse()
                    .withBody(insufficient ?
                        AvailableKeyworkerResponse.insufficientResponse :
                        AvailableKeyworkerResponse.response)
                    .withStatus(200))
        )
    }

    void stubKeyworkerUpdate(AgencyLocation agencyLocation) {
        this.stubFor(
            post("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}")
            .willReturn(aResponse().withStatus(200))
        )
    }

    void stubUnallocatedResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                get("/key-worker/${agencyLocation.id}/offenders/unallocated")
                .willReturn(
                    aResponse()
                        .withBody(UnallocatedResponse.response)
                        .withStatus(200))
        )
    }

    void stubStartAllocateResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                post("/key-worker/${agencyLocation.id}/allocate/start")
                        .willReturn(aResponse()
                        .withStatus(200))
        )
    }

    void stubManualOverrideResponse() {
        this.stubFor(
                post("/key-worker/allocate")
                        .willReturn(aResponse()
                        .withStatus(200))
        )
    }

    void stubStartAllocateFailureResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                post("/key-worker/${agencyLocation.id}/allocate/start")
                        .willReturn(aResponse()
                        .withStatusMessage("Request failed with status code 400")
                        .withBody('''{"status":400,"userMessage":"No Key workers available for allocation."}''')
                        .withStatus(400))
        )
    }

    void stubAutoAllocationsResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                get(urlPathEqualTo("/key-worker/${agencyLocation.id}/allocations"))//?allocationType=P&fromDate=.*&toDate=.*"))  urlMatching(...)
                        .willReturn(aResponse()
                        .withBody(AllocatedResponse.response)
                        .withStatus(200))
        )
    }

    void stubOffenderKeyworkerListResponse(AgencyLocation agencyLocation) {
        this.stubFor(
                post(urlPathEqualTo("/key-worker/${agencyLocation.id}/offenders"))
                        .willReturn(aResponse()
                        .withBody(OffenderSearchResponse.keyworkersOfOffenders)
                        .withStatus(200))
        )
    }
}
