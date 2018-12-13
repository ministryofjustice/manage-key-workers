package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class KeyworkerEditPage extends Page {


    static url = "/edit"

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Edit profile'
    }

    static content = {
        headingText { $('h1').text() }
        capacity { $('#capacity')}
        keyworkerStatusOptions { $('#status-select option')}
        selectedOption { $('#status-select option:selected')}
        cancelButton(to: KeyworkerProfilePage) { $('.button-cancel') }
        saveChangesButton{ $('.button-save') }
        backLink { $('a.backlink')}
        parentPageLink { $("[data-qa='breadcrumb-parent-page-link']")}
    }
}
