package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class SearchForOffenderPage extends Page {

    static url = '/assignTransfer'

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Search for an offender'
    }

    static content = {
        headingText { $('h1').text() }
        searchField { $('#search-text') }
        searchButton(to: OffenderResultsPage, toWait: true) { $('button') }
        housingLocationSelect { $('#housing-location-select') }
        housingLocationOptions { $('#housing-location-select > option') }
    }
}
