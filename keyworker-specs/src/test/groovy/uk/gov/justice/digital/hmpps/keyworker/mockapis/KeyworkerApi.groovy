package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.AllocationsForKeyworkerResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.AvailableKeyworkerResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.KeyworkerDetailResponse
import uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses.KeyworkerSearchResponse
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.equalTo
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.post

class KeyworkerApi extends WireMockRule {
    KeyworkerApi() {
        super(8081)
    }

    void stubGetAvailableKeyworkers(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${agencyLocation.id}/available")
                        .withHeader('authorization', equalTo('Basic b21pYzpjbGllbnRzZWNyZXQ='))
                        .withHeader('Content-Type', equalTo('application/x-www-form-urlencoded'))
                .willReturn(aResponse()
                        .withStatus(400))
        )
    }

    void stubEmptyListResponse(url) {
        stubFor(
                get(url)
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(
                        aResponse()
                                .withStatus(200)
                                .withHeader('Content-Type', 'application/json')
                                .withBody('[]')
                ))
    }

    void stub500Error(url) {
        stubFor(
                get(url)
                        .willReturn(
                        aResponse()
                                .withStatus(500)))
    }

    void stubDelayed500Error(url) {
        stubFor(
                get(url)
                        .willReturn(
                        aResponse()
                                .withStatus(500)
                                .withFixedDelay(3000)))
    }

    void stubHealth(url) {
        stubFor(
                get(url)
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
}''')
                ))
    }

    void stubKeyworkerSearchResponse(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${agencyLocation.id}/members?nameFilter=")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                          .withBody(KeyworkerSearchResponse.response)
                          .withStatus(200))
        )
    }

    void stubKeyworkerDetailResponse(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(KeyworkerDetailResponse.response_keyworker)
                        .withStatus(200))
        )
    }

    void stubInactiveKeyworkerDetailResponse(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(KeyworkerDetailResponse.response_keyworker_inactive)
                        .withStatus(200))
        )
    }

    void stubAllocationsForKeyworkerResponse(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}/offenders")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(AllocationsForKeyworkerResponse.response)
                        .withStatus(200))
        )
    }

    void stubAvailableKeyworkersResponse(AgencyLocation agencyLocation) {
        stubFor(
                get("/key-worker/${agencyLocation.id}/available")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withBody(AvailableKeyworkerResponse.response)
                        .withStatus(200))
        )
    }

    void stubKeyworkerUpdate(AgencyLocation agencyLocation) {
        stubFor(
                post("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${agencyLocation.id}")
                        .withHeader('authorization', equalTo('Bearer RW_TOKEN'))
                        .willReturn(aResponse()
                        .withStatus(200))
        )
    }

}
