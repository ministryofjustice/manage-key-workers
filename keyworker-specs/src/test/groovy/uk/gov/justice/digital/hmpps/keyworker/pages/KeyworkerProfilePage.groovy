package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class KeyworkerProfilePage extends Page {


    static url = "/profile"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Profile for')
    }

    static content = {
        headingText { $('h1').text() }
        rows { $('table tbody tr') }
    }

}
