package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerSettingsPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class KeyworkerSettingsSpecification extends GebReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "should allow an unsupported prison's default settings to be displayed"() {
        finish
    }

    def "should allow an unsupported prison to be migrated"() {
        setupRoles()
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, true)

        given: "I have navigated to the keyworker settings page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
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

        given: "I have navigated to the keyworker settings page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        keyworkerSettingsLink.click()

        when: "I select the save settings"
        keyworkerApi.stubManualMigrateResponse(AgencyLocation.LEI, false, false, 2, 4, 4)
        capacity.value('8')
        extCapacity.value('10')
        sequenceOptionOnceAFortnight.click()
        saveButton.click()

        then: "I remain on the key worker settings page"
        at KeyworkerSettingsPage
        messageBar.text() == 'key worker settings updated'
        capacity.value() == '8'
        extCapacity.value() == '10'
        sequenceFrequencySelect.value() == '2'
    }

    def "should detect validation errors"() {
        setupRoles()
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, false, false, 0, false)

        given: "I have navigated to the keyworker settings page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
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

    private void setupRoles() {
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES']
        def KeyworkerMigrationRole = [roleId: -1, roleCode: 'KW_MIGRATION']
        def roles = [MaintainAccessRolesRole, KeyworkerMigrationRole]
        elite2api.stubGetStaffAccessRoles(roles)
    }
}