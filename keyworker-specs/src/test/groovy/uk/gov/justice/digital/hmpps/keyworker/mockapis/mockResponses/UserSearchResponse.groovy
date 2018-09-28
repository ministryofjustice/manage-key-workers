package uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses


class UserSearchResponse {

    static response = '''
[
    {
        "staffId": 485576,
        "username": "KBECK",
        "firstName": "KAREN",
        "lastName": "BECK",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485577,
        "username": "ADEY",
        "firstName": "ABS",
        "lastName": "DEY",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485636,
        "username": "JDUCKETT_GEN",
        "firstName": "JENNY",
        "lastName": "DUCKETT",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485638,
        "username": "CHANES",
        "firstName": "CHRIS",
        "lastName": "HANES",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 70029,
        "username": "HQA63K",
        "firstName": "MARTHA",
        "lastName": "HUNSTON",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485573,
        "username": "AKNIGHT_GEN",
        "firstName": "ANDREW",
        "lastName": "KNIGHT",
        "lockedFlag": false,
        "expiredFlag": false
    }
]
'''


    static pagedResponse(int page) {
        return """
[
    {
        "staffId": 485576,
        "username": "user${page}",
        "firstName": "KAREN",
        "lastName": "BECK",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485577,
        "username": "ADEY",
        "firstName": "ABS",
        "lastName": "DEY",
        "lockedFlag": false,
        "expiredFlag": false
    },
    {
        "staffId": 485636,
        "username": "JDUCKETT_GEN",
        "firstName": "JENNY",
        "lastName": "DUCKETT",
        "lockedFlag": false,
        "expiredFlag": false
    }
]
"""
    }
}
