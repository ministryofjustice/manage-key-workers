package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class KeyworkerResultsPage extends Page {


    static url = "/keyworker/results"

    static int test_keyworker_staffId = -3

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Search for a key worker'
    }

    static content = {
        headingText { $('h1').text() }
        rows { $('table tbody tr') }
        testKeyworkerLink(to: KeyworkerProfilePage) { $('#key_worker_'+test_keyworker_staffId+'_link')}
    }

}
