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

    def "key worker profile is displayed correctly"() {
        given: "I am at the key worker profile page"
        fixture.loginAs(ITAG_USER)
        toKeyworkerProfilePage()

        when: "On the keyworker Profile page"

        then: "data should display as expected"
        status.text() == 'Active'
        rows.size() == 4
        //  use to provide screenshot - browser.report("Failure")
        allocationCount.text() == '4'
        keyworkerOptionsForTestOffender.size() == 4
        allocationStyleGreen.isDisplayed()
    }

    def "key worker edit profile is displayed correctly"() {
        when: "I am at the key worker profile page"
        toKeyworkerEditPage()

        then: "data should display as expected"
        at KeyworkerEditPage
        capacity.value() == '6'
        keyworkerStatusOptions.size() == 6
    }

    def "key worker edit confirm - INACTIVE - is displayed correctly"() {
        given: "I am at the key worker profile page"
        toKeyworkerEditPage()

        when: "inactive is selected and saved"
        keyworkerStatusOptions.find{ it.value() == "INACTIVE" }.click()
        saveChangesButton.click()

        then: "should go to edit confirm - inactive status should display as expected"
        browser.report("editconfirm")
        at KeyworkerEditConfirmPage
        status.text() == 'Inactive'
        inactiveWarning.isDisplayed()
    }

    def "key worker edit confirm - UNAVAILABLE - is displayed correctly"() {
        given: "I am at the key worker profile page"
        toKeyworkerEditPage()

        when: "unavailable is selected and saved"
        keyworkerStatusOptions.find{ it.value() == "UNAVAILABLE_ANNUAL_LEAVE" }.click()
        saveChangesButton.click()

        then: "should go to edit confirm - unavailable status should display as expected"
        at KeyworkerEditConfirmPage
        status.text() == 'Unavailable - annual leave'
        !inactiveWarning.isDisplayed()
    }

    def "key worker edit - saving active status"() {
        given: "I am at the key worker profile page"
        toKeyworkerEditPageWithInactiveStatus()
        keyworkerApi.stubKeyworkerUpdate(AgencyLocation.LEI)

        when: "active is selected and saved"
        keyworkerStatusOptions.find{ it.value() == "ACTIVE" }.click()
        stubKeyworkerProfilePage()
        saveChangesButton.click()

        then: "should return to keyworker Profile page"
        at KeyworkerProfilePage
        status.text() == 'Active'
    }

    def stubKeyworkerProfilePage() {
        keyworkerApi.stubKeyworkerDetailResponse(AgencyLocation.LEI)
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI)
        keyworkerApi.stubAllocationsForKeyworkerResponse(AgencyLocation.LEI)
        elite2api.stubOffenderAssessmentResponse(AgencyLocation.LEI)
        elite2api.stubOffenderSentenceResponse(AgencyLocation.LEI)
    }

    def toKeyworkerEditPage() {
        fixture.loginAs(ITAG_USER)
        fixture.toKeyworkerProfilePage()
        keyworkerEditButton.click()
        at KeyworkerEditPage
    }

    def toKeyworkerEditPageWithInactiveStatus() {
        fixture.loginAs(ITAG_USER)
        fixture.toKeyworkerSearchPage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)
        browser.page.keyworkerSearchButton.click()
        keyworkerApi.stubInactiveKeyworkerDetailResponse(AgencyLocation.LEI)
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI)
        keyworkerApi.stubEmptyListResponse("/key-worker/${KeyworkerResultsPage.test_keyworker_staffId}/prison/${AgencyLocation.LEI}/offenders")
        elite2api.stubOffenderAssessmentResponse(AgencyLocation.LEI)
        elite2api.stubOffenderSentenceResponse(AgencyLocation.LEI)
        browser.page.testKeyworkerLink.click()
        assert browser.page instanceof KeyworkerProfilePage
        keyworkerEditButton.click()
        at KeyworkerEditPage
    }

    def toKeyworkerProfilePage() {
        fixture.toKeyworkerSearchPage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)
        browser.page.keyworkerSearchButton.click()
        stubKeyworkerProfilePage()
        browser.page.testKeyworkerLink.click()
        assert browser.page instanceof KeyworkerProfilePage
    }


}
