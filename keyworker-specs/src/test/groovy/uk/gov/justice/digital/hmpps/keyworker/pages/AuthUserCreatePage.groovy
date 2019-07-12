package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page
import uk.gov.justice.digital.hmpps.keyworker.modules.ErrorsModule

public class AuthUserCreatePage extends Page {
    static url = "/admin-utilities/create-auth-user"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Create auth user')
    }

    static content = {
        headingText { $('h1').first().text() }
        createButton { $('#create-button') }
        errors { $('#error-summary').text() }
    }

    void createUser(String username, String email, String firstName, String lastName, String groupCode) {
        $('form').username = username
        $('form').email = email
        $('form').firstName = firstName
        $('form').lastName = lastName
        $('form').groupCode = groupCode
        assert createButton.text() == 'Create'
        createButton.click()
    }
}
