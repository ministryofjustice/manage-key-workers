package uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses


class AvailableKeyworkerResponse {

    static response = '''
[
    {
      "staffId": -3,
      "firstName": "HPA",
      "lastName": "AUser",
      "capacity": 6,
      "numberAllocated": 4,
      "agencyId": "LEI",
      "status": "ACTIVE",
      "autoAllocationAllowed": true,
      "numKeyWorkerSessions": 3
    },
    {
      "staffId": -4,
      "firstName": "Test",
      "lastName": "TUser",
      "capacity": 6,
      "numberAllocated": 5,
      "agencyId": "LEI",
      "status": "ACTIVE",
      "autoAllocationAllowed": true,
      "numKeyWorkerSessions": 6
    },
    {
      "staffId": -5,
      "firstName": "Another",
      "lastName": "CUser",
      "capacity": 6,
      "numberAllocated": 6,
      "agencyId": "LEI",
      "status": "ACTIVE",
      "autoAllocationAllowed": true,
      "numKeyWorkerSessions": 2
    },
    {
      "staffId": -2,
      "firstName": "API",
      "lastName": "DUser",
      "capacity": 6,
      "numberAllocated": 9,
      "agencyId": "LEI",
      "status": "ACTIVE",
      "autoAllocationAllowed": true,
      "numKeyWorkerSessions": 2
    }
  ]
'''

    static insufficientResponse = '''
[
    {
      "staffId": -3,
      "firstName": "Sole",
      "lastName": "Keyworker",
      "capacity": 2,
      "numberAllocated": 1,
      "agencyId": "LEI",
      "status": "ACTIVE",
      "autoAllocationAllowed": true,
      "numKeyWorkerSessions": 5
    }
]'''
}
