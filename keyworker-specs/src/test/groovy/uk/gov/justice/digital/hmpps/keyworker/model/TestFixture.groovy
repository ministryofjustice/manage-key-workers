package uk.gov.justice.digital.hmpps.keyworker.model

import geb.Browser
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.LoginPage

class TestFixture {

    Browser browser
    Elite2Api elite2Api
    KeyworkerApi keyworkerApi

    UserAccount currentUser

    TestFixture(Browser browser, Elite2Api elite2Api, KeyworkerApi keyworkerApi) {
        this.browser = browser
        this.elite2Api = elite2Api
        this.keyworkerApi = keyworkerApi
    }

    def loginAs(UserAccount user) {
        this.currentUser = user

        browser.to LoginPage
        elite2Api.stubValidOAuthTokenRequest currentUser
        elite2Api.stubGetUsersMe currentUser
        elite2Api.stubGetUsersMeCaseloads currentUser
        browser.page.loginAs currentUser, 'password'

        browser.at KeyworkerManagementPage
    }
}
