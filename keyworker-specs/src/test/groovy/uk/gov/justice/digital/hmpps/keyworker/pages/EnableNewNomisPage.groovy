package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class EnableNewNomisPage extends Page {


    static url = "/give-nomis-access"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Give access to New NOMIS')
    }

    static content = {
        headingText { $('h1').text() }
        giveAccessButton { $('#giveAccessButton') }
        backLink { $('a.backlink')}
    }

}
