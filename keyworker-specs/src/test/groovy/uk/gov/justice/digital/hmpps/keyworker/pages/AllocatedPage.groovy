package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class AllocatedPage extends Page {

    static at = {
        headingText == 'Key worker allocation'
    }

    static content =  {
        headingText { $('h1.heading-large').text() }
        table { $('table') }
        rows { $('table tbody tr') }
        confirmButton { $('#saveButton') }
        cancelButton { $('#cancelButton') }
        warning { $('div.error-message').text() }
    }
}
