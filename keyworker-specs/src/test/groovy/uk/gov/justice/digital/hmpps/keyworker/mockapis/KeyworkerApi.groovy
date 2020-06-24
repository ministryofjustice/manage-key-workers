package uk.gov.justice.digital.hmpps.keyworker.mockapis


import com.github.tomakehurst.wiremock.junit.WireMockRule
import groovy.json.JsonOutput
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.*
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage

import static com.github.tomakehurst.wiremock.client.WireMock.*

class KeyworkerApi extends WireMockRule {
    KeyworkerApi() {
        super(18081)
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
            get('/health/ping')
                .willReturn(
                aResponse()
                    .withStatus(200)
                    .withHeader('Content-Type', 'application/json')
                    .withBody("{\"status\":\"UP\"}")))
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

    void stubKeyworkerPrisonStatsResponse() {

        this.stubFor(
                get(urlPathEqualTo("/key-worker-stats"))
                        .willReturn(
                        aResponse()
                                .withBody(KeyworkerPrisonStatsResponse.response)
                                .withStatus(200))
        )
    }

    void stubNoCurrentDataKeyworkerPrisonStatsResponse() {

        this.stubFor(
                get(urlPathEqualTo("/key-worker-stats"))
                        .willReturn(
                        aResponse()
                                .withBody(KeyworkerPrisonStatsResponse.noCurrentDataResponse)
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

    void stubPrisonMigrationStatus(AgencyLocation agencyLocation, Boolean supported, Boolean migrated, int kwSessionFrequencyInWeeks, Boolean allowAuto) {
        def json = JsonOutput.toJson([
                                          "supported": supported,
                                          "migrated": migrated,
                                          "autoAllocatedSupported": allowAuto,
                                          "capacityTier1": 3,
                                          "capacityTier2": 6,
                                          "kwSessionFrequencyInWeeks": kwSessionFrequencyInWeeks
                                      ])

        this.stubFor(
                get(urlPathEqualTo("/key-worker/prison/${agencyLocation.id}"))
                        .willReturn(aResponse()
                        .withBody(json)
                        .withStatus(200)))
    }


    void stubAutoAllocateMigrateResponse(AgencyLocation agencyLocation, Boolean supported, Boolean migrated, int kwSessionFrequencyInWeeks) {
        def json = JsonOutput.toJson([
                "supported": supported,
                "migrated": migrated,
                "autoAllocatedSupported": true,
                "capacityTier1": 3,
                "capacityTier2": 6,
                "kwSessionFrequencyInWeeks": kwSessionFrequencyInWeeks
        ])
        this.stubFor(
                post(urlPathEqualTo("/key-worker/enable/${agencyLocation.id}/auto-allocate"))
                        .willReturn(aResponse()
                        .withBody(json)
                        .withStatus(200))
        )
    }

    void stubManualMigrateResponse(AgencyLocation agencyLocation, Boolean supported, Boolean migrated, int kwSessionFrequencyInWeeks, int capacity, int extCapacity) {
        def json = JsonOutput.toJson([
                "supported": supported,
                "migrated": migrated,
                "autoAllocatedSupported": false,
                "capacityTier1": capacity,
                "capacityTier2": extCapacity,
                "kwSessionFrequencyInWeeks": kwSessionFrequencyInWeeks
        ])
        this.stubFor(
                post(urlPathEqualTo("/key-worker/enable/${agencyLocation.id}/manual"))
                        .willReturn(aResponse()
                        .withBody(json)
                        .withStatus(200))
        )
    }

    void stubKeyworkerStats() {
        this.stubFor(
                get(urlPathEqualTo("/key-worker-stats/${KeyworkerResultsPage.test_keyworker_staffId}/prison/LEI"))
                        .willReturn(aResponse()
                        .withBody(KeyworkerStatsResponse.statsForStaffResponse)
                        .withStatus(200)))
    }
}
