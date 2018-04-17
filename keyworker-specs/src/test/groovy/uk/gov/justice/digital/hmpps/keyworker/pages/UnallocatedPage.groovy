package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class UnallocatedPage extends Page {

    static url ="/unallocated"

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Offenders without key workers'
    }

    static content =  {
        headingText { $('h1.heading-large').text() }
        table { $('table') }
        rows { $('table tbody tr') }
        allocateButton { $('button') }
    }
}
