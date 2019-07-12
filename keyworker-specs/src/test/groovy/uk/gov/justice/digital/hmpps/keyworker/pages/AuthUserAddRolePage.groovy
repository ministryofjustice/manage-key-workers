package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class AuthUserAddRolePage extends Page {
    static url = "/admin-utilities/maintain-auth-users/"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Add role: ')
    }

    static content = {
        headingText { $('h1').first().text() }
        addRole { $('[data-qa="add-button"]') }
        selectOption { $('#role') }
    }

    void choose(String role) {
        def option = selectOption { $("[data-qa='${role}_option']") }
        selectOption.find("option").find { it.text() == role }.click()
        addRole.click()
    }
}
