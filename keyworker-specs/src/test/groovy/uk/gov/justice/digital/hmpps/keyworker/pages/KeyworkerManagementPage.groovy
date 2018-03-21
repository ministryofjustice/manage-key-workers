package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page
import uk.gov.justice.digital.hmpps.keyworker.modules.HeaderModule

class KeyworkerManagementPage extends Page {

    static url = "/"

    static at = { headingText == 'Key worker management' }

    static content = {
        headingText(wait: true) { $('h1').text() }
        header(required: false) { module(HeaderModule) }
    }
}
