package uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses

import groovy.json.JsonOutput

class KeyworkerStatsResponse {
    static def statsForStaff = [
        caseNoteEntryCount: 10,
        caseNoteSessionCount: 10,
        complianceRate: 0,
        projectedKeyworkerSessions: 0
    ]

    static statsForStaffResponse = JsonOutput.toJson(statsForStaff)
}
