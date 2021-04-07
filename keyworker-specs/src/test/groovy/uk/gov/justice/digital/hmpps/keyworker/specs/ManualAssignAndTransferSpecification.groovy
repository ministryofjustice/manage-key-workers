package uk.gov.justice.digital.hmpps.keyworker.specs

import com.github.tomakehurst.wiremock.client.WireMock
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.TokenVerificationApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.Location
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerProfilePage
import uk.gov.justice.digital.hmpps.keyworker.pages.OffenderResultsPage
import uk.gov.justice.digital.hmpps.keyworker.pages.SearchForOffenderPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class ManualAssignAndTransferSpecification extends BrowserReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    @Rule
    TokenVerificationApi tokenVerificationApi = new TokenVerificationApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi, tokenVerificationApi)

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
        fixture.stubOffenderResultsPage()
        searchButton.click()

        then: "I am shown the Offender Search results page"
        at OffenderResultsPage

        and: "A full result is displayed"
        rows.size() == 5

        when: "I select a key worker"
        fixture.stubKeyworkerProfilePage()
        keyworkerLink.click()

        then: "I am shown the key worker profile page"
        at KeyworkerProfilePage

        when: "Parent page link in breadcrumb is clicked"
        parentPageLink.click()

        then: "We return to KW Management page"
        at KeyworkerManagementPage
    }

    def "Assign and Transfer filtered by unallocated"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)
        toOffenderSearchPage()

        when: "I click the search button"
        fixture.stubOffenderResultsPage(false)
        allocationStatusSelect = "Unallocated"
        searchButton.click()

        then: "I am shown the Offender Search results page"
        at OffenderResultsPage

        and: "The 3 unallocated results are displayed"
        rows.size() == 3
    }

    def "Assign and Transfer filtered by unallocated - partial result"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)
        toOffenderSearchPage()

        when: "I click the search button"
        fixture.stubOffenderResultsPage(true)
        allocationStatusSelect = "Unallocated"
        searchButton.click()

        then: "I am shown the Offender Search results page"
        at OffenderResultsPage

        and: "The 4 unallocated results are displayed"
        rows.size() == 50
    }

    def "Assign and Transfer filtered by allocated"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)
        toOffenderSearchPage()

        when: "I click the search button"
        fixture.stubOffenderResultsPage()
        allocationStatusSelect = "Allocated"
        searchButton.click()

        then: "I am shown the Offender Search results page"
        at OffenderResultsPage

        and: "The 2 allocated results are displayed"
        rows.size() == 2
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

    def "refreshing on offender result (or typing /offender-search/results in url) - should redirect to offender search"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)

        when: "I go direct to results page"
        List<Location> locations = TestFixture.locationsForCaseload(ITAG_USER.workingCaseload)
        elite2api.stubGetMyLocations(locations)

        browser.go '/offender-search/results'

        then: "I am redirected to the Offender Search page"
        at SearchForOffenderPage
    }

    def "error returned from api call is rendered"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)
        toOffenderSearchPage()

        when: "I click the search button"
        stubErrorResponseFromSearch(403)
        searchButton.click()

        then: "I am shown the Offender Search results page"
        at OffenderResultsPage

        and: "An error message is displayed"
        !rows.isDisplayed()
        message == 'Something went wrong: Error: Request failed with status code 403'
    }

    def "error is not left on screen if hitting search again with successful result"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)
        toOffenderSearchPage()
        stubErrorResponseFromSearch(403)
        searchButton.click()
        at OffenderResultsPage
        messageDiv.isDisplayed()

        WireMock.reset()

        when:
        oauthApi.stubGetMyDetails(ITAG_USER)
        fixture.stubOffenderResultsPage(false)
        searchButton.click()

        then: "I am shown the Offender Search results page"
        at OffenderResultsPage

        and: "The results are displayed without error"
        rows.size() == 5
        !messageDiv.isDisplayed()
    }

    def "manual override - should stay on results page and display message bar"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)
        toOffenderResultsPage()

        when: "I click the save button"
        keyworkerApi.stubManualOverrideResponse()
        table['keyworker-select-A1178RS'] = '-2'
        saveButton.click()

        then: "I remain on the Offender results page and a success message bar is displayed"
        at OffenderResultsPage
        assert waitFor { messageBar.text() == 'Key workers successfully updated.' }
    }

    def stubEmptyOffenderResultsPage() {
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI, false)
        elite2api.stubEmptyOffenderSearchResponse(AgencyLocation.LEI)
    }

    def stubErrorResponseFromSearch(status) {
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI, false)
        elite2api.stubErrorWithMessage("/api/locations/description/${AgencyLocation.LEI.id}/inmates", status, "Something went wrong with the search")
    }

    def toOffenderSearchPage() {
        List<Location> locations = TestFixture.locationsForCaseload(ITAG_USER.workingCaseload)
        elite2api.stubGetMyLocations(locations)
        browser.page.manualAssignLink.click()
        at SearchForOffenderPage
    }

    def toOffenderResultsPage() {
        toOffenderSearchPage()
        fixture.stubOffenderResultsPage()
        searchButton.click()
        at OffenderResultsPage
    }

}
