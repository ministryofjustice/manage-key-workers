package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule

class KeyworkerApi extends WireMockRule {
    KeyworkerApi() {
        super(8081)
    }
}
