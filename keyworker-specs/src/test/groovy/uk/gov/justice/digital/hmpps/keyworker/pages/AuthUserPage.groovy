package uk.gov.justice.digital.hmpps.keyworker.pages

public class AuthUserPage extends AuthUserSearchPage {
    static url = "/admin-utilities/maintain-auth-users/"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Auth user: ')
    }

    static content = {
        headingText { $('h1').first().text() }
        userRows(required: false) { $('[data-qa="user-details"] tbody tr') }
        roleRows(required: false) { $('[data-qa="user-roles"] tbody tr') }
        errorSummary(required: false) { $('#error-summary') }
        messageBar(required: false) { $('div #messageBar') }
        addButton { $('[data-qa="add-button"]')}
        enableButton { $('[data-qa="enable-button"]')}
        amendLink(required: false) { $('[data-qa="amend-link"]')}
    }
}
