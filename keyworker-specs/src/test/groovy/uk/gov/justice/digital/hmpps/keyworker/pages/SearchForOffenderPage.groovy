package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class SearchForOffenderPage extends Page {

    static url = '/offender-search'

    static at = {
        browser.currentUrl.contains(url)
        headingText == 'Search for an offender'
    }

    static content = {
        headingText { $('h1').text() }
        searchField { $('#search-text') }
        allocationStatusSelect { $('#allocation-status-select') }
        searchButton(to: OffenderResultsPage) { $('button') }
        housingLocationSelect { $('#housing-location-select') }
        housingLocationOptions { $('#housing-location-select > option') }
    }
}
