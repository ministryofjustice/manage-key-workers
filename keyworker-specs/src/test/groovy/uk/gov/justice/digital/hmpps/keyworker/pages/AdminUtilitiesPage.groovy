package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class AdminUtilitiesPage extends Page {
    static url = "/admin-utilities"

    static at = {
        headingText == 'Admin and utilities'
    }

    static content = {
        headingText { $('h1').first().text() }
        keyworkerSettingsLink(required: false, to: KeyworkerSettingsPage) { $('#keyworker_settings_link') }
        maintainRolesLink(required: false, to: UserSearchPage) { $('#maintain_roles_link') }
        maintainAuthUsersLink(required: false, to: AuthUserSearchPage) { $('#maintain_auth_users_link') }
        messageBar(required: false) { $('div #messageBar')}
    }
}
