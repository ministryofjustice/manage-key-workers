package uk.gov.justice.digital.hmpps.keyworker.pages;

import geb.Page

public class KeyworkerProfilePage extends Page {


    static url = "/manage-key-workers"

    static test_offender_Z0024ZZ = "Z0024ZZ"
    static moved_offender = "Z0018ZT"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Key worker:')
    }

    static content = {
        headingText { $('h1').first().text() }
        table { $('table') }
        rows { $('table tbody tr') }
        status { $('#keyworker-status')}
        allocationCount { $('#allocationCount')}
        allocationStyleGreen (required: false) { $("div[class='numberCircleGreen']")}
        keyworkerSelectForTestOffender { $('#keyworker-select-' + test_offender_Z0024ZZ )}
        keyworkerOptionsForTestOffender { $('#keyworker-select-' + test_offender_Z0024ZZ + ' option')}
        keyworkerMovedPrison { $('#keyworker-select-' + moved_offender + ' option')}
        keyworkerEditButton(required: false, to: KeyworkerEditPage) { $('#editProfileButton') }
        updateKeyworkerAllocationButton(required: false, to: KeyworkerManagementPage) { $('#updateAllocationButton') }
        messageBar(required: false) { $('div #messageBar')}
        backLink { $('a.backlink')}
        parentPageLink { $("[data-qa='breadcrumb-parent-page-link']")}
        stats {  $("[data-qa='keyworker-stat']") }
        statsHeading { $("[data-qa='keyworker-stat-heading']") }
    }


}
