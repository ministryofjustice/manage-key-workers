package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class EnableNewNomisPage extends Page {


    static url = "/admin-utilities/give-nomis-access"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Give access to New NOMIS')
    }

    static content = {
        headingText { $('h1').first().text() }
        giveAccessButton { $('#giveAccessButton') }
        backLink { $('a.backlink')}
    }

}
