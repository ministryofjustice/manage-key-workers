package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.module.Select
import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage
import uk.gov.justice.digital.hmpps.keyworker.pages.OffenderResultsPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class AccessSpecification extends GebReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "should not see the auto allocation link when the current user is not a key worker admin"() {
        elite2api.stubGetStaffAccessRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 1, true)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "I am on the key worker landing page"

        then: "I should not see the auto allocation link"
        assert autoAllocateLink.displayed == false
        assert enableNewNomisLink.displayed == false
        assert adminSectionHeader.displayed == false
    }

    def "should see the auto allocation link when the prison has been migrated and the current user is a key worker admin"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def roles = [keyWorkerAdminRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 1, true)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "I am on the key worker page"

        then: "I should not see the auto allocation link"
        assert autoAllocateLink.displayed == true
        assert enableNewNomisLink.displayed == false
        assert adminSectionHeader.displayed == false
    }

    def "should not see auto allocation link if the prison has not been migrated regardless of role"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def roles = [keyWorkerAdminRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "I am on the key worker page"

        then: "I should not see the auto allocation link"
        assert autoAllocateLink.displayed == false
        assert adminSectionHeader.displayed == false
    }

    def "should see enable new nomis link if the user has the the MAINTAIN_ACCESS_ROLES role"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES']
        def roles = [keyWorkerAdminRole, MaintainAccessRolesRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "I am on the key worker management page"

        then: "I should see the enable new nomis link and not see the key worker settings link"
        assert enableNewNomisLink.displayed == true
        assert keyworkerSettingsLink.displayed == false
        assert adminSectionHeader.displayed == true
    }

    def "should see keyworker settings link if the user has the the MAINTAIN_ACCESS_ROLES role"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES']
        def roles = [keyWorkerAdminRole, MaintainAccessRolesRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "I am on the key worker management page"

        then: "I should see the enable new nomis link and not see the key worker settings link"
        assert enableNewNomisLink.displayed == true
        assert keyworkerSettingsLink.displayed == false
        assert adminSectionHeader.displayed == true
    }

    def "should not see the edit profile and update buttons on the profile page when the current user is not a key worker admin"() {
        elite2api.stubGetStaffAccessRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 2, true)

        fixture.stubKeyworkerProfilePage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "when I navigate through to a key workers profile page"
        fixture.toKeyWorkersProfilePage()

        then: "once on the profile page I should not see the edit profile and update allocations buttons"
        assert keyworkerEditButton.displayed == false
        assert updateKeyworkerAllocationButton.displayed == false
    }

    def "should see the edit profile and update buttons on the profile page when not a key worker admin"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def roles = [keyWorkerAdminRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 2, true)

        fixture.stubKeyworkerProfilePage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "when navigate through to a key workers profile page"
        fixture.toKeyWorkersProfilePage()

        then: "once on the profile page I should see the edit profile and update allocations buttons"
        assert keyworkerEditButton.displayed == true
        assert updateKeyworkerAllocationButton.displayed == true
    }

    def "the allocate to new key worker drop down should be disabled on the profile page when not a key worker admin"() {
        elite2api.stubGetStaffAccessRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 1, true)

        fixture.stubKeyworkerProfilePage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "when navigate through to a key workers profile page"
        fixture.toKeyWorkersProfilePage()

        then: "once on the profile page the drop down should be disabled"
        assert keyworkerSelectForTestOffender.module(Select).disabled == true
    }

    def "the allocate to new key worker drop down should not be disabled on the profile page when not a key worker admin"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def roles = [keyWorkerAdminRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 1, true)

        fixture.stubKeyworkerProfilePage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "when navigate through to a key workers profile page"
        fixture.toKeyWorkersProfilePage()

        then: "once on the profile page and the drop down should not be disabled"
        assert keyworkerSelectForTestOffender.module(Select).disabled == false
    }

    def "should not be able to navigate to a key workers profile when the current user is not a key worker admin"() {
        elite2api.stubGetStaffAccessRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 1, true)

        keyworkerApi.stubKeyworkerUpdate(AgencyLocation.LEI)
        fixture.stubKeyworkerProfilePage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "and then try to navigate directly to the profile page"
        go "/keyworker/${ KeyworkerResultsPage.test_keyworker_staffId}/edit"

        then: "I should be redirected back to the landing page"
        at KeyworkerManagementPage
    }

    def "should not be able to navigate to the auto allocation page when the current user is not a key worker admin"(){
        elite2api.stubGetStaffAccessRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 1, true)
        keyworkerApi.stubAllocationsForKeyworkerResponse(AgencyLocation.LEI)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "and then try to navigate directly to the auto allocation page"
        go "/unallocated"

        then: "I should be redirected back to the landing page"
        at KeyworkerManagementPage
    }

    def "should not be able to navigate to the provisional allocation page when the current user is not a key worker admin"(){
        elite2api.stubGetStaffAccessRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 2, true)
        keyworkerApi.stubAllocationsForKeyworkerResponse(AgencyLocation.LEI)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "and then try to navigate directly to the auto allocation page"
        go "/unallocated/provisional-allocation"

        then: "I should be redirected back to the landing page"
        at KeyworkerManagementPage
    }

    def "the allocate to new key worker drop down should be disabled on the manual allocations page when the current user is not a key worker admin"() {
        elite2api.stubGetStaffAccessRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 2, true)

        fixture.stubKeyworkerProfilePage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)
        fixture.stubOffenderResultsPage()

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "when navigate through to a key workers profile page"
        fixture.toManuallyAssignAndTransferPage()
        searchButton.click()

        then: "once on the profile page the drop down should be disabled"
        at OffenderResultsPage
        assert keyworkerSelectForTestOffender.module(Select).disabled == true
    }

    def "the confirm and cancel buttons should be hidden on the manual allocations page when the current user is not a key worker admin"() {
        elite2api.stubGetStaffAccessRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 2, true)

        fixture.stubKeyworkerProfilePage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)
        fixture.stubOffenderResultsPage()

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "when navigate through to a key workers profile page"
        fixture.toManuallyAssignAndTransferPage()
        searchButton.click()

        then: "once on the profile page the drop down should be disabled"
        at OffenderResultsPage
        assert saveButton.displayed == false
        assert cancelButton.displayed == false
    }

    def "the confirm and cancel buttons should not hidden on the manual allocations page when the current user is key worker admin"() {
        def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
        def roles = [keyWorkerAdminRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 1, true)

        fixture.stubKeyworkerProfilePage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)
        fixture.stubOffenderResultsPage()

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "when navigate through to a key workers profile page"
        fixture.toManuallyAssignAndTransferPage()
        searchButton.click()

        then: "once on the profile page the drop down should be disabled"
        at OffenderResultsPage
        assert saveButton.displayed == true
        assert saveButton.displayed == true
    }
}