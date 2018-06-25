package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class OffenderResultsPage extends Page {


    static url ="/offender/results"

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
    }
}
