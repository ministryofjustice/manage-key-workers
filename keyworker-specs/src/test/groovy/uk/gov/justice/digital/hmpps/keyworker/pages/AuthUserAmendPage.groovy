package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

public class AuthUserAmendPage extends Page {
    static url = "/admin-utilities/maintain-auth-users/"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Amend auth user: ')
    }

    static content = {
        headingText { $('h1').first().text() }
        amendButton { $('[data-qa="amend-button"]') }
        errorSummary(required: false) { $('#error-summary') }
    }

    void amendUser(String email) {
        $('form').email = email
        assert amendButton.text() == 'Amend'
        amendButton.click()
    }
}
