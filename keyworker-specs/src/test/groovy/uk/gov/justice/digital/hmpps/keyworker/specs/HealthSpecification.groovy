package uk.gov.justice.digital.hmpps.keyworker.specs

import groovyx.net.http.HttpBuilder
import groovyx.net.http.HttpException
import org.junit.Rule
import spock.lang.Specification
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.TokenVerificationApi

import static groovyx.net.http.HttpBuilder.configure

class HealthSpecification extends Specification {

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    @Rule
    Elite2Api elite2Api = new Elite2Api()

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    TokenVerificationApi tokenVerificationApi = new TokenVerificationApi()

    HttpBuilder http

    def setup() {
        http = configure {
            request.uri = 'http://localhost:3005/health'
        }
    }

    def "Health page reports ok"() {

        given:
        keyworkerApi.stubHealth()
        elite2Api.stubHealth()
        oauthApi.stubHealth()
        tokenVerificationApi.stubHealth()

        when:
        def response = this.http.get()
        then:
        response.uptime > 0.0
        response.name == "manage-key-workers"
        !response.version.isEmpty()
        response.api == [auth:'UP', elite2:'UP', keyworker:'UP', tokenverification: 'UP']
    }

    def "Health page reports API down"() {

        given:
        keyworkerApi.stubDelayedError('/health/ping', 500)
        elite2Api.stubHealth()
        oauthApi.stubHealth()
        tokenVerificationApi.stubHealth()

        when:
        def response
        try {
            response = http.get()
        } catch (HttpException e) {
            response = e.body
        }

        then:
        response.name == "manage-key-workers"
        !response.version.isEmpty()
        response.api == [auth:'UP', elite2:'UP', keyworker:[timeout:1000, code:'ECONNABORTED', errno:'ETIMEDOUT', retries:2], tokenverification: 'UP']
    }
}
