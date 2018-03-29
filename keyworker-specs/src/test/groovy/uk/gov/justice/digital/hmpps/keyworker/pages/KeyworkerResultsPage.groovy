package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class KeyworkerResultsPage extends Page {


    static url ="/keyworker/results"

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Key worker results'
    }

    static content =  {
        headingText { $('h1').text() }
    }
}
