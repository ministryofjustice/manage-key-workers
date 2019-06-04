package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class UserSearchResultsPage extends Page {


    static url = "/admin-utilities/maintain-roles/search-results"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Search for staff member')
    }

    static content = {
        headingText { $('h1').first().text() }
        searchButton { $('#search-button') }
        nextPage (required: false){ $('#next-page') }
        previousPage (required: false){ $('#previous-page') }
        backLink { $('a.backlink')}
        roleSelect { $('#role-select')}
        nameFilter { $('#name-Filter')}
        editButtonAPI_TEST_USER (required: false){ $('#edit-button-API_TEST_USER') }
        messageBar(required: false) { $('div #messageBar')}
        rows (required: false) { $('table tbody tr') }
    }

}
