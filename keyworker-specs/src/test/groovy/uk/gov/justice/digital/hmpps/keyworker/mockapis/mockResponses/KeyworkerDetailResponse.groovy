package uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses


class KeyworkerDetailResponse {

    static response_keyworker = '''
{
    "staffId": -3,
    "firstName": "HPA",
    "lastName": "AUser",
    "capacity": 6,
    "numberAllocated": 4,
    "scheduleType": "Full Time",
    "agencyId": "LEI",
    "agencyDescription": "LEEDS",
    "status": "ACTIVE",
    "autoAllocationAllowed": true
}
'''

static response_keyworker_inactive = '''
{
    "staffId": -3,
    "firstName": "HPA",
    "lastName": "AUser",
    "capacity": 6,
    "numberAllocated": 4,
    "scheduleType": "Full Time",
    "agencyId": "LEI",
    "agencyDescription": "LEEDS",
    "status": "INACTIVE",
    "autoAllocationAllowed": true
}
'''
}
