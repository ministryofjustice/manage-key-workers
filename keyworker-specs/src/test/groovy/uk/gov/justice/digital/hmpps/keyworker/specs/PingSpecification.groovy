package uk.gov.justice.digital.hmpps.keyworker.specs

import groovyx.net.http.HttpBuilder
import spock.lang.Specification

import static groovyx.net.http.HttpBuilder.configure

class PingSpecification extends Specification {

    HttpBuilder http

    def setup() {
        http = configure {
            request.uri = 'http://localhost:3006/ping'
        }
    }

    def "Ping page returns pong"() {
        given:

        when:
        def response = this.http.get()
        then:
        new String(response) == 'pong'
    }
}
