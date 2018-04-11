package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class KeyworkerEditConfirmPage extends Page {


    static url = "/profile/edit/confirm"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Status change')
    }

    static content = {
        headingText { $('h1').text() }
        status { $('#keyworker-status')}
        inactiveWarning (required: false) {$('#inactiveWarning')}
        allocationOptions { $('input', name: 'allocationOption') }
        saveButton(to: KeyworkerProfilePage) { $('#saveButton') }
        cancelButton(to: KeyworkerEditPage) { $('#cancelButton') }
    }

}
