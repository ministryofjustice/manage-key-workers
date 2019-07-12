package uk.gov.justice.digital.hmpps.keyworker.specs

import com.github.tomakehurst.wiremock.client.WireMock
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.*
import wiremock.org.apache.commons.lang3.RandomStringUtils

import static com.github.tomakehurst.wiremock.client.WireMock.urlPathEqualTo
import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class MaintainAuthUsersSpecification extends BrowserReportingSpec {

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

    def "should add and remove a role from a user"() {
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

        oauthApi.stubAuthAllRoles()

        when: 'I navigate to the add role page'
        addButton.click()

        at AuthUserAddRolePage

        then: 'I am on the add role page'
        assert waitFor { headingText == 'Add role: Auth Adm' }
        oauthApi.stubAuthAddRole()

        when: 'I select to add the vary role to the user'
        choose('Licence Vary')

        then: 'I receive a role added message'
        at AuthUserPage
        assert waitFor { messageBar.text() == 'Role Licence Vary added' }

        oauthApi.stubAuthRemoveRole()
        roleRows[1].find("[data-qa='remove-button-GLOBAL_SEARCH']").click()

        assert waitFor { messageBar.text() == 'Role Global Search removed' }
    }

    def "should create a user"() {
        def MaintainAuthUsersRole = [roleId: -1, roleCode: 'MAINTAIN_OAUTH_USERS']
        oauthApi.stubGetMyRoles([MaintainAuthUsersRole])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Create Auth User page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRoles()
        oauthApi.stubAuthAllGroups()
        to AuthUserCreatePage

        when: "I create a user"
        createUser('user', 'email@joe', 'first', 'last', '--')

        then: "I am shown validation errors"
        at AuthUserCreatePage
        waitFor { errors == 'There is a problem\nUsername must be 6 characters or more\nEnter an email address in the correct format, like first.last@justice.gov.uk'}

        when: "I have another go at creating a user"
        def username = RandomStringUtils.randomAlphanumeric(6)
        def email = "${RandomStringUtils.randomAlphanumeric(6)}.noone@justice.gov.uk"

        oauthApi.stubAuthCreateUser()
        oauthApi.stubAuthUsernameSearch()
        oauthApi.stubAuthUserRoles()
        createUser(username, email, 'first', 'last', '--')

        then: "My user is created"
        at AuthUserPage

        userRows[1].find("td", 0).text() == 'Auth Adm'
        userRows[2].find("td", 0).text() == 'auth_test2@digital.justice.gov.uk'

        oauthApi.verify(WireMock.getRequestedFor(urlPathEqualTo("/auth/api/authuser/$username")));
    }

    def "should create a user and assign to a group"() {
        def MaintainAuthUsersRole = [roleId: -1, roleCode: 'AUTH_GROUP_MANAGER']
        oauthApi.stubGetMyRoles([MaintainAuthUsersRole])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Create Auth User page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRoles()
        oauthApi.stubAuthAllGroups()
        to AuthUserCreatePage

        when: "I create a user"
        createUser('userdwdw', 'email@digital.justice.gov.uk', 'first', 'last', '--')

        then: "I am shown validation errors"
        at AuthUserCreatePage
        waitFor { errors == 'There is a problem\nSelect a group'}

        when: "I have another go at creating a user"
        def username = RandomStringUtils.randomAlphanumeric(6)
        def email = "${RandomStringUtils.randomAlphanumeric(6)}.noone@justice.gov.uk"

        oauthApi.stubAuthCreateUser()
        oauthApi.stubAuthUsernameSearch()
        oauthApi.stubAuthUserRoles()
        createUser(username, email, 'first', 'last', 'GROUP_1')

        then: "My user is created"
        at AuthUserPage

        userRows[1].find("td", 0).text() == 'Auth Adm'
        userRows[2].find("td", 0).text() == 'auth_test2@digital.justice.gov.uk'

        oauthApi.verify(WireMock.getRequestedFor(urlPathEqualTo("/auth/api/authuser/$username")));
    }

    def "should enable and disable a user"() {
        def MaintainAuthUsersRole = [roleId: -1, roleCode: 'MAINTAIN_OAUTH_USERS']
        oauthApi.stubGetMyRoles([MaintainAuthUsersRole])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Maintain Auth User search page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRoles()
        oauthApi.stubAuthUsernameSearch()
        oauthApi.stubAuthUserRoles()

        when:
        browser.go('/admin-utilities/maintain-auth-users/AUTH_TEST')
        at AuthUserPage
        userRows[4].find("td", 0).text() == 'Yes'
        oauthApi.stubAuthUserDisable()
        oauthApi.stubAuthUsernameSearch(false)
        enableButton.click()

        then:
        at AuthUserPage
        assert waitFor { messageBar.text() == 'User Auth Adm disabled' }

        userRows[4].find("td", 0).text() == 'No'
        oauthApi.stubAuthUserEnable()
        enableButton.click()

        assert waitFor { messageBar.text() == 'User Auth Adm enabled' }
    }

    def "should amend a user"() {
        def MaintainAuthUsersRole = [roleId: -1, roleCode: 'MAINTAIN_OAUTH_USERS']
        oauthApi.stubGetMyRoles([MaintainAuthUsersRole])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the Maintain Auth User search page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        elite2api.stubGetRoles()
        oauthApi.stubAuthUsernameSearch()
        oauthApi.stubAuthUserRoles()

        when:
        browser.go('/admin-utilities/maintain-auth-users/AUTH_TEST')
        at AuthUserPage
        userRows[4].find("td", 0).text() == 'Yes'
        amendLink.click()

        then:
        at AuthUserAmendPage

        when: "I enter an invalid email address"
        amendUser('invalid_email@somewhere')

        then: "The error message is displayed"
        at AuthUserAmendPage
        assert waitFor { errorSummary.text() == 'There is a problem\nEnter an email address in the correct format, like first.last@justice.gov.uk' }

        when: "I enter a new email address"
        oauthApi.stubAuthUsernameAmend()
        amendUser('some.where@a.place.com')

        then: "The email address is amended and user is taken back to the user page"
        at AuthUserPage
        assert waitFor { messageBar.text() == 'User email amended' }
    }
}
