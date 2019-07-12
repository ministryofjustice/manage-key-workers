package uk.gov.justice.digital.hmpps.keyworker.specs


import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.AdminUtilitiesPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerSettingsPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class AdminUtilitiesSpecification extends BrowserReportingSpec {
    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "should allow an unsupported prison to be migrated"() {
        setupRoles()
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the admin and utilities page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage
        keyworkerSettingsLink.click()

        when: "I select the save settings and migrate"
        keyworkerApi.stubAutoAllocateMigrateResponse(AgencyLocation.LEI, true, true, 0)
        saveButton.click()

        then: "I remain on the key worker settings page"
        at KeyworkerSettingsPage
        messageBar.isDisplayed()
        saveButton.text() == 'Save settings'
        statusDiv.text() =='Enabled'
    }

    def "should allow an migrated prison's key worker settings to be updated"() {
        setupRoles()
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, false)

        given: "I have navigated to the admin and utilities page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage
        keyworkerSettingsLink.click()

        when: "I select the save settings"
        keyworkerApi.stubManualMigrateResponse(AgencyLocation.LEI, false, false, 2, 4, 4)
        capacity.value('8')
        extCapacity.value('10')
        sequenceOptionOnceAFortnight.click()
        saveButton.click()

        then: "I remain on the key worker settings page"
        at KeyworkerSettingsPage
        messageBar.text() == 'Key worker settings updated'
        capacity.value() == '8'
        extCapacity.value() == '10'
        sequenceFrequencySelect.value() == '2'
    }

    def "should detect validation errors"() {
        setupRoles()
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, false)

        given: "I have navigated to the admin and utilities page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage
        keyworkerSettingsLink.click()

        when: "I enter non-numeric capacities"
        capacity.value('ert;"£$')
        extCapacity.value('xcv<>^&*')

        then: "values are ignored"
        capacity.value() == '3'
        extCapacity.value() == '6'

        when: "I enter incompatible capacities"
        capacity.value('6')
        extCapacity.value('5')
        saveButton.click()

        then: "I see a validation error"
        errorMessage.text() == 'Capacity Tier 2 must be equal to or greater than Capacity Tier 1'
    }

    def "should not see the auto allocation link when the current user is not a key worker admin"() {
        oauthApi.stubGetMyRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 1, true)

        given: "I logged in and go to the admin and utilities page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage

        when: "I am on the admin and utilities page"

        then: "I should not see the auto allocation link"
        assert !enableNewNomisLink.displayed
    }

    def "should see enable new nomis link if the user has the the MAINTAIN_ACCESS_ROLES_ADMIN role"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES_ADMIN']
        def roles = [keyWorkerAdminRole, MaintainAccessRolesRole]
        oauthApi.stubGetMyRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)

        given: "I logged in and go to the admin and utilities page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage

        when: "I am on the admin and utilities page"

        then: "I should see the enable new nomis link and not see the key worker settings link"
        assert enableNewNomisLink.displayed
        assert !keyworkerSettingsLink.displayed
    }

    def "should not see enable new nomis link if the user has the the MAINTAIN_ACCESS_ROLES role"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES']
        def roles = [keyWorkerAdminRole, MaintainAccessRolesRole]
        oauthApi.stubGetMyRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)

        given: "I logged in and go to the admin and utilities page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage

        when: "I am on the admin and utilities page"

        then: "I should not see the enable new nomis link and not see the key worker settings link"
        assert !enableNewNomisLink.displayed
    }

    def "should see keyworker settings link if the user has the the MAINTAIN_ACCESS_ROLES_ADMIN role"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES_ADMIN']
        def roles = [keyWorkerAdminRole, MaintainAccessRolesRole]
        oauthApi.stubGetMyRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)

        given: "I logged in and go to the admin and utilities page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage

        when: "I am on the admin and utilities page"

        then: "I should see the enable new nomis link and not see the key worker settings link"
        assert enableNewNomisLink.displayed
        assert !keyworkerSettingsLink.displayed
    }

    def "should see maintain auth users link if the user has the MAINTAIN_OAUTH_USERS role"() {
        def maintainAuthUsersRole = [roleId: -1, roleCode: 'MAINTAIN_OAUTH_USERS']
        oauthApi.stubGetMyRoles([maintainAuthUsersRole])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)

        given: "I logged in and go to the admin and utilities page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage

        when: "I am on the admin and utilities page"

        then: "I should see the maintain auth users link"
        assert maintainAuthUsersLink.displayed
    }

    def "should see maintain auth users link if the user has the group manager role"() {
        def maintainAuthUsersRole = [roleId: -1, roleCode: 'AUTH_GROUP_MANAGER']
        oauthApi.stubGetMyRoles([maintainAuthUsersRole])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)

        given: "I logged in and go to the admin and utilities page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage

        when: "I am on the admin and utilities page"

        then: "I should see the maintain auth users link"
        assert maintainAuthUsersLink.displayed
    }

    private void setupRoles() {
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES']
        def KeyworkerMigrationRole = [roleId: -1, roleCode: 'KW_MIGRATION']
        def roles = [MaintainAccessRolesRole, KeyworkerMigrationRole]
        oauthApi.stubGetMyRoles(roles)
    }
}
