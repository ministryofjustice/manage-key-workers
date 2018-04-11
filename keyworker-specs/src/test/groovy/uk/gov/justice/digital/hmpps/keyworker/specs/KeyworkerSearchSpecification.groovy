package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.Location
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerEditConfirmPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerEditPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerProfilePage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage
import uk.gov.justice.digital.hmpps.keyworker.pages.SearchForKeyworkerPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class KeyworkerSearchSpecification extends GebReportingSpec {

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi)

    def "key worker search"() {
        given: "I have logged in"
        fixture.loginAs(ITAG_USER)

        List<Location> locations = TestFixture.locationsForCaseload(ITAG_USER.workingCaseload)

        elite2api.stubGetMyLocations(locations)

        when: "I choose the key worker profile link"
        keyworkerProfileLink.click()

        then: "I am shown the key worker Search page"
        at SearchForKeyworkerPage
    }

    def "Search for key worker returns no results"() {
        given: "I am at the Search for key worker page"
        fixture.loginAs(ITAG_USER)
        fixture.toKeyworkerSearchPage()

        and: "I enter a name that does not match any keyworker"
        searchField.value('Smydd')

        keyworkerApi.stubEmptyListResponse('/key-worker/LEI/members?nameFilter=Smydd')

        when: "I perform the search"
        keyworkerSearchButton.click()

        then: "There will be no key workers displayed on the 'Key worker search results' page"
        at KeyworkerResultsPage
    }

    def "Search for all key workers returns results"() {
        given: "I am at the Search for key worker page"
        fixture.loginAs(ITAG_USER)
        fixture.toKeyworkerSearchPage()

        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)

        when: "I perform the search"
        keyworkerSearchButton.click()

        then: "There will be key workers displayed on the 'Key worker search results' page"
        at KeyworkerResultsPage
        rows.size() == 5
    }
}
