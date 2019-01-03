package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

import static uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage.test_keyworker_staffId

public class OffenderResultsPage extends Page {

    static test_offender_Z0024ZZ = "Z0024ZZ"

    static url ="/manage-key-workers/offender-search/results"
    static keyworkerLinkText = "a[href=\'/manage-key-workers/key-worker/${test_keyworker_staffId}\']"

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Change key workers'
    }

    static content =  {
        headingText { $('h1').text() }
        table { $('table') }
        rows (required: false) { $('table tbody tr') }
        message (required: false) { $('.error-summary').text() }
        messageDiv (required: false) { $('.error-summary')}
        searchButton(to: OffenderResultsPage) { $('#searchButton') }
        saveButton(required: false) { $('.button-save') }
        cancelButton(required: false) { $('button-cancel')}
        messageBar(required: false) { $('div #messageBar')}
        keyworkerLink (required: false) { $(keyworkerLinkText)[1]} //2nd row
        keyworkerSelectForTestOffender { $('#keyworker-select-' + test_offender_Z0024ZZ )}
    }
}
