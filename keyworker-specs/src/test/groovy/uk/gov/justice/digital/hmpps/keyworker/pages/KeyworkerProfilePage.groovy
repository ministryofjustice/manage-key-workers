package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class KeyworkerProfilePage extends Page {


    static url = "/profile"

    static test_offender_Z0024ZZ = "Z0024ZZ"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Key worker:')
    }

    static content = {
        headingText { $('h1').text() }
        rows { $('table tbody tr') }
        status { $('#keyworker-status')}
        allocationCount { $('#allocationCount')}
        allocationStyleGreen (required: false) { $("div[class='numberCircleGreen']")}
        keyworkerOptionsForTestOffender { $('#keyworker-select-' + test_offender_Z0024ZZ + ' option')}
        keyworkerEditButton(to: KeyworkerEditPage) { $('#editProfileButton') }
        updateKeyworkerAllocationButton(to: KeyworkerManagementPage) { $('#updateAllocationButton') }
        messageBar(required: false) { $('div #messageBar')}
    }

}
