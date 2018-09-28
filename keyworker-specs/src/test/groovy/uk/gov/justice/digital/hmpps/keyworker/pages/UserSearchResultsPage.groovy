package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class UserSearchResultsPage extends Page {


    static url = "/maintainRoles/results"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('User access management')
    }

    static content = {
        headingText { $('h1').text() }
        searchButton { $('#search-button') }
        nextPage (required: false){ $('#next-page') }
        previousPage (required: false){ $('#previous-page') }
        backLink { $('a.backlink')}
        roleSelect { $('#role-select')}
        nameFilter { $('#name-Filter')}
        messageBar(required: false) { $('div #messageBar')}
        rows (required: false) { $('table tbody tr') }
    }

}
