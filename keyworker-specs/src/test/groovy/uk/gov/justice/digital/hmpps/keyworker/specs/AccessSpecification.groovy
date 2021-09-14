package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.module.Select
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.TokenVerificationApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage
import uk.gov.justice.digital.hmpps.keyworker.pages.OffenderResultsPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class AccessSpecification extends BrowserReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    @Rule
    TokenVerificationApi tokenVerificationApi = new TokenVerificationApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi, tokenVerificationApi)
// see allocateKeyWorker."should not show if user is not a keyworker admin"
//     def "should not see the auto allocation link when the current user is not a key worker admin"() {
//         oauthApi.stubGetMyRoles([])
//         keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 1, true)
//
//         given: "I am logged in"
//         fixture.loginWithoutStaffRoles(ITAG_USER)
//
//         when: "I am on the key worker landing page"
//
//         then: "I should not see the auto allocation link"
//         assert autoAllocateLink.displayed == false
//     }
// see allocateKeyWorker."should show if prison is migrated, allows auto and user has permissions"
//     def "should see the auto allocation link when the prison has been migrated and the current user is a key worker admin"() {
//         def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
//         def roles = [keyWorkerAdminRole]
//         oauthApi.stubGetMyRoles(roles)
//         keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 1, true)
//
//         given: "I am logged in"
//         fixture.loginWithoutStaffRoles(ITAG_USER)
//
//         when: "I am on the key worker page"
//
//         then: "I should not see the auto allocation link"
//         assert autoAllocateLink.displayed == true
//     }
//
// see allocateKeyWorker."should not show when prison is not migrated"
//     def "should not see auto allocation link if the prison has not been migrated regardless of role"() {
//         def keyWorkerAdminRole = [roleId: -1, roleCode: 'OMIC_ADMIN']
//         def roles = [keyWorkerAdminRole]
//         oauthApi.stubGetMyRoles(roles)
//         keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)
//
//         given: "I am logged in"
//         fixture.loginWithoutStaffRoles(ITAG_USER)
//
//         when: "I am on the key worker page"
//
//         then: "I should not see the auto allocation link"
//         assert autoAllocateLink.displayed == false
//     }

    def "should not see the edit profile and update buttons on the profile page when the current user is not a key worker admin"() {
        oauthApi.stubGetMyRoles([])
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
        oauthApi.stubGetMyRoles(roles)
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
        oauthApi.stubGetMyRoles([])
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
        oauthApi.stubGetMyRoles(roles)
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
        oauthApi.stubGetMyRoles([])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, 1, true)

        keyworkerApi.stubKeyworkerUpdate(AgencyLocation.LEI)
        fixture.stubKeyworkerProfilePage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)

        given: "I am logged in"
        fixture.loginWithoutStaffRoles(ITAG_USER)

        when: "and then try to navigate directly to the profile page"
        go "/key-worker/${ KeyworkerResultsPage.test_keyworker_staffId}/edit"

        then: "I should be redirected back to the landing page"
        at KeyworkerManagementPage
    }

    def "should not be able to navigate to the auto allocation page when the current user is not a key worker admin"(){
        oauthApi.stubGetMyRoles([])
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
        oauthApi.stubGetMyRoles([])
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
        oauthApi.stubGetMyRoles([])
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
        oauthApi.stubGetMyRoles([])
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
        oauthApi.stubGetMyRoles(roles)
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
