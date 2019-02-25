package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page
import uk.gov.justice.digital.hmpps.keyworker.model.UserAccount
import uk.gov.justice.digital.hmpps.keyworker.modules.ErrorsModule

class LoginPage extends Page {

    static url = 'login'

    static at = {
        title == 'Prison-NOMIS'
        headingText == 'Sign in'
    }

    static content = {
        errors { module(ErrorsModule) }
        headingText { $('h1').text() }
        signInButton{ $("input", type: 'submit') }
    }

    void loginAs(UserAccount userAccount, String password) {

        $('form').username = userAccount.username
        $('form').password = password

        assert signInButton.value() == 'Sign in'

        signInButton.click()
    }

}
