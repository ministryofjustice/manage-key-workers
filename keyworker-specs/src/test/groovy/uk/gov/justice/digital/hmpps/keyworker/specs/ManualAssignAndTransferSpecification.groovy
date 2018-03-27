package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import spock.lang.Ignore
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.model.Location
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.OffenderResultsPage
import uk.gov.justice.digital.hmpps.keyworker.pages.SearchForOffenderPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class ManualAssignAndTransferSpecification extends GebReportingSpec {

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi)

    def "Assign and Transfer home"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)

        List<Location> locations = TestFixture.locationsForCaseload(ITAG_USER.workingCaseload)

        elite2api.stubGetMyLocations(locations)

        when: "I choose the Assign and Transfer function"
        manualAssignLink.click()

        then: "I am shown the Offender Search page"
        at SearchForOffenderPage

        and: "The expected Housing Location options are present"
        housingLocationOptions*.text() == locations.description
    }

    @Ignore
    def "Search for offender returns no results"() {
        given: "I am at the Search for offender page"
        fixture.loginAs(ITAG_USER)
        fixture.toManuallyAssignAndTransferPage()

        and: "I enter a name that does not match any offender"
        searchField.value('Smydd')
        housingLocationSelect.value(fixture.locations[1].locationPrefix)

        when: "I perform the search"
        searchButton.click()

        then: "There will be no offender information displayed on the 'Manually assign and transfer' page"
        at OffenderResultsPage
    }

}
