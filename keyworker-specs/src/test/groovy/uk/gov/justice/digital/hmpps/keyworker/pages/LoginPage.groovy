package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page
import uk.gov.justice.digital.hmpps.keyworker.modules.ErrorsModule

class LoginPage extends Page {

    static url = 'auth/login'

    static at = {
        title == 'Key worker'
        $("h1").text() == 'Login'
    }

    static content = {
        errors { module(ErrorsModule) }
    }

    void loginAs(user, String password) {
        $('form').username = user
        $('form').password = password

        def signInButton = $("button", type: 'submit')
        assert signInButton.text() == 'Sign in'

        signInButton.click()
    }

}
