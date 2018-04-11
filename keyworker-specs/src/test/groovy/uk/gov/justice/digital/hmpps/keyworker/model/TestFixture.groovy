package uk.gov.justice.digital.hmpps.keyworker.model

import geb.Browser
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerManagementPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerProfilePage
import uk.gov.justice.digital.hmpps.keyworker.pages.LoginPage
import uk.gov.justice.digital.hmpps.keyworker.pages.SearchForKeyworkerPage
import uk.gov.justice.digital.hmpps.keyworker.pages.SearchForOffenderPage
import uk.gov.justice.digital.hmpps.keyworker.pages.KeyworkerResultsPage

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class TestFixture {

    Browser browser
    Elite2Api elite2Api
    KeyworkerApi keyworkerApi

    UserAccount currentUser
    List<Location> locations

    TestFixture(Browser browser, Elite2Api elite2Api, KeyworkerApi keyworkerApi) {
        this.browser = browser
        this.elite2Api = elite2Api
        this.keyworkerApi = keyworkerApi
    }

    def loginAs(UserAccount user) {
        currentUser = user

        browser.to LoginPage
        elite2Api.stubValidOAuthTokenRequest currentUser
        elite2Api.stubGetMyDetails currentUser
        elite2Api.stubGetMyCaseloads currentUser.caseloads
        browser.page.loginAs currentUser, 'password'

        browser.at KeyworkerManagementPage
    }

    def toManuallyAssignAndTransferPage() {
        locations = locationsForCaseload(currentUser.workingCaseload)
        elite2Api.stubGetMyLocations(locations)
        browser.page.manualAssignLink.click()
        assert browser.page instanceof SearchForOffenderPage
    }

    def toKeyworkerSearchPage() {
        locations = locationsForCaseload(currentUser.workingCaseload)
        elite2Api.stubGetMyLocations(locations)
        browser.page.keyworkerProfileLink.click()
        assert browser.page instanceof SearchForKeyworkerPage
    }

    static List<Location> locationsForCaseload(Caseload caseload) {
        def agencyLocations = caseload.locations

        List<Location> locations = agencyLocations.collect { Location.toLocation it }
        locations.addAll(agencyLocations.collectMany { agencyLocation ->
            AgencyInternalLocation
                    .childrenOf(agencyLocation)
                    .findAll { it.type == 'WING' }
                    .collect { Location.toLocation it }
        })
        locations
    }

}
