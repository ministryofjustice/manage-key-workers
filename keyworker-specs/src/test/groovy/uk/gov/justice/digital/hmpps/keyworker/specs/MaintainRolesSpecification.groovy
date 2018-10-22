package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.model.UserAccount
import uk.gov.justice.digital.hmpps.keyworker.pages.AddRolePage
import uk.gov.justice.digital.hmpps.keyworker.pages.StaffRoleProfilePage
import uk.gov.justice.digital.hmpps.keyworker.pages.UserSearchResultsPage

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


    def "should allow a user search and display results"() {
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
        elite2api.stubUserLocalAdministratorSearch(AgencyLocation.LEI)
        searchButton.click()

        then: "the user search results page is displayed"
        at UserSearchResultsPage
        rows.size() == 6
        searchButton.text() == 'Search'
        roleSelect.find('option').size() == 7
    }

    def "should allow an ADMIN user search and display results"() {
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES_ADMIN']
        def KeyworkerMigrationRole = [roleId: -1, roleCode: 'KW_MIGRATION']
        def roles = [MaintainAccessRolesRole,KeyworkerMigrationRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Maintain roles - User search page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRolesIncludingAdminRoles()
        maintainRolesLink.click()

        when: "i perform a search"
        elite2api.stubUserSearch(AgencyLocation.LEI, 0)
        searchButton.click()

        then: "the user search results page is displayed"
        at UserSearchResultsPage
        rows.size() == 3
        searchButton.text() == 'Search'
        roleSelect.find('option').size() == 9

        and:
        elite2api.stubGetUserDetails(UserAccount.API_TEST_USER)
        elite2api.stubGetNWEBAccessRolesForUserAndCaseloadForAdminUser(UserAccount.API_TEST_USER.username, true)
        editButtonAPI_TEST_USER.click()

        then:
        at StaffRoleProfilePage
    }

    def "should handle pagination"() {
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
        elite2api.stubUserLocalAdministratorSearch(AgencyLocation.LEI, 0)
        searchButton.click()

        then: "the user search results page is displayed"
        at UserSearchResultsPage
        rows.size() == 3
        nextPage.text() == "Next\n2 of 3"
        !previousPage.isDisplayed()
        rows[0].find("td",1).text() == 'user0'

        and: "i click on the next page link"
        elite2api.stubUserLocalAdministratorSearch(AgencyLocation.LEI, 1)
        nextPage.click()

        then:
        at UserSearchResultsPage
        rows.size() == 3
        nextPage.text() == "Next\n3 of 3"
        previousPage.text() == "Previous\n1 of 3"
        rows[0].find("td",1).text() == 'user1'

        and: "i click on the next page link"
        elite2api.stubUserLocalAdministratorSearch(AgencyLocation.LEI, 2)
        nextPage.click()

        then:
        at UserSearchResultsPage
        rows.size() == 3
        !nextPage.isDisplayed()
        previousPage.text() == "Previous\n2 of 3"
        rows[0].find("td",1).text() == 'user2'

        and: "i click on the previous page link"
        elite2api.stubUserLocalAdministratorSearch(AgencyLocation.LEI, 1)
        previousPage.click()

        then:
        at UserSearchResultsPage
        rows.size() == 3
        previousPage.text() == "Previous\n1 of 3"

        and: "i click on the previous page link"
        elite2api.stubUserLocalAdministratorSearch(AgencyLocation.LEI, 0)
        previousPage.click()

        then: "i'm back to the first page"
        at UserSearchResultsPage
        rows.size() == 3
        nextPage.text() == "Next\n2 of 3"
        !previousPage.isDisplayed()
        rows[0].find("td",1).text() == 'user0'

    }


    def "should display Staff Role profile and allow role removal"() {
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES']
        def KeyworkerMigrationRole = [roleId: -1, roleCode: 'KW_MIGRATION']
        def roles = [MaintainAccessRolesRole,KeyworkerMigrationRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Staff Profile page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRoles()
        maintainRolesLink.click()
        elite2api.stubUserLocalAdministratorSearch(AgencyLocation.LEI)
        searchButton.click()
        at UserSearchResultsPage
        elite2api.stubGetUserDetails(UserAccount.API_TEST_USER)
        elite2api.stubGetNWEBAccessRolesForUserAndCaseload(UserAccount.API_TEST_USER.username, true)
        editButtonAPI_TEST_USER.click()
        at StaffRoleProfilePage

        when: "I remove a role"
        elite2api.stubGetUserDetails(UserAccount.API_TEST_USER)
        elite2api.stubGetNWEBAccessRolesForUserAndCaseload(UserAccount.API_TEST_USER.username, false)
        elite2api.stubRemoveNWEBRole(UserAccount.API_TEST_USER.username, "OMIC_ADMIN")
        removeButtonOMIC_ADMIN.click()

        then: "The new role list is displayed"
        at StaffRoleProfilePage
        messageBar.isDisplayed()
        rows.size() == 1
    }

    def "should allow adding a new role"() {
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES']
        def KeyworkerMigrationRole = [roleId: -1, roleCode: 'KW_MIGRATION']
        def roles = [MaintainAccessRolesRole,KeyworkerMigrationRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Staff Profile page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRoles()
        maintainRolesLink.click()
        elite2api.stubUserLocalAdministratorSearch(AgencyLocation.LEI)
        searchButton.click()
        at UserSearchResultsPage
        elite2api.stubGetUserDetails(UserAccount.API_TEST_USER)
        elite2api.stubGetNWEBAccessRolesForUserAndCaseload(UserAccount.API_TEST_USER.username, true)
        editButtonAPI_TEST_USER.click()
        at StaffRoleProfilePage

        and: "I select add a role"
        elite2api.stubGetStaffAccessRoles(roles)
        addButton.click()

        when: "I select a new role and submit"
        at AddRolePage
        elite2api.stubGetUserDetails(UserAccount.API_TEST_USER)
        elite2api.stubGetNWEBAccessRolesForUserAndCaseload(UserAccount.API_TEST_USER.username, true)
        roleOptionUSER_ADMIN.click()
        elite2api.stubAddNWEBRole(UserAccount.API_TEST_USER.username, 'USER_ADMIN')
        addButton.click()

        then: "I am returned to the StaffRoleProfile page with an updated role list"
        at StaffRoleProfilePage
    }
}