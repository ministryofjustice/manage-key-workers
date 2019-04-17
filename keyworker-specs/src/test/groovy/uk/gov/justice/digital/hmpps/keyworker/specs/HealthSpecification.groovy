package uk.gov.justice.digital.hmpps.keyworker.specs

import groovyx.net.http.HttpBuilder
import groovyx.net.http.HttpException
import org.junit.Rule
import spock.lang.Specification
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi

import static groovyx.net.http.HttpBuilder.configure

class HealthSpecification extends Specification {

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    @Rule
    Elite2Api elite2Api = new Elite2Api()

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

        when:
        def response = this.http.get()
        then:
        response.uptime > 0.0
        response.name == "omic-ui"
        !response.version.isEmpty()
        response.api.keyworkerApi.status == 'UP'
        response.api.keyworkerApi.db.status == 'UP'
        response.api.elite2Api.status == 'UP'
        response.api.elite2Api.db.status == 'UP'
    }

    def "Health page reports API unhealthy"() {

        given:
        keyworkerApi.stubHealthError()
        elite2Api.stubHealth()

        when:
        def response
        try {
            response = http.get()
        } catch (HttpException e) {
            response = e.body
        }

        then:
        response.uptime > 0.0
        response.api.keyworkerApi.status == "DOWN"
    }

    def "Health page reports API down"() {

        given:
        keyworkerApi.stubDelayedError('/health', 500)
        elite2Api.stubHealth()

        when:
        def response
        try {
            response = http.get()
        } catch (HttpException e) {
            response = e.body
        }

        then:
        response.api.keyworkerApi == "timeout of 2000ms exceeded"
    }
}
