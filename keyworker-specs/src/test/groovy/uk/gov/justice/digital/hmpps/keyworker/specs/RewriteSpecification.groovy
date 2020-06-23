package uk.gov.justice.digital.hmpps.keyworker.specs


import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.Location
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerProfilePage
import uk.gov.justice.digital.hmpps.keyworker.pages.SearchForOffenderPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class RewriteSpecification extends BrowserReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "should route to the home page using old URL"() {
        oauthApi.stubGetMyRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 1, true)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "I go directly to the old profile page"
        browser.go("/manage-key-workers")

        then: "I should see the new profile page"
        at KeyworkerManagementPage
    }

    def "should route to the offender search page using old URL"() {
        oauthApi.stubGetMyRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 1, true)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "I go directly to the old offender search page"
        List<Location> locations = TestFixture.locationsForCaseload(ITAG_USER.workingCaseload)
        elite2api.stubGetMyLocations(locations)
        browser.go("/manage-key-workers/offender-search")

        then: "I should see the new offender search page"
        at SearchForOffenderPage
    }

    def "should route to edit keyworker using old URL"() {
        oauthApi.stubGetMyRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 1, true)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "I go directly to the edit keyworker page"
        toKeyworkerProfilePage()
        String keyworker = driver.currentUrl.substring(driver.currentUrl.lastIndexOf('/') + 1, driver.currentUrl.length())
        browser.go("/manage-key-workers/key-worker/$keyworker")

        then: "I should see keyworker profile page"
        at KeyworkerProfilePage
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
