package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import spock.lang.Ignore
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.Location
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.OffenderResultsPage
import uk.gov.justice.digital.hmpps.keyworker.pages.SearchForKeyworkerPage
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

    def "Assign and Transfer full results"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)
        toOffenderSearchPage()

        when: "I click the search button"
        stubOffenderResultsPage()
        searchButton.click()

        then: "I am shown the Offender Search results page"
        at OffenderResultsPage

        and: "A full result is displayed"
        rows.size() == 5
    }

    def "Search for offender returns no results"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)
        toOffenderSearchPage()

        when: "I click the search button"
        stubEmptyOffenderResultsPage()
        searchButton.click()

        then: "I am shown the Offender Search results page"
        at OffenderResultsPage

        and: "An empty result is displayed"
        !rows.isDisplayed()
    }

    def stubOffenderResultsPage() {
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI, false)
        elite2api.stubOffenderSearchResponse(AgencyLocation.LEI)
        elite2api.stubOffenderAssessmentResponse(AgencyLocation.LEI)
        elite2api.stubOffenderSentenceResponse(AgencyLocation.LEI)
        keyworkerApi.stubOffenderKeyworkerListResponse(AgencyLocation.LEI)
    }

    def stubEmptyOffenderResultsPage() {
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI, false)
        elite2api.stubEmptyOffenderSearchResponse(AgencyLocation.LEI)
    }

    def toOffenderSearchPage() {
        List<Location> locations = TestFixture.locationsForCaseload(ITAG_USER.workingCaseload)
        elite2api.stubGetMyLocations(locations)
        browser.page.manualAssignLink.click()
        assert browser.page instanceof SearchForOffenderPage
    }

}
