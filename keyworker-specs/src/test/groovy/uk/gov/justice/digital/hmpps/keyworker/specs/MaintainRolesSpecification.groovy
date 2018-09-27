package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerSettingsPage
import uk.gov.justice.digital.hmpps.keyworker.pages.UserSearchPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class MaintainRolesSpecification extends GebReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "should allow an unsupported prison's default settings to be displayed"() {
        finish
    }

    def "should show the user search screen"() {
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES']
        def KeyworkerMigrationRole = [roleId: -1, roleCode: 'KW_MIGRATION']
        def roles = [MaintainAccessRolesRole,KeyworkerMigrationRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Maintain roles - User search page"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "i click the maintain roles link"
        elite2api.stubGetRoles()
        maintainRolesLink.click()

        then: "the user search page is displayed"
        at UserSearchPage
        searchButton.text() == 'Search'
    }

    def "should collection of users after search"() {
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES']
        def KeyworkerMigrationRole = [roleId: -1, roleCode: 'KW_MIGRATION']
        def roles = [MaintainAccessRolesRole,KeyworkerMigrationRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Maintain roles - User search page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRoles()
        maintainRolesLink.click()

        when: "i perform a search"
        elite2api.stubUserSearch()


        then: "the user search results page is displayed"
        at UserSearchPage
        rows.size() == 6
        searchButton.text() == 'Search'
    }
}