package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class AuthUserAddRolePage extends Page {
    static url = "/admin-utilities/maintain-auth-users/"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Add Role: ')
    }

    static content = {
        headingText { $('h1').text() }
        addRole { $('#add-button') }
        selectOption { $('#role') }
    }

    void choose(String role) {
        def option = selectOption { $("${role}_option") }
        selectOption.find("option").find { it.text() == role }.click()
        addRole.click()
    }
}
