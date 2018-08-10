package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

import static uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage.test_keyworker_staffId

public class OffenderResultsPage extends Page {


    static url ="/offender/results"
    static keyworkerLinkText = "a[href=\'/keyworker/${test_keyworker_staffId}/profile\']"

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Change key workers'
    }

    static content =  {
        headingText { $('h1.heading-large').text() }
        table { $('table') }
        rows (required: false) { $('table tbody tr') }
        message (required: false) { $('.error-summary').text() }
        messageDiv (required: false) { $('.error-summary')}
        searchButton(to: OffenderResultsPage) { $('#searchButton') }
        saveButton { $('.button-save') }
        messageBar(required: false) { $('div #messageBar')}
        keyworkerLink (required: false) { $(keyworkerLinkText)[1]} //2nd row
    }
}
