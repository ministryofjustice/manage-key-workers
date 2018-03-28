package uk.gov.justice.digital.hmpps.keyworker.specs

import spock.lang.Ignore
import spock.lang.Specification

/**
 * A Specification that always fails. (Unless @Ignore is used)
 * Used to fail the build when testing the CircleCi configuration.
 */
@Ignore
class FailSpecification extends Specification {

    def "Always fail"() {
        expect: "The test to fail"
        true == false
    }
}
