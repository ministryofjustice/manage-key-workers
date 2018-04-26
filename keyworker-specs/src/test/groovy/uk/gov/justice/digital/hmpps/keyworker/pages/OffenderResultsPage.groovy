package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class OffenderResultsPage extends Page {


    static url ="/offender/results"

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Manually assign and transfer'
    }

    static content =  {
        headingText { $('h1.heading-large').text() }
        table { $('table') }
        rows (required: false) { $('table tbody tr') }
    }
}
