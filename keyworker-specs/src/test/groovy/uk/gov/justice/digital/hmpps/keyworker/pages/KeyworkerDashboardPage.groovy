package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page
import uk.gov.justice.digital.hmpps.keyworker.modules.HeaderModule

class KeyworkerDashboardPage extends Page {
    static url = "/manage-key-workers/key-worker-statistics"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Key worker statistics')
        keyworkerStats != null
    }

    static content = {
        headingText { $('h1').text() }
        header(required: false) { module(HeaderModule) }

        durationInput { $('form input') }
        periodSelect { $('form select') }
        formSubmit { $('form button') }
        keyworkerStats { $("[data-qa='percentagePrisonersWithKeyworker-value']")}
        numberOfActiveKeyworkers { $("[data-qa='numberOfActiveKeyworkers-value']").text() }
        numberKeyWorkerSessions { $("[data-qa='numberKeyWorkerSessions-value']").text() }
        percentagePrisonersWithKeyworker { $("[data-qa='percentagePrisonersWithKeyworker-value']").text() }
        numProjectedKeyworkerSessions { $("[data-qa='numProjectedKeyworkerSessions-value']").text() }
        complianceRate { $("[data-qa='complianceRate-value']").text() }
        avgNumDaysFromReceptionToAllocationDays { $("[data-qa='avgNumDaysFromReceptionToAllocationDays-value']").text() }
        avgNumDaysFromReceptionToKeyWorkingSession { $("[data-qa='avgNumDaysFromReceptionToKeyWorkingSession-value']").text() }
        prisonerToKeyworkerRation {  $("[data-qa='prisonerToKeyworkerRation-value']").text() }

    }

    def fetchStatsFor(Integer duration, String period) {
        durationInput = duration
        periodSelect = period
        formSubmit.click()
    }
}
