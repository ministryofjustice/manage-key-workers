package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import groovy.mock.interceptor.Ignore
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
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
        elite2api.stubUserSearch(AgencyLocation.LEI)
        searchButton.click()

        then: "the user search results page is displayed"
        at UserSearchResultsPage
        rows.size() == 6
        searchButton.text() == 'Search'
        roleSelect.find('option').size() == 7
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
        elite2api.stubUserSearch(AgencyLocation.LEI, 0);
        searchButton.click()

        then: "the user search results page is displayed"
        at UserSearchResultsPage
        rows.size() == 3
        nextPage.text() == "Next\n2 of 3"
        !previousPage.isDisplayed()
        rows[0].find("td",1).text() == 'user0'

        and: "i click on the next page link"
        elite2api.stubUserSearch(AgencyLocation.LEI, 1);
        nextPage.click()

        then:
        at UserSearchResultsPage
        rows.size() == 3
        nextPage.text() == "Next\n3 of 3"
        previousPage.text() == "Previous\n1 of 3"
        rows[0].find("td",1).text() == 'user1'

        and: "i click on the next page link"
        elite2api.stubUserSearch(AgencyLocation.LEI, 2);
        nextPage.click()

        then:
        at UserSearchResultsPage
        rows.size() == 3
        !nextPage.isDisplayed()
        previousPage.text() == "Previous\n2 of 3"
        rows[0].find("td",1).text() == 'user2'

        and: "i click on the previous page link"
        elite2api.stubUserSearch(AgencyLocation.LEI, 1);
        previousPage.click()

        then:
        at UserSearchResultsPage
        rows.size() == 3
        previousPage.text() == "Previous\n1 of 3"

        and: "i click on the previous page link"
        elite2api.stubUserSearch(AgencyLocation.LEI, 0);
        previousPage.click()

        then: "i'm back to the first page"
        at UserSearchResultsPage
        rows.size() == 3
        nextPage.text() == "Next\n2 of 3"
        !previousPage.isDisplayed()
        rows[0].find("td",1).text() == 'user0'

    }

    /*
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
        elite2api.stubUserSearch(AgencyLocation.LEI, 0);
        searchButton.click()
        at UserSearchResultsPage
        searchButton.click()

        then: "the user profile page is displayed"
        at UserSearchResultsPage
        rows.size() == 3
        nextPage.text() == "Next\n2 of 3"
        !previousPage.isDisplayed()
        rows[0].find("td",1).text() == 'user0'

        and: "i click on the next page link"
        elite2api.stubUserSearch(AgencyLocation.LEI, 1);
        nextPage.click()

        then:
        at UserSearchResultsPage
        rows.size() == 3
        nextPage.text() == "Next\n3 of 3"
        previousPage.text() == "Previous\n1 of 3"
        rows[0].find("td",1).text() == 'user1'

        and: "i click on the next page link"
        elite2api.stubUserSearch(AgencyLocation.LEI, 2);
        nextPage.click()

        then:
        at UserSearchResultsPage
        rows.size() == 3
        !nextPage.isDisplayed()
        previousPage.text() == "Previous\n2 of 3"
        rows[0].find("td",1).text() == 'user2'

        and: "i click on the previous page link"
        elite2api.stubUserSearch(AgencyLocation.LEI, 1);
        previousPage.click()

        then:
        at UserSearchResultsPage
        rows.size() == 3
        previousPage.text() == "Previous\n1 of 3"

        and: "i click on the previous page link"
        elite2api.stubUserSearch(AgencyLocation.LEI, 0);
        previousPage.click()

        then: "i'm back to the first page"
        at UserSearchResultsPage
        rows.size() == 3
        nextPage.text() == "Next\n2 of 3"
        !previousPage.isDisplayed()
        rows[0].find("td",1).text() == 'user0'

    }*/
}