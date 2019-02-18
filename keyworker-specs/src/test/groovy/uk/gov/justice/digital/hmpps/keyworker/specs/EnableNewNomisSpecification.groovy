package uk.gov.justice.digital.hmpps.keyworker.specs

import geb.spock.GebReportingSpec
import org.junit.Rule
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.model.AgencyLocation
import uk.gov.justice.digital.hmpps.keyworker.model.TestFixture
import uk.gov.justice.digital.hmpps.keyworker.pages.AdminUtilitiesPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class EnableNewNomisSpecification extends GebReportingSpec {

    @Rule
    OauthApi oauthApi = new OauthApi()

    @Rule
    Elite2Api elite2api = new Elite2Api()

    @Rule
    KeyworkerApi keyworkerApi = new KeyworkerApi()

    TestFixture fixture = new TestFixture(browser, elite2api, keyworkerApi, oauthApi)

    def "should allow current prison's new nomis access to be updated"() {
        def MaintainAccessRolesRole = [roleId: -1, roleCode: 'MAINTAIN_ACCESS_ROLES_ADMIN']
        def roles = [MaintainAccessRolesRole]
        elite2api.stubGetStaffAccessRoles(roles)
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, false, 0, true)

        given: "I logged in and navigated to the enable new nomis page"
        fixture.loginWithoutStaffRoles(ITAG_USER)
        to AdminUtilitiesPage
        enableNewNomisLink.click()

        when: "I select the give access button"
        elite2api.stubEnableNewNomisResponse(AgencyLocation.LEI)
        giveAccessButton.click()

        then: "I am returned to the admin utilities page"
        at AdminUtilitiesPage
        messageBar.text() == 'New NOMIS access updated'
    }
}