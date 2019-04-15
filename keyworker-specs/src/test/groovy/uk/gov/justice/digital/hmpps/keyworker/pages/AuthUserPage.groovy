package uk.gov.justice.digital.hmpps.keyworker.pages

public class AuthUserPage extends AuthUserSearchPage {
    static url = "/admin-utilities/maintain-auth-users/"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Auth User: ')
    }

    static content = {
        headingText { $('h1').text() }
        userRows(required: false) { $('#user-details tbody tr') }
        roleRows(required: false) { $('#user-roles tbody tr') }
        errorSummary(required: false) { $('#error-summary') }
        messageBar(required: false) { $('div #messageBar') }
    }
}