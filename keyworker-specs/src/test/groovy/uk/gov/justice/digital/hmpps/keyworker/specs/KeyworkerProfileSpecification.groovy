package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.*

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class KeyworkerProfileSpecification extends GebReportingSpec {

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi)

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
        keyworkerOptionsForTestOffender.size() == 5
        allocationStyleGreen.isDisplayed()
    }

    def "key worker edit profile is displayed correctly"() {
        when: "I am at the key worker profile page"
        toKeyworkerEditPage()

        then: "data should display as expected"
        at KeyworkerEditPage
        capacity.value() == '6'
        keyworkerStatusOptions.size() == 5
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

    def "key worker edit confirm - UNAVAILABLE_ANNUAL_LEAVE - is displayed correctly"() {
        given: "I am at the key worker profile page"
        toKeyworkerEditPage()

        when: "unavailable_annual_leave is selected and saved"
        keyworkerStatusOptions.find{ it.value() == "UNAVAILABLE_ANNUAL_LEAVE" }.click()
        saveChangesButton.click()

        then: "should go to edit confirm - UNAVAILABLE_ANNUAL_LEAVE status should display as expected"
        at KeyworkerEditConfirmPage
        status.text() == 'Unavailable - annual leave'
        annualLeaveDatePicker.isDisplayed()
    }

    def "key worker edit confirm - UNAVAILABLE_ANNUAL_LEAVE - return date is mandatory"() {
        given: "I am at the key worker profile page"
        toKeyworkerEditPage()
        keyworkerStatusOptions.find{ it.value() == "UNAVAILABLE_ANNUAL_LEAVE" }.click()
        saveChangesButton.click()
        at KeyworkerEditConfirmPage

        when: "behaviour is selected but no date"
        allocationOptions = 'REMOVE_ALLOCATIONS_NO_AUTO'
        saveButtonValidationError.click()

        then: "should remain on edit confirm - validation error displayed"
        at KeyworkerEditConfirmPage
        errorMessage.text() == 'Please choose a return date'
    }

    def "key worker edit - saving active status"() {
        given: "I am at the key worker profile page"
        toKeyworkerEditPageWithInactiveStatus()
        keyworkerApi.stubKeyworkerUpdate(AgencyLocation.LEI)

        when: "active is selected and saved"
        keyworkerStatusOptions.find{ it.value() == "ACTIVE" }.click()
        fixture.stubKeyworkerProfilePage()
        saveChangesButton.click()

        then: "should return to keyworker Profile page"
        at KeyworkerProfilePage
        status.text() == 'Active'
        messageBar.isDisplayed()
    }

    def "key worker edit - saved with no changes - doesn't display message bar"() {
        given: "I am at the key worker profile page"
        toKeyworkerEditPage()

        when: "save is selected without status change"
        keyworkerApi.stubKeyworkerUpdate(AgencyLocation.LEI)
        fixture.stubKeyworkerProfilePage()
        saveChangesButton.click()

        then: "should go to profile page - without an update message"
        at KeyworkerProfilePage
        status.text() == 'Active'
        !messageBar.isDisplayed()
    }

    def "key worker edit confirm - no allocations - should not display Prisoners removed message"() {
        given: "I am at the key worker profile page"
        toKeyworkerEditPageWithInactiveStatus()
        keyworkerStatusOptions.find{ it.value() == "UNAVAILABLE_LONG_TERM_ABSENCE" }.click()
        saveChangesButton.click()

        when: "unavailable is selected and saved"
        at KeyworkerEditConfirmPage
        allocationOptions = 'REMOVE_ALLOCATIONS_NO_AUTO'
        keyworkerApi.stubKeyworkerUpdate(AgencyLocation.LEI)
        fixture.stubKeyworkerProfilePage()
        saveButton.click()

        then: "should return to keyworker Profile page"
        at KeyworkerProfilePage
        messageBar.text() == 'Profile changed'
    }

    def "key worker edit confirm - allocations exist - should display Prisoners removed message"() {
        given: "I am at the key worker profile page"
        toKeyworkerEditPage()
        keyworkerStatusOptions.find{ it.value() == "UNAVAILABLE_LONG_TERM_ABSENCE" }.click()
        saveChangesButton.click()

        when: "unavailable is selected and saved"
        at KeyworkerEditConfirmPage
        allocationOptions = 'REMOVE_ALLOCATIONS_NO_AUTO'
        keyworkerApi.stubKeyworkerUpdate(AgencyLocation.LEI)
        fixture.stubKeyworkerProfilePage()
        saveButton.click()

        then: "should return to keyworker Profile page"
        at KeyworkerProfilePage
        messageBar.text() == 'Prisoners removed from key worker'
    }

    def toKeyworkerEditPage() {
        fixture.loginAs(ITAG_USER)
        toKeyworkerProfilePage()
        keyworkerEditButton.click()
        at KeyworkerEditPage
    }

    def toKeyworkerEditPageWithInactiveStatus() {
        fixture.loginAs(ITAG_USER)
        fixture.toKeyworkerSearchPage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)
        browser.page.keyworkerSearchButton.click()
        keyworkerApi.stubInactiveKeyworkerDetailResponse(AgencyLocation.LEI)
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI, false)
        // no allocations associated with key worker
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
        fixture.stubKeyworkerProfilePage()
        browser.page.testKeyworkerLink.click()
        assert browser.page instanceof KeyworkerProfilePage
    }


}
