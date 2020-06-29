package uk.gov.justice.digital.hmpps.keyworker.mockapis

import com.github.tomakehurst.wiremock.junit.WireMockRule

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.post

class TokenVerificationApi extends WireMockRule {

  TokenVerificationApi() {
    super(18100)
  }

  void stubHealth() {
    this.stubFor(
        get('/health/ping')
            .willReturn(
                aResponse()
                    .withStatus(200)
                    .withHeader('Content-Type', 'text/plain')
                    .withBody('{"status": "UP"}')))
  }

  void stubVerifyToken() {
    this.stubFor(
        post('/token/verify')
            .willReturn(
                aResponse()
                    .withStatus(200)
                    .withHeader('Content-Type', 'application/json;charset=UTF-8')
                    .withBody('{"active" : "true"}')
            ))
  }
}
