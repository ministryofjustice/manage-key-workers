package uk.gov.justice.digital.hmpps.keyworker.specs

import groovyx.net.http.HttpException
import org.junit.Rule
import spock.lang.Specification
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi

import static groovyx.net.http.HttpBuilder.configure

class HealthSpecification extends Specification {

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    def "Health page reports ok"() {

        keyworkerApi.stubHealth('/health')

        def http = configure {
            request.uri = 'http://localhost:3001/health'
        }

        when:
        def response = http.get() {}

        then:
        response.uptime > 0.0
        response.name == "keyworker-ui"
        response.version == "0.1.0"
        response.api.status == "UP"
        response.api.db.status == "UP"
    }

    def "Health page reports API unhealthy"() {

        keyworkerApi.stub500Error('/health')

        def http = configure {
            request.uri = 'http://localhost:3001/health'
        }

        when:
        def response
        try {
            http.get() {}
        } catch (HttpException e) {
            response = e.body
        }

        then:
        response.uptime > 0.0
        response.name == "keyworker-ui"
        response.version == "0.1.0"
        response.api == "Request failed with status code 500"
    }
}
