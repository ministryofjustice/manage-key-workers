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
