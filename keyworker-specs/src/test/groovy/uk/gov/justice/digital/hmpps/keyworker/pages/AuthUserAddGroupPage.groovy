package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class AuthUserAddGroupPage extends Page {
    static url = "/admin-utilities/maintain-auth-users/"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Add group: ')
    }

    static content = {
        headingText { $('h1').first().text() }
        addGroup { $('[data-qa="add-button"]') }
        selectOption { $('#group') }
    }

    void choose(String group) {
        def option = selectOption { $("[data-qa='${group}_option']") }
        selectOption.find("option").find { it.text() == group }.click()
        addGroup.click()
    }
}
