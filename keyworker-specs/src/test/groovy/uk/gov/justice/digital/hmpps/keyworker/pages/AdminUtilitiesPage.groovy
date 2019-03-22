package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class AdminUtilitiesPage extends Page {
    static url = "/admin-utilities"

    static at = {
        headingText == 'Admin and Utilities'
    }

    static content = {
        headingText { $('h1').text() }
        keyworkerSettingsLink(required: false, to: KeyworkerSettingsPage) { $('#keyworker_settings_link') }
        enableNewNomisLink(required: false, to: EnableNewNomisPage) { $('#enable_new_nomis_link') }
        maintainRolesLink(required: false, to: UserSearchPage) { $('#maintain_roles_link') }
        maintainAuthUsersLink(required: false, to: AuthUserSearchPage) { $('#maintain_auth_users_link') }
        messageBar(required: false) { $('div #messageBar')}
    }
}
