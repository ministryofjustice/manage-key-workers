package uk.gov.justice.digital.hmpps.keyworker.specs


import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.LoginPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class LoginSpecification extends GebReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "The login page is present"() {
        given:
        oauthApi.stubAuthorizeRequest()

        when: 'I go to the login page'
        to LoginPage

        then: 'The Login page is displayed'
        at LoginPage
    }

    def "Default URI redirects to Login page"() {
        given:
        oauthApi.stubAuthorizeRequest()

        when: "I go to the website URL using an empty path"
        go '/'

        then: 'The Login page is displayed'
        at LoginPage
    }

    def "Log in with valid credentials"() {
        given: 'I am on the Login page'
        elite2api.stubGetStaffAccessRoles([[roleId: -1, roleCode: 'OMIC_ADMIN']])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 1, true)
        oauthApi.stubValidOAuthTokenRequest()
        to LoginPage

        elite2api.stubGetMyDetails ITAG_USER
        elite2api.stubGetMyCaseloads(ITAG_USER.caseloads)

        when: "I login using valid credentials"
        loginAs ITAG_USER, 'password'

        then: 'My credentials are accepted and I am shown the Key worker management page'
        at KeyworkerManagementPage
        homeLink.size() == 1
        breadCrumbHomeLink.size() == 1
    }

    def "Log out"() {
        given: "I have logged in"
        fixture.loginAs ITAG_USER

        when: "I log out"
        oauthApi.stubLogout()
        header.logout()

        then: "I am returned to the Login page."
        at LoginPage
    }
}
