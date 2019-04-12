package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.AuthUserPage
import uk.gov.justice.digital.hmpps.keyworker.pages.AuthUserSearchPage
import uk.gov.justice.digital.hmpps.keyworker.pages.AuthUserSearchResultsPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class MaintainAuthUsersSpecification extends GebReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "should allow a user search and display results"() {
        def MaintainAuthUsersRole = [roleId: -1, roleCode: 'MAINTAIN_OAUTH_USERS']
        oauthApi.stubGetMyRoles([MaintainAuthUsersRole])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Maintain Auth User search page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRoles()
        to AuthUserSearchPage

        when: "I perform a search by username"
        oauthApi.stubAuthUsernameSearch()
        search('sometext')

        then: "The auth user search results page is displayed"
        at AuthUserSearchResultsPage
        assert waitFor { rows.size() == 2 }
        user.value() == 'sometext'
        rows[1].find("td", 0).text() == 'Auth Adm'

        when: "I perform a search with no criteria"
        search('')

        then: "The error message is displayed"
        at AuthUserSearchResultsPage
        assert waitFor { errorSummary.text() == 'There is a problem\nEnter a username or email address' }
        !rows.displayed

        when: "I perform a search by email address"
        oauthApi.stubAuthEmailSearch()
        search('sometext@somewhere.com')

        then: "The auth user search results page is displayed"
        at AuthUserSearchResultsPage
        assert waitFor { rows.size() == 3 }
        rows[1].find("td", 0).text() == 'Auth Adm'
        rows[2].find("td", 0).text() == 'Auth Expired'

        and: 'The error message disappears'
        !errorSummary.displayed
    }

    def "should remove a role from a user"() {
        def MaintainAuthUsersRole = [roleId: -1, roleCode: 'MAINTAIN_OAUTH_USERS']
        oauthApi.stubGetMyRoles([MaintainAuthUsersRole])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Maintain Auth User search page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRoles()
        to AuthUserSearchPage

        when: "I perform a search by username"
        oauthApi.stubAuthUsernameSearch()
        search('sometext')

        then: "The auth user search results page is displayed"
        at AuthUserSearchResultsPage
        assert waitFor { rows.size() == 2 }
        user.value() == 'sometext'

        when: "I choose a user to edit"
        oauthApi.stubAuthUserRoles()
        rows[1].find("#edit-button-AUTH_ADM").click()

        then: "I can see the user details"
        at AuthUserPage
        userRows[1].find("td", 0).text() == 'Auth Adm'
        userRows[2].find("td", 0).text() == 'auth_test2@digital.justice.gov.uk'

        roleRows.size() == 3
        roleRows[1].find("td", 0).text() == 'Global Search'
        oauthApi.stubAuthRemoveRole()
        roleRows[1].find("#remove-button-GLOBAL_SEARCH").click()

        assert waitFor { messageBar.text() == 'Role Global Search removed' }
    }
}
