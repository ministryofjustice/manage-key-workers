package uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses

class KeyworkerPrisonStatsResponse {
    static def response = '''
    { 
      "summary": {
        "requestedFromDate": "2018-10-12",
        "requestedToDate": "2018-11-12",
        "current": { 
          "dataRangeFrom": "2018-10-28",
          "dataRangeTo": "2018-11-11",
          "numPrisonersAssignedKeyWorker": 600,
          "totalNumPrisoners": 600,
          "numberKeyWorkerSessions": 2400,
          "numberKeyWorkerEntries": 400,
          "numberOfActiveKeyworkers": 100,
          "percentagePrisonersWithKeyworker": 100,
          "numProjectedKeyworkerSessions": 2400,
          "complianceRate": 100
        }
      }
    }
 '''
}
