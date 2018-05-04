package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page
import uk.gov.justice.digital.hmpps.keyworker.modules.HeaderModule

class KeyworkerManagementPage extends Page {

    static url = "/"

    static at = {
        headingText == 'Manage key workers'
    }

    static content = {
        headingText { $('h1').text() }
        header(required: false) { module(HeaderModule) }
        autoAllocateLink(to: UnallocatedPage) { $('#auto_allocate_link') }
        manualAssignLink(to: SearchForOffenderPage) { $('#assign_transfer_link') }
        keyworkerProfileLink(to: SearchForKeyworkerPage) { $('#keyworker_profile_link') }
    }
}
