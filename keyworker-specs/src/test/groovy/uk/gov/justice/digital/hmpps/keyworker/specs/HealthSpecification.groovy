package uk.gov.justice.digital.hmpps.keyworker.specs

import spock.lang.Specification

import static groovyx.net.http.HttpBuilder.configure

class HealthSpecification extends Specification {


    def "Health page reports application uptime"() {

        def http = configure {
            request.uri = 'http://localhost:3001/health'
        }

        when:
        def response = http.get() {
        }

        then:
        response.uptime > 0.0
    }

}
