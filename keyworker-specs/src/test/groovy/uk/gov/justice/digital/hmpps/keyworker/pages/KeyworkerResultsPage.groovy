package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class KeyworkerResultsPage extends Page {


    static url = "/key-worker-search/results"

    static int test_keyworker_staffId = -3

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Search results'
    }

    static content = {
        headingText { $('h1').first().text() }
        table { $('table') }
        rows { $('table tbody tr') }
        testKeyworkerLink(to: KeyworkerProfilePage) { $('#key_worker_'+test_keyworker_staffId+'_link')}
    }

}
