package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class AllocatedPage extends Page {

    static at = {
        headingText == 'Suggested key worker allocation'
    }

    static content =  {
        headingText { $('h1').first().text() }
        table { $('table') }
        rows { $('table tbody tr') }
        confirmButton { $('.button-save') }
        cancelButton { $('.button-cancel') }
        warning { $('div.error-message').text() }
    }
}
