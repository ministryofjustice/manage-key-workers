package uk.gov.justice.digital.hmpps.keyworker.model

import geb.Browser
import uk.gov.justice.digital.hmpps.keyworker.mockapis.Elite2Api
import uk.gov.justice.digital.hmpps.keyworker.mockapis.KeyworkerApi
import uk.gov.justice.digital.hmpps.keyworker.mockapis.OauthApi
import uk.gov.justice.digital.hmpps.keyworker.pages.*

import static uk.gov.justice.digital.hmpps.keyworker.model.UserAccount.ITAG_USER

class TestFixture {

    Browser browser
    Elite2Api elite2Api
    OauthApi oauthApi
    KeyworkerApi keyworkerApi

    UserAccount currentUser
    List<Location> locations

    TestFixture(Browser browser, Elite2Api elite2Api, KeyworkerApi keyworkerApi, OauthApi oauthApi) {
        this.browser = browser
        this.elite2Api = elite2Api
        this.keyworkerApi = keyworkerApi
        this.oauthApi = oauthApi
    }

    def loginAs(UserAccount user) {
        loginAs(user, 1)
    }

    def loginAs(UserAccount user, int kwFrequency) {
        currentUser = user
        oauthApi.stubValidOAuthTokenRequest()
        browser.to LoginPage
        oauthApi.stubGetMyDetails currentUser
        elite2Api.stubGetMyCaseloads currentUser.caseloads

        oauthApi.stubGetMyRoles([[roleId: -1, roleCode: 'OMIC_ADMIN']])
        keyworkerApi.stubPrisonMigrationStatus(AgencyLocation.LEI, true, true, kwFrequency, true)

        browser.page.loginAs currentUser, 'password'
        browser.at KeyworkerManagementPage
    }

    def loginWithoutStaffRoles(UserAccount user) {
        currentUser = user
        oauthApi.stubValidOAuthTokenRequest()
        browser.to LoginPage
        oauthApi.stubGetMyDetails currentUser
        elite2Api.stubGetMyCaseloads currentUser.caseloads

        browser.page.loginAs currentUser, 'password'
        browser.at KeyworkerManagementPage
    }


    def toUnallocatedPage() {
        elite2Api.stubGetMyLocations(locationsForCaseload(currentUser.workingCaseload))
        keyworkerApi.stubUnallocatedResponse(AgencyLocation.LEI)
        elite2Api.stubOffenderAssessmentResponse(AgencyLocation.LEI)
        elite2Api.stubOffenderSentenceResponse(AgencyLocation.LEI)

        browser.page.autoAllocateLink.click()
        browser.at UnallocatedPage
    }

    def toUnallocatedPageNoData() {
        elite2Api.stubGetMyLocations(locationsForCaseload(currentUser.workingCaseload))
        keyworkerApi.stubEmptyListResponse("/key-worker/${AgencyLocation.LEI.id}/offenders/unallocated")
        elite2Api.stubOffenderAssessmentResponse(AgencyLocation.LEI)
        elite2Api.stubOffenderSentenceResponse(AgencyLocation.LEI)

        browser.page.autoAllocateLink.click()
        browser.at UnallocatedPage
    }

    def toAllocatedPage(boolean insufficientKeyworkers) {
        elite2Api.stubGetMyLocations(locationsForCaseload(currentUser.workingCaseload))
        insufficientKeyworkers ? keyworkerApi.stubStartAllocateFailureResponse(AgencyLocation.LEI)
                : keyworkerApi.stubStartAllocateResponse(AgencyLocation.LEI)
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI, insufficientKeyworkers)
        keyworkerApi.stubAutoAllocationsResponse(AgencyLocation.LEI)
        elite2Api.stubOffenderAssessmentResponse(AgencyLocation.LEI)
        elite2Api.stubOffenderSentenceResponse(AgencyLocation.LEI)
        keyworkerApi.stubKeyworkerDetailResponse(AgencyLocation.LEI, -2)
        keyworkerApi.stubKeyworkerDetailResponse(AgencyLocation.LEI, -3)
        keyworkerApi.stubKeyworkerDetailResponse(AgencyLocation.LEI, -4)
        keyworkerApi.stubKeyworkerDetailResponse(AgencyLocation.LEI, -5)
        keyworkerApi.stubError("/key-worker/-1/prison/LEI", 404) // staff id -1 doesnt exist

        browser.page.allocateButton.click()
    }

    def toKeyworkerDashboardPage() {
        browser.go('/manage-key-workers/key-worker-statistics')
    }

    def toKeyworkerProfilePage() {
        toKeyworkerSearchPage()
        keyworkerApi.stubKeyworkerSearchResponse(AgencyLocation.LEI)
        browser.page.keyworkerSearchButton.click()
        stubKeyworkerProfilePage()
        browser.page.testKeyworkerLink.click()
        assert browser.page instanceof KeyworkerProfilePage
    }

    def toKeyworkerSearchPage() {
        locations = locationsForCaseload(currentUser.workingCaseload)
        elite2Api.stubGetMyLocations(locations)
        browser.page.keyworkerProfileLink.click()
        browser.at SearchForKeyworkerPage
    }

    def toKeyWorkersProfilePage() {
        toKeyworkerSearchPage()

        browser.page.keyworkerSearchButton.click()
        browser.at KeyworkerResultsPage
        browser.page.testKeyworkerLink.click()
        browser.at KeyworkerProfilePage
    }

    def toManuallyAssignAndTransferPage() {
        locations = locationsForCaseload(currentUser.workingCaseload)
        elite2Api.stubGetMyLocations(locations)
        browser.page.manualAssignLink.click()
        browser.at SearchForOffenderPage
    }

    def stubKeyworkerProfilePage() {
        keyworkerApi.stubKeyworkerDetailResponse(AgencyLocation.LEI)
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI, false)
        keyworkerApi.stubAllocationsForKeyworkerResponse(AgencyLocation.LEI)
        elite2Api.stubOffenderAssessmentResponse(AgencyLocation.LEI)
        elite2Api.stubOffenderSentenceResponse()
        elite2Api.stubCaseNoteUsageResponse()
        keyworkerApi.stubKeyworkerStats()
    }

    def toOffenderSearchResultsPageWithoutInitialSearch() {
        browser.go '/manage-key-workers/offender-search/results'
    }

    def stubOffenderResultsPage(largeResult) {
        List<Location> locations = TestFixture.locationsForCaseload(ITAG_USER.workingCaseload)
        elite2Api.stubGetMyLocations(locations)
        keyworkerApi.stubAvailableKeyworkersResponse(AgencyLocation.LEI, false)
        largeResult == true ? elite2Api.stubOffenderSearchLargeResponse(AgencyLocation.LEI) : elite2Api.stubOffenderSearchResponse(AgencyLocation.LEI)
        elite2Api.stubOffenderAssessmentResponse(AgencyLocation.LEI)
        elite2Api.stubOffenderSentenceResponse(AgencyLocation.LEI)
        keyworkerApi.stubOffenderKeyworkerListResponse(AgencyLocation.LEI)
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
