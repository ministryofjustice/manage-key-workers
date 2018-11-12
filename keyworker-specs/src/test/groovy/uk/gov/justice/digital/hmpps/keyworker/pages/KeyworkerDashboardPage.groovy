package uk.gov.justice.digital.hmpps.keyworker.pages

import geb.Page

class KeyworkerDashboardPage extends Page {
    static url = "/keyworkerDashboard"

    static at = {
        browser.currentUrl.contains(url)
        headingText.contains('Key worker statistics')
    }

    static content = {
        headingText { $('h1').text() }
        numberOfActiveKeyworkers { $("[data-qa='numberOfActiveKeyworkers-value']").text() }
        numberKeyWorkerSessions { $("[data-qa='numberKeyWorkerSessions-value']").text() }
        percentagePrisonersWithKeyworker { $("[data-qa='percentagePrisonersWithKeyworker-value']").text() }
        numProjectedKeyworkerSessions { $("[data-qa='numProjectedKeyworkerSessions-value']").text() }
        complianceRate { $("[data-qa='complianceRate-value']").text() }
        avgNumDaysFromReceptionToAllocationDays { $("[data-qa='avgNumDaysFromReceptionToAllocationDays-value']").text() }
        avgNumDaysFromReceptionToKeyWorkingSession { $("[data-qa='avgNumDaysFromReceptionToKeyWorkingSession-value']").text() }
    }
}
