package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page
import uk.gov.justice.digital.hmpps.keyworker.modules.HeaderModule

class KeyworkerManagementPage extends Page {

    static url = "/"

    static at = {
        headingText == 'Manage key workers'
        manualAssignLink.displayed
        keyworkerProfileLink.displayed
    }

    static content = {
        headingText { $('h1').first().text() }
        header(required: false) { module(HeaderModule) }
        autoAllocateLink(required: false, to: UnallocatedPage) { $('#auto_allocate_link') }
        manualAssignLink(to: SearchForOffenderPage) { $('#assign_transfer_link') }
        keyworkerProfileLink(to: SearchForKeyworkerPage) { $('#keyworker_profile_link') }
        messageBar(required: false) { $('div #messageBar')}
        homeLink { $('a.link', href: 'http://localhost:3000/') }
        breadCrumbHomeLink { $('[data-qa="breadcrumb-home-page-link"]', href: 'http://localhost:3000/') }
    }
}
