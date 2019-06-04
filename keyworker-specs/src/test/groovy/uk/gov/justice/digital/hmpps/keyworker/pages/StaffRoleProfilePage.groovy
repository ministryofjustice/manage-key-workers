package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class StaffRoleProfilePage extends Page {


    static url = "/"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Staff roles')
    }

    static content = {
        headingText { $('h1').first().text() }
        removeButtons { $('.removeButton') }
        backLink { $('a.backlink')}
        addButton { $('#add-button')}
        messageBar(required: false) { $('div #messageBar')}
        caseload(required: false) { $('div #caseloadDiv')}
        removeButtonOMIC_ADMIN (required: false) { $('#remove-button-OMIC_ADMIN')}
        rows (required: false) { $('table tbody tr') }
    }

}
