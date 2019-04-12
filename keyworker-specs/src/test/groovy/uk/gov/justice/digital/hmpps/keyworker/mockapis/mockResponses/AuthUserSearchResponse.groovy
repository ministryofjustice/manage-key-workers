package uk.gov.justice.digital.hmpps.keyworker.mockapis.mockResponses


class AuthUserSearchResponse {

    static usernameResponse = """
        {"username": "AUTH_ADM", "email": "auth_test2@digital.justice.gov.uk", "enabled": true, "locked": false, "firstName": "Auth", "lastName": "Adm"}
"""

    static emailResponse = """[
        {"username": "AUTH_ADM", "email": "auth_test2@digital.justice.gov.uk", "enabled": true, "locked": false, "firstName": "Auth", "lastName": "Adm"},
        {"username": "AUTH_EXPIRED", "email": "auth_test2@digital.justice.gov.uk", "enabled": true, "locked": false, "firstName": "Auth", "lastName": "Expired"}
]"""


    static rolesResponse = """[
        {"roleCode": "GLOBAL_SEARCH", "roleName": "Global Search"},
        {"roleCode": "LICENCE_RO", "roleName": "Licence Responsible Officer"}
]"""


}
