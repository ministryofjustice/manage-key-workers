package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class SearchForKeyworkerPage extends Page {

    static url = '/keyworker/search'

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Search for a key worker'
        keyworkerSearchButton.displayed
    }

    static content = {
        headingText { $('h1').text() }
        searchField { $('#search-text') }
        keyworkerSearchButton(to: KeyworkerResultsPage) { $('button') }
        firstKeyworkerLink(to: KeyworkerProfilePage) { $('#keyworker_profile_link') }
    }
}
