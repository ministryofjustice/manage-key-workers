package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class LoginPage extends Page {

    static url = 'auth/login'

    static at = {
        title == 'Key worker'
        $("h1").text() == 'Login'
    }

    static content = {
    }

    void loginAs(user) {
        $('form').username = user
        $('form').password = 'password123456'

        def signInButton = $("button", type: 'submit')
        assert signInButton.text() == 'Sign in'

        signInButton.click()
    }

}
